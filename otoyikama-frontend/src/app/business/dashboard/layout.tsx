import React from 'react';
import { Sidebar } from '@/components/business/dashboard/Sidebar';

export default function BusinessDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // Ekranı taşmamasını ve yan yana dizilmeyi sağlar
        <div className="flex w-full h-screen bg-[#F8FAFC] overflow-hidden">
            {/* Sol Menü */}
            <Sidebar />

            {/* Sağ İçerik Alanı (Kalan tüm boşluğu kaplar ve kendi içinde kaydırılabilir olur) */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto">
                {children}
            </main>
        </div>
    );
}