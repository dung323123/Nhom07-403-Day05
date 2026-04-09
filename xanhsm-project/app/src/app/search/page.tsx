"use client";

/**
 * Screen 2: Search page
 * Active search input, trending keyword chips, and recommended store cards.
 * Client component because we manage the search query in React state.
 */
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import stores from "@/data/stores.json";
import type { Store } from "@/types";

const SUGGESTIONS = [
  "Gà rán",
  "Trà sữa",
  "Bún bò Huế",
  "Nem Nướng",
  "Nem chua rán",
  "Phở bò",
  "Bánh mì",
  "Cơm tấm",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const totalQty = useCartStore((s) => s.totalQty());

  /** Filter stores by query matching name or tags */
  const filtered = (stores as Store[]).filter((s) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Search bar header */}
      <div className="bg-white sticky top-0 z-50 border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-1 text-gray-500 hover:text-gray-800 transition"
          aria-label="Quay lại"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
          <svg className="w-4 h-4 text-[#FF9800] shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
          </svg>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Bạn đang tìm kiếm món gì?"
            className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {/* Cart icon */}
        <Link href="/cart" className="relative p-1 text-[#00BCD4] hover:text-[#0097A7] transition shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {totalQty > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalQty}
            </span>
          )}
        </Link>
      </div>

      {/* Promo strip */}
      <div className="bg-gradient-to-r from-[#E0F7FA] to-[#B2EBF2] px-4 py-2.5 flex items-center justify-between">
        <span className="text-sm font-medium text-[#0097A7]">Bật Mood Đầu Ngày - Giảm Đến 35K</span>
        <svg className="w-4 h-4 text-[#0097A7]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <div className="px-4 py-4 max-w-7xl mx-auto">
        {/* Suggested chips — shown when no query */}
        {!query && (
          <section className="mb-6">
            <h2 className="font-bold text-gray-800 mb-3">Đề xuất cho bạn</h2>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 text-sm text-gray-700 hover:bg-[#E0F7FA] hover:text-[#0097A7] transition"
                >
                  {/* Double chevron icon */}
                  <svg className="w-3 h-3 text-[#FF9800]" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M2 2l3 4-3 4M7 2l3 4-3 4" stroke="currentColor" strokeWidth={1.5} fill="none" strokeLinecap="round" />
                  </svg>
                  {s}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Recommended / filtered stores */}
        <section>
          <h2 className="font-bold text-gray-800 mb-3">
            {query ? `Kết quả cho "${query}"` : "Có thể bạn sẽ thích"}
          </h2>

          {filtered.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-8">Không tìm thấy quán nào phù hợp.</p>
          )}

          {/* 2-col grid on desktop, 1-col on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((store) => (
              <Link
                key={store.id}
                href={`/store/${store.id}`}
                className="flex gap-3 bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition border border-gray-50"
              >
                <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  <Image
                    src={store.thumbnail}
                    alt={store.shortName}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  {store.isPartner && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-[#00BCD4] font-semibold mb-0.5">
                      ✓ {store.partnerLabel}
                    </span>
                  )}
                  <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">
                    {store.shortName}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs text-gray-600">{store.rating}</span>
                    <span className="text-xs text-gray-400">({store.ratingCount})</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
