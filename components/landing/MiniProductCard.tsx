import Link from "next/link";
import type { Product } from "@/lib/types";
import { computeStatus, fmtQ } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";

/** Tarjeta compacta para las filas de la portada. Lleva al catálogo con la búsqueda ya puesta. */
export default function MiniProductCard({ product }: { product: Product }) {
  const status = computeStatus(product);
  return (
    <Link
      href={`/catalogo?q=${encodeURIComponent(product.name)}`}
      className="group snap-start shrink-0 w-[44vw] sm:w-56 bg-white rounded-xl border border-azul-oscuro/10 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="relative aspect-square bg-crema overflow-hidden">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-5xl">
            {product.img || "⚽"}
          </span>
        )}
        <div className="absolute top-2 left-2">
          <StatusBadge status={status} />
        </div>
        {product.on_sale && (
          <div className="absolute top-2 right-2 bg-dorado text-azul-oscuro text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
            🔥 Oferta
          </div>
        )}
      </div>
      <div className="p-3">
        {product.team && (
          <p className="text-[10px] uppercase tracking-[0.12em] text-azul font-bold truncate">
            {product.team}
          </p>
        )}
        <h3 className="font-display text-base leading-tight text-azul-oscuro line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <p className="font-display text-lg text-azul-oscuro mt-1">{fmtQ(product.sale_price)}</p>
      </div>
    </Link>
  );
}
