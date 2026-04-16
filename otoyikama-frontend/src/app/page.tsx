"use client";

import { useBusinesses } from "@/components/hooks/useBusinesses";

export default function HomePage() {
  const { data: businesses, isLoading, error } = useBusinesses();

  if (isLoading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata oluştu!</div>;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Oto Yıkamacılar</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {businesses?.map((b: any) => (
          <div key={b.id} className="border p-4 rounded-lg shadow">
            <h2 className="font-semibold">{b.name}</h2>
            <p className="text-gray-600">{b.address}</p>
          </div>
        ))}
      </div>
    </main>
  );
}