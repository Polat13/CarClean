"use client";

import {
  ReservationRecord,
  ReservationStatus,
  RESERVATION_STATUS_CONFIG,
  formatReservationDate,
  formatReservationPrice,
  getCustomerDisplayName,
} from "@/constants/reservation";
import { Button } from "@/components/ui/Button";
import { useUpdateReservationStatus } from "@/hooks/useReservations";

interface ReservationCardProps {
  reservation: ReservationRecord;
  variant: "user" | "business";
}

export function ReservationCard({
  reservation,
  variant,
}: ReservationCardProps) {
  const updateStatusMutation = useUpdateReservationStatus();
  const currentStatus = reservation.status || ReservationStatus.PENDING;
  const title =
    variant === "user"
      ? reservation.business?.name || "İşletme"
      : getCustomerDisplayName(reservation.user?.email);
  const subtitle =
    variant === "user"
      ? reservation.business?.address || "Adres bilgisi paylaşılmadı"
      : reservation.user?.email || "Müşteri bilgisi yok";
  const statusConfig =
    RESERVATION_STATUS_CONFIG[currentStatus] ||
    RESERVATION_STATUS_CONFIG[ReservationStatus.PENDING];

  const handleStatusUpdate = async (status: ReservationStatus) => {
    await updateStatusMutation.mutateAsync({
      reservationId: reservation.id,
      status,
    });
  };

  return (
    <article className="flex flex-col gap-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-sky-700">
            {variant === "user" ? "Randevum" : "Müşteri Randevusu"}
          </span>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <p className="text-sm leading-6 text-slate-600">{subtitle}</p>
        </div>

        <div className="flex flex-col items-start gap-3 lg:items-end">
          <div className="rounded-[24px] bg-slate-50 p-4">
            <div className="flex flex-col gap-1 text-right">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Tarih
              </span>
              <span className="text-base font-semibold text-slate-900">
                {formatReservationDate(reservation.date)}
              </span>
              <span className="text-sm font-semibold text-[#0A58CA]">
                {reservation.time}
              </span>
            </div>
          </div>

          <span
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] ${statusConfig.className}`}
          >
            {statusConfig.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-[24px] bg-slate-50 p-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Hizmet
          </span>
          <p className="pt-2 text-base font-semibold text-slate-900">
            {reservation.service?.name || "Hizmet bilgisi yok"}
          </p>
        </div>

        <div className="rounded-[24px] bg-slate-50 p-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Süre
          </span>
          <p className="pt-2 text-base font-semibold text-slate-900">
            {reservation.service?.duration || 0} dakika
          </p>
        </div>

        <div className="rounded-[24px] bg-slate-50 p-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Tutar
          </span>
          <p className="pt-2 text-base font-semibold text-slate-900">
            {formatReservationPrice(reservation.service?.price)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        {variant === "business" && currentStatus === ReservationStatus.PENDING ? (
          <Button
            className="w-full sm:w-auto"
            onClick={() => handleStatusUpdate(ReservationStatus.COMPLETED)}
            type="button"
          >
            Tamamlandı Olarak İşaretle
          </Button>
        ) : null}

        {variant === "user" && currentStatus === ReservationStatus.PENDING ? (
          <Button
            className="w-full border-red-200 text-red-600 hover:bg-red-50 sm:w-auto"
            onClick={() => handleStatusUpdate(ReservationStatus.CANCELED)}
            type="button"
            variant="outline"
          >
            Randevuyu İptal Et
          </Button>
        ) : null}
      </div>
    </article>
  );
}
