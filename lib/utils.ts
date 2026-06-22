import type { Product, ProductVariant, ComputedStatus } from "./types";

const LOW_STOCK_THRESHOLD = 3;

/** Suma de disponible + en camino para una variante (lo que realmente se puede ofrecer) */
export function variantOfferable(v: ProductVariant): number {
  return v.stock_available + v.stock_incoming;
}

/** Estado calculado de un producto completo, según el conjunto de tallas */
export function computeStatus(product: Product): ComputedStatus {
  const variants = product.product_sizes ?? [];
  const totalAvailable = variants.reduce((a, v) => a + v.stock_available, 0);
  const totalIncoming = variants.reduce((a, v) => a + v.stock_incoming, 0);

  if (totalAvailable === 0 && totalIncoming === 0) return "sold_out";
  if (totalAvailable === 0 && totalIncoming > 0) return "incoming";
  if (totalAvailable > 0 && totalAvailable <= LOW_STOCK_THRESHOLD) return "low_stock";
  return "available";
}

/** Estado de una talla individual, para mostrar pastillas por talla en la tarjeta */
export function computeVariantStatus(v: ProductVariant): ComputedStatus {
  if (v.stock_available === 0 && v.stock_incoming === 0) return "sold_out";
  if (v.stock_available === 0 && v.stock_incoming > 0) return "incoming";
  if (v.stock_available > 0 && v.stock_available <= LOW_STOCK_THRESHOLD) return "low_stock";
  return "available";
}

export const STATUS_LABEL: Record<ComputedStatus, string> = {
  available: "Disponible",
  low_stock: "Últimas unidades",
  incoming: "En camino",
  sold_out: "Agotado",
};

export const STATUS_COLOR: Record<ComputedStatus, string> = {
  available: "bg-azul text-white",
  low_stock: "bg-dorado text-azul-oscuro",
  incoming: "bg-azul-oscuro text-white",
  sold_out: "bg-gray-300 text-gray-600",
};

export function fmtQ(n: number): string {
  return "Q" + Number(n || 0).toLocaleString("es-GT", { maximumFractionDigits: 2 });
}

const SIZE_ORDER = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"];
export function sortSizes(variants: ProductVariant[]): ProductVariant[] {
  return [...variants].sort((a, b) => {
    const ia = SIZE_ORDER.indexOf(a.size);
    const ib = SIZE_ORDER.indexOf(b.size);
    if (ia === -1 && ib === -1) return a.size.localeCompare(b.size);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

/**
 * Construye el link de WhatsApp con mensaje prellenado.
 * type='stock' -> mensaje de consulta normal
 * type='incoming' -> mensaje de pre-reserva
 */
export function buildWhatsAppLink(opts: {
  productName: string;
  size?: string;
  type: "stock" | "incoming";
}): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const { productName, size, type } = opts;

  const sizeText = size ? ` en talla ${size}` : "";
  const message =
    type === "incoming"
      ? `Hola, vi en el catálogo de La Doce Chapina la camisa ${productName}${sizeText}. Quiero realizar una pre-reserva del producto en camino.`
      : `Hola, vi en el catálogo de La Doce Chapina la camisa ${productName}${sizeText}. ¿Me podrías ayudar con la compra?`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
