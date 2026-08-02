import { Send } from "lucide-react";

const ChatInput = () => {
  return (
    <div className="border-t bg-white p-4 flex gap-3">

      <input
        type="text"
        placeholder="Ask anything about your database..."
        className="flex-1 rounded-xl border px-4 py-3 outline-none"
      />

      <button
        className="rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700"
      >
        <Send size={20} />
      </button>

    </div>
  );
};

export default ChatInput;