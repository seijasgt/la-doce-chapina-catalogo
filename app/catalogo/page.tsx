"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import {
  ERAS,
  COLLECTIONS,
  EMPTY_FILTERS,
  SORT_LABEL,
  activeCount,
  applyFilters,
  filtersFromURL,
  filtersToURL,
  sortProducts,
  type Filters,
  type SortKey,
} from "@/lib/catalog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteNav from "@/components/landing/SiteNav";
import SearchBar from "@/components/SearchBar";
import ProductGrid from "@/components/ProductGrid";
import FiltersPanel from "@/components/catalog/FiltersPanel";

type Quick = { key: string; label: string; patch: Partial<Filters> };

export default function CatalogoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*, product_sizes(*)")
      .eq("active", true)
      .order("created_at", { ascending: false });
    if (!error && data) setProducts(data as unknown as Product[]);
    setLoading(false);
  }, []);

  // Filtros iniciales desde el link (ej. /catalogo?equipo=Barcelona&epoca=2000s)
  useEffect(() => {
    setFilters(filtersFromURL(window.location.search));
  }, []);

  // Cada cambio de filtro se refleja en el link, para poder compartirlo.
  // (Se salta el estado inicial vacío, para no borrar el link antes de leerlo.)
  useEffect(() => {
    if (filters === EMPTY_FILTERS) return;
    const qs = filtersToURL(filters);
    window.history.replaceState(null, "", `${window.location.pathname}${qs}`);
  }, [filters]);

  useEffect(() => {
    fetchProducts();
    // Tiempo real: cualquier cambio en productos o tallas vuelve a traer la lista
    const channel = supabase
      .channel("catalogo-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => fetchProducts())
      .on("postgres_changes", { event: "*", schema: "public", table: "product_sizes" }, () => fetchProducts())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProducts]);

  // Bloquea el scroll del fondo con el panel de filtros abierto (celular)
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  const results = useMemo(() => sortProducts(applyFilters(products, filters), filters.sort), [products, filters]);

  // Accesos rápidos: solo los que tienen productos
  const quicks = useMemo<Quick[]>(() => {
    const has = (fn: (p: Product) => boolean) => products.some(fn);
    const q: Quick[] = [];
    ERAS.forEach((e) => has((p) => p.era === e) && q.push({ key: `e:${e}`, label: e === "Actual" ? "Actuales" : e, patch: { eras: [e] } }));
    COLLECTIONS.forEach(
      (c) => has((p) => (p.collections ?? []).includes(c)) && q.push({ key: `c:${c}`, label: c, patch: { collections: [c] } })
    );
    if (has((p) => !!p.on_sale)) q.push({ key: "sale", label: "🔥 Ofertas", patch: { onSale: true } });
    return q;
  }, [products]);

  const quickBase = { eras: [], collections: [], onSale: false };
  const isQuickActive = (patch: Partial<Filters>) => {
    const target = { ...filters, ...quickBase, ...patch };
    return JSON.stringify([filters.eras, filters.collections, filters.onSale]) ===
      JSON.stringify([target.eras, target.collections, target.onSale]);
  };
  const noQuick = !filters.eras.length && !filters.collections.length && !filters.onSale;

  // Etiquetas de filtros activos (se quitan con ✕)
  const pills: { label: string; remove: () => void }[] = [
    ...filters.teams.map((t) => ({ label: t, remove: () => setFilters({ ...filters, teams: filters.teams.filter((x) => x !== t) }) })),
    ...filters.eras.map((e) => ({ label: e, remove: () => setFilters({ ...filters, eras: filters.eras.filter((x) => x !== e) }) })),
    ...filters.collections.map((c) => ({
      label: c,
      remove: () => setFilters({ ...filters, collections: filters.collections.filter((x) => x !== c) }),
    })),
    ...filters.sizes.map((s) => ({ label: `Talla ${s}`, remove: () => setFilters({ ...filters, sizes: filters.sizes.filter((x) => x !== s) }) })),
    ...(filters.availability !== "all"
      ? [{ label: filters.availability === "now" ? "Entrega inmediata" : "En camino", remove: () => setFilters({ ...filters, availability: "all" }) }]
      : []),
    ...(filters.onSale ? [{ label: "🔥 Ofertas", remove: () => setFilters({ ...filters, onSale: false }) }] : []),
  ];
  const clearAll = () => setFilters({ ...EMPTY_FILTERS, sort: filters.sort });
  const nActive = activeCount(filters);

  return (
    <main className="min-h-screen bg-crema">
      <SiteNav />
      <Header totalAvailable={0} totalIncoming={0} isLive={false} />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Accesos rápidos */}
        {quicks.length > 0 && (
          <div className="-mx-4 px-4 mb-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            <QuickChip label="Todo" active={noQuick} onClick={() => setFilters({ ...filters, ...quickBase })} />
            {quicks.map((q) => (
              <QuickChip
                key={q.key}
                label={q.label}
                active={isQuickActive(q.patch)}
                onClick={() => setFilters({ ...filters, ...quickBase, ...q.patch })}
              />
            ))}
          </div>
        )}

        <div className="lg:grid lg:grid-cols-[250px_1fr] lg:gap-8">
          {/* Panel de filtros (computadora) */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 pb-6 [scrollbar-width:thin]">
              <FiltersPanel products={products} filters={filters} onChange={setFilters} />
            </div>
          </aside>

          <section className="min-w-0">
            <SearchBar value={filters.q} onChange={(q) => setFilters({ ...filters, q })} />

            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 rounded-full border border-azul-oscuro/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-azul-oscuro"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path d="M3 6h18M7 12h10M10 18h4" strokeLinecap="round" />
                </svg>
                Filtros{nActive ? ` (${nActive})` : ""}
              </button>
              <p className="text-sm text-azul-oscuro/70">
                {loading ? "Cargando..." : (
                  <>
                    <strong className="text-azul-oscuro">{results.length}</strong> camisa{results.length !== 1 ? "s" : ""}
                  </>
                )}
              </p>
              <label className="ml-auto flex items-center gap-2 text-xs text-azul-oscuro/60">
                <span className="hidden sm:inline">Ordenar:</span>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value as SortKey })}
                  className="rounded-md border border-azul-oscuro/15 bg-white px-2.5 py-2 text-xs font-bold text-azul-oscuro outline-none focus:border-azul"
                >
                  {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => (
                    <option key={k} value={k}>
                      {SORT_LABEL[k]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {pills.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {pills.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={p.remove}
                    className="inline-flex items-center gap-1.5 rounded-full bg-azul-oscuro text-white pl-3 pr-2 py-1 text-xs font-bold hover:bg-azul transition-colors"
                    aria-label={`Quitar filtro ${p.label}`}
                  >
                    {p.label}
                    <span className="text-white/70 text-sm leading-none">✕</span>
                  </button>
                ))}
                <button type="button" onClick={clearAll} className="text-xs font-bold text-azul underline underline-offset-2">
                  Limpiar todo
                </button>
              </div>
            )}

            <div className="mt-5">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="aspect-[3/4] rounded-xl bg-white border border-azul-oscuro/10 animate-pulse" />
                  ))}
                </div>
              ) : (
                <ProductGrid products={results} onClear={nActive || filters.q ? clearAll : undefined} />
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Panel de filtros (celular): hoja que sube desde abajo */}
      {sheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Filtros">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSheetOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] bg-crema rounded-t-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-azul-oscuro/10">
              <p className="font-display text-xl uppercase text-azul-oscuro">Filtros</p>
              <div className="flex items-center gap-4">
                {nActive > 0 && (
                  <button type="button" onClick={clearAll} className="text-xs font-bold text-azul underline">
                    Limpiar
                  </button>
                )}
                <button type="button" onClick={() => setSheetOpen(false)} className="text-2xl leading-none text-azul-oscuro" aria-label="Cerrar">
                  ✕
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <FiltersPanel products={products} filters={filters} onChange={setFilters} />
            </div>
            <div className="p-4 border-t border-azul-oscuro/10">
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="w-full rounded-full bg-azul-oscuro text-white py-3.5 text-sm font-bold uppercase tracking-wide"
              >
                Ver {results.length} camisa{results.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

function QuickChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] border-2 transition-colors ${
        active
          ? "bg-dorado border-dorado text-azul-oscuro"
          : "bg-white border-azul-oscuro/10 text-azul-oscuro hover:border-dorado"
      }`}
    >
      {label}
    </button>
  );
}
