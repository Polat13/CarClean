"use client";

import { MapPin, ShieldCheck } from "lucide-react";
import { BUSINESS_CONTENT } from "@/constants/business";
import { useBusinesses } from "@/hooks/useBusinesses";
import { BusinessListSection } from "@/components/business/list/BusinessListSection";

export default function BusinessesPage() {
  const { data, isLoading, isError } = useBusinesses();

  return (
    <section className="flex w-full flex-1 justify-center bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.16),_transparent_35%),linear-gradient(180deg,_#F8FAFC_0%,_#EEF4FF_100%)] px-4 py-8 sm:px-6 lg:px-10">
      <div className="flex w-full max-w-[1400px] flex-col gap-8">
        <div className="grid grid-cols-1 gap-6 rounded-[36px] bg-[#0F172A] p-8 text-white shadow-[0_22px_65px_rgba(15,23,42,0.22)] lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)] lg:p-10">
          <div className="flex flex-col gap-5">
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#7DD3FC]">
              {BUSINESS_CONTENT.eyebrow}
            </span>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
              {BUSINESS_CONTENT.title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              {BUSINESS_CONTENT.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[28px] bg-white/10 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <ShieldCheck className="h-6 w-6 text-[#BAE6FD]" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">Onaylı İşletmeler</span>
                  <span className="text-sm text-slate-300">
                    Güvenilir ve onaylı işletmeleri tek listede inceleyin.
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-white/10 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <MapPin className="h-6 w-6 text-[#BAE6FD]" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">Hızlı Karşılaştırma</span>
                  <span className="text-sm text-slate-300">
                    Saat, adres ve iletişim detaylarını tek bakışta karşılaştırın.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BusinessListSection
          businesses={data}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </section>
  );
}
