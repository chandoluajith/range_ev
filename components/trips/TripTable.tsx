"use client";

import React, { useState, useMemo } from "react";
import { Download, ChevronRight, Filter } from "lucide-react";
import { TripDetail } from "@/types/trip";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TripFilters } from "./TripFilters";
import { TripDetails } from "./TripDetails";

interface TripTableProps {
  initialTrips: TripDetail[];
}

export function TripTable({ initialTrips }: TripTableProps) {
  const [trips] = useState<TripDetail[]>(initialTrips);
  const [searchQuery, setSearchQuery] = useState("");
  const [styleFilter, setStyleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("date_desc");
  const [selectedTrip, setSelectedTrip] = useState<TripDetail | null>(null);

  // Filtered & sorted trips
  const filteredTrips = useMemo(() => {
    return trips
      .filter((t) => {
        const matchesSearch =
          t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.startLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.endLocation.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStyle = styleFilter === "ALL" || t.drivingStyle === styleFilter;
        const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;

        return matchesSearch && matchesStyle && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "distance_desc") return b.distanceKm - a.distanceKm;
        if (sortBy === "efficiency_asc") return a.avgConsumptionWhKm - b.avgConsumptionWhKm;
        if (sortBy === "error_asc") return Math.abs(a.rangeErrorPercent) - Math.abs(b.rangeErrorPercent);
        return 0; // default order
      });
  }, [trips, searchQuery, styleFilter, statusFilter, sortBy]);

  return (
    <div className="flex flex-col gap-4">
      {/* Filters Bar */}
      <TripFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        styleFilter={styleFilter}
        onStyleFilterChange={setStyleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {/* Main Table Card */}
      <div className="rounded-2xl glass-panel p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-[16px] font-semibold text-white tracking-tight font-sans">
              Validated Trip Sessions
            </h3>
            <p className="text-[12px] text-slate-400 mt-0.5 font-sans">
              Linking high-frequency CAN telematics to physics-informed machine learning inference logs
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="glass"
              size="sm"
              onClick={() => alert("Simulation dataset exported in HDF5 / Parquet format")}
              className="gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export HDF5 / CSV</span>
            </Button>
          </div>
        </div>

        {/* Minimalist Precision Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-[12px] min-w-[760px]">
            <thead>
              <tr className="text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/[0.06]">
                <th className="py-3 px-3 font-medium">Trip &amp; Route</th>
                <th className="py-3 px-3 font-medium">Date</th>
                <th className="py-3 px-3 font-medium">Distance</th>
                <th className="py-3 px-3 font-medium">Avg Wh/km</th>
                <th className="py-3 px-3 font-medium">Predicted Range</th>
                <th className="py-3 px-3 font-medium">Range Error</th>
                <th className="py-3 px-3 font-medium">Driving Style</th>
                <th className="py-3 px-3 font-medium text-right">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {filteredTrips.map((trip) => {
                const isErrorPositive = trip.rangeErrorPercent >= 0;
                return (
                  <tr
                    key={trip.id}
                    onClick={() => setSelectedTrip(trip)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    {/* Trip & Route */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                        <div className="flex flex-col">
                          <span className="font-medium text-white font-sans text-[13px] group-hover:text-sky-300 transition-colors">
                            {trip.code}: {trip.routeName}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {trip.startLocation} → {trip.endLocation}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">
                      {trip.dateFormatted}
                    </td>

                    {/* Distance */}
                    <td className="py-3.5 px-3 text-white font-medium whitespace-nowrap">
                      {trip.distanceKm} km
                    </td>

                    {/* Avg Wh/km */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`font-semibold ${
                          trip.avgConsumptionWhKm < 150
                            ? "text-emerald-400"
                            : trip.avgConsumptionWhKm < 180
                            ? "text-sky-400"
                            : "text-rose-400"
                        }`}
                      >
                        {trip.avgConsumptionWhKm} Wh/km
                      </span>
                    </td>

                    {/* Predicted Range */}
                    <td className="py-3.5 px-3 text-slate-300 whitespace-nowrap">
                      {trip.predictedRangeKm} km
                    </td>

                    {/* Range Error */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`font-medium ${
                          Math.abs(trip.rangeErrorPercent) <= 2.5
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }`}
                      >
                        {isErrorPositive ? `+${trip.rangeErrorPercent}%` : `${trip.rangeErrorPercent}%`}
                      </span>
                    </td>

                    {/* Driving Style */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="text-[11px] text-slate-300 font-sans">
                        {trip.drivingStyle}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <Badge
                        variant={trip.status === "Verified" ? "success" : "neutral"}
                        size="sm"
                      >
                        {trip.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}

              {filteredTrips.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-sans text-[13px]">
                    No trip sessions matched your search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/[0.04]">
          <span>
            Showing {filteredTrips.length} of {trips.length} calibrated sessions
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Click any row to open the complete telemetry inspector sheet</span>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <TripDetails trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
    </div>
  );
}
