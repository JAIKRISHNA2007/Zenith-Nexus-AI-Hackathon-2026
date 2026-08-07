import { Bot } from "lucide-react";

const TypingIndicator = () => {
  return (
    <div className="mb-6 flex justify-start">
      <div className="flex max-w-md gap-3">
        {/* Avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white">
          <Bot size={20} />
        </div>

        {/* Bubble */}
        <div>
          <div className="mb-2 text-sm font-semibold">
            AI Assistant
          </div>

          <div className="rounded-2xl border bg-white px-5 py-4 shadow-sm">
            <div className="flex gap-2">
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500"></span>
              <span
                className="h-2 w-2 animate-bounce rounded-full bg-slate-500"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="h-2 w-2 animate-bounce rounded-full bg-slate-500"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Thinking...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;