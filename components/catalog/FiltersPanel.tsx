"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import {
  ERAS,
  COLLECTIONS,
  ADULT_SIZES,
  applyFilters,
  countBy,
  isNational,
  norm,
  type Filters,
  type Availability,
} from "@/lib/catalog";

type Props = {
  products: Product[];
  filters: Filters;
  onChange: (f: Filters) => void;
};

const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-5 border-b border-azul-oscuro/10 first:pt-0">
      <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-azul-oscuro mb-3">{title}</p>
      {children}
    </div>
  );
}

function Check({
  label,
  count,
  checked,
  onToggle,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 py-1 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="w-4 h-4 rounded border-azul-oscuro/30 accent-azul-oscuro shrink-0"
      />
      <span className={`text-sm flex-1 min-w-0 truncate ${checked ? "text-azul-oscuro font-bold" : "text-azul-oscuro/80 group-hover:text-azul-oscuro"}`}>
        {label}
      </span>
      {count !== undefined && <span className="text-xs text-azul-oscuro/40 tabular-nums">{count}</span>}
    </label>
  );
}

const TEAMS_VISIBLE = 8;

export default function FiltersPanel({ products, filters: f, onChange }: Props) {
  const [teamQuery, setTeamQuery] = useState("");
  const [showAllClubs, setShowAllClubs] = useState(false);
  const [showAllNations, setShowAllNations] = useState(false);
  const set = (patch: Partial<Filters>) => onChange({ ...f, ...patch });

  // Conteos: cada sección cuenta con los demás filtros aplicados, menos el suyo
  const teamCounts = useMemo(() => {
    const base = applyFilters(products, f, "teams");
    const clubs = countBy(base.filter((p) => !isNational(p)), (p) => [(p.team ?? "").trim()]);
    const nations = countBy(base.filter(isNational), (p) => [(p.team ?? "").trim()]);
    return { clubs, nations };
  }, [products, f]);
  const eraCounts = useMemo(() => countBy(applyFilters(products, f, "eras"), (p) => [p.era ?? ""]), [products, f]);
  const colCounts = useMemo(
    () => countBy(applyFilters(products, f, "collections"), (p) => p.collections ?? []),
    [products, f]
  );
  const sizeCounts = useMemo(
    () =>
      countBy(applyFilters(products, f, "sizes"), (p) =>
        (p.product_sizes ?? []).filter((v) => v.stock_available + (v.stock_incoming || 0) > 0).map((v) => v.size)
      ),
    [products, f]
  );
  const saleCount = useMemo(() => applyFilters(products, f, "onSale").filter((p) => p.on_sale).length, [products, f]);

  const sizes = useMemo(() => {
    const present = Array.from(sizeCounts.keys());
    const adult = ADULT_SIZES.filter((s) => present.includes(s));
    const kids = present.filter((s) => !ADULT_SIZES.includes(s)).sort((a, b) => parseInt(a) - parseInt(b));
    return { adult, kids };
  }, [sizeCounts]);

  // ¿Un equipo es selección? (para saber en qué grupo mostrarlo)
  const nationalTeams = useMemo(
    () => new Set(products.filter(isNational).map((p) => (p.team ?? "").trim())),
    [products]
  );

  function teamGroup(
    title: string,
    counts: Map<string, number>,
    showAll: boolean,
    setShowAll: (v: boolean) => void,
    national: boolean
  ) {
    let entries = Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0], "es"));
    // los equipos ya elegidos siempre se ven en su grupo, aunque el conteo sea 0
    f.teams.forEach((t) => !counts.has(t) && nationalTeams.has(t) === national && entries.push([t, 0]));
    if (teamQuery) entries = entries.filter(([t]) => norm(t).includes(norm(teamQuery)));
    if (!entries.length) return null;
    const visible = showAll || teamQuery ? entries : entries.slice(0, TEAMS_VISIBLE);
    return (
      <div className="mb-3 last:mb-0">
        <p className="text-[10px] uppercase tracking-[0.16em] text-azul mb-1">{title}</p>
        {visible.map(([t, n]) => (
          <Check key={t} label={t} count={n} checked={f.teams.includes(t)} onToggle={() => set({ teams: toggle(f.teams, t) })} />
        ))}
        {!teamQuery && entries.length > TEAMS_VISIBLE && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="mt-1 text-xs font-bold text-azul hover:text-azul-oscuro"
          >
            {showAll ? "Ver menos" : `Ver todos (${entries.length})`}
          </button>
        )}
      </div>
    );
  }

  const eras = ERAS.filter((e) => eraCounts.get(e) || f.eras.includes(e));
  const cols = COLLECTIONS.filter((c) => colCounts.get(c) || f.collections.includes(c));
  const clubs = teamGroup("Clubes", teamCounts.clubs, showAllClubs, setShowAllClubs, false);
  const nations = teamGroup("Selecciones", teamCounts.nations, showAllNations, setShowAllNations, true);

  const AVAIL: { v: Availability; l: string }[] = [
    { v: "all", l: "Todo" },
    { v: "now", l: "Entrega inmediata" },
    { v: "incoming", l: "En camino" },
  ];

  return (
    <div>
      <Section title="Disponibilidad">
        <div className="flex flex-wrap gap-1.5">
          {AVAIL.map(({ v, l }) => (
            <button
              key={v}
              type="button"
              onClick={() => set({ availability: v })}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                f.availability === v
                  ? "bg-azul-oscuro text-white border-azul-oscuro"
                  : "border-azul-oscuro/20 text-azul-oscuro hover:border-azul"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        {saleCount > 0 || f.onSale ? (
          <label className="mt-3 flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={f.onSale}
              onChange={() => set({ onSale: !f.onSale })}
              className="w-4 h-4 accent-azul-oscuro"
            />
            <span className="text-sm text-azul-oscuro">🔥 Solo ofertas</span>
            <span className="ml-auto text-xs text-azul-oscuro/40">{saleCount}</span>
          </label>
        ) : null}
      </Section>

      {(sizes.adult.length > 0 || sizes.kids.length > 0) && (
        <Section title="Talla">
          <div className="flex flex-wrap gap-1.5">
            {sizes.adult.map((s) => (
              <SizeChip key={s} size={s} active={f.sizes.includes(s)} onClick={() => set({ sizes: toggle(f.sizes, s) })} />
            ))}
          </div>
          {sizes.kids.length > 0 && (
            <>
              <p className="text-[10px] uppercase tracking-[0.16em] text-azul mt-3 mb-1.5">Niño</p>
              <div className="flex flex-wrap gap-1.5">
                {sizes.kids.map((s) => (
                  <SizeChip key={s} size={s} active={f.sizes.includes(s)} onClick={() => set({ sizes: toggle(f.sizes, s) })} />
                ))}
              </div>
            </>
          )}
        </Section>
      )}

      {(clubs || nations || teamQuery) && (
        <Section title="Equipo">
          <input
            type="search"
            value={teamQuery}
            onChange={(e) => setTeamQuery(e.target.value)}
            placeholder="Buscar equipo..."
            className="w-full mb-3 px-3 py-2 rounded-md border border-azul-oscuro/15 bg-white text-sm text-azul-oscuro placeholder:text-azul-oscuro/40 outline-none focus:border-azul"
          />
          {clubs}
          {nations}
          {teamQuery && !clubs && !nations && <p className="text-xs text-azul-oscuro/50">Ningún equipo coincide.</p>}
        </Section>
      )}

      {eras.length > 0 && (
        <Section title="Época">
          {eras.map((e) => (
            <Check key={e} label={e} count={eraCounts.get(e) ?? 0} checked={f.eras.includes(e)} onToggle={() => set({ eras: toggle(f.eras, e) })} />
          ))}
        </Section>
      )}

      {cols.length > 0 && (
        <Section title="Colecciones">
          {cols.map((c) => (
            <Check
              key={c}
              label={c}
              count={colCounts.get(c) ?? 0}
              checked={f.collections.includes(c)}
              onToggle={() => set({ collections: toggle(f.collections, c) })}
            />
          ))}
        </Section>
      )}
    </div>
  );
}

function SizeChip({ size, active, onClick }: { size: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-[2.75rem] h-9 px-2.5 rounded-md text-xs font-bold border transition-colors ${
        active ? "bg-azul-oscuro text-white border-azul-oscuro" : "border-azul-oscuro/20 text-azul-oscuro bg-white hover:border-azul"
      }`}
    >
      {size}
    </button>
  );
}
