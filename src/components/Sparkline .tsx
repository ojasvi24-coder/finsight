"use client";

import { motion } from "framer-motion";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  positive?: boolean;
  showDot?: boolean;
}

/**
 * Tiny inline SVG sparkline — no external deps.
 * Use for 24h market index strips or card-corner trend indicators.
 */
export default function Sparkline({
  data,
  width = 100,
  height = 32,
  positive = true,
  showDot = true,
}: SparklineProps) {
  if (!data || data.length < 2) return null;

  const padding = 3;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = (width - padding * 2) / (data.length - 1);

  const toY = (v: number) =>
    height - padding - ((v - min) / range) * (height - padding * 2);

  const pathD = data
    .map((v, i) => `${i === 0 ? "M" : "L"} ${padding + i * stepX} ${toY(v)}`)
    .join(" ");

  const areaD =
    `M ${padding} ${height - padding} ` +
    data.map((v, i) => `L ${padding + i * stepX} ${toY(v)}`).join(" ") +
    ` L ${padding + (data.length - 1) * stepX} ${height - padding} Z`;

  const color = positive ? "#10b981" : "#f43f5e";
  const fadeId = `spark-fade-${color}-${data.length}-${Math.round(data[0])}`;

  const lastX = padding + (data.length - 1) * stepX;
  const lastY = toY(data[data.length - 1]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={fadeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${fadeId})`} />
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      {showDot && (
        <circle
          cx={lastX}
          cy={lastY}
          r={2.25}
          fill={color}
          stroke="#020617"
          strokeWidth={1}
        />
      )}
    </svg>
  );
}
