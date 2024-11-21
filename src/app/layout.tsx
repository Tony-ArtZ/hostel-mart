import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Green Glow Shop",
  description: "Eco-friendly products with a modern touch",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-emerald-950 text-emerald-100`}>
        <Toaster />
        <CartProvider>
          <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-950 to-black">
            <Navbar />
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
