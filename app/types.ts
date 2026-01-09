export interface Row {
  coeff?: number;
  label?: string;
  system_prompt?: string;
  generated_pieces?: string[];
  delta_logprobs?: number[];
  next_token?: {
    entropy: number;
  };
  targets?: {
    [key: string]: {
      logprob: number;
    };
  };
  targets_first_token?: {
    [key: string]: {
      rank: number;
      p: number;
    };
  };
}

export interface SteeringData {
  rows: Row[];
  targets?: string[];
  prompt?: string;
  layer?: number;
  max_new_tokens?: number;
  delta_color_scale?: {
    vmin_p5?: number;
    vmax_p95?: number;
  };
  run_type?: string;
}

export interface BaselineData {
  data: SteeringData;
  rows: Row[];
  plainRow: Row | null;
  systemRows: Row[];
  selectedRow: Row | null;
  vmin: number;
  vmax: number;
}

export interface SteeringVector {
  modelId: string;
  layer: string;
  index: string;
  vectorLabel: string;
  vector: number[];
}

export interface AppState {
  data: SteeringData | null;
  rows: Row[];
  coeffs: number[];
  targets: string[];
  selectedTarget: string | null;
  currentIndex: number;
  vmin: number;
  vmax: number;
  baseline: BaselineData | null;
  steeringVector: SteeringVector | null;
  activeTab: "frame" | "prompt" | "arch" | "vector";
}

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
  css: string;
}
