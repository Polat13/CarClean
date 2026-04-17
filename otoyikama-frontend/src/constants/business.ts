export interface Business {
  id: number;
  name: string;
  address: string;
  userId: number;
  phone: string | null;
  city: string | null;
  district: string | null;
  description: string | null;
  logoUrl: string | null;
  openTime: number;
  closeTime: number;
  photos: string[];
}

export const BUSINESS_API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001",
  endpoints: {
    list: "/business",
  },
} as const;

export const BUSINESS_CONTENT = {
  eyebrow: "Onaylı İşletmeler",
  title: "Size en uygun yıkamacıyı seçin",
  description:
    "Konum, saat ve hizmet bilgilerine tek ekranda ulaşın. İşletmeleri karşılaştırıp randevu için hazır olun.",
  emptyTitle: "Henüz yayınlanmış bir yıkamacı yok",
  emptyDescription:
    "Sisteme yeni işletmeler eklendikçe burada görünecekler. Biraz sonra tekrar kontrol edebilirsiniz.",
  errorTitle: "Yıkamacılar alınamadı",
  errorDescription:
    "Backend bağlantısı kurulamadı veya servis geçici olarak erişilemiyor. Sunucuyu kontrol edip tekrar deneyin.",
} as const;

export const BUSINESS_CARD_THEME = {
  accent: "from-[#0F766E] via-[#0A58CA] to-[#1D4ED8]",
  badge: "bg-[#E0F2FE] text-[#0F172A]",
  panel: "bg-[#F8FAFC]",
} as const;
