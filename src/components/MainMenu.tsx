import React, { useEffect, useRef } from 'react';
import { Play, Layers, Settings as SettingsIcon, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { drawSilhouetteEcho } from '../game/animation';
import { createInitialPlayerState } from '../game/physics';
import { PlayerState } from '../game/types';
import { audio } from '../game/audio';

interface MainMenuProps {
  onPlay: () => void;
  onLevelSelect: () => void;
  onSettings: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  unlockedLevel: number;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onPlay,
  onLevelSelect,
  onSettings,
  isMuted,
  onToggleMute,
  unlockedLevel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const dummyPlayer: PlayerState = createInitialPlayerState({ x: 0, y: 0 });
    dummyPlayer.animationState = 'running';

    const render = () => {
      time += 0.016;
      dummyPlayer.animTimer = time;
      dummyPlayer.vx = 280;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Floor line
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 110);
      ctx.lineTo(canvas.width, 110);
      ctx.stroke();

      // Glowing reflection
      ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.fillRect(0, 110, canvas.width, 30);

      // Draw Silhouette Runner
      drawSilhouetteEcho(ctx, dummyPlayer, canvas.width / 2 - 12, 54, '#06b6d4');

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Keyboard shortcut: Space or Enter starts game
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        audio.playButtonClick();
        onPlay();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onPlay]);

  return (
    <div className="fixed inset-0 z-30 flex flex-col justify-between items-center bg-[#05060a] text-slate-100 p-6 select-none overflow-hidden">
      {/* Background Cyber City Skyline FX */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-gradient-to-t from-[#05060a] via-transparent to-[#080d1a]" />
        {/* Animated grid lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 30%, rgba(6, 182, 212, 0.15) 0%, transparent 60%), linear-gradient(rgba(30, 41, 59, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 41, 59, 0.15) 1px, transparent 1px)`,
            backgroundSize: '100% 100%, 40px 40px, 40px 40px',
          }}
        />
      </div>

      {/* Top Header Utilities */}
      <div className="relative z-10 w-full max-w-4xl flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs font-cyber tracking-wider text-slate-400">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span>YEAR 2097 · SURVEILLANCE PROTOCOL ACTIVE</span>
        </div>

        <button
          onClick={() => {
            audio.playButtonClick();
            onToggleMute();
          }}
          aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-cyber"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          <span>{isMuted ? 'MUTED' : 'AUDIO ON'}</span>
        </button>
      </div>

      {/* Center Hero: Title Lockup & Animated Silhouette Runner */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center max-w-xl">
        {/* Bespoke SVG Title Lockup */}
        <div className="flex flex-col items-center mb-1">
          <div className="text-[11px] font-cyber tracking-[0.35em] text-cyan-400 uppercase font-semibold mb-2">
            Cinematic 2D Mobile Parkour Action
          </div>

          <h1 className="font-cyber font-black text-5xl sm:text-7xl md:text-8xl tracking-tight text-white leading-none">
            ECHO
          </h1>

          <div className="flex items-center gap-3 w-full justify-center mt-1">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-400" />
            <span className="font-cyber font-bold text-sm sm:text-base md:text-lg tracking-[0.3em] text-slate-300 uppercase">
              ESCAPE THE GRID
            </span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-400" />
          </div>
        </div>

        {/* Live Runner Silhouette Canvas Showcase */}
        <div className="w-[260px] h-[130px] my-3 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={260}
            height={130}
            className="w-[260px] h-[130px]"
          />
        </div>

        {/* Primary Navigation CTAs */}
        <div className="flex flex-col gap-3 w-full max-w-xs mt-1">
          <button
            data-start="true"
            onClick={() => {
              audio.playButtonClick();
              onPlay();
            }}
            className="group relative flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-cyber font-bold text-lg tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>PLAY {unlockedLevel > 1 ? `(LEVEL ${unlockedLevel})` : 'GAME'}</span>
          </button>

          <div className="flex gap-2.5 w-full">
            <button
              onClick={() => {
                audio.playButtonClick();
                onLevelSelect();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-cyber font-semibold text-sm tracking-wide transition-colors active:scale-95"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>LEVEL SELECT</span>
            </button>

            <button
              onClick={() => {
                audio.playButtonClick();
                onSettings();
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-cyber font-semibold text-sm tracking-wide transition-colors active:scale-95"
              aria-label="Settings"
            >
              <SettingsIcon className="w-4 h-4 text-slate-400" />
              <span>SETTINGS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer: Control Hint & Developer Credit */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-cyber text-slate-500 pt-3 border-t border-slate-900">
        <div className="tracking-wide">
          WASD / ARROWS MOVE · SPACE JUMP · S SLIDE · ESC PAUSE
        </div>
        <div className="text-slate-400 font-medium tracking-wider">
          DEVELOPED BY <span className="text-cyan-400 font-semibold">UMAYER SHAIKH</span>
        </div>
      </div>
    </div>
  );
};
