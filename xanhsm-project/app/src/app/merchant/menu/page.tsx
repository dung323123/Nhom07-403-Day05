/**
 * Menu management page — lists categories and items, with AI Smart Menu,
 * add category, and per-item status management via ItemCard.
 */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MerchantShell from "@/components/merchant/layout/MerchantShell";
import ItemCard from "@/components/merchant/menu/ItemCard";
import { useMerchantMenuStore } from "@/store/merchantMenuStore";

export default function MenuPage() {
  const router = useRouter();
  const { categories, addCategory, deleteCategory, generateAiMenu, aiLoading } = useMerchantMenuStore();
  const [newCatName, setNewCatName] = useState("");
  const [showCatForm, setShowCatForm] = useState(false);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim());
    setNewCatName("");
    setShowCatForm(false);
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
          <h1 className="font-semibold text-gray-900">Thực đơn</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* AI Smart Menu */}
          <button
            onClick={generateAiMenu}
            disabled={aiLoading}
            className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
          >
            {aiLoading ? (
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
            AI
          </button>
          {/* Add category */}
          <button
            onClick={() => setShowCatForm((v) => !v)}
            className="text-xs text-teal-500 font-medium"
          >
            {showCatForm ? "Hủy" : "+ Danh mục"}
          </button>
        </div>
      </div>

      {/* Add category form */}
      {showCatForm && (
        <form onSubmit={handleAddCategory} className="mx-4 mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Tên danh mục..."
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
            autoFocus
          />
          <button
            type="submit"
            className="bg-teal-400 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-500 transition-colors"
          >
            Lưu
          </button>
        </form>
      )}

      {/* Category + items list */}
      <div className="p-4 space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Category header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
                <span className="text-xs text-gray-400">({cat.items.length} món)</span>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/merchant/menu/item/new?catId=${cat.id}`}
                  className="text-xs text-teal-500 font-medium"
                >
                  + Thêm món
                </Link>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="text-red-400 hover:text-red-600"
                  aria-label="Xóa danh mục"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Items */}
            {cat.items.length === 0 ? (
              <p className="px-4 py-4 text-sm text-gray-400 text-center">Chưa có món. Bấm &quot;+ Thêm món&quot; để bắt đầu.</p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {cat.items.map((item) => (
                  <li key={item.id}>
                    <ItemCard item={item} categoryId={cat.id} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">
            Chưa có danh mục nào. Bấm &quot;+ Danh mục&quot; để bắt đầu.
          </div>
        )}
      </div>
    </MerchantShell>
  );
}
