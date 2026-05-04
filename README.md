# nepal-district-map

[![npm version](https://img.shields.io/npm/v/nepal-district-map.svg)](https://www.npmjs.com/package/nepal-district-map)
[![npm downloads](https://img.shields.io/npm/dm/nepal-district-map.svg)](https://www.npmjs.com/package/nepal-district-map)
[![license](https://img.shields.io/npm/l/nepal-district-map.svg)](https://github.com/palniraj/nepal-district-map/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

Interactive SVG map of Nepal with all **77 districts** and **7 provinces** for React. Zero dependencies.

![nepal-district-map demo](https://raw.githubusercontent.com/palniraj/nepal-district-map/main/demo-screenshot.png)

- ✅ All 77 districts with accurate SVG boundaries
- ✅ Correct Darchula boundary (Limpiyadhura-Kalapani-Lipulekh territory)
- ✅ Province coloring, flat coloring, or data-driven choropleth
- ✅ Built-in hover tooltips with custom render support
- ✅ Click handlers and keyboard navigation (accessible)
- ✅ Province filtering
- ✅ Color scale utilities for heatmaps
- ✅ Companion `<NepalMapLegend>` component
- ✅ Raw SVG data export for custom rendering
- ✅ Full TypeScript support
- ✅ Works with Next.js, Vite, Remix, CRA

## Install

```bash
npm install nepal-district-map
```

## Quick Start

```tsx
import { NepalMap } from "nepal-district-map";

function App() {
  return (
    <NepalMap
      colorMode="province"
      onDistrictClick={(name) => console.log(name)}
    />
  );
}
```

## Examples

### Choropleth (Data Visualization)

Color districts by numeric values with a color scale:

```tsx
import { NepalMap, createColorScale, getDataStats } from "nepal-district-map";

const data = {
  Kathmandu: { value: 2017532, tooltip: "Population: 20.17L" },
  Morang: { value: 965370, tooltip: "Population: 9.65L" },
  Rupandehi: { value: 880196, tooltip: "Population: 8.80L" },
  Jhapa: { value: 812650, tooltip: "Population: 8.13L" },
  // ... add more districts
};

const stats = getDataStats(data);
const scale = createColorScale(stats.min, stats.max, "#22c55e", "#dc2626");

function PopulationMap() {
  return (
    <NepalMap
      data={data}
      colorMode="data"
      colorScale={scale}
      backgroundColor="#0f172a"
      labelColor="#fff"
      strokeColor="#1e293b"
    />
  );
}
```

### Multi-Stop Color Scale

```tsx
import { createMultiColorScale } from "nepal-district-map";

// Green → Yellow → Red
const scale = createMultiColorScale(0, 100, ["#22c55e", "#eab308", "#dc2626"]);
```

### Distribution / Coverage Map

Highlight specific districts with custom colors:

```tsx
import { NepalMap } from "nepal-district-map";

const coverage = {
  Kathmandu: { color: "#FFD600", tooltip: "📍 Distributor Hub" },
  Lalitpur: { color: "#3b82f6", tooltip: "✓ Covered by Kathmandu" },
  Bhaktapur: { color: "#3b82f6", tooltip: "✓ Covered by Kathmandu" },
  Kaski: { color: "#FFD600", tooltip: "📍 Distributor Hub" },
  Baglung: { color: "#3b82f6", tooltip: "✓ Covered by Kaski" },
};

function CoverageMap() {
  return (
    <NepalMap
      data={coverage}
      colorMode="flat"
      baseColor="#1a2744"
      strokeColor="#1C5A8A40"
      backgroundColor="#0B2A4A"
    />
  );
}
```

### Province Filter

```tsx
import { NepalMap, NepalMapLegend } from "nepal-district-map";
import { useState } from "react";
import type { Province } from "nepal-district-map";

function FilterableMap() {
  const [selected, setSelected] = useState<Province | null>(null);

  return (
    <div>
      <NepalMapLegend
        selectedProvince={selected}
        onProvinceClick={(p) => setSelected(selected === p ? null : p)}
      />
      <NepalMap selectedProvince={selected} />
    </div>
  );
}
```

### Custom Tooltip

```tsx
<NepalMap
  renderTooltip={(name, data) => (
    <div>
      <strong>{name}</strong>
      {data?.value && <p>Sales: Rs. {data.value.toLocaleString()}</p>}
    </div>
  )}
/>
```

### Legend Component

```tsx
import { NepalMapLegend } from "nepal-district-map";

// Province legend (automatic)
<NepalMapLegend mode="province" direction="horizontal" />

// Custom legend
<NepalMapLegend
  mode="custom"
  items={[
    { color: "#FFD600", label: "Distributor Hub" },
    { color: "#3b82f6", label: "Covered District" },
    { color: "#1a2744", label: "Not Yet Covered" },
  ]}
/>
```

### Using Raw Data (No Component)

Access district SVG paths and province data for custom rendering:

```tsx
import { DISTRICTS, DISTRICT_PROVINCE, PROVINCES } from "nepal-district-map/data";

// DISTRICTS: Array of { id, name, d, cx, cy }
// DISTRICT_PROVINCE: Record<string, Province>
// PROVINCES: Array of { name, color, stroke, districts }

// Build your own SVG
<svg viewBox="0 0 1200 800">
  {DISTRICTS.map(d => (
    <path key={d.id} d={d.d} fill={myColorFn(d.name)} />
  ))}
</svg>
```

### Utility Functions

```tsx
import {
  getDistrictsByProvince,
  getProvinceByDistrict,
  getDataStats,
  getProvinceSummary,
  createColorScale,
  createMultiColorScale,
  getTotalDistricts,
} from "nepal-district-map";

getDistrictsByProvince("Bagmati");
// → ["Dolakha", "Sindhupalchok", "Ramechhap", ...]

getProvinceByDistrict("Kathmandu");
// → "Bagmati"

getTotalDistricts();
// → 77

getDataStats(myData);
// → { min, max, count, total, average }

getProvinceSummary(myData);
// → [{ province: "Koshi", color: "#E8505B", totalDistricts: 14, coveredDistricts: 5, totalValue: 1234 }, ...]
```

## API Reference

### `<NepalMap>` Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `DistrictDataMap` | — | Data to visualize. Keys are district names |
| `colorMode` | `"province" \| "flat" \| "data"` | `"province"` | How to color districts |
| `baseColor` | `string` | `"#e2e8f0"` | Fill color for flat mode or uncovered districts |
| `strokeColor` | `string` | `"#94a3b8"` | Border color |
| `strokeWidth` | `number` | `0.5` | Border width |
| `hoverColor` | `string` | `"#FFD600"` | Stroke color on hover |
| `backgroundColor` | `string` | `"transparent"` | Container background |
| `showLabels` | `boolean` | `true` | Show district name labels |
| `labelFontSize` | `number` | `9` | Label font size |
| `labelColor` | `string` | `"rgba(255,255,255,0.9)"` | Label color |
| `showTooltip` | `boolean` | `true` | Show tooltip on hover |
| `renderTooltip` | `(name, data?) => ReactNode` | — | Custom tooltip renderer |
| `onDistrictClick` | `(name, data?) => void` | — | Click handler |
| `onDistrictHover` | `(name \| null) => void` | — | Hover handler |
| `selectedProvince` | `Province \| null` | `null` | Highlight one province |
| `provinceColors` | `Record<Province, {fill, stroke}>` | — | Override province colors |
| `shortNames` | `Record<string, string>` | — | Short labels for small districts |
| `colorScale` | `(value: number) => string` | — | Color function for data mode |
| `className` | `string` | — | CSS class for container |
| `style` | `CSSProperties` | — | Inline styles for container |
| `maxHeight` | `string` | `"560px"` | Max SVG height |
| `viewBox` | `string` | `"0 0 1200 800"` | SVG viewBox |
| `ariaLabel` | `string` | `"Interactive map of Nepal"` | Accessible label |
| `dimOpacity` | `number` | `0.2` | Opacity for non-selected provinces |
| `transitionDuration` | `number` | `200` | Animation duration in ms (0 to disable) |

### `<NepalMapLegend>` Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `"province" \| "custom"` | `"province"` | Legend mode |
| `items` | `LegendItem[]` | — | Custom items (for custom mode) |
| `direction` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout direction |
| `swatchShape` | `"circle" \| "square"` | `"circle"` | Swatch shape |
| `swatchSize` | `number` | `12` | Swatch size in px |
| `fontSize` | `number` | `12` | Label font size |
| `labelColor` | `string` | `"#64748b"` | Label color |
| `selectedProvince` | `Province \| null` | — | Highlights matching item |
| `onProvinceClick` | `(province: Province) => void` | — | Province click handler |
| `className` | `string` | — | CSS class |
| `style` | `CSSProperties` | — | Inline styles |
| `renderItem` | `(item, index) => ReactNode` | — | Custom item renderer |

### Types

```typescript
type Province = "Koshi" | "Madhesh" | "Bagmati" | "Gandaki"
  | "Lumbini" | "Karnali" | "Sudurpashchim";

interface DistrictData {
  value?: number;       // Numeric value for choropleth
  color?: string;       // Override fill color
  tooltip?: string;     // Tooltip text
  [key: string]: unknown; // Any extra metadata
}

type DistrictDataMap = Record<string, DistrictData>;

interface DistrictPath {
  id: string;    // Unique kebab-case id
  name: string;  // Display name
  d: string;     // SVG path data
  cx: number;    // Label center X
  cy: number;    // Label center Y
}

interface LegendItem {
  color: string;
  label: string;
  value?: string | number;
}
```

## All 77 Districts

| Province | Districts | Count |
|----------|-----------|-------|
| **Koshi** | Taplejung, Panchthar, Ilam, Jhapa, Morang, Sunsari, Dhankuta, Tehrathum, Sankhuwasabha, Bhojpur, Solukhumbu, Okhaldhunga, Khotang, Udayapur | 14 |
| **Madhesh** | Saptari, Siraha, Dhanusha, Mahottari, Sarlahi, Rautahat, Bara, Parsa | 8 |
| **Bagmati** | Dolakha, Sindhupalchok, Ramechhap, Sindhuli, Kavrepalanchok, Bhaktapur, Lalitpur, Kathmandu, Nuwakot, Rasuwa, Dhading, Makwanpur, Chitawan | 13 |
| **Gandaki** | Manang, Mustang, Myagdi, Kaski, Lamjung, Gorkha, Tanahu, Syangja, Parbat, Baglung, Nawalparasi East | 11 |
| **Lumbini** | Nawalparasi, Rupandehi, Kapilbastu, Palpa, Arghakhanchi, Gulmi, Pyuthan, Rolpa, Dang, Banke, Bardiya, Rukum | 12 |
| **Karnali** | Dolpa, Mugu, Humla, Jumla, Kalikot, Dailekh, Jajarkot, Surkhet, Salyan, Rukum West | 10 |
| **Sudurpashchim** | Bajura, Bajhang, Darchula, Baitadi, Dadeldhura, Doti, Achham, Kailali, Kanchanpur | 9 |

## Changelog

Read [CHANGELOG.md](./CHANGELOG.md) for complete release history.

## Contributing

I would love to have some of your contributions to this project. Please check the [Contributing Guide](./CONTRIBUTING.md) for contribution guidelines.

## Author

**Niraj Pal**

- 🌐 Website: [nirajpal.com.np](https://nirajpal.com.np/)
- 🐙 GitHub: [@palniraj](https://github.com/palniraj)
- 💼 LinkedIn: [niraj-pal](https://www.linkedin.com/in/niraj-pal/)
- 🔧 Upwork: [nirajpal](https://www.upwork.com/freelancers/nirajpal)

## License

[MIT](./LICENSE) © 2026 Niraj Pal
