import React, { useState, useEffect } from 'react';
import { UploadDropzone } from '../components/UploadDropzone';
import { DspParamsEditor } from '../components/DspParamsEditor';
import { AnalysisResultView } from '../components/AnalysisResultView';
import { DeliberationResultView } from '../components/DeliberationResultView';
import { MasteringState, ProcessingRoute, MasterJobRequest, DspParams, ApiResponse, AnalysisResult, DeliberationOutput } from '../types';
import { DEFAULT_DSP_PARAMS } from '../constants';
import { mockUploadFile, mockSubmitMasteringJob } from '../services/apiClient';
import { Settings2, ChevronDown, ChevronUp, Play, Download, FileAudio, Loader2, AlertCircle, CheckCircle2, BrainCircuit, Sliders } from 'lucide-react';

const PROCESSING_STEPS = [
  "音源をアップロード中...",
  "ラウドネスと帯域バランスを解析中...",
  "AI合議でマスタリング方針を検討中...",
  "DSPパラメータを決定中...",
  "マスタリングWAVを生成中...",
  "ダウンロード準備中..."
];

export const Mastering: React.FC = () => {
  const [state, setState] = useState<MasteringState>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [processingStepIdx, setProcessingStepIdx] = useState(0);
  
  // Settings State
  const [route, setRoute] = useState<ProcessingRoute>('full');
  const [targetLufs, setTargetLufs] = useState<number>(-14.0);
  const [targetTruePeak, setTargetTruePeak] = useState<number>(-1.0);
  const [manualParams, setManualParams] = useState<DspParams>(DEFAULT_DSP_PARAMS);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Result State
  const [result, setResult] = useState<ApiResponse | null>(null);

  useEffect(() => {
    let interval: number;
    if (state === 'processing') {
      interval = window.setInterval(() => {
        setProcessingStepIdx(prev => Math.min(prev + 1, PROCESSING_STEPS.length - 1));
      }, 800); // Advance step every 800ms
    } else {
      setProcessingStepIdx(0);
    }
    return () => clearInterval(interval);
  }, [state]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setAudioUrl(null);
    setState('uploaded');
    setResult(null);
    setErrorMsg(null);
  };

  const runJob = async (jobRoute: ProcessingRoute) => {
    if (!file) return;

    let currentUrl = audioUrl;
    
    // Upload file if not already uploaded
    if (!currentUrl) {
      setState('uploading');
      setErrorMsg(null);
      setResult(null);
      try {
        currentUrl = await mockUploadFile(file, setUploadProgress);
        setAudioUrl(currentUrl);
      } catch (err: any) {
        setErrorMsg("アップロードに失敗しました。");
        setState('error');
        return;
      }
    }

    setState('processing');
    setErrorMsg(null);
    setResult(null);

    try {
      const request: MasterJobRequest = {
        audio_url: currentUrl,
        route: jobRoute,
        target_lufs: targetLufs,
        target_true_peak: targetTruePeak,
        manual_params: jobRoute === 'dsp_only' ? manualParams : null,
      };

      const response = await mockSubmitMasteringJob(request);

      if (response.error) {
        throw new Error(response.error);
      }

      setResult(response);
      setState('completed');
      setRoute(jobRoute); // Sync UI state with the job that just ran

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "処理中に予期せぬエラーが発生しました。");
      setState('error');
    }
  };

  const handleStartProcessing = () => runJob(route);

  const handleDownload = () => {
    if (result?.type === 'audio/wav' && result.data instanceof Blob) {
      const url = URL.createObjectURL(result.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file?.name.replace(/\.[^/.]+$/, "")}_mastered.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const resetApp = () => {
    setState('idle');
    setFile(null);
    setAudioUrl(null);
    setResult(null);
    setUploadProgress(0);
  };

  return (
    <div className="min-h-screen bg-background text-zinc-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">マスタリングコンソール</h1>
          <p className="text-zinc-400">楽曲をアップロードして、Concertmaster AIにお任せください。</p>
        </div>

        {/* Main Card */}
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Top Section: Upload or File Info */}
          <div className="p-6 border-b border-border bg-zinc-900/30">
            {state === 'idle' || state === 'error' ? (
              <UploadDropzone onFileSelect={handleFileSelect} disabled={state === 'uploading' || state === 'processing'} />
            ) : (
              <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/20 text-primary rounded-lg">
                    <FileAudio size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-white truncate max-w-[200px] sm:max-w-xs">{file?.name}</p>
                    <p className="text-xs text-zinc-500">{(file?.size || 0) / (1024 * 1024) > 1 ? `${((file?.size || 0) / (1024 * 1024)).toFixed(2)} MB` : `${((file?.size || 0) / 1024).toFixed(2)} KB`}</p>
                  </div>
                </div>
                {state === 'uploaded' && (
                  <button onClick={resetApp} className="text-sm text-zinc-400 hover:text-white transition-colors">
                    ファイルを変更
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Settings Section (Only show if file is uploaded and not processing/completed) */}
          {(state === 'uploaded' || state === 'error') && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Mode Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-zinc-300">処理モード</label>
                  <div className="space-y-2">
                    {[
                      { id: 'full', label: '標準マスタリング', desc: 'AI分析とDSP処理を全自動で実行' },
                      { id: 'analyze_only', label: '分析のみ', desc: '楽曲のオーディオ指標を取得' },
                      { id: 'dsp_only', label: '高度なDSP設定', desc: 'マニュアルでパラメータを制御' }
                    ].map((mode) => (
                      <label key={mode.id} className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all ${route === mode.id ? 'border-primary bg-primary/10' : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900/50'}`}>
                        <input 
                          type="radio" 
                          name="route" 
                          value={mode.id} 
                          checked={route === mode.id} 
                          onChange={(e) => setRoute(e.target.value as ProcessingRoute)}
                          className="mt-1 sr-only" 
                        />
                        <div className="ml-2">
                          <div className={`text-sm font-medium ${route === mode.id ? 'text-primary' : 'text-zinc-200'}`}>{mode.label}</div>
                          <div className="text-xs text-zinc-500">{mode.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Targets */}
                <div className="md:col-span-2 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300 flex justify-between">
                        目標 LUFS <span className="text-zinc-500">{targetLufs} LUFS</span>
                      </label>
                      <input 
                        type="range" min="-24" max="-6" step="0.1" 
                        value={targetLufs} onChange={(e) => setTargetLufs(parseFloat(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300 flex justify-between">
                        目標 True Peak <span className="text-zinc-500">{targetTruePeak} dBTP</span>
                      </label>
                      <input 
                        type="range" min="-3" max="-0.1" step="0.1" 
                        value={targetTruePeak} onChange={(e) => setTargetTruePeak(parseFloat(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>
                  </div>

                  {/* Advanced Settings Toggle */}
                  <div className="border-t border-zinc-800 pt-4">
                    <button 
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      <Settings2 size={16} className="mr-2" />
                      詳細設定
                      {showAdvanced ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                    </button>
                    
                    {showAdvanced && (
                      <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="deliberation_mode"
                            checked={route === 'deliberation_only'}
                            onChange={(e) => setRoute(e.target.checked ? 'deliberation_only' : 'full')}
                            className="rounded border-zinc-700 bg-zinc-900 text-primary focus:ring-primary"
                          />
                          <label htmlFor="deliberation_mode" className="text-sm text-zinc-300">
                            開発者向け: AI合議のみ (DSPレンダリングをスキップ)
                          </label>
                        </div>
                        
                        {route === 'dsp_only' && (
                          <DspParamsEditor params={manualParams} onChange={setManualParams} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action / Status Bar */}
          <div className="p-6 bg-zinc-950 border-t border-border flex flex-col items-center justify-center min-h-[100px]">
            
            {state === 'uploaded' && (
              <button 
                onClick={handleStartProcessing}
                className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-full font-semibold flex items-center justify-center transition-all transform hover:scale-105"
              >
                <Play size={18} className="mr-2 fill-current" />
                マスタリング開始
              </button>
            )}

            {state === 'uploading' && (
              <div className="w-full max-w-md space-y-2 text-center">
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>アップロード中...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}

            {state === 'processing' && (
              <div className="flex flex-col items-center space-y-4 text-primary w-full max-w-md">
                <Loader2 size={32} className="animate-spin" />
                <div className="text-center w-full">
                  <p className="text-sm font-medium text-white mb-2">{PROCESSING_STEPS[processingStepIdx]}</p>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${((processingStepIdx + 1) / PROCESSING_STEPS.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {state === 'error' && (
              <div className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex flex-col items-center text-center space-y-3">
                <div className="flex items-center text-red-400">
                  <AlertCircle size={20} className="mr-2" />
                  <span className="font-medium">処理に失敗しました</span>
                </div>
                <p className="text-sm text-red-300/80">{errorMsg}</p>
                <button onClick={() => setState('uploaded')} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-sm transition-colors">
                  再試行
                </button>
              </div>
            )}

            {state === 'completed' && result?.type === 'audio/wav' && (
              <div className="flex flex-col items-center space-y-6 w-full">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center text-green-400 mb-2">
                    <CheckCircle2 size={28} className="mr-2" />
                    <span className="text-xl font-bold">マスタリング完了</span>
                  </div>
                  {route === 'full' && (
                    <div className="flex items-start mt-3 bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg max-w-md text-left">
                      <BrainCircuit size={20} className="text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <p className="text-sm text-zinc-300 leading-relaxed">
                        このマスターは、音源分析結果をもとにAI合議システムがDSP方針を決定し、レンダリングされました。
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-3 w-full max-w-md mx-auto">
                  <button 
                    onClick={handleDownload}
                    className="w-full px-6 py-4 bg-secondary hover:bg-cyan-400 text-zinc-950 rounded-xl font-bold flex items-center justify-center transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  >
                    <Download size={20} className="mr-2" />
                    マスタリング済みWAVをダウンロード
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setState('uploaded')}
                      className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium flex items-center justify-center transition-colors text-sm"
                    >
                      <Sliders size={16} className="mr-2" />
                      数値を変えてリマスタリング
                    </button>

                    <button 
                      onClick={() => runJob('deliberation_only')}
                      className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium flex items-center justify-center transition-colors text-sm"
                    >
                      <BrainCircuit size={16} className="mr-2" />
                      合議結果をみる
                    </button>
                  </div>

                  <button 
                    onClick={resetApp} 
                    className="w-full px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl font-medium flex items-center justify-center transition-colors text-sm"
                  >
                    <FileAudio size={16} className="mr-2" />
                    別の曲を処理する
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Display (JSON) */}
        {state === 'completed' && result?.type === 'application/json' && (
          <div className="mt-8">
            {route === 'analyze_only' && <AnalysisResultView data={result.data as AnalysisResult} />}
            {route === 'deliberation_only' && <DeliberationResultView data={result.data as DeliberationOutput} />}
            
            <div className="mt-8 flex flex-wrap justify-center gap-4">
               <button 
                 onClick={() => setState('uploaded')} 
                 className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full font-medium transition-colors flex items-center"
               >
                  <Sliders size={16} className="mr-2" />
                  数値を変えて再設定
                </button>
               <button 
                 onClick={() => runJob('full')} 
                 className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-full font-medium transition-colors flex items-center"
               >
                  <Play size={16} className="mr-2 fill-current" />
                  この設定でマスタリングを実行
                </button>
               <button 
                 onClick={resetApp} 
                 className="px-6 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full font-medium transition-colors flex items-center"
               >
                  <FileAudio size={16} className="mr-2" />
                  別の曲を処理する
                </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
