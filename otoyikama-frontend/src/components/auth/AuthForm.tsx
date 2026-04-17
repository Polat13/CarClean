"use client";

import React, { useState } from 'react';
import { User, Store } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthMode, UserRole } from '@/constants/enums';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface AuthFormProps {
  role?: UserRole;
  setRole?: (role: UserRole) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ role: externalRole, setRole: externalSetRole }) => {
  const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN);
  const [localRole, setLocalRole] = useState<UserRole>(UserRole.CUSTOMER);
  const role = externalRole !== undefined ? externalRole : localRole;
  const setRole = externalSetRole || setLocalRole;

  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });



  const { login, register, isLoading, error } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === AuthMode.LOGIN) {
        const res = await login(formData.email, formData.password);

        // Token kontrolü ve kayıt
        const finalToken = res?.access_token || res?.token || res?.data?.access_token;

        if (finalToken) {
          localStorage.setItem('access_token', finalToken);
          localStorage.setItem('user_role', role);
          window.location.href = role === UserRole.OWNER ? '/business/dashboard' : '/dashboard';
        } else {
          alert("HATA: Token alınamadı.");
        }
      } else {
        // --- KAYIT VE OTOMATİK SETUP YÖNLENDİRMESİ ---
        if (formData.password !== formData.confirmPassword) {
          alert('Hata: Şifreler uyuşmuyor!');
          return;
        }

        // 1. Önce Kayıt Et
        await register(formData.email, formData.password, role);

        if (role === UserRole.OWNER) {
          // 2. İşletme sahibi ise hemen ardından LOGIN yap ki token oluşsun
          const loginRes = await login(formData.email, formData.password);
          const autoToken = loginRes?.access_token || loginRes?.token || loginRes?.data?.access_token;

          if (autoToken) {
            localStorage.setItem('access_token', autoToken);
            localStorage.setItem('user_role', role);
            // 3. Artık anahtarımız var, Setup'a girebiliriz!
            window.location.href = '/business/setup';
          } else {
            alert('Kayıt başarılı ama oturum açılamadı. Lütfen manuel giriş yapın.');
            setMode(AuthMode.LOGIN);
          }
        } else {
          alert('Kayıt Başarılı! Şimdi giriş yapabilirsiniz.');
          setMode(AuthMode.LOGIN);
        }
      }
    } catch (err) {
      console.error("❌ Auth Hatası:", err);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center p-8">
      <div className="w-full max-w-md flex flex-col gap-8">

        {/* Rol Seçici */}
        <div className="flex bg-gray-100 p-1 rounded-xl w-full">
          <button
            type="button"
            onClick={() => setRole(UserRole.CUSTOMER)}
            className={`cursor-pointer flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${role === UserRole.CUSTOMER ? 'bg-[#0A58CA] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <User size={18} /> Müşteriyim
          </button>
          <button
            type="button"
            onClick={() => setRole(UserRole.OWNER)}
            className={`cursor-pointer flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${role === UserRole.OWNER ? 'bg-[#0052BD] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <Store size={18} /> İşletme Sahibiyim
          </button>
        </div>

        {/* Sekmeler */}
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setMode(AuthMode.LOGIN)}
            className={`cursor-pointer pb-3 px-4 text-sm font-semibold transition-colors ${mode === AuthMode.LOGIN ? 'text-[#0A58CA] border-b-2 border-[#0A58CA]' : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => setMode(AuthMode.REGISTER)}
            className={`cursor-pointer pb-3 px-4 text-sm font-semibold transition-colors ${mode === AuthMode.REGISTER ? 'text-[#0A58CA] border-b-2 border-[#0A58CA]' : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            Kayıt Ol
          </button>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {mode === AuthMode.REGISTER && (
            <Input label="AD SOYAD" name="name" placeholder="Ad-Soyad" value={formData.name} onChange={handleInputChange} required />
          )}
          <Input label="E-POSTA" name="email" type="email" placeholder="E-posta" value={formData.email} onChange={handleInputChange} required />
          <Input label="ŞİFRE" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange} required />

          {mode === AuthMode.REGISTER && (
            <Input label="ŞİFRE TEKRAR" name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleInputChange} required />
          )}

          <Button type="submit" className="w-full py-3 text-base font-bold shadow-md" disabled={isLoading}>
            {isLoading ? 'İşleniyor...' : mode === AuthMode.LOGIN ? 'Giriş Yap' : (role === UserRole.OWNER ? 'İşletme Hesabı Oluştur' : 'Kayıt Ol')}
          </Button>
        </form>
      </div>
    </div>
  );
};