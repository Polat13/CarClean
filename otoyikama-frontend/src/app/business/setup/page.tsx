"use client";

import React from 'react';
import { Step1Info } from '@/components/business/setup/Step1Info';
import { jwtDecode } from 'jwt-decode';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export default function BusinessSetupPage() {

    const handleComplete = async (formData: any) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert("Oturum bulunamadı. Lütfen tekrar giriş yapın.");
                window.location.href = '/auth';
                return;
            }

            // JWT'den userId'yi çıkar
            const decoded: any = jwtDecode(token);
            const userId = parseInt(decoded.sub || decoded.id, 10);

            // Backend DTO'suna uygun payload — varsayılan çalışma saatleri ile
            const payload = {
                name: formData.name,
                address: formData.address,
                phone: formData.phone || '',
                city: formData.city || '',
                district: formData.district || '',
                description: formData.description || '',
                logoUrl: formData.logoUrl || '',
                userId,
                openTime: 9,   // Varsayılan: 09:00
                closeTime: 18, // Varsayılan: 18:00
                photos: [],
            };

            const res = await fetch(`${API_BASE}/business`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert("Tebrikler! İşletmeniz başarıyla oluşturuldu. 🎉\nHizmet, saat ve fotoğraf ayarlarını panelden yapabilirsiniz.");
                window.location.href = '/business/dashboard';
            } else {
                const err = await res.json();
                alert(`Hata: ${err.message}`);
            }
        } catch (error) {
            console.error("Kayıt Hatası:", error);
            alert("İşletme oluşturulurken bir hata oluştu.");
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center pt-12 px-4 lg:px-8 pb-20">

            {/* Üst Logo / Başlık */}
            <div className="w-full max-w-3xl flex flex-col items-center gap-2 pb-8">
                <span className="text-2xl font-extrabold text-[#0A58CA] tracking-tight">CarClean</span>
                <p className="text-gray-500 font-medium text-sm text-center">
                    İşletme bilgilerinizi girin ve hemen başlayın.<br />
                    Hizmet, saat ve fotoğraf ayarlarını kayıt sonrası panelden yapabilirsiniz.
                </p>
            </div>

            <Step1Info onNext={handleComplete} />
        </div>
    );
}