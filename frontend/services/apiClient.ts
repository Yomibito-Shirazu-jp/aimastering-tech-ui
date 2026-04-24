import { MasterJobRequest, ApiResponse, AnalysisResult, DeliberationOutput } from '../types';

/**
 * Real API client for WhitePrint Concertmaster API.
 * Calls the Vite dev proxy -> Express backend -> Concertmaster API.
 * In production, calls the public proxy at www.aimastering.tech.
 */

const API_BASE = import.meta.env.PROD
  ? 'https://www.aimastering.tech'
  : ''; // dev proxy handles /api/*

// ─── Upload ───────────────────────────────────────────

export const uploadFile = async (
  file: File,
  onProgress: (progress: number) => void,
): Promise<string> => {
  onProgress(0);

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(${API_BASE}/api/upload, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || Upload failed: );
  }

  onProgress(100);
  const data = await res.json();
  // The upload endpoint returns { url, object, bucket }
  return data.url as string;
};

// ─── Mastering ────────────────────────────────────────

export const submitMasteringJob = async (
  request: MasterJobRequest,
): Promise<ApiResponse> => {
  const body: Record<string, unknown> = {
    audio_url: request.audio_url,
    route: request.route,
  };
  if (request.target_lufs != null) body.target_lufs = request.target_lufs;
  if (request.target_true_peak != null) body.target_true_peak = request.target_true_peak;
  if (request.manual_params) body.manual_params = request.manual_params;

  const res = await fetch(${API_BASE}/api/master, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ error: res.statusText }));
    return { type: 'application/json', data: {} as any, error: errBody.error || Error  };
  }

  const contentType = res.headers.get('content-type') || '';

  // WAV binary response (full / dsp_only routes)
  if (contentType.includes('audio/')) {
    const blob = await res.blob();
    return { type: 'audio/wav', data: blob };
  }

  // JSON response (analyze_only / deliberation_only / sync completion)
  const json = await res.json();

  // Sync completion from CM v00022+ returns download_url
  if (json.download_url) {
    // Fetch the mastered WAV from the signed GCS URL
    const wavRes = await fetch(json.download_url);
    if (wavRes.ok) {
      const blob = await wavRes.blob();
      return {
        type: 'audio/wav',
        data: blob,
        // Attach analysis/deliberation as extra metadata
        ...(json.analysis && { analysis: json.analysis }),
        ...(json.deliberation && { deliberation: json.deliberation }),
      } as any;
    }
  }

  // Pure JSON routes
  if (request.route === 'analyze_only') {
    return { type: 'application/json', data: (json.analysis || json) as AnalysisResult };
  }
  if (request.route === 'deliberation_only') {
    return { type: 'application/json', data: (json.deliberation || json) as DeliberationOutput };
  }

  return { type: 'application/json', data: json };
};
