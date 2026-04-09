/**
 * Merchant login page — phone-only login (no OTP).
 * Entering a valid phone number immediately logs in.
 */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMerchantAuthStore } from "@/store/merchantAuthStore";

export default function MerchantLoginPage() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const login = useMerchantAuthStore((s) => s.login);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 9 || digits.length > 12) {
      setError("Số điện thoại không hợp lệ.");
      return;
    }
    login(phone.trim());
    router.replace("/merchant");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Teal header */}
      <div className="bg-teal-400 px-6 pt-14 pb-10 text-white">
        <h1 className="text-2xl font-bold">Đăng nhập</h1>
        <p className="mt-1 text-sm opacity-80">Nhập số điện thoại của bạn để tiếp tục</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 px-6 pt-8 max-w-sm mx-auto w-full">
        {/* Phone input */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Số điện thoại
        </label>
        <input
          type="tel"
          inputMode="numeric"
          placeholder="VD: 0901 234 567"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); setError(""); }}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
          autoFocus
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={phone.trim().length === 0}
          className="mt-6 w-full bg-teal-400 hover:bg-teal-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Tiếp tục
        </button>

        <p className="mt-6 text-center text-xs text-gray-400 leading-relaxed">
          Bằng cách tiếp tục, bạn đồng ý với{" "}
          <span className="text-teal-500">Điều khoản sử dụng</span> của Xanh SM Merchant.
        </p>
      </form>
    </div>
  );
}
