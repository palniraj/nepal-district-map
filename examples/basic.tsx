/**
 * Basic usage examples for nepal-district-map
 *
 * These are reference examples — not runnable on their own.
 * Copy into your React project to use.
 */

import { useState } from "react";
import {
  NepalMap,
  NepalMapLegend,
  createColorScale,
  createMultiColorScale,
  getDataStats,
  getProvinceSummary,
  type Province,
  type DistrictDataMap,
} from "nepal-district-map";

/* ─── Example 1: Province Map ─── */

export function ProvinceMap() {
  const [selected, setSelected] = useState<Province | null>(null);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h2>Nepal by Province</h2>

      <NepalMapLegend
        selectedProvince={selected}
        onProvinceClick={(p) => setSelected(selected === p ? null : p)}
        style={{ marginBottom: 16 }}
      />

      <NepalMap
        selectedProvince={selected}
        onDistrictClick={(name) => alert(`Clicked: ${name}`)}
        backgroundColor="#0f172a"
        style={{ borderRadius: 16, overflow: "hidden" }}
      />
    </div>
  );
}

/* ─── Example 2: Population Heatmap ─── */

const populationData: DistrictDataMap = {
  Kathmandu: { value: 2017532, tooltip: "Population: 20.17 Lakh" },
  Morang: { value: 965370, tooltip: "Population: 9.65 Lakh" },
  Rupandehi: { value: 880196, tooltip: "Population: 8.80 Lakh" },
  Jhapa: { value: 812650, tooltip: "Population: 8.13 Lakh" },
  Sunsari: { value: 763487, tooltip: "Population: 7.63 Lakh" },
  Kailali: { value: 775709, tooltip: "Population: 7.76 Lakh" },
  Kaski: { value: 492098, tooltip: "Population: 4.92 Lakh" },
  Chitawan: { value: 579984, tooltip: "Population: 5.80 Lakh" },
  Bara: { value: 687708, tooltip: "Population: 6.88 Lakh" },
  Parsa: { value: 601017, tooltip: "Population: 6.01 Lakh" },
  Banke: { value: 491313, tooltip: "Population: 4.91 Lakh" },
  Dang: { value: 548141, tooltip: "Population: 5.48 Lakh" },
  Lalitpur: { value: 468132, tooltip: "Population: 4.68 Lakh" },
};

export function PopulationHeatmap() {
  const stats = getDataStats(populationData);
  const scale = createMultiColorScale(stats.min, stats.max, [
    "#1e3a5f", // low — dark blue
    "#22c55e", // medium — green
    "#eab308", // high — yellow
    "#dc2626", // very high — red
  ]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h2>Population Heatmap</h2>
      <p>
        Showing {stats.count} districts. Range: {stats.min.toLocaleString()} – {stats.max.toLocaleString()}
      </p>

      <NepalMap
        data={populationData}
        colorMode="data"
        colorScale={scale}
        baseColor="#1e293b"
        strokeColor="#334155"
        backgroundColor="#0f172a"
        labelColor="#e2e8f0"
        style={{ borderRadius: 16 }}
      />

      <NepalMapLegend
        mode="custom"
        items={[
          { color: "#1e3a5f", label: "< 3 Lakh" },
          { color: "#22c55e", label: "3–5 Lakh" },
          { color: "#eab308", label: "5–10 Lakh" },
          { color: "#dc2626", label: "> 10 Lakh" },
        ]}
        style={{ marginTop: 16, justifyContent: "center" }}
      />
    </div>
  );
}

/* ─── Example 3: Distribution Coverage ─── */

export function DistributionMap() {
  const coverage: DistrictDataMap = {
    // Distributor hubs
    Kathmandu: { color: "#FFD600", tooltip: "📍 Main Distributor" },
    Kaski: { color: "#FFD600", tooltip: "📍 Regional Distributor" },
    Surkhet: { color: "#FFD600", tooltip: "📍 Regional Distributor" },
    Kailali: { color: "#FFD600", tooltip: "📍 Regional Distributor" },
    // Covered areas
    Lalitpur: { color: "#3b82f6", tooltip: "Covered by Kathmandu" },
    Bhaktapur: { color: "#3b82f6", tooltip: "Covered by Kathmandu" },
    Nuwakot: { color: "#3b82f6", tooltip: "Covered by Kathmandu" },
    Baglung: { color: "#3b82f6", tooltip: "Covered by Kaski" },
    Parbat: { color: "#3b82f6", tooltip: "Covered by Kaski" },
    Dailekh: { color: "#3b82f6", tooltip: "Covered by Surkhet" },
    Kanchanpur: { color: "#3b82f6", tooltip: "Covered by Kailali" },
  };

  const summary = getProvinceSummary(coverage);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h2>Distribution Network</h2>

      <NepalMap
        data={coverage}
        colorMode="flat"
        baseColor="#1a2744"
        strokeColor="rgba(28,90,138,0.25)"
        backgroundColor="#0B2A4A"
        labelColor="rgba(255,255,255,0.85)"
        style={{ borderRadius: 16 }}
      />

      <NepalMapLegend
        mode="custom"
        items={[
          { color: "#FFD600", label: "Distributor Hub" },
          { color: "#3b82f6", label: "Covered District" },
          { color: "#1a2744", label: "Expansion Opportunity" },
        ]}
        style={{ marginTop: 16, justifyContent: "center" }}
      />

      {/* Province breakdown */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
        {summary.map((s) => (
          <div key={s.province} style={{ textAlign: "center", padding: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, margin: "0 auto 4px" }} />
            <div style={{ fontSize: 12, fontWeight: 600 }}>{s.province}</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>
              {s.coveredDistricts}/{s.totalDistricts}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
