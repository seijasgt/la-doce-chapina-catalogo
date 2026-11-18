import Link from "next/link";
import { SITE, whatsAppLink, WA_GENERAL, isExternal } from "@/lib/site";

export default function SiteNav() {
  const bajoPedido = SITE.bajoPedidoHref;
  const external = isExternal(bajoPedido);
  return (
    <nav className="sticky top-0 z-40 bg-azul-oscuro/95 backdrop-blur text-white border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Inicio">
          <span className="w-9 h-9 rounded-full bg-dorado flex items-center justify-center font-display text-azul-oscuro text-lg">
            12
          </span>
          <span className="font-display text-lg sm:text-xl tracking-wide uppercase">
            {SITE.name}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7 text-xs uppercase tracking-[0.14em] text-white/80">
          <Link href="/catalogo" className="hover:text-dorado transition-colors">
            En stock
          </Link>
          <a
            href={bajoPedido}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="hover:text-dorado transition-colors"
          >
            Bajo pedido
          </a>
          <a href="#como-funciona" className="hover:text-dorado transition-colors">
            Cómo funciona
          </a>
          <a href="#preguntas" className="hover:text-dorado transition-colors">
            Preguntas
          </a>
        </div>

        <a
          href={whatsAppLink(WA_GENERAL)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1fb959] px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors"
        >
          WhatsApp
        </a>
      </div>
      {/* Links en móvil */}
      <div className="md:hidden flex justify-center gap-6 pb-2.5 text-[11px] uppercase tracking-[0.14em] text-white/80">
        <Link href="/catalogo">En stock</Link>
        <a href={bajoPedido} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          Bajo pedido
        </a>
        <a href="#preguntas">Preguntas</a>
      </div>
    </nav>
  );
}
