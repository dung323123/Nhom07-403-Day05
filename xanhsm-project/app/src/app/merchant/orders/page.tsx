/**
 * Order list page — tabs: New | In-progress | History.
 * Accept all, per-order accept, and store status toggle.
 */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MerchantShell from "@/components/merchant/layout/MerchantShell";
import OrderCard from "@/components/merchant/orders/OrderCard";
import { useMerchantOrderStore } from "@/store/merchantOrderStore";

type Tab = "new" | "confirmed" | "history";

export default function OrdersPage() {
  const router = useRouter();
  const { orders, storeStatus, toggleStoreStatus, acceptOrder, acceptAll } =
    useMerchantOrderStore();

  const [tab, setTab] = useState<Tab>("new");

  const newOrders = orders.filter((o) => o.status === "new");
  const confirmedOrders = orders.filter((o) => o.status === "confirmed");
  const historyOrders = orders.filter(
    (o) => o.status === "history_done" || o.status === "history_cancelled"
  );

  const displayed =
    tab === "new" ? newOrders : tab === "confirmed" ? confirmedOrders : historyOrders;

  const TABS: { key: Tab; label: string; count?: number }[] = [
    { key: "new", label: "Đơn mới", count: newOrders.length },
    { key: "confirmed", label: "Đang xử lý", count: confirmedOrders.length },
    { key: "history", label: "Lịch sử" },
  ];

  return (
    <MerchantShell>
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-semibold text-gray-900">Đơn hàng</h1>
        </div>
        {/* Store on/off toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {storeStatus === "open" ? "Đang mở" : "Đang đóng"}
          </span>
          <button
            onClick={toggleStoreStatus}
            className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors focus:outline-none ${
              storeStatus === "open" ? "bg-teal-400" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                storeStatus === "open" ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 flex">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500"
            }`}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span
                className={`text-[11px] font-bold ${tab === t.key ? "text-teal-500" : "text-gray-400"}`}
              >
                ({t.count})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Accept all banner */}
      {tab === "new" && newOrders.length > 1 && (
        <div className="mx-4 mt-3">
          <button
            onClick={acceptAll}
            className="w-full bg-teal-400 hover:bg-teal-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
          >
            Xác nhận tất cả ({newOrders.length} đơn)
          </button>
        </div>
      )}

      {/* List */}
      <div className="p-4 space-y-3">
        {displayed.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            {tab === "new"
              ? "Không có đơn mới."
              : tab === "confirmed"
              ? "Không có đơn đang xử lý."
              : "Chưa có lịch sử đơn hàng."}
          </div>
        ) : (
          displayed.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAccept={tab === "new" ? acceptOrder : undefined}
            />
          ))
        )}
      </div>
    </MerchantShell>
  );
}
