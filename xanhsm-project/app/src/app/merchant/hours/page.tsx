/**
 * Opening hours index page — overview of weekly schedule + special dates shortcut.
 * Links to /merchant/hours/schedule and /merchant/hours/special.
 */
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MerchantShell from "@/components/merchant/layout/MerchantShell";
import { useMerchantHoursStore } from "@/store/merchantHoursStore";

export default function HoursPage() {
  const schedule = useMerchantHoursStore((s) => s.schedule);
  const specialDates = useMerchantHoursStore((s) => s.specialDates);
  const router = useRouter();

  const summarise = (d: (typeof schedule)[0]) => {
    if (!d.isOpen) return "Đóng cửa";
    if (d.is24h) return "Mở 24/24";
    if (d.slots.length === 0) return "Chưa thiết lập";
    return d.slots.map((s) => `${s.open} – ${s.close}`).join(", ");
  };

  return (
    <MerchantShell>
      {/* Page header */}
      <div className="bg-white flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-1">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-semibold text-gray-900">Giờ mở và đóng cửa</h1>
      </div>

      {/* Weekly schedule card */}
      <div className="m-4 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">Lịch hàng tuần</h2>
          <Link href="/merchant/hours/schedule" className="text-xs text-teal-500 font-medium">
            Chỉnh sửa
          </Link>
        </div>
        <ul className="divide-y divide-gray-50">
          {schedule.map((day) => (
            <li key={day.key} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${day.isOpen ? "bg-green-400" : "bg-gray-300"}`}
                />
                <span className="text-sm text-gray-700 w-24">{day.day}</span>
              </div>
              <span className={`text-sm ${day.isOpen ? "text-gray-800" : "text-gray-400"}`}>
                {summarise(day)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Special dates card */}
      <div className="mx-4 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">Ngày đặc biệt</h2>
          <Link href="/merchant/hours/special" className="text-xs text-teal-500 font-medium">
            Quản lý
          </Link>
        </div>
        {specialDates.length === 0 ? (
          <p className="px-4 py-3 text-sm text-gray-400">Chưa có ngày đặc biệt.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {specialDates.map((sd) => (
              <li key={sd.id} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-700">{sd.name}</span>
                <span className="text-xs text-gray-400">
                  {sd.startDate}
                  {sd.startDate !== sd.endDate ? ` – ${sd.endDate}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </MerchantShell>
  );
}
