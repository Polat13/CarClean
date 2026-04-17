"use client";

import { useParams } from "next/navigation";
import { MapPin, Phone, Store } from "lucide-react";
import { useBusinesses } from "@/hooks/useBusinesses";
import { useBusinessServices } from "@/hooks/useBusinessServices";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ReservationBookingForm } from "@/components/business/reservation/ReservationBookingForm";
import { formatReservationPrice } from "@/constants/reservation";

export default function BusinessReservationPage() {
  const params = useParams<{ businessId: string }>();
  const businessId = Number(params.businessId);
  const user = useCurrentUser();
  const { data: businesses, isLoading: isBusinessesLoading } = useBusinesses();
  const business = businesses?.find((item) => item.id === businessId);
  const { data: services, isLoading: isServicesLoading } = useBusinessServices(
    business?.id || null,
  );

  if (isBusinessesLoading || isServicesLoading) {
    return (
      <section className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="rounded-[28px] bg-white p-8 text-base font-semibold text-slate-600 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          Rezervasyon ekranı hazırlanıyor...
        </div>
      </section>
    );
  }

  if (!business) {
    return (
      <section className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="rounded-[28px] bg-white p-8 text-base font-semibold text-slate-600 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          İşletme bulunamadı.
        </div>
      </section>
    );
  }

  return (
    <section className="flex w-full flex-1 justify-center bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.16),_transparent_35%),linear-gradient(180deg,_#F8FAFC_0%,_#EEF4FF_100%)] px-4 py-8 sm:px-6 lg:px-10">
      <div className="grid w-full max-w-[1400px] grid-cols-1 gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.85fr)]">
        <div className="flex flex-col gap-6 rounded-[36px] bg-[#0F172A] p-8 text-white shadow-[0_22px_65px_rgba(15,23,42,0.22)]">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-sky-200">
              Rezervasyon
            </span>
            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-white/10">
              <Store className="h-8 w-8 text-sky-200" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold leading-tight">{business.name}</h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300">
              {business.description ||
                "Aracınız için profesyonel bakım ve temizlik hizmetlerini uygun saatlerde rezerve edin."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-[28px] bg-white/10 p-5">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-sky-200" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">Adres</span>
                  <span className="text-sm leading-6 text-slate-300">
                    {[business.district, business.city].filter(Boolean).join(" / ")}
                  </span>
                  <span className="text-sm leading-6 text-slate-300">{business.address}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-white/10 p-5">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 shrink-0 text-sky-200" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">İletişim</span>
                  <span className="text-sm leading-6 text-slate-300">
                    {business.phone || "Telefon bilgisi paylaşılmadı"}
                  </span>
                  <span className="text-sm leading-6 text-slate-300">
                    Çalışma: {business.openTime}:00 - {business.closeTime}:00
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-[28px] bg-white/10 p-5">
            <h2 className="text-lg font-bold">Sunulan Hizmetler</h2>
            <div className="grid grid-cols-1 gap-3">
              {services?.map((service) => (
                <div
                  key={service.id}
                  className="grid grid-cols-1 gap-3 rounded-[24px] bg-white/10 p-4 lg:grid-cols-[minmax(0,1fr)_auto_auto]"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold">{service.name}</span>
                    <span className="text-sm leading-6 text-slate-300">
                      {service.description || "Araç tipine uygun detaylı yıkama hizmeti."}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-sky-200">
                    {service.duration} dk
                  </span>
                  <span className="text-sm font-semibold text-sky-200">
                    {formatReservationPrice(service.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {business.photos?.length ? (
            <div className="flex flex-col gap-4 rounded-[28px] bg-white/10 p-5">
              <h2 className="text-lg font-bold">İşletme Fotoğrafları</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {business.photos.map((photo, index) => (
                  <div
                    key={`${business.id}-${index}`}
                    className="h-[190px] overflow-hidden rounded-[24px] border border-white/10 bg-white/10"
                  >
                    <div
                      aria-label={`${business.name} fotoğrafı ${index + 1}`}
                      className="h-full w-full bg-cover bg-center"
                      role="img"
                      style={{ backgroundImage: `url("${photo}")` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <ReservationBookingForm
          business={business}
          services={services || []}
          user={user}
        />
      </div>
    </section>
  );
}
