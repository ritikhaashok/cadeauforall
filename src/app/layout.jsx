import "./globals.css";
import Navbar from '@/components/Navbar';
import CategoryBar from "@/components/CategoryBar";
import Footer from '@/components/Footer';

export const metadata = {
  title: "Cadeau4All",
  description: "Personalized gifts made with care",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[var(--off-white)] text-[var(--charcoal)]">
        <Navbar />

        <main className="min-h-screen pt-16">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
