"use client";

import Link from 'next/link';
import { Button } from '../ui/Button';

// Rule #6: Konfigürasyon sözlüğü
const NavLinks = [
  { label: 'Ana Sayfa', href: '/', isActive: true },
  { label: 'Yıkamacılar', href: '/businesses', isActive: false },
  { label: 'Randevularım', href: '/reservations', isActive: false },
];

export default function Navbar() {
  return (
    // Ana kapsayıcı: İçindeki iki ana grubu uçlara yaslar (justify-between)
    <nav className="w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      
      {/* SOL GRUP: Logo ve Menü Linkleri Yan Yana */}
      <div className="flex items-center gap-12">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-[#1D4ED8]">
          CarClean
        </Link>

        {/* Menü (Rule #4: Mobilde gizli, md ve üstü ekranda görünür) */}
        <div className="hidden md:flex items-center gap-6">
          {NavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors pb-1 ${
                link.isActive
                  ? 'text-[#1D4ED8] border-b-2 border-[#1D4ED8]'
                  : 'text-gray-600 border-b-2 border-transparent hover:text-[#2A52BE]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* SAĞ GRUP: Butonlar */}
      <div className="flex items-center gap-3">
        <Button variant="primary">Giriş Yap</Button>
        <Button variant="primary">Kayıt Ol</Button>
      </div>
      
    </nav>
  );
}