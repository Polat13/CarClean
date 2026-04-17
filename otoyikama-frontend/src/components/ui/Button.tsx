import React from 'react';

// Props arayüzü
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  // YENİ KURAL UYGULANDI: cursor-pointer eklendi
  const baseStyle = "cursor-pointer px-6 py-2.5 rounded-full font-medium transition-colors duration-200 flex items-center justify-center text-sm";
  
  // Varyant sözlüğü (Dictionary Pattern)
  const variants = {
    primary: "bg-[#0052BD] text-white hover:bg-blue-800",
    outline: "border-2 border-[#0A58CA] text-[#0A58CA] hover:bg-blue-50"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};