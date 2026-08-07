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

  const { typing, sendChatMessage } = useChatStore();

  const handleSend = async () => {
    if (!text.trim() || typing) return;
    const promptText = text;
    setText("");
    await sendChatMessage(promptText);
  };

  return (
    <div className="border-t bg-white p-3 md:p-5">
      <div
        className="
          flex
          items-center
          gap-2
          md:gap-3
          rounded-2xl
          border
          bg-slate-50
          px-3
          md:px-4
          py-3
          shadow-sm
        "
      >
        {/* Attachment */}
        <button
          className="text-slate-500 transition hover:text-blue-600"
          disabled={typing}
        >
          <Paperclip size={20} />
        </button>

        {/* Input */}
        <input
          value={text}
          disabled={typing}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          placeholder={
            typing
              ? "AI is generating a response..."
              : "Ask your business question..."
          }
          className="
            flex-1
            bg-transparent
            text-sm
            md:text-base
            outline-none
          "
        />

        {/* Emoji */}
        <button
          className="text-slate-500 transition hover:text-yellow-500"
          disabled={typing}
        >
          <Smile size={20} />
        </button>

        {/* Voice */}
        <button
          className="text-slate-500 transition hover:text-green-600"
          disabled={typing}
        >
          <Mic size={20} />
        </button>

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={!text.trim() || typing}
          className="
            rounded-xl
            bg-blue-600
            p-3
            text-white
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:bg-slate-300
          "
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;