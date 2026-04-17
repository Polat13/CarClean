import React from 'react';
import Image from 'next/image';
import { ShieldCheck, BadgeCheck, Smile } from 'lucide-react';
import { UserRole } from '@/constants/enums';

interface AuthBannerProps {
  role?: UserRole;
}

export const AuthBanner: React.FC<AuthBannerProps> = ({ role = UserRole.CUSTOMER }) => {
  const features = [
    { icon: <BadgeCheck size={22} className="text-white" />, text: "500+ Kayıtlı İşletme" },
    { icon: <Smile size={22} className="text-white" />, text: "10.000+ Mutlu Müşteri" },
    { icon: <ShieldCheck size={22} className="text-white" />, text: "Güvenli Ödeme" }
  ];

  const isOwner = role === UserRole.OWNER;

  return (
    <div className="relative hidden lg:flex flex-col w-[40%] bg-[#1A73E8] text-white p-12 justify-between overflow-hidden">

      {/* ÜST KISIM (Logo ve Başlık) */}
      <div className="relative z-10 flex flex-col gap-10">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-xl w-12 h-12 flex items-center justify-center shadow-sm">
            <Image src="/images/ikon.svg" alt="CarClean Logo" width={20} height={25} priority />
          </div>
          <span className="text-[1.75rem] font-bold tracking-wide">CarClean</span>
        </div>

        <div className="flex flex-col gap-5">
          <h1 className="text-[2.75rem] font-bold leading-[1.12]">
            {isOwner ? (
              <>İşletmenizi<br />Dijitalle Büyütün.</>
            ) : (
              <>Aracınız için en iyi<br />bakımı kolayca<br />bulun.</>
            )}
          </h1>
          <p className="text-blue-50 text-[1.05rem] font-normal opacity-90 leading-[1.6]">
            {isOwner ? (
              <>Türkiye'nin en hızlı büyüyen araç temizlik<br />platformunda yerinizi alın, müşteri ağınızı<br />genişletin.</>
            ) : (
              <>Türkiye'nin en geniş oto yıkama ağı ile tanışın.<br />Randevunuzu saniyeler içinde oluşturun.</>
            )}
          </p>
        </div>
      </div>

      {/* ALT KISIM (Bilgi Kartları) */}
      <div className="relative z-10 flex flex-col gap-4">
        {features.map((item, index) => (
          <div key={index} className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm w-full xl:w-[85%]">
            {item.icon}
            <span className="font-medium text-[0.95rem] text-white tracking-wide">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};