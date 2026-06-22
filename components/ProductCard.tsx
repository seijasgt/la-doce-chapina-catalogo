"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/lib/types";
import {
  computeStatus,
  computeVariantStatus,
  sortSizes,
  fmtQ,
} from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import WhatsAppButton from "./WhatsAppButton";
import ImageLightbox from "./ImageLightbox";
import { supabase } from "@/lib/supabase";

export default function ProductCard({ product }: { product: Product }) {
  const variants = useMemo(() => sortSizes(product.product_sizes ?? []), [product]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const overallStatus = computeStatus(product);
  const selectedVariant = variants.find((v) => v.size === selectedSize) ?? null;
  const selectedVariantStatus = selectedVariant ? computeVariantStatus(selectedVariant) : null;

  const isIncomingOnly = selectedVariantStatus === "incoming";
  const isSoldOut = overallStatus === "sold_out";

  async function logLead() {
    if (!selectedSize) return;
    try {
      await supabase.from("catalog_leads").insert({
        product_id: product.id,
        size: selectedSize,
        type: isIncomingOnly ? "pre_reserva" : "stock",
      });
    } catch {
      // Silencioso: si falla el log, no debe bloquear la experiencia del cliente
    }
  }

  return (
    <article className="bg-white rounded-xl border border-azul-oscuro/10 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      <button
        type="button"
        onClick={() => product.image_url && setLightboxOpen(true)}
        className="relative aspect-square bg-crema flex items-center justify-center overflow-hidden w-full cursor-zoom-in"
        aria-label={product.image_url ? "Ver imagen en grande" : undefined}
      >
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-6xl" aria-hidden>
            {product.img || "⚽"}
          </span>
        )}
        <div className="absolute top-2.5 left-2.5">
          <StatusBadge status={overallStatus} />
        </div>
        {product.on_sale && (
          <div className="absolute top-2.5 right-2.5 bg-dorado text-azul-oscuro text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm">
            🔥 Oferta
          </div>
        )}
        {product.image_url && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white rounded-full p-1.5">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden>
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" />
            </svg>
          </div>
        )}
      </button>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          {product.team && (
            <p className="text-[10px] uppercase tracking-[0.12em] text-azul font-bold mb-0.5">
              {product.team}
            </p>
          )}
          <h3 className="font-display text-lg leading-tight text-azul-oscuro">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-azul-oscuro/60 mt-1 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        <p className="font-display text-xl text-azul-oscuro">{fmtQ(product.sale_price)}</p>

        {/* Selector de talla */}
        <div>
          <p className="text-[10px] uppercase tracking-wide text-azul-oscuro/50 mb-1.5">
            Tallas
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {variants.map((v) => {
              const st = computeVariantStatus(v);
              const disabled = st === "sold_out";
              const active = selectedSize === v.size;
              return (
                <button
                  key={v.id}
                  disabled={disabled}
                  onClick={() => setSelectedSize(active ? null : v.size)}
                  title={
                    st === "incoming"
                      ? `En camino · ${v.stock_incoming} unidad(es)`
                      : st === "low_stock"
                      ? `Últimas ${v.stock_available} unidades`
                      : st === "sold_out"
                      ? "Agotado"
                      : "Disponible"
                  }
                  className={`relative min-w-[2.25rem] h-9 px-2 rounded-md text-xs font-bold border transition-colors ${
                    disabled
                      ? "border-gray-200 text-gray-300 line-through cursor-not-allowed"
                      : active
                      ? "bg-azul-oscuro text-white border-azul-oscuro"
                      : st === "incoming"
                      ? "border-dorado text-azul-oscuro bg-dorado/10"
                      : "border-azul-oscuro/20 text-azul-oscuro hover:border-azul"
                  }`}
                >
                  {v.size}
                </button>
              );
            })}
          </div>
        </div>

        {isIncomingOnly && (
          <p className="text-[11px] text-azul-oscuro/60 bg-dorado/10 border border-dorado/30 rounded-md px-2.5 py-1.5">
            <strong className="text-azul-oscuro">En camino.</strong> Entrega cuando
            ingrese el producto.
          </p>
        )}

        <div className="mt-auto pt-1">
          <WhatsAppButton
            productName={product.name}
            size={selectedSize ?? undefined}
            type={isIncomingOnly ? "incoming" : "stock"}
            disabled={isSoldOut || !selectedSize}
            onClick={logLead}
          />
        </div>
      </div>

      {lightboxOpen && product.image_url && (
        <ImageLightbox
          src={product.image_url}
          alt={product.name}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </article>
  );
}
