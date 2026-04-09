/**
 * Order detail page — shows all items, driver info, customer info,
 * and action buttons (accept / complete / refund).
 */
"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import MerchantShell from "@/components/merchant/layout/MerchantShell";
import { useMerchantOrderStore } from "@/store/merchantOrderStore";
import { formatCurrency } from "@/lib/format";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ orderId: string }>();
  const { orders, acceptOrder, completeOrder, refundOrder } = useMerchantOrderStore();

  const order = orders.find((o) => o.id === params.orderId);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");

  if (!order) {
    return (
      <MerchantShell>
        <div className="p-8 text-center text-gray-400">Không tìm thấy đơn hàng.</div>
      </MerchantShell>
    );
  }

  const handleRefund = () => {
    if (!refundReason.trim()) return;
    refundOrder(order.id, refundReason);
    setShowRefundModal(false);
    router.back();
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
        <h1 className="font-semibold text-gray-900">#{order.code}</h1>
        <span className="ml-auto text-xs font-medium text-gray-400">
          {order.time} · {order.date}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Customer info */}
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase">Khách hàng</p>
          <p className="text-sm text-gray-800 font-medium">{order.customer.name}</p>
          <p className="text-sm text-gray-500">{order.customer.phone}</p>
        </div>

        {/* Driver info */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Tài xế</p>
          {order.driverAssigned ? (
            <>
              <p className="text-sm text-gray-800 font-medium">{order.driver.name}</p>
              <p className="text-sm text-gray-500">{order.driver.phone}</p>
            </>
          ) : (
            <p className="text-sm text-gray-400">Chưa có tài xế</p>
          )}
          {order.driverNote && (
            <p className="mt-1 text-xs text-gray-400 italic">{order.driverNote}</p>
          )}
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <p className="px-4 pt-3 pb-2 text-xs font-semibold text-gray-400 uppercase border-b border-gray-50">
            Danh sách món
          </p>
          <ul className="divide-y divide-gray-50">
            {order.items.map((item, idx) => (
              <li key={idx} className="px-4 py-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-800">
                    {item.qty}× {item.name}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {formatCurrency(item.price * item.qty)}
                  </span>
                </div>
                {item.toppings.length > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">{item.toppings.join(", ")}</p>
                )}
              </li>
            ))}
          </ul>
          <div className="flex justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <span className="text-sm font-semibold text-gray-700">Tổng cộng</span>
            <span className="text-sm font-bold text-teal-600">{formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* Actions */}
        {order.status === "new" && (
          <button
            onClick={() => { acceptOrder(order.id); router.back(); }}
            className="w-full bg-teal-400 hover:bg-teal-500 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Xác nhận đơn hàng
          </button>
        )}

        {order.status === "confirmed" && (
          <div className="space-y-2">
            <button
              onClick={() => { completeOrder(order.id); router.back(); }}
              className="w-full bg-teal-400 hover:bg-teal-500 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Hoàn thành đơn
            </button>
            <button
              onClick={() => setShowRefundModal(true)}
              className="w-full border border-red-400 text-red-500 hover:bg-red-50 font-semibold py-3 rounded-xl transition-colors"
            >
              Yêu cầu hoàn tiền
            </button>
          </div>
        )}
      </div>

      {/* Refund modal */}
      {showRefundModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 space-y-3">
            <h3 className="font-semibold text-gray-900">Lý do hoàn tiền</h3>
            <textarea
              rows={3}
              placeholder="Nhập lý do hoàn tiền..."
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400 resize-none"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setShowRefundModal(false); setRefundReason(""); }}
                className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600"
              >
                Hủy
              </button>
              <button
                onClick={handleRefund}
                disabled={!refundReason.trim()}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400 rounded-lg text-sm font-semibold text-white transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </MerchantShell>
  );
}
