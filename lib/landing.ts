import { supabase } from "./supabase";
import type { Product } from "./types";
import { onlyInStock } from "./utils";
import { ERAS, COLLECTIONS } from "./catalog";

/** Una tarjeta de "Compra por…": equipo, colección o época */
export type Category = { name: string; count: number; image: string | null };

export type LandingData = {
  totalAvailable: number;
  modelsInStock: number;
  heroProducts: Product[];
  onSale: Product[];
  newArrivals: Product[];
  teams: Category[];
  collections: Category[];
  eras: Category[];
};

const EMPTY: LandingData = {
  totalAvailable: 0,
  modelsInStock: 0,
  heroProducts: [],
  onSale: [],
  newArrivals: [],
  teams: [],
  collections: [],
  eras: [],
};

/** Agrupa productos por una o varias llaves y toma la foto del primero que tenga */
function groupBy(products: Product[], keys: (p: Product) => string[]): Map<string, Category> {
  const m = new Map<string, Category>();
  products.forEach((p) =>
    keys(p).forEach((raw) => {
      const k = (raw || "").trim();
      if (!k) return;
      const cur = m.get(k) ?? { name: k, count: 0, image: null };
      cur.count += 1;
      if (!cur.image && p.image_url) cur.image = p.image_url;
      m.set(k, cur);
    })
  );
  return m;
}

/** Trae todo lo que necesita la portada en una sola consulta. Si falla, la portada se ve igual pero sin productos. */
export async function getLandingData(): Promise<LandingData> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, product_sizes(*)")
      .eq("active", true)
      .order("created_at", { ascending: false });
    if (error || !data) return EMPTY;

    // Solo producto en stock: lo que viene en camino no se muestra al público
    const products = onlyInStock(data as unknown as Product[]);
    const totalAvailable = products.reduce(
      (a, p) => a + p.product_sizes.reduce((b, v) => b + v.stock_available, 0),
      0
    );
    const withPhoto = products.filter((p) => p.image_url);

    // Todos los equipos con al menos una camisa, de más a menos modelos
    const teams = Array.from(groupBy(products, (p) => [p.team ?? ""]).values()).sort(
      (a, b) => b.count - a.count || a.name.localeCompare(b.name, "es")
    );
    // Colecciones y épocas en el orden fijo de RetroKit, solo las que tienen stock
    const colMap = groupBy(products, (p) => p.collections ?? []);
    const eraMap = groupBy(products, (p) => [p.era ?? ""]);

    return {
      totalAvailable,
      modelsInStock: products.length,
      heroProducts: withPhoto.slice(0, 3),
      onSale: withPhoto.filter((p) => p.on_sale).slice(0, 12),
      newArrivals: withPhoto.slice(0, 12),
      teams,
      collections: COLLECTIONS.map((c) => colMap.get(c)).filter((c): c is Category => !!c),
      eras: ERAS.map((e) => eraMap.get(e)).filter((e): e is Category => !!e),
    };
  } catch {
    return EMPTY;
  }
}
