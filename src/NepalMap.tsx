"use client";

import {
  useState,
  useCallback,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { DISTRICTS } from "./data/districts";
import { DISTRICT_PROVINCE, PROVINCE_COLORS } from "./data/provinces";
import type { Province, DistrictDataMap } from "./data/types";

/* ─────────────────────────────────────────────
   Props
───────────────────────────────────────────── */

export interface NepalMapProps {
  /** Data to visualize on the map. Keys are district names. */
  data?: DistrictDataMap;

  /** Color mode for districts without explicit color in data */
  colorMode?: "province" | "flat" | "data";

  /** Base fill color when colorMode is "flat" (default: "#e2e8f0") */
  baseColor?: string;

  /** Stroke color for district borders (default: "#94a3b8") */
  strokeColor?: string;

  /** Stroke width for district borders (default: 0.5) */
  strokeWidth?: number;

  /** Hovered district stroke color (default: "#FFD600") */
  hoverColor?: string;

  /** Background color of the map container (default: "transparent") */
  backgroundColor?: string;

  /** Show district name labels on the map (default: true) */
  showLabels?: boolean;

  /** Font size for district labels (default: 9) */
  labelFontSize?: number;

  /** Label color (default: "rgba(255,255,255,0.9)") */
  labelColor?: string;

  /** Show a tooltip on hover (default: true) */
  showTooltip?: boolean;

  /** Custom tooltip renderer. Receives district name and data. */
  renderTooltip?: (districtName: string, data?: DistrictDataMap[string]) => ReactNode;

  /** Called when a district is clicked */
  onDistrictClick?: (districtName: string, data?: DistrictDataMap[string]) => void;

  /** Called when mouse enters a district */
  onDistrictHover?: (districtName: string | null) => void;

  /** Province to highlight (dims all others) */
  selectedProvince?: Province | null;

  /** Override province colors */
  provinceColors?: Partial<Record<Province, { fill: string; stroke: string }>>;

  /** Custom short names for districts (e.g. { Kathmandu: "KTM" }) */
  shortNames?: Record<string, string>;

  /** CSS class for the root container */
  className?: string;

  /** Inline styles for the root container */
  style?: CSSProperties;

  /** Max height of the SVG (default: "560px") */
  maxHeight?: string;

  /** viewBox for the SVG (default: "0 0 1200 800") */
  viewBox?: string;

  /** Color scale function for data mode. Receives value, returns fill color. */
  colorScale?: (value: number) => string;

  /** Accessible label for the map (default: "Interactive map of Nepal") */
  ariaLabel?: string;

  /** Dim opacity for non-selected provinces (default: 0.2) */
  dimOpacity?: number;

  /** Animation duration in ms for transitions (default: 200, set 0 to disable) */
  transitionDuration?: number;
}

/* ─────────────────────────────────────────────
   Default short names for tiny districts
───────────────────────────────────────────── */

const DEFAULT_SHORT_NAMES: Record<string, string> = {
  Kathmandu: "KTM",
  Bhaktapur: "BHA",
  Lalitpur: "LA",
  "Nawalparasi East": "Nawalparasi(E)",
  Kavrepalanchok: "Kavreplan.",
  Arghakhanchi: "Arghakh.",
};

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */

export function NepalMap({
  data,
  colorMode = "province",
  baseColor = "#e2e8f0",
  strokeColor = "#94a3b8",
  strokeWidth = 0.5,
  hoverColor = "#FFD600",
  backgroundColor = "transparent",
  showLabels = true,
  labelFontSize = 9,
  labelColor = "rgba(255,255,255,0.9)",
  showTooltip = true,
  renderTooltip,
  onDistrictClick,
  onDistrictHover,
  selectedProvince = null,
  provinceColors,
  shortNames,
  className,
  style,
  maxHeight = "560px",
  viewBox = "0 0 1200 800",
  colorScale,
  ariaLabel = "Interactive map of Nepal",
  dimOpacity = 0.2,
  transitionDuration = 200,
}: NepalMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const transitionStyle = transitionDuration > 0
    ? `fill ${transitionDuration}ms, stroke ${transitionDuration}ms, stroke-width ${transitionDuration}ms`
    : "none";

  const opacityTransition = transitionDuration > 0
    ? `opacity ${transitionDuration + 100}ms`
    : "none";

  const mergedProvinceColors = useMemo(() => {
    return { ...PROVINCE_COLORS, ...provinceColors } as Record<Province, { fill: string; stroke: string }>;
  }, [provinceColors]);

  const mergedShortNames = useMemo(() => {
    return { ...DEFAULT_SHORT_NAMES, ...shortNames };
  }, [shortNames]);

  const getFill = useCallback(
    (name: string): string => {
      const districtData = data?.[name];

      // Explicit color from data always wins
      if (districtData?.color) return districtData.color;

      // Data mode with color scale
      if (colorMode === "data" && colorScale && districtData?.value != null) {
        return colorScale(districtData.value);
      }

      const province = DISTRICT_PROVINCE[name] as Province | undefined;

      // Dim non-selected provinces
      if (selectedProvince && province !== selectedProvince) {
        return "#1a2744";
      }

      if (colorMode === "province" && province) {
        const colors = mergedProvinceColors[province];
        return colors ? colors.fill : baseColor;
      }

      return baseColor;
    },
    [data, colorMode, colorScale, selectedProvince, mergedProvinceColors, baseColor],
  );

  const getStroke = useCallback(
    (name: string): string => {
      if (hovered === name) return hoverColor;
      return strokeColor;
    },
    [hovered, hoverColor, strokeColor],
  );

  const handleMouseEnter = useCallback(
    (name: string) => {
      setHovered(name);
      onDistrictHover?.(name);
    },
    [onDistrictHover],
  );

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
    onDistrictHover?.(null);
  }, [onDistrictHover]);

  const handleClick = useCallback(
    (name: string) => {
      onDistrictClick?.(name, data?.[name]);
    },
    [onDistrictClick, data],
  );

  const handleKeyDown = useCallback(
    (name: string, e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onDistrictClick?.(name, data?.[name]);
      }
    },
    [onDistrictClick, data],
  );

  const hoveredData = hovered ? data?.[hovered] : undefined;

  return (
    <div
      className={className}
      style={{ position: "relative", background: backgroundColor, ...style }}
    >
      {/* Tooltip */}
      {showTooltip && hovered && (
        <div
          ref={tooltipRef}
          role="tooltip"
          aria-live="polite"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 20,
            background: "rgba(0,0,0,0.85)",
            borderRadius: 12,
            padding: "12px 16px",
            minWidth: 180,
            pointerEvents: "none",
            color: "#fff",
            fontSize: 13,
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          }}
        >
          {renderTooltip ? (
            renderTooltip(hovered, hoveredData)
          ) : (
            <>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{hovered}</div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>
                Province: {DISTRICT_PROVINCE[hovered] || "—"}
              </div>
              {hoveredData?.tooltip && (
                <div style={{ fontSize: 11, marginTop: 4, opacity: 0.8 }}>
                  {hoveredData.tooltip}
                </div>
              )}
              {hoveredData?.value != null && (
                <div style={{ fontSize: 11, marginTop: 2, opacity: 0.8 }}>
                  Value: {hoveredData.value}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* SVG Map */}
      <svg
        viewBox={viewBox}
        role="img"
        aria-label={ariaLabel}
        style={{ width: "100%", height: "auto", maxHeight, display: "block" }}
      >
        <title>{ariaLabel}</title>
        {DISTRICTS.map((d) => {
          const province = DISTRICT_PROVINCE[d.name] as Province | undefined;
          const isActive = !selectedProvince || province === selectedProvince;
          const isInteractive = !!onDistrictClick;
          const districtData = data?.[d.name];

          return (
            <g
              key={d.id}
              onMouseEnter={() => handleMouseEnter(d.name)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(d.name)}
              onKeyDown={(e) => handleKeyDown(d.name, e)}
              role={isInteractive ? "button" : undefined}
              tabIndex={isInteractive && isActive ? 0 : undefined}
              aria-label={`${d.name}${province ? `, ${province} Province` : ""}${districtData?.tooltip ? `. ${districtData.tooltip}` : ""}${districtData?.value != null ? `. Value: ${districtData.value}` : ""}`}
              style={{
                cursor: isInteractive ? "pointer" : "default",
                opacity: isActive ? 1 : dimOpacity,
                transition: opacityTransition,
                outline: "none",
              }}
            >
              <path
                d={d.d}
                fill={getFill(d.name)}
                stroke={getStroke(d.name)}
                strokeWidth={hovered === d.name ? Math.max(strokeWidth * 3, 2) : strokeWidth}
                style={{ transition: transitionStyle }}
              />
              {showLabels && isActive && (
                <text
                  x={d.cx}
                  y={d.cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={hovered === d.name ? labelFontSize + 3 : labelFontSize}
                  fill={labelColor}
                  fontWeight={hovered === d.name ? 700 : 500}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                  aria-hidden="true"
                >
                  {mergedShortNames[d.name] ?? d.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
