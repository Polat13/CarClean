"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { jwtDecode } from 'jwt-decode';
import { Plus, Trash2, Clock, Banknote, Save } from 'lucide-react';

const API_BASE = "http://localhost:3001";

interface ServiceRow {
    id?: number;        // Backend'deki ID (varsa mevcut, yoksa yeni)
    name: string;
    price: number;
    duration: number;
    description: string;
    vehicleTypes: string[];
    _isNew?: boolean;   // Frontend-only: yeni eklenen mi?
    _isDeleted?: boolean; // Frontend-only: silinecek mi?
}

export default function ServicesSettingsPage() {
    const [services, setServices] = useState<ServiceRow[]>([]);
    const [businessId, setBusinessId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) return;

                const decoded: any = jwtDecode(token);
                const myUserId = parseInt(decoded.sub || decoded.id, 10);

                // 1. İşletme bilgisini bul
                const busRes = await fetch(`${API_BASE}/business`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (busRes.ok) {
                    const busData = await busRes.json();
                    const myBus = Array.isArray(busData)
                        ? busData.find((b: any) => b.userId === myUserId)
                        : (busData.userId === myUserId ? busData : null);

                    if (myBus?.id) {
                        setBusinessId(myBus.id);

                        // 2. Bu dükkana ait hizmetleri çek
                        const servRes = await fetch(`${API_BASE}/services/business/${myBus.id}`);
                        if (servRes.ok) {
                            const servData = await servRes.json();
                            setServices(servData.map((s: any) => ({
                                id: s.id,
                                name: s.name,
                                price: s.price,
                                duration: s.duration,
                                description: s.description || '',
                                vehicleTypes: s.vehicleTypes || [],
                                _isNew: false,
                                _isDeleted: false,
                            })));
                        }
                    }
                }
            } catch (error) {
                console.error("Veri çekme hatası:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Yeni boş hizmet satırı ekle
    const addService = () => {
        setServices(prev => [...prev, {
            name: '',
            price: 0,
            duration: 30,
            description: '',
            vehicleTypes: [],
            _isNew: true,
            _isDeleted: false,
        }]);
    };

    // Hizmet sil — anında backend'den de siler
    const removeService = async (index: number) => {
        const target = services[index];

        if (target._isNew) {
            // Yeni eklenen, henüz backend'de yok — direkt listeden çıkar
            setServices(prev => prev.filter((_, i) => i !== index));
            return;
        }

        // Mevcut olan — anında backend'den sil
        if (target.id) {
            try {
                const token = localStorage.getItem('access_token');
                const res = await fetch(`${API_BASE}/services/${target.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!res.ok) {
                    alert("Hizmet silinirken hata oluştu.");
                    return;
                }
            } catch (error) {
                console.error("Silme hatası:", error);
                alert("Hizmet silinirken bir hata oluştu.");
                return;
            }
        }

        // Başarılıysa UI'dan da kaldır
        setServices(prev => prev.filter((_, i) => i !== index));
    };

    // Input değişimi
    const handleServiceChange = (index: number, field: string, value: any) => {
        setServices(prev => prev.map((s, i) => {
            if (i !== index) return s;
            if (field === 'price') {
                // Sadece rakam kabul et
                const cleaned = String(value).replace(/\D/g, '');
                return { ...s, price: cleaned === '' ? 0 : parseInt(cleaned, 10) };
            }
            if (field === 'duration') {
                const cleaned = String(value).replace(/\D/g, '');
                return { ...s, duration: cleaned === '' ? 0 : parseInt(cleaned, 10) };
            }
            return { ...s, [field]: value };
        }));
    };

    const handleSave = async () => {
        if (!businessId) return alert("İşletme bulunamadı!");
        setIsSaving(true);

        try {
            const token = localStorage.getItem('access_token');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            // 1. Yeni eklenen hizmetleri POST et
            const newServices = services.filter(s => s._isNew && !s._isDeleted && s.name.trim());
            for (const service of newServices) {
                await fetch(`${API_BASE}/services`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        name: service.name,
                        price: service.price,
                        duration: service.duration,
                        description: service.description,
                        vehicleTypes: service.vehicleTypes,
                        businessId,
                    })
                });
            }

            // 2. Mevcut (değişen) hizmetleri PATCH et
            const existingServices = services.filter(s => !s._isNew && !s._isDeleted && s.id);
            for (const service of existingServices) {
                await fetch(`${API_BASE}/services/${service.id}`, {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify({
                        name: service.name,
                        price: service.price,
                        duration: service.duration,
                        description: service.description,
                        vehicleTypes: service.vehicleTypes,
                    })
                });
            }

            // 3. Silinen hizmetleri backend'den sil
            const deletedServices = services.filter(s => s._isDeleted && s.id);
            for (const service of deletedServices) {
                await fetch(`${API_BASE}/services/${service.id}`, {
                    method: 'DELETE',
                    headers,
                });
            }

            alert("Tüm hizmetler başarıyla kaydedildi! 💰");

            // Listeyi yeniden yükle (temiz state)
            const servRes = await fetch(`${API_BASE}/services/business/${businessId}`);
            if (servRes.ok) {
                const servData = await servRes.json();
                setServices(servData.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                    price: s.price,
                    duration: s.duration,
                    description: s.description || '',
                    vehicleTypes: s.vehicleTypes || [],
                    _isNew: false,
                    _isDeleted: false,
                })));
            }
        } catch (error) {
            console.error("Kaydetme hatası:", error);
            alert("Kaydetme sırasında hata oluştu.");
        } finally {
            setIsSaving(false);
        }
    };

    // Görünür (silinmemiş) hizmetler
    const visibleServices = services.filter(s => !s._isDeleted);

    if (isLoading) return <div className="p-12 text-center text-[#0A58CA] font-bold">Hizmetler Yükleniyor...</div>;

    return (
        <div className="w-full p-6 lg:p-10 flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hizmetler ve Fiyatlar</h1>
                    <p className="text-gray-500 text-sm font-medium">İşletmenizde sunulan hizmetleri yönetin.</p>
                </div>
                <Button onClick={addService} variant="outline" className="cursor-pointer flex items-center gap-2 border-[#0A58CA] text-[#0A58CA] font-bold">
                    <Plus size={18} /> Yeni Hizmet Ekle
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {visibleServices.map((service, index) => {
                    // visibleServices dizisindeki index ile orijinal services dizisindeki index'i eşle
                    const originalIndex = services.indexOf(service);

                    return (
                        <div key={service.id || `new-${index}`} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-end gap-4 transition-all hover:border-blue-100">

                            <div className="flex flex-col gap-2 flex-[2] w-full">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Hizmet Adı</label>
                                <input
                                    value={service.name}
                                    onChange={(e) => handleServiceChange(originalIndex, 'name', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900 font-semibold focus:bg-white focus:border-[#0A58CA] transition-colors"
                                    placeholder="Örn: İç-Dış Yıkama"
                                />
                            </div>

                            <div className="flex flex-col gap-2 flex-1 w-full">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                    <Banknote size={12} /> Fiyat (TL)
                                </label>
                            <input
                                    type="text"
                                    inputMode="numeric"
                                    value={service.price || ''}
                                    onChange={(e) => handleServiceChange(originalIndex, 'price', e.target.value)}
                                    placeholder="0"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900 font-semibold focus:bg-white focus:border-[#0A58CA] transition-colors"
                                />
                            </div>

                            <div className="flex flex-col gap-2 flex-1 w-full">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                    <Clock size={12} /> Süre (Dakika)
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={service.duration || ''}
                                    onChange={(e) => handleServiceChange(originalIndex, 'duration', e.target.value)}
                                    placeholder="30"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900 font-semibold focus:bg-white focus:border-[#0A58CA] transition-colors"
                                />
                            </div>

                            <button
                                onClick={() => removeService(originalIndex)}
                                className="cursor-pointer p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors mb-0.5"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    );
                })}

                {visibleServices.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">Henüz bir hizmet eklemediniz.</p>
                    </div>
                )}

                <div className="flex justify-end mt-6">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="cursor-pointer px-12 py-4 shadow-lg shadow-blue-100 font-bold flex items-center gap-2"
                    >
                        <Save size={18} />
                        {isSaving ? 'Kaydediliyor...' : 'Tüm Hizmetleri Kaydet'}
                    </Button>
                </div>
            </div>
        </div>
    );
}