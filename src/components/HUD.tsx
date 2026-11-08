import React from 'react';
import { Pause, Volume2, VolumeX } from 'lucide-react';
import { LevelData } from '../game/types';

interface HUDProps {
  level: LevelData;
  score: number;
  progressPercent: number;
  distanceMeters: number;
  speed: number;
  isMuted: boolean;
  onPause: () => void;
  onToggleMute: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  level,
  score,
  progressPercent,
  distanceMeters,
  speed,
  isMuted,
  onPause,
  onToggleMute,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 md:p-6 select-none">
      {/* Top Bar Cluster */}
      <div className="flex items-start justify-between w-full">
        {/* Left: Level & Objective */}
        <div className="flex flex-col gap-1 bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5 px-3.5 backdrop-blur-none pointer-events-auto">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: level.accentColor }}
            />
            <span className="font-cyber font-bold tracking-wider text-xs md:text-sm text-slate-200 uppercase">
              {level.title}
            </span>
          </div>
          <div className="text-[11px] font-cyber text-slate-400 tracking-wide">
            {level.subtitle}
          </div>
        </div>

        {/* Center: Distance Progress Bar */}
        <div className="hidden sm:flex flex-col items-center gap-1 min-w-[200px] max-w-[320px] bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5 px-4 pointer-events-auto">
          <div className="flex justify-between w-full text-[11px] font-cyber font-semibold tracking-wider text-slate-300">
            <span>GRID PROGRESS</span>
            <span className="tabular-nums text-cyan-400">
              {Math.round(progressPercent * 100)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full transition-all duration-75 rounded-full"
              style={{
                width: `${Math.max(2, progressPercent * 100)}%`,
                backgroundColor: level.accentColor,
                boxShadow: `0 0 8px ${level.accentColor}`,
              }}
            />
          </div>
          <div className="text-[10px] font-cyber text-slate-500 tabular-nums">
            {distanceMeters}m / {Math.round(level.finishX / 10)}m
          </div>
        </div>

        {/* Right: Score, Speed & Utility Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2 px-3 flex flex-col items-end">
            <span className="text-[10px] font-cyber tracking-wider text-slate-400 uppercase">
              SCORE
            </span>
            <span className="font-cyber font-bold text-base md:text-lg tabular-nums text-amber-400">
              {score.toString().padStart(5, '0')}
            </span>
          </div>

          <div className="hidden md:flex bg-slate-950/70 border border-slate-800/80 rounded-lg p-2 px-3 flex-col items-end">
            <span className="text-[10px] font-cyber tracking-wider text-slate-400 uppercase">
              VELOCITY
            </span>
            <span className="font-cyber font-bold text-base tabular-nums text-cyan-400">
              {speed} <span className="text-[10px] text-slate-500">PX/S</span>
            </span>
          </div>

          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="w-10 h-10 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <button
            onClick={onPause}
            aria-label="Pause Game"
            className="w-10 h-10 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Pause className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Area: Reserved for Mobile Controls / Clean Playfield */}
      <div className="w-full flex justify-between items-end pointer-events-none">
        {/* Mobile progress fallback if screen is small */}
        <div className="sm:hidden flex items-center gap-2 bg-slate-950/75 border border-slate-800/80 rounded-lg px-2.5 py-1 text-xs font-cyber text-slate-300 pointer-events-auto">
          <span>PROGRESS</span>
          <span className="tabular-nums text-cyan-400 font-bold">
            {Math.round(progressPercent * 100)}%
          </span>
        </div>

        {/* Desktop Controls Hint in safe area */}
        <div className="hidden lg:block text-slate-500 text-xs font-cyber tracking-wider opacity-70">
          A / D or Arrows : RUN · SPACE : JUMP · S : SLIDE · SHIFT : SPRINT · ESC : PAUSE
        </div>
      </div>
    </div>
  );
};
