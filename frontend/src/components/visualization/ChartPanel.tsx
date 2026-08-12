import { useState, useEffect, useRef } from "react";
import {
  BarChart3,
  LineChart,
  PieChart as PieChartIcon,
  ScatterChart as ScatterIcon,
  Table as TableIcon,
  Download,
  Expand,
  FileText,
  FileSpreadsheet,
  Layers,
  Minimize2,
  GitFork,
} from "lucide-react";

import VisualizationSkeleton from "../dashboard/VisualizationSkeleton";

import { useChatStore } from "../../store/chatStore";

type ChartRow = Record<string, unknown>;

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

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

  // Find a numeric column for the value (Y) axis
  // Handle both number type and string-encoded numbers
  const isNumeric = (v: unknown) => {
    if (typeof v === "number") return isFinite(v);
    if (typeof v === "string") return v.trim() !== "" && isFinite(Number(v));
    return false;
  };

  const numericKeys = keys.filter((k) => isNumeric(firstRow[k]));
  const nonNumericKeys = keys.filter((k) => !isNumeric(firstRow[k]));

  // Prefer explicitly set y_axis if it's in the keys
  const valueKey: string | null =
    (preferredValueKey && keys.includes(preferredValueKey) ? preferredValueKey : null) ||
    numericKeys[numericKeys.length - 1] ||
    keys[keys.length - 1] ||
    null;

  // Prefer explicitly set x_axis; otherwise pick a non-numeric key that isn't valueKey
  // If labelKey would equal valueKey (only 1 column), we use a synthetic "__index__" sentinel
  const rawLabelKey: string | null =
    (preferredLabelKey && keys.includes(preferredLabelKey) && preferredLabelKey !== valueKey
      ? preferredLabelKey
      : null) ||
    nonNumericKeys.find((k) => k !== valueKey) ||
    keys.find((k) => k !== valueKey) ||
    null;

  // If rawLabelKey === valueKey or null, fall back to first key that isn't valueKey, or __index__
  const fallbackLabelKey = keys.find((k) => k !== valueKey) ?? null;
  const labelKey = (rawLabelKey && rawLabelKey !== valueKey)
    ? rawLabelKey
    : (fallbackLabelKey && fallbackLabelKey !== valueKey)
      ? fallbackLabelKey
      : "__index__";

  return { rows, labelKey, valueKey };
};

