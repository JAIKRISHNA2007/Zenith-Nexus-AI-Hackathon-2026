import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";

const ChatWindow = () => {
  return (
    <div className="flex h-full flex-col">

      <div className="flex-1 overflow-y-auto p-6 bg-slate-100">

        <ChatBubble
          sender="ai"
          message="Hello! I'm your AI Database Assistant."
        />

        <ChatBubble
          sender="user"
          message="Show me top 5 products by revenue."
        />

        <ChatBubble
          sender="ai"
          message="Sure! I will query the database and generate a visualization."
        />

      </div>

      <ChatInput />

    </div>
  );
};

export default ChatWindow;