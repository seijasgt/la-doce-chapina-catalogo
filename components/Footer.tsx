type FooterProps = {
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
};

export default function Footer({ instagramUrl, facebookUrl, tiktokUrl }: FooterProps) {
  return (
    <footer className="bg-azul-oscuro text-white/70 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs tracking-wide">
          © {new Date().getFullYear()} La Doce Chapina — Camisas de fútbol retro y actuales
        </p>
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.1em]">
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-dorado transition-colors">
              Instagram
            </a>
          )}
          {facebookUrl && (
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-dorado transition-colors">
              Facebook
            </a>
          )}
          {tiktokUrl && (
            <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-dorado transition-colors">
              TikTok
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
