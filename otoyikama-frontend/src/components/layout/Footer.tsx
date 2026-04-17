import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const footerLinks = [
    { name: 'Kullanım Koşulları', path: '/kullanim-kosullari' },
    { name: 'Gizlilik Politikası', path: '/gizlilik-politikasi' },
    { name: 'İletişim', path: '/iletisim' },
  ];

  return (
    <footer className="w-full bg-[#F8FAFC] border-t border-gray-100 py-8 px-6 lg:px-[100px] flex flex-col md:flex-row items-center justify-between gap-4 mt-auto">
      {/* Sol Kısım */}
      <p className="text-sm font-medium text-slate-400 whitespace-nowrap">
        © 2026 CarClean. Tüm hakları saklıdır.
      </p>

      {/* Sağ Kısım (Linkler) */}
      <div className="flex items-center gap-6 md:gap-8">
        {footerLinks.map((link, index) => (
          <Link 
            key={index}
            href={link.path}
            className="text-sm font-medium text-slate-400 hover:text-[#0A58CA] cursor-pointer transition-colors duration-200 whitespace-nowrap"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </footer>
  );
}
