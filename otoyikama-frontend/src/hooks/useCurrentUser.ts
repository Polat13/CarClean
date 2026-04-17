"use client";

import { usePathname } from "next/navigation";

interface DecodedToken {
  sub?: number | string;
  id?: number | string;
  email?: string;
  role?: string;
  name?: string;
}

export interface CurrentUser {
  id: number | null;
  email: string;
  role: string;
  name: string;
  initials: string;
  isAuthenticated: boolean;
}

const DEFAULT_USER: CurrentUser = {
  id: null,
  email: "",
  role: "",
  name: "",
  initials: "?",
  isAuthenticated: false,
};

const parseJwtPayload = (token: string): DecodedToken | null => {
  try {
    return JSON.parse(atob(token.split(".")[1])) as DecodedToken;
  } catch {
    return null;
  }
};

export function useCurrentUser(): CurrentUser {
  usePathname();

  if (typeof window === "undefined") {
    return DEFAULT_USER;
  }

  const token = localStorage.getItem("access_token");

  if (!token) {
    return DEFAULT_USER;
  }

  const payload = parseJwtPayload(token);

  if (!payload) {
    return DEFAULT_USER;
  }

  const resolvedEmail = payload.email || "";
  const resolvedName = payload.name || resolvedEmail.split("@")[0] || "Kullanıcı";
  const resolvedInitials =
    resolvedName
      .split(" ")
      .filter(Boolean)
      .map((item) => item[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return {
    id: Number(payload.sub || payload.id || 0) || null,
    email: resolvedEmail,
    role: payload.role || "",
    name: resolvedName,
    initials: resolvedInitials,
    isAuthenticated: true,
  };
}
