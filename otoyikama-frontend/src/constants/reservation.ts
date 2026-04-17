import { Business } from "@/constants/business";

export enum ReservationStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export interface ServiceOption {
  id: number;
  name: string;
  price: number;
  duration: number;
  description?: string | null;
  vehicleTypes?: string[];
  businessId: number;
}

export interface ReservationUser {
  email: string;
}

export interface ReservationRecord {
  id: number;
  date: string;
  time: string;
  userId: number;
  businessId: number;
  serviceId: number;
  status: ReservationStatus;
  business?: Business;
  service?: ServiceOption;
  user?: ReservationUser;
}

export interface AvailableHoursResponse {
  date: string;
  availableHours: string[];
}

export const RESERVATION_STATUS_CONTENT = {
  emptyUserTitle: "Henüz randevunuz yok",
  emptyUserDescription:
    "Bir yıkamacı seçip ilk randevunuzu oluşturduğunuzda burada göreceksiniz.",
  emptyBusinessTitle: "Henüz alınmış randevu yok",
  emptyBusinessDescription:
    "Müşteriler rezervasyon oluşturdukça işletme panelinizde burada listelenecek.",
} as const;

export const RESERVATION_STATUS_CONFIG = {
  [ReservationStatus.PENDING]: {
    label: "Beklemede",
    className: "bg-amber-100 text-amber-700",
  },
  [ReservationStatus.COMPLETED]: {
    label: "Tamamlandı",
    className: "bg-emerald-100 text-emerald-700",
  },
  [ReservationStatus.CANCELED]: {
    label: "İptal",
    className: "bg-rose-100 text-rose-700",
  },
} as const;

export const formatReservationDate = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));

export const formatReservationPrice = (value?: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value || 0);

export const getCustomerDisplayName = (email?: string) => {
  if (!email) {
    return "Müşteri";
  }

  const base = email.split("@")[0] || "Müşteri";
  return base
    .split(/[._-]/)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
};
