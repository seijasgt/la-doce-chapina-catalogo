import Link from "next/link";
import type { Product } from "@/lib/types";
import MiniProductCard from "./MiniProductCard";

type Props = {
  eyebrow: string;
  title: string;
  products: Product[];
  ctaHref: string;
  ctaLabel: string;
  dark?: boolean;
};

/** Fila horizontal deslizable de productos (en celular se desliza con el dedo). */
export default function ProductRail({ eyebrow, title, products, ctaHref, ctaLabel, dark }: Props) {
  if (!products.length) return null;
  return (
    <section className={dark ? "bg-azul-oscuro text-white" : ""}>
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className={`text-[11px] uppercase tracking-[0.2em] font-bold ${dark ? "text-dorado" : "text-azul"}`}>
              {eyebrow}
            </p>
            <h2 className={`font-display text-3xl sm:text-4xl uppercase ${dark ? "text-white" : "text-azul-oscuro"}`}>
              {title}
            </h2>
          </div>
          <Link
            href={ctaHref}
            className={`hidden sm:inline-block text-xs font-bold uppercase tracking-[0.14em] border-b-2 pb-0.5 transition-colors ${
              dark ? "border-dorado text-dorado hover:text-white" : "border-azul-oscuro text-azul-oscuro hover:text-azul"
            }`}
          >
            {ctaLabel} →
          </Link>
        </div>
        <div className="-mx-4 px-4 scroll-px-4 sm:mx-0 sm:px-0 sm:scroll-px-0 flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory pb-3 [scrollbar-width:thin]">
          {products.map((p) => (
            <MiniProductCard key={p.id} product={p} />
          ))}
        </div>
        <Link
          href={ctaHref}
          className={`sm:hidden mt-4 block text-center text-xs font-bold uppercase tracking-[0.14em] py-3 rounded-full border ${
            dark ? "border-dorado text-dorado" : "border-azul-oscuro text-azul-oscuro"
          }`}
        >
          {ctaLabel} →
        </Link>
      </div>
    </section>
  );
}
