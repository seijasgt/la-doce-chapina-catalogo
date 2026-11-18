import { SITE } from "@/lib/site";

const ICONS = {
  instagram: (
    <path d="M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 4.8a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm5.2-9.6a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z" />
  ),
  tiktok: (
    <path d="M16.6 2h-3.4v13.4a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.2a6.3 6.3 0 1 0 5.4 6.2V8.6a8 8 0 0 0 4.6 1.5V6.7a4.6 4.6 0 0 1-4.6-4.7z" />
  ),
  facebook: (
    <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V22h3.4z" />
  ),
};

type Props = { className?: string; variant?: "light" | "dark" };

/** Botones de redes sociales. Los links se cambian en lib/site.ts */
export default function SocialLinks({ className = "", variant = "light" }: Props) {
  const links = [
    { key: "instagram" as const, href: SITE.instagramUrl, label: "Instagram" },
    { key: "tiktok" as const, href: SITE.tiktokUrl, label: "TikTok" },
    { key: "facebook" as const, href: SITE.facebookUrl, label: "Facebook" },
  ].filter((l) => l.href);

  const btn =
    variant === "light"
      ? "border-white/25 text-white hover:bg-dorado hover:border-dorado hover:text-azul-oscuro"
      : "border-azul-oscuro/20 text-azul-oscuro hover:bg-azul-oscuro hover:text-white";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {links.map((l) => (
        <a
          key={l.key}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${SITE.name} en ${l.label}`}
          className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${btn}`}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
            {ICONS[l.key]}
          </svg>
          {l.label}
        </a>
      ))}
    </div>
  );
}
