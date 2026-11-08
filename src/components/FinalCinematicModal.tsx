import React, { useEffect, useState } from 'react';
import { RotateCcw, PowerOff, ShieldCheck } from 'lucide-react';
import { audio } from '../game/audio';

interface FinalCinematicModalProps {
  onPlayAgain: () => void;
  finalScore: number;
}

export const FinalCinematicModal: React.FC<FinalCinematicModalProps> = ({
  onPlayAgain,
  finalScore,
}) => {
  const [phase, setPhase] = useState<'blackout' | 'broken' | 'credits'>('blackout');

  useEffect(() => {
    // Cinematic step sequence:
    // 0s - blackout triggers
    // 2.2s - "THE GRID IS BROKEN"
    // 5.0s - "THANK YOU FOR PLAYING / DEVELOPED BY UMAYER SHAIKH"
    const timer1 = setTimeout(() => {
      setPhase('broken');
      audio.playLaserZap();
    }, 2200);

    const timer2 = setTimeout(() => {
      setPhase('credits');
      audio.playVictory();
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black text-white select-none overflow-hidden transition-all duration-1000">
      {/* Background fading power grid effect */}
      <div className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${phase === 'blackout' ? 'opacity-80' : 'opacity-10'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-black to-black" />
      </div>

      <div className="relative z-10 w-full max-w-xl text-center flex flex-col items-center gap-6">
        {phase === 'blackout' && (
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <PowerOff className="w-12 h-12 text-rose-500 animate-spin" style={{ animationDuration: '3s' }} />
            <div className="font-cyber font-bold tracking-[0.3em] text-sm text-slate-400 uppercase">
              OVERRIDING CENTRAL SURVEILLANCE CORE...
            </div>
            <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 w-full animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        )}

        {(phase === 'broken' || phase === 'credits') && (
          <div className="flex flex-col items-center gap-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-2 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <ShieldCheck className="w-8 h-8" />
            </div>

            {/* THE GRID IS BROKEN */}
            <div className="text-xs font-cyber tracking-[0.4em] text-cyan-400 font-semibold">
              TRANSMISSION BROADCAST STATEWIDE
            </div>

            <h1 className="font-cyber font-black text-4xl sm:text-6xl md:text-7xl tracking-wider text-white uppercase glow-cyan">
              THE GRID IS BROKEN.
            </h1>

            <p className="font-cyber text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              The city-wide surveillance monolith has collapsed. Echo’s final leap exposed the truth to millions.
            </p>
          </div>
        )}

        {phase === 'credits' && (
          <div className="flex flex-col items-center gap-5 mt-4 pt-6 border-t border-slate-900 w-full max-w-md animate-fadeIn">
            <div>
              <h2 className="font-cyber font-extrabold text-2xl sm:text-3xl tracking-wide text-slate-100 uppercase">
                THANK YOU FOR PLAYING
              </h2>
              <div className="font-cyber text-sm tracking-widest text-slate-400 mt-1 uppercase">
                DEVELOPED BY <span className="text-cyan-400 font-bold text-base">UMAYER SHAIKH</span>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-900 rounded-xl px-6 py-2.5 flex items-center justify-between w-full max-w-xs">
              <span className="text-xs font-cyber text-slate-400 uppercase">TOTAL RUN SCORE</span>
              <span className="font-cyber font-bold text-xl text-amber-400 tabular-nums">
                {finalScore.toString().padStart(6, '0')}
              </span>
            </div>

            <button
              data-start="true"
              onClick={() => {
                audio.playButtonClick();
                onPlayAgain();
              }}
              className="py-3.5 px-8 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-cyber font-extrabold text-base tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>PLAY AGAIN</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
