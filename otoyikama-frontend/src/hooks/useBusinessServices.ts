import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/constants/api";
import { ServiceOption } from "@/constants/reservation";

const getBusinessServices = async (businessId: number): Promise<ServiceOption[]> => {
  const response = await fetch(`${API_BASE_URL}/services/business/${businessId}`);

  if (!response.ok) {
    throw new Error("Hizmetler alınamadı.");
  }

  return response.json();
};

export function useBusinessServices(businessId: number | null) {
  return useQuery({
    queryKey: ["business-services", businessId],
    queryFn: () => getBusinessServices(businessId as number),
    enabled: Boolean(businessId),
  });
}
