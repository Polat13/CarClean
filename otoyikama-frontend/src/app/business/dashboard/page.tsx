"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, TrendingUp } from "lucide-react";
import {
  ReservationStatus,
  RESERVATION_STATUS_CONFIG,
  formatReservationPrice,
  getCustomerDisplayName,
} from "@/constants/reservation";
import { useBusinessReservations } from "@/hooks/useReservations";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useOwnedBusiness } from "@/hooks/useOwnedBusiness";

export default function DashboardOverviewPage() {
  const router = useRouter();
  const user = useCurrentUser();
  const { data: business, isLoading: isBusinessLoading } = useOwnedBusiness(user.id);
  const { data: appointments, isLoading: isReservationsLoading } = useBusinessReservations(
    business?.id || null,
  );

  const isLoading = isBusinessLoading || isReservationsLoading;
  const upcomingAppointments =
    appointments?.filter((reservation) => reservation.status === ReservationStatus.PENDING) || [];
  const today = new Date().toISOString().split("T")[0];
  const todaysAppointments = upcomingAppointments.filter((reservation) =>
    reservation.date.startsWith(today),
  );
  const todayRevenue = todaysAppointments.reduce(
    (sum, reservation) => sum + Number(reservation.service?.price || 0),
    0,
  );

  return (
    <div className="flex w-full flex-col gap-10 p-8 lg:p-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Merhaba, {business?.name || "İşletmeniz"}
        </h1>
        <p className="text-sm font-medium text-gray-500">
          İşletmenizin bugünkü rezervasyon akışını buradan takip edin.
        </p>
      </div>

      <div className="flex w-full flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-lg font-extrabold text-gray-900">Sıradaki Randevular</h2>
          <button
            className="cursor-pointer text-sm font-bold text-[#0A58CA] transition-colors hover:text-blue-800"
            onClick={() => router.push("/business/dashboard/appointments")}
            type="button"
          >
            Tümünü Gör
          </button>
        </div>

        <div className="flex flex-col gap-4 pt-2">
          {isLoading ? (
            <div className="rounded-xl bg-gray-50 p-4 text-center font-medium text-gray-500">
              Veriler yükleniyor...
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-4 text-center font-medium text-gray-500">
              Henüz bekleyen randevu bulunmuyor.
            </div>
          ) : (
            upcomingAppointments.slice(0, 5).map((appointment) => {
              const statusConfig = RESERVATION_STATUS_CONFIG[appointment.status];

              return (
                <div
                  key={appointment.id}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-50 bg-gray-50 p-4 transition-colors hover:bg-blue-50/50"
                  onClick={() => router.push("/business/dashboard/appointments")}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg border border-gray-100 bg-white shadow-sm">
                      <span className="text-[10px] font-bold uppercase text-gray-400">
                        Saat
                      </span>
                      <span className="text-sm font-extrabold text-[#0A58CA]">
                        {appointment.time}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">
                        {getCustomerDisplayName(appointment.user?.email)}
                      </span>
                      <span className="text-xs font-semibold text-gray-500">
                        {appointment.service?.name || "Hizmet bilgisi yok"}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${statusConfig.className}`}
                  >
                    {statusConfig.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
