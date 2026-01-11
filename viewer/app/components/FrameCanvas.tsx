"use client";

import { useEffect, useRef } from "react";
import { Row, SteeringData } from "../types";
import { STYLE, deltaToColor, textColorForBg } from "../utils";

interface FrameCanvasProps {
  row: Row;
  data: SteeringData | null;
  vmin: number;
  vmax: number;
  options?: {
    title?: string;
    subtitle?: string;
    prompt?: string;
    maxTokens?: number | string;
    layer?: number;
    legendLeft?: string;
    legendRight?: string;
  };
}

export default function FrameCanvas({ row, data, vmin, vmax, options = {} }: FrameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.textBaseline = "top";

    const margin = 70;
    const lineSpacing = 10;
    const titleY = 40;
    const metaY = 110;
    const bodyY = 180;
    const maxX = width - margin;

    const coeff = Number(row.coeff ?? 0).toFixed(0);
    const layer = options.layer ?? data?.layer ?? "";
    const prompt = options.prompt ?? data?.prompt ?? "";
    const maxTokens = options.maxTokens ?? data?.max_new_tokens ?? "";

    ctx.font = STYLE.titleFont;
    ctx.fillStyle = STYLE.ink;
    const title = options.title ?? `Steering sweep - coeff = ${coeff}  (layer ${layer})`;
    ctx.fillText(title, margin, titleY);

    ctx.font = STYLE.metaFont;
    ctx.fillStyle = STYLE.meta;
    const subtitle =
      options.subtitle ??
      `Prompt: "${prompt}"   |  Tokens: up to ${maxTokens}   |  Color = Delta logprob (steered - base)`;
    ctx.fillText(subtitle, margin, metaY);

    ctx.font = STYLE.bodyFont;
    const fontSize = 34;
    const lineHeight = fontSize + lineSpacing;
    let x = margin;
    let y = bodyY;
    const padX = 6;
    const padY = 4;
    const tokenGap = 2;

    const pieces = row.generated_pieces || [];
    const deltas = row.delta_logprobs || [];

    for (let i = 0; i < pieces.length; i += 1) {
      const piece = pieces[i];
      const delta = deltas[i] ?? 0;
      const parts = String(piece).split("\n");
      for (let pi = 0; pi < parts.length; pi += 1) {
        const part = parts[pi];
        if (part) {
          const w = ctx.measureText(part).width;
          if (x + w + padX * 2 > maxX) {
            x = margin;
            y += lineHeight;
          }
          const color = deltaToColor(delta, vmin, vmax);
          ctx.fillStyle = color.css;
          ctx.fillRect(x - padX, y - padY, w + padX * 2, fontSize + padY * 2);
          ctx.fillStyle = textColorForBg(color);
          ctx.fillText(part, x, y);
          x += w + padX * 2 + tokenGap;
        }
        if (pi < parts.length - 1) {
          x = margin;
          y += lineHeight;
        }
      }
      if (y > height - 120) {
        break;
      }
    }

    const legendY = height - 80;
    ctx.font = STYLE.metaFont;
    ctx.fillStyle = STYLE.ink;
    const legendLeft = options.legendLeft ?? "Less likely";
    const legendRight = options.legendRight ?? "More likely";
    ctx.fillText(legendLeft, margin, legendY - 40);
    ctx.fillText(legendRight, width - margin - 250, legendY - 40);

    const barX0 = margin;
    const barX1 = width - margin;
    const barW = barX1 - barX0;
    for (let i = 0; i < barW; i += 1) {
      const t = i / Math.max(barW - 1, 1);
      const d = vmin + t * (vmax - vmin);
      ctx.strokeStyle = deltaToColor(d, vmin, vmax).css;
      ctx.beginPath();
      ctx.moveTo(barX0 + i, legendY);
      ctx.lineTo(barX0 + i, legendY + 18);
      ctx.stroke();
    }
  }, [row, data, vmin, vmax, options]);

  return (
    <div className="canvas-wrap">
      <canvas ref={canvasRef} width="1920" height="520"></canvas>
    </div>
  );
}
