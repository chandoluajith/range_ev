"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { useVehicle } from "@/hooks/useVehicle";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentVehicle, selectVehicle } = useVehicle();

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 relative selection:bg-sky-500/20 selection:text-sky-300">
      {/* VisionOS Ambient Blurred Glow Fields */}
      <div className="fixed top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-sky-950/20 via-sky-900/5 to-transparent blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-emerald-950/15 via-slate-900/10 to-transparent blur-[140px] pointer-events-none z-0" />

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop & Collapsible Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-72 relative z-10 flex flex-col min-h-screen">
        <Topbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          currentVehicle={currentVehicle}
          onSelectVehicle={selectVehicle}
        />

        <main className="flex-1 pt-20 px-4 sm:px-8 pb-20 lg:pb-12 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />
    </div>
  );
}
