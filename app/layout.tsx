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
  title: "La Doce Chapina — Camisas de fútbol retro y actuales en Guatemala",
  description:
    "Camisas de fútbol retro y de temporada en Guatemala. Stock en vivo, pedidos personalizados y envío a todo el país.",
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
