import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elephone Dashboard",
  description: "Sistema de Gestión de Inventario para iPhones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
