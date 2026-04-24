import React from 'react';
import { AnalysisResult } from '../types';
import { Activity, Volume2, Maximize, SlidersHorizontal, AlertTriangle } from 'lucide-react';

interface Props {
  data: AnalysisResult;
}

const StatCard = ({ title, value, unit, icon: Icon, highlight = false }: any) => (
  <div className={`p-4 rounded-lg border ${highlight ? 'bg-primary/10 border-primary/30' : 'bg-zinc-900/50 border-zinc-800'}`}>
    <div className="flex items-center text-zinc-400 mb-2">
      <Icon size={16} className="mr-2" />
      <span className="text-xs font-medium uppercase tracking-wider">{title}</span>
    </div>
    <div className="flex items-baseline">
      <span className={`text-2xl font-bold ${highlight ? 'text-primary' : 'text-zinc-100'}`}>
        {typeof value === 'number' ? value.toFixed(2) : value || 'N/A'}
      </span>
      {unit && <span className="ml-1 text-sm text-zinc-500">{unit}</span>}
    </div>
  </div>
);

export const AnalysisResultView: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <Activity className="mr-2 text-secondary" />
          オーディオ分析レポート
        </h3>
        {data.key && data.bpm && (
          <div className="text-sm text-zinc-400 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
            {data.bpm} BPM • {data.key}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Integrated LUFS" value={data.integrated_lufs} unit="LUFS" icon={Volume2} highlight />
        <StatCard title="True Peak" value={data.true_peak_dbtp} unit="dBTP" icon={Maximize} highlight />
        <StatCard title="Loudness Range" value={data.lra_lu} unit="LU" icon={Activity} />
        <StatCard title="PSR" value={data.psr_db} unit="dB" icon={SlidersHorizontal} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">ステレオ音場</h4>
          <div className="grid grid-cols-2 gap-4">
            <StatCard title="Width" value={data.stereo_width} icon={Maximize} />
            <StatCard title="Correlation" value={data.stereo_correlation} icon={Activity} />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">リスク評価</h4>
          <div className="grid grid-cols-2 gap-4">
            <StatCard 
              title="Harshness Risk" 
              value={data.harshness_risk} 
              icon={AlertTriangle} 
              highlight={data.harshness_risk && data.harshness_risk > 0.5}
            />
            <StatCard 
              title="Mud Risk" 
              value={data.mud_risk} 
              icon={AlertTriangle}
              highlight={data.mud_risk && data.mud_risk > 0.5}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">帯域バランス (比率)</h4>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {[
            { label: 'Sub', val: data.sub_ratio },
            { label: 'Bass', val: data.bass_ratio },
            { label: 'Low Mid', val: data.low_mid_ratio },
            { label: 'Mid', val: data.mid_ratio },
            { label: 'High', val: data.high_ratio },
            { label: 'Air', val: data.air_ratio },
          ].map((band) => (
            <div key={band.label} className="bg-zinc-900/50 border border-zinc-800 rounded p-3 text-center">
              <div className="text-xs text-zinc-500 mb-1">{band.label}</div>
              <div className="text-sm font-medium text-zinc-200">
                {band.val ? (band.val * 100).toFixed(1) + '%' : '-'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
