"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/lib/types";
import {
  computeStatus,
  computeVariantStatus,
  sortSizes,
  fmtQ,
  productImages,
} from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import WhatsAppButton from "./WhatsAppButton";
import ImageLightbox from "./ImageLightbox";
import { supabase } from "@/lib/supabase";

export default function ProductCard({ product }: { product: Product }) {
  // Solo se muestran las tallas que hay (en stock o en camino)
  const variants = useMemo(
    () => sortSizes((product.product_sizes ?? []).filter((v) => v.stock_available + (v.stock_incoming || 0) > 0)),
    [product]
  );
  const tags = [product.era, ...(product.collections ?? [])].filter(Boolean) as string[];
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const images = useMemo(() => productImages(product), [product]);
  const cover = images[0] ?? null;
  const hoverImg = images[1] ?? null; // en compu, al pasar el mouse se ve la 2a foto (normalmente el dorsal)

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
        onClick={() => cover && setLightboxOpen(true)}
        className="group relative aspect-square bg-crema flex items-center justify-center overflow-hidden w-full cursor-zoom-in"
        aria-label={cover ? (images.length > 1 ? `Ver ${images.length} fotos` : "Ver imagen en grande") : undefined}
      >
        {cover ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {hoverImg && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hoverImg}
                alt=""
                aria-hidden
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100"
              />
            )}
          </>
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
        {cover && (
          <div className="absolute bottom-2 right-2 bg-black/55 text-white rounded-full px-2 py-1 flex items-center gap-1 text-[11px] font-bold leading-none">
            {images.length > 1 ? (
              <>
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden>
                  <path d="M9 3 7.2 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.2L15 3H9zm3 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                </svg>
                {images.length}
              </>
            ) : (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden>
                <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" />
              </svg>
            )}
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
          {tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {tags.map((t) => (
                <span key={t} className="text-[10px] font-bold uppercase tracking-wide text-azul-oscuro/60 bg-crema border border-azul-oscuro/10 rounded px-1.5 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          )}
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
            {variants.length === 0 && <span className="text-xs text-azul-oscuro/40">Agotado</span>}
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

      {lightboxOpen && cover && (
        <ImageLightbox
          images={images}
          alt={product.name}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </article>
  );
}
