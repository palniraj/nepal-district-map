# Changelog

All notable changes to `nepal-district-map` will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.4] — 2025-05-04

### Added
- Demo screencast video in README
- Comprehensive use cases section — business dashboards, distribution maps, election maps, health/NGO, education, e-commerce, government portals
- Live demo repo link in README

---

## [1.0.3] — 2025-05-04

### Added
- Demo screenshot in README showing Province View, Population Heatmap, and Coverage Map tabs

---

## [1.0.2] — 2025-05-04

### Added
- `CONTRIBUTING.md` — contribution guidelines
- Author section in README with website, GitHub, LinkedIn, Upwork links
- Changelog section in README linking to full CHANGELOG.md

---

## [1.0.1] — 2025-05-04

### Fixed
- Corrected badge links in README

---

## [1.0.0] — 2025-05-04

### Added
- Interactive SVG map of Nepal with all **77 districts** and **7 provinces**
- Accurate Darchula boundary including Limpiyadhura-Kalapani-Lipulekh territory
- Three color modes: `province`, `flat`, and `data` (choropleth)
- `selectedProvince` prop for province filtering with dim effect
- Hover tooltips with default and custom `renderTooltip` support
- `onDistrictClick` and `onDistrictHover` event handlers
- `colorScale` prop for data-driven choropleth coloring
- `createColorScale` utility — linear 2-color gradient
- `createMultiColorScale` utility — multi-stop gradient (e.g. green → yellow → red)
- `getDataStats` utility — min, max, count, total, average from data
- `getProvinceSummary` utility — province-wise coverage breakdown
- `getDistrictsByProvince` and `getProvinceByDistrict` lookup helpers
- `getTotalDistricts` — returns 77
- `<NepalMapLegend>` companion component with province and custom modes
- District labels with configurable font size, color, and short name overrides
- Keyboard navigation — Enter/Space triggers click on focused districts
- ARIA attributes — `role="img"`, `aria-label`, `role="tooltip"`, `aria-live`
- Raw data export via `nepal-district-map/data` subpath entry point
- Full TypeScript support with exported types
- Zero runtime dependencies (React as peer dependency only)
- ESM and CJS dual-format builds with source maps
- Type declarations for both `.d.ts` and `.d.mts`
