import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/constants/api";
import {
  AvailableHoursResponse,
  ReservationRecord,
  ReservationStatus,
} from "@/constants/reservation";

interface CreateReservationPayload {
  date: string;
  time: string;
  userId: number;
  businessId: number;
  serviceId: number;
}

const getUserReservations = async (userId: number): Promise<ReservationRecord[]> => {
  const response = await fetch(`${API_BASE_URL}/reservations/user/${userId}`);

  if (!response.ok) {
    throw new Error("Randevular alınamadı.");
  }

  return response.json();
};

const getBusinessReservations = async (
  businessId: number,
): Promise<ReservationRecord[]> => {
  const response = await fetch(`${API_BASE_URL}/reservations/business/${businessId}`);

  if (!response.ok) {
    throw new Error("İşletme randevuları alınamadı.");
  }

  return response.json();
};

const getAvailableHours = async (
  businessId: number,
  date: string,
): Promise<AvailableHoursResponse> => {
  const searchParams = new URLSearchParams({
    businessId: String(businessId),
    date,
  });

  const response = await fetch(
    `${API_BASE_URL}/reservations/available-hours?${searchParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Uygun saatler alınamadı.");
  }

  return response.json();
};

const createReservation = async (payload: CreateReservationPayload) => {
  const response = await fetch(`${API_BASE_URL}/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Randevu oluşturulamadı.");
  }

  return data;
};

const updateReservationStatus = async ({
  reservationId,
  status,
}: {
  reservationId: number;
  status: ReservationStatus;
}) => {
  const response = await fetch(
    `${API_BASE_URL}/reservations/${reservationId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Rezervasyon durumu güncellenemedi.");
  }

  return data;
};

export function useUserReservations(userId: number | null) {
  return useQuery({
    queryKey: ["user-reservations", userId],
    queryFn: () => getUserReservations(userId as number),
    enabled: Boolean(userId),
  });
}

export function useBusinessReservations(businessId: number | null) {
  return useQuery({
    queryKey: ["business-reservations", businessId],
    queryFn: () => getBusinessReservations(businessId as number),
    enabled: Boolean(businessId),
  });
}

export function useAvailableHours(businessId: number | null, date: string) {
  return useQuery({
    queryKey: ["available-hours", businessId, date],
    queryFn: () => getAvailableHours(businessId as number, date),
    enabled: Boolean(businessId && date),
    retry: false,
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReservation,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user-reservations", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["business-reservations", variables.businessId],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-hours", variables.businessId, variables.date],
      });
    },
  });
}

export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReservationStatus,
    onSuccess: (data) => {
      const reservation = data?.reservation as ReservationRecord | undefined;

      if (!reservation) {
        queryClient.invalidateQueries({ queryKey: ["user-reservations"] });
        queryClient.invalidateQueries({ queryKey: ["business-reservations"] });
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["user-reservations", reservation.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["business-reservations", reservation.businessId],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-hours", reservation.businessId],
      });
    },
  });
}
