/**
 * Textos y datos generales de la tienda.
 * Todo lo que se puede cambiar sin tocar diseño vive aquí:
 * redes, links, preguntas frecuentes, pasos de "cómo funciona".
 */

export const SITE = {
  name: "La Doce Chapina",
  tagline: "Camisas de fútbol retro y actuales en Guatemala",
  instagramUrl: "https://instagram.com/ladocechapina",
  facebookUrl: "https://facebook.com/ladocechapina",
  tiktokUrl: undefined as string | undefined,
  // Temporal: mientras rehacemos el catálogo bajo pedido dentro de esta tienda,
  // el botón de "Bajo pedido" abre WhatsApp. Cuando esté listo, cambia a "/bajo-pedido".
  bajoPedidoHref: null as string | null,
};

export const HOW_IT_WORKS = [
  {
    n: "1",
    title: "Elige tu camisa",
    text: "Mira el stock en vivo y elige tu talla. Si no la tenemos, te la conseguimos bajo pedido.",
  },
  {
    n: "2",
    title: "Confirma tu pedido",
    text: "Escríbenos por WhatsApp con un clic. Pagas por transferencia o contra entrega.",
  },
  {
    n: "3",
    title: "Recíbela en casa",
    text: "Enviamos a toda Guatemala por Guatex y Cargo Expreso.",
  },
];

export const FAQ = [
  {
    q: "¿Hacen envíos a todo el país?",
    a: "Sí. Enviamos a todos los departamentos de Guatemala por Guatex y Cargo Expreso.",
  },
  {
    q: "¿Cómo puedo pagar?",
    a: "Por transferencia bancaria o contra entrega. Muy pronto también con tarjeta directamente en la página.",
  },
  {
    q: "¿Qué significa “en camino”?",
    a: "Son camisas que ya pedimos y vienen hacia Guatemala. Puedes pre-reservar tu talla y te la entregamos en cuanto llegue.",
  },
  {
    q: "¿Qué es un pedido personalizado (bajo pedido)?",
    a: "Si la camisa que buscas no está en stock, la pedimos para ti, con el nombre, número y parches que quieras. Escríbenos por WhatsApp para cotizar y conocer el tiempo de entrega.",
  },
  {
    q: "¿Qué tallas manejan?",
    a: "Tallas de adulto de S a 4XL y tallas de niño. En cada camisa ves exactamente qué tallas hay disponibles.",
  },
];

/** Link general de WhatsApp con mensaje prellenado */
export function whatsAppLink(message: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export const WA_GENERAL = "Hola, vi la página de La Doce Chapina y quiero información.";
export const WA_BAJO_PEDIDO =
  "Hola, quiero cotizar una camisa bajo pedido. Modelo: ___ · Talla: ___ · Nombre y número (opcional): ___";
