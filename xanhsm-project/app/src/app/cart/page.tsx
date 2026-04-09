"use client";

/**
 * Cart page — lists all items in the Zustand cart with qty controls and total.
 */
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatVND } from "@/lib/format";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalQty = useCartStore((s) => s.totalQty());

  /** Delivery fee — flat mock */
  const deliveryFee = 15000;
  const grandTotal = totalPrice + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-[#00BCD4] text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-50 shadow">
          <Link href="/" className="p-1 hover:bg-white/20 rounded-full transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="font-bold text-lg">Giỏ hàng</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
          <span className="text-6xl">🛒</span>
          <p className="text-gray-600 font-semibold">Giỏ hàng của bạn đang trống</p>
          <p className="text-gray-400 text-sm">Hãy khám phá các quán ăn và thêm món yêu thích!</p>
          <Link
            href="/"
            className="bg-[#00BCD4] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#0097A7] transition"
          >
            Khám phá ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-[#00BCD4] text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-50 shadow">
        <Link href="/" className="p-1 hover:bg-white/20 rounded-full transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="font-bold text-lg">Giỏ hàng ({totalQty} món)</h1>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-4 pb-40">
        {/* Group by store */}
        {(() => {
          const storeGroups = items.reduce<Record<string, typeof items>>((acc, item) => {
            if (!acc[item.storeId]) acc[item.storeId] = [];
            acc[item.storeId].push(item);
            return acc;
          }, {});

          return Object.entries(storeGroups).map(([storeId, storeItems]) => (
            <div key={storeId} className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
              {/* Store header */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <span className="text-[#00BCD4]">🏪</span>
                <span className="font-semibold text-gray-800 text-sm">{storeItems[0].storeName}</span>
              </div>

              {/* Items */}
              {storeItems.map((item) => (
                <div key={item.itemId} className="px-4 py-3 flex items-center gap-3 border-b border-gray-50 last:border-0">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">{item.name}</p>
                    {item.note && (
                      <p className="text-xs text-gray-400 mt-0.5 italic">"{item.note}"</p>
                    )}
                    <p className="text-[#00BCD4] font-bold text-sm mt-1">{formatVND(item.price)}</p>
                  </div>
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateQty(item.itemId, -1)}
                      className="w-7 h-7 rounded-full border border-[#00BCD4] text-[#00BCD4] flex items-center justify-center text-lg leading-none hover:bg-[#E0F7FA] transition"
                      aria-label="Giảm"
                    >
                      −
                    </button>
                    <span className="text-sm font-bold w-5 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.itemId, 1)}
                      className="w-7 h-7 rounded-full bg-[#00BCD4] text-white flex items-center justify-center text-lg leading-none hover:bg-[#0097A7] transition"
                      aria-label="Tăng"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ));
        })()}

        {/* Order summary */}
        <div className="bg-white rounded-xl shadow-sm px-4 py-4 mb-4">
          <h2 className="font-bold text-gray-800 mb-3">Tóm tắt đơn hàng</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính ({totalQty} món)</span>
              <span>{formatVND(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí giao hàng</span>
              <span>{formatVND(deliveryFee)}</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
              <span>Tổng cộng</span>
              <span className="text-[#00BCD4]">{formatVND(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky checkout button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-50">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <div>
            <p className="text-xs text-gray-400">Tổng tiền</p>
            <p className="text-[#00BCD4] font-bold text-lg">{formatVND(grandTotal)}</p>
          </div>
          <Link
            href="/checkout"
            className="flex-1 bg-[#00BCD4] text-white font-bold py-3 rounded-full text-center hover:bg-[#0097A7] transition shadow text-sm"
          >
            Đặt hàng ngay →
          </Link>
        </div>
      </div>
    </div>
  );
}
