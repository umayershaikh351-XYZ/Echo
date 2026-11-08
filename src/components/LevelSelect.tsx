import React from 'react';
import { ArrowLeft, Lock, Play, Star, CheckCircle } from 'lucide-react';
import { LEVELS } from '../game/levels';
import { audio } from '../game/audio';

interface LevelSelectProps {
  unlockedLevel: number;
  completedLevels: number[];
  highScores: Record<number, number>;
  starsEarned: Record<number, number>;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  unlockedLevel,
  completedLevels,
  highScores,
  starsEarned,
  onSelectLevel,
  onBack,
}) => {
  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-[#05070d] text-slate-100 p-4 sm:p-6 md:p-8 select-none overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto pb-4 border-b border-slate-900 shrink-0">
        <button
          onClick={() => {
            audio.playButtonClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors text-sm font-cyber font-semibold tracking-wider active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO MENU</span>
        </button>

        <div className="text-right">
          <h2 className="text-xl sm:text-2xl font-cyber font-extrabold text-white tracking-wide">
            DISTRICT SELECT
          </h2>
          <p className="text-xs font-cyber text-slate-400">
            ESCAPING THE GRID · 5 DISTRICTS
          </p>
        </div>
      </div>

      {/* 5 Level Cards Grid */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 py-6 content-start">
        {LEVELS.map((level) => {
          const isUnlocked = level.id <= unlockedLevel;
          const isCompleted = completedLevels.includes(level.id);
          const bestScore = highScores[level.id] || 0;
          const stars = starsEarned[level.id] || 0;

          return (
            <div
              key={level.id}
              className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 bg-[#090d16] min-h-[220px] ${
                isUnlocked
                  ? 'border-slate-800 hover:border-cyan-500/60 shadow-lg hover:shadow-cyan-500/10'
                  : 'border-slate-900/60 opacity-60'
              }`}
            >
              {/* Top Card Info */}
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-cyber font-bold tracking-widest text-slate-400 uppercase">
                    SECTOR {level.id.toString().padStart(2, '0')}
                  </span>
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-[11px] font-cyber font-bold text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" /> ESCAPED
                    </span>
                  ) : !isUnlocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-cyber font-semibold text-slate-500">
                      <Lock className="w-3.5 h-3.5" /> LOCKED
                    </span>
                  ) : (
                    <span className="text-[11px] font-cyber font-semibold text-cyan-400">
                      ACTIVE OBJECTIVE
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-cyber font-bold text-white tracking-wide">
                  {level.title}
                </h3>
                <p className="text-xs font-cyber text-slate-400 mb-3">
                  {level.subtitle}
                </p>

                {/* Difficulty & Stars */}
                <div className="flex items-center justify-between text-xs font-cyber text-slate-400 py-2 border-y border-slate-900 my-2">
                  <span>DIFFICULTY: <strong className="text-slate-200">{level.difficulty}</strong></span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-3.5 h-3.5 ${
                          starIdx <= stars ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Best Score */}
                <div className="flex justify-between items-center text-xs font-cyber text-slate-400 mb-4">
                  <span>BEST SCORE</span>
                  <span className="font-bold text-amber-400 tabular-nums">
                    {bestScore.toString().padStart(5, '0')}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {isUnlocked ? (
                <button
                  onClick={() => {
                    audio.playButtonClick();
                    onSelectLevel(level.id);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-slate-950 font-cyber font-bold text-sm tracking-wider uppercase transition-colors flex items-center justify-center gap-2 active:scale-95"
                >
                  <Play className="w-4 h-4" />
                  <span>{isCompleted ? 'REPLAY SECTOR' : 'INFILTRATE'}</span>
                </button>
              ) : (
                <div className="w-full py-2.5 px-4 rounded-xl bg-slate-900/40 border border-slate-900 text-slate-600 font-cyber font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  <span>CLEAR PREVIOUS SECTOR</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Hint */}
      <div className="w-full max-w-5xl mx-auto pt-2 text-center text-xs font-cyber text-slate-500">
        All 5 sectors must be completed sequentially to unlock the final Freedom Protocol.
      </div>
    </div>
  );
};
