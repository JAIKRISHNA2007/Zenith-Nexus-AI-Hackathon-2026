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
    typing,
    setTyping,
    setVisualizationLoading,
  } = useChatStore();

  const sendMessage = () => {
    if (!text.trim()) return;

    const userMessage = text;

    addMessage({
      id: Date.now().toString(),
      sender: "user",
      message: userMessage,
      timestamp: new Date().toLocaleTimeString(),
    });

    setText("");

    // Show typing animation
    setTyping(true);

    // Show visualization skeleton
    setVisualizationLoading(true);

    setTimeout(() => {
      addMessage({
        id: (Date.now() + 1).toString(),
        sender: "ai",
        message:
          "This is a placeholder AI response. It will be replaced by the FastAPI + Gemini backend.",
        timestamp: new Date().toLocaleTimeString(),
      });
      setVisualizationLoading(true);
      setTyping(false);

      setVisualizationLoading(false);

    }, 1500);
  };

  return (
    <div className="border-t bg-white p-5">

      <div className="flex items-center gap-3 rounded-2xl border bg-slate-50 px-4 py-3 shadow-sm">

        {/* Attachment */}

        <button className="text-slate-500 transition hover:text-blue-600">
          <Paperclip size={20} />
        </button>

        {/* Input */}

        <input
          value={text}
          disabled={typing}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder={
            typing
              ? "AI is generating a response..."
              : "Ask anything... e.g. 'Show me top 5 products by revenue'"
          }
          className="flex-1 bg-transparent outline-none"
        />

        {/* Emoji */}

        <button className="text-slate-500 transition hover:text-yellow-500">
          <Smile size={20} />
        </button>

        {/* Voice */}

        <button className="text-slate-500 transition hover:text-green-600">
          <Mic size={20} />
        </button>

        {/* Send */}

        <button
          onClick={sendMessage}
          disabled={!text.trim() || typing}
          className="rounded-xl bg-blue-600 p-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Send size={20} />
        </button>

      </div>

    </div>
  );
};

export default ChatInput;