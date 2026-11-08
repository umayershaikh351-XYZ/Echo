import React, { useEffect } from 'react';
import { Trophy, Star, ArrowRight, RotateCcw, Layers } from 'lucide-react';
import { audio } from '../game/audio';

interface VictoryModalProps {
  levelId: number;
  levelTitle: string;
  score: number;
  stars: number;
  onNextLevel: () => void;
  onRestart: () => void;
  onLevelSelect: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  levelId,
  levelTitle,
  score,
  stars,
  onNextLevel,
  onRestart,
  onLevelSelect,
}) => {
  const isFinalLevel = levelId >= 5;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        audio.playButtonClick();
        onNextLevel();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onNextLevel]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/90 backdrop-blur-none select-none">
      <div className="w-full max-w-sm rounded-2xl bg-[#080d16] border border-cyan-500/50 p-6 text-slate-100 shadow-[0_0_40px_rgba(6,182,212,0.2)] flex flex-col gap-4 text-center">
        {/* Trophy & Header */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-2">
            <Trophy className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-cyber tracking-widest text-cyan-400 uppercase font-bold">
            DISTRICT CLEARED
          </span>
          <h2 className="text-2xl font-cyber font-extrabold text-white tracking-wide">
            {levelTitle}
          </h2>
          <p className="text-xs font-cyber text-slate-400 mt-1">
            Surveillance perimeter breached successfully.
          </p>
        </div>

        {/* Stars */}
        <div className="flex justify-center items-center gap-2 py-1">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className={`w-7 h-7 ${
                starIdx <= stars ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'text-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Score Readout */}
        <div className="bg-slate-950/80 border border-slate-900 rounded-xl p-3 flex justify-around">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-cyber text-slate-500 uppercase">FINAL SCORE</span>
            <span className="font-cyber font-bold text-2xl text-amber-400 tabular-nums">
              {score.toString().padStart(5, '0')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 mt-1">
          <button
            data-start="true"
            onClick={() => {
              audio.playButtonClick();
              onNextLevel();
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-cyber font-bold text-sm tracking-wider uppercase transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            <span>{isFinalLevel ? 'EXECUTE FREEDOM PROTOCOL' : 'NEXT DISTRICT'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              audio.playButtonClick();
              onRestart();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-cyber font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>REPLAY DISTRICT</span>
          </button>

          <button
            onClick={() => {
              audio.playButtonClick();
              onLevelSelect();
            }}
            className="w-full py-2 px-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-900 text-slate-400 hover:text-slate-200 font-cyber font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>DISTRICT SELECT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
