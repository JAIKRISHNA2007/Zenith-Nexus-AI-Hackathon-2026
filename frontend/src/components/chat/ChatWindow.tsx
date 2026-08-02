import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { useChatStore } from "../../store/chatStore";

const ChatWindow = () => {
  const { messages } = useChatStore();

  return (
    <div className="flex h-full flex-col">

      <div className="flex-1 overflow-y-auto bg-slate-100 p-6">

        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            sender={message.sender}
            message={message.message}
            timestamp={message.timestamp}
          />
        ))}

      </div>

      <ChatInput />

    </div>
  );
};

export default ChatWindow;