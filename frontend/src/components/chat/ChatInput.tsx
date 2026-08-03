import { useState } from "react";
import {
  Send,
  Paperclip,
  Mic,
  Smile,
} from "lucide-react";

import { useChatStore } from "../../store/chatStore";

const ChatInput = () => {
  const [text, setText] = useState("");

  const {
    addMessage,
    setTyping,
  } = useChatStore();

  const sendMessage = () => {
    if (!text.trim()) return;

    const userMessage = text;

    // Add user message
    addMessage({
      id: Date.now().toString(),
      sender: "user",
      message: userMessage,
      timestamp: new Date().toLocaleTimeString(),
    });

    // Clear input
    setText("");

    // Show typing indicator
    setTyping(true);

    // Simulate AI response
    setTimeout(() => {
      addMessage({
        id: (Date.now() + 1).toString(),
        sender: "ai",
        message:
          "This is a placeholder AI response. It will be replaced by the FastAPI + Gemini backend.",
        timestamp: new Date().toLocaleTimeString(),
      });

      setTyping(false);
    }, 1500);
  };

  return (
    <div className="border-t bg-white p-5">
      <div className="flex items-center gap-3 rounded-2xl border bg-slate-50 px-4 py-3 shadow-sm">

        {/* Attachment Button */}
        <button className="text-slate-500 transition hover:text-blue-600">
          <Paperclip size={20} />
        </button>

        {/* Chat Input */}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Ask anything... e.g. 'Show me top 5 products by revenue'"
          className="flex-1 bg-transparent outline-none"
        />

        {/* Emoji Button */}
        <button className="text-slate-500 transition hover:text-yellow-500">
          <Smile size={20} />
        </button>

        {/* Voice Button */}
        <button className="text-slate-500 transition hover:text-green-600">
          <Mic size={20} />
        </button>

        {/* Send Button */}
        <button
          onClick={sendMessage}
          disabled={!text.trim()}
          className="rounded-xl bg-blue-600 p-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Send size={20} />
        </button>

      </div>
    </div>
  );
};

export default ChatInput;