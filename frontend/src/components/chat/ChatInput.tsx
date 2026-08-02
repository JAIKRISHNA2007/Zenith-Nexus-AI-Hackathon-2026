import { useState } from "react";
import { Send } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

const ChatInput = () => {
  const [text, setText] = useState("");

  const { addMessage } = useChatStore();

  const sendMessage = () => {
    if (!text.trim()) return;

    addMessage({
      id: Date.now().toString(),
      sender: "user",
      message: text,
      timestamp: new Date().toLocaleTimeString(),
    });

    setText("");
  };

  return (
    <div className="flex gap-3 border-t bg-white p-4">

      <input
        className="flex-1 rounded-xl border px-4 py-3"
        placeholder="Ask anything about your database..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
}}
      />

      <button
        onClick={sendMessage}
        className="rounded-xl bg-blue-600 px-5 text-white"
      >
        <Send size={20} />
      </button>

    </div>
  );
};

export default ChatInput;