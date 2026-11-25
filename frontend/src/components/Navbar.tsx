"use client";

import {
  LayoutDashboard,
  Music2,
  Receipt,
  SlidersHorizontal,
  Wallet,
} from "lucide-react";
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
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="whitespace-nowrap text-lg font-bold tracking-tight text-white sm:text-xl"
            >
              Finanças<span className="text-green-500">App</span>
            </Link>
          </div>
          <div className="ml-4 flex min-w-0 flex-1 justify-end gap-1 overflow-x-auto sm:gap-3">
            {links.map((link) => {
              const Icon = link.icon;

              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-300"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
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
