import {
  Download,
  Expand,
  BarChart3,
} from "lucide-react";

import InsightCard from "./InsightCard";

const ChartPanel = () => {
  return (
    <aside className="w-96 border-l bg-slate-50 flex flex-col">

      {/* Header */}

      <div className="flex items-center justify-between border-b bg-white px-5 py-4">

        <div className="flex items-center gap-2">

          <BarChart3
            size={22}
            className="text-blue-600"
          />

          <h2 className="font-bold">
            Visualization
          </h2>

        </div>

        <div className="flex gap-2">

          <button className="rounded-lg p-2 hover:bg-slate-100">

            <Expand size={18} />

          </button>

          <button className="rounded-lg p-2 hover:bg-slate-100">

            <Download size={18} />

          </button>

        </div>

      </div>

      {/* Chart Area */}

      <div className="flex-1 p-5">

        <div className="flex h-80 items-center justify-center rounded-xl border-2 border-dashed bg-white">

          <div className="text-center">

            <BarChart3
              size={55}
              className="mx-auto mb-4 text-slate-300"
            />

            <h3 className="text-lg font-semibold">

              No Visualization

            </h3>

            <p className="mt-2 text-sm text-slate-500">

              Ask Zenith Nexus AI to generate charts, dashboards or business visualizations.

            </p>

          </div>

        </div>

      </div>

      {/* Insights */}

      <div className="border-t p-5">

        <InsightCard />

      </div>

    </aside>
  );
};

export default ChartPanel;