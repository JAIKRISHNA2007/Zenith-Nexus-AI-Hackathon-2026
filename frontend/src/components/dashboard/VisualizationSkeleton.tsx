const VisualizationSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-72 rounded-xl bg-slate-200"></div>

      <div className="mt-6 space-y-3">
        <div className="h-4 w-3/4 rounded bg-slate-200"></div>
        <div className="h-4 w-full rounded bg-slate-200"></div>
        <div className="h-4 w-5/6 rounded bg-slate-200"></div>
      </div>
    </div>
  );
};

export default VisualizationSkeleton;