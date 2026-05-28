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
   Tooltip position type
───────────────────────────────────────────── */

export type TooltipPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "follow-cursor";

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

  /** Tooltip position (default: "top-right") */
  tooltipPosition?: TooltipPosition;

  /** Custom tooltip renderer. Receives district name and data. */
  renderTooltip?: (districtName: string, data?: DistrictDataMap[string]) => ReactNode;

  /** Format function for the default tooltip's `value` field */
  valueFormatter?: (value: number) => string;

  /** Called when a district is clicked */
  onDistrictClick?: (districtName: string, data?: DistrictDataMap[string]) => void;

  /** Called when mouse enters a district */
  onDistrictHover?: (districtName: string | null) => void;

  /** Province to highlight (dims all others) */
  selectedProvince?: Province | null;

  /**
   * Programmatically highlight specific districts (e.g. search results).
   * Highlighted districts get a glow and stronger stroke.
   */
  highlightedDistricts?: string[];

  /** Color used for highlighted districts' stroke (default: "#FFD600") */
  highlightColor?: string;

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

  /** Disable all interactions (hover, click, keyboard) — view-only mode (default: false) */
  disabled?: boolean;
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
   Tooltip position styles
───────────────────────────────────────────── */

function getTooltipStaticStyle(position: TooltipPosition): CSSProperties {
  switch (position) {
    case "top-left":
      return { top: 12, left: 12 };
    case "bottom-left":
      return { bottom: 12, left: 12 };
    case "bottom-right":
      return { bottom: 12, right: 12 };
    case "top-right":
    default:
      return { top: 12, right: 12 };
  }
}

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
  tooltipPosition = "top-right",
  renderTooltip,
  valueFormatter,
  onDistrictClick,
  onDistrictHover,
  selectedProvince = null,
  highlightedDistricts,
  highlightColor = "#FFD600",
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
  disabled = false,
}: NepalMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const highlightedSet = useMemo(() => {
    return new Set(highlightedDistricts ?? []);
  }, [highlightedDistricts]);

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
      if (highlightedSet.has(name)) return highlightColor;
      return strokeColor;
    },
    [hovered, hoverColor, highlightedSet, highlightColor, strokeColor],
  );

  const getStrokeWidth = useCallback(
    (name: string): number => {
      if (hovered === name) return Math.max(strokeWidth * 3, 2);
      if (highlightedSet.has(name)) return Math.max(strokeWidth * 2.5, 1.5);
      return strokeWidth;
    },
    [hovered, highlightedSet, strokeWidth],
  );

  const isDisabled = useCallback(
    (name: string) => disabled || data?.[name]?.disabled === true,
    [disabled, data],
  );

  const handlePointerEnter = useCallback(
    (name: string) => {
      if (isDisabled(name)) return;
      setHovered(name);
      onDistrictHover?.(name);
    },
    [onDistrictHover, isDisabled],
  );

  const handlePointerLeave = useCallback(() => {
    setHovered(null);
    setCursor(null);
    onDistrictHover?.(null);
  }, [onDistrictHover]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (tooltipPosition !== "follow-cursor") return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    [tooltipPosition],
  );

  const handleClick = useCallback(
    (name: string) => {
      if (isDisabled(name)) return;
      onDistrictClick?.(name, data?.[name]);
    },
    [onDistrictClick, data, isDisabled],
  );

  const handleKeyDown = useCallback(
    (name: string, e: React.KeyboardEvent) => {
      if (isDisabled(name)) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onDistrictClick?.(name, data?.[name]);
      }
    },
    [onDistrictClick, data, isDisabled],
  );

  const hoveredData = hovered ? data?.[hovered] : undefined;

  const tooltipPositionStyle: CSSProperties =
    tooltipPosition === "follow-cursor" && cursor
      ? {
          left: Math.min(cursor.x + 16, (containerRef.current?.clientWidth ?? 0) - 220),
          top: Math.max(cursor.y - 10, 12),
        }
      : getTooltipStaticStyle(tooltipPosition);

  const formattedValue =
    hoveredData?.value != null
      ? valueFormatter
        ? valueFormatter(hoveredData.value)
        : hoveredData.value.toLocaleString()
      : null;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", background: backgroundColor, ...style }}
    >
      {/* Tooltip */}
      {showTooltip && hovered && (
        <div
          role="tooltip"
          aria-live="polite"
          style={{
            position: "absolute",
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
            ...tooltipPositionStyle,
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
              {formattedValue !== null && (
                <div style={{ fontSize: 11, marginTop: 2, opacity: 0.8 }}>
                  Value: {formattedValue}
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
        style={{
          width: "100%",
          height: "auto",
          maxHeight,
          display: "block",
          touchAction: tooltipPosition === "follow-cursor" ? "none" : "auto",
        }}
        onPointerMove={handlePointerMove}
      >
        <title>{ariaLabel}</title>
        {DISTRICTS.map((d) => {
          const province = DISTRICT_PROVINCE[d.name] as Province | undefined;
          const isActive = !selectedProvince || province === selectedProvince;
          const isHighlighted = highlightedSet.has(d.name);
          const isDistrictDisabled = isDisabled(d.name);
          const isInteractive = !!onDistrictClick && !isDistrictDisabled;
          const districtData = data?.[d.name];

          return (
            <g
              key={d.id}
              onPointerEnter={() => handlePointerEnter(d.name)}
              onPointerLeave={handlePointerLeave}
              onClick={() => handleClick(d.name)}
              onKeyDown={(e) => handleKeyDown(d.name, e)}
              role={isInteractive ? "button" : undefined}
              tabIndex={isInteractive && isActive ? 0 : undefined}
              aria-label={`${d.name}${province ? `, ${province} Province` : ""}${districtData?.tooltip ? `. ${districtData.tooltip}` : ""}${districtData?.value != null ? `. Value: ${districtData.value}` : ""}${isHighlighted ? ". Highlighted" : ""}`}
              aria-disabled={isDistrictDisabled || undefined}
              style={{
                cursor: isInteractive ? "pointer" : "default",
                opacity: !isActive
                  ? dimOpacity
                  : isDistrictDisabled
                    ? 0.5
                    : 1,
                transition: opacityTransition,
                outline: "none",
              }}
            >
              <path
                d={d.d}
                fill={getFill(d.name)}
                stroke={getStroke(d.name)}
                strokeWidth={getStrokeWidth(d.name)}
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
                  fontWeight={hovered === d.name || isHighlighted ? 700 : 500}
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
