/**
 * Withdraw confirmation page — shows bank details and full balance to withdraw.
 */
"use client";
import { useRouter } from "next/navigation";
import MerchantShell from "@/components/merchant/layout/MerchantShell";
import { useMerchantWalletStore } from "@/store/merchantWalletStore";
import { formatCurrency } from "@/lib/format";
import storeData from "@/data/merchant/merchant_store.json";

export default function WithdrawPage() {
  const router = useRouter();
  const { balance, withdraw } = useMerchantWalletStore();

  const handleConfirm = () => {
    withdraw();
    router.replace("/merchant/wallet/withdraw/success");
  };

  return (
    <MerchantShell>
      {/* Header */}
      <div className="bg-white flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-1">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-semibold text-gray-900">Rút tiền</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Amount */}
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Số tiền rút</p>
          <p className="text-3xl font-bold text-teal-600 mt-1">{formatCurrency(balance)}</p>
          <p className="text-xs text-gray-400 mt-1">Toàn bộ số dư khả dụng</p>
        </div>

        {/* Bank info */}
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase">Tài khoản nhận</p>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Ngân hàng</span>
            <span className="font-medium text-gray-800">{storeData.bankAccount.bank}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Số tài khoản</span>
            <span className="font-medium text-gray-800">{storeData.bankAccount.accountNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Chủ tài khoản</span>
            <span className="font-medium text-gray-800">{storeData.bankAccount.accountName}</span>
          </div>
        </div>

        <p className="text-xs text-center text-gray-400 px-4">
          Tiền sẽ được chuyển trong vòng 1–2 ngày làm việc.
        </p>

        <button
          onClick={handleConfirm}
          disabled={balance <= 0}
          className="w-full bg-teal-400 hover:bg-teal-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl shadow-md transition-colors"
        >
          Xác nhận rút tiền
        </button>
      </div>
    </MerchantShell>
  );
}
