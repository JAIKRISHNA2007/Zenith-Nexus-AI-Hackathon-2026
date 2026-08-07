const InsightSkeleton = () => {
  return (
    <div className="animate-pulse rounded-xl border bg-white p-5">
      <div className="mb-4 h-5 w-40 rounded bg-slate-200"></div>

      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-slate-200"></div>
        <div className="h-4 w-5/6 rounded bg-slate-200"></div>
        <div className="h-4 w-4/6 rounded bg-slate-200"></div>
      </div>
    </div>
  );
};

export default InsightSkeleton;