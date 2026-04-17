import { Store } from "lucide-react";
import { BUSINESS_CONTENT } from "@/constants/business";

interface BusinessListEmptyProps {
  title?: string;
  description?: string;
}

export function BusinessListEmpty({
  title = BUSINESS_CONTENT.emptyTitle,
  description = BUSINESS_CONTENT.emptyDescription,
}: BusinessListEmptyProps) {
  return (
    <div className="flex flex-col items-center rounded-[32px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#DBEAFE] text-[#0A58CA]">
        <Store className="h-9 w-9" />
      </div>
      <div className="flex max-w-2xl flex-col gap-3 p-6">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="text-base leading-7 text-slate-600">{description}</p>
      </div>
    </div>
  );
}
