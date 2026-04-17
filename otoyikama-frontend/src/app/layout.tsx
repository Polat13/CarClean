import QueryProvider from "@/components/providers/QueryProvider";
import Navbar from "@/components/layout/Navbar"; // Yeni ekledik
import Footer from "@/components/layout/Footer"; // Yeni ekledik
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      {/* Body içinde flex-col kullanarak margin ihtiyacını ortadan kaldırıyoruz */}
      <body className="flex flex-col min-h-screen bg-gray-50">
        <QueryProvider>
          <Navbar />
          {/* Main içeriği tüm boş alanı kaplasın */}
          <main className="flex flex-col flex-1 w-full">
            {children}
          </main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}