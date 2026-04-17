import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, type = 'text', className = '', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    // Flex-col ve gap ile margin kullanımını sıfırladık
    <div className="flex flex-col gap-2 w-full">
      <label className="text-xs font-bold text-[#1F6E43] uppercase tracking-wide">
        {label}
      </label>
      <div className="relative flex items-center w-full">
        <input
          type={inputType}
          className={`w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-[#0A58CA] focus:ring-1 focus:ring-[#0A58CA] transition-colors ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            // Interactive Clarity Rule (cursor-pointer)
            className="absolute right-4 text-gray-400 hover:text-gray-600 cursor-pointer flex items-center justify-center"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};