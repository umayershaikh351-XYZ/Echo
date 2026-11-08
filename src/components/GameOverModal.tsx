import React, { useEffect } from 'react';
import { RotateCcw, AlertTriangle, Layers, FastForward } from 'lucide-react';
import { audio } from '../game/audio';

interface GameOverModalProps {
  reason: string;
  score: number;
  hasCheckpoint: boolean;
  onRespawnCheckpoint: () => void;
  onRestart: () => void;
  onLevelSelect: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  reason,
  score,
  hasCheckpoint,
  onRespawnCheckpoint,
  onRestart,
  onLevelSelect,
}) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        audio.playButtonClick();
        if (hasCheckpoint) {
          onRespawnCheckpoint();
        } else {
          onRestart();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [hasCheckpoint, onRespawnCheckpoint, onRestart]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/90 backdrop-blur-none select-none">
      <div className="w-full max-w-sm rounded-2xl bg-[#0d090e] border border-rose-500/40 p-6 text-slate-100 shadow-[0_0_40px_rgba(244,63,94,0.15)] flex flex-col gap-4 text-center">
        {/* Warning Icon & Title */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-2">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-cyber tracking-widest text-rose-400 uppercase font-bold">
            SIGNAL LOST
          </span>
          <h2 className="text-2xl font-cyber font-extrabold text-white tracking-wide">
            RUNNER DETECTED
          </h2>
          <p className="text-xs font-cyber text-slate-400 mt-1">
            {reason}
          </p>
        </div>

        {/* Stats */}
        <div className="bg-slate-950/70 border border-slate-900 rounded-xl p-3 flex justify-around">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-cyber text-slate-500 uppercase">RUN SCORE</span>
            <span className="font-cyber font-bold text-lg text-amber-400 tabular-nums">
              {score.toString().padStart(5, '0')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 mt-1">
          {hasCheckpoint && (
            <button
              data-start="true"
              onClick={() => {
                audio.playButtonClick();
                onRespawnCheckpoint();
              }}
              className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-cyber font-bold text-sm tracking-wider uppercase transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-md"
            >
              <FastForward className="w-4 h-4 fill-slate-950" />
              <span>RESPAWN CHECKPOINT (SPACE)</span>
            </button>
          )}

          <button
            onClick={() => {
              audio.playButtonClick();
              onRestart();
            }}
            className={`w-full py-2.5 px-4 rounded-xl font-cyber font-bold text-sm tracking-wider uppercase transition-colors flex items-center justify-center gap-2 active:scale-95 ${
              !hasCheckpoint
                ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-md'
                : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART SECTOR</span>
          </button>

          <button
            onClick={() => {
              audio.playButtonClick();
              onLevelSelect();
            }}
            className="w-full py-2 px-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-900 text-slate-400 hover:text-slate-200 font-cyber font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            <Layers className="w-4 h-4" />
            <span>DISTRICT SELECT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
