"use client";

import Link from 'next/link';
import { useRouter ,usePathname } from 'next/navigation'; // Yönlendirme için eklendi
import { Button } from '../ui/Button';

const NavLinks = [
  { label: 'Ana Sayfa', href: '/', isActive: true },
  { label: 'Yıkamacılar', href: '/businesses', isActive: false },
  { label: 'Randevularım', href: '/reservations', isActive: false },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // Şu anki URL'i alıyoruz

  // Eğer sayfa '/auth' ise hiçbir şey render etme (Navbar'ı gizle)
  if (pathname === '/auth') {
    return null;
  }

  return (
    <nav className="w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      
      {/* SOL GRUP: Logo ve Menü Linkleri Yan Yana */}
      <div className="flex items-center gap-12">
        <Link href="/" className="text-2xl font-bold text-[#2A52BE] cursor-pointer">
          CarClean
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {NavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`cursor-pointer text-sm font-medium transition-colors pb-1 ${
                link.isActive
                  ? 'text-[#2A52BE] border-b-2 border-[#2A52BE]'
                  : 'text-gray-600 border-b-2 border-transparent hover:text-[#2A52BE]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* SAĞ GRUP: Butonlar ve Yönlendirmeler */}
      <div className="flex items-center gap-3">
        {/* onClick ile /auth sayfasına gönderiyoruz */}
        <Button 
          variant="primary" 
          onClick={() => router.push('/auth')}
        >
          Giriş Yap
        </Button>
        <Button 
          variant="primary" 
          onClick={() => router.push('/auth')}
        >
          Kayıt Ol
        </Button>
      </div>
      
    </nav>
  );
}