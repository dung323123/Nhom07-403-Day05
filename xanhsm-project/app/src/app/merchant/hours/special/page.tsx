/**
 * Special dates manager — list, add, and delete special closure/opening days.
 */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MerchantShell from "@/components/merchant/layout/MerchantShell";
import { useMerchantHoursStore } from "@/store/merchantHoursStore";

export default function HoursSpecialPage() {
  const router = useRouter();
  const { specialDates, addSpecialDate, deleteSpecialDate } = useMerchantHoursStore();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    closedAllDay: true,
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.startDate) return;
    addSpecialDate({
      name: form.name,
      startDate: form.startDate,
      endDate: form.endDate || form.startDate,
      closedAllDay: form.closedAllDay,
      slots: [],
    });
    setForm({ name: "", startDate: "", endDate: "", closedAllDay: true });
    setShowForm(false);
  };

  return (
    <MerchantShell>
      {/* Header */}
      <div className="bg-white flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-semibold text-gray-900">Ngày đặc biệt</h1>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="text-sm text-teal-500 font-medium"
        >
          {showForm ? "Hủy" : "+ Thêm"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="mx-4 mt-4 bg-white rounded-xl shadow-sm p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tên ngày đặc biệt</label>
            <input
              required
              type="text"
              placeholder="VD: Nghỉ lễ 30/4"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Từ ngày</label>
              <input
                required
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Đến ngày</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={form.closedAllDay}
              onChange={(e) => setForm((f) => ({ ...f, closedAllDay: e.target.checked }))}
              className="accent-teal-500 w-4 h-4"
            />
            Đóng cửa cả ngày
          </label>
          <button
            type="submit"
            className="w-full bg-teal-400 hover:bg-teal-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
          >
            Lưu ngày đặc biệt
          </button>
        </form>
      )}

      {/* List */}
      <div className="m-4 bg-white rounded-xl shadow-sm overflow-hidden">
        {specialDates.length === 0 ? (
          <p className="px-4 py-6 text-sm text-gray-400 text-center">
            Chưa có ngày đặc biệt nào.
          </p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {specialDates.map((sd) => (
              <li key={sd.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">{sd.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {sd.startDate}
                    {sd.startDate !== sd.endDate ? ` – ${sd.endDate}` : ""}
                    {sd.closedAllDay && " · Đóng cửa cả ngày"}
                  </p>
                </div>
                <button
                  onClick={() => deleteSpecialDate(sd.id)}
                  className="text-red-400 hover:text-red-600 p-1"
                  aria-label="Xóa"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </MerchantShell>
  );
}
