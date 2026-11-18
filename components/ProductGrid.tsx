import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, onClear }: { products: Product[]; onClear?: () => void }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-azul-oscuro/10">
        <p className="font-display text-2xl uppercase text-azul-oscuro mb-2">Sin resultados</p>
        <p className="text-sm text-azul-oscuro/60">No hay camisas con esa combinación de filtros.</p>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="mt-5 rounded-full bg-azul-oscuro text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wide"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
