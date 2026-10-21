'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

type Props = {
  children: React.ReactNode;
};

/**
 * AdminAuthGuard replaces the legacy 4-digit PIN popup.
 * It verifies admin authentication and smoothly redirects unauthorized visitors to the split-screen login page.
 */
export const AdminAuthGuard = ({ children }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = isAdminAuthenticated();
    if (!auth) {
      setIsAuthenticated(false);
      // Redirect to login page with returnUrl
      router.replace(`/login?returnUrl=${encodeURIComponent(pathname || '/dashboard')}`);
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="fixed inset-0 bg-[#090a0f] flex flex-col items-center justify-center z-50 gap-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-[#ccff00]/20 border-t-[#ccff00] animate-spin" />
          <Loader2 className="h-6 w-6 text-[#ccff00] absolute animate-pulse" />
        </div>
        <p className="text-xs text-zinc-400 font-medium tracking-wider uppercase">
          Verifying Executive Access...
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminAuthGuard;
