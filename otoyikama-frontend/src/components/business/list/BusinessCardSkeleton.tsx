export function BusinessCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white">
      <div className="min-h-[220px] bg-slate-200 p-6" />
      <div className="flex flex-col gap-4 p-6">
        <div className="h-6 w-2/3 rounded-full bg-slate-200" />
        <div className="h-20 rounded-[24px] bg-slate-100" />
        <div className="h-20 rounded-[24px] bg-slate-100" />
        <div className="h-12 rounded-full bg-slate-200" />
      </div>
    </div>
  );
}
