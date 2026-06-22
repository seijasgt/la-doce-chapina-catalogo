export type ProductVariant = {
  id: number;
  product_id: number;
  size: string;
  stock_available: number;
  stock_incoming: number;
  stock_reserved: number;
};

export type Product = {
  id: number;
  name: string;
  sku: string;
  category: string | null;
  team: string | null;
  description: string | null;
  sale_price: number;
  image_url: string | null;
  img: string | null; // emoji fallback from internal tool
  active: boolean | null;
  created_at: string;
  product_sizes: ProductVariant[];
};

export type AvailabilityFilter =
  | "all"
  | "available"
  | "low_stock"
  | "incoming"
  | "sold_out";

export type StockType = "all" | "stock" | "incoming";

export type ComputedStatus =
  | "available"
  | "low_stock"
  | "incoming"
  | "sold_out";
