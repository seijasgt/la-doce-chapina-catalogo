import Link from "next/link";
import { SITE, isExternal } from "@/lib/site";
import SocialLinks from "@/components/landing/SocialLinks";

// Las redes se leen de lib/site.ts (las props se mantienen por compatibilidad).
type FooterProps = {
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
};

export default function Footer(_props: FooterProps) {
  const bp = SITE.bajoPedidoHref;
  return (
    <footer className="bg-azul-oscuro text-white/70 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-[1.4fr_1fr_1fr] items-start">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-full bg-dorado flex items-center justify-center font-display text-azul-oscuro text-lg">
              12
            </span>
            <span className="font-display text-lg tracking-wide uppercase text-white">{SITE.name}</span>
          </div>
          <p className="mt-3 text-sm max-w-xs">{SITE.tagline}.</p>
        </div>
        <div className="text-sm space-y-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-dorado font-bold mb-3">Tienda</p>
          <Link href="/catalogo" className="block hover:text-dorado transition-colors">En stock</Link>
          <a
            href={bp}
            {...(isExternal(bp) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="block hover:text-dorado transition-colors"
          >
            Bajo pedido
          </a>
          <Link href="/#preguntas" className="block hover:text-dorado transition-colors">Preguntas frecuentes</Link>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-dorado font-bold mb-3">Síguenos</p>
          <SocialLinks className="flex-wrap" />
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="max-w-6xl mx-auto px-4 py-4 text-xs tracking-wide">
          © {new Date().getFullYear()} {SITE.name} — Camisas de fútbol retro y actuales
        </p>
      </div>
    </footer>
  );
}
