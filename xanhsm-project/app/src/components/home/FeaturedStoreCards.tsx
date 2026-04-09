/**
 * Grid of featured store cards shown on the home screen.
 * On desktop: 3-column grid. On mobile: horizontal scroll.
 */
import Image from "next/image";
import Link from "next/link";
import type { Store } from "@/types";

interface FeaturedStoreCardsProps {
  stores: Store[];
}

export default function FeaturedStoreCards({ stores }: FeaturedStoreCardsProps) {
  return (
    <div className="mx-4 my-3">
      <h2 className="font-bold text-gray-800 text-base mb-3">🔥 Giật Deal Thương Hiệu - Giảm Đến 50%</h2>
      {/* Mobile: horizontal scroll | Desktop: grid */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 md:grid md:grid-cols-3 md:overflow-visible">
        {stores.map((store) => (
          <Link
            key={store.id}
            href={`/store/${store.id}`}
            className="shrink-0 w-44 md:w-auto bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group"
          >
            {/* Store thumbnail */}
            <div className="relative w-full h-28 md:h-36 bg-gray-100">
              <Image
                src={store.thumbnail}
                alt={store.shortName}
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
                sizes="(max-width: 768px) 176px, 33vw"
              />
              {/* Promo badge */}
              {store.promos[0] && (
                <span className="absolute bottom-2 left-2 bg-[#00BCD4] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {store.promos[0].value}
                </span>
              )}
            </div>
            {/* Store info */}
            <div className="p-2">
              <p className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2">{store.shortName}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-yellow-400 text-xs">★</span>
                <span className="text-xs text-gray-500">{store.rating}</span>
                <span className="text-xs text-gray-400">• {store.distance}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
