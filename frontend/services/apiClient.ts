import { MasterJobRequest, ApiResponse, AnalysisResult, DeliberationOutput } from '../types';

/**
 * NOTE: In a real Next.js application, these functions would call your
 * /api/upload-url and /api/master routes.
 * Since this is a pure frontend SPA environment, we mock the backend behavior
 * to demonstrate the UI flow and state management.
 */

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockUploadFile = async (file: File, onProgress: (progress: number) => void): Promise<string> => {
  // Simulate upload progress
  for (let i = 0; i <= 100; i += 10) {
    onProgress(i);
    await delay(200);
  }
  // Return a fake URL
  return `https://mock-storage.example.com/uploads/${file.name}`;
};

export const mockSubmitMasteringJob = async (request: MasterJobRequest): Promise<ApiResponse> => {
  // Simulate processing time based on route
  const processingTime = request.route === 'full' ? 4000 : 2000;
  await delay(processingTime);

  // Simulate potential errors
  if (request.route === 'dsp_only' && !request.manual_params) {
    return { type: 'application/json', data: {} as any, error: "manual_params is required for dsp_only route." };
  }

  switch (request.route) {
    case 'full':
    case 'dsp_only':
      // Simulate returning a WAV file
      // In reality, this would be a real audio blob from the server
      const dummyWavContent = new Uint8Array([82, 73, 70, 70, 36, 0, 0, 0, 87, 65, 86, 69]); // Fake RIFF header
      const blob = new Blob([dummyWavContent], { type: 'audio/wav' });
      return { type: 'audio/wav', data: blob };

    case 'analyze_only':
      // Simulate analysis JSON response
      const analysisMock: AnalysisResult = {
        integrated_lufs: -13.2,
        true_peak_dbtp: -0.8,
        lra_lu: 4.5,
        psr_db: 9.2,
        crest_db: 12.1,
        stereo_width: 1.1,
        stereo_correlation: 0.85,
        low_mono_correlation_below_120hz: 0.95,
        harshness_risk: 0.1,
        mud_risk: 0.2,
        sub_ratio: 0.05,
        bass_ratio: 0.15,
        low_mid_ratio: 0.3,
        mid_ratio: 0.3,
        high_ratio: 0.15,
        air_ratio: 0.05,
        bpm: 120,
        key: "C minor"
      };
      return { type: 'application/json', data: analysisMock };

    case 'deliberation_only':
      // Simulate deliberation JSON response
      const deliberationMock: DeliberationOutput = {
        adopted_params: {
          input_gain_db: 1.2,
          eq_low_shelf_gain_db: 0.5,
          eq_low_mid_gain_db: -0.5,
          eq_high_mid_gain_db: 1.0,
          eq_high_shelf_gain_db: 1.5,
          ms_side_high_gain_db: 0.5,
          ms_mid_low_gain_db: -0.2,
          comp_threshold_db: -20,
          comp_ratio: 3.0,
          comp_attack_sec: 0.03,
          comp_release_sec: 0.2,
          limiter_ceil_db: request.target_true_peak || -1.0,
          transformer_saturation: 0.2,
          transformer_mix: 0.5,
          triode_drive: 0.1,
          triode_bias: 0.5,
          triode_mix: 0.3,
          tape_saturation: 0.4,
          tape_mix: 0.6,
          dyn_eq_enabled: 1,
          stereo_low_mono: 1,
          stereo_high_wide: 1.1,
          stereo_width: 1.05,
          parallel_wet: 0.1
        },
        target_lufs: request.target_lufs || -14.0,
        target_true_peak: request.target_true_peak || -1.0,
        strategy: "Modern Pop/EDM enhancement with controlled low-end and widened highs."
      };
      return { type: 'application/json', data: deliberationMock };

    default:
      return { type: 'application/json', data: {} as any, error: "Unknown route" };
  }
};
