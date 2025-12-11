import React from "react";

/**
 Simple SVG bar chart + radar chart (no external deps).
 Props:
  - plos: [{id, code, name, mean (1-5), attainmentPercent}]
  - overallPercent
*/

function BarChart({ plos }) {
  const width = 520;
  const height = 200;
  const padding = 30;
  const maxVal = 100;
  const barW = (width - padding * 2) / plos.length - 8;

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="rounded">
      <rect x="0" y="0" width={width} height={height} fill="transparent" />
      {plos.map((p, i) => {
        const x = padding + i * (barW + 8);
        const h = (p.attainmentPercent / maxVal) * (height - padding * 2);
        const y = height - padding - h;
        const color = p.attainmentPercent >= 80 ? "#10b981" : p.attainmentPercent >= 50 ? "#f59e0b" : "#ef4444";
        return (
          <g key={p.id}>
            <rect x={x} y={y} width={barW} height={h} fill={color} rx="4" />
            <text x={x + barW / 2} y={height - padding + 14} fontSize="9" textAnchor="middle" fill="#374151">{p.code}</text>
            <text x={x + barW / 2} y={y - 6} fontSize="9" textAnchor="middle" fill="#111827">{p.attainmentPercent}%</text>
          </g>
        );
      })}
    </svg>
  );
}

function RadarChart({ plos }) {
  // normalize mean (1-5) to 0-1
  const N = plos.length;
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 30;

  const points = plos.map((p, i) => {
    const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
    const r = ((p.mean - 1) / 4) * radius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return `${x},${y}`;
  });

  const outerPoints = plos.map((p, i) => {
    const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    return `${x},${y}`;
  });

  return (
    <svg width="100%" viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* outer ring labels */}
      {outerPoints.map((pt, i) => {
        const [x, y] = pt.split(",").map(Number);
        const label = plos[i].code;
        return <text key={i} x={x} y={y} fontSize="9" textAnchor="middle" fill="#334155" dy="4">{label}</text>;
      })}

      {/* axis lines */}
      {plos.map((_, i) => {
        const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />;
      })}

      {/* polygon area */}
      <polygon points={points.join(" ")} fill="url(#g1)" fillOpacity="0.18" stroke="#7c3aed" strokeWidth="1.5" />

      {/* central circles (rings) */}
      {[0.25, 0.5, 0.75, 1].map((r, idx) => (
        <circle key={idx} cx={cx} cy={cy} r={radius * r} fill="none" stroke="#eef2ff" strokeWidth="1" />
      ))}

      {/* mean labels inside */}
      <text x={cx} y={cy} fontSize="12" textAnchor="middle" fill="#0f172a" fontWeight="600">Mean (1–5)</text>
    </svg>
  );
}

export default function PLOCharts({ plos, overallPercent = 0 }) {
  return (
    <div className="grid md:grid-cols-2 gap-4 items-start">
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-sm font-semibold text-slate-700 mb-2">PLO Attainment (Estimated %)</div>
        <div className="w-full">
          <BarChart plos={plos} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border">
        <div className="text-sm font-semibold text-slate-700 mb-2">PLO Profile (Rubric mean)</div>
        <RadarChart plos={plos} />
        <div className="mt-3 text-xs text-slate-500">Overall estimated attainment: <span className="font-semibold">{overallPercent}%</span></div>
      </div>
    </div>
  );
}
