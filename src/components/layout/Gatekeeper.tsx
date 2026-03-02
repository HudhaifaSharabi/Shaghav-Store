"use client";

import { useAppStore } from "@/store/useAppStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Gatekeeper Component
 * 
 * Enforces access control by checking the `isInvited` state from the Zustand store.
 * If a user attempts to access any page other than the home page (`/`) while `isInvited` is false,
 * they are automatically redirected to the home page.
 */
export default function Gatekeeper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isInvited = useAppStore((s) => s.isInvited);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only perform redirect after hydration and if not on the home page
    if (mounted && !isInvited && pathname !== "/") {
      router.replace("/");
    }
  }, [mounted, isInvited, pathname, router]);

  // Prevent flash of protected content during redirect
  if (mounted && !isInvited && pathname !== "/") {
    return (
      <div className="fixed inset-0 bg-[#0A0A0A] z-[9999]" />
    );
  }

  return <>{children}</>;
}
