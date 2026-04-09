"use client";

/**
 * Screen 3: Store / Restaurant detail page
 * Shows hero image, store info, promo strip, tab navigation, and 2-col menu grid.
 */
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatVND } from "@/lib/format";
import stores from "@/data/stores.json";
import allMenuItems from "@/data/menu_items.json";
import StoreChatWidget from "@/components/chat/StoreChatWidget";
import type { Store, MenuItem } from "@/types";

const TABS: { key: string; label: string }[] = [
  { key: "deals", label: "Ưu đãi hôm nay" },
  { key: "new", label: "Món Mới Giảm Đậm" },
  { key: "drinks", label: "Đồ uống" },
];

export default function StorePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const [activeTab, setActiveTab] = useState("deals");

  const store = (stores as Store[]).find((s) => s.id === id);
  const menuData = allMenuItems as Record<string, MenuItem[]>;
  const allItems: MenuItem[] = menuData[id] ?? [];
  const items = allItems.filter((item) => item.tab === activeTab || activeTab === "all");

  const addItem = useCartStore((s) => s.addItem);
  const totalQty = useCartStore((s) => s.totalQty());

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Không tìm thấy quán ăn.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero image with overlay icons */}
      <div className="relative w-full h-56 md:h-72 bg-gray-200">
        <Image
          src={store.image}
          alt={store.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Overlay buttons */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Link
            href="/search"
            className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition"
            aria-label="Quay lại"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex gap-2">
            {/* Cart icon with badge */}
            <Link href="/cart" className="relative w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </Link>
            {/* Share */}
            <button className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            {/* Wishlist */}
            <button className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            {/* Search */}
            <button className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Store info card */}
      <div className="bg-white px-4 pt-4 pb-3 shadow-sm max-w-7xl mx-auto">
        {/* Partner badge */}
        {store.isPartner && (
          <span className="inline-flex items-center gap-1 text-xs text-white bg-[#00BCD4] px-2 py-0.5 rounded-full font-semibold mb-2">
            ✓ {store.partnerLabel}
          </span>
        )}

        <h1 className="text-xl font-bold text-gray-900 leading-tight mb-2">{store.name}</h1>

        {/* Ratings row */}
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3 overflow-x-auto scrollbar-hide">
          <span className="flex items-center gap-1 shrink-0">
            <span className="text-yellow-400">★</span>
            <span className="font-semibold">{store.rating}</span>
            <span className="text-gray-400">({store.ratingCount})</span>
          </span>
          <span className="flex items-center gap-1 shrink-0 text-gray-500">
            <span className="text-blue-500 text-xs font-bold">G</span>
            <span className="font-semibold">{store.googleRating}</span>
            <span className="text-gray-400">({store.googleRatingCount})</span>
          </span>
          <span className="shrink-0">🛍 {store.orders}</span>
          <span className="shrink-0">📍 {store.distance}</span>
          <button className="shrink-0 text-[#00BCD4] font-medium flex items-center gap-0.5">
            Xem thêm
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Promo pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {store.promos.map((promo, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 shrink-0 min-w-[140px]"
            >
              <span className="text-xl">{promo.type === "food" ? "🍱" : "🚚"}</span>
              <div>
                <p className="text-[10px] text-[#00BCD4] font-semibold">{promo.label}</p>
                <p className="text-xs font-bold text-gray-800">{promo.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 max-w-7xl mx-auto">
        <div className="flex overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const hasItems = allItems.some((i) => i.tab === tab.key);
            if (!hasItems && tab.key !== "deals") return null;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  activeTab === tab.key
                    ? "border-[#00BCD4] text-[#00BCD4]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu grid */}
      <div className="px-4 py-4 max-w-7xl mx-auto">
        {items.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Không có món nào trong mục này.</p>
        ) : (
          <>
            <h2 className="font-bold text-gray-800 text-base mb-3">
              {TABS.find((t) => t.key === activeTab)?.label}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/store/${id}/item/${item.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group"
                >
                  {/* Item image */}
                  <div className="relative w-full pt-[80%] bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {/* Discount badge */}
                    {item.discount > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                        Giảm {item.discount}%
                      </span>
                    )}
                    {/* Best seller badge */}
                    {item.isBestSeller && (
                      <span className="absolute bottom-2 left-2 bg-orange-100 text-orange-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        Bán chạy
                      </span>
                    )}
                  </div>

                  {/* Item info */}
                  <div className="p-2">
                    <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight mb-1">
                      {item.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[#00BCD4] font-bold text-sm">{formatVND(item.price)}</span>
                        {item.originalPrice > item.price && (
                          <span className="text-gray-400 text-[11px] line-through ml-1">
                            {formatVND(item.originalPrice)}
                          </span>
                        )}
                      </div>
                      {/* Quick add button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addItem({
                            itemId: item.id,
                            storeId: id,
                            storeName: store.shortName,
                            name: item.name,
                            image: item.image,
                            price: item.price,
                            note: "",
                          });
                        }}
                        className="w-7 h-7 bg-[#00BCD4] text-white rounded-full flex items-center justify-center text-lg leading-none hover:bg-[#0097A7] transition shrink-0 shadow"
                        aria-label={`Thêm ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="h-8" />

      {/* AI Chat Widget — connects to POST /chat backend */}
      <StoreChatWidget merchantId={id} storeName={store.shortName} />
    </div>
  );
}
