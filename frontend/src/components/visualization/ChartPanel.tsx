import ChartCard from "./ChartCard";
import InsightCard from "./InsightCard";

const ChartPanel = () => {
  return (
    <aside className="w-80 border-l bg-slate-50 p-4 overflow-y-auto">

      <div className="space-y-4">

        <ChartCard title="Bar Chart" />

        <ChartCard title="Line Chart" />

        <ChartCard title="Pie Chart" />

        <InsightCard />

      </div>

    </aside>
  );
};

export default ChartPanel;