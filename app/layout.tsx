import type { Metadata } from "next";
import { Anton, Open_Sans } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-opensans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "La Doce Chapina — Catálogo",
  description:
    "Explora el stock disponible de La Doce Chapina y haz tu pedido directamente por WhatsApp.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${anton.variable} ${openSans.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}
