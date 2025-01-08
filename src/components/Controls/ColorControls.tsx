import React from 'react';
import { Palette, RotateCcw } from 'lucide-react';

interface ColorControlsProps {
  colors: {
    sphere: string;
    ring1: string;
    ring2: string;
    ring3: string;
    particles: string;
  };
  onChange: (colors: {
    sphere: string;
    ring1: string;
    ring2: string;
    ring3: string;
    particles: string;
  }) => void;
  className?: string;
}

const defaultColors = {
  sphere: '#00a2ff',
  ring1: '#00a2ff',
  ring2: '#0066ff',
  ring3: '#4338ca',
  particles: '#4338ca'
};

export function ColorControls({ colors, onChange, className = '' }: ColorControlsProps) {
  return (
    <div className={`bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 w-72 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-white/80">
          <Palette className="w-5 h-5" />
          <span className="text-base font-medium">Color Controls</span>
        </div>
        <button
          onClick={() => onChange(defaultColors)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/80 transition-colors text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
      
      <div className="space-y-4">
        {[
          { label: 'Sphere Color', key: 'sphere' },
          { label: 'Inner Ring', key: 'ring1' },
          { label: 'Middle Ring', key: 'ring2' },
          { label: 'Outer Ring', key: 'ring3' },
          { label: 'Particles', key: 'particles' }
        ].map(({ label, key }) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-white/70">{label}</label>
              <input
                type="text"
                value={colors[key as keyof typeof colors]}
                onChange={(e) => onChange({ ...colors, [key]: e.target.value })}
                className="bg-transparent text-white/60 text-sm font-mono w-20 text-right focus:outline-none focus:text-white/90"
              />
            </div>
            <div className="relative">
              <input
                type="color"
                value={colors[key as keyof typeof colors]}
                onChange={(e) => onChange({ ...colors, [key]: e.target.value })}
                className="w-full h-10 rounded-lg cursor-none bg-transparent border border-white/10"
              />
              <div 
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  background: `linear-gradient(to right, ${colors[key as keyof typeof colors]}00, ${colors[key as keyof typeof colors]})`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}