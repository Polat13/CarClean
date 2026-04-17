"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Clock,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Store,
  Wrench,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const SIDEBAR_LINKS = [
  { name: "Genel Bakış", href: "/business/dashboard", icon: LayoutDashboard },
  { name: "Randevular", href: "/business/dashboard/appointments", icon: CalendarDays },
  { name: "İşletme Bilgileri", href: "/business/dashboard/settings/info", icon: Store },
  { name: "Hizmetler", href: "/business/dashboard/settings/services", icon: Wrench },
  { name: "Çalışma Saatleri", href: "/business/dashboard/settings/hours", icon: Clock },
  { name: "Fotoğraflar", href: "/business/dashboard/settings/photos", icon: ImageIcon },
] as const;

export const Sidebar = () => {
  const pathname = usePathname();
  const user = useCurrentUser();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  return (
    <aside className="flex h-screen w-[280px] flex-shrink-0 flex-col justify-between border-r border-gray-100 bg-white px-6 py-8">
      <div className="flex flex-col gap-10">
        <Link href="/business/dashboard" className="flex cursor-pointer items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm">
            <Image src="/images/ikon.svg" alt="CarClean Logo" height={25} priority width={20} />
          </div>
          <span className="text-2xl font-extrabold text-gray-900">
            CarClean<span className="text-[#0A58CA]">Biz</span>
          </span>
        </Link>

        <nav className="flex flex-col gap-2">
          {SIDEBAR_LINKS.map((link) => {
            const isActive =
              link.href === "/business/dashboard"
                ? pathname === link.href
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-all ${
                  isActive
                    ? "bg-[#0A58CA] text-white shadow-md"
                    : "text-gray-500 hover:bg-blue-50 hover:text-[#0A58CA]"
                }`}
              >
                <link.icon size={20} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-4 border-t border-gray-100 pt-6">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A58CA] text-sm font-bold uppercase text-white shadow-sm">
            {user.initials}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold capitalize leading-tight text-gray-900">
              {user.name || "İşletme Sahibi"}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
              İşletme Sahibi
            </span>
          </div>
        </div>
        <button
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left font-bold text-red-500 transition-colors hover:bg-red-50"
          onClick={handleLogout}
          type="button"
        >
          <LogOut size={20} />
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
};
