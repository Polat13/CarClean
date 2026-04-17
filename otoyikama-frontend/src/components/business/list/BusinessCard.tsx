"use client";

import { useRouter } from "next/navigation";
import { Clock3, MapPin, Phone, Store } from "lucide-react";
import { Business, BUSINESS_CARD_THEME } from "@/constants/business";
import { Button } from "@/components/ui/Button";

interface BusinessCardProps {
  business: Business;
}

const formatHour = (hour: number) => `${hour.toString().padStart(2, "0")}:00`;

const buildLocation = (business: Business) => {
  return [business.district, business.city].filter(Boolean).join(" / ");
};

export function BusinessCard({ business }: BusinessCardProps) {
  const router = useRouter();
  const location = buildLocation(business);
  const workingHours = `${formatHour(business.openTime)} - ${formatHour(business.closeTime)}`;
  const heroImage = business.logoUrl || business.photos[0] || null;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div
        className={`relative flex min-h-[220px] flex-col justify-between bg-gradient-to-br ${BUSINESS_CARD_THEME.accent} p-6 text-white`}
      >
        <div className="flex items-start justify-between gap-4">
          <span
            className={`inline-flex rounded-full ${BUSINESS_CARD_THEME.badge} px-4 py-2 text-xs font-bold uppercase tracking-[0.24em]`}
          >
            Yıkamacı
          </span>
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl bg-white/20 p-2 backdrop-blur-sm">
            {heroImage ? (
              <div
                aria-label={business.name}
                className="h-full w-full rounded-[20px] bg-cover bg-center"
                role="img"
                style={{ backgroundImage: `url("${heroImage}")` }}
              />
            ) : (
              <Store className="h-8 w-8" />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold leading-tight">{business.name}</h2>
          <p className="text-sm leading-6 text-slate-100">
            {business.description || "Aracınız için profesyonel yıkama ve detaylı temizlik hizmeti."}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className={`flex items-start gap-3 rounded-3xl ${BUSINESS_CARD_THEME.panel} p-4`}>
            <MapPin className="h-5 w-5 shrink-0 text-[#0A58CA]" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Konum
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {location || "Konum bilgisi bekleniyor"}
              </span>
              <span className="text-sm leading-6 text-slate-600">{business.address}</span>
            </div>
          </div>

          <div className={`flex items-start gap-3 rounded-3xl ${BUSINESS_CARD_THEME.panel} p-4`}>
            <Clock3 className="h-5 w-5 shrink-0 text-[#0A58CA]" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Çalışma Saatleri
              </span>
              <span className="text-sm font-semibold text-slate-900">{workingHours}</span>
              <span className="text-sm leading-6 text-slate-600">
                Bugün için planlama yapmaya uygun.
              </span>
            </div>
          </div>

          <div
            className={`flex items-start gap-3 rounded-3xl ${BUSINESS_CARD_THEME.panel} p-4 md:col-span-2`}
          >
            <Phone className="h-5 w-5 shrink-0 text-[#0A58CA]" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                İletişim
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {business.phone || "Telefon bilgisi paylaşılmadı"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
              İşletme ID
            </span>
            <span className="text-sm font-semibold text-slate-900">#{business.id}</span>
          </div>

          <Button
            className="w-full sm:w-auto"
            onClick={() => router.push(`/businesses/${business.id}`)}
            type="button"
          >
            Randevu Oluştur
          </Button>
        </div>
      </div>
    </article>
  );
}
