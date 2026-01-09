"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

interface Series {
  name: string;
  color: string;
  points: Point[];
  dash?: number[];
}

interface PlotCanvasProps {
  series: Series[];
  markerX?: number | null;
}

export default function PlotCanvas({ series, markerX }: PlotCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    const padding = { top: 24, right: 18, bottom: 30, left: 48 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const allPoints = series.flatMap((s) => s.points);
    if (!allPoints.length) {
      ctx.fillStyle = "#888";
      ctx.font = "14px 'Space Grotesk', sans-serif";
      ctx.fillText("No data", padding.left, padding.top + 10);
      return;
    }

    let minX = Math.min(...allPoints.map((p) => p.x));
    let maxX = Math.max(...allPoints.map((p) => p.x));
    let minY = Math.min(...allPoints.map((p) => p.y));
    let maxY = Math.max(...allPoints.map((p) => p.y));

    if (minX === maxX) {
      minX -= 1;
      maxX += 1;
    }
    if (minY === maxY) {
      minY -= 1;
      maxY += 1;
    }

    const yPad = (maxY - minY) * 0.08;
    minY -= yPad;
    maxY += yPad;

    const mapX = (x: number) => padding.left + ((x - minX) / (maxX - minX)) * chartW;
    const mapY = (y: number) => padding.top + (1 - (y - minY) / (maxY - minY)) * chartH;

    // Grid lines
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.lineWidth = 1;
    const gridCount = 4;
    for (let i = 0; i <= gridCount; i += 1) {
      const y = padding.top + (chartH / gridCount) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartW, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + chartH);
    ctx.lineTo(padding.left + chartW, padding.top + chartH);
    ctx.stroke();

    // Draw series lines
    series.forEach((s) => {
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.dash ? 2.5 : 3;
      if (s.dash) {
        ctx.setLineDash(s.dash);
      }
      ctx.beginPath();
      s.points.forEach((p, idx) => {
        const x = mapX(p.x);
        const y = mapY(p.y);
        if (idx === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      if (s.dash) {
        ctx.setLineDash([]);
      }
    });

    // Current position marker
    if (markerX != null && Number.isFinite(markerX)) {
      const markerXPos = mapX(markerX);
      ctx.strokeStyle = "rgba(213, 106, 53, 0.5)";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(markerXPos, padding.top);
      ctx.lineTo(markerXPos, padding.top + chartH);
      ctx.stroke();
      ctx.setLineDash([]);

      series.forEach((s) => {
        const closest = s.points.reduce((acc, p) => {
          if (!acc) return p;
          return Math.abs(p.x - markerX) < Math.abs(acc.x - markerX) ? p : acc;
        }, null as Point | null);
        if (closest) {
          const x = mapX(closest.x);
          const y = mapY(closest.y);

          // White outline for visibility
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();

          // Colored dot
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(x, y, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // Y-axis labels
    ctx.fillStyle = "#666";
    ctx.font = "11px 'Space Grotesk', monospace";
    ctx.textAlign = "right";
    ctx.fillText(minY.toFixed(2), padding.left - 6, padding.top + chartH - 2);
    ctx.fillText(maxY.toFixed(2), padding.left - 6, padding.top + 10);

    // X-axis labels
    ctx.textAlign = "center";
    ctx.fillText(minX.toFixed(1), padding.left, height - 8);
    ctx.fillText(maxX.toFixed(1), padding.left + chartW, height - 8);

    // Legend
    if (series.length > 1) {
      const legendX = padding.left + chartW - 10;
      let legendY = padding.top + 10;

      ctx.textAlign = "right";
      ctx.font = "11px 'Space Grotesk', sans-serif";

      series.forEach((s, idx) => {
        const y = legendY + idx * 18;

        // Legend background
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.fillRect(legendX - 100, y - 10, 100, 16);

        // Legend line sample
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2.5;
        if (s.dash) {
          ctx.setLineDash(s.dash);
        }
        ctx.beginPath();
        ctx.moveTo(legendX - 95, y);
        ctx.lineTo(legendX - 70, y);
        ctx.stroke();
        if (s.dash) {
          ctx.setLineDash([]);
        }

        // Legend text
        ctx.fillStyle = "#333";
        ctx.fillText(s.name, legendX - 5, y + 4);
      });
    }
  }, [series, markerX]);

  return (
    <div className="canvas-wrap">
      <canvas ref={canvasRef} width="640" height="320"></canvas>
    </div>
  );
}
