import { useQuery } from "@tanstack/react-query";
import { Business, BUSINESS_API_CONFIG } from "@/constants/business";

const getBusinesses = async (): Promise<Business[]> => {
  const response = await fetch(
    `${BUSINESS_API_CONFIG.baseUrl}${BUSINESS_API_CONFIG.endpoints.list}`,
  );

  if (!response.ok) {
    throw new Error("Yikamacilar getirilemedi");
  }

  return response.json();
};

export function useBusinesses() {
  return useQuery({
    queryKey: ["businesses"],
    queryFn: getBusinesses,
  });
}
