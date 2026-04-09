/** Shared type definitions matching the JSON data shapes */

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface StorePromo {
  type: "food" | "ship";
  label: string;
  value: string;
}

export interface Store {
  id: string;
  name: string;
  shortName: string;
  image: string;
  thumbnail: string;
  rating: number;
  ratingCount: number;
  googleRating: number;
  googleRatingCount: number;
  orders: string;
  distance: string;
  isPartner: boolean;
  partnerLabel: string;
  categories: string[];
  promos: StorePromo[];
  tags: string[];
}

export interface MenuItem {
  id: string;
  storeId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  isBestSeller: boolean;
  tab: "deals" | "new" | "drinks" | string;
}

export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  bgColor: string;
}

// ─── Merchant types ───────────────────────────────────────────────────────────

export interface MerchantBankAccount {
  bank: string;
  accountNumber: string;
  accountName: string;
}

export interface MerchantStore {
  id: string;
  name: string;
  shortName: string;
  address: string;
  phone: string;
  bankAccount: MerchantBankAccount;
  balance: number;
  status: "open" | "closed";
}

export interface DaySlot {
  open: string;
  close: string;
}

export interface DaySchedule {
  day: string;
  key: string;
  isOpen: boolean;
  is24h: boolean;
  slots: DaySlot[];
}

export interface SpecialDate {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  closedAllDay: boolean;
  slots: DaySlot[];
}

export type MerchantItemStatus = "available" | "stopped_today" | "suspended";

export interface MerchantToppingOption {
  id: string;
  name: string;
  price: number;
}

export interface MerchantToppingGroup {
  id: string;
  name: string;
  options: MerchantToppingOption[];
}

export interface MerchantItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  status: MerchantItemStatus;
  toppingGroupIds: string[];
}

export interface MerchantCategory {
  id: string;
  name: string;
  items: MerchantItem[];
}

export type MerchantOrderStatus =
  | "new"
  | "confirmed"
  | "history_done"
  | "history_cancelled";

export interface MerchantOrderItem {
  name: string;
  qty: number;
  price: number;
  toppings: string[];
}

export interface MerchantOrder {
  id: string;
  code: string;
  status: MerchantOrderStatus;
  time: string;
  date: string;
  itemCount: number;
  total: number;
  driverAssigned: boolean;
  driverNote: string;
  customer: { name: string; phone: string };
  driver: { name: string; phone: string };
  items: MerchantOrderItem[];
}

export type WalletTxStatus = "done" | "cancelled";

export interface WalletTransaction {
  id: string;
  amount: number;
  type: "withdraw";
  status: WalletTxStatus;
  date: string;
  recipient: string;
  store: string;
  bank: string;
  account: string;
  txCode: string;
}
