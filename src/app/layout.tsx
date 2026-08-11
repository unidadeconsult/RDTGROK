import type { Metadata } from "next";
import { Bebas_Neue, Inter, Rajdhani } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const rajdhani = Rajdhani({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
});

export const metadata: Metadata = {
  title: "RDT Central de Criação",
  description: "Não comece pelo post. Comece pela ideia. — Resenha da Torcida",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚽</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${bebasNeue.variable} ${rajdhani.variable}`}
    >
      <body className="font-[var(--font-inter)] min-h-screen bg-bg-primary text-text-primary antialiased">
        <div className="fixed inset-0 ambient-glow pointer-events-none z-0" />
        <div className="fixed inset-0 grid-texture pointer-events-none z-0 opacity-50" />
        <div className="relative z-10 flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen lg:max-h-screen lg:overflow-y-auto pt-14 lg:pt-0">
            <Header />
            <main className="flex-1 p-4 lg:p-8">
              <Providers>
                {children}
              </Providers>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
