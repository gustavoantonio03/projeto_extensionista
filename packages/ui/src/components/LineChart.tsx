import * as React from "react";
import { cn } from "../cn";

export interface LineChartPoint {
  label: string;
  value: number;
}

export interface LineChartProps {
  title: string;
  unit: string;
  points: LineChartPoint[];
  color?: string;
  height?: number;
  className?: string;
}

/**
 * Gráfico de linha em SVG (sem dependências). Acessível: role="img" + resumo textual
 * e tabela equivalente visualmente oculta para leitores de tela.
 */
export const LineChart: React.FC<LineChartProps> = ({
  title,
  unit,
  points,
  color = "#6E3F8C",
  height = 140,
  className,
}) => {
  const width = 320;
  const pad = { top: 14, right: 14, bottom: 26, left: 14 };

  if (points.length === 0) {
    return (
      <p className={cn("text-xs text-[#5B5F7A]", className)}>Sem medições registradas.</p>
    );
  }

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const coords = points.map((p, i) => {
    const x = pad.left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
    const y = pad.top + innerH - ((p.value - min) / span) * innerH;
    return { x, y, ...p };
  });
  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const first = points[0]!;
  const last = points[points.length - 1]!;
  const summary = `${title}: de ${first.value} ${unit} em ${first.label} para ${last.value} ${unit} em ${last.label}.`;

  return (
    <figure className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={summary}
        className="w-full h-auto"
      >
        <line
          x1={pad.left}
          x2={width - pad.right}
          y1={height - pad.bottom}
          y2={height - pad.bottom}
          stroke="#F1E4D6"
          strokeWidth="1"
        />
        <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((c) => (
          <g key={c.label}>
            <circle cx={c.x} cy={c.y} r="3.5" fill="#fff" stroke={color} strokeWidth="2" />
            <text x={c.x} y={height - 8} textAnchor="middle" fontSize="9" fill="#5B5F7A">
              {c.label}
            </text>
          </g>
        ))}
        <text x={coords[coords.length - 1]!.x} y={coords[coords.length - 1]!.y - 8} textAnchor="end" fontSize="10" fontWeight="700" fill="#1F2340">
          {last.value} {unit}
        </text>
      </svg>
      <figcaption className="sr-only">
        <table>
          <caption>{title}</caption>
          <thead>
            <tr>
              <th>Período</th>
              <th>Valor ({unit})</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.label}>
                <td>{p.label}</td>
                <td>{p.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figcaption>
    </figure>
  );
};
