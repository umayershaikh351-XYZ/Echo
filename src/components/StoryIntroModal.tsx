import React, { useEffect } from 'react';
import { Play, ShieldAlert } from 'lucide-react';
import { LevelData } from '../game/types';
import { audio } from '../game/audio';

interface StoryIntroModalProps {
  level: LevelData;
  onStart: () => void;
}

export const StoryIntroModal: React.FC<StoryIntroModalProps> = ({ level, onStart }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        audio.playButtonClick();
        onStart();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onStart]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-none select-none">
      <div className="w-full max-w-lg rounded-2xl bg-[#090d16] border border-cyan-500/40 p-6 sm:p-8 text-slate-100 shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col gap-5">
        {/* Header Kicker */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-cyber font-bold tracking-widest text-cyan-400">
            <ShieldAlert className="w-4 h-4" />
            <span>{level.story.chapter}</span>
          </div>
          <span className="text-[11px] font-cyber text-slate-400 uppercase tracking-wider">
            {level.story.environment}
          </span>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-cyber font-extrabold text-white tracking-wide">
            {level.story.title}
          </h2>
          <div className="text-xs font-cyber text-slate-400 mt-0.5">
            SECTOR DIFFICULTY: <strong className="text-slate-200">{level.difficulty}</strong>
          </div>
        </div>

        {/* Narrative Prose */}
        <div className="text-sm font-cyber text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <p className="mb-2.5">{level.story.briefing}</p>
          <div className="text-xs text-cyan-400 border-t border-slate-800 pt-2 font-medium">
            MISSION DIRECTIVE: {level.story.objective}
          </div>
        </div>

        {/* Action Button */}
        <button
          data-start="true"
          onClick={() => {
            audio.playButtonClick();
            onStart();
          }}
          className="w-full py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-cyber font-extrabold text-base tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-95"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>START RUN (SPACE / ENTER)</span>
        </button>
      </div>
    </div>
  );
};
