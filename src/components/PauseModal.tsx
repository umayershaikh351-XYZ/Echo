import React from 'react';
import { Play, RotateCcw, Layers, Volume2, VolumeX } from 'lucide-react';
import { audio } from '../game/audio';

interface PauseModalProps {
  levelTitle: string;
  isMuted: boolean;
  onResume: () => void;
  onRestart: () => void;
  onLevelSelect: () => void;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  levelTitle,
  isMuted,
  onResume,
  onRestart,
  onLevelSelect,
  onToggleMute,
}) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-none select-none">
      <div className="w-full max-w-sm rounded-2xl bg-[#090d16] border border-slate-800 p-6 text-slate-100 shadow-2xl flex flex-col gap-4">
        {/* Title */}
        <div className="text-center pb-2 border-b border-slate-800">
          <span className="text-[11px] font-cyber tracking-widest text-cyan-400 uppercase">
            SIMULATION PAUSED
          </span>
          <h2 className="text-xl font-cyber font-bold text-white tracking-wide">
            {levelTitle}
          </h2>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => {
              audio.playButtonClick();
              onResume();
            }}
            className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-cyber font-bold text-sm tracking-wider uppercase transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>RESUME (ESC / P)</span>
          </button>

          <button
            onClick={() => {
              audio.playButtonClick();
              onRestart();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-cyber font-semibold text-sm tracking-wider uppercase transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>RESTART LEVEL</span>
          </button>

          <button
            onClick={() => {
              audio.playButtonClick();
              onToggleMute();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-cyber font-semibold text-sm tracking-wider uppercase transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            <span>{isMuted ? 'UNMUTE AUDIO' : 'MUTE AUDIO'}</span>
          </button>

          <button
            onClick={() => {
              audio.playButtonClick();
              onLevelSelect();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-900 text-slate-400 hover:text-slate-200 font-cyber font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            <Layers className="w-4 h-4" />
            <span>EXIT TO LEVEL SELECT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
