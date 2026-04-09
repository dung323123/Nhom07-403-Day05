/**
 * Horizontally scrollable food category chips with icons.
 */
import Image from "next/image";
import type { Category } from "@/types";

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="mx-4 my-3">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="flex flex-col items-center gap-1.5 shrink-0 group"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-sm border border-gray-100 group-hover:shadow-md transition">
              <Image
                src={cat.image}
                alt={cat.name}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="text-xs text-gray-700 text-center leading-tight max-w-[68px]">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
