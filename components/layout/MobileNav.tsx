"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Layers, Car } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const navLinks = [
    { label: "Range", href: "/range", icon: Compass, isHighlight: true },
    { label: "3D Twin", href: "/simulator3d.html", icon: Car, isHighlight: false },
    { label: "Trips", href: "/trips", icon: Layers, isHighlight: false },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#08090c]/90 backdrop-blur-2xl border-t border-white/[0.08] px-3 py-2 flex items-center justify-around shadow-[0_-4px_24px_rgba(0,0,0,0.7)]">
      {navLinks.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl transition-all relative",
              isActive
                ? "text-sky-400 font-medium"
                : item.isHighlight
                ? "text-sky-300 font-semibold bg-sky-500/10 border border-sky-400/30"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            {item.isHighlight && !isActive && (
              <span className="absolute -top-1 right-1 w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8] animate-pulse" />
            )}
            <Icon className="w-4 h-4" />
            <span className="text-[10px] font-mono tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
