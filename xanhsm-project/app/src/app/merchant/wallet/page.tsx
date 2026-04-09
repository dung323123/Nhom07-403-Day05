/**
 * Wallet home — shows balance, withdraw button, and recent transactions.
 */
"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MerchantShell from "@/components/merchant/layout/MerchantShell";
import TransactionRow from "@/components/merchant/wallet/TransactionRow";
import { useMerchantWalletStore } from "@/store/merchantWalletStore";
import { formatCurrency } from "@/lib/format";
import storeData from "@/data/merchant/merchant_store.json";

export default function WalletPage() {
  const router = useRouter();
  const { balance, transactions } = useMerchantWalletStore();
  const recent = transactions.slice(0, 3);

  return (
    <MerchantShell>
      {/* Header */}
      <div className="bg-white flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-1">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-semibold text-gray-900">Ví cửa hàng</h1>
      </div>

      {/* Balance card */}
      <div className="bg-gradient-to-br from-teal-400 to-teal-500 mx-4 mt-4 rounded-2xl p-5 text-white">
        <p className="text-xs font-medium opacity-80 uppercase tracking-wide">Số dư khả dụng</p>
        <p className="text-3xl font-bold mt-1">{formatCurrency(balance)}</p>
        <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-80">
          <p>{storeData.name}</p>
          <p className="mt-0.5">
            {storeData.bankAccount.bank} · {storeData.bankAccount.accountNumber} · {storeData.bankAccount.accountName}
          </p>
        </div>
      </div>

      {/* Withdraw button */}
      {balance > 0 ? (
        <div className="mx-4 mt-4">
          <Link
            href="/merchant/wallet/withdraw"
            className="flex items-center justify-center gap-2 w-full bg-teal-400 hover:bg-teal-500 text-white font-semibold py-3 rounded-xl shadow-sm transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Rút tiền về tài khoản
          </Link>
        </div>
      ) : (
        <div className="mx-4 mt-4">
          <div className="py-3 text-center text-sm text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            Số dư hiện tại là 0 — không có gì để rút
          </div>
        </div>
      )}

      {/* Recent transactions */}
      <div className="mx-4 mt-4 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">Giao dịch gần đây</h2>
          <Link href="/merchant/wallet/history" className="text-xs text-teal-500 font-medium">
            Xem tất cả
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-4 py-4 text-sm text-gray-400 text-center">Chưa có giao dịch nào.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {recent.map((tx) => (
              <li key={tx.id}>
                <TransactionRow tx={tx} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </MerchantShell>
  );
}
