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
          <div
