// Components
export { NepalMap } from "./NepalMap";
export type { NepalMapProps, TooltipPosition } from "./NepalMap";

export { NepalMapLegend } from "./NepalMapLegend";
export type { NepalMapLegendProps, LegendItem } from "./NepalMapLegend";

// Data
export { DISTRICTS } from "./data/districts";
export { DISTRICT_PROVINCE, PROVINCES, PROVINCE_COLORS, PROVINCE_NAMES, DISTRICT_NAMES } from "./data/provinces";
export type { Province, DistrictPath, ProvinceInfo, DistrictData, DistrictDataMap } from "./data/types";

// Utilities
export {
  getDistrictsByProvince,
  getProvinceByDistrict,
  getDataStats,
  createColorScale,
  createMultiColorScale,
  getTotalDistricts,
  getProvinceSummary,
} from "./utils";
