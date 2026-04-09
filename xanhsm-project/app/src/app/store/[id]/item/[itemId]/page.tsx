"use client";

/**
 * Screen 4: Food item detail page
 * Shows large photo, name, price, description, optional note, quantity selector, and add-to-cart.
 */
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatVND } from "@/lib/format";
import stores from "@/data/stores.json";
import allMenuItems from "@/data/menu_items.json";
import type { Store, MenuItem } from "@/types";

export default function ItemPage() {
  const params = useParams<{ id: string; itemId: string }>();
  const storeId = params?.id ?? "";
  const itemId = params?.itemId ?? "";
  const router = useRouter();

  const store = (stores as Store[]).find((s) => s.id === storeId);
  const menuData = allMenuItems as Record<string, MenuItem[]>;
  const item = (menuData[storeId] ?? []).find((m) => m.id === itemId);

  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");

  const addItem = useCartStore((s) => s.addItem);
  const totalQty = useCartStore((s) => s.totalQty());

  if (!store || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Không tìm thấy món ăn.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Add the item qty times (addItem increments by 1 each call)
    for (let i = 0; i < qty; i++) {
      addItem({
        itemId: item.id,
        storeId,
        storeName: store.shortName,
        name: item.name,
        image: item.image,
        price: item.price,
        note,
      });
    }
    router.push(`/store/${storeId}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero image */}
      <div className="relative w-full h-64 md:h-80 bg-gray-200 shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Overlay buttons */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Link
            href={`/store/${storeId}`}
            className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition"
            aria-label="Quay lại"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
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
          <button className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 px-4 py-4 max-w-2xl mx-auto w-full pb-32">
        {/* Name and price */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-xl font-bold text-gray-900 leading-tight flex-1">{item.name}</h1>
          <div className="text-right shrink-0">
            <p className="text-[#00BCD4] font-bold text-xl">{formatVND(item.price)}</p>
            {item.originalPrice > item.price && (
              <p className="text-gray-400 text-sm line-through">{formatVND(item.originalPrice)}</p>
            )}
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-gray-500 text-sm mb-4">{item.description}</p>
        )}

        {/* Note input */}
        <div className="border border-gray-200 rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-800 text-sm">Thêm lưu ý cho quán</span>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Không bắt buộc</span>
          </div>
          <div className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Quán sẽ cố gắng đáp ứng yêu cầu."
              rows={2}
              className="flex-1 bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-50">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          {/* Price */}
          <span className="text-[#00BCD4] font-bold text-lg">{formatVND(item.price * qty)}</span>

          {/* Quantity control */}
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-full bg-[#E0F7FA] text-[#00BCD4] flex items-center justify-center text-xl font-bold hover:bg-[#b2ebf2] transition"
              aria-label="Giảm số lượng"
            >
              −
            </button>
            <span className="text-gray-800 font-bold text-lg w-6 text-center">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-9 h-9 rounded-full bg-[#E0F7FA] text-[#00BCD4] flex items-center justify-center text-xl font-bold hover:bg-[#b2ebf2] transition"
              aria-label="Tăng số lượng"
            >
              +
            </button>
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#00BCD4] text-white font-bold py-3 rounded-full hover:bg-[#0097A7] transition shadow text-sm"
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
}
