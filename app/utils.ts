import { ColorRGB, Row } from "./types";

export const STYLE = {
  titleFont: "600 52px 'Fraunces', serif",
  bodyFont: "34px 'Space Grotesk', sans-serif",
  metaFont: "28px 'Space Grotesk', sans-serif",
  ink: "#1a1a1a",
  meta: "#4a4d50",
};

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function deltaToColor(delta: number, vmin: number, vmax: number): ColorRGB {
  const neutral = { r: 247, g: 244, b: 238 };
  if (vmax <= vmin) {
    return { ...neutral, css: `rgb(${neutral.r},${neutral.g},${neutral.b})` };
  }
  const x = clamp(delta, vmin, vmax);
  const t = (x - vmin) / (vmax - vmin);

  if (t < 0.5) {
    const a = Math.pow((0.5 - t) / 0.5, 0.7);
    const blue = { r: 42, g: 97, b: 216 };
    const r = Math.round(neutral.r * (1 - a) + blue.r * a);
    const g = Math.round(neutral.g * (1 - a) + blue.g * a);
    const b = Math.round(neutral.b * (1 - a) + blue.b * a);
    return { r, g, b, css: `rgb(${r},${g},${b})` };
  }
  const a = Math.pow((t - 0.5) / 0.5, 0.7);
  const red = { r: 217, g: 67, b: 58 };
  const r = Math.round(neutral.r * (1 - a) + red.r * a);
  const g = Math.round(neutral.g * (1 - a) + red.g * a);
  const b = Math.round(neutral.b * (1 - a) + red.b * a);
  return { r, g, b, css: `rgb(${r},${g},${b})` };
}

export function textColorForBg(color: ColorRGB): string {
  const luminance = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
  return luminance < 140 ? "#ffffff" : "#1a1a1a";
}

export function computeColorScale(rows: Row[]): { vmin: number; vmax: number } {
  const deltas: number[] = [];
  rows.forEach((row) => {
    const arr = row.delta_logprobs || [];
    arr.forEach((d) => deltas.push(d));
  });
  if (!deltas.length) {
    return { vmin: -1, vmax: 1 };
  }
  deltas.sort((a, b) => a - b);
  const lo = deltas[Math.floor(deltas.length * 0.05)];
  const hi = deltas[Math.floor(deltas.length * 0.95)];
  let vmin = Number.isFinite(lo) ? lo : -1;
  let vmax = Number.isFinite(hi) ? hi : 1;
  if (Math.abs(vmax - vmin) < 1e-6) {
    vmin -= 1;
    vmax += 1;
  }
  return { vmin, vmax };
}

export function computeScaleFromDeltas(deltas: number[] | undefined): { vmin: number; vmax: number } {
  if (!deltas || !deltas.length) {
    return { vmin: -1, vmax: 1 };
  }
  const sorted = [...deltas].sort((a, b) => a - b);
  const lo = sorted[Math.floor(sorted.length * 0.05)];
  const hi = sorted[Math.floor(sorted.length * 0.95)];
  let vmin = Number.isFinite(lo) ? lo : -1;
  let vmax = Number.isFinite(hi) ? hi : 1;
  if (Math.abs(vmax - vmin) < 1e-6) {
    vmin -= 1;
    vmax += 1;
  }
  return { vmin, vmax };
}

export function formatTargetLabel(target: string): string {
  if (typeof target !== "string") {
    return String(target);
  }
  if (target.startsWith(" ")) {
    return `[space]${target.slice(1)}`;
  }
  return target;
}

export function baselineLabel(row: Row | null): string {
  if (!row) {
    return "System prompt";
  }
  if (row.label) {
    return row.label;
  }
  if (row.system_prompt) {
    const text = row.system_prompt.replace(/\s+/g, " ").trim();
    return text;
  }
  return "System prompt";
}
