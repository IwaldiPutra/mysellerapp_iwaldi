import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "700"], // bisa sesuaikan
});

export const metadata: Metadata = {
  title: "My Seller App",
  description: "My Seller App - Iwaldi Putra",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${archivo.variable} antialiased`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
