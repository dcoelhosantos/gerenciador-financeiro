"use client";

import { LayoutDashboard, Receipt, SlidersHorizontal, Wallet, Music2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Faturas",
      href: "/faturas",
      icon: Receipt,
    },
    {
      name: "Gastos Previstos",
      href: "/gastos",
      icon: Wallet,
    },
    {
      name: "Assinaturas",
      href: "/assinaturas",
      icon: Music2,
    },
    {
      name: "Padrões",
      href: "/padroes",
      icon: SlidersHorizontal,
    },
  ];

  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-white font-bold text-xl tracking-tight"
            >
              Finanças<span className="text-green-500">App</span>
            </Link>
          </div>
          <div className="flex space-x-1 overflow-x-auto sm:space-x-4">
            {links.map((link) => {
              const Icon = link.icon;

              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex shrink-0 items-center gap-2 px-2 py-2 rounded-md text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                    isActive
                      ? "bg-gray-900 text-green-400"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
