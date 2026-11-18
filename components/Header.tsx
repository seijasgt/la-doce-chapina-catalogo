"use client";

type HeaderProps = {
  totalAvailable: number;
  totalIncoming: number;
  isLive: boolean;
};

// El contador de stock se quitó a pedido; las props se mantienen para no tocar el catálogo.
export default function Header(_props: HeaderProps) {
  return (
    <header className="bg-azul-oscuro text-white">
      <div className="max-w-6xl mx-auto px-4 pt-7 pb-6 sm:pt-10 sm:pb-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-dorado font-bold">Entrega inmediata</p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl tracking-wide uppercase">
          Camisas en stock
        </h1>

        <p className="mt-2 text-sm sm:text-base text-white/80 max-w-xl">
          Stock en vivo: elige tu talla y realiza tu pedido directamente por WhatsApp.
        </p>

      </div>
    </header>
  );
}