/* ---------------- Bar Chart ---------------- */
const BarChartRender = ({ chart }: { chart: any }) => {
  const { rows, labelKey, valueKey } = buildChartData(chart);
  if (!labelKey || !valueKey || rows.length === 0) return <div className="text-center text-sm text-slate-400 py-8">No data available for chart</div>;

  const chartData = rows.map((row, index) => ({
    label: toText(row[labelKey]) || `Item ${index + 1}`,
    value: Number(row[valueKey]) || 0,
  }));

  const maxValue = Math.max(...chartData.map((item) => item.value), 1);
  const width = 640;
  const height = 320;
  const padding = { top: 24, right: 24, bottom: 65, left: 64 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const barGap = Math.max(4, Math.floor(12 / Math.max(chartData.length / 8, 1)));
  const barWidth = Math.max((innerWidth - barGap * (chartData.length - 1)) / chartData.length, 8);

  return (
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
            <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
              {label >= 1000 ? `${(label / 1000).toFixed(0)}k` : label}
            </text>
          </g>
        );
      })}

      {chartData.map((item, index) => {
        const barHeight = maxValue === 0 ? 0 : (item.value / maxValue) * innerHeight;
        const x = padding.left + index * (barWidth + barGap);
        const y = padding.top + (innerHeight - barHeight);
        const color = COLORS[index % COLORS.length];

        return (
          <g key={`${item.label}-${index}`}>
            <rect x={x} y={y} width={barWidth} height={barHeight} rx="4" fill={color} fillOpacity="0.9" />
            {barWidth > 20 && (
              <text x={x + barWidth / 2} y={Math.max(y - 5, 14)} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#475569">
                {item.value >= 1000 ? `${(item.value / 1000).toFixed(1)}k` : item.value}
              </text>
            )}
            {barWidth > 12 && (
              <text
                x={x + barWidth / 2}
                y={height - 10}
                textAnchor="middle"
                fontSize="9"
                fill="#64748b"
                transform={chartData.length > 10 ? `rotate(-30, ${x + barWidth / 2}, ${height - 10})` : undefined}
              >
                {item.label.length > 12 ? item.label.slice(0, 12) + "…" : item.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

/* ---------------- Line Chart ---------------- */
const LineChartRender = ({ chart }: { chart: any }) => {
  const { rows, labelKey, valueKey } = buildChartData(chart);
  if (!labelKey || !valueKey || rows.length === 0) return <div className="text-center text-sm text-slate-400 py-8">No data available for chart</div>;

  const chartData = rows.map((row, index) => ({
    label: labelKey === "__index__" ? `Row ${index + 1}` : (toText(row[labelKey]) || `Item ${index + 1}`),
    value: Number(row[valueKey]) || 0,
  }));

  const maxValue = Math.max(...chartData.map((item) => item.value), 1);
  const width = 640;
  const height = 320;
  const padding = { top: 24, right: 24, bottom: 65, left: 64 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const points = chartData.map((item, index) => {
    const x = padding.left + (innerWidth / Math.max(chartData.length - 1, 1)) * index;
    const y = padding.top + (innerHeight - (item.value / maxValue) * innerHeight);
    return { x, y, label: item.label, value: item.value };
  });

  const pathD = points.reduce((acc, point, idx) => (idx === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`), "");
  const areaD = pathD + ` L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full overflow-visible">
      <defs>
        <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#cbd5e1" strokeWidth="1.5" />

      {Array.from({ length: 5 }).map((_, index) => {
        const y = padding.top + (innerHeight / 4) * index;
        const label = Math.round(maxValue - (maxValue / 4) * index);
        return (
          <g key={index}>
            <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
              {label >= 1000 ? `${(label / 1000).toFixed(0)}k` : label}
            </text>
          </g>
        );
      })}

      <path d={areaD} fill="url(#areaFill)" />
      <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {points.map((pt, idx) => (
        <g key={idx}>
          <circle cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
          <text x={pt.x} y={pt.y - 9} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#475569">
            {pt.value >= 1000 ? `${(pt.value / 1000).toFixed(1)}k` : pt.value}
          </text>
          {chartData.length <= 15 && (
            <text x={pt.x} y={height - 10} textAnchor="middle" fontSize="9" fill="#64748b">
              {pt.label.length > 10 ? pt.label.slice(0, 10) + "…" : pt.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
};

/* ---------------- Pie Chart ---------------- */
const PieChartRender = ({ chart }: { chart: any }) => {
  const { rows, labelKey, valueKey } = buildChartData(chart);
  if (!labelKey || !valueKey || rows.length === 0) return <div className="text-center text-sm text-slate-400 py-8">No data available for chart</div>;

  const chartData = rows.map((row, index) => ({
    label: labelKey === "__index__" ? `Row ${index + 1}` : (toText(row[labelKey]) || `Item ${index + 1}`),
    value: Math.max(Number(row[valueKey]) || 0, 0),
  }));

  const total = chartData.reduce((acc, item) => acc + item.value, 0) || 1;
  const cx = 180;
  const cy = 160;
  const radius = 110;

  let currentAngle = -Math.PI / 2; // Start from top

  const slices = chartData.map((item, idx) => {
    const angle = (item.value / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const largeArc = angle > Math.PI ? 1 : 0;
    const pathD = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    const color = COLORS[idx % COLORS.length];
    const pct = Math.round((item.value / total) * 100);

    return { pathD, color, label: item.label, value: item.value, pct };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg viewBox="0 0 360 320" className="h-64 w-64 shrink-0">
        {slices.map((slice, idx) => (
          <path key={idx} d={slice.pathD} fill={slice.color} stroke="#ffffff" strokeWidth="2" />
        ))}
      </svg>

      <div className="flex-1 space-y-2 overflow-y-auto max-h-52">
        {slices.map((slice, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs border-b pb-1.5">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: slice.color }}></span>
              <span className="font-semibold text-slate-700 truncate max-w-[120px]">{slice.label}</span>
            </div>
            <span className="font-mono text-slate-500 shrink-0 ml-2">{slice.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- Scatter Plot ---------------- */
const ScatterChartRender = ({ chart }: { chart: any }) => {
  const { rows, labelKey, valueKey } = buildChartData(chart);
  if (!labelKey || !valueKey || rows.length === 0) return <div className="text-center text-sm text-slate-400 py-8">No data available for chart</div>;

  const chartData = rows.map((row, index) => ({
    label: labelKey === "__index__" ? `Row ${index + 1}` : (toText(row[labelKey]) || `Item ${index + 1}`),
    xVal: labelKey === "__index__" ? index + 1 : (Number(row[labelKey]) || index + 1),
    yVal: Number(row[valueKey]) || 0,
  }));

  const maxX = Math.max(...chartData.map((item) => item.xVal), 1);
  const maxY = Math.max(...chartData.map((item) => item.yVal), 1);
  const width = 640;
  const height = 320;
  const padding = { top: 24, right: 24, bottom: 50, left: 64 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full overflow-visible">
      <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#cbd5e1" strokeWidth="1.5" />

      {chartData.map((pt, idx) => {
        const cx = padding.left + (pt.xVal / maxX) * innerWidth;
        const cy = padding.top + (innerHeight - (pt.yVal / maxY) * innerHeight);
        return (
          <g key={idx}>
            <circle cx={cx} cy={cy} r="6" fill="#8b5cf6" fillOpacity="0.8" stroke="#ffffff" strokeWidth="1.5" />
            <text x={cx} y={cy - 9} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#64748b">
              {pt.label.length > 8 ? pt.label.slice(0, 8) + "…" : pt.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/* ---------------- Flowchart (Mermaid) Renderer ---------------- */
const FlowchartRender = ({ flowchart }: { flowchart: any }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (!flowchart?.content || !containerRef.current) return;
    setError(null);
    setRendered(false);

    const render = async () => {
      try {
        // Dynamically import mermaid from CDN via a script tag approach
        // We check if mermaid is already on the window
        let mermaid: any = (window as any).mermaid;

        if (!mermaid) {
          await new Promise<void>((resolve, reject) => {
            const existing = document.getElementById("mermaid-cdn");
            if (existing) {
              resolve();
              return;
            }
            const script = document.createElement("script");
            script.id = "mermaid-cdn";
            script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load Mermaid from CDN"));
            document.head.appendChild(script);
          });
          mermaid = (window as any).mermaid;
        }

        if (!mermaid) {
          setError("Mermaid library not available");
          return;
        }

        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
          fontFamily: "Inter, sans-serif",
        });

        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, flowchart.content);

        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          setRendered(true);
        }
      } catch (err: any) {
        console.error("Mermaid render error:", err);
        setError(err?.message || "Failed to render diagram");
      }
    };

    render();
  }, [flowchart?.content]);

  if (!flowchart?.content) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border-2 border-dashed bg-white dark:bg-slate-800 p-8 text-center">
        <div>
          <GitFork size={48} className="mx-auto mb-3 text-slate-300" />
          <h3 className="text-sm font-semibold text-slate-700">No Diagram Generated</h3>
          <p className="mt-1 text-xs text-slate-400">Ask for an ER diagram, process flow, or decision tree</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <GitFork size={16} className="text-purple-500" />
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          {flowchart.diagram_type === "er"
            ? "Entity-Relationship Diagram"
            : flowchart.diagram_type === "decision-tree"
            ? "Decision Tree"
            : "Process Flow Diagram"}
        </span>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-semibold text-red-600 mb-2">Diagram render error: {error}</p>
          <p className="text-xs text-slate-500 mb-2">Mermaid source:</p>
          <pre className="overflow-x-auto rounded bg-slate-900 p-3 text-xs text-emerald-400 leading-5 font-mono">
            {flowchart.content}
          </pre>
        </div>
      ) : (
        <div className="rounded-xl border bg-white dark:bg-slate-800 p-4 overflow-x-auto min-h-[200px] flex items-center justify-center">
          {!rendered && (
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-xs text-slate-400">Rendering diagram…</p>
            </div>
          )}
          <div ref={containerRef} className={`w-full ${rendered ? "" : "hidden"}`} />
        </div>
      )}

      {/* Always show raw Mermaid source as a collapsible */}
      <details className="text-xs">
        <summary className="cursor-pointer text-slate-400 hover:text-slate-600 select-none">View Mermaid source</summary>
        <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-900 p-3 text-xs text-emerald-400 leading-5 font-mono">
          {flowchart.content}
        </pre>
      </details>
    </div>
  );
};

/* ---------------- Main Chart Panel ---------------- */
const ChartPanel = () => {
  const { visualizationLoading, latestVisualization } = useChatStore();
  const [activeTab, setActiveTab] = useState<"chart" | "table" | "flowchart">("chart");
  const [chartTypeOverride, setChartTypeOverride] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const chart = latestVisualization?.chart as any;
  const flowchart = latestVisualization?.flowchart as any;
  const queryResult = latestVisualization?.query?.result;

  // Extract table rows safely from chart.data or queryResult.rows
  const tableRows: any[] = Array.isArray(chart?.data)
    ? chart.data
    : Array.isArray(queryResult?.rows)
    ? queryResult.rows
    : Array.isArray(queryResult)
    ? queryResult
    : [];

  const effectiveChart = chart || (tableRows.length > 0 ? (() => {
    const firstRow = tableRows[0];
    const allKeys = Object.keys(firstRow);
    const isNum = (v: unknown) => {
      if (typeof v === "number") return isFinite(v as number);
      if (typeof v === "string") return (v as string).trim() !== "" && isFinite(Number(v));
      return false;
    };
    const numericCols = allKeys.filter((k) => isNum(firstRow[k]));
    const nonNumericCols = allKeys.filter((k) => !isNum(firstRow[k]));
    // Y axis: last numeric column, or last column as fallback
    const yAxis = numericCols[numericCols.length - 1] || allKeys[allKeys.length - 1];
    // X axis: first non-numeric that isn't yAxis, or first key that isn't yAxis
    // If only 1 column exists, use __index__ sentinel so buildChartData generates synthetic labels
    const xAxisCandidate =
      nonNumericCols.find((k) => k !== yAxis) ||
      allKeys.find((k) => k !== yAxis) ||
      null;
    const xAxis = xAxisCandidate || "__index__";
    return {
      chart_type: "bar",
      title: "Data Visualization",
      x_axis: xAxis,
      y_axis: yAxis,
      data: tableRows,
    };
  })() : null);

  const rawType = String(effectiveChart?.chart_type ?? effectiveChart?.chartType ?? "bar").toLowerCase();
  const currentChartType = chartTypeOverride || (rawType.includes("line") ? "line" : rawType.includes("pie") ? "pie" : rawType.includes("scatter") ? "scatter" : "bar");

  // Auto switch tab when new visualization payload arrives
  useEffect(() => {
    if (chartTypeOverride) setChartTypeOverride(null);
    if (flowchart?.content && !effectiveChart) {
      setActiveTab("flowchart");
    } else if (effectiveChart) {
      setActiveTab("chart");
    } else if (tableRows.length > 0) {
      setActiveTab("table");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestVisualization]);

  // Export handlers
  const exportPNG = () => {
    const container = document.getElementById("actual-chart");
    if (!container) return;
    const svg = container.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 450;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 800, 450);
        const link = document.createElement("a");
        link.download = `visualization-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const exportSVG = () => {
    const container = document.getElementById("actual-chart");
    if (!container) return;
    const svg = container.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.download = `visualization-${Date.now()}.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const exportCSV = () => {
    const rows = tableRows;
    if (!rows || rows.length === 0) return;

    const headers = Object.keys(rows[0]);
    const csvLines = [headers.join(",")];
    for (const row of rows) {
      csvLines.push(headers.map((h) => JSON.stringify(row[h] ?? "")).join(","));
    }
    const blob = new Blob([csvLines.join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.download = `data-export-${Date.now()}.csv`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const exportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const container = document.getElementById("vis-container");
    const contentHtml = container ? container.innerHTML : "<h1>Zenith Nexus BI Report</h1>";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Zenith Nexus BI Report</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #1e293b; }
            h1 { color: #2563eb; font-size: 20px; margin-bottom: 20px; }
            svg { max-width: 100%; height: auto; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f8fafc; }
          </style>
        </head>
        <body>
          <h1>Zenith Nexus AI - Executive BI Report</h1>
          <div>${contentHtml}</div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const [exportOpen, setExportOpen] = useState(false);

  const hasFlowchart = !!flowchart?.content;
  const hasChart = !!effectiveChart;
  const hasTable = tableRows.length > 0;

  return (
    <aside id="visualization-panel" className={`flex flex-col border-l bg-slate-50 dark:bg-slate-900 ${isFullscreen ? "fixed inset-0 z-50 w-full h-full bg-white dark:bg-slate-900" : "w-96"}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-white dark:bg-slate-800 px-5 py-4">
        <div className="flex items-center gap-2">
          <BarChart3 size={20} className="text-blue-600" />
          <h2 className="font-bold text-slate-900 dark:text-white">Visualization</h2>
        </div>

        <div className="flex gap-1.5">
          {/* Download Dropdown */}
          <div className="relative" onMouseLeave={() => setExportOpen(false)}>
            <button
              onClick={() => setExportOpen(!exportOpen)}
              onMouseEnter={() => setExportOpen(true)}
              className="rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600"
              title="Export Options"
            >
              <Download size={18} />
            </button>

            {exportOpen && (
              <div
                className="absolute right-0 top-full w-40 rounded-xl border bg-white dark:bg-slate-800 shadow-xl z-30 py-1"
                onMouseEnter={() => setExportOpen(true)}
              >
                <button
                  onClick={() => { exportPNG(); setExportOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                >
                  <FileText size={14} /> PNG Image
                </button>
                <button
                  onClick={() => { exportSVG(); setExportOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                >
                  <Layers size={14} /> SVG Vector
                </button>
                <button
                  onClick={() => { exportCSV(); setExportOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                >
                  <FileSpreadsheet size={14} /> CSV Data
                </button>
                <button
                  onClick={() => { exportPDF(); setExportOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                >
                  <FileText size={14} /> PDF Report
                </button>
              </div>
            )}
          </div>

          <button onClick={() => setIsFullscreen(!isFullscreen)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">
            {isFullscreen ? <Minimize2 size={18} /> : <Expand size={18} />}
          </button>
        </div>
      </div>


      {/* Mode Selector Tabs */}
      <div className="flex border-b bg-slate-100 dark:bg-slate-800 px-4 py-2 gap-1 text-xs">
        <button
          onClick={() => setActiveTab("chart")}
          className={`flex-1 py-1.5 rounded-md font-semibold ${activeTab === "chart" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-800"}`}
        >
          Charts
        </button>
        <button
          onClick={() => setActiveTab("table")}
          className={`flex-1 py-1.5 rounded-md font-semibold ${activeTab === "table" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-800"}`}
        >
          Data Table
        </button>
        <button
          onClick={() => setActiveTab("flowchart")}
          className={`flex-1 py-1.5 rounded-md font-semibold relative ${activeTab === "flowchart" ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-800"}`}
        >
          Diagrams
          {hasFlowchart && (
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-purple-500" />
          )}
        </button>
      </div>

      {/* Main Body */}
      <div id="vis-container" className="flex-1 p-5 overflow-y-auto">
        {visualizationLoading ? (
          <VisualizationSkeleton />
        ) : activeTab === "chart" ? (
          hasChart ? (
            <div className="space-y-4 rounded-xl border bg-white dark:bg-slate-800 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{effectiveChart?.title || "Data Visualization"}</p>
                </div>
                {/* Chart Type Selector */}
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                  <button onClick={() => setChartTypeOverride("bar")} className={`p-1.5 rounded ${currentChartType === "bar" ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-400"}`} title="Bar Chart">
                    <BarChart3 size={14} />
                  </button>
                  <button onClick={() => setChartTypeOverride("line")} className={`p-1.5 rounded ${currentChartType === "line" ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-400"}`} title="Line Chart">
                    <LineChart size={14} />
                  </button>
                  <button onClick={() => setChartTypeOverride("pie")} className={`p-1.5 rounded ${currentChartType === "pie" ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-400"}`} title="Pie Chart">
                    <PieChartIcon size={14} />
                  </button>
                  <button onClick={() => setChartTypeOverride("scatter")} className={`p-1.5 rounded ${currentChartType === "scatter" ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-400"}`} title="Scatter Plot">
                    <ScatterIcon size={14} />
                  </button>
                </div>
              </div>

              <div id="actual-chart">
                {currentChartType === "bar" && <BarChartRender chart={effectiveChart} />}
                {currentChartType === "line" && <LineChartRender chart={effectiveChart} />}
                {currentChartType === "pie" && <PieChartRender chart={effectiveChart} />}
                {currentChartType === "scatter" && <ScatterChartRender chart={effectiveChart} />}
              </div>
            </div>
          ) : hasFlowchart ? (
            <div className="flex h-full items-center justify-center rounded-xl border-2 border-dashed bg-white dark:bg-slate-800 p-8 text-center">
              <div>
                <GitFork size={48} className="mx-auto mb-3 text-purple-300" />
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Diagram Generated</h3>
                <p className="mt-1 text-xs text-slate-400">Switch to the <strong>Diagrams</strong> tab to view it</p>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center rounded-xl border-2 border-dashed bg-white dark:bg-slate-800 p-8 text-center">
              <div>
                <BarChart3 size={48} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">No Chart Active</h3>
                <p className="mt-1 text-xs text-slate-400">Ask a question like "Show top 5 products by revenue"</p>
              </div>
            </div>
          )
        ) : activeTab === "table" ? (
          hasTable ? (
            <div className="overflow-x-auto rounded-xl border bg-white dark:bg-slate-800 shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-700 border-b text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    {Object.keys(tableRows[0] || {}).map((col) => (
                      <th key={col} className="px-3 py-2.5">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700 dark:text-slate-300">
                  {tableRows.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      {Object.values(row).map((val: any, vIdx: number) => (
                        <td key={vIdx} className="px-3 py-2 font-mono">{toText(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center rounded-xl border-2 border-dashed bg-white dark:bg-slate-800 p-8 text-center">
              <div>
                <TableIcon size={48} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">No Table Data</h3>
                <p className="mt-1 text-xs text-slate-400">Run a query to see results here</p>
              </div>
            </div>
          )
        ) : activeTab === "flowchart" ? (
          <FlowchartRender flowchart={flowchart} />
        ) : null}
      </div>

    </aside>
  );
};

export default ChartPanel;