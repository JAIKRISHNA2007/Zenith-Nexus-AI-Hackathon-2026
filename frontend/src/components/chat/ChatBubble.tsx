interface ChatBubbleProps {
  message: string;
  sender: "user" | "ai";
}

const ChatBubble = ({ message, sender }: ChatBubbleProps) => {
  return (
    <div
      className={`flex mb-4 ${
        sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-xl rounded-2xl px-5 py-3 ${
          sender === "user"
            ? "bg-blue-600 text-white"
            : "bg-white border"
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default ChatBubble;