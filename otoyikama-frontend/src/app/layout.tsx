import type { Metadata } from "next"; // Metadata tipini ekledik
import QueryProvider from "@/components/providers/QueryProvider";
import Navbar from "@/components/layout/Navbar"; 
import Footer from "@/components/layout/Footer"; 
import "./globals.css";

// --- GOOGLE İKON VE SİTE ADI AYARLARI ---
export const metadata: Metadata = {
  title: "CarClean",
  description: "En yakın oto yıkamacıdan anında randevu al, aracını parlat.",
  icons: {
    icon: "/images/ikon.svg", // Tarayıcı sekmesindeki ikon
    apple: "/images/ikon.svg", // iPhone ana ekrana ekleme ikonu
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="flex flex-col min-h-screen bg-gray-50">
        <QueryProvider>
          <Navbar />
          <main className="flex flex-col flex-1 w-full">
            {children}
          </main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}