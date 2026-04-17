"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { jwtDecode } from 'jwt-decode';

const API_BASE = "http://localhost:3001";
const PHONE_PATTERN = /^\d{11}$/;

interface DecodedToken {
    sub?: string | number;
    id?: string | number;
}

interface BusinessRecord {
    id: number;
    userId: number;
    name?: string;
    phone?: string;
    city?: string;
    district?: string;
    address?: string;
    description?: string;
    logoUrl?: string;
}

export default function InfoSettingsPage() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: '',
        district: '',
        address: '',
        description: '',
        logoUrl: ''
    });
    const [businessId, setBusinessId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [phoneError, setPhoneError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) return;

                const res = await fetch(`${API_BASE}/business`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json() as BusinessRecord[] | BusinessRecord;
                    const decoded = jwtDecode<DecodedToken>(token);
                    const myId = Number(decoded.sub || decoded.id || 0);

                    const myBus = Array.isArray(data)
                        ? data.find((business) => business.userId === myId)
                        : (data.userId === myId ? data : null);

                    if (myBus) {
                        setBusinessId(myBus.id);
                        setFormData({
                            name: myBus.name || '',
                            phone: myBus.phone || '',
                            city: myBus.city || '',
                            district: myBus.district || '',
                            address: myBus.address || '',
                            description: myBus.description || '',
                            logoUrl: myBus.logoUrl || ''
                        });
                    }
                }
            } catch {
                console.log("Veri çekme hatası veya henüz kayıt yok.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            const normalized = value.replace(/\D/g, '').slice(0, 11);
            setFormData({ ...formData, phone: normalized });
            setPhoneError(
                normalized.length === 0 || PHONE_PATTERN.test(normalized)
                    ? null
                    : 'Telefon numarası 11 haneli olmalıdır.'
            );
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.phone && !PHONE_PATTERN.test(formData.phone)) {
            setPhoneError('Telefon numarası 11 haneli olmalıdır.');
            return;
        }

        setIsSaving(true);
        try {
            const token = localStorage.getItem('access_token');
            const decoded = jwtDecode<DecodedToken>(token!);
            const userId = Number(decoded.sub || decoded.id || 0);

            const payload = { ...formData, userId };
            const url = businessId ? `${API_BASE}/business/${businessId}` : `${API_BASE}/business`;
            const method = businessId ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Bilgiler güncellendi!");
                if (!businessId) window.location.reload();
                return;
            }

            const errorData = await res.json() as { message?: string };
            alert(errorData.message || 'Bilgiler güncellenemedi.');
        } catch (error) {
            console.error("Kaydetme hatası:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-12 text-center text-[#0A58CA] font-medium">Yükleniyor...</div>;

    return (
        <div className="w-full p-6 lg:p-10 flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-gray-800">İşletme Profili</h1>

            <form onSubmit={handleSubmit} className="w-full max-w-4xl flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">İşletme Adı</label>
                        <input name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border text-gray-900 border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#0A58CA] transition-all" required />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Telefon Numarası</label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            inputMode="numeric"
                            maxLength={11}
                            placeholder="05XXXXXXXXX"
                            className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#0A58CA] transition-all"
                        />
                        {phoneError ? (
                            <span className="text-sm font-medium text-red-500">{phoneError}</span>
                        ) : null}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">İl</label>
                        <input name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border text-gray-900 border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#0A58CA] transition-all" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">İlçe</label>
                        <input name="district" value={formData.district} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border text-gray-900 border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#0A58CA] transition-all" />
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tam Adres</label>
                        <input name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border text-gray-900 border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#0A58CA] transition-all" />
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">İşletme Açıklaması</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#0A58CA] transition-all resize-none" />
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                        <Button type="submit" disabled={isSaving || Boolean(phoneError)} className="px-12 py-4 shadow-lg shadow-blue-100">
                            {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Uygula'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}