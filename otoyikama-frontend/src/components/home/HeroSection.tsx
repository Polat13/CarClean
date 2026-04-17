"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export const HeroSection = () => {
  const router = useRouter();

  return (
    // DIŞ KAPSAYICI: flex ve justify-center ile içindeki bloğu ekranın tam ortasında tutar.
    // lg:px-[100px] ile orijinal halinden tam olarak o istediğin ~20px-30px içeri itme efektini verdik.
    <section className="w-full min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#F8FAFC] to-[#EDF2F7] flex items-center justify-center px-6 lg:px-[100px] py-16">
      
      {/* İÇ KAPSAYICI: justify-between ile yazıyı sola, resmi sağa yaslıyoruz. 
          max-w-[1440px] ile ultrawide monitörlerde ekranın dışına taşmasını engelledik. */}
      <div className="w-full max-w-[1440px] flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
        
        {/* SOL KISIM: Yazılar (w-[45%] ile resme biraz daha nefes alanı bıraktık) */}
        <div className="flex flex-col gap-6 w-full lg:w-[45%]">
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#0D9488] tracking-widest uppercase">
              PREMIUM ARAÇ BAKIMI
            </span>
          </div>

          <h1 className="text-5xl lg:text-[4.5rem] font-extrabold leading-[1.1] tracking-tight text-[#1E293B]">
            Aracınız İçin <br />
            <span className="text-[#0A58CA]">En İyi Bakım</span>
          </h1>

          <p className="text-lg lg:text-xl text-gray-600 leading-relaxed pr-4">
            CarClean ile saniyeler içinde size en yakın onaylı yıkamacıdan randevu alın, aracınızın parlaklığını koruyun.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
            <Button 
              variant="primary" 
              className="w-full sm:w-auto px-8 py-4 text-base font-bold shadow-lg shadow-blue-500/30"
              onClick={() => {
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                router.push(token ? '/businesses' : '/auth');
              }}
            >
              Randevu Al
            </Button>
            <Button 
              variant="white" 
              className="w-full sm:w-auto px-8 py-4 text-base font-bold shadow-md"
              onClick={() => {
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                router.push(token ? '/businesses/nearby' : '/auth');
              }}
            >
              Yakınımdaki Yıkamacılar
            </Button>
          </div>
        </div>

        {/* SAĞ KISIM: Araba Görseli (justify-end ile en sağa yasladık) */}
        <div className="w-full lg:w-[50%] flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[650px] aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl bg-white border border-gray-100 flex items-center justify-center p-1">
            
            <div className="absolute inset-x-0 top-0 flex justify-center z-10">
              <div className="w-3/5 h-6 bg-white rounded-b-2xl shadow-sm"></div>
            </div>

            <div className="relative w-full h-full rounded-[1.8rem] overflow-hidden">
              <Image 
                src="/images/hero_araba.jpg" 
                alt="Premium Car Wash Concept" 
                fill
                className="object-cover object-center"
                priority 
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};