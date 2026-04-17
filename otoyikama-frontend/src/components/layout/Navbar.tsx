"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";
import { Button } from "../ui/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const NAV_LINKS = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Yıkamacılar", href: "/businesses" },
  { label: "Randevularım", href: "/reservations" },
] as const;

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useCurrentUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // Hydration hatasını önlemek için
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sayfa yüklendiğinde mounted'ı true yap
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Belirli sayfalarda Navbar'ı gizle
  if (
    pathname === "/auth" ||
    pathname.startsWith("/business/setup") ||
    pathname.startsWith("/business/dashboard")
  ) {
    return null;
  }

  const handleLogout = () => {
    localStorage.clear();
    setIsDropdownOpen(false);
    window.location.href = "/";
  };

  // Sunucu tarafında veya ilk yüklemede (mounted false iken) butonları boş render et
  // Bu sayede "Giriş Yap" mı "Profil" mi çelişkisi yaşanmaz
  const renderAuthSection = () => {
    if (!mounted) return <div className="w-20" />; // İlk yüklemede boşluk bırak

    if (user.isAuthenticated) {
      return (
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-gray-50"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            type="button"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A58CA] text-sm font-bold uppercase text-white shadow-sm">
              {user.initials}
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full z-50 pt-2">
              <div className="w-56 overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="truncate text-sm font-bold text-gray-900">{user.email}</p>
                  <p className="text-[11px] font-medium text-gray-400">Müşteri Hesabı</p>
                </div>

                <button
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
                  onClick={handleLogout}
                  type="button"
                >
                  <LogOut size={16} />
                  Çıkış Yap
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <Button onClick={() => router.push("/auth")} variant="primary">
          Giriş Yap
        </Button>
        <Button onClick={() => router.push("/auth")} variant="primary">
          Kayıt Ol
        </Button>
      </div>
    );
  };

  return (
    <nav className="flex w-full items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
      <div className="flex items-center gap-12">
        <Link href="/" className="cursor-pointer text-2xl font-bold text-[#2A52BE]">
          CarClean
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/" ? pathname === link.href : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`cursor-pointer border-b-2 pb-1 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-[#2A52BE] text-[#2A52BE]"
                    : "border-transparent text-gray-600 hover:text-[#2A52BE]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {renderAuthSection()}
      </div>
    </nav>
  );
}