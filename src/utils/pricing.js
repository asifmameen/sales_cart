export function applyToAmount(base, d) {
    if (!d.enabled)
        return base;
    if (d.kind === "amount")
        return Math.max(0, base - d.value);
    return Math.max(0, Math.round(base * (1 - d.value / 100)));
}
export function computeOneTime(baseOneTime, discounts) {
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
export function computeMonthly(baseMonthly, discounts, billingMonths = 12) {
    const activeMonthly = discounts.filter(d => d.enabled && d.scope === "monthly");
    const always = activeMonthly.filter(d => !d.durationMonths);
    const limited = activeMonthly.filter(d => d.durationMonths && d.durationMonths > 0);
    const firstMonths = limited.length ? Math.max(...limited.map(d => d.durationMonths)) : 0;
    const restMonths = Math.max(0, billingMonths - firstMonths);
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
