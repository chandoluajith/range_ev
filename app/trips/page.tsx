"use client";

import React from "react";
import { TripTable } from "@/components/trips/TripTable";
import { mockTrips } from "@/data/mockTrips";

export default function TripsHistoryPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div>
        <h1 className="text-[26px] sm:text-[30px] font-bold text-white tracking-tight font-sans">
          Trip History
        </h1>
        <p className="text-[13px] text-slate-400 font-sans mt-0.5">
          Archived trip logs, actual vs. predicted range validation, and elevation profile drilldowns
        </p>
      </div>

      {/* Main Filterable Trip Table */}
      <TripTable initialTrips={mockTrips} />
    </div>
  );
}
