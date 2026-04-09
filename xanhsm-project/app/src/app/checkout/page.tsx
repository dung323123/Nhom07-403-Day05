"use client";

/**
 * Checkout page — mock order confirmation form.
 * Collects delivery address, payment method, and shows order summary.
 */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatVND } from "@/lib/format";

const PAYMENT_METHODS = [
  { id: "cod", label: "Tiền mặt khi nhận hàng", icon: "💵" },
  { id: "momo", label: "Ví MoMo", icon: "💜" },
  { id: "zalopay", label: "ZaloPay", icon: "🔵" },
  { id: "card", label: "Thẻ tín dụng / ghi nợ", icon: "💳" },
];

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const clearCart = useCartStore((s) => s.clearCart);
  const router = useRouter();

  const [address, setAddress] = useState("Tòa S2.17 - The Sapphire 2, Vinhomes Ocean Park");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [note, setNote] = useState("");
  const [isOrdered, setIsOrdered] = useState(false);

  const deliveryFee = 15000;
  const grandTotal = totalPrice + deliveryFee;

  const handleOrder = () => {
    if (!address.trim() || !phone.trim()) return;
    // Mock order submission
    clearCart();
    setIsOrdered(true);
  };

  /** Order success screen */
  if (isOrdered) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center gap-5">
        <div className="text-7xl">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900">Đặt hàng thành công!</h1>
        <p className="text-gray-500">Đơn hàng của bạn đang được xử lý.<br />Shipper sẽ đến trong 20-30 phút.</p>
        <div className="bg-white rounded-2xl shadow p-5 w-full max-w-sm">
          <p className="text-sm text-gray-500 mb-1">Thời gian giao hàng dự kiến</p>
          <p className="text-[#00BCD4] font-bold text-2xl">20-30 phút</p>
        </div>
        <Link
          href="/"
          className="bg-[#00BCD4] text-white font-bold px-8 py-3 rounded-full hover:bg-[#0097A7] transition shadow"
        >
          Về trang chủ
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Giỏ hàng trống. Không thể thanh toán.</p>
        <Link href="/" className="bg-[#00BCD4] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#0097A7] transition">
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-[#00BCD4] text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-50 shadow">
        <Link href="/cart" className="p-1 hover:bg-white/20 rounded-full transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="font-bold text-lg">Xác nhận đơn hàng</h1>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 pb-40 space-y-4">
        {/* Delivery address */}
        <section className="bg-white rounded-xl shadow-sm px-4 py-4">
          <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>📍</span> Địa chỉ giao hàng
          </h2>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Nhập địa chỉ giao hàng"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#00BCD4] focus:ring-1 focus:ring-[#00BCD4] transition mb-3"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Số điện thoại nhận hàng"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#00BCD4] focus:ring-1 focus:ring-[#00BCD4] transition"
          />
        </section>

        {/* Order items summary */}
        <section className="bg-white rounded-xl shadow-sm px-4 py-4">
          <h2 className="font-bold text-gray-800 mb-3">🍱 Đơn hàng ({items.length} món)</h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.itemId} className="flex justify-between text-sm text-gray-700">
                <span className="flex-1 line-clamp-1">{item.name} × {item.qty}</span>
                <span className="font-semibold shrink-0 ml-2">{formatVND(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Payment method */}
        <section className="bg-white rounded-xl shadow-sm px-4 py-4">
          <h2 className="font-bold text-gray-800 mb-3">💳 Phương thức thanh toán</h2>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method.id}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${
                  paymentMethod === method.id
                    ? "border-[#00BCD4] bg-[#E0F7FA]"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={() => setPaymentMethod(method.id)}
                  className="accent-[#00BCD4]"
                />
                <span className="text-xl">{method.icon}</span>
                <span className="text-sm font-medium text-gray-700">{method.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Order note */}
        <section className="bg-white rounded-xl shadow-sm px-4 py-4">
          <h2 className="font-bold text-gray-800 mb-3">📝 Ghi chú đơn hàng</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Ví dụ: Giao trước 12h, gọi trước khi đến..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 placeholder-gray-400 outline-none focus:border-[#00BCD4] focus:ring-1 focus:ring-[#00BCD4] transition resize-none"
          />
        </section>

        {/* Price breakdown */}
        <section className="bg-white rounded-xl shadow-sm px-4 py-4">
          <h2 className="font-bold text-gray-800 mb-3">Tóm tắt thanh toán</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính</span>
              <span>{formatVND(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí giao hàng</span>
              <span>{formatVND(deliveryFee)}</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900 text-base">
              <span>Tổng cộng</span>
              <span className="text-[#00BCD4]">{formatVND(grandTotal)}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Confirm order button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-50">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleOrder}
            disabled={!address.trim() || !phone.trim()}
            className="w-full bg-[#00BCD4] text-white font-bold py-4 rounded-full hover:bg-[#0097A7] transition shadow text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Đặt hàng • {formatVND(grandTotal)}
          </button>
        </div>
      </div>
    </div>
  );
}
