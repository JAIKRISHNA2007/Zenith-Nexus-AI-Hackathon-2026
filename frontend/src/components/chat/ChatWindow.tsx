import { useEffect, useRef } from "react";

import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import EmptyChat from "./EmptyChat";
import TypingIndicator from "./TypingIndicator";

import { useChatStore } from "../../store/chatStore";

const ChatWindow = () => {
  const { messages, typing } = useChatStore();

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typing]);

  return (
    <div className="flex h-full flex-col">
      {/* Chat Area */}
      <div className="relative flex-1 overflow-y-auto bg-slate-100 px-8 py-6">

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
          {messages.map((message) => (
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