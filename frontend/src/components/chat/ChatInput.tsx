import { useState, useRef } from "react";
import { Send, Paperclip, Mic, MicOff, Smile } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

interface Props {
  onOpenDatabaseModal?: () => void;
}

const ChatInput = ({ onOpenDatabaseModal }: Props) => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { typing, sendChatMessage, uploadDatasetFile } = useChatStore();

  const handleSend = async () => {
    if (!text.trim() || typing) return;
    const promptText = text;
    setText("");
    await sendChatMessage(promptText);
  };

  const handleAttachmentClick = () => {
    if (onOpenDatabaseModal) {
      onOpenDatabaseModal();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadDatasetFile(file);
    }
  };

  const toggleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const EMOJIS = ["📊", "📈", "🛍️", "💡", "💰", "📦", "👥", "🔍", "⚡", "🚀", "📋", "❓"];

  const addEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="relative border-t bg-white dark:bg-slate-900 p-3 md:p-5">
      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 right-16 z-30 flex flex-wrap gap-2 w-56 p-3 bg-white dark:bg-slate-800 rounded-2xl border shadow-xl animate-in fade-in zoom-in-95">
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => addEmoji(e)}
              className="text-lg hover:scale-125 transition transform p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              {e}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 md:gap-3 rounded-2xl border bg-slate-50 dark:bg-slate-800 px-3 md:px-4 py-3 shadow-sm">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Attachment */}
        <button
          onClick={handleAttachmentClick}
          className="text-slate-500 transition hover:text-blue-600"
          disabled={typing}
          title="Upload Dataset / Database Connection"
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
              : isListening
              ? "Listening... Speak your query"
              : "Ask your business question (e.g. 'Show top 5 products by revenue')..."
          }
          className="flex-1 bg-transparent text-sm md:text-base outline-none dark:text-white"
        />

        {/* Emoji Button */}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-slate-500 transition hover:text-amber-500"
          disabled={typing}
          title="Insert Emoji"
        >
          <Smile size={20} />
        </button>

        {/* Voice Input */}
        <button
          onClick={toggleVoice}
          className={`transition ${isListening ? "text-red-600 animate-pulse" : "text-slate-500 hover:text-green-600"}`}
          disabled={typing}
          title={isListening ? "Stop Voice Input" : "Start Voice Input"}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        {/* Send */}
        <button
          onClick={handleSend}
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