import React from 'react';
import { DeliberationOutput } from '../types';
import { BrainCircuit, Target } from 'lucide-react';

interface Props {
  data: DeliberationOutput;
}

export const DeliberationResultView: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <BrainCircuit className="mr-2 text-primary" />
          AI合議結果
        </h3>
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed">
        AI合議では、複数のエージェントが個別にDSP方針を提案し、その結果を統合して最終的な adopted_params を決定します。
      </p>

      {data.strategy && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-primary mb-2 flex items-center">
            <Target size={16} className="mr-2" />
            マスタリング戦略
          </h4>
          <p className="text-zinc-300 text-sm leading-relaxed">{data.strategy}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">目標 LUFS</div>
          <div className="text-xl font-bold text-white">{data.target_lufs}</div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">目標 True Peak</div>
          <div className="text-xl font-bold text-white">{data.target_true_peak}</div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">採用されたDSPパラメータ (Adopted Params)</h4>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-900 border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3">パラメータ</th>
                <th className="px-4 py-3 text-right">値</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {Object.entries(data.adopted_params).map(([key, value]) => (
                <tr key={key} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-2 font-medium text-zinc-300">{key.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-2 text-right text-secondary font-mono">{Number(value).toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
