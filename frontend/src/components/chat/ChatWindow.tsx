import { useEffect, useRef } from "react";

import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import EmptyChat from "./EmptyChat";
import TypingIndicator from "./TypingIndicator";

import { useChatStore } from "../../store/chatStore";

const ChatWindow = () => {
  const { messages, typing } = useChatStore();

  // Reference to the bottom of the chat
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll whenever messages or typing state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typing]);

  return (
    <div className="flex h-full flex-col">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin bg-slate-100 px-8 py-6">
        {messages.length === 0 ? (
          <EmptyChat />
        ) : (
          <>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                sender={message.sender}
                message={message.message}
                timestamp={message.timestamp}
              />
            ))}

            {/* AI Typing Animation */}
            {typing && <TypingIndicator />}

            {/* Auto Scroll Target */}
            <div ref={bottomRef}></div>
          </>
        )}
      </div>

      {/* Chat Input */}
      <ChatInput />
    </div>
  );
};

export default ChatWindow;