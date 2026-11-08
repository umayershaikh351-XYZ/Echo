import React, { useEffect, useRef, useCallback } from 'react';
import { GameEngine, GameEngineCallbacks } from '../game/engine';
import { GameInputs, LevelData } from '../game/types';

interface GameCanvasProps {
  level: LevelData;
  isPaused: boolean;
  touchInputs: Partial<GameInputs>;
  callbacks: GameEngineCallbacks;
  engineRefOut?: (engine: GameEngine | null) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  level,
  isPaused,
  touchInputs,
  callbacks,
  engineRefOut,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Keep latest callbacks in ref so engine doesn't re-instantiate on render
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  const engineRefOutRef = useRef(engineRefOut);
  engineRefOutRef.current = engineRefOut;

  // Initialize or re-initialize engine on level change ONLY
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new GameEngine(level, {
      onScoreUpdate: (s) => callbacksRef.current.onScoreUpdate(s),
      onProgressUpdate: (p, d) => callbacksRef.current.onProgressUpdate(p, d),
      onSpeedUpdate: (sp) => callbacksRef.current.onSpeedUpdate(sp),
      onCheckpoint: (name) => callbacksRef.current.onCheckpoint(name),
      onGameOver: (r, s) => callbacksRef.current.onGameOver(r, s),
      onVictory: (s, st) => callbacksRef.current.onVictory(s, st),
    });

    engine.bindCanvas(canvas);
    engineRef.current = engine;
    if (engineRefOutRef.current) engineRefOutRef.current(engine);

    engine.start();

    return () => {
      engine.stop();
      engineRef.current = null;
      if (engineRefOutRef.current) engineRefOutRef.current(null);
    };
  }, [level.id]);

  const touchInputsRef = useRef<Partial<GameInputs>>(touchInputs);
  touchInputsRef.current = touchInputs;
  const keysPressedRef = useRef(new Set<string>());

  // Handle Pause / Resume
  useEffect(() => {
    if (!engineRef.current) return;
    if (isPaused) {
      engineRef.current.pause();
    } else {
      engineRef.current.resume();
    }
  }, [isPaused]);

  // Combined input updater
  const updateEngineInputs = useCallback(() => {
    if (!engineRef.current) return;
    const inputs = engineRef.current.inputs;
    const touch = touchInputsRef.current;
    const keys = keysPressedRef.current;

    inputs.left =
      Boolean(touch.left) ||
      keys.has('KeyA') ||
      keys.has('ArrowLeft') ||
      keys.has('a') ||
      keys.has('A');

    inputs.right =
      Boolean(touch.right) ||
      keys.has('KeyD') ||
      keys.has('ArrowRight') ||
      keys.has('d') ||
      keys.has('D');

    inputs.jump =
      Boolean(touch.jump) ||
      keys.has('Space') ||
      keys.has('KeyW') ||
      keys.has('ArrowUp') ||
      keys.has('w') ||
      keys.has('W') ||
      keys.has(' ');

    inputs.slide =
      Boolean(touch.slide) ||
      keys.has('KeyS') ||
      keys.has('ArrowDown') ||
      keys.has('s') ||
      keys.has('S');

    inputs.sprint =
      Boolean(touch.sprint) ||
      keys.has('ShiftLeft') ||
      keys.has('ShiftRight') ||
      keys.has('Shift');

    inputs.action =
      Boolean(touch.action) ||
      keys.has('KeyE') ||
      keys.has('KeyF') ||
      keys.has('e') ||
      keys.has('f');
  }, []);

  // Sync touch input changes
  useEffect(() => {
    updateEngineInputs();
  }, [touchInputs, updateEngineInputs]);

  // Keyboard input listeners with edge/held handling and blur clearance
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser default scrolling for game keys
      if (
        ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code) ||
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)
      ) {
        e.preventDefault();
      }
      keysPressedRef.current.add(e.code);
      keysPressedRef.current.add(e.key);
      updateEngineInputs();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current.delete(e.code);
      keysPressedRef.current.delete(e.key);
      updateEngineInputs();
    };

    const handleBlur = () => {
      keysPressedRef.current.clear();
      updateEngineInputs();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [updateEngineInputs]);

  // ResizeObserver for canvas resolution
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          canvas.width = Math.round(width);
          canvas.height = Math.round(height);
        }
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden bg-black select-none pointer-events-auto"
      style={{ touchAction: 'none' }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </div>
  );
};
