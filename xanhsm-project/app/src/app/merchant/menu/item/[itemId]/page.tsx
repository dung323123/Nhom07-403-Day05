/**
 * Add / edit menu item page.
 * Route: /merchant/menu/item/[itemId]
 *   itemId = "new" → create mode (requires ?catId=xxx)
 *   itemId = existing id → edit mode
 */
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import MerchantShell from "@/components/merchant/layout/MerchantShell";
import { useMerchantMenuStore } from "@/store/merchantMenuStore";
import type { MerchantItemStatus } from "@/types";
import { formatCurrency } from "@/lib/format";

export default function MenuItemPage() {
  const router = useRouter();
  const params = useParams<{ itemId: string }>();
  const searchParams = useSearchParams();
  const catId = searchParams.get("catId") ?? "";

  const { categories, toppingGroups, addItem, editItem } = useMerchantMenuStore();

  const isNew = params.itemId === "new";

  // Find existing item when editing
  const existingCat = categories.find((c) => c.items.some((i) => i.id === params.itemId));
  const existingItem = existingCat?.items.find((i) => i.id === params.itemId);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    status: "available" as MerchantItemStatus,
    toppingGroupIds: [] as string[],
  });

  useEffect(() => {
    if (!isNew && existingItem) {
      setForm({
        name: existingItem.name,
        description: existingItem.description,
        price: String(existingItem.price),
        image: existingItem.image,
        status: existingItem.status,
        toppingGroupIds: existingItem.toppingGroupIds,
      });
    }
  }, [isNew, existingItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseInt(form.price.replace(/\D/g, ""), 10) || 0;

    if (isNew) {
      addItem(catId, {
        name: form.name,
        description: form.description,
        price,
        image: form.image,
        status: form.status,
        toppingGroupIds: form.toppingGroupIds,
      });
    } else if (existingItem && existingCat) {
      editItem(existingCat.id, {
        ...existingItem,
        name: form.name,
        description: form.description,
        price,
        image: form.image,
        status: form.status,
        toppingGroupIds: form.toppingGroupIds,
      });
    }
    router.back();
  };

  const toggleTopping = (id: string) => {
    setForm((f) => ({
      ...f,
      toppingGroupIds: f.toppingGroupIds.includes(id)
        ? f.toppingGroupIds.filter((x) => x !== id)
        : [...f.toppingGroupIds, id],
    }));
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
        <h1 className="font-semibold text-gray-900">{isNew ? "Thêm món mới" : "Chỉnh sửa món"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Image URL */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">URL ảnh món</label>
          <input
            type="url"
            placeholder="https://..."
            value={form.image}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
          />
          {form.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.image} alt="preview" className="mt-2 w-24 h-24 object-cover rounded-lg border border-gray-200" />
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Tên món *</label>
          <input
            required
            type="text"
            placeholder="VD: Trà sữa thái xanh"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Mô tả</label>
          <textarea
            rows={2}
            placeholder="Mô tả ngắn..."
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400 resize-none"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Giá (VND) *</label>
          <input
            required
            type="number"
            min={0}
            placeholder="VD: 45000"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
          />
          {form.price && (
            <p className="mt-0.5 text-xs text-gray-400">{formatCurrency(parseInt(form.price) || 0)}</p>
          )}
        </div>

        {/* Topping groups */}
        {toppingGroups.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Nhóm topping</label>
            <div className="space-y-1.5">
              {toppingGroups.map((g) => (
                <label key={g.id} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.toppingGroupIds.includes(g.id)}
                    onChange={() => toggleTopping(g.id)}
                    className="accent-teal-500 w-4 h-4"
                  />
                  {g.name}
                  <span className="text-xs text-gray-400">({g.options.length} lựa chọn)</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="sticky bottom-20 lg:bottom-4 pt-2">
          <button
            type="submit"
            className="w-full bg-teal-400 hover:bg-teal-500 text-white font-semibold py-3 rounded-xl shadow-md transition-colors"
          >
            {isNew ? "Thêm món" : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </MerchantShell>
  );
}
