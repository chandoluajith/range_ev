import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  subtitle?: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
}

export function Select({ className, options, label, ...props }: SelectProps) {
  return (
    <div className="relative inline-flex flex-col">
      {label && (
        <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-1">
          {label}
        </span>
      )}
      <div className="relative inline-flex items-center">
        <select
          className={cn(
            "appearance-none bg-black/40 hover:bg-black/60 text-slate-200 hover:text-white border border-white/[0.08] hover:border-white/[0.16] rounded-xl px-3.5 py-1.5 pr-8 text-[12px] font-mono focus:outline-none focus:ring-1 focus:ring-sky-400 cursor-pointer transition-all",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0f131a] text-slate-200">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
      </div>
    </div>
  );
}
