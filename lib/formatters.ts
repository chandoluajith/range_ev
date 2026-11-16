export function formatNumber(val: number, decimals = 1): string {
  if (isNaN(val)) return "0";
  return val.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatInt(val: number): string {
  if (isNaN(val)) return "0";
  return Math.round(val).toLocaleString("en-US");
}

export function formatSign(val: number, decimals = 1, unit = ""): string {
  const sign = val > 0 ? "+" : "";
  return `${sign}${formatNumber(val, decimals)}${unit ? ` ${unit}` : ""}`;
}

export function formatPercent(val: number, decimals = 1): string {
  return `${formatNumber(val, decimals)}%`;
}

export function formatWhKm(whkm: number): string {
  return `${formatInt(whkm)} Wh/km`;
}

export function formatKm(km: number, decimals = 0): string {
  return `${formatNumber(km, decimals)} km`;
}

export function formatKW(kw: number, decimals = 1): string {
  return `${formatNumber(kw, decimals)} kW`;
}

export function formatVolts(v: number, decimals = 1): string {
  return `${formatNumber(v, decimals)} V`;
}

export function formatAmps(a: number, decimals = 1): string {
  return `${formatNumber(a, decimals)} A`;
}

export function formatCelsius(deg: number, decimals = 1): string {
  return `${formatNumber(deg, decimals)} °C`;
}

export function formatGrade(grade: number): string {
  return `${grade >= 0 ? "+" : ""}${formatNumber(grade, 1)}%`;
}

export function formatRelativeTime(secondsAgo: number): string {
  if (secondsAgo < 5) return "Just now";
  if (secondsAgo < 60) return `${Math.round(secondsAgo)} seconds ago`;
  const mins = Math.floor(secondsAgo / 60);
  return `${mins} min${mins > 1 ? "s" : ""} ago`;
}
