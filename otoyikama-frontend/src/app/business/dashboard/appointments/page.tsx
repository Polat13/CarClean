"use client";

import { ReservationCard } from "@/components/reservations/ReservationCard";
import { ReservationEmptyState } from "@/components/reservations/ReservationEmptyState";
import { RESERVATION_STATUS_CONTENT } from "@/constants/reservation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useOwnedBusiness } from "@/hooks/useOwnedBusiness";
import { useBusinessReservations } from "@/hooks/useReservations";

export default function BusinessAppointmentsPage() {
  const user = useCurrentUser();
  const { data: business, isLoading: isBusinessLoading } = useOwnedBusiness(user.id);
  const { data: reservations, isLoading: isReservationsLoading } = useBusinessReservations(
    business?.id || null,
  );

  if (isBusinessLoading || isReservationsLoading) {
    return (
      <section className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="rounded-[28px] bg-white p-8 text-base font-semibold text-slate-600 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          İşletme randevuları yükleniyor...
        </div>
      </section>
    );
  }

  return (
    <section className="flex w-full flex-1 justify-center bg-[#F8FAFC] px-6 py-8 lg:px-10">
      <div className="flex w-full max-w-[1280px] flex-col gap-8">
        <div className="rounded-[32px] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-sky-700">
              İşletme Randevuları
            </span>
            <h1 className="text-3xl font-bold text-slate-900">
              {business?.name || "İşletmeniz"} için alınan rezervasyonlar
            </h1>
            <p className="max-w-3xl text-base leading-7 text-slate-600">
              Müşterilerin oluşturduğu tüm rezervasyonları tarih, saat ve hizmet detaylarıyla izleyebilirsiniz.
            </p>
          </div>
        </div>

        {reservations?.length ? (
          <div className="grid grid-cols-1 gap-6">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                variant="business"
              />
            ))}
          </div>
        ) : (
          <ReservationEmptyState
            description={RESERVATION_STATUS_CONTENT.emptyBusinessDescription}
            title={RESERVATION_STATUS_CONTENT.emptyBusinessTitle}
          />
        )}
      </div>
    </section>
  );
}
