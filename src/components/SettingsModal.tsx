import React from 'react';
import { X, Volume2, VolumeX, Sparkles, Smartphone, Trash2 } from 'lucide-react';
import { UserProgress } from '../game/types';
import { audio } from '../game/audio';

interface SettingsModalProps {
  progress: UserProgress;
  onUpdateProgress: (updated: Partial<UserProgress>) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  progress,
  onUpdateProgress,
  onResetProgress,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-none select-none">
      <div className="w-full max-w-md rounded-2xl bg-[#090d16] border border-slate-800 p-6 text-slate-100 shadow-2xl flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xl font-cyber font-bold text-white tracking-wide">
            SETTINGS & AUDIO
          </h2>
          <button
            onClick={() => {
              audio.playButtonClick();
              onClose();
            }}
            aria-label="Close Settings"
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options List */}
        <div className="flex flex-col gap-4">
          {/* Master Audio Toggle */}
          <div className="flex items-center justify-between py-2 border-b border-slate-900">
            <div className="flex items-center gap-3">
              {progress.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-cyan-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-rose-400" />
              )}
              <div>
                <div className="text-sm font-cyber font-semibold text-slate-200">
                  MASTER SOUND & MUSIC
                </div>
                <div className="text-xs font-cyber text-slate-500">
                  Procedural synth audio & dynamic soundtrack
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                const next = !progress.soundEnabled;
                onUpdateProgress({ soundEnabled: next });
                audio.setMuted(!next);
                audio.playButtonClick();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-cyber font-bold tracking-wider transition-colors ${
                progress.soundEnabled
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {progress.soundEnabled ? 'ENABLED' : 'MUTED'}
            </button>
          </div>

          {/* SFX Volume Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-cyber text-slate-300">
              <span>SFX VOLUME</span>
              <span className="text-cyan-400 font-bold tabular-nums">
                {Math.round(progress.soundVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={progress.soundVolume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onUpdateProgress({ soundVolume: val });
                audio.setVolumes(val, progress.musicVolume);
              }}
              className="w-full accent-cyan-400 h-1.5 bg-slate-900 rounded-lg cursor-pointer"
            />
          </div>

          {/* Music Volume Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-cyber text-slate-300">
              <span>MUSIC VOLUME</span>
              <span className="text-cyan-400 font-bold tabular-nums">
                {Math.round(progress.musicVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={progress.musicVolume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onUpdateProgress({ musicVolume: val });
                audio.setVolumes(progress.soundVolume, val);
              }}
              className="w-full accent-cyan-400 h-1.5 bg-slate-900 rounded-lg cursor-pointer"
            />
          </div>

          {/* Mobile Touch Overlay Toggle */}
          <div className="flex items-center justify-between py-2 border-b border-slate-900">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-sm font-cyber font-semibold text-slate-200">
                  ON-SCREEN TOUCH BUTTONS
                </div>
                <div className="text-xs font-cyber text-slate-500">
                  Visible parkour touch controls
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onUpdateProgress({ touchControls: !progress.touchControls });
                audio.playButtonClick();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-cyber font-bold tracking-wider transition-colors ${
                progress.touchControls
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {progress.touchControls ? 'ALWAYS ON' : 'AUTO / OFF'}
            </button>
          </div>

          {/* Particles Toggle */}
          <div className="flex items-center justify-between py-2 border-b border-slate-900">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-sm font-cyber font-semibold text-slate-200">
                  PARTICLE EFFECTS & TRAILS
                </div>
                <div className="text-xs font-cyber text-slate-500">
                  Sparks, landing dust, speed trails
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onUpdateProgress({ particlesEnabled: !progress.particlesEnabled });
                audio.playButtonClick();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-cyber font-bold tracking-wider transition-colors ${
                progress.particlesEnabled
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {progress.particlesEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Reset Save Data */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs font-cyber text-rose-400">
              <Trash2 className="w-4 h-4" />
              <span>RESET PROGRESS</span>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Reset all sector completion and high scores?')) {
                  onResetProgress();
                  audio.playLaserZap();
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-cyber font-semibold transition-colors"
            >
              CLEAR SAVE DATA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
