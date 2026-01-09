"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { AppState, SteeringData, BaselineData, Row, SteeringVector } from "../types";
import {
  computeColorScale,
  computeScaleFromDeltas,
  formatTargetLabel,
  baselineLabel,
} from "../utils";
import FrameCanvas from "../components/FrameCanvas";
import PlotCanvas from "../components/PlotCanvas";
import HistogramCanvas from "../components/HistogramCanvas";

const ARCH_LAYER_COUNT = 42;

export default function ViewerPage() {
  const [state, setState] = useState<AppState>({
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
    activeTab: "frame",
  });

  const [selectedModel, setSelectedModel] = useState("Gemma2ForCausalLM");
  const [status, setStatus] = useState("Waiting for data...");

  const loadJsonData = (data: SteeringData) => {
    if (!data || !Array.isArray(data.rows)) {
      setStatus("Invalid JSON: missing rows");
      return;
    }

    const rows = [...data.rows].sort((a, b) => (a.coeff ?? 0) - (b.coeff ?? 0));
    const coeffs = rows.map((r) => Number(r.coeff ?? 0));

    const targets = Array.isArray(data.targets) ? data.targets : [];
    let finalTargets = targets;
    if (!targets.length) {
      const keys: string[] = [];
      rows.forEach((row) => {
        ["targets", "targets_first_token"].forEach((key) => {
          const value = row[key as keyof Row];
          if (value && typeof value === "object") {
            keys.push(...Object.keys(value));
          }
        });
      });
      finalTargets = [...new Set(keys)];
    }

    const scale = data.delta_color_scale || {};
    let vmin = Number.isFinite(scale.vmin_p5) ? scale.vmin_p5! : -1;
    let vmax = Number.isFinite(scale.vmax_p95) ? scale.vmax_p95! : 1;
    if (!Number.isFinite(vmin) || !Number.isFinite(vmax)) {
      const computed = computeColorScale(rows);
      vmin = computed.vmin;
      vmax = computed.vmax;
    }

    setState((prev) => ({
      ...prev,
      data,
      rows,
      coeffs,
      targets: finalTargets,
      selectedTarget: finalTargets[0] || null,
      currentIndex: 0,
      vmin,
      vmax,
    }));

    setStatus(`Loaded ${rows.length} rows`);
  };

  const loadBaselineData = (data: SteeringData) => {
    if (!data || !Array.isArray(data.rows) || !data.rows.length) {
      return;
    }
    const rows = [...data.rows];
    const plainRow =
      rows.find((r) => String(r.label || "") === "plain_prompt") ||
      rows.find((r) => !r.system_prompt) ||
      null;
    const systemRows = rows.filter((r) => r.system_prompt);
    const selectedRow = systemRows[0] || plainRow || null;

    const scale = data.delta_color_scale || {};
    let vmin = Number.isFinite(scale.vmin_p5) ? scale.vmin_p5! : -1;
    let vmax = Number.isFinite(scale.vmax_p95) ? scale.vmax_p95! : 1;
    const scaleRow = selectedRow || plainRow;
    if ((vmin == null || vmax == null) && scaleRow?.delta_logprobs?.length) {
      const computed = computeScaleFromDeltas(scaleRow.delta_logprobs);
      vmin = computed.vmin;
      vmax = computed.vmax;
    }

    const baseline: BaselineData = {
      data,
      rows,
      plainRow,
      systemRows,
      selectedRow,
      vmin: Number.isFinite(vmin) ? vmin : -1,
      vmax: Number.isFinite(vmax) ? vmax : 1,
    };

    setState((prev) => ({ ...prev, baseline }));

    const systemCount = systemRows.length;
    const statusMsg = systemCount
      ? `Baseline loaded (${systemCount} system prompt${systemCount > 1 ? "s" : ""})`
      : "Baseline loaded (plain prompt)";
    setStatus(statusMsg);
  };

  const routeJsonData = (data: SteeringData, filename: string) => {
    const name = (filename || "").toLowerCase();
    const isBaseline =
      data?.run_type === "prompt_baseline" ||
      name.includes("baseline") ||
      (Array.isArray(data?.rows) && data.rows.length === 1 && !data.delta_color_scale);

    if (isBaseline) {
      loadBaselineData(data);
    } else {
      loadJsonData(data);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string);
          routeJsonData(data, file.name);
        } catch (err: any) {
          setStatus(`Invalid JSON: ${err.message}`);
        }
      };
      reader.readAsText(file);
    });
  };

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const index = Number(event.target.value || 0);
    setState((prev) => ({
      ...prev,
      currentIndex: Math.max(0, Math.min(index, prev.rows.length - 1)),
    }));
  };

  const handleTargetChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setState((prev) => ({ ...prev, selectedTarget: event.target.value }));
  };

  const handleBaselineSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!state.baseline || !state.baseline.systemRows?.length) {
      return;
    }
    const idx = Number(event.target.value || 0);
    const selected = state.baseline.systemRows[idx] || state.baseline.systemRows[0];
    setState((prev) => ({
      ...prev,
      baseline: prev.baseline
        ? { ...prev.baseline, selectedRow: selected }
        : null,
    }));
  };

  const setActiveTab = (tab: "frame" | "prompt" | "arch" | "vector") => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  };

  useEffect(() => {
    // Try to load default JSON
    const loadDefault = async () => {
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
    const loadDefaultBaseline = async () => {
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
    const loadSteeringVector = async () => {
      try {
        const res = await fetch("/steer_vector.json");
        if (res.ok) {
          const data = await res.json() as SteeringVector;
          setState((prev) => ({ ...prev, steeringVector: data }));
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

  const getCurrentRow = (): Row | null => {
    return state.rows[state.currentIndex] || null;
  };

  const currentRow = getCurrentRow();
  const coeff = currentRow ? Number(currentRow.coeff ?? 0) : 0;
  const entropy = currentRow?.next_token?.entropy;
  const target = state.selectedTarget;
  const logprob =
    target && currentRow?.targets && currentRow.targets[target]
      ? currentRow.targets[target].logprob
      : null;
  const rank =
    target && currentRow?.targets_first_token && currentRow.targets_first_token[target]
      ? currentRow.targets_first_token[target].rank
      : null;
  const prob =
    target && currentRow?.targets_first_token && currentRow.targets_first_token[target]
      ? currentRow.targets_first_token[target].p
      : null;

  // Build entropy plot series
  const entropyRows = state.rows.filter(
    (r) => r.next_token && r.next_token.entropy != null
  );
  const entropyPoints = entropyRows.map((r) => ({
    x: r.coeff ?? 0,
    y: r.next_token!.entropy,
  }));
  const entropySeries = [
    {
      name: "Entropy",
      color: "#2c3e50",
      points: entropyPoints,
    },
  ];
  if (state.baseline && entropyPoints.length) {
    const minX = Math.min(...entropyPoints.map((p) => p.x));
    const maxX = Math.max(...entropyPoints.map((p) => p.x));
    if (state.baseline.selectedRow?.next_token?.entropy != null) {
      const y = state.baseline.selectedRow.next_token.entropy;
      entropySeries.push({
        name: "System prompt",
        color: "#d56a35",
        points: [
          { x: minX, y },
          { x: maxX, y },
        ],
        dash: [6, 6],
      } as any);
    }
    if (state.baseline.plainRow?.next_token?.entropy != null) {
      const y = state.baseline.plainRow.next_token.entropy;
      entropySeries.push({
        name: "Plain prompt",
        color: "#6c8fb6",
        points: [
          { x: minX, y },
          { x: maxX, y },
        ],
        dash: [2, 6],
      } as any);
    }
  }

  // Build logprob plot series
  const logprobRows = target
    ? state.rows.filter((r) => r.targets && r.targets[target])
    : [];
  const logprobPoints = logprobRows.map((r) => ({
    x: r.coeff ?? 0,
    y: r.targets![target!].logprob,
  }));
  const logprobSeries = target
    ? [
        {
          name: target,
          color: "#d56a35",
          points: logprobPoints,
        },
      ]
    : [];
  if (state.baseline && logprobPoints.length && target) {
    const minX = Math.min(...logprobPoints.map((p) => p.x));
    const maxX = Math.max(...logprobPoints.map((p) => p.x));
    if (state.baseline.selectedRow?.targets?.[target]) {
      const y = state.baseline.selectedRow.targets[target].logprob;
      logprobSeries.push({
        name: "System prompt",
        color: "#2c3e50",
        points: [
          { x: minX, y },
          { x: maxX, y },
        ],
        dash: [6, 6],
      } as any);
    }
    if (state.baseline.plainRow?.targets?.[target]) {
      const y = state.baseline.plainRow.targets[target].logprob;
      logprobSeries.push({
        name: "Plain prompt",
        color: "#6c8fb6",
        points: [
          { x: minX, y },
          { x: maxX, y },
        ],
        dash: [2, 6],
      } as any);
    }
  }

  const markerX = state.rows[state.currentIndex]?.coeff ?? null;

  return (
    <div className="viewer-container">
      {/* Compact Single-Line Header */}
      <header className="viewer-header">
        <div className="header-flow">
          <div className="header-item">
            <label className="header-label">Model</label>
            <select
              className="header-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="Gemma2ForCausalLM">Gemma2ForCausalLM</option>
              <option value="Gemma2-9B-IT">Gemma2-9B-IT</option>
              <option value="Gemma2-27B-IT">Gemma2-27B-IT</option>
            </select>
          </div>

          <div className="header-arrow">→</div>

          <div className="header-item">
            <label className="header-label">Steering</label>
            <div className="header-value">
              Layer {state.data?.layer ?? "N"} / {ARCH_LAYER_COUNT} | {state.data?.max_new_tokens ?? "--"} tokens
            </div>
          </div>

          <div className="header-arrow">→</div>

          <div className="header-item header-prompt">
            <label className="header-label">Prompt</label>
            <div className="header-value">
              {state.data?.prompt || state.baseline?.data?.prompt || "No prompt loaded"}
            </div>
          </div>

          <label className="btn-load">
            <input
              type="file"
              accept=".json"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            Load Data
          </label>
        </div>
        <div className="header-status">{status}</div>
      </header>

      {/* Main Content */}
      <main className="viewer-layout">
        {/* Left Panel: Visualization */}
        <section className="viewer-panel viewer-main">
          <div className="panel-header">
            <div className="panel-tabs">
              <button
                className={`tab ${state.activeTab === "frame" ? "active" : ""}`}
                onClick={() => setActiveTab("frame")}
              >
                Steering Sweep
              </button>
              <button
                className={`tab ${state.activeTab === "prompt" ? "active" : ""}`}
                onClick={() => setActiveTab("prompt")}
              >
                Instructions
              </button>
              <button
                className={`tab ${state.activeTab === "vector" ? "active" : ""}`}
                onClick={() => setActiveTab("vector")}
              >
                Vector
              </button>
              <button
                className={`tab ${state.activeTab === "arch" ? "active" : ""}`}
                onClick={() => setActiveTab("arch")}
              >
                Architecture
              </button>
            </div>

            {state.activeTab === "frame" && (
              <div className="panel-stats">
                <div className="stat">
                  <span className="stat-label">Coeff</span>
                  <span className="stat-value">{coeff.toFixed(1)}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Entropy</span>
                  <span className="stat-value">{entropy != null ? entropy.toFixed(3) : "--"}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Logprob</span>
                  <span className="stat-value">{logprob != null ? logprob.toFixed(3) : "--"}</span>
                </div>
              </div>
            )}
          </div>

          <div className="panel-content">
            {state.activeTab === "frame" && currentRow && (
              <div className="frame-view">
                <FrameCanvas
                  row={currentRow}
                  data={state.data}
                  vmin={state.vmin}
                  vmax={state.vmax}
                />
                <div className="frame-controls">
                  <input
                    type="range"
                    min="0"
                    max={Math.max(state.rows.length - 1, 0)}
                    value={state.currentIndex}
                    step="1"
                    onChange={handleSliderChange}
                    className="coeff-slider"
                  />
                  <div className="slider-info">
                    <span>Coefficient: {coeff.toFixed(1)}</span>
                    <span>Frame {state.currentIndex + 1} / {state.rows.length}</span>
                  </div>
                </div>
              </div>
            )}

            {state.activeTab === "prompt" && (
              <div className="prompt-view">
                {state.baseline && state.baseline.systemRows.length > 0 ? (
                  <>
                    <div className="instruction-selector">
                      <label>Select Instruction:</label>
                      <select
                        className="instruction-select"
                        onChange={handleBaselineSelectChange}
                        value={state.baseline.systemRows.findIndex(
                          (row) => row === state.baseline?.selectedRow
                        )}
                      >
                        {state.baseline.systemRows.map((row, idx) => (
                          <option key={idx} value={idx}>
                            {baselineLabel(row)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <FrameCanvas
                      row={state.baseline.selectedRow!}
                      data={state.baseline.data}
                      vmin={state.baseline.vmin}
                      vmax={state.baseline.vmax}
                      options={{
                        title: `Instruction: ${baselineLabel(state.baseline.selectedRow!)}`,
                        subtitle: `Δ logprob (instruction - plain) | Max tokens: ${
                          state.baseline.data?.max_new_tokens ?? state.data?.max_new_tokens ?? ""
                        }`,
                        legendLeft: `Less likely`,
                        legendRight: `More likely`,
                      }}
                    />
                  </>
                ) : (
                  <div className="empty-state">
                    <p>No instruction data loaded</p>
                    <p className="empty-hint">Upload a baseline JSON file to compare different instructions</p>
                  </div>
                )}
              </div>
            )}

            {state.activeTab === "vector" && (
              <div className="vector-view">
                {state.steeringVector ? (
                  <>
                    <div className="vector-meta">
                      <span><strong>Layer:</strong> {state.steeringVector.layer}</span>
                      <span><strong>Feature:</strong> {state.steeringVector.index}</span>
                      <span><strong>Dimensions:</strong> {state.steeringVector.vector.length}</span>
                    </div>
                    <HistogramCanvas
                      data={state.steeringVector.vector}
                      bins={60}
                      title="Value Distribution"
                    />
                  </>
                ) : (
                  <div className="empty-state">
                    <p>No steering vector loaded</p>
                  </div>
                )}
              </div>
            )}

            {state.activeTab === "arch" && (
              <div className="arch-view">
                <div className="arch-flow">
                  <div className="arch-box">
                    <strong>Embedding</strong>
                    <span>256K vocab → 3584 dim</span>
                  </div>

                  <div className="arch-arrow">↓</div>

                  <div className="arch-box decoder">
                    <strong>Decoder Stack (42 Layers)</strong>
                    <div className={`arch-layer-detail ${state.data?.layer != null ? "active" : ""}`}>
                      <div>
                        <strong>Layer {state.data?.layer ?? "N"}</strong>
                        {state.data?.layer != null && <span className="steering-badge">⚡ Steering</span>}
                      </div>
                      <div className="layer-info">
                        <div>Multi-Head Attention</div>
                        <div>Feed-Forward Network</div>
                        <div>RMSNorm × 4</div>
                      </div>
                    </div>
                  </div>

                  <div className="arch-arrow">↓</div>

                  <div className="arch-box">
                    <strong>LM Head</strong>
                    <span>3584 → 256K logits</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Panel: Plots */}
        <aside className="viewer-panel viewer-sidebar">
          <div className="plot-card">
            <div className="plot-header">
              <div>
                <h3>Entropy Shift</h3>
                <p>Next-token entropy</p>
              </div>
            </div>
            <PlotCanvas series={entropySeries} markerX={markerX} />
          </div>

          <div className="plot-card">
            <div className="plot-header">
              <div>
                <h3>Target Logprob</h3>
                <p>Phrase probability</p>
              </div>
              <select
                onChange={handleTargetChange}
                disabled={!state.targets.length}
                value={state.selectedTarget || ""}
                className="target-select"
              >
                {state.targets.length === 0 ? (
                  <option value="">No targets</option>
                ) : (
                  state.targets.map((t) => (
                    <option key={t} value={t}>
                      {formatTargetLabel(t)}
                    </option>
                  ))
                )}
              </select>
            </div>
            <PlotCanvas series={logprobSeries} markerX={markerX} />
            <div className="plot-footer">
              <div className="metric">
                <span className="metric-label">Rank</span>
                <span className="metric-value">{rank != null ? rank : "--"}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Prob</span>
                <span className="metric-value">{prob != null ? prob.toFixed(4) : "--"}</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
