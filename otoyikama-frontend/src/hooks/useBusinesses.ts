import { useQuery } from "@tanstack/react-query";

export function useBusinesses() {
  return useQuery({
    queryKey: ["businesses"], // Cache anahtarı
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/business");
      if (!response.ok) throw new Error("Dükkanlar getirilemedi");
      return response.json();
    },
  });
}