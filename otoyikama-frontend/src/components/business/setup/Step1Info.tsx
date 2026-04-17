import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Altı çizgili Input tasarımı - (Performans ve Odak kaybı sorununu önlemek için ana bileşen dışına taşındı)
const SetupInput = ({ label, name, placeholder, type = "text", value, onChange, maxLength }: any) => (
  <div className="flex flex-col gap-2 w-full">
    <label htmlFor={name} className="text-xs font-bold text-gray-700 uppercase tracking-wide cursor-pointer">{label}</label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full pb-2 border-b border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#0A58CA] transition-colors bg-transparent"
    />
  </div>
);

interface Step1InfoProps {
  onNext: (data: any) => void;
  initialData?: any;
}

export const Step1Info: React.FC<Step1InfoProps> = ({ onNext, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    district: initialData?.district || '',
    description: initialData?.description || '',
    logoUrl: initialData?.logoUrl || '',
  });

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    // Sadece telefon alanındaysa sayı dışındaki karakterleri temizle
    if (e.target.name === 'phone') {
      value = value.replace(/\D/g, '');
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleNextClick = () => {
    onNext({ ...formData });
  };

  // Logo yükleme işlemi (Backend'e POST)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Sadece Frontend mock'lamıyoruz, backend'e upload isteği atacağız!
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      setIsUploading(true);
      // Use relative URL if same origin, otherwise fallback to localhost:3001
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
      const res = await fetch(`${baseUrl}/business/upload`, {
        method: 'POST',
        body: uploadData,
      });

      if (!res.ok) {
        console.error('Logo upload failed with status', res.status);
        throw new Error(`Yükleme başarısız oldu (status ${res.status})`);
      }

      const data = await res.json();

      // Backend'in gönderdiği URL'yi form datasına ekle
      setFormData(prev => ({ ...prev, logoUrl: data.url }));

    } catch (err) {
      console.error(err);
      alert('Logo yüklenirken hata oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  // Validasyon: Tüm alanlar dolmadan (11 hane telefon dahil) İleri tuşu aktif olmaz
  const isFormComplete =
    formData.name.trim() !== '' &&
    formData.phone.replace(/\D/g, '').length === 11 &&
    formData.address.trim() !== '' &&
    formData.city.trim() !== '' &&
    formData.district.trim() !== '' &&
    formData.description.trim() !== '' &&
    // logoUrl optional now
    !isUploading;


  return (
    <div className="w-full max-w-3xl bg-white rounded-3xl shadow-sm p-8 md:p-12 border border-gray-100">

      <h2 className="text-3xl font-extrabold text-gray-900 mb-10 tracking-tight">İşletme Bilgileri</h2>

      <div className="flex flex-col gap-10">

        {/* Satır 1: Ad ve Telefon */}
        <div className="flex flex-col md:flex-row gap-8">
          <SetupInput label="İŞLETME ADI" name="name" placeholder="Örn: Parlak Oto Yıkama" value={formData.name} onChange={handleChange} />
          <SetupInput
            label="TELEFON NUMARASI"
            name="phone"
            type="tel"
            maxLength={11}
            placeholder="05XX XXX XX XX"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Satır 2: Adres */}
        <SetupInput label="TAM ADRES" name="address" placeholder="Cadde, sokak, no..." value={formData.address} onChange={handleChange} />

        {/* Satır 3: İl ve İlçe (Artık Seçimli Değil, Yazılı) */}
        <div className="flex flex-col md:flex-row gap-8">
          <SetupInput label="İL" name="city" placeholder="Örn: İstanbul" value={formData.city} onChange={handleChange} />
          <SetupInput label="İLÇE" name="district" placeholder="Örn: Kadıköy" value={formData.district} onChange={handleChange} />
        </div>

        {/* Satır 4: Açıklama */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="description" className="text-xs font-bold text-gray-700 uppercase tracking-wide cursor-pointer">İŞLETME AÇIKLAMASI</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Müşterilerinize kendinizi tanıtın..."
            rows={2}
            className="w-full pb-2 border-b border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#0A58CA] transition-colors bg-transparent resize-none"
          />
        </div>

        {/* Satır 5: Logo */}
        <div className="flex flex-col gap-3 w-full">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">İŞLETME LOGOSU</label>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`w-full border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${isUploading ? 'opacity-50 bg-gray-50' : 'hover:bg-gray-50'
              }`}
          >
            {isUploading ? (
              <span className="font-bold text-[#0A58CA]">Yükleniyor...</span>
            ) : formData.logoUrl ? (
              <div className="flex flex-col items-center gap-2">
                <img src={formData.logoUrl} alt="Logo Önizleme" className="h-16 object-contain rounded" />
                <span className="text-xs text-[#0A58CA] tracking-wide underline font-semibold mt-2">Değiştir</span>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-blue-50 text-[#0A58CA] rounded-full flex items-center justify-center mb-1">
                  <Upload size={20} />
                </div>
                <span className="font-bold text-gray-900 text-sm">Logo Yükle</span>
                <span className="text-xs text-gray-500 font-medium tracking-wide">PNG, JPG (En fazla 2MB)</span>
              </>
            )}
          </div>
        </div>

        {/* Buton */}
        <div className="mt-4">
          <Button
            onClick={handleNextClick}
            disabled={!isFormComplete}
            className="w-full py-4 text-base font-bold flex items-center justify-center gap-2"
          >
            İşletmemi Oluştur
            <span className="font-sans text-xl leading-none">✓</span>
          </Button>
        </div>

      </div>
    </div>
  );
};
