"use client";

import { ReservationCard } from "@/components/reservations/ReservationCard";
import { ReservationEmptyState } from "@/components/reservations/ReservationEmptyState";
import { RESERVATION_STATUS_CONTENT } from "@/constants/reservation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserReservations } from "@/hooks/useReservations";

export default function ReservationsPage() {
  const user = useCurrentUser();
  const { data, isLoading } = useUserReservations(user.id);

  if (isLoading) {
    return (
      <section className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="rounded-[28px] bg-white p-8 text-base font-semibold text-slate-600 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          Randevularınız yükleniyor...
        </div>
      </section>
    );
  }

  return (
    <section className="flex w-full flex-1 justify-center bg-[linear-gradient(180deg,_#F8FAFC_0%,_#EEF4FF_100%)] px-4 py-8 sm:px-6 lg:px-10">
      <div className="flex w-full max-w-[1400px] flex-col gap-8">
        <div className="rounded-[36px] bg-[#0F172A] p-8 text-white shadow-[0_22px_65px_rgba(15,23,42,0.22)]">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-sky-200">
              Randevularım
            </span>
            <h1 className="text-4xl font-bold leading-tight">
              Tüm rezervasyonlarınızı tek ekranda yönetin
            </h1>
            <p className="max-w-3xl text-base leading-7 text-slate-300">
              Aldığınız randevuların tarih, saat ve hizmet detaylarını buradan takip edebilirsiniz.
            </p>
          </div>
        </div>

        {data?.length ? (
          <div className="grid grid-cols-1 gap-6">
            {data.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                variant="user"
              />
            ))}
          </div>
        ) : (
          <ReservationEmptyState
            description={RESERVATION_STATUS_CONTENT.emptyUserDescription}
            title={RESERVATION_STATUS_CONTENT.emptyUserTitle}
          />
        )}
      </div>
    </section>
  );
}
