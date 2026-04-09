/**
 * Merchant home dashboard — shows store status toggle, news banner,
 * and the 6-tile service grid.
 */
"use client";
import MerchantShell from "@/components/merchant/layout/MerchantShell";
import ServiceGrid from "@/components/merchant/home/ServiceGrid";
import MerchantNewsBanner from "@/components/merchant/home/MerchantNewsBanner";
import { useMerchantOrderStore } from "@/store/merchantOrderStore";
import { formatCurrency } from "@/lib/format";
import storeData from "@/data/merchant/merchant_store.json";

export default function MerchantHomePage() {
  const storeStatus = useMerchantOrderStore((s) => s.storeStatus);
  const toggleStoreStatus = useMerchantOrderStore((s) => s.toggleStoreStatus);

  return (
    <MerchantShell>
      {/* Store status banner */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-800">{storeData.name}</p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{storeData.address}</p>
        </div>
        {/* Toggle switch */}
        <button
          onClick={toggleStoreStatus}
          className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
            storeStatus === "open" ? "bg-teal-400" : "bg-gray-300"
          }`}
          aria-label="Đổi trạng thái cửa hàng"
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              storeStatus === "open" ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Balance strip */}
      <div className="bg-teal-50 px-4 py-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        <span className="text-sm text-gray-600">Số dư:</span>
        <span className="text-sm font-bold text-teal-700">{formatCurrency(storeData.balance)}</span>
      </div>

      {/* News banner */}
      <div className="pt-4">
        <MerchantNewsBanner />
      </div>

      {/* Service grid */}
      <ServiceGrid />
    </MerchantShell>
  );
}
