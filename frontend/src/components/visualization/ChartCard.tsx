interface ChartCardProps {
  title: string;
}

const ChartCard = ({ title }: ChartCardProps) => {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">

      <h3 className="font-semibold mb-3">
        {title}
      </h3>

      <div className="flex h-36 items-center justify-center rounded-lg border-2 border-dashed text-slate-400">
        Chart Placeholder
      </div>

    </div>
  );
};

export default ChartCard;