"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { jwtDecode } from 'jwt-decode';
import { Sparkles } from 'lucide-react';

// Saat seçenekleri (06:00 - 23:00 arası)
const TIME_OPTIONS = Array.from({ length: 18 }, (_, i) => {
    const hour = (i + 6).toString().padStart(2, '0');
    return [`${hour}:00`, `${hour}:30`];
}).flat();

const API_BASE = "http://localhost:3001";

export default function HoursSettingsPage() {
    const [openTime, setOpenTime] = useState(9);
    const [closeTime, setCloseTime] = useState(18);
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

                // İşletme bilgilerini çek
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
                        setOpenTime(myBus.openTime ?? 9);
                        setCloseTime(myBus.closeTime ?? 18);
                    }
                }
            } catch (error) {
                console.error("Veriler çekilemedi:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

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
                body: JSON.stringify({ openTime, closeTime })
            });

            if (res.ok) {
                alert("Çalışma saatleriniz başarıyla güncellendi! ⏰");
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

    // Mini Component: Saat Seçici
    const TimeSelect = ({ value, onChange, label }: { value: number; onChange: (val: number) => void; label: string }) => (
        <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
                className="cursor-pointer px-5 py-3.5 rounded-xl border border-gray-200 text-base font-bold text-gray-900 focus:outline-none focus:border-[#0A58CA] appearance-none bg-white transition-colors"
            >
                {Array.from({ length: 18 }, (_, i) => i + 6).map(hour => (
                    <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}:00</option>
                ))}
            </select>
        </div>
    );

    if (isLoading) return <div className="p-12 text-center text-[#0A58CA] font-bold">Veriler yükleniyor...</div>;

    return (
        <div className="w-full flex flex-col items-center p-8 lg:p-12">
            <div className="w-full max-w-4xl pb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">Çalışma Saatleri</h1>
                <p className="text-gray-500 font-medium">Dükkanınızın açılış ve kapanış saatlerini yönetin.</p>
            </div>

            <div className="w-full max-w-4xl bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100 flex flex-col gap-10">

                {/* Bilgilendirme Kutusu */}
                <div className="bg-[#EEF2FF] rounded-2xl p-6 flex items-center gap-4 border border-[#E0E7FF]">
                    <div className="w-12 h-12 bg-[#0A58CA] text-white rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                        <Sparkles size={24} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-bold text-[#0A58CA] text-lg">Çalışma Saatleri</h3>
                        <p className="text-sm text-blue-800/70 font-medium">Müşterileriniz bu saatler arasında randevu alabilecektir.</p>
                    </div>
                </div>

                {/* Saat Seçiciler */}
                <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
                    <TimeSelect label="AÇILIŞ SAATİ" value={openTime} onChange={setOpenTime} />

                    <span className="text-gray-300 font-bold text-2xl pb-3 hidden md:block">—</span>

                    <TimeSelect label="KAPANIŞ SAATİ" value={closeTime} onChange={setCloseTime} />
                </div>

                {/* Önizleme */}
                <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-between">
                    <span className="font-bold text-gray-500 text-sm uppercase tracking-wider">ÖNİZLEME</span>
                    <span className="font-extrabold text-gray-900 text-lg">
                        {openTime.toString().padStart(2, '0')}:00 — {closeTime.toString().padStart(2, '0')}:00
                    </span>
                </div>

                {/* Kaydet Butonu */}
                <div className="flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-12 py-4 shadow-lg shadow-blue-100 font-bold"
                    >
                        {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </Button>
                </div>
            </div>
        </div>
    );
}