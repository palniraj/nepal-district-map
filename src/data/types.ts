/* ─────────────────────────────────────────────
   Core types for react-nepal-map
───────────────────────────────────────────── */

/** The 7 provinces of Nepal */
export type Province =
  | "Koshi"
  | "Madhesh"
  | "Bagmati"
  | "Gandaki"
  | "Lumbini"
  | "Karnali"
  | "Sudurpashchim";

/** SVG path data for a single district */
export interface DistrictPath {
  /** Unique kebab-case id (e.g. "kathmandu", "sindhupalchok") */
  id: string;
  /** Display name */
  name: string;
  /** SVG path `d` attribute */
  d: string;
  /** Label center X (in viewBox coordinates 0–1200) */
  cx: number;
  /** Label center Y (in viewBox coordinates 0–800) */
  cy: number;
}

/** Province metadata */
export interface ProvinceInfo {
  name: Province;
  /** Default fill color */
  color: string;
  /** Default stroke color */
  stroke: string;
  /** District names belonging to this province */
  districts: string[];
}

/** User-supplied data for a single district */
export interface DistrictData {
  /** Numeric value for choropleth coloring */
  value?: number;
  /** Override fill color */
  color?: string;
  /** Custom tooltip content (string or ReactNode via render prop) */
  tooltip?: string;
  /** Any extra metadata the consumer wants to attach */
  [key: string]: unknown;
}

/** Map of district name → user data */
export type DistrictDataMap = Record<string, DistrictData>;
