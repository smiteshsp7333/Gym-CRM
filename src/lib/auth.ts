import { GYM_BRANDING } from "@/config/branding";

export const ADMIN_AUTH_KEY = "admin_session";
export const ADMIN_USER_KEY = "admin_user";
export const MEMBER_ID_KEY = "member_id";

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const session = localStorage.getItem(ADMIN_AUTH_KEY);
  const pin = localStorage.getItem("pin");
  return session === "true" || pin === GYM_BRANDING.adminCredentials.pin;
}

export function loginAdmin(identifier: string, pass: string): boolean {
  if (typeof window === "undefined") return false;
  const cfg = GYM_BRANDING.adminCredentials;
  const isMatch =
    (identifier === cfg.username || identifier === cfg.email || identifier === "admin") &&
    (pass === cfg.password || pass === cfg.pin || pass === "admin123" || pass === "0987");

  if (isMatch) {
    localStorage.setItem(ADMIN_AUTH_KEY, "true");
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify({
      name: "Super Admin",
      email: cfg.email,
      role: "Superadmin",
    }));
    localStorage.setItem("pin", cfg.pin);
    // Set cookie for Next.js routing if needed
    document.cookie = `${ADMIN_AUTH_KEY}=true; path=/; max-age=86400; SameSite=Lax`;
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_AUTH_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
  localStorage.removeItem("pin");
  document.cookie = `${ADMIN_AUTH_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  window.location.href = "/login";
}

export function getAdminUser(): { name: string; email: string; role: string } {
  if (typeof window === "undefined") {
    return { name: "Super Admin", email: "admin@gymdemo.in", role: "Superadmin" };
  }
  const raw = localStorage.getItem(ADMIN_USER_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // ignore
    }
  }
  return { name: "Super Admin", email: GYM_BRANDING.adminCredentials.email, role: "Superadmin" };
}
