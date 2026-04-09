/**
 * Merchant wallet store — manages balance and transaction history.
 * Seeded from merchant_wallet.json; mutations are in-memory for the session.
 */
"use client";
import { create } from "zustand";
import type { WalletTransaction } from "@/types";
import walletData from "@/data/merchant/merchant_wallet.json";

interface MerchantWalletState {
  balance: number;
  transactions: WalletTransaction[];
  /** Last completed withdrawal, used by the success page */
  lastWithdrawal: WalletTransaction | null;

  /** Withdraw the full available balance — skips OTP */
  withdraw: () => void;
  /** Look up a transaction by id */
  getTransactionById: (id: string) => WalletTransaction | undefined;
}

export const useMerchantWalletStore = create<MerchantWalletState>((set, get) => ({
  balance: walletData.balance,
  transactions: walletData.transactions as WalletTransaction[],
  lastWithdrawal: null,

  withdraw: () => {
    const { balance, transactions } = get();
    if (balance <= 0) return;

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      amount: balance,
      type: "withdraw",
      status: "done",
      date: new Date().toLocaleString("vi-VN"),
      recipient: "Trương Văn Sơn",
      store: "Xanh SM Nguyễn Thị Minh Khai",
      bank: "Standard Chartered Vietnam",
      account: "**3468",
      txCode: String(Date.now()).slice(-9),
    };

    set({
      balance: 0,
      transactions: [newTx, ...transactions],
      lastWithdrawal: newTx,
    });
  },

  getTransactionById: (id) => get().transactions.find((t) => t.id === id),
}));
