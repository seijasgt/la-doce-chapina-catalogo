import { supabase } from "./supabase";
import type { Product } from "./types";

export type LandingData = {
  totalAvailable: number;
  totalIncoming: number;
  modelsInStock: number;
  heroProducts: Product[];
  onSale: Product[];
  newArrivals: Product[];
  teams: { name: string; count: number; image: string | null }[];
};

const EMPTY: LandingData = {
  totalAvailable: 0,
  totalIncoming: 0,
  modelsInStock: 0,
  heroProducts: [],
  onSale: [],
  newArrivals: [],
  teams: [],
};

const offerable = (p: Product) =>
  (p.product_sizes ?? []).reduce((a, v) => a + v.stock_available + (v.stock_incoming || 0), 0);
const physical = (p: Product) =>
  (p.product_sizes ?? []).reduce((a, v) => a + v.stock_available, 0);

/** Trae todo lo que necesita la portada en una sola consulta. Si falla, la portada se ve igual pero sin productos. */
export async function getLandingData(): Promise<LandingData> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, product_sizes(*)")
      .eq("active", true)
      .order("created_at", { ascending: false });
    if (error || !data) return EMPTY;

    const products = data as unknown as Product[];
    let totalAvailable = 0;
    let totalIncoming = 0;
    products.forEach((p) =>
      (p.product_sizes ?? []).forEach((v) => {
        totalAvailable += v.stock_available;
        totalIncoming += v.stock_incoming || 0;
      })
    );

    const sellable = products.filter((p) => offerable(p) > 0);
    const withPhoto = sellable.filter((p) => p.image_url);

    // Equipos: solo los que tienen 2+ modelos con stock (así se filtran los
    // productos que tienen el nombre completo en el campo "equipo").
    const teamMap = new Map<string, { count: number; image: string | null }>();
    sellable.forEach((p) => {
      const t = (p.team || "").trim();
      if (!t) return;
      const cur = teamMap.get(t) ?? { count: 0, image: null };
      cur.count += 1;
      if (!cur.image && p.image_url) cur.image = p.image_url;
      teamMap.set(t, cur);
    });
    const teams = Array.from(teamMap.entries())
      .filter(([, v]) => v.count >= 2)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 12)
      .map(([name, v]) => ({ name, ...v }));

    return {
      totalAvailable,
      totalIncoming,
      modelsInStock: sellable.length,
      heroProducts: withPhoto.filter((p) => physical(p) > 0).slice(0, 3),
      onSale: withPhoto.filter((p) => p.on_sale).slice(0, 12),
      newArrivals: withPhoto.slice(0, 12),
      teams,
    };
  } catch {
    return EMPTY;
  }
}
