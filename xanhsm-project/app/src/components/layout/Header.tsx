"use client";

/**
 * Top navigation header shared across all pages.
 * Shows delivery address, cart icon with item count badge, and wishlist icon.
 */
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

interface HeaderProps {
  /** Delivery address displayed in header */
  address?: string;
  /** Whether to show back arrow instead of address */
  showBack?: boolean;
  /** Route for back arrow */
  backHref?: string;
}

export default function Header({
  address = "Tòa S2.17 - The Sapphire 2",
  showBack = false,
  backHref = "/",
}: HeaderProps) {
  /** Get total cart quantity from global store */
  const totalQty = useCartStore((s) => s.totalQty());

  return (
    <header className="bg-[#00BCD4] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Back arrow or spacer */}
        {showBack ? (
          <Link href={backHref} className="p-1 rounded-full hover:bg-white/20 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        ) : (
          <button className="p-1 rounded-full hover:bg-white/20 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Address section */}
        <div className="flex-1">
          <p className="text-xs text-white/80">Giao đến:</p>
          <button className="flex items-center gap-1 font-semibold text-sm truncate max-w-xs">
            <span className="truncate">{address}</span>
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Wishlist icon */}
        <button className="p-1 rounded-full hover:bg-white/20 transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Cart icon with badge */}
        <Link href="/cart" className="relative p-1 rounded-full hover:bg-white/20 transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {/* Badge — only shown when cart has items */}
          {totalQty > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {totalQty > 99 ? "99+" : totalQty}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
