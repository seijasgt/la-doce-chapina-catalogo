"use client";

import { buildWhatsAppLink } from "@/lib/utils";

type WhatsAppButtonProps = {
  productName: string;
  size?: string;
  type: "stock" | "incoming";
  disabled?: boolean;
  onClick?: () => void;
};

export default function WhatsAppButton({
  productName,
  size,
  type,
  disabled,
  onClick,
}: WhatsAppButtonProps) {
  if (disabled) {
    return (
      <button
        disabled
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-gray-200 text-gray-400 text-sm font-semibold cursor-not-allowed"
      >
        Selecciona una talla
      </button>
    );
  }

  const href = buildWhatsAppLink({ productName, size, type });
  const label = type === "incoming" ? "Pre-reservar por WhatsApp" : "Consultar por WhatsApp";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-[#25D366] hover:bg-[#1fb959] text-white text-sm font-semibold transition-colors"
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
        <path d="M17.6 6.32A8.86 8.86 0 0 0 12.05 4C7.45 4 3.7 7.76 3.7 12.35c0 1.55.43 3 1.16 4.27L4 20.5l3.98-1.04a8.77 8.77 0 0 0 4.08 1.03h.01c4.6 0 8.34-3.76 8.34-8.35a8.3 8.3 0 0 0-2.81-5.82zm-5.56 12.83h-.01a7.3 7.3 0 0 1-3.7-1.02l-.27-.16-2.75.72.73-2.67-.18-.28a7.27 7.27 0 0 1-1.13-3.9c0-4.02 3.3-7.3 7.32-7.3a7.27 7.27 0 0 1 7.3 7.32c0 4.03-3.29 7.3-7.31 7.3zm4-5.46c-.22-.11-1.3-.64-1.5-.71-.2-.08-.35-.11-.5.11-.15.22-.57.71-.7.86-.13.15-.26.16-.48.05-.22-.1-.92-.34-1.75-1.08-.65-.58-1.08-1.29-1.21-1.51-.13-.22-.01-.34.1-.45.11-.1.25-.27.37-.4.12-.14.16-.23.24-.39.08-.15.04-.28-.02-.4-.06-.1-.5-1.2-.68-1.65-.18-.43-.36-.37-.5-.38-.13-.01-.28-.01-.43-.01s-.39.05-.6.27c-.21.22-.8.78-.8 1.9s.82 2.21.94 2.36c.11.15 1.55 2.37 3.76 3.22 1.88.73 2.27.59 2.68.55.4-.04 1.3-.53 1.49-1.04.18-.51.18-.95.13-1.04-.06-.1-.22-.16-.44-.27z" />
      </svg>
      {label}
    </a>
  );
}
