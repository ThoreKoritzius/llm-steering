module.exports = [
"[project]/app/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "STYLE",
    ()=>STYLE,
    "baselineLabel",
    ()=>baselineLabel,
    "clamp",
    ()=>clamp,
    "computeColorScale",
    ()=>computeColorScale,
    "computeScaleFromDeltas",
    ()=>computeScaleFromDeltas,
    "deltaToColor",
    ()=>deltaToColor,
    "formatTargetLabel",
    ()=>formatTargetLabel,
    "textColorForBg",
    ()=>textColorForBg
]);
const STYLE = {
    titleFont: "600 52px 'Fraunces', serif",
    bodyFont: "34px 'Space Grotesk', sans-serif",
    metaFont: "28px 'Space Grotesk', sans-serif",
    ink: "#1a1a1a",
    meta: "#4a4d50"
};
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
function deltaToColor(delta, vmin, vmax) {
    const neutral = {
        r: 247,
        g: 244,
        b: 238
    };
    if (vmax <= vmin) {
        return {
            ...neutral,
            css: `rgb(${neutral.r},${neutral.g},${neutral.b})`
        };
    }
    const x = clamp(delta, vmin, vmax);
    const t = (x - vmin) / (vmax - vmin);
    if (t < 0.5) {
        const a = Math.pow((0.5 - t) / 0.5, 0.7);
        const blue = {
            r: 42,
            g: 97,
            b: 216
        };
        const r = Math.round(neutral.r * (1 - a) + blue.r * a);
        const g = Math.round(neutral.g * (1 - a) + blue.g * a);
        const b = Math.round(neutral.b * (1 - a) + blue.b * a);
        return {
            r,
            g,
            b,
            css: `rgb(${r},${g},${b})`
        };
    }
    const a = Math.pow((t - 0.5) / 0.5, 0.7);
    const red = {
        r: 217,
        g: 67,
        b: 58
    };
    const r = Math.round(neutral.r * (1 - a) + red.r * a);
    const g = Math.round(neutral.g * (1 - a) + red.g * a);
    const b = Math.round(neutral.b * (1 - a) + red.b * a);
    return {
        r,
        g,
        b,
        css: `rgb(${r},${g},${b})`
    };
}
function textColorForBg(color) {
    const luminance = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
    return luminance < 140 ? "#ffffff" : "#1a1a1a";
}
function computeColorScale(rows) {
    const deltas = [];
    rows.forEach((row)=>{
        const arr = row.delta_logprobs || [];
        arr.forEach((d)=>deltas.push(d));
    });
    if (!deltas.length) {
        return {
            vmin: -1,
            vmax: 1
        };
    }
    deltas.sort((a, b)=>a - b);
    const lo = deltas[Math.floor(deltas.length * 0.05)];
    const hi = deltas[Math.floor(deltas.length * 0.95)];
    let vmin = Number.isFinite(lo) ? lo : -1;
    let vmax = Number.isFinite(hi) ? hi : 1;
    if (Math.abs(vmax - vmin) < 1e-6) {
        vmin -= 1;
        vmax += 1;
    }
    return {
        vmin,
        vmax
    };
}
function computeScaleFromDeltas(deltas) {
    if (!deltas || !deltas.length) {
        return {
            vmin: -1,
            vmax: 1
        };
    }
    const sorted = [
        ...deltas
    ].sort((a, b)=>a - b);
    const lo = sorted[Math.floor(sorted.length * 0.05)];
    const hi = sorted[Math.floor(sorted.length * 0.95)];
    let vmin = Number.isFinite(lo) ? lo : -1;
    let vmax = Number.isFinite(hi) ? hi : 1;
    if (Math.abs(vmax - vmin) < 1e-6) {
        vmin -= 1;
        vmax += 1;
    }
    return {
        vmin,
        vmax
    };
}
function formatTargetLabel(target) {
    if (typeof target !== "string") {
        return String(target);
    }
    if (target.startsWith(" ")) {
        return `[space]${target.slice(1)}`;
    }
    return target;
}
function baselineLabel(row) {
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
}),
"[project]/app/components/FrameCanvas.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FrameCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function FrameCanvas({ row, data, vmin, vmax, options = {} }) {
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
        ctx.font = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STYLE"].titleFont;
        ctx.fillStyle = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STYLE"].ink;
        const title = options.title ?? `Steering sweep - coeff = ${coeff}  (layer ${layer})`;
        ctx.fillText(title, margin, titleY);
        ctx.font = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STYLE"].metaFont;
        ctx.fillStyle = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STYLE"].meta;
        const subtitle = options.subtitle ?? `Prompt: "${prompt}"   |  Tokens: up to ${maxTokens}   |  Color = Delta logprob (steered - base)`;
        ctx.fillText(subtitle, margin, metaY);
        ctx.font = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STYLE"].bodyFont;
        const fontSize = 34;
        const lineHeight = fontSize + lineSpacing;
        let x = margin;
        let y = bodyY;
        const padX = 6;
        const padY = 4;
        const tokenGap = 2;
        const pieces = row.generated_pieces || [];
        const deltas = row.delta_logprobs || [];
        for(let i = 0; i < pieces.length; i += 1){
            const piece = pieces[i];
            const delta = deltas[i] ?? 0;
            const parts = String(piece).split("\n");
            for(let pi = 0; pi < parts.length; pi += 1){
                const part = parts[pi];
                if (part) {
                    const w = ctx.measureText(part).width;
                    if (x + w + padX * 2 > maxX) {
                        x = margin;
                        y += lineHeight;
                    }
                    const color = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deltaToColor"])(delta, vmin, vmax);
                    ctx.fillStyle = color.css;
                    ctx.fillRect(x - padX, y - padY, w + padX * 2, fontSize + padY * 2);
                    ctx.fillStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["textColorForBg"])(color);
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
        ctx.font = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STYLE"].metaFont;
        ctx.fillStyle = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STYLE"].ink;
        const legendLeft = options.legendLeft ?? "Less likely";
        const legendRight = options.legendRight ?? "More likely";
        ctx.fillText(legendLeft, margin, legendY - 40);
        ctx.fillText(legendRight, width - margin - 250, legendY - 40);
        const barX0 = margin;
        const barX1 = width - margin;
        const barW = barX1 - barX0;
        for(let i = 0; i < barW; i += 1){
            const t = i / Math.max(barW - 1, 1);
            const d = vmin + t * (vmax - vmin);
            ctx.strokeStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deltaToColor"])(d, vmin, vmax).css;
            ctx.beginPath();
            ctx.moveTo(barX0 + i, legendY);
            ctx.lineTo(barX0 + i, legendY + 18);
            ctx.stroke();
        }
    }, [
        row,
        data,
        vmin,
        vmax,
        options
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "canvas-wrap",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
            ref: canvasRef,
            width: "1920",
            height: "520"
        }, void 0, false, {
            fileName: "[project]/app/components/FrameCanvas.tsx",
            lineNumber: 130,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/FrameCanvas.tsx",
        lineNumber: 129,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/components/PlotCanvas.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PlotCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function PlotCanvas({ series, markerX }) {
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
        const padding = {
            top: 24,
            right: 18,
            bottom: 30,
            left: 48
        };
        const chartW = width - padding.left - padding.right;
        const chartH = height - padding.top - padding.bottom;
        const allPoints = series.flatMap((s)=>s.points);
        if (!allPoints.length) {
            ctx.fillStyle = "#888";
            ctx.font = "14px 'Space Grotesk', sans-serif";
            ctx.fillText("No data", padding.left, padding.top + 10);
            return;
        }
        let minX = Math.min(...allPoints.map((p)=>p.x));
        let maxX = Math.max(...allPoints.map((p)=>p.x));
        let minY = Math.min(...allPoints.map((p)=>p.y));
        let maxY = Math.max(...allPoints.map((p)=>p.y));
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
        const mapX = (x)=>padding.left + (x - minX) / (maxX - minX) * chartW;
        const mapY = (y)=>padding.top + (1 - (y - minY) / (maxY - minY)) * chartH;
        // Grid lines
        ctx.strokeStyle = "rgba(0,0,0,0.06)";
        ctx.lineWidth = 1;
        const gridCount = 4;
        for(let i = 0; i <= gridCount; i += 1){
            const y = padding.top + chartH / gridCount * i;
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
        series.forEach((s)=>{
            ctx.strokeStyle = s.color;
            ctx.lineWidth = s.dash ? 2.5 : 3;
            if (s.dash) {
                ctx.setLineDash(s.dash);
            }
            ctx.beginPath();
            s.points.forEach((p, idx)=>{
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
            ctx.setLineDash([
                4,
                4
            ]);
            ctx.beginPath();
            ctx.moveTo(markerXPos, padding.top);
            ctx.lineTo(markerXPos, padding.top + chartH);
            ctx.stroke();
            ctx.setLineDash([]);
            series.forEach((s)=>{
                const closest = s.points.reduce((acc, p)=>{
                    if (!acc) return p;
                    return Math.abs(p.x - markerX) < Math.abs(acc.x - markerX) ? p : acc;
                }, null);
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
    }, [
        series,
        markerX
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "canvas-wrap",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
            ref: canvasRef,
            width: "640",
            height: "240"
        }, void 0, false, {
            fileName: "[project]/app/components/PlotCanvas.tsx",
            lineNumber: 168,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/PlotCanvas.tsx",
        lineNumber: 167,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/components/HistogramCanvas.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HistogramCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function HistogramCanvas({ data, bins = 50, title = "Distribution" }) {
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const canvas = canvasRef.current;
        if (!canvas || !data.length) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        const padding = {
            top: 40,
            right: 40,
            bottom: 50,
            left: 60
        };
        const chartW = width - padding.left - padding.right;
        const chartH = height - padding.top - padding.bottom;
        // Calculate histogram
        const min = Math.min(...data);
        const max = Math.max(...data);
        const binWidth = (max - min) / bins;
        const histogram = new Array(bins).fill(0);
        data.forEach((value)=>{
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
        for(let i = 0; i <= gridCount; i++){
            const y = padding.top + chartH / gridCount * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(padding.left + chartW, y);
            ctx.stroke();
        }
        // Draw bars with different colors for positive/negative values
        const barWidth = chartW / bins;
        const zeroValue = 0;
        histogram.forEach((count, i)=>{
            const barHeight = count / maxCount * chartH;
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
        for(let i = 0; i <= gridCount; i++){
            const y = padding.top + chartH / gridCount * i;
            const value = Math.round(maxCount * (1 - i / gridCount));
            ctx.fillText(String(value), padding.left - 8, y);
        }
        // Draw X-axis labels
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const xLabelCount = 5;
        for(let i = 0; i <= xLabelCount; i++){
            const x = padding.left + chartW / xLabelCount * i;
            const value = min + (max - min) / xLabelCount * i;
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
        const mean = data.reduce((a, b)=>a + b, 0) / data.length;
        const sortedData = [
            ...data
        ].sort((a, b)=>a - b);
        const median = sortedData[Math.floor(data.length / 2)];
        const variance = data.reduce((a, b)=>a + Math.pow(b - mean, 2), 0) / data.length;
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
            `Range: [${min.toFixed(3)}, ${max.toFixed(3)}]`
        ];
        stats.forEach((stat, i)=>{
            ctx.fillText(stat, statsX + 8, statsY + 8 + i * 16);
        });
    }, [
        data,
        bins,
        title
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "canvas-wrap",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
            ref: canvasRef,
            width: "960",
            height: "480"
        }, void 0, false, {
            fileName: "[project]/app/components/HistogramCanvas.tsx",
            lineNumber: 173,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/HistogramCanvas.tsx",
        lineNumber: 172,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/viewer/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ViewerPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FrameCanvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/FrameCanvas.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$PlotCanvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/PlotCanvas.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$HistogramCanvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/HistogramCanvas.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const ARCH_LAYER_COUNT = 42;
function ViewerPage() {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        data: null,
        rows: [],
        coeffs: [],
        targets: [],
        selectedTarget: null,
        currentIndex: 0,
        vmin: -1,
        vmax: 1,
        baseline: null,
        steeringVector: null,
        activeTab: "frame"
    });
    const [selectedModel, setSelectedModel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("Gemma2ForCausalLM");
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("Waiting for data...");
    const [showBaseline, setShowBaseline] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [promptDialogOpen, setPromptDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentPromptFile, setCurrentPromptFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const loadJsonData = (data)=>{
        if (!data || !Array.isArray(data.rows)) {
            setStatus("Invalid JSON: missing rows");
            return;
        }
        const rows = [
            ...data.rows
        ].sort((a, b)=>(a.coeff ?? 0) - (b.coeff ?? 0));
        const coeffs = rows.map((r)=>Number(r.coeff ?? 0));
        const targets = Array.isArray(data.targets) ? data.targets : [];
        let finalTargets = targets;
        if (!targets.length) {
            const keys = [];
            rows.forEach((row)=>{
                [
                    "targets",
                    "targets_first_token"
                ].forEach((key)=>{
                    const value = row[key];
                    if (value && typeof value === "object") {
                        keys.push(...Object.keys(value));
                    }
                });
            });
            finalTargets = [
                ...new Set(keys)
            ];
        }
        const scale = data.delta_color_scale || {};
        let vmin = Number.isFinite(scale.vmin_p5) ? scale.vmin_p5 : -1;
        let vmax = Number.isFinite(scale.vmax_p95) ? scale.vmax_p95 : 1;
        if (!Number.isFinite(vmin) || !Number.isFinite(vmax)) {
            const computed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["computeColorScale"])(rows);
            vmin = computed.vmin;
            vmax = computed.vmax;
        }
        setState((prev)=>({
                ...prev,
                data,
                rows,
                coeffs,
                targets: finalTargets,
                selectedTarget: finalTargets[0] || null,
                currentIndex: 0,
                vmin,
                vmax
            }));
        setStatus(`Loaded ${rows.length} rows`);
    };
    const loadBaselineData = (data)=>{
        if (!data || !Array.isArray(data.rows) || !data.rows.length) {
            return;
        }
        const rows = [
            ...data.rows
        ];
        const plainRow = rows.find((r)=>String(r.label || "") === "plain_prompt") || rows.find((r)=>!r.system_prompt) || null;
        const systemRows = rows.filter((r)=>r.system_prompt);
        const selectedRow = systemRows[0] || plainRow || null;
        const scale = data.delta_color_scale || {};
        let vmin = Number.isFinite(scale.vmin_p5) ? scale.vmin_p5 : -1;
        let vmax = Number.isFinite(scale.vmax_p95) ? scale.vmax_p95 : 1;
        const scaleRow = selectedRow || plainRow;
        if ((vmin == null || vmax == null) && scaleRow?.delta_logprobs?.length) {
            const computed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["computeScaleFromDeltas"])(scaleRow.delta_logprobs);
            vmin = computed.vmin;
            vmax = computed.vmax;
        }
        const baseline = {
            data,
            rows,
            plainRow,
            systemRows,
            selectedRow,
            vmin: Number.isFinite(vmin) ? vmin : -1,
            vmax: Number.isFinite(vmax) ? vmax : 1
        };
        setState((prev)=>({
                ...prev,
                baseline
            }));
        const systemCount = systemRows.length;
        const statusMsg = systemCount ? `Baseline loaded (${systemCount} system prompt${systemCount > 1 ? "s" : ""})` : "Baseline loaded (plain prompt)";
        setStatus(statusMsg);
    };
    const routeJsonData = (data, filename)=>{
        const name = (filename || "").toLowerCase();
        const isBaseline = data?.run_type === "prompt_baseline" || name.includes("baseline") || Array.isArray(data?.rows) && data.rows.length === 1 && !data.delta_color_scale;
        if (isBaseline) {
            loadBaselineData(data);
        } else {
            loadJsonData(data);
        }
    };
    const handleFileChange = (event)=>{
        const files = event.target.files ? Array.from(event.target.files) : [];
        files.forEach((file)=>{
            const reader = new FileReader();
            reader.onload = ()=>{
                try {
                    const data = JSON.parse(reader.result);
                    routeJsonData(data, file.name);
                } catch (err) {
                    setStatus(`Invalid JSON: ${err.message}`);
                }
            };
            reader.readAsText(file);
        });
    };
    const handleSliderChange = (event)=>{
        const index = Number(event.target.value || 0);
        setState((prev)=>({
                ...prev,
                currentIndex: Math.max(0, Math.min(index, prev.rows.length - 1))
            }));
    };
    const handleTargetChange = (event)=>{
        setState((prev)=>({
                ...prev,
                selectedTarget: event.target.value
            }));
    };
    const handleBaselineSelectChange = (event)=>{
        if (!state.baseline || !state.baseline.systemRows?.length) {
            return;
        }
        const idx = Number(event.target.value || 0);
        const selected = state.baseline.systemRows[idx] || state.baseline.systemRows[0];
        setState((prev)=>({
                ...prev,
                baseline: prev.baseline ? {
                    ...prev.baseline,
                    selectedRow: selected
                } : null
            }));
    };
    const setActiveTab = (tab)=>{
        setState((prev)=>({
                ...prev,
                activeTab: tab
            }));
    };
    const loadPromptFromFile = async (promptFile)=>{
        try {
            const res = await fetch(`/data/prompts/${promptFile}`);
            if (res.ok) {
                const data = await res.json();
                routeJsonData(data, promptFile);
                setCurrentPromptFile(promptFile);
            } else {
                setStatus(`Failed to load prompt: ${promptFile}`);
            }
        } catch (err) {
            setStatus(`Error loading prompt: ${err.message}`);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Try to load default JSON
        const loadDefault = async ()=>{
            try {
                const res = await fetch("/steering_run.json");
                if (res.ok) {
                    const data = await res.json();
                    loadJsonData(data);
                }
            } catch (err) {
            // Silently fail - user can upload manually
            }
        };
        // Try to load baseline
        const loadDefaultBaseline = async ()=>{
            try {
                const res = await fetch("/prompt_baseline.json");
                if (res.ok) {
                    const data = await res.json();
                    loadBaselineData(data);
                }
            } catch (err) {
            // Silently fail
            }
        };
        // Try to load steering vector
        const loadSteeringVector = async ()=>{
            try {
                const res = await fetch("/steer_vector.json");
                if (res.ok) {
                    const data = await res.json();
                    setState((prev)=>({
                            ...prev,
                            steeringVector: data
                        }));
                    if (data.modelId) {
                        setSelectedModel(data.modelId);
                    }
                }
            } catch (err) {
            // Silently fail
            }
        };
        loadDefault();
        loadDefaultBaseline();
        loadSteeringVector();
    }, []);
    const getCurrentRow = ()=>{
        return state.rows[state.currentIndex] || null;
    };
    const currentRow = getCurrentRow();
    const coeff = currentRow ? Number(currentRow.coeff ?? 0) : 0;
    const entropy = currentRow?.next_token?.entropy;
    const target = state.selectedTarget;
    const logprob = target && currentRow?.targets && currentRow.targets[target] ? currentRow.targets[target].logprob : null;
    const rank = target && currentRow?.targets_first_token && currentRow.targets_first_token[target] ? currentRow.targets_first_token[target].rank : null;
    const prob = target && currentRow?.targets_first_token && currentRow.targets_first_token[target] ? currentRow.targets_first_token[target].p : null;
    // Build entropy plot series
    const entropyRows = state.rows.filter((r)=>r.next_token && r.next_token.entropy != null);
    const entropyPoints = entropyRows.map((r)=>({
            x: r.coeff ?? 0,
            y: r.next_token.entropy
        }));
    const entropySeries = [
        {
            name: "Entropy",
            color: "#2c3e50",
            points: entropyPoints
        }
    ];
    if (showBaseline && state.baseline && entropyPoints.length) {
        const minX = Math.min(...entropyPoints.map((p)=>p.x));
        const maxX = Math.max(...entropyPoints.map((p)=>p.x));
        if (state.baseline.selectedRow?.next_token?.entropy != null) {
            const y = state.baseline.selectedRow.next_token.entropy;
            entropySeries.push({
                name: "System prompt",
                color: "#d56a35",
                points: [
                    {
                        x: minX,
                        y
                    },
                    {
                        x: maxX,
                        y
                    }
                ],
                dash: [
                    6,
                    6
                ]
            });
        }
        if (state.baseline.plainRow?.next_token?.entropy != null) {
            const y = state.baseline.plainRow.next_token.entropy;
            entropySeries.push({
                name: "Plain prompt",
                color: "#6c8fb6",
                points: [
                    {
                        x: minX,
                        y
                    },
                    {
                        x: maxX,
                        y
                    }
                ],
                dash: [
                    2,
                    6
                ]
            });
        }
    }
    // Build logprob plot series
    const logprobRows = target ? state.rows.filter((r)=>r.targets && r.targets[target]) : [];
    const logprobPoints = logprobRows.map((r)=>({
            x: r.coeff ?? 0,
            y: r.targets[target].logprob
        }));
    const logprobSeries = target ? [
        {
            name: target,
            color: "#d56a35",
            points: logprobPoints
        }
    ] : [];
    if (showBaseline && state.baseline && logprobPoints.length && target) {
        const minX = Math.min(...logprobPoints.map((p)=>p.x));
        const maxX = Math.max(...logprobPoints.map((p)=>p.x));
        if (state.baseline.selectedRow?.targets?.[target]) {
            const y = state.baseline.selectedRow.targets[target].logprob;
            logprobSeries.push({
                name: "System prompt",
                color: "#2c3e50",
                points: [
                    {
                        x: minX,
                        y
                    },
                    {
                        x: maxX,
                        y
                    }
                ],
                dash: [
                    6,
                    6
                ]
            });
        }
        if (state.baseline.plainRow?.targets?.[target]) {
            const y = state.baseline.plainRow.targets[target].logprob;
            logprobSeries.push({
                name: "Plain prompt",
                color: "#6c8fb6",
                points: [
                    {
                        x: minX,
                        y
                    },
                    {
                        x: maxX,
                        y
                    }
                ],
                dash: [
                    2,
                    6
                ]
            });
        }
    }
    const markerX = state.rows[state.currentIndex]?.coeff ?? null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "viewer-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "viewer-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "header-flow",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "header-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "header-label",
                                        children: "Model"
                                    }, void 0, false, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 370,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "header-select",
                                        value: selectedModel,
                                        onChange: (e)=>setSelectedModel(e.target.value),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Gemma2ForCausalLM",
                                                children: "Gemma2ForCausalLM"
                                            }, void 0, false, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 376,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Gemma2-9B-IT",
                                                children: "Gemma2-9B-IT"
                                            }, void 0, false, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 377,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Gemma2-27B-IT",
                                                children: "Gemma2-27B-IT"
                                            }, void 0, false, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 378,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 371,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 369,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "header-arrow",
                                children: "→"
                            }, void 0, false, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 382,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "header-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "header-label",
                                        children: "Steering"
                                    }, void 0, false, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 385,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "header-value",
                                        children: [
                                            "Layer ",
                                            state.data?.layer ?? "N",
                                            " / ",
                                            ARCH_LAYER_COUNT,
                                            " | ",
                                            state.data?.max_new_tokens ?? "--",
                                            " tokens"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 386,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 384,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "header-arrow",
                                children: "→"
                            }, void 0, false, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 391,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "header-item header-prompt",
                                onClick: ()=>setPromptDialogOpen(true),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "header-label",
                                        children: "Prompt"
                                    }, void 0, false, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 394,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "header-value header-clickable",
                                        children: state.data?.prompt || state.baseline?.data?.prompt || "No prompt loaded"
                                    }, void 0, false, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 395,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 393,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "btn-load",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "file",
                                        accept: ".json",
                                        multiple: true,
                                        onChange: handleFileChange,
                                        style: {
                                            display: "none"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 401,
                                        columnNumber: 13
                                    }, this),
                                    "Load Data"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 400,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/viewer/page.tsx",
                        lineNumber: 368,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "header-status",
                        children: status
                    }, void 0, false, {
                        fileName: "[project]/app/viewer/page.tsx",
                        lineNumber: 411,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/viewer/page.tsx",
                lineNumber: 367,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "viewer-layout",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "viewer-panel viewer-main",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "panel-header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "panel-tabs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: `tab ${state.activeTab === "frame" ? "active" : ""}`,
                                                onClick: ()=>setActiveTab("frame"),
                                                children: "Steering Sweep"
                                            }, void 0, false, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 420,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: `tab ${state.activeTab === "prompt" ? "active" : ""}`,
                                                onClick: ()=>setActiveTab("prompt"),
                                                children: "Instructions"
                                            }, void 0, false, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 426,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: `tab ${state.activeTab === "vector" ? "active" : ""}`,
                                                onClick: ()=>setActiveTab("vector"),
                                                children: "Vector"
                                            }, void 0, false, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 432,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: `tab ${state.activeTab === "arch" ? "active" : ""}`,
                                                onClick: ()=>setActiveTab("arch"),
                                                children: "Architecture"
                                            }, void 0, false, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 438,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 419,
                                        columnNumber: 13
                                    }, this),
                                    state.activeTab === "frame" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "panel-stats",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "stat",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "stat-label",
                                                        children: "Coeff"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 449,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "stat-value",
                                                        children: coeff.toFixed(1)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 450,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 448,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "stat",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "stat-label",
                                                        children: "Entropy"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 453,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "stat-value",
                                                        children: entropy != null ? entropy.toFixed(3) : "--"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 454,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 452,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "stat",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "stat-label",
                                                        children: "Logprob"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 457,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "stat-value",
                                                        children: logprob != null ? logprob.toFixed(3) : "--"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 458,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 456,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 447,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 418,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "panel-content",
                                children: [
                                    state.activeTab === "frame" && currentRow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "frame-view",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FrameCanvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                row: currentRow,
                                                data: state.data,
                                                vmin: state.vmin,
                                                vmax: state.vmax
                                            }, void 0, false, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 467,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "frame-controls",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "range",
                                                        min: "0",
                                                        max: Math.max(state.rows.length - 1, 0),
                                                        value: state.currentIndex,
                                                        step: "1",
                                                        onChange: handleSliderChange,
                                                        className: "coeff-slider"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 474,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "slider-info",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Coefficient: ",
                                                                    coeff.toFixed(1)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/viewer/page.tsx",
                                                                lineNumber: 484,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Frame ",
                                                                    state.currentIndex + 1,
                                                                    " / ",
                                                                    state.rows.length
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/viewer/page.tsx",
                                                                lineNumber: 485,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 483,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 473,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 466,
                                        columnNumber: 15
                                    }, this),
                                    state.activeTab === "prompt" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "prompt-view",
                                        children: state.baseline && state.baseline.systemRows.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "instruction-selector",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Select Instruction:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/viewer/page.tsx",
                                                            lineNumber: 496,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            className: "instruction-select",
                                                            onChange: handleBaselineSelectChange,
                                                            value: state.baseline.systemRows.findIndex((row)=>row === state.baseline?.selectedRow),
                                                            children: state.baseline.systemRows.map((row, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: idx,
                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baselineLabel"])(row)
                                                                }, idx, false, {
                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                    lineNumber: 505,
                                                                    columnNumber: 27
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/viewer/page.tsx",
                                                            lineNumber: 497,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/viewer/page.tsx",
                                                    lineNumber: 495,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FrameCanvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    row: state.baseline.selectedRow,
                                                    data: state.baseline.data,
                                                    vmin: state.baseline.vmin,
                                                    vmax: state.baseline.vmax,
                                                    options: {
                                                        title: `Instruction: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baselineLabel"])(state.baseline.selectedRow)}`,
                                                        subtitle: `Δ logprob (instruction - plain) | Max tokens: ${state.baseline.data?.max_new_tokens ?? state.data?.max_new_tokens ?? ""}`,
                                                        legendLeft: `Less likely`,
                                                        legendRight: `More likely`
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/app/viewer/page.tsx",
                                                    lineNumber: 511,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "empty-state",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: "No instruction data loaded"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/viewer/page.tsx",
                                                    lineNumber: 528,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "empty-hint",
                                                    children: "Upload a baseline JSON file to compare different instructions"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/viewer/page.tsx",
                                                    lineNumber: 529,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/viewer/page.tsx",
                                            lineNumber: 527,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 492,
                                        columnNumber: 15
                                    }, this),
                                    state.activeTab === "vector" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "vector-view",
                                        children: state.steeringVector ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "vector-meta",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Layer:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                    lineNumber: 540,
                                                                    columnNumber: 29
                                                                }, this),
                                                                " ",
                                                                state.steeringVector.layer
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/viewer/page.tsx",
                                                            lineNumber: 540,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Feature:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                    lineNumber: 541,
                                                                    columnNumber: 29
                                                                }, this),
                                                                " ",
                                                                state.steeringVector.index
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/viewer/page.tsx",
                                                            lineNumber: 541,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Dimensions:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                    lineNumber: 542,
                                                                    columnNumber: 29
                                                                }, this),
                                                                " ",
                                                                state.steeringVector.vector.length
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/viewer/page.tsx",
                                                            lineNumber: 542,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/viewer/page.tsx",
                                                    lineNumber: 539,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$HistogramCanvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    data: state.steeringVector.vector,
                                                    bins: 60,
                                                    title: "Value Distribution"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/viewer/page.tsx",
                                                    lineNumber: 544,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "empty-state",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "No steering vector loaded"
                                            }, void 0, false, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 552,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/viewer/page.tsx",
                                            lineNumber: 551,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 536,
                                        columnNumber: 15
                                    }, this),
                                    state.activeTab === "arch" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "arch-view",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "arch-header-section",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        children: "Gemma2ForCausalLM Architecture"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 561,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "arch-meta-grid",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "arch-meta-item",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "arch-meta-label",
                                                                        children: "Model"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/viewer/page.tsx",
                                                                        lineNumber: 564,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "arch-meta-value",
                                                                        children: selectedModel
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/viewer/page.tsx",
                                                                        lineNumber: 565,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/viewer/page.tsx",
                                                                lineNumber: 563,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "arch-meta-item",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "arch-meta-label",
                                                                        children: "Total Layers"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/viewer/page.tsx",
                                                                        lineNumber: 568,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "arch-meta-value",
                                                                        children: ARCH_LAYER_COUNT
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/viewer/page.tsx",
                                                                        lineNumber: 569,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/viewer/page.tsx",
                                                                lineNumber: 567,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "arch-meta-item",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "arch-meta-label",
                                                                        children: "Hidden Size"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/viewer/page.tsx",
                                                                        lineNumber: 572,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "arch-meta-value",
                                                                        children: "3584"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/viewer/page.tsx",
                                                                        lineNumber: 573,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/viewer/page.tsx",
                                                                lineNumber: 571,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "arch-meta-item",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "arch-meta-label",
                                                                        children: "Vocab Size"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/viewer/page.tsx",
                                                                        lineNumber: 576,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "arch-meta-value",
                                                                        children: "256K"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/viewer/page.tsx",
                                                                        lineNumber: 577,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/viewer/page.tsx",
                                                                lineNumber: 575,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 562,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 560,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "arch-flow-container",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "arch-flow",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "arch-component-card",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Token Embedding"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                    lineNumber: 586,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "arch-detail",
                                                                    children: "256K vocab → 3584 dimensions"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                    lineNumber: 587,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/viewer/page.tsx",
                                                            lineNumber: 585,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "arch-flow-arrow-large",
                                                            children: "↓"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/viewer/page.tsx",
                                                            lineNumber: 590,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "arch-decoder-stack",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "arch-decoder-title",
                                                                    children: "Transformer Decoder Stack"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                    lineNumber: 594,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "arch-active-layer",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "arch-layer-title",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                    children: [
                                                                                        "Layer ",
                                                                                        state.data?.layer ?? "N",
                                                                                        " of 42"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                                    lineNumber: 598,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                state.data?.layer != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "arch-steering-indicator",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            children: "⚡"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/viewer/page.tsx",
                                                                                            lineNumber: 601,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            children: "Steering Injection Point"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/viewer/page.tsx",
                                                                                            lineNumber: 602,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                                    lineNumber: 600,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/viewer/page.tsx",
                                                                            lineNumber: 597,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "arch-layer-components",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "arch-component-box",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "box-title",
                                                                                            children: "Multi-Head Attention"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/viewer/page.tsx",
                                                                                            lineNumber: 609,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "box-details",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    children: "• input_layernorm: RMSNorm(3584)"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                                                    lineNumber: 611,
                                                                                                    columnNumber: 31
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    children: "• Q projection: 3584 → 4096"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                                                    lineNumber: 612,
                                                                                                    columnNumber: 31
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    children: "• K projection: 3584 → 2048"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                                                    lineNumber: 613,
                                                                                                    columnNumber: 31
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    children: "• V projection: 3584 → 2048"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                                                    lineNumber: 614,
                                                                                                    columnNumber: 31
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    children: "• output_proj: 4096 → 3584"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                                                    lineNumber: 615,
                                                                                                    columnNumber: 31
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    children: "• post_attention_layernorm"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                                                    lineNumber: 616,
                                                                                                    columnNumber: 31
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/viewer/page.tsx",
                                                                                            lineNumber: 610,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                                    lineNumber: 608,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "arch-component-box",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "box-title",
                                                                                            children: "Feed-Forward Network"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/viewer/page.tsx",
                                                                                            lineNumber: 621,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "box-details",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    children: "• pre_feedforward_layernorm"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                                                    lineNumber: 623,
                                                                                                    columnNumber: 31
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    children: "• gate projection: 3584 → 14336"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                                                    lineNumber: 624,
                                                                                                    columnNumber: 31
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    children: "• up projection: 3584 → 14336"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                                                    lineNumber: 625,
                                                                                                    columnNumber: 31
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    children: "• GELU activation"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                                                    lineNumber: 626,
                                                                                                    columnNumber: 31
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    children: "• down projection: 14336 → 3584"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                                                    lineNumber: 627,
                                                                                                    columnNumber: 31
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    children: "• post_feedforward_layernorm"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                                                    lineNumber: 628,
                                                                                                    columnNumber: 31
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/viewer/page.tsx",
                                                                                            lineNumber: 622,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                                    lineNumber: 620,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/viewer/page.tsx",
                                                                            lineNumber: 607,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                    lineNumber: 596,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "arch-ellipsis",
                                                                    children: "⋮"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                    lineNumber: 634,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/viewer/page.tsx",
                                                            lineNumber: 593,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "arch-flow-arrow-large",
                                                            children: "↓"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/viewer/page.tsx",
                                                            lineNumber: 637,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "arch-component-card",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Final RMSNorm"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                    lineNumber: 641,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "arch-detail",
                                                                    children: "3584 dim, eps=1e-06"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                    lineNumber: 642,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/viewer/page.tsx",
                                                            lineNumber: 640,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "arch-flow-arrow-large",
                                                            children: "↓"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/viewer/page.tsx",
                                                            lineNumber: 645,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "arch-component-card",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Language Model Head"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                    lineNumber: 649,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "arch-detail",
                                                                    children: "3584 → 256K logits"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                    lineNumber: 650,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/viewer/page.tsx",
                                                            lineNumber: 648,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/viewer/page.tsx",
                                                    lineNumber: 583,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 582,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 559,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 464,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/viewer/page.tsx",
                        lineNumber: 417,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "viewer-panel viewer-sidebar",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "plot-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "plot-header",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    children: "Entropy Shift"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/viewer/page.tsx",
                                                    lineNumber: 664,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: "Next-token entropy"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/viewer/page.tsx",
                                                    lineNumber: 665,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/viewer/page.tsx",
                                            lineNumber: 663,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 662,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$PlotCanvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        series: entropySeries,
                                        markerX: markerX
                                    }, void 0, false, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 668,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 661,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "plot-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "plot-header",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        children: "Target Logprob"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 674,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "Phrase probability"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 675,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 673,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                onChange: handleTargetChange,
                                                disabled: !state.targets.length,
                                                value: state.selectedTarget || "",
                                                className: "target-select",
                                                children: state.targets.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "No targets"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/viewer/page.tsx",
                                                    lineNumber: 684,
                                                    columnNumber: 19
                                                }, this) : state.targets.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: t,
                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTargetLabel"])(t)
                                                    }, t, false, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 687,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 677,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 672,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$PlotCanvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        series: logprobSeries,
                                        markerX: markerX
                                    }, void 0, false, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 694,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "plot-footer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "metric-label",
                                                        children: "Rank"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 697,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "metric-value",
                                                        children: rank != null ? rank : "--"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 698,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 696,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "metric",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "metric-label",
                                                        children: "Prob"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 701,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "metric-value",
                                                        children: prob != null ? prob.toFixed(4) : "--"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 702,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 700,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 695,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 671,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "baseline-toggle-card",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: showBaseline,
                                            onChange: (e)=>setShowBaseline(e.target.checked)
                                        }, void 0, false, {
                                            fileName: "[project]/app/viewer/page.tsx",
                                            lineNumber: 710,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Show baseline comparison"
                                        }, void 0, false, {
                                            fileName: "[project]/app/viewer/page.tsx",
                                            lineNumber: 715,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/viewer/page.tsx",
                                    lineNumber: 709,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 708,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/viewer/page.tsx",
                        lineNumber: 660,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/viewer/page.tsx",
                lineNumber: 415,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/viewer/page.tsx",
        lineNumber: 365,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=app_7b5946a2._.js.map