/**
 * Horizontally scrollable deal filter chips (Freeship, Today only, etc.)
 */
const DEALS = [
  { id: "freeship", label: "Freeship 0Đ", emoji: "⭐" },
  { id: "today", label: "Chỉ Hôm Nay", emoji: "🔥" },
  { id: "discount100", label: "Giảm 100K", emoji: "🏷️" },
  { id: "best-price", label: "Giá Cực Tốt", emoji: "💎" },
  { id: "near", label: "Quán Ngon Gần Nhà", emoji: "📍" },
  { id: "new-deal", label: "Deal Ngon Mới Ngày", emoji: "🎉" },
];

export default function DealFilterChips() {
  return (
    <div className="mx-4 my-2">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {DEALS.map((deal) => (
          <button
            key={deal.id}
            className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 shrink-0 text-sm font-medium text-gray-700 hover:border-[#00BCD4] hover:text-[#00BCD4] transition shadow-sm whitespace-nowrap"
          >
            <span>{deal.emoji}</span>
            <span>{deal.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
