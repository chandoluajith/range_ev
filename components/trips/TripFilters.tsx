"use client";

import React from "react";
import { Search, Filter, Calendar } from "lucide-react";
import { Select } from "@/components/ui/Select";

interface TripFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  styleFilter: string;
  onStyleFilterChange: (s: string) => void;
  statusFilter: string;
  onStatusFilterChange: (st: string) => void;
  sortBy: string;
  onSortByChange: (sb: string) => void;
}

export function TripFilters({
  searchQuery,
  onSearchChange,
  styleFilter,
  onStyleFilterChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
}: TripFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl glass-panel">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Trip ID, route, or destination..."
          className="w-full bg-black/40 border border-white/[0.08] rounded-xl pl-9 pr-3.5 py-1.5 text-[12px] font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400 transition-all"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Select
          value={styleFilter}
          onChange={(e) => onStyleFilterChange(e.target.value)}
          options={[
            { value: "ALL", label: "All Styles" },
            { value: "ECO", label: "ECO Style" },
            { value: "MODERATE", label: "Moderate Style" },
            { value: "DYNAMIC", label: "Dynamic Style" },
          ]}
        />

        <Select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          options={[
            { value: "ALL", label: "All Status" },
            { value: "Verified", label: "Verified" },
            { value: "Validated", label: "Validated" },
            { value: "Simulated", label: "Simulated" },
          ]}
        />

        <Select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          options={[
            { value: "date_desc", label: "Sort: Recent First" },
            { value: "distance_desc", label: "Sort: Distance High" },
            { value: "efficiency_asc", label: "Sort: Lowest Wh/km" },
            { value: "error_asc", label: "Sort: Lowest Range Error" },
          ]}
        />
      </div>
    </div>
  );
}
