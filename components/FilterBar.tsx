"use client";

import type { AvailabilityFilter, StockType } from "@/lib/types";

const SIZES = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"];

const AVAILABILITY_OPTIONS: { value: AvailabilityFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "available", label: "Disponible" },
  { value: "low_stock", label: "Últimas unidades" },
  { value: "incoming", label: "En camino" },
  { value: "sold_out", label: "Agotado" },
];

const TYPE_OPTIONS: { value: StockType; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "stock", label: "Stock actual" },
  { value: "incoming", label: "En camino" },
];

type FilterBarProps = {
  teams: string[];
  selectedSize: string | null;
  onSizeChange: (size: string | null) => void;
  selectedTeam: string;
  onTeamChange: (team: string) => void;
  availability: AvailabilityFilter;
  onAvailabilityChange: (v: AvailabilityFilter) => void;
  stockType: StockType;
  onStockTypeChange: (v: StockType) => void;
  onClear: () => void;
};

export default function FilterBar({
  teams,
  selectedSize,
  onSizeChange,
  selectedTeam,
  onTeamChange,
  availability,
  onAvailabilityChange,
  stockType,
  onStockTypeChange,
  onClear,
}: FilterBarProps) {
  return (
    <div className="space-y-3">
      {/* Tallas: chips horizontales, estilo número de camiseta */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {SIZES.map((size) => {
          const active = selectedSize === size;
          return (
            <button
              key={size}
              onClick={() => onSizeChange(active ? null : size)}
              className={`shrink-0 font-display text-sm px-3.5 py-2 rounded-md border transition-colors ${
                active
                  ? "bg-azul-oscuro text-white border-azul-oscuro"
                  : "bg-white text-azul-oscuro border-azul-oscuro/20 hover:border-azul"
              }`}
              aria-pressed={active}
            >
              {size}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={selectedTeam}
          onChange={(e) => onTeamChange(e.target.value)}
          className="text-sm px-3 py-2 rounded-md border border-azul-oscuro/20 bg-white text-azul-oscuro outline-none focus:border-azul"
        >
          <option value="">Equipo o selección</option>
          {teams.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={availability}
          onChange={(e) => onAvailabilityChange(e.target.value as AvailabilityFilter)}
          className="text-sm px-3 py-2 rounded-md border border-azul-oscuro/20 bg-white text-azul-oscuro outline-none focus:border-azul"
        >
          {AVAILABILITY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          value={stockType}
          onChange={(e) => onStockTypeChange(e.target.value as StockType)}
          className="text-sm px-3 py-2 rounded-md border border-azul-oscuro/20 bg-white text-azul-oscuro outline-none focus:border-azul"
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <button
          onClick={onClear}
          className="text-sm px-3 py-2 rounded-md text-azul-oscuro/60 hover:text-azul-oscuro underline"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}
