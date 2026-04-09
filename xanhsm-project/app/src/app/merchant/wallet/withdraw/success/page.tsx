/**
 * Withdraw success page — shown after a successful withdrawal.
 */
"use client";
import Link from "next/link";
import MerchantShell from "@/components/merchant/layout/MerchantShell";
import { useMerchantWalletStore } from "@/store/merchantWalletStore";
import { formatCurrency } from "@/lib/format";

export default function WithdrawSuccessPage() {
  const lastWithdrawal = useMerchantWalletStore((s) => s.lastWithdrawal);

  return (
    <MerchantShell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-900">Yêu cầu rút tiền thành công!</h2>
        <p className="text-sm text-gray-400 mt-2">
          Tiền sẽ được chuyển về tài khoản trong 1–2 ngày làm việc
        </p>

        {lastWithdrawal && (
          <div className="mt-6 w-full max-w-xs bg-teal-50 rounded-xl p-4 text-left space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Số tiền</span>
              <span className="font-bold text-teal-600">{formatCurrency(lastWithdrawal.amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Mã GD</span>
              <span className="font-medium text-gray-700">{lastWithdrawal.txCode}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Ngày</span>
              <span className="font-medium text-gray-700">{lastWithdrawal.date}</span>
            </div>
          </div>
        )}

        <div className="mt-8 w-full max-w-xs space-y-2">
          <Link
            href="/merchant/wallet/history"
            className="flex items-center justify-center w-full border border-teal-400 text-teal-500 font-semibold py-3 rounded-xl hover:bg-teal-50 transition-colors"
          >
            Xem lịch sử giao dịch
          </Link>
          <Link
            href="/merchant"
            className="flex items-center justify-center w-full bg-teal-400 hover:bg-teal-500 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </MerchantShell>
  );
}
