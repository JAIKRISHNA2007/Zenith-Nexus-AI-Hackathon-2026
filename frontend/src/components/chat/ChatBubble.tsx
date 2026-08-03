import { Bot, User } from "lucide-react";

interface ChatBubbleProps {
  sender: "user" | "ai";
  message: string;
  timestamp: string;
}

const ChatBubble = ({
  sender,
  message,
  timestamp,
}: ChatBubbleProps) => {
  const isUser = sender === "user";

  return (
    <div
      className={`mb-6 flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-3xl gap-3 ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            isUser
              ? "bg-blue-600 text-white"
              : "bg-slate-800 text-white"
          }`}
        >
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>

        {/* Message */}
        <div>
          <div
            className={`mb-2 flex items-center gap-2 ${
              isUser ? "justify-end" : ""
            }`}
          >
            <span className="text-sm font-semibold">
              {isUser ? "You" : "AI Assistant"}
            </span>

            <span className="text-xs text-slate-500">
              {timestamp}
            </span>
          </div>

          <div
            className={`rounded-2xl px-5 py-4 shadow-sm transition-all duration-300 hover:shadow-lg ${
              isUser
                ? "bg-blue-600 text-white"
                : "border bg-white"
            }`}
          >
            <p className="whitespace-pre-wrap leading-7">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;