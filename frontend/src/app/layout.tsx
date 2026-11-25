import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Gerenciador Financeiro",
  description: "Acompanhe faturas, gastos previstos e assinaturas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-slate-950`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
