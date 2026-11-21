"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ImageLightboxProps = {
  images: string[];
  alt: string;
  startIndex?: number;
  onClose: () => void;
};

/**
 * Visor de fotos a pantalla completa.
 * - Flechas, teclado (← → Esc) y swipe en el celular.
 * - Miniaturas abajo cuando hay más de una foto.
 */
export default function ImageLightbox({ images, alt, startIndex = 0, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(Math.min(startIndex, images.length - 1));
  const touchX = useRef<number | null>(null);
  const many = images.length > 1;

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, go]);

  // Precarga la siguiente y la anterior para que el cambio sea instantáneo
  useEffect(() => {
    if (!many) return;
    [index + 1, index - 1].forEach((i) => {
      const img = new Image();
      img.src = images[(i + images.length) % images.length];
    });
  }, [index, images, many]);

  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null || !many) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  }

  const arrow =
    "absolute top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center text-2xl leading-none transition-colors";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 sm:p-8 cursor-zoom-out"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl leading-none transition-colors z-10"
      >
        ×
      </button>

      {many && (
        <p className="absolute top-5 left-1/2 -translate-x-1/2 sm:top-7 text-white/80 text-sm font-bold tabular-nums">
          {index + 1} / {images.length}
        </p>
      )}

      <div className="relative flex-1 w-full flex items-center justify-center min-h-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={images[index]}
          src={images[index]}
          alt={`${alt} — foto ${index + 1}`}
          onClick={(e) => e.stopPropagation()}
          className="max-w-full max-h-full object-contain rounded-lg cursor-default select-none"
          draggable={false}
        />
        {many && (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              className={`${arrow} left-0 sm:left-2 hidden sm:flex`}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Foto siguiente"
              onClick={(e) => { e.stopPropagation(); go(1); }}
              className={`${arrow} right-0 sm:right-2 hidden sm:flex`}
            >
              ›
            </button>
          </>
        )}
      </div>

      {many && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-4 flex gap-2 overflow-x-auto max-w-full pb-1 cursor-default"
        >
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 transition-all ${
                i === index ? "border-dorado opacity-100" : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
