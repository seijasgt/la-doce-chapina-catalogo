/**
 * Textos y datos generales de la tienda.
 * Todo lo que se puede cambiar sin tocar diseño vive aquí:
 * redes, links, preguntas frecuentes, pasos de "cómo funciona".
 */

export const SITE = {
  name: "La Doce Chapina",
  tagline: "Camisas de fútbol retro y actuales en Guatemala",
  instagramUrl: "https://www.instagram.com/la_12_chapina/",
  tiktokUrl: "https://www.tiktok.com/@la_12_chapina?lang=es",
  facebookUrl: undefined as string | undefined,
  // Temporal: mientras rehacemos el catálogo bajo pedido dentro de esta tienda,
  // todo lo de "bajo pedido" lleva al catálogo de Netlify.
  // Cuando el nuevo esté listo, cambia esto a "/bajo-pedido".
  bajoPedidoHref: "https://la12chapina.netlify.app/",
};

export const HOW_IT_WORKS = [
  {
    n: "1",
    title: "Elige tu camisa",
    text: "Explora nuestro catálogo en stock o el catálogo bajo pedido, escoge tu modelo y personalízalo a tu gusto.",
  },
  {
    n: "2",
    title: "Confirma tu pedido",
    text: "Hazlo aquí mismo en la página o por WhatsApp. Paga con tarjeta, por transferencia o en efectivo al recibir.",
  },
  {
    n: "3",
    title: "Recíbela en casa",
    text: "Enviamos a toda Guatemala con Forza Delivery y Cargo Expreso, y te damos seguimiento en todo momento.",
  },
];

export const FAQ = [
  {
    q: "¿Hacen envíos a todo el país?",
    a: "Sí. Enviamos a todos los departamentos de Guatemala con Forza Delivery y Cargo Expreso, y te damos seguimiento hasta que tu camisa llegue.",
  },
  {
    q: "¿Cómo puedo pagar?",
    a: "Con tarjeta, por transferencia bancaria o en efectivo al recibir tu pedido.",
  },
  {
    q: "¿Qué significa “en camino”?",
    a: "Son camisas que ya pedimos y vienen hacia Guatemala. Puedes pre-reservar tu talla y te la entregamos en cuanto llegue.",
  },
  {
    q: "¿Qué es un pedido personalizado (bajo pedido)?",
    a: "Si la camisa que buscas no está en stock, la pedimos para ti, con el nombre, número y parches que quieras. Revisa nuestro catálogo bajo pedido y escríbenos para confirmar precio y tiempo de entrega.",
  },
  {
    q: "¿Qué tallas manejan?",
    a: "Tallas de adulto de S a 4XL y tallas de niño. En cada camisa ves exactamente qué tallas hay disponibles.",
  },
];

/** true si el link sale de esta página (se abre en otra pestaña) */
export const isExternal = (href: string) => /^https?:\/\//.test(href);

/** Link general de WhatsApp con mensaje prellenado */
export function whatsAppLink(message: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export const WA_GENERAL = "Hola, vi la página de La Doce Chapina y quiero información.";
export const WA_BAJO_PEDIDO =
  "Hola, quiero cotizar una camisa bajo pedido. Modelo: ___ · Talla: ___ · Nombre y número (opcional): ___";
