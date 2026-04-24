export type ProcessingRoute =
  | "full"
  | "analyze_only"
  | "deliberation_only"
  | "dsp_only";

export type MasteringState =
  | "idle"
  | "uploading"
  | "uploaded"
  | "processing"
  | "completed"
  | "error";

export interface DspParams {
  input_gain_db: number;
  eq_low_shelf_gain_db: number;
  eq_low_mid_gain_db: number;
  eq_high_mid_gain_db: number;
  eq_high_shelf_gain_db: number;
  ms_side_high_gain_db: number;
  ms_mid_low_gain_db: number;
  comp_threshold_db: number;
  comp_ratio: number;
  comp_attack_sec: number;
  comp_release_sec: number;
  limiter_ceil_db: number;
  transformer_saturation: number;
  transformer_mix: number;
  triode_drive: number;
  triode_bias: number;
  triode_mix: number;
  tape_saturation: number;
  tape_mix: number;
  dyn_eq_enabled: number;
  stereo_low_mono: number;
  stereo_high_wide: number;
  stereo_width: number;
  parallel_wet: number;
}

export interface MasterJobRequest {
  audio_url: string;
  route: ProcessingRoute;
  target_lufs?: number;
  target_true_peak?: number;
  manual_params?: DspParams | null;
}

export interface AnalysisResult {
  integrated_lufs?: number;
  true_peak_dbtp?: number;
  lra_lu?: number;
  psr_db?: number;
  crest_db?: number;
  stereo_width?: number;
  stereo_correlation?: number;
  low_mono_correlation_below_120hz?: number;
  harshness_risk?: number;
  mud_risk?: number;
  sub_ratio?: number;
  bass_ratio?: number;
  low_mid_ratio?: number;
  mid_ratio?: number;
  high_ratio?: number;
  air_ratio?: number;
  bpm?: number;
  key?: string;
  sections?: unknown[];
}

export interface DeliberationOutput {
  adopted_params: DspParams;
  target_lufs: number;
  target_true_peak: number;
  strategy?: string;
  section_overrides?: unknown[];
}

export interface ApiResponse {
  type: 'audio/wav' | 'application/json';
  data: Blob | AnalysisResult | DeliberationOutput;
  error?: string;
}
