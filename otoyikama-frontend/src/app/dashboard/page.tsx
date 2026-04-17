"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center w-full py-32 gap-6 text-center">
      <div className="bg-green-100 p-6 rounded-full text-green-600">
         {/* Başarı ikonu temsili */}
         <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <h1 className="text-4xl font-bold text-gray-800">Giriş Başarılı!</h1>
      <p className="text-gray-600 text-lg">
        Sisteme başarıyla bağlandınız. Paneliniz burada yer alacak.
      </p>
      
      <div className="py-4">
        <Button variant="outline" onClick={() => router.push('/')}>
          Ana Sayfaya Dön
        </Button>
      </div>
    </div>
  );
}