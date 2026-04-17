"use client";

import { Building2, MapPinned, Sparkles } from "lucide-react";
import { Business, BUSINESS_CONTENT } from "@/constants/business";
import { BusinessCard } from "./BusinessCard";
import { BusinessCardSkeleton } from "./BusinessCardSkeleton";
import { BusinessListEmpty } from "./BusinessListEmpty";

interface BusinessListSectionProps {
  businesses: Business[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

const BUSINESS_STATS = [
  {
    icon: Building2,
    label: "Toplam İşletme",
    getValue: (businesses: Business[]) => businesses.length.toString(),
  },
  {
    icon: MapPinned,
    label: "Şehir Verisi Olan",
    getValue: (businesses: Business[]) =>
      businesses.filter((business) => Boolean(business.city)).length.toString(),
  },
  {
    icon: Sparkles,
    label: "Açıklama Paylaşan",
    getValue: (businesses: Business[]) =>
      businesses.filter((business) => Boolean(business.description)).length.toString(),
  },
] as const;

export function BusinessListSection({
  businesses,
  isLoading,
  isError,
}: BusinessListSectionProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <BusinessCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <BusinessListEmpty
        title={BUSINESS_CONTENT.errorTitle}
        description={BUSINESS_CONTENT.errorDescription}
      />
    );
  }

  if (!businesses || businesses.length === 0) {
    return <BusinessListEmpty />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {BUSINESS_STATS.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#DBEAFE] text-[#0A58CA]">
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                  {item.label}
                </span>
                <span className="text-2xl font-bold text-slate-900">
                  {item.getValue(businesses)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {businesses.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </div>
  );
}
