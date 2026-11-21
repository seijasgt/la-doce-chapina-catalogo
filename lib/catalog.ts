import type { Product } from "./types";
import { computeStatus } from "./utils";

/** Deben coincidir con las opciones de RetroKit (ERAS / COLLECTIONS) */
export const ERAS = ["Actual", "2020s", "2010s", "2000s", "90s", "80s y antes"];
export const COLLECTIONS = ["Leyendas", "Sin dorsal", "Colaboraciones", "Edición especial", "Versión jugador"];
export const ADULT_SIZES = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"];

export type Availability = "all" | "now" | "incoming";
export type SortKey = "recommended" | "newest" | "price_asc" | "price_desc" | "az";

export const SORT_LABEL: Record<SortKey, string> = {
  recommended: "Recomendado",
  newest: "Más nuevas",
  price_asc: "Precio: menor a mayor",
  price_desc: "Precio: mayor a menor",
  az: "Nombre A–Z",
};

export type Filters = {
  q: string;
  teams: string[];
  eras: string[];
  collections: string[];
  sizes: string[];
  availability: Availability;
  onSale: boolean;
  sort: SortKey;
};

export const EMPTY_FILTERS: Filters = {
  q: "",
  teams: [],
  eras: [],
  collections: [],
  sizes: [],
  availability: "all",
  onSale: false,
  sort: "recommended",
};

export const activeCount = (f: Filters) =>
  f.teams.length + f.eras.length + f.collections.length + f.sizes.length +
  (f.availability !== "all" ? 1 : 0) + (f.onSale ? 1 : 0);

// ── URL ↔ filtros (para que los links se puedan compartir) ──
const list = (v: string | null) => (v ? v.split(",").map((x) => x.trim()).filter(Boolean) : []);

export function filtersFromURL(search: string): Filters {
  const sp = new URLSearchParams(search);
  const sort = sp.get("orden") as SortKey | null;
  return {
    q: sp.get("q") ?? "",
    teams: list(sp.get("equipo")),
    eras: list(sp.get("epoca")),
    collections: list(sp.get("coleccion")),
    sizes: list(sp.get("talla")),
    availability: "all", // ya no se usa: el catálogo solo muestra stock (links viejos con ?disp= se ignoran)
    // ?filtro=oferta se mantiene por compatibilidad con links viejos
    onSale: sp.get("oferta") === "1" || sp.get("filtro") === "oferta",
    sort: sort && sort in SORT_LABEL ? sort : "recommended",
  };
}

export function filtersToURL(f: Filters): string {
  const sp = new URLSearchParams();
  if (f.q) sp.set("q", f.q);
  if (f.teams.length) sp.set("equipo", f.teams.join(","));
  if (f.eras.length) sp.set("epoca", f.eras.join(","));
  if (f.collections.length) sp.set("coleccion", f.collections.join(","));
  if (f.sizes.length) sp.set("talla", f.sizes.join(","));
  if (f.availability === "now") sp.set("disp", "ya");
  if (f.availability === "incoming") sp.set("disp", "camino");
  if (f.onSale) sp.set("oferta", "1");
  if (f.sort !== "recommended") sp.set("orden", f.sort);
  const s = sp.toString();
  return s ? `?${s}` : "";
}

// ── Búsqueda tolerante: sin tildes, varias palabras en cualquier orden ──
export const norm = (t: string | null | undefined) =>
  String(t ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const hasStock = (p: Product, size?: string) =>
  (p.product_sizes ?? []).some(
    (v) => (!size || v.size === size) && v.stock_available + (v.stock_incoming || 0) > 0
  );

/**
 * Aplica todos los filtros. `skip` permite calcular los conteos de una sección
 * ignorando su propio filtro (así "Barcelona (8)" no se vuelve 0 al elegir Madrid).
 */
export function applyFilters(products: Product[], f: Filters, skip?: keyof Filters): Product[] {
  const words = norm(f.q).split(/\s+/).filter(Boolean);
  return products.filter((p) => {
    if (words.length) {
      const h = norm(`${p.name} ${p.team} ${p.category} ${p.era} ${(p.collections ?? []).join(" ")}`);
      if (!words.every((w) => h.includes(w))) return false;
    }
    if (skip !== "teams" && f.teams.length && !f.teams.includes((p.team ?? "").trim())) return false;
    if (skip !== "eras" && f.eras.length && !f.eras.includes(p.era ?? "")) return false;
    if (skip !== "collections" && f.collections.length &&
        !f.collections.some((c) => (p.collections ?? []).includes(c))) return false;
    if (skip !== "sizes" && f.sizes.length && !f.sizes.some((s) => hasStock(p, s))) return false;
    if (skip !== "availability" && f.availability !== "all") {
      const vs = p.product_sizes ?? [];
      if (f.availability === "now" && !vs.some((v) => v.stock_available > 0)) return false;
      if (f.availability === "incoming" && !vs.some((v) => (v.stock_incoming || 0) > 0)) return false;
    }
    if (skip !== "onSale" && f.onSale && !p.on_sale) return false;
    return true;
  });
}

const STATUS_RANK = { available: 0, low_stock: 0, incoming: 1, sold_out: 2 } as const;

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const arr = [...products];
  const byNew = (a: Product, b: Product) => (b.created_at ?? "").localeCompare(a.created_at ?? "");
  const rank = (p: Product) => STATUS_RANK[computeStatus(p)];
  switch (sort) {
    case "newest":
      return arr.sort((a, b) => rank(a) - rank(b) || byNew(a, b));
    case "price_asc":
      return arr.sort((a, b) => rank(a) - rank(b) || a.sale_price - b.sale_price);
    case "price_desc":
      return arr.sort((a, b) => rank(a) - rank(b) || b.sale_price - a.sale_price);
    case "az":
      return arr.sort((a, b) => a.name.localeCompare(b.name, "es"));
    default:
      // Recomendado: lo que hay ya primero, ofertas arriba, luego lo más nuevo
      return arr.sort(
        (a, b) => rank(a) - rank(b) || Number(!!b.on_sale) - Number(!!a.on_sale) || byNew(a, b)
      );
  }
}

/** Cuenta productos por valor de un campo (para mostrar "Barcelona (8)") */
export function countBy(products: Product[], get: (p: Product) => string[]): Map<string, number> {
  const m = new Map<string, number>();
  products.forEach((p) => get(p).forEach((k) => k && m.set(k, (m.get(k) ?? 0) + 1)));
  return m;
}

export const isNational = (p: Product) => norm(p.team_type) === "seleccion";
