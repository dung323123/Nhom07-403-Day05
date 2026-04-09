/**
 * Transaction detail page — shows full detail of a single withdrawal.
 */
"use client";
import { useRouter, useParams } from "next/navigation";
import MerchantShell from "@/components/merchant/layout/MerchantShell";
import { useMerchantWalletStore } from "@/store/merchantWalletStore";
import { formatCurrency } from "@/lib/format";

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams<{ txId: string }>();
  const getTransactionById = useMerchantWalletStore((s) => s.getTransactionById);
  const tx = getTransactionById(params.txId);

  if (!tx) {
    return (
      <MerchantShell>
        <div className="p-8 text-center text-gray-400">Không tìm thấy giao dịch.</div>
      </MerchantShell>
    );
  }

  const isDone = tx.status === "done";

  const ROWS: { label: string; value: string }[] = [
    { label: "Mã giao dịch", value: tx.txCode },
    { label: "Ngày", value: tx.date },
    { label: "Loại", value: "Rút tiền về tài khoản" },
    { label: "Cửa hàng", value: tx.store },
    { label: "Người nhận", value: tx.recipient },
    { label: "Ngân hàng", value: tx.bank },
    { label: "Số tài khoản", value: tx.account },
    {
      label: "Trạng thái",
      value: isDone ? "Thành công" : "Đã huỷ",
    },
  ];

  return (
    <MerchantShell>
      {/* Header */}
      <div className="bg-white flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-1">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-semibold text-gray-900">Chi tiết giao dịch</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Amount hero */}
        <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col items-center gap-2">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isDone ? "bg-teal-100" : "bg-gray-100"}`}>
            <svg className={`w-7 h-7 ${isDone ? "text-teal-500" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className={`text-2xl font-bold ${isDone ? "text-teal-600" : "text-gray-400 line-through"}`}>
            -{formatCurrency(tx.amount)}
          </p>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${isDone ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
            {isDone ? "Thành công" : "Đã huỷ"}
          </span>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-50">
            {ROWS.map((row) => (
              <li key={row.label} className="flex justify-between items-center px-4 py-3">
                <span className="text-sm text-gray-500">{row.label}</span>
                <span className="text-sm font-medium text-gray-800 text-right max-w-[60%] break-words">
                  {row.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MerchantShell>
  );
}
