"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Business } from "@/constants/business";
import { ServiceOption, formatReservationPrice } from "@/constants/reservation";
import { Button } from "@/components/ui/Button";
import { useAvailableHours, useCreateReservation } from "@/hooks/useReservations";
import { CurrentUser } from "@/hooks/useCurrentUser";

interface ReservationBookingFormProps {
  business: Business;
  services: ServiceOption[];
  user: CurrentUser;
}

export function ReservationBookingForm({
  business,
  services,
  user,
}: ReservationBookingFormProps) {
  const router = useRouter();
  const [selectedServiceId, setSelectedServiceId] = useState<number>(
    services[0]?.id || 0,
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const reservationMutation = useCreateReservation();
  const {
    data: availableHoursData,
    isLoading: isHoursLoading,
    isError: isHoursError,
    error: hoursError,
  } = useAvailableHours(business.id, selectedDate);

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) || null,
    [selectedServiceId, services],
  );

  const handleSubmit = async () => {
    if (!user.isAuthenticated || !user.id) {
      router.push("/auth");
      return;
    }

    if (!selectedService || !selectedDate || !selectedTime) {
      setFeedback("Lütfen hizmet, tarih ve saat seçin.");
      return;
    }

    try {
      setFeedback(null);
      await reservationMutation.mutateAsync({
        date: selectedDate,
        time: selectedTime,
        userId: user.id,
        businessId: business.id,
        serviceId: selectedService.id,
      });
      setFeedback("Randevunuz başarıyla oluşturuldu. Randevularım sayfasında görebilirsiniz.");
      router.push("/reservations");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Randevu oluşturulamadı.");
    }
  };

  if (services.length === 0) {
    return (
      <div className="flex flex-col gap-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] lg:p-8">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-sky-700">
            Randevu Oluştur
          </span>
          <h2 className="text-2xl font-bold text-slate-900">
            {business.name} için henüz hizmet tanımlanmamış
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            İşletme hizmetlerini eklediğinde rezervasyon oluşturma alanı burada aktif hale gelecek.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] lg:p-8">
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-[0.24em] text-sky-700">
          Randevu Oluştur
        </span>
        <h2 className="text-2xl font-bold text-slate-900">
          {business.name} için uygun zaman seçin
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Hizmet türünü belirleyin, günü seçin ve müsait saatlerden birine anında rezervasyon bırakın.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">Hizmet</label>
          <select
            className="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition-colors focus:border-[#0A58CA] focus:bg-white"
            onChange={(event) => setSelectedServiceId(Number(event.target.value))}
            value={selectedServiceId}
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} • {formatReservationPrice(service.price)} • {service.duration} dk
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Tarih</label>
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition-colors focus:border-[#0A58CA] focus:bg-white"
              min={new Date().toISOString().split("T")[0]}
              onChange={(event) => {
                setSelectedDate(event.target.value);
                setSelectedTime("");
                setFeedback(null);
              }}
              type="date"
              value={selectedDate}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Saat</label>
            <div className="grid grid-cols-2 gap-3">
              {isHoursLoading ? (
                <div className="col-span-2 rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500">
                  Saatler yükleniyor...
                </div>
              ) : isHoursError ? (
                <div className="col-span-2 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-600">
                  {hoursError instanceof Error
                    ? hoursError.message
                    : "Saatler alınamadı. Backend bağlantısını kontrol edin."}
                </div>
              ) : availableHoursData?.availableHours?.length ? (
                availableHoursData.availableHours.map((hour) => {
                  const isActive = selectedTime === hour;

                  return (
                    <button
                      key={hour}
                      className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
                        isActive
                          ? "border-[#0A58CA] bg-[#0A58CA] text-white"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-[#0A58CA] hover:text-[#0A58CA]"
                      }`}
                      onClick={() => setSelectedTime(hour)}
                      type="button"
                    >
                      {hour}
                    </button>
                  );
                })
              ) : (
                <div className="col-span-2 rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500">
                  Önce tarih seçin. Müsait saatler burada listelenecek.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-[28px] bg-slate-50 p-5 md:grid-cols-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Seçilen Hizmet
          </span>
          <span className="text-base font-semibold text-slate-900">
            {selectedService?.name || "Henüz seçilmedi"}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Tutar
          </span>
          <span className="text-base font-semibold text-slate-900">
            {formatReservationPrice(selectedService?.price)}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Süre
          </span>
          <span className="text-base font-semibold text-slate-900">
            {selectedService?.duration || 0} dakika
          </span>
        </div>
      </div>

      {feedback ? (
        <div className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-700">
          {feedback}
        </div>
      ) : null}

      <Button
        className="w-full"
        disabled={reservationMutation.isPending}
        onClick={handleSubmit}
        type="button"
      >
        {reservationMutation.isPending ? "Randevu Oluşturuluyor..." : "Randevuyu Onayla"}
      </Button>
    </div>
  );
}
