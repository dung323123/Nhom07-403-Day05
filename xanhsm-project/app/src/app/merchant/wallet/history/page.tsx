/**
 * Transaction history page — full list of wallet transactions.
 */
"use client";
import { useRouter } from "next/navigation";
import MerchantShell from "@/components/merchant/layout/MerchantShell";
import TransactionRow from "@/components/merchant/wallet/TransactionRow";
import { useMerchantWalletStore } from "@/store/merchantWalletStore";

export default function WalletHistoryPage() {
  const router = useRouter();
  const transactions = useMerchantWalletStore((s) => s.transactions);

  return (
    <MerchantShell>
      {/* Header */}
      <div className="bg-white flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-1">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-semibold text-gray-900">Lịch sử giao dịch</h1>
      </div>

      <div className="mt-2 bg-white rounded-xl mx-4 shadow-sm overflow-hidden">
        {transactions.length === 0 ? (
          <p className="px-4 py-8 text-sm text-gray-400 text-center">
            Chưa có giao dịch nào.
          </p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {transactions.map((tx) => (
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
