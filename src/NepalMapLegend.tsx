"use client";

import { type CSSProperties, type ReactNode } from "react";
import { PROVINCES } from "./data/provinces";
import type { Province } from "./data/types";

/* ─────────────────────────────────────────────
   Legend item type
───────────────────────────────────────────── */

export interface LegendItem {
  /** Color swatch */
  color: string;
  /** Label text */
  label: string;
  /** Optional value to display */
  value?: string | number;
}

/* ─────────────────────────────────────────────
   Props
───────────────────────────────────────────── */

export interface NepalMapLegendProps {
  /** Legend mode */
  mode?: "province" | "custom";

  /** Custom legend items (used when mode is "custom") */
  items?: LegendItem[];

  /** Layout direction (default: "horizontal") */
  direction?: "horizontal" | "vertical";

  /** Swatch shape (default: "circle") */
  swatchShape?: "circle" | "square";

  /** Swatch size in px (default: 12) */
  swatchSize?: number;

  /** Font size for labels (default: 12) */
  fontSize?: number;

  /** Label color (default: "#64748b") */
  labelColor?: string;

  /** Currently selected province (highlights matching item) */
  selectedProvince?: Province | null;

  /** Called when a province legend item is clicked */
  onProvinceClick?: (province: Province) => void;

  /** CSS class for the container */
  className?: string;

  /** Inline styles for the container */
  style?: CSSProperties;

  /** Custom render for each legend item */
  renderItem?: (item: LegendItem, index: number) => ReactNode;
}

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */

export function NepalMapLegend({
  mode = "province",
  items: customItems,
  direction = "horizontal",
  swatchShape = "circle",
  swatchSize = 12,
  fontSize = 12,
  labelColor = "#64748b",
  selectedProvince,
  onProvinceClick,
  className,
  style,
  renderItem,
}: NepalMapLegendProps) {
  const items: LegendItem[] =
    mode === "custom" && customItems
      ? customItems
      : PROVINCES.map((p) => ({
          color: p.color,
          label: p.name,
          value: `${p.districts.length} districts`,
        }));

  const isHorizontal = direction === "horizontal";

  return (
    <div
      className={className}
      role="list"
      aria-label="Map legend"
      style={{
        display: "flex",
        flexDirection: isHorizontal ? "row" : "column",
        flexWrap: isHorizontal ? "wrap" : undefined,
        gap: isHorizontal ? "16px" : "8px",
        alignItems: isHorizontal ? "center" : "flex-start",
        ...style,
      }}
    >
      {items.map((item, i) => {
        if (renderItem) {
          return <div key={i} role="listitem">{renderItem(item, i)}</div>;
        }

        const isProvince = mode === "province";
        const provinceName = isProvince ? (item.label as Province) : null;
        const isSelected = isProvince && selectedProvince === provinceName;
        const isClickable = isProvince && !!onProvinceClick;

        return (
          <div
            key={i}
            role="listitem"
            onClick={isClickable && provinceName ? () => onProvinceClick!(provinceName) : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: isClickable ? "pointer" : "default",
              opacity: selectedProvince && !isSelected && isProvince ? 0.4 : 1,
              transition: "opacity 0.2s",
              padding: isClickable ? "2px 4px" : undefined,
              borderRadius: isClickable ? 4 : undefined,
            }}
          >
            <span
              style={{
                width: swatchSize,
                height: swatchSize,
                borderRadius: swatchShape === "circle" ? "50%" : 2,
                backgroundColor: item.color,
                flexShrink: 0,
                border: isSelected ? "2px solid #FFD600" : "1px solid rgba(0,0,0,0.1)",
                boxSizing: "border-box",
              }}
            />
            <span
              style={{
                fontSize,
                color: labelColor,
                fontWeight: isSelected ? 700 : 400,
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </span>
            {item.value != null && (
              <span
                style={{
                  fontSize: fontSize - 2,
                  color: labelColor,
                  opacity: 0.6,
                  whiteSpace: "nowrap",
                }}
              >
                {item.value}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
