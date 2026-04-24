import React from 'react';
import { DspParams } from '../types';
import { DSP_PARAM_RANGES } from '../constants';
import { SliderControl } from './ui/SliderControl';

interface DspParamsEditorProps {
  params: DspParams;
  onChange: (params: DspParams) => void;
}

export const DspParamsEditor: React.FC<DspParamsEditorProps> = ({ params, onChange }) => {
  const updateParam = (key: keyof DspParams, value: number) => {
    onChange({ ...params, [key]: value });
  };

  const renderSlider = (key: keyof DspParams, label: string, unit: string = '') => {
    const range = DSP_PARAM_RANGES[key];
    return (
      <SliderControl
        key={key}
        label={label}
        value={params[key]}
        min={range.min}
        max={range.max}
        step={range.step}
        onChange={(val) => updateParam(key, val)}
        unit={unit}
      />
    );
  };

  return (
    <div className="space-y-6 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
      <h3 className="text-sm font-semibold text-primary mb-4">マニュアルDSP設定</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b border-zinc-800 pb-1">ゲイン & EQ</h4>
          {renderSlider('input_gain_db', 'Input Gain', 'dB')}
          {renderSlider('eq_low_shelf_gain_db', 'Low Shelf', 'dB')}
          {renderSlider('eq_low_mid_gain_db', 'Low Mid', 'dB')}
          {renderSlider('eq_high_mid_gain_db', 'High Mid', 'dB')}
          {renderSlider('eq_high_shelf_gain_db', 'High Shelf', 'dB')}
          {renderSlider('dyn_eq_enabled', 'Dynamic EQ (0=Off, 1=On)')}
        </div>

        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b border-zinc-800 pb-1">ダイナミクス</h4>
          {renderSlider('comp_threshold_db', 'Comp Threshold', 'dB')}
          {renderSlider('comp_ratio', 'Comp Ratio', ':1')}
          {renderSlider('comp_attack_sec', 'Comp Attack', 's')}
          {renderSlider('comp_release_sec', 'Comp Release', 's')}
          {renderSlider('limiter_ceil_db', 'Limiter Ceiling', 'dB')}
          {renderSlider('parallel_wet', 'Parallel Comp Mix')}
        </div>

        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b border-zinc-800 pb-1">サチュレーション</h4>
          {renderSlider('transformer_saturation', 'Transformer Sat')}
          {renderSlider('transformer_mix', 'Transformer Mix')}
          {renderSlider('triode_drive', 'Triode Drive')}
          {renderSlider('triode_bias', 'Triode Bias')}
          {renderSlider('triode_mix', 'Triode Mix')}
          {renderSlider('tape_saturation', 'Tape Saturation')}
          {renderSlider('tape_mix', 'Tape Mix')}
        </div>

        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b border-zinc-800 pb-1">ステレオ & M/S</h4>
          {renderSlider('ms_side_high_gain_db', 'M/S Side High', 'dB')}
          {renderSlider('ms_mid_low_gain_db', 'M/S Mid Low', 'dB')}
          {renderSlider('stereo_low_mono', 'Low Mono (0=Off, 1=On)')}
          {renderSlider('stereo_high_wide', 'High Wide')}
          {renderSlider('stereo_width', 'Global Width')}
        </div>
      </div>
    </div>
  );
};
