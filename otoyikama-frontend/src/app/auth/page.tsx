"use client";

import React, { useState } from 'react';
import { AuthBanner } from '@/components/auth/AuthBanner';
import { AuthForm } from '@/components/auth/AuthForm';
import { UserRole } from '@/constants/enums';

export default function AuthPage() {
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);



  return (
    // Ana kapsayıcı - Full ekran, ikiye bölünmüş. Sıfır margin kuralı aktif.
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-white">
      <AuthBanner role={role} />
      <AuthForm role={role} setRole={setRole} />
    </div>
  );
}