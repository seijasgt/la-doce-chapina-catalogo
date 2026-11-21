"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Category } from "@/lib/landing";

type Variant = "team" | "collection" | "era";

type Props = {
  eyebrow: string;
  title: string;
  items: Category[];
  /** Parámetro del catálogo: equipo | coleccion | epoca */
  param: "equipo" | "coleccion" | "epoca";
  variant: Variant;
  dark?: boolean;
  /** Textos cortos debajo del nombre (para colecciones) */
  blurbs?: Record<string, string>;
  /** Nombre a mostrar si es distinto del valor (ej. "Actual" → "Actuales") */
  labels?: Record<string, string>;
};

const modelos = (n: number) => `${n} modelo${n !== 1 ? "s" : ""}`;

/** Fila deslizable de tarjetas (equipos, colecciones o épocas) con flechas en computadora. */
export default function CategorySlider({ eyebrow, title, items, param, variant, dark, blurbs, labels }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  if (!items.length) return null;

  const move = (dir: number) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: "smooth" });

  const arrow = `w-10 h-10 rounded-full border flex items-center justify-center text-xl leading-none transition-colors disabled:opacity-25 disabled:cursor-default ${
    dark
      ? "border-white/30 text-white enabled:hover:border-dorado enabled:hover:text-dorado"
      : "border-azul-oscuro/20 text-azul-oscuro enabled:hover:border-azul enabled:hover:text-azul"
  }`;

  return (
    <section className={dark ? "bg-azul-oscuro text-white" : ""}>
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className={`text-[11px] uppercase tracking-[0.2em] font-bold ${dark ? "text-dorado" : "text-azul"}`}>{eyebrow}</p>
            <h2 className={`font-display text-3xl sm:text-4xl uppercase ${dark ? "text-white" : "text-azul-oscuro"}`}>{title}</h2>
          </div>
          <div className="hidden sm:flex gap-2">
            <button type="button" aria-label="Anterior" className={arrow} disabled={!canPrev} onClick={() => move(-1)}>
              ‹
            </button>
            <button type="button" aria-label="Siguiente" className={arrow} disabled={!canNext} onClick={() => move(1)}>
              ›
            </button>
          </div>
        </div>

        <div
          ref={track}
          onScroll={update}
          className="-mx-4 px-4 scroll-px-4 sm:mx-0 sm:px-0 sm:scroll-px-0 flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((it) => {
            const href = `/catalogo?${param}=${encodeURIComponent(it.name)}`;
            const label = labels?.[it.name] ?? it.name;

            if (variant === "team")
              return (
                <Link
                  key={it.name}
                  href={href}
                  className="group snap-start shrink-0 w-[132px] sm:w-[160px] bg-white rounded-xl border border-azul-oscuro/10 overflow-hidden hover:border-azul hover:shadow-md transition-all"
                >
                  <span className="block aspect-square bg-crema overflow-hidden">
                    {it.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.image} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-4xl">⚽</span>
                    )}
                  </span>
                  <span className="block px-3 py-2.5">
                    <span className="block font-display text-base uppercase text-azul-oscuro truncate group-hover:text-azul">{label}</span>
                    <span className="block text-[11px] text-azul-oscuro/50">{modelos(it.count)}</span>
                  </span>
                </Link>
              );

            if (variant === "collection")
              return (
                <Link
                  key={it.name}
                  href={href}
                  className="group snap-start shrink-0 relative w-[230px] sm:w-[270px] aspect-[4/5] rounded-2xl overflow-hidden bg-azul-oscuro"
                >
                  {it.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <span className="absolute inset-0 bg-gradient-to-t from-azul-oscuro via-azul-oscuro/40 to-transparent" />
                  <span className="absolute top-3 right-3 bg-dorado text-azul-oscuro text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
                    {modelos(it.count)}
                  </span>
                  <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <span className="block font-display text-2xl uppercase leading-none">{label}</span>
                    {blurbs?.[it.name] && <span className="block text-xs text-white/75 mt-1.5">{blurbs[it.name]}</span>}
                    <span className="inline-block mt-3 text-[11px] font-bold uppercase tracking-[0.14em] border-b-2 border-dorado pb-0.5">
                      Ver colección →
                    </span>
                  </span>
                </Link>
              );

            // Época: foto a todo color, degradado y el año grande abajo
            return (
              <Link
                key={it.name}
                href={href}
                className="group snap-start shrink-0 relative w-[170px] sm:w-[200px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 hover:border-dorado transition-colors bg-azul"
              >
                {it.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-azul-oscuro via-azul-oscuro/30 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-4">
                  <span
                    className={`block font-display text-dorado leading-[0.95] break-words ${
                      label.length <= 5 ? "text-5xl" : "text-3xl"
                    }`}
                  >
                    {label}
                  </span>
                  <span className="block mt-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/85">{modelos(it.count)}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
