import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ChevronDown, Zap } from 'lucide-react';
import { GameInputs } from '../game/types';

interface MobileControlsProps {
  onInput: (inputs: Partial<GameInputs>) => void;
  accentColor?: string;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onInput,
  accentColor = '#06b6d4',
}) => {
  const leftPressed = useRef(false);
  const rightPressed = useRef(false);

  // Helper for touch & mouse listeners
  const bindButton = (
    key: keyof GameInputs,
    pressState?: { current: boolean }
  ) => {
    const start = (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (pressState) pressState.current = true;
      onInput({ [key]: true });
    };

    const end = (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (pressState) pressState.current = false;
      onInput({ [key]: false });
    };

    return {
      onTouchStart: start,
      onTouchEnd: end,
      onTouchCancel: end,
      onMouseDown: start,
      onMouseUp: end,
      onMouseLeave: end,
    };
  };

  return (
    <div className="fixed inset-x-0 bottom-0 pointer-events-none z-30 flex justify-between items-end p-4 md:p-8 select-none touch-none pb-safe">
      {/* LEFT CLUSTER: Left, Right, Sprint */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        <button
          {...bindButton('left', leftPressed)}
          aria-label="Move Left"
          className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-slate-950/75 border border-slate-700/80 active:bg-cyan-950/80 active:border-cyan-400 flex items-center justify-center text-slate-200 active:text-cyan-300 shadow-lg backdrop-blur-none transition-transform active:scale-95"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>

        <button
          {...bindButton('right', rightPressed)}
          aria-label="Move Right"
          className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-slate-950/75 border border-slate-700/80 active:bg-cyan-950/80 active:border-cyan-400 flex items-center justify-center text-slate-200 active:text-cyan-300 shadow-lg backdrop-blur-none transition-transform active:scale-95"
        >
          <ArrowRight className="w-7 h-7" />
        </button>

        <button
          {...bindButton('sprint')}
          aria-label="Sprint Boost"
          className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-slate-950/75 border border-slate-700/80 active:bg-amber-950/80 active:border-amber-400 flex flex-col items-center justify-center text-amber-400 shadow-lg backdrop-blur-none transition-transform active:scale-95"
        >
          <Zap className="w-5 h-5" />
          <span className="text-[9px] font-cyber font-bold tracking-tight">SPRINT</span>
        </button>
      </div>

      {/* RIGHT CLUSTER: Slide, Vault/Action, Jump */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        {/* Slide Button */}
        <button
          {...bindButton('slide')}
          aria-label="Slide Under Obstacles"
          className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-slate-950/75 border border-slate-700/80 active:bg-rose-950/80 active:border-rose-400 flex flex-col items-center justify-center text-rose-400 shadow-lg backdrop-blur-none transition-transform active:scale-95"
        >
          <ChevronDown className="w-7 h-7" />
          <span className="text-[9px] font-cyber font-bold tracking-tight">SLIDE</span>
        </button>

        {/* Action / Vault Button */}
        <button
          {...bindButton('action')}
          aria-label="Vault Barrier"
          className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-slate-950/75 border border-slate-700/80 active:bg-purple-950/80 active:border-purple-400 flex flex-col items-center justify-center text-purple-300 shadow-lg backdrop-blur-none transition-transform active:scale-95"
        >
          <span className="text-xs font-cyber font-bold">VAULT</span>
        </button>

        {/* Jump Button (Prominent) */}
        <button
          {...bindButton('jump')}
          aria-label="Jump / Wall Jump"
          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-slate-950/85 border-2 flex flex-col items-center justify-center shadow-xl backdrop-blur-none transition-transform active:scale-95"
          style={{
            borderColor: accentColor,
            color: accentColor,
            boxShadow: `0 0 15px ${accentColor}40`,
          }}
        >
          <ArrowUp className="w-8 h-8 md:w-9 md:h-9" />
          <span className="text-[10px] md:text-xs font-cyber font-extrabold tracking-wider">
            JUMP
          </span>
        </button>
      </div>
    </div>
  );
};
