import InsightSkeleton from "../dashboard/InsightSkeleton";
import {
  Download,
  Expand,
  BarChart3,
} from "lucide-react";

import InsightCard from "./InsightCard";
import VisualizationSkeleton from "../dashboard/VisualizationSkeleton";

import { useChatStore } from "../../store/chatStore";

const ChartPanel = () => {
  const { visualizationLoading } = useChatStore();

  return (
    <aside className="flex w-96 flex-col border-l bg-slate-50">

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

      {/* Visualization Area */}

      <div className="flex-1 p-5">

        {visualizationLoading ? (
          <VisualizationSkeleton />
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border-2 border-dashed bg-white">

            <div className="text-center">

              <BarChart3
                size={55}
                className="mx-auto mb-4 text-slate-300"
              />

              <h3 className="text-lg font-semibold">
                No Visualization
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Ask the AI to generate charts,
                graphs or diagrams.
              </p>

            </div>

          </div>
        )}

      </div>

      {/* Insight Card */}

      <div className="border-t p-5">
  {visualizationLoading ? (
    <InsightSkeleton />
  ) : (
    <InsightCard />
  )}
</div>

    </aside>
  );
};

export default ChartPanel;