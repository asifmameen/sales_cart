export interface Product {
  name: string;
  oneTimePrice: number;
  monthlyPrice: number;
}

export interface Discount {
  id: number;
  name: string;
  value: number;
  unit: "€" | "%";
  type: "one-time" | "monthly";
  duration?: number;
  active: boolean;
}
