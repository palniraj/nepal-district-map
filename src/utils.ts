import { DISTRICT_PROVINCE, PROVINCES } from "./data/provinces";
import { DISTRICTS } from "./data/districts";
import type { Province, DistrictDataMap } from "./data/types";

/**
 * Get all district names belonging to a province.
 */
export function getDistrictsByProvince(province: Province): string[] {
  return Object.entries(DISTRICT_PROVINCE)
    .filter(([, p]) => p === province)
    .map(([d]) => d);
}

/**
 * Get the province a district belongs to.
 * Returns undefined if the district name is not found.
 */
export function getProvinceByDistrict(districtName: string): Province | undefined {
  return DISTRICT_PROVINCE[districtName] as Province | undefined;
}

/**
 * Get summary stats from a DistrictDataMap.
 * Useful for building legends and info panels.
 */
export function getDataStats(data: DistrictDataMap): {
  min: number;
  max: number;
  count: number;
  total: number;
  average: number;
} {
  const values = Object.values(data)
    .map((d) => d.value)
    .filter((v): v is number => v != null);

  if (values.length === 0) {
    return { min: 0, max: 0, count: 0, total: 0, average: 0 };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const total = values.reduce((sum, v) => sum + v, 0);

  return {
    min,
    max,
    count: values.length,
    total,
    average: total / values.length,
  };
}

/**
 * Generate a linear color scale function between two colors.
 * Returns a function that maps a value in [min, max] to a hex color.
 *
 * @example
 * const scale = createColorScale(0, 100, "#22c55e", "#dc2626");
 * scale(50); // midpoint color
 */
export function createColorScale(
  min: number,
  max: number,
  fromColor: string,
  toColor: string,
): (value: number) => string {
  const from = hexToRgb(fromColor);
  const to = hexToRgb(toColor);

  if (!from || !to) {
    return () => fromColor;
  }

  const range = max - min || 1;

  return (value: number): string => {
    const t = Math.max(0, Math.min(1, (value - min) / range));
    const r = Math.round(from.r + (to.r - from.r) * t);
    const g = Math.round(from.g + (to.g - from.g) * t);
    const b = Math.round(from.b + (to.b - from.b) * t);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };
}

/**
 * Generate a multi-stop color scale.
 * Stops are evenly distributed between min and max.
 *
 * @example
 * const scale = createMultiColorScale(0, 100, ["#22c55e", "#eab308", "#dc2626"]);
 * scale(25);  // between green and yellow
 * scale(75);  // between yellow and red
 */
export function createMultiColorScale(
  min: number,
  max: number,
  colors: string[],
): (value: number) => string {
  if (colors.length === 0) return () => "#e2e8f0";
  if (colors.length === 1) return () => colors[0];

  const range = max - min || 1;
  const segments = colors.length - 1;

  return (value: number): string => {
    const t = Math.max(0, Math.min(1, (value - min) / range));
    const segment = Math.min(Math.floor(t * segments), segments - 1);
    const localT = (t * segments) - segment;

    const from = hexToRgb(colors[segment]);
    const to = hexToRgb(colors[segment + 1]);

    if (!from || !to) return colors[segment];

    const r = Math.round(from.r + (to.r - from.r) * localT);
    const g = Math.round(from.g + (to.g - from.g) * localT);
    const b = Math.round(from.b + (to.b - from.b) * localT);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };
}

/**
 * Get the total number of districts.
 */
export function getTotalDistricts(): number {
  return DISTRICTS.length;
}

/**
 * Get province-wise summary from data.
 */
export function getProvinceSummary(data: DistrictDataMap): Array<{
  province: Province;
  color: string;
  totalDistricts: number;
  coveredDistricts: number;
  totalValue: number;
}> {
  return PROVINCES.map((p) => {
    const districts = p.districts;
    const covered = districts.filter((d) => data[d] != null);
    const totalValue = covered.reduce((sum, d) => sum + (data[d]?.value ?? 0), 0);

    return {
      province: p.name,
      color: p.color,
      totalDistricts: districts.length,
      coveredDistricts: covered.length,
      totalValue,
    };
  });
}

/* ─── Internal helpers ─── */

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return { r, g, b };
  }
  return null;
}
