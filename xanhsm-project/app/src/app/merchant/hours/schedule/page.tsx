/**
 * Weekly schedule editor — toggle each day open/closed,
 * set 24h, and manage time slots using native <input type="time">.
 */
"use client";
import { useRouter } from "next/navigation";
import MerchantShell from "@/components/merchant/layout/MerchantShell";
import { useMerchantHoursStore } from "@/store/merchantHoursStore";
import type { DaySlot } from "@/types";

export default function HoursSchedulePage() {
  const router = useRouter();
  const store = useMerchantHoursStore();

  return (
    <MerchantShell>
      {/* Header */}
      <div className="bg-white flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-1">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-semibold text-gray-900">Lịch hàng tuần</h1>
      </div>

      <div className="p-4 space-y-3">
        {store.schedule.map((day) => (
          <div key={day.key} className="bg-white rounded-xl shadow-sm p-4">
            {/* Day header row */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">{day.day}</span>
              {/* Open/closed toggle */}
              <button
                onClick={() => store.setDayOpen(day.key, !day.isOpen)}
                className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors focus:outline-none ${
                  day.isOpen ? "bg-teal-400" : "bg-gray-300"
                }`}
                aria-label={day.isOpen ? "Đóng ngày này" : "Mở ngày này"}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    day.isOpen ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Expanded controls when open */}
            {day.isOpen && (
              <div className="mt-3 space-y-2">
                {/* 24h toggle */}
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={day.is24h}
                    onChange={(e) => store.setDay24h(day.key, e.target.checked)}
                    className="accent-teal-500 w-4 h-4"
                  />
                  Mở 24/24
                </label>

                {/* Time slots */}
                {!day.is24h && (
                  <>
                    {day.slots.map((slot: DaySlot, idx) => (
                      <div key={idx} className="flex items-center gap-2 flex-wrap">
                        <input
                          type="time"
                          value={slot.open}
                          onChange={(e) =>
                            store.updateSlot(day.key, idx, {
                              ...slot,
                              open: e.target.value,
                            })
                          }
                          className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
                        />
                        <span className="text-gray-400 text-sm">–</span>
                        <input
                          type="time"
                          value={slot.close}
                          onChange={(e) =>
                            store.updateSlot(day.key, idx, {
                              ...slot,
                              close: e.target.value,
                            })
                          }
                          className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
                        />
                        {day.slots.length > 1 && (
                          <button
                            onClick={() => store.removeSlot(day.key, idx)}
                            className="ml-auto text-red-400 hover:text-red-600"
                            aria-label="Xóa khung giờ"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Add slot button (max 3) */}
                    {day.slots.length < 3 && (
                      <button
                        onClick={() => store.addSlot(day.key)}
                        className="flex items-center gap-1 text-xs text-teal-500 font-medium hover:text-teal-700 mt-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Thêm khung giờ
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Save banner */}
        <div className="sticky bottom-20 lg:bottom-4">
          <button
            onClick={() => router.back()}
            className="w-full bg-teal-400 hover:bg-teal-500 text-white font-semibold py-3 rounded-xl shadow-md transition-colors"
          >
            Lưu lịch
          </button>
        </div>
      </div>
    </MerchantShell>
  );
}
