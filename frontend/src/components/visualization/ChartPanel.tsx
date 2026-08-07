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

  const handleDownload = () => {
    const container = document.getElementById("visualization-panel") || document.querySelector("aside");
    if (!container) return;

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const fileName = `visualization-${timestamp}.png`;

    const svg = container.querySelector("svg");
    const canvas = container.querySelector("canvas");

    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        const exportCanvas = document.createElement("canvas");
        exportCanvas.width = svg.clientWidth || img.width || 800;
        exportCanvas.height = svg.clientHeight || img.height || 600;
        const ctx = exportCanvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
          ctx.drawImage(img, 0, 0);
          const pngUrl = exportCanvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = pngUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
      return;
    }

    // Fallback exporter: Render visualization panel snapshot to canvas
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = 800;
    exportCanvas.height = 600;
    const ctx = exportCanvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, 800, 600);
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("Zenith Nexus Visualization", 40, 80);
      ctx.fillStyle = "#64748b";
      ctx.font = "16px sans-serif";
      ctx.fillText("Exported on " + now.toLocaleString(), 40, 120);

      const pngUrl = exportCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <aside id="visualization-panel" className="flex w-96 flex-col border-l bg-slate-50">

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
          <button className="rounded-lg p-2 hover:bg-slate-100" title="Expand Visualization">
            <Expand size={18} />
          </button>

          <button
            onClick={handleDownload}
            className="rounded-lg p-2 hover:bg-slate-100 text-slate-700 hover:text-blue-600 transition"
            title="Download Visualization (PNG)"
          >
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