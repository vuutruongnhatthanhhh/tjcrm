"use client";

import { useState } from "react";

const data = [
  { label: "T4", value: 820 },
  { label: "T5", value: 932 },
  { label: "T6", value: 901 },
  { label: "T7", value: 1034 },
  { label: "T8", value: 1120 },
  { label: "T9", value: 1056 },
  { label: "T10", value: 1248 },
];

const WIDTH = 640;
const HEIGHT = 220;
const PAD_X = 16;
const PAD_Y = 20;

function buildPoints() {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const step = (WIDTH - PAD_X * 2) / (data.length - 1);

  return data.map((d, i) => {
    const x = PAD_X + i * step;
    const y =
      PAD_Y + (HEIGHT - PAD_Y * 2) * (1 - (d.value - min) / range);
    return { ...d, x, y };
  });
}

function buildSmoothPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    d += ` C${midX},${prev.y} ${midX},${curr.y} ${curr.x},${curr.y}`;
  }
  return d;
}

export function RevenueChart() {
  const points = buildPoints();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const linePath = buildSmoothPath(points);
  const areaPath = `${linePath} L${points[points.length - 1].x},${HEIGHT - PAD_Y} L${points[0].x},${HEIGHT - PAD_Y} Z`;

  const active = hoverIdx !== null ? points[hoverIdx] : null;

  return (
    <div className="glass-panel relative rounded-2xl p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Doanh thu theo tháng
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Đơn vị: triệu đồng
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary-glow)]" />
          Doanh thu
        </div>
      </div>

      <div className="relative mt-4">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full overflow-visible"
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff7a1a" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#ff7a1a" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((t) => (
            <line
              key={t}
              x1={PAD_X}
              x2={WIDTH - PAD_X}
              y1={PAD_Y + (HEIGHT - PAD_Y * 2) * t}
              y2={PAD_Y + (HEIGHT - PAD_Y * 2) * t}
              stroke="var(--border)"
              strokeWidth="1"
            />
          ))}

          <path d={areaPath} fill="url(#revenueFill)" />
          <path
            d={linePath}
            fill="none"
            stroke="#ff7a1a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((p, i) => (
            <g key={p.label}>
              <rect
                x={p.x - WIDTH / data.length / 2}
                y={0}
                width={WIDTH / data.length}
                height={HEIGHT}
                fill="transparent"
                onMouseEnter={() => setHoverIdx(i)}
                className="cursor-pointer"
              />
              {hoverIdx === i && (
                <line
                  x1={p.x}
                  x2={p.x}
                  y1={PAD_Y}
                  y2={HEIGHT - PAD_Y}
                  stroke="var(--border-strong)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={hoverIdx === i ? 5.5 : 3}
                fill="#ff7a1a"
                stroke="var(--surface)"
                strokeWidth="2"
                className="transition-all duration-150"
              />
            </g>
          ))}
        </svg>

        {active && (
          <div
            className="animate-scale-in pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-lg border border-border-strong bg-surface-2 px-2.5 py-1.5 text-xs shadow-xl"
            style={{
              left: `${(active.x / WIDTH) * 100}%`,
              top: `${(active.y / HEIGHT) * 100}%`,
            }}
          >
            <p className="font-semibold text-foreground">
              {active.value.toLocaleString("vi-VN")} triệu
            </p>
            <p className="text-muted-foreground">Tháng {active.label}</p>
          </div>
        )}

        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          {data.map((d) => (
            <span key={d.label}>{d.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
