import Link from "next/link";
import { getLandingData } from "@/lib/landing";
import { SITE, HOW_IT_WORKS, FAQ, whatsAppLink, WA_GENERAL, isExternal } from "@/lib/site";
import SocialLinks from "@/components/landing/SocialLinks";
import SiteNav from "@/components/landing/SiteNav";
import ProductRail from "@/components/landing/ProductRail";
import CategorySlider from "@/components/landing/CategorySlider";
import Footer from "@/components/Footer";

// Portadas fijas de las colecciones (si falta una, se usa la foto de un producto)
const COLLECTION_COVERS: Record<string, string> = {
  Leyendas: "/colecciones/leyendas.jpg",
  "Sin dorsal": "/colecciones/sin-dorsal.jpg",
  Colaboraciones: "/colecciones/colaboraciones.jpg",
  "Edición especial": "/colecciones/edicion-especial.jpg",
};

// La portada se regenera cada 5 minutos con el stock real de Supabase.
export const revalidate = 300;

export default async function Home() {
  const d = await getLandingData();
  const bajoPedido = SITE.bajoPedidoHref;
  const bajoPedidoExternal = isExternal(bajoPedido);
  const hero = d.heroProducts;

  return (
    <main className="min-h-screen bg-crema">
      <SiteNav />

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden bg-azul-oscuro text-white">
        {/* franjas diagonales sutiles, como de camisola */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #fff 0 2px, transparent 2px 28px)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-16 sm:pt-20 sm:pb-24 grid md:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-dorado font-bold">
              <span className="w-6 h-px bg-dorado" /> Guatemala · Retro y actuales
            </p>
            <h1 className="mt-4 font-display uppercase leading-[0.92] text-5xl sm:text-6xl lg:text-7xl">
              La camisa de
              <br />
              tu equipo,
              <br />
              <span className="text-dorado">lista para ti.</span>
            </h1>
            <p className="mt-6 text-white/75 text-base sm:text-lg max-w-md">
              Camisas de fútbol retro y de temporada, en stock o bajo pedido, con
              envío a toda Guatemala.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/catalogo"
                className="inline-flex justify-center items-center whitespace-nowrap rounded-full bg-dorado text-azul-oscuro px-6 py-3.5 text-sm font-bold uppercase tracking-[0.08em] hover:bg-white transition-colors"
              >
                Ver stock disponible
              </Link>
              <a
                href={bajoPedido}
                {...(bajoPedidoExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="inline-flex justify-center items-center whitespace-nowrap rounded-full border border-white/40 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.08em] hover:border-dorado hover:text-dorado transition-colors"
              >
                Ver catálogo bajo pedido
              </a>
            </div>

            <SocialLinks className="mt-10" />
          </div>

          {/* collage de camisas reales del stock */}
          <div className="relative h-[340px] sm:h-[440px] hidden sm:block">
            {hero.length ? (
              hero.map((p, i) => {
                const pos = [
                  "left-[18%] top-0 rotate-[-4deg] z-20 w-[62%]",
                  "left-0 top-[34%] rotate-[-11deg] z-10 w-[48%]",
                  "right-0 top-[40%] rotate-[8deg] z-30 w-[48%]",
                ][i];
                return (
                  <Link
                    key={p.id}
                    href={`/catalogo?q=${encodeURIComponent(p.name)}`}
                    className={`absolute ${pos} bg-white rounded-xl p-2 shadow-2xl hover:rotate-0 hover:z-40 transition-transform duration-300`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image_url!} alt={p.name} className="w-full aspect-square object-cover rounded-lg" />
                    <p className="text-azul-oscuro font-display text-sm mt-1.5 px-1 truncate">{p.name}</p>
                  </Link>
                );
              })
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-48 h-48 rounded-full bg-dorado flex items-center justify-center font-display text-azul-oscuro text-8xl">
                  12
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ DOS CAMINOS ═══ */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 sm:-mt-10 relative z-10">
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/catalogo"
            className="group bg-white rounded-2xl border border-azul-oscuro/10 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-shadow"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-azul font-bold">Entrega inmediata</p>
            <h2 className="font-display text-3xl uppercase text-azul-oscuro mt-1">En stock</h2>
            <p className="text-sm text-azul-oscuro/70 mt-2">
              Camisas que ya tenemos en Guatemala, con las tallas disponibles en vivo.
              Elige, confirma y te la enviamos.
            </p>
            <span className="inline-block mt-5 text-xs font-bold uppercase tracking-[0.14em] text-azul-oscuro border-b-2 border-dorado pb-0.5 group-hover:text-azul">
              Ver catálogo →
            </span>
          </Link>
          <a
            href={bajoPedido}
            {...(bajoPedidoExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group bg-dorado rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-shadow"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-azul-oscuro/70 font-bold">Personalizada</p>
            <h2 className="font-display text-3xl uppercase text-azul-oscuro mt-1">Bajo pedido</h2>
            <p className="text-sm text-azul-oscuro/80 mt-2">
              ¿No está en stock? Elige entre cientos de modelos y la pedimos para ti,
              con tu nombre, número y parches.
            </p>
            <span className="inline-block mt-5 text-xs font-bold uppercase tracking-[0.14em] text-azul-oscuro border-b-2 border-azul-oscuro pb-0.5">
              Ver catálogo bajo pedido →
            </span>
          </a>
        </div>
      </section>

      {/* ═══ OFERTAS ═══ */}
      <ProductRail
        eyebrow="🔥 Precios especiales"
        title="Ofertas"
        products={d.onSale}
        ctaHref="/catalogo?filtro=oferta"
        ctaLabel="Ver todas las ofertas"
      />

      {/* ═══ RECIÉN LLEGADAS ═══ */}
      <ProductRail
        eyebrow="Lo más nuevo"
        title="Recién llegadas"
        products={d.newArrivals}
        ctaHref="/catalogo"
        ctaLabel="Ver todo el stock"
        dark={d.onSale.length > 0}
      />

      {/* ═══ POR EQUIPO ═══ */}
      <CategorySlider eyebrow="Busca a tu club" title="Compra por equipo" items={d.teams} param="equipo" variant="team" />

      {/* ═══ POR COLECCIÓN ═══ */}
      <CategorySlider
        eyebrow="Selección especial"
        title="Compra por colección"
        items={d.collections.map((c) => ({ ...c, image: COLLECTION_COVERS[c.name] ?? c.image }))}
        param="coleccion"
        variant="collection"
        blurbs={{
          Leyendas: "Las camisas de los ídolos que marcaron época.",
          "Sin dorsal": "Limpias, sin nombre ni número.",
          Colaboraciones: "Ediciones con marcas y artistas.",
          "Edición especial": "Aniversarios y ediciones únicas.",
        }}
      />

      {/* ═══ POR ÉPOCA ═══ */}
      <CategorySlider
        eyebrow="Viaja en el tiempo"
        title="Compra por época"
        items={d.eras}
        param="epoca"
        variant="era"
        dark
        labels={{ Actual: "Actuales", "80s y antes": "80s y antes" }}
      />

      {/* ═══ CÓMO FUNCIONA ═══ */}
      <section id="como-funciona" className="bg-white border-y border-azul-oscuro/10 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <p className="text-[11px] uppercase tracking-[0.2em] text-azul font-bold">Fácil y seguro</p>
          <h2 className="font-display text-3xl sm:text-4xl uppercase text-azul-oscuro">Cómo funciona</h2>
          <ol className="mt-8 grid sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((s) => (
              <li key={s.n} className="relative">
                <span className="font-display text-6xl text-dorado leading-none">{s.n}</span>
                <h3 className="font-display text-xl uppercase text-azul-oscuro mt-2">{s.title}</h3>
                <p className="text-sm text-azul-oscuro/70 mt-1.5">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══ PREGUNTAS ═══ */}
      <section id="preguntas" className="max-w-3xl mx-auto px-4 py-14 scroll-mt-20">
        <p className="text-[11px] uppercase tracking-[0.2em] text-azul font-bold text-center">Resolvemos tus dudas</p>
        <h2 className="font-display text-3xl sm:text-4xl uppercase text-azul-oscuro text-center">
          Preguntas frecuentes
        </h2>
        <div className="mt-8 divide-y divide-azul-oscuro/10 border-y border-azul-oscuro/10">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex justify-between items-center gap-4 cursor-pointer list-none font-bold text-azul-oscuro">
                {f.q}
                <span className="text-dorado text-2xl leading-none transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm text-azul-oscuro/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="max-w-6xl mx-auto px-4 pb-4">
        <div className="rounded-2xl bg-azul-oscuro text-white px-6 py-12 sm:px-12 text-center relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "repeating-linear-gradient(135deg, #fff 0 2px, transparent 2px 28px)" }}
          />
          <h2 className="relative font-display text-3xl sm:text-5xl uppercase">
            ¿Buscas una camisa en especial?
          </h2>
          <p className="relative mt-3 text-white/75 max-w-lg mx-auto">
            Escríbenos y te ayudamos a encontrarla, en stock o bajo pedido.
          </p>
          <a
            href={whatsAppLink(WA_GENERAL)}
            target="_blank"
            rel="noopener noreferrer"
            className="relative mt-7 inline-flex items-center justify-center rounded-full bg-[#25D366] hover:bg-[#1fb959] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] transition-colors"
          >
            Escríbenos por WhatsApp
          </a>
          <div className="relative mt-8 pt-6 border-t border-white/10">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">Síguenos para ver lo nuevo primero</p>
            <SocialLinks className="mt-3 justify-center" />
          </div>
        </div>
      </section>

      <Footer instagramUrl={SITE.instagramUrl} facebookUrl={SITE.facebookUrl} tiktokUrl={SITE.tiktokUrl} />
    </main>
  );
}
