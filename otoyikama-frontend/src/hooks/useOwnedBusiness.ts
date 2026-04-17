import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/constants/api";
import { Business } from "@/constants/business";

const getOwnedBusiness = async (userId: number): Promise<Business | null> => {
  const response = await fetch(`${API_BASE_URL}/business/owner/${userId}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("İşletme bilgisi alınamadı.");
  }

  return response.json();
};

export function useOwnedBusiness(userId: number | null) {
  return useQuery({
    queryKey: ["owned-business", userId],
    queryFn: () => getOwnedBusiness(userId as number),
    enabled: Boolean(userId),
  });
}
