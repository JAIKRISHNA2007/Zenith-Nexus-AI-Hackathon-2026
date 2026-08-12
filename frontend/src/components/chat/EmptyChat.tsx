import {
  Bot,
  BarChart3,
  TrendingUp,
  Users,
  Database,
} from "lucide-react";

const EmptyChat = () => {
  const examples = [
    {
      icon: <BarChart3 size={18} />,
      text: "Show me the top 5 products by revenue.",
    },
    {
      icon: <TrendingUp size={18} />,
      text: "Show me the monthly revenue trend over the last year.",
    },
    {
      icon: <Database size={18} />,
      text: "Which product category generates the most revenue?",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">

      <div className="mb-6 rounded-full bg-blue-100 p-5">
        <Bot
          size={20}
          className="text-blue-600"
        />
      </div>

      <h2 className="text-3xl font-bold text-slate-800">
        Welcome to Zenith Nexus AI
      </h2>

      <p className="mt-3 max-w-lg text-slate-500">
        Ask questions about your business data using
        natural language. AI will generate insights,
        SQL queries and visualizations.
      </p>

      <div className="mt-10 grid w-full max-w-xl gap-4">

        {examples.map((item, index) => (
          <button
            key={index}
            className="flex items-center gap-3 rounded-xl border bg-white p-4 transition-all duration-300 hover:border-blue-500 hover:shadow-md"
          >
            <div className="text-blue-600">
              {item.icon}
            </div>

            <span>{item.text}</span>

          </button>
        ))}

      </div>

    </div>
  );
};

export default EmptyChat;