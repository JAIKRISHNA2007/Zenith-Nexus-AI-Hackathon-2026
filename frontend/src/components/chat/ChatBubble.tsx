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
  return (
    <div
      className={`mb-5 flex ${
        sender === "user"
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-xl rounded-2xl px-5 py-3 ${
          sender === "user"
            ? "bg-blue-600 text-white"
            : "bg-white border"
        }`}
      >
        <p>{message}</p>

        <p className="mt-2 text-xs opacity-70">
          {timestamp}
        </p>
      </div>
    </div>
  );
};

export default ChatBubble;