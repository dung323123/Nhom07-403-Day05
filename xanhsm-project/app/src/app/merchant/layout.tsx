/**
 * Isolated layout for the /merchant section.
 * Does NOT inherit the consumer Header — uses its own MerchantHeader,
 * MerchantSidebar (desktop), and MerchantBottomNav (mobile/tablet).
 * Auth guard: redirects unauthenticated users to /merchant/login.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xanh SM Merchant",
};

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Render children — auth guard is done client-side in MerchantGuard because
    // this server component cannot read Zustand state.
    <>{children}</>
  );
}
