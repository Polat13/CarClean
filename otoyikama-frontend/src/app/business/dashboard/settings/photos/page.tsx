"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { jwtDecode } from 'jwt-decode';
import { CloudUpload, Trash2, Star, Plus, ImageIcon } from 'lucide-react';

const API_BASE = "http://localhost:3001";
const MAX_PHOTOS = 3;

export default function PhotosSettingsPage() {
    const [photos, setPhotos] = useState<string[]>([]);
    const [businessId, setBusinessId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) return;

                const decoded: any = jwtDecode(token);
                const myUserId = parseInt(decoded.sub || decoded.id, 10);

                const res = await fetch(`${API_BASE}/business`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    const myBus = Array.isArray(data)
                        ? data.find((b: any) => b.userId === myUserId)
                        : (data.userId === myUserId ? data : null);

                    if (myBus) {
                        setBusinessId(myBus.id);
                        setPhotos(myBus.photos || []);
                    }
                }
            } catch (error) {
                console.error("Fotoğraflar çekilemedi:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Dosya yükleme: Backend'in /business/upload endpoint'ine gönder, URL'yi al
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const availableSlots = MAX_PHOTOS - photos.length;
        const filesToUpload = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, availableSlots);

        if (filesToUpload.length === 0) {
            if (photos.length >= MAX_PHOTOS) alert(`En fazla ${MAX_PHOTOS} fotoğraf yükleyebilirsiniz.`);
            return;
        }

        const token = localStorage.getItem('access_token');
        const newUrls: string[] = [];

        for (const file of filesToUpload) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                const res = await fetch(`${API_BASE}/business/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData,
                });

                if (res.ok) {
                    const data = await res.json();
                    newUrls.push(data.url);
                }
            } catch (error) {
                console.error("Yükleme hatası:", error);
            }
        }

        if (newUrls.length > 0) {
            setPhotos(prev => [...prev, ...newUrls]);
        }

        // Input'u sıfırla
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!businessId) return alert("İşletme bulunamadı!");
        setIsSaving(true);

        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${API_BASE}/business/${businessId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ photos })
            });

            if (res.ok) {
                alert("İşletme fotoğraflarınız başarıyla güncellendi! 📸");
            } else {
                const err = await res.json();
                alert(`Hata: ${err.message}`);
            }
        } catch (error) {
            console.error("Güncelleme Hatası:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-12 text-center text-[#0A58CA] font-bold">Veriler yükleniyor...</div>;

    return (
        <div className="w-full flex flex-col items-center p-8 lg:p-12">
            <div className="w-full max-w-4xl pb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">Fotoğraf Galerisi</h1>
                <p className="text-gray-500 font-medium">Profilinizde görünecek fotoğrafları ekleyin veya silin. (En fazla {MAX_PHOTOS} fotoğraf)</p>
            </div>

            {/* Gizli Dosya Seçici */}
            <input
                type="file"
                multiple
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
            />

            <div className="w-full max-w-4xl bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100 flex flex-col gap-8">

                {/* Fotoğraf Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full min-h-[300px]">

                    {/* Mevcut Fotoğraflar */}
                    {photos.map((url, index) => (
                        <div key={index} className="relative w-full h-[220px] lg:h-[260px] rounded-2xl overflow-hidden shadow-sm group border border-gray-100">
                            <img src={url} alt={`Fotoğraf ${index + 1}`} className="w-full h-full object-cover" />
                            {index === 0 && (
                                <div className="absolute top-3 left-3 bg-[#0A58CA] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm uppercase tracking-wider">
                                    <Star size={12} className="fill-white" /> KAPAK
                                </div>
                            )}
                            <button
                                onClick={() => removePhoto(index)}
                                className="cursor-pointer absolute top-3 right-3 bg-white/90 p-2 rounded-xl text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}

                    {/* Boş Slotlar */}
                    {Array.from({ length: MAX_PHOTOS - photos.length }).map((_, index) => (
                        <div
                            key={`empty-${index}`}
                            onClick={() => fileInputRef.current?.click()}
                            className="cursor-pointer w-full h-[220px] lg:h-[260px] rounded-2xl border-2 border-dashed border-[#C7D2FE] bg-[#F8FAFC] hover:bg-blue-50 flex flex-col items-center justify-center gap-3 transition-colors"
                        >
                            <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center text-[#0A58CA]">
                                <CloudUpload size={28} />
                            </div>
                            <span className="font-bold text-gray-600 text-sm">Fotoğraf Ekle</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">PNG, JPG, WEBP</span>
                        </div>
                    ))}
                </div>

                {/* Kaydet Butonu */}
                <div className="flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-12 py-4 shadow-lg shadow-blue-100 font-bold"
                    >
                        {isSaving ? 'Kaydediliyor...' : 'Fotoğrafları Kaydet'}
                    </Button>
                </div>
            </div>
        </div>
    );
}