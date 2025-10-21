// src/types/discount.ts
export type DiscountScope = "one-time" | "monthly";
export type DiscountKind  = "amount" | "percent";

export type Discount = {
  id: string;
  name: string;
  scope: DiscountScope;      // "one-time" | "monthly"
  kind: DiscountKind;        // "amount" | "percent"
  value: number;             // paise for amount; 0–100 for percent
  enabled: boolean;
  durationMonths?: number;   // for monthly discounts (first N months)
  description?: string;
};
