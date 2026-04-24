import React from 'react';
import { Waves, Zap, Sliders, ShieldCheck, ArrowRight, Volume2, Mic2, Maximize2 } from 'lucide-react';

interface HomeProps {
  onNavigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background text-zinc-50 selection:bg-primary/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-[100px] rounded-full mix-blend-screen"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
              プロフェッショナルなマスタリングを、
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              AI合議の力で。
            </span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed">
            WhitePrint は単一のAI判断ではなく、複数のAI視点による合議でマスタリング方針を決定します。音圧、帯域バランス、ステレオ感、質感を総合的に評価し、過剰な処理を避けながら、配信に適した自然なマスターを生成します。
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => onNavigate('/mastering')}
              className="px-8 py-4 bg-white text-black hover:bg-zinc-200 rounded-full font-bold text-lg flex items-center transition-transform hover:scale-105"
            >
              無料で試す <ArrowRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* AI Deliberation Section (The 3 Judges) */}
      <div className="py-24 bg-background border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">単一AIではなく、AI合議で方針を決定</h2>
            <p className="mt-4 text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              1つのAIが一方的に処理を決めるのではなく、複数のAI視点で音源を評価します。ラウドネス、ダイナミクス、帯域バランス、ステレオ感、質感リスクを総合的に判断し、最終的なDSPパラメータを統合します。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 hover:border-zinc-600 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                <Volume2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1. Loudness Judge</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                LUFS、True Peak、ダイナミクスを評価。過剰な音圧処理を避け、配信プラットフォームに最適な音量感を提案します。
              </p>
            </div>

            <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 hover:border-zinc-600 transition-colors">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6">
                <Mic2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">2. Tone Judge</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                低域、低中域、中域、高域、Air感を評価。楽曲の特性を活かしつつ、不自然なEQを避けたバランス調整を行います。
              </p>
            </div>

            <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 hover:border-zinc-600 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-6">
                <Maximize2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">3. Space Judge</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                ステレオ幅、低域のモノ互換、相関を評価。広がりを与えつつも、モノラル再生時の破綻を防ぐ安全な処理を導き出します。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Flow Section */}
      <div className="py-24 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">処理フロー</h2>
            <p className="mt-4 text-zinc-400">楽曲ごとに最適化される4つのステップ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-card p-6 rounded-2xl border border-border relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-zinc-800 text-white rounded-full flex items-center justify-center font-bold text-sm border border-zinc-700">1</div>
              <h3 className="text-lg font-bold text-white mb-2 mt-2">Audio Analysis</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                楽曲のLUFS、True Peak、ダイナミクス、ステレオ幅、帯域バランスを分析します。
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(139,92,246,0.5)]">2</div>
              <h3 className="text-lg font-bold text-white mb-2 mt-2">AI Deliberation</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                複数のAI視点がマスタリング方針を提案し、最適なDSPパラメータに統合します。
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-zinc-800 text-white rounded-full flex items-center justify-center font-bold text-sm border border-zinc-700">3</div>
              <h3 className="text-lg font-bold text-white mb-2 mt-2">DSP Mastering</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                決定されたパラメータを使って、14段のDSPチェーンでWAVを生成します。
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-zinc-800 text-white rounded-full flex items-center justify-center font-bold text-sm border border-zinc-700">4</div>
              <h3 className="text-lg font-bold text-white mb-2 mt-2">Download</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                配信用に整えられたマスタリング済みWAVをダウンロードできます。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="py-16 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-zinc-500 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
            <ShieldCheck size={16} className="text-green-500" />
            <span>プライバシー保護: アップロードされた音声ファイルは処理後に自動で削除されます。</span>
          </div>
        </div>
      </div>
    </div>
  );
};
