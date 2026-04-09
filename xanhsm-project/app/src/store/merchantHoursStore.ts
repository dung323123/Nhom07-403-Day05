/**
 * Merchant hours store — manages weekly schedule and special dates.
 * Seeded from merchant_hours.json; mutations are in-memory for the session.
 */
"use client";
import { create } from "zustand";
import type { DaySchedule, SpecialDate, DaySlot } from "@/types";
import hoursData from "@/data/merchant/merchant_hours.json";

interface MerchantHoursState {
  schedule: DaySchedule[];
  specialDates: SpecialDate[];

  /** Toggle a day open/closed */
  setDayOpen: (key: string, isOpen: boolean) => void;
  /** Toggle 24h for a day */
  setDay24h: (key: string, is24h: boolean) => void;
  /** Update a specific time slot */
  updateSlot: (key: string, index: number, slot: DaySlot) => void;
  /** Add a new slot to a day (max 3) */
  addSlot: (key: string) => void;
  /** Remove a slot from a day */
  removeSlot: (key: string, index: number) => void;

  /** Add a special date */
  addSpecialDate: (date: Omit<SpecialDate, "id">) => void;
  /** Delete a special date */
  deleteSpecialDate: (id: string) => void;
}

export const useMerchantHoursStore = create<MerchantHoursState>((set) => ({
  schedule: hoursData.schedule as DaySchedule[],
  specialDates: hoursData.specialDates as SpecialDate[],

  setDayOpen: (key, isOpen) =>
    set((s) => ({
      schedule: s.schedule.map((d) =>
        d.key === key ? { ...d, isOpen } : d
      ),
    })),

  setDay24h: (key, is24h) =>
    set((s) => ({
      schedule: s.schedule.map((d) =>
        d.key === key ? { ...d, is24h } : d
      ),
    })),

  updateSlot: (key, index, slot) =>
    set((s) => ({
      schedule: s.schedule.map((d) => {
        if (d.key !== key) return d;
        const slots = [...d.slots];
        slots[index] = slot;
        return { ...d, slots };
      }),
    })),

  addSlot: (key) =>
    set((s) => ({
      schedule: s.schedule.map((d) => {
        if (d.key !== key || d.slots.length >= 3) return d;
        return { ...d, slots: [...d.slots, { open: "08:00", close: "22:00" }] };
      }),
    })),

  removeSlot: (key, index) =>
    set((s) => ({
      schedule: s.schedule.map((d) => {
        if (d.key !== key) return d;
        return { ...d, slots: d.slots.filter((_, i) => i !== index) };
      }),
    })),

  addSpecialDate: (date) =>
    set((s) => ({
      specialDates: [
        ...s.specialDates,
        { ...date, id: `sp-${Date.now()}` },
      ],
    })),

  deleteSpecialDate: (id) =>
    set((s) => ({
      specialDates: s.specialDates.filter((d) => d.id !== id),
    })),
}));
