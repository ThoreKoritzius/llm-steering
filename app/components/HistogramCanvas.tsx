"use client";

import { useEffect, useRef } from "react";

interface HistogramCanvasProps {
  data: number[];
  bins?: number;
  title?: string;
}

export default function HistogramCanvas({ data, bins = 50, title = "Distribution" }: HistogramCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "#fdfbf8";
    ctx.fillRect(0, 0, width, height);

    const padding = { top: 40, right: 40, bottom: 50, left: 60 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Calculate histogram
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / bins;

    const histogram: number[] = new Array(bins).fill(0);
    data.forEach((value) => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
      histogram[binIndex]++;
    });

    const maxCount = Math.max(...histogram);

    // Draw title
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "600 16px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(title, width / 2, 24);

    // Draw axes
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + chartH);
    ctx.lineTo(padding.left + chartW, padding.top + chartH);
    ctx.stroke();

    // Draw grid lines
    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    ctx.lineWidth = 1;
    const gridCount = 5;
    for (let i = 0; i <= gridCount; i++) {
      const y = padding.top + (chartH / gridCount) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartW, y);
      ctx.stroke();
    }

    // Draw bars with different colors for positive/negative values
    const barWidth = chartW / bins;
    const zeroValue = 0;
    histogram.forEach((count, i) => {
      const barHeight = (count / maxCount) * chartH;
      const x = padding.left + i * barWidth;
      const y = padding.top + chartH - barHeight;

      // Calculate the bin's center value
      const binCenter = min + (i + 0.5) * binWidth;
      const isPositive = binCenter >= zeroValue;

      // Gradient fill - red for positive, blue for negative
      const gradient = ctx.createLinearGradient(x, y, x, padding.top + chartH);
      if (isPositive) {
        gradient.addColorStop(0, "#d56a35"); // Orange/red
        gradient.addColorStop(1, "#e89a6e");
        ctx.strokeStyle = "rgba(213, 106, 53, 0.3)";
      } else {
        gradient.addColorStop(0, "#4287f5"); // Blue
        gradient.addColorStop(1, "#6fa3f7");
        ctx.strokeStyle = "rgba(66, 135, 245, 0.3)";
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth - 1, barHeight);

      // Outline
      ctx.strokeRect(x, y, barWidth - 1, barHeight);
    });

    // Draw Y-axis labels
    ctx.fillStyle = "#4a4d50";
    ctx.font = "12px 'Space Grotesk', sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 0; i <= gridCount; i++) {
      const y = padding.top + (chartH / gridCount) * i;
      const value = Math.round(maxCount * (1 - i / gridCount));
      ctx.fillText(String(value), padding.left - 8, y);
    }

    // Draw X-axis labels
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const xLabelCount = 5;
    for (let i = 0; i <= xLabelCount; i++) {
      const x = padding.left + (chartW / xLabelCount) * i;
      const value = min + ((max - min) / xLabelCount) * i;
      ctx.fillText(value.toFixed(3), x, padding.top + chartH + 8);
    }

    // Axis labels
    ctx.fillStyle = "#2b2f33";
    ctx.font = "600 13px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Value", width / 2, height - 12);

    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Frequency", 0, 0);
    ctx.restore();

    // Statistics box
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const sortedData = [...data].sort((a, b) => a - b);
    const median = sortedData[Math.floor(data.length / 2)];
    const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);

    const statsX = padding.left + chartW - 150;
    const statsY = padding.top + 10;
    const statsW = 140;
    const statsH = 90;

    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillRect(statsX, statsY, statsW, statsH);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
    ctx.lineWidth = 1;
    ctx.strokeRect(statsX, statsY, statsW, statsH);

    ctx.fillStyle = "#2b2f33";
    ctx.font = "600 12px 'Space Grotesk', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    const stats = [
      `Dimensions: ${data.length}`,
      `Mean: ${mean.toFixed(4)}`,
      `Median: ${median.toFixed(4)}`,
      `Std Dev: ${stdDev.toFixed(4)}`,
      `Range: [${min.toFixed(3)}, ${max.toFixed(3)}]`,
    ];

    stats.forEach((stat, i) => {
      ctx.fillText(stat, statsX + 8, statsY + 8 + i * 16);
    });
  }, [data, bins, title]);

  return (
    <div className="canvas-wrap">
      <canvas ref={canvasRef} width="960" height="480"></canvas>
    </div>
  );
}
