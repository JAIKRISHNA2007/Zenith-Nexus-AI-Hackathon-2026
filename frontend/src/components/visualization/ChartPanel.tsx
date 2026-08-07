import { BarChart3, Download, Expand } from "lucide-react";

import InsightCard from "./InsightCard";
import InsightSkeleton from "../dashboard/InsightSkeleton";
import VisualizationSkeleton from "../dashboard/VisualizationSkeleton";

import { useChatStore } from "../../store/chatStore";

type ChartRow = Record<string, unknown>;

const toText = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
};

const buildChartData = (chart: any) => {
  const rows: ChartRow[] = Array.isArray(chart?.data) ? chart.data : [];

  if (rows.length === 0) {
    return { rows: [], labelKey: null as string | null, valueKey: null as string | null };
  }

  const firstRow = rows[0];
  const keys = Object.keys(firstRow);
  const preferredLabelKey = chart?.x_axis ?? chart?.xAxis ?? null;
  const preferredValueKey = chart?.y_axis ?? chart?.yAxis ?? null;

  const valueKey =
    (preferredValueKey && keys.includes(preferredValueKey) ? preferredValueKey : null) ||
    keys.find((key) => Number.isFinite(Number(firstRow[key]))) ||
    keys[keys.length - 1] ||
    null;

  const labelKey =
    (preferredLabelKey && keys.includes(preferredLabelKey) ? preferredLabelKey : null) ||
    keys.find((key) => key !== valueKey) ||
    null;

  return { rows, labelKey, valueKey };
};

const BarChartPreview = ({ chart }: { chart: any }) => {
  const { rows, labelKey, valueKey } = buildChartData(chart);

  if (!labelKey || !valueKey || rows.length === 0) {
    return null;
  }

  const chartData = rows.map((row, index) => ({
    label: toText(row[labelKey]) || `Item ${index + 1}`,
    value: Number(row[valueKey]) || 0,
  }));

  const maxValue = Math.max(...chartData.map((item) => item.value), 1);
  const width = 680;
  const height = 340;
  const padding = { top: 24, right: 24, bottom: 70, left: 58 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const barGap = 18;
  const barWidth = Math.max(
    (innerWidth - barGap * (chartData.length - 1)) / chartData.length,
    28
  );

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {String(chart?.chart_type ?? chart?.chartType ?? "bar chart")}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900">
          {String(chart?.title ?? "Visualization")}
        </h3>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full overflow-visible">
        <defs>
          <linearGradient id="barFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>

        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#cbd5e1" strokeWidth="1.5" />
        <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#cbd5e1" strokeWidth="1.5" />

        {Array.from({ length: 5 }).map((_, index) => {
          const y = padding.top + (innerHeight / 4) * index;
          const label = Math.round(maxValue - (maxValue / 4) * index);

          return (
            <g key={index}>
              <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#e2e8f0" strokeWidth="1" />
              <text x={padding.left - 10} y={y + 4} textAnchor="end" className="fill-slate-400 text-[11px]">
                {label}
              </text>
            </g>
          );
        })}

        {chartData.map((item, index) => {
          const barHeight = maxValue === 0 ? 0 : (item.value / maxValue) * innerHeight;
          const x = padding.left + index * (barWidth + barGap);
          const y = padding.top + (innerHeight - barHeight);

          return (
            <g key={`${item.label}-${index}`}>
              <rect x={x} y={y} width={barWidth} height={barHeight} rx="10" fill="url(#barFill)" />
              <text
                x={x + barWidth / 2}
                y={Math.max(y - 8, 18)}
                textAnchor="middle"
                className="fill-slate-700 text-[11px] font-semibold"
              >
                {item.value}
              </text>
              <text
                x={x + barWidth / 2}
                y={height - 22}
                textAnchor="middle"
                className="fill-slate-600 text-[11px]"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <span>
          <strong>Category:</strong> {String(labelKey)}
        </span>
        <span>
          <strong>Value:</strong> {String(valueKey)}
        </span>
      </div>
    </div>
  );
};

const ChartPanel = () => {
  const { visualizationLoading, latestVisualization } = useChatStore();
  const chart = latestVisualization?.chart as any;
  const chartType = String(chart?.chart_type ?? chart?.chartType ?? "").toLowerCase();
  const isBarChart = chartType.includes("bar");

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
  };

  return (
    <aside id="visualization-panel" className="flex w-96 flex-col border-l bg-slate-50">
      <div className="flex items-center justify-between border-b bg-white px-5 py-4">
        <div className="flex items-center gap-2">
          <BarChart3 size={22} className="text-blue-600" />
          <h2 className="font-bold">Visualization</h2>
        </div>

        <div className="flex gap-2">
          <button className="rounded-lg p-2 hover:bg-slate-100" title="Expand Visualization">
            <Expand size={18} />
          </button>

          <button
            onClick={handleDownload}
            className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
            title="Download Visualization (PNG)"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-5">
        {visualizationLoading ? (
          <VisualizationSkeleton />
        ) : chart && isBarChart ? (
          <BarChartPreview chart={chart} />
        ) : latestVisualization?.flowchart ? (
          <div className="space-y-4 rounded-xl border bg-white p-4 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {latestVisualization.flowchart.diagram_type}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">Flowchart</h3>
            </div>

            <pre className="whitespace-pre-wrap rounded-lg bg-slate-950 p-4 text-xs leading-6 text-slate-100">
              {latestVisualization.flowchart.content}
            </pre>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border-2 border-dashed bg-white">
            <div className="text-center">
              <BarChart3 size={55} className="mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold">No Visualization</h3>
              <p className="mt-2 text-sm text-slate-500">
                Ask the AI to generate charts, graphs or diagrams.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-5">
        {visualizationLoading ? <InsightSkeleton /> : <InsightCard />}
      </div>
    </aside>
  );
};

export default ChartPanel;