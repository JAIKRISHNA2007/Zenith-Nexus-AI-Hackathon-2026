import { useState } from "react";
import { Bot, User, Code, Copy, Check } from "lucide-react";

interface ChatBubbleProps {
  sender: "user" | "ai";
  message: string;
  timestamp: string;
}

const ChatBubble = ({ sender, message, timestamp }: ChatBubbleProps) => {
  const isUser = sender === "user";
  const [showSql, setShowSql] = useState(false);
  const [copied, setCopied] = useState(false);

  // Guard against null/undefined message
  const safeMessage = message ?? "";

  // Detect SQL transparency block: only look for "SQL Generated:" marker
  // (avoid false positives from messages that contain SQL keywords in natural text)
  const hasSql = !isUser && safeMessage.includes("SQL Generated:");

  let mainText = safeMessage;
  let sqlSnippet = "";

  if (hasSql) {
    const parts = safeMessage.split("SQL Generated:");
    mainText = parts[0].trim();
    sqlSnippet = parts.slice(1).join("SQL Generated:").trim();
  } else if (!isUser && safeMessage.includes("```sql")) {
    // Handle markdown code block style SQL in AI messages
    const match = safeMessage.match(/```sql([\s\S]*?)```/);
    if (match) {
      sqlSnippet = match[1].trim();
      mainText = safeMessage.replace(/```sql[\s\S]*?```/, "").trim();
    }
  }

  const handleCopy = () => {
    const textToCopy = sqlSnippet || safeMessage;
    navigator.clipboard.writeText(textToCopy).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!safeMessage) return null;

  return (
    <div className={`mb-6 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-3xl gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            isUser ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-slate-800 text-white shadow-md"
          }`}
        >
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className={`mb-1.5 flex items-center gap-2 ${isUser ? "justify-end" : ""}`}>
            <span className="text-xs font-semibold text-slate-700">{isUser ? "You" : "Zenith Nexus BI AI"}</span>
            <span className="text-[11px] text-slate-400">{timestamp}</span>
          </div>

          <div
            className={`rounded-2xl px-5 py-4 shadow-sm transition-all duration-300 ${
              isUser ? "bg-blue-600 text-white shadow-blue-500/10" : "border border-slate-200 bg-white text-slate-800"
            }`}
          >
            {mainText && <p className="whitespace-pre-wrap text-sm leading-6 break-words">{mainText}</p>}

            {/* SQL Transparency Component */}
            {sqlSnippet && (
              <div className="mt-3 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowSql(!showSql)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <Code size={14} />
                    {showSql ? "Hide SQL Query" : "View SQL Query (SQL Transparency)"}
                  </button>

                  {showSql && (
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-700"
                    >
                      {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                      {copied ? "Copied" : "Copy SQL"}
                    </button>
                  )}
                </div>

                {showSql && (
                  <pre className="mt-2.5 overflow-x-auto rounded-xl bg-slate-900 p-3.5 text-xs font-mono text-emerald-400 border border-slate-800 leading-5">
                    {sqlSnippet}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;