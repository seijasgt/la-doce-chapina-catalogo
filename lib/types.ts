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
  image_url: string | null; // foto de portada
  gallery?: string[] | null; // fotos extra (dorsal, detalles...) en orden
  img: string | null; // emoji fallback from internal tool
  active: boolean | null;
  on_sale: boolean | null;
  team_type?: string | null; // "Equipo" | "Selección"
  era?: string | null; // "Actual" | "2020s" | ... (ver lib/catalog.ts)
  collections?: string[] | null; // "Leyendas", "Sin dorsal", ...
  created_at: string;
  product_sizes: ProductVariant[];
};

export type AvailabilityFilter = "all" | "available" | "incoming" | "on_sale";

export type StockType = "all" | "stock" | "incoming";

export type ComputedStatus =
  | "available"
  | "low_stock"
  | "incoming"
  | "sold_out";
