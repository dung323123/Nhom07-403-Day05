/**
 * Screen 1: Home / Discovery page
 * Displays delivery address header, search bar link, hero banner,
 * food category chips, deal filters, and featured store cards.
 */
import Header from "@/components/layout/Header";
import SearchBarLink from "@/components/home/SearchBarLink";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import DealFilterChips from "@/components/home/DealFilterChips";
import FeaturedStoreCards from "@/components/home/FeaturedStoreCards";

import categories from "@/data/categories.json";
import stores from "@/data/stores.json";
import promotions from "@/data/promotions.json";

import type { Category, Store, Promotion } from "@/types";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SearchBarLink />
      <HeroBanner promotions={promotions as Promotion[]} />
      <CategoryGrid categories={categories as Category[]} />
      <DealFilterChips />
      <FeaturedStoreCards stores={stores as Store[]} />
      <div className="h-8" />
    </div>
  );
}

