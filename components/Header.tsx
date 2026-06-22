"use client";

type HeaderProps = {
  totalAvailable: number;
  totalIncoming: number;
  isLive: boolean;
};

export default function Header({ totalAvailable, totalIncoming, isLive }: HeaderProps) {
  return (
    <header className="bg-azul-oscuro text-white">
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-6 sm:pt-12 sm:pb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-dorado flex items-center justify-center font-display text-azul-oscuro text-xl shrink-0">
            12
          </div>
          <h1 className="font-display text-2xl sm:text-3xl tracking-wide uppercase">
            La Doce Chapina
          </h1>
        </div>

        <p className="mt-3 text-sm sm:text-base text-white/80 max-w-xl">
          Explora nuestro stock disponible y realiza tu pedido directamente por
          WhatsApp.
        </p>

        {/* Signature element: marcador estilo marcador de estadio, en vivo */}
        <div className="mt-6 inline-flex items-stretch rounded-lg overflow-hidden border border-white/15 bg-black/20">
          <div className="px-4 py-2.5 flex items-center gap-2 border-r border-white/15">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                isLive ? "bg-dorado animate-pulse" : "bg-white/30"
              }`}
              aria-hidden
            />
            <span className="text-[10px] tracking-[0.15em] uppercase text-white/70">
              {isLive ? "En vivo" : "Cargando"}
            </span>
          </div>
          <div className="px-4 py-2.5 border-r border-white/15">
            <span className="font-display text-lg leading-none">{totalAvailable}</span>
            <span className="ml-1.5 text-[10px] tracking-[0.1em] uppercase text-white/70">
              disponibles
            </span>
          </div>
          <div className="px-4 py-2.5">
            <span className="font-display text-lg leading-none text-dorado">
              {totalIncoming}
            </span>
            <span className="ml-1.5 text-[10px] tracking-[0.1em] uppercase text-white/70">
              en camino
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
