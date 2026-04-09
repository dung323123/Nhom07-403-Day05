"use client";

/**
 * Auto-rotating promotional hero banner on the home screen.
 */
import { useState, useEffect } from "react";
import Image from "next/image";
import type { Promotion } from "@/types";

interface HeroBannerProps {
  promotions: Promotion[];
}

export default function HeroBanner({ promotions }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);

  // Auto-rotate every 3 seconds
  useEffect(() => {
    if (promotions.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % promotions.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [promotions.length]);

  if (!promotions.length) return null;

  const promo = promotions[current];

  return (
    <div className="mx-4 my-2">
      <div className="relative rounded-xl overflow-hidden h-40 md:h-56" style={{ backgroundColor: promo.bgColor }}>
        <Image
          src={promo.image}
          alt={promo.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 700px"
          priority
        />
        {/* Dot indicators */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {promotions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition ${i === current ? "bg-white" : "bg-white/50"}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
