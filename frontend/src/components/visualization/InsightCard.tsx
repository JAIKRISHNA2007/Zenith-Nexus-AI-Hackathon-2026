import { Lightbulb } from "lucide-react";

const InsightCard = () => {
  return (
    <div className="rounded-xl bg-white border p-5">

      <div className="mb-3 flex items-center gap-2">

        <Lightbulb
          size={20}
          className="text-yellow-500"
        />

        <h3 className="font-semibold">

          AI Insights

        </h3>

      </div>

      <p className="text-sm leading-6 text-slate-500">

        Business insights generated from
        AI analysis will appear here after
        executing a query.

      </p>

    </div>
  );
};

export default InsightCard;