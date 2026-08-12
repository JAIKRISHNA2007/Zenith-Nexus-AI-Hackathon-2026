import { useEffect, useRef } from "react";

import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import EmptyChat from "./EmptyChat";
import TypingIndicator from "./TypingIndicator";

import { useChatStore } from "../../store/chatStore";

const ChatWindow = () => {
  const { messages, typing, searchQuery } = useChatStore();

  const bottomRef = useRef<HTMLDivElement>(null);

  const isToolCall = (msgText: string) => {
    if (!msgText) return false;
    try {
      const parsed = JSON.parse(msgText);
      if (parsed && typeof parsed === "object") {
        if (parsed.name && (parsed.parameters || parsed.kwargs || parsed.arguments)) return true;
        if (parsed.type === "tool_call" || parsed.tool_call_id) return true;
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name) return true;
      }
    } catch (e) {
      // Simple string matching fallback if JSON is truncated
      if (msgText.includes('{"name":') && (msgText.includes('"parameters":') || msgText.includes('"kwargs":'))) {
        return true;
      }
    }
    return false;
  };

  const visibleMessages = messages.filter((m) => m.sender === "user" || !isToolCall(m.message));

  const filteredMessages = searchQuery.trim()
    ? visibleMessages.filter((m) => m.message.toLowerCase().includes(searchQuery.toLowerCase()))
    : visibleMessages;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typing]);

  return (
    <div className="flex h-full flex-col">
      {/* Chat Area */}
      <div className="relative flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-900 px-8 py-6">

        {/* Empty State */}
        <div
          className={`transition-all duration-500 ${
            messages.length === 0
              ? "opacity-100"
              : "pointer-events-none absolute inset-0 opacity-0"
          }`}
        >
          <EmptyChat />
        </div>

        {/* Conversation */}
        <div
          className={`transition-all duration-500 ${
            messages.length > 0
              ? "opacity-100"
              : "pointer-events-none absolute inset-0 opacity-0"
          }`}
        >
          {filteredMessages.map((message) => (
            <ChatBubble
              key={message.id}
              sender={message.sender}
              message={message.message}
              timestamp={message.timestamp}
            />
          ))}

          {typing && <TypingIndicator />}

          <div ref={bottomRef}></div>
        </div>
      </div>

      {/* Input */}
      <ChatInput />
    </div>
  );
};

export default ChatWindow;