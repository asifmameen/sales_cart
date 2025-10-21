export type DiscountInput = {
  scope: "one-time" | "monthly";
  kind: "amount" | "percent";
  value: number;             // cents if amount; 0–100 if percent
  enabled: boolean;
  durationMonths?: number;   // for monthly only
};

export type MonthlySplit = {
  firstMonths: number;       // e.g., 3
  firstPrice: number;        // cents per month after discounts for firstMonths
  restMonths: number;        // e.g., 9 (if 12-month view)
  restPrice: number;         // cents per month after discounts for remaining months
};

export function applyToAmount(base: number, d: DiscountInput): number {
  if (!d.enabled) return base;
  if (d.kind === "amount") return Math.max(0, base - d.value);
  return Math.max(0, Math.round(base * (1 - d.value / 100)));
}

export function computeOneTime(baseOneTime: number, discounts: DiscountInput[]) {
  const active = discounts.filter(d => d.enabled && d.scope === "one-time");
  const total = active.reduce((amt, d) => applyToAmount(amt, d), baseOneTime);
  return { base: baseOneTime, total, active };
}

/**
 * Compute monthly price split: first N months (discounts with duration) vs rest.
 * - Discounts without duration apply to ALL months.
 * - Discounts with duration apply to ONLY first N months (N = max(durationMonths)).
 * - If there are multiple duration discounts with different N, we use the MAX
 *   to show a single split row ("first N months, then rest").
 * - billingMonths: how many months you want to visualize (default 12).
 */
export function computeMonthly(
  baseMonthly: number,
  discounts: DiscountInput[],
  billingMonths = 12
): MonthlySplit & { base: number; always: DiscountInput[]; limited: DiscountInput[] } {
  const activeMonthly = discounts.filter(d => d.enabled && d.scope === "monthly");
  const always = activeMonthly.filter(d => !d.durationMonths);
  const limited = activeMonthly.filter(d => d.durationMonths && d.durationMonths > 0);

  const firstMonths = limited.length ? Math.max(...limited.map(d => d.durationMonths!)) : 0;
  const restMonths  = Math.max(0, billingMonths - firstMonths);

  // Price for months after all "always" discounts
  const priceAfterAlways = always.reduce((amt, d) => applyToAmount(amt, d), baseMonthly);
  // Price for first months (always + limited)
  const priceAfterLimited = [...always, ...limited].reduce((amt, d) => applyToAmount(amt, d), baseMonthly);

  return {
    base: baseMonthly,
    always,
    limited,
    firstMonths,
    firstPrice: priceAfterLimited,
    restMonths,
    restPrice: priceAfterAlways,
  };
}
