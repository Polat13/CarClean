import React from 'react';
import { CalendarDays, BadgeCheck, Bell } from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      icon: <CalendarDays size={28} className="text-[#0A58CA]" />,
      iconBoxClass: "bg-blue-100/60",
      title: "Kolay Randevu",
      description: "Sadece birkaç tıklama ile istediğiniz saatte yerinizi ayırtın."
    },
    {
      icon: <BadgeCheck size={28} className="text-teal-600" />,
      iconBoxClass: "bg-teal-100/60",
      title: "Onaylı Yıkamacılar",
      description: "Kalite standartlarımızdan geçen profesyonel işletmelerle çalışın."
    },
    {
      icon: <Bell size={28} className="text-slate-600" />,
      iconBoxClass: "bg-slate-200/60",
      title: "Anında Bildirim",
      description: "Randevu durumunuzu ve özel kampanyaları anında takip edin."
    }
  ];

  return (
    <section className="w-full bg-white flex justify-center px-6 lg:px-[100px] py-20">
      <div className="w-full max-w-[1440px] grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="flex flex-col gap-6 p-8 lg:p-10 bg-[#F4F6F9] rounded-[2rem] transition-all duration-300 hover:shadow-sm"
          >
            <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center ${feature.iconBoxClass}`}>
               {feature.icon}
            </div>
            
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-bold text-[#1E293B] tracking-tight">
                {feature.title}
              </h3>
              <p className="text-[1.05rem] text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
};
