"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gauge, Radio, Zap, Compass, Layers, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const navLinks = [
    { label: "Overview", href: "/", icon: Gauge },
    { label: "Live", href: "/live", icon: Radio },
    { label: "Energy", href: "/energy", icon: Zap },
    { label: "Range", href: "/range", icon: Compass },
    { label: "Trips", href: "/trips", icon: Layers },
    { label: "Settings", href: "/settings", icon: Settings },
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
              "flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl transition-all",
              isActive ? "text-sky-400 font-medium" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[10px] font-mono tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
