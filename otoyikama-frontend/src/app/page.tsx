import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    // padding (py, px) ve gap ile hiyerarşi kurduk, sıfır margin!
    <div className="flex flex-col items-center justify-center w-full px-4 py-20 gap-6 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
        Aracınız İçin Profesyonel Bakım
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl">
        Şehrinizdeki en iyi oto yıkamacılardan saniyeler içinde randevu alın. 
        Sıra beklemeden temizliğin tadını çıkarın.
      </p>
      
      <div className="flex items-center gap-4 py-4">
        <Button variant="primary">Hemen Randevu Al</Button>
      </div>
    </div>
  );
}