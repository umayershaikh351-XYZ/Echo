import React, { useEffect, useState, useRef, useCallback } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { MobileControls } from './components/MobileControls';
import { MainMenu } from './components/MainMenu';
import { LevelSelect } from './components/LevelSelect';
import { StoryIntroModal } from './components/StoryIntroModal';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { FinalCinematicModal } from './components/FinalCinematicModal';
import { SettingsModal } from './components/SettingsModal';
import { LEVELS } from './game/levels';
import { GameEngine } from './game/engine';
import { GameInputs, GameScreen, LevelData, UserProgress } from './game/types';
import { loadProgress, recordLevelCompletion, resetAllProgress, saveProgress } from './game/storage';
import { audio } from './game/audio';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Live HUD metrics
  const [score, setScore] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [distanceMeters, setDistanceMeters] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0);
  const [gameOverReason, setGameOverReason] = useState<string>('');
  const [victoryScore, setVictoryScore] = useState<number>(0);
  const [victoryStars, setVictoryStars] = useState<number>(1);

  // Active touch inputs
  const [touchInputs, setTouchInputs] = useState<Partial<GameInputs>>({});

  // Engine instance reference
  const engineRef = useRef<GameEngine | null>(null);

  const currentLevel: LevelData = LEVELS.find((l) => l.id === currentLevelId) || LEVELS[0];

  // Sync audio preferences on mount
  useEffect(() => {
    audio.setMuted(!progress.soundEnabled);
    audio.setVolumes(progress.soundVolume, progress.musicVolume);
  }, [progress.soundEnabled, progress.soundVolume, progress.musicVolume]);

  // Support ?autostart=1 url parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        setScreen('playing');
        audio.startMusic(1);
      }
    }
  }, []);

  // Sync document.body.dataset.state for Ultra Mode evaluation
  useEffect(() => {
    if (screen === 'menu' || screen === 'level_select') {
      document.body.dataset.state = 'title';
    } else if (screen === 'playing') {
      document.body.dataset.state = 'playing';
    } else if (screen === 'paused') {
      document.body.dataset.state = 'paused';
    } else if (screen === 'game_over' || screen === 'victory' || screen === 'final_cinematic') {
      document.body.dataset.state = 'gameover';
    }
  }, [screen]);

  // Global Escape / P listener to Pause game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (screen === 'playing') {
          audio.playButtonClick();
          setScreen('paused');
        } else if (screen === 'paused') {
          audio.playButtonClick();
          setScreen('playing');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen]);

  // Handle Level Selection
  const handleSelectLevel = (levelId: number) => {
    setCurrentLevelId(levelId);
    setScreen('story_intro');
  };

  const handleStartRun = () => {
    setScore(0);
    setProgressPercent(0);
    setDistanceMeters(0);
    setSpeed(0);
    setScreen('playing');
  };

  const handlePause = () => {
    audio.playButtonClick();
    setScreen('paused');
  };

  const handleResume = () => {
    audio.playButtonClick();
    setScreen('playing');
  };

  const handleRestartLevel = () => {
    if (engineRef.current) {
      engineRef.current.restart();
    }
    setScore(0);
    setProgressPercent(0);
    setDistanceMeters(0);
    setSpeed(0);
    setScreen('playing');
  };

  const handleRespawnCheckpoint = () => {
    if (engineRef.current) {
      engineRef.current.respawnAtCheckpoint();
    }
    setScreen('playing');
  };

  const handleToggleMute = useCallback(() => {
    setProgress((prev) => {
      const nextSound = !prev.soundEnabled;
      audio.setMuted(!nextSound);
      const updated = { ...prev, soundEnabled: nextSound };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const handleUpdateProgress = (patch: Partial<UserProgress>) => {
    setProgress((prev) => {
      const updated = { ...prev, ...patch };
      saveProgress(updated);
      return updated;
    });
  };

  const handleResetProgress = () => {
    const reset = resetAllProgress();
    setProgress(reset);
    setCurrentLevelId(1);
    setScreen('menu');
  };

  // Game Engine Callbacks
  const engineCallbacks = {
    onScoreUpdate: (newScore: number) => setScore(newScore),
    onProgressUpdate: (pct: number, dist: number) => {
      setProgressPercent(pct);
      setDistanceMeters(dist);
    },
    onSpeedUpdate: (newSpeed: number) => setSpeed(newSpeed),
    onCheckpoint: (_name: string) => {},
    onGameOver: (reason: string, finalScore: number) => {
      setGameOverReason(reason);
      setScore(finalScore);
      setScreen('game_over');
    },
    onVictory: (finalScore: number, stars: number) => {
      setVictoryScore(finalScore);
      setVictoryStars(stars);

      // Save progression
      const updated = recordLevelCompletion(progress, currentLevelId, finalScore, stars);
      setProgress(updated);

      if (currentLevelId >= 5) {
        setScreen('final_cinematic');
      } else {
        setScreen('victory');
      }
    },
  };

  const handleEngineRefOut = useCallback((engine: GameEngine | null) => {
    engineRef.current = engine;
  }, []);

  const hasCheckpoint = Boolean(engineRef.current?.player?.currentCheckpoint);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none font-cyber">
      {/* 1. Main Menu */}
      {screen === 'menu' && (
        <MainMenu
          onPlay={() => {
            const nextLvl = Math.min(5, progress.unlockedLevel);
            setCurrentLevelId(nextLvl);
            setScreen('story_intro');
          }}
          onLevelSelect={() => setScreen('level_select')}
          onSettings={() => setShowSettings(true)}
          isMuted={!progress.soundEnabled}
          onToggleMute={handleToggleMute}
          unlockedLevel={progress.unlockedLevel}
        />
      )}

      {/* 2. Level Select Screen */}
      {screen === 'level_select' && (
        <LevelSelect
          unlockedLevel={progress.unlockedLevel}
          completedLevels={progress.completedLevels}
          highScores={progress.highScores}
          starsEarned={progress.starsEarned}
          onSelectLevel={handleSelectLevel}
          onBack={() => setScreen('menu')}
        />
      )}

      {/* 3. Story Briefing Modal */}
      {screen === 'story_intro' && (
        <StoryIntroModal
          level={currentLevel}
          onStart={handleStartRun}
        />
      )}

      {/* 4. Active Canvas Simulation */}
      {(screen === 'playing' || screen === 'paused' || screen === 'game_over' || screen === 'victory') && (
        <>
          <GameCanvas
            level={currentLevel}
            isPaused={screen !== 'playing'}
            touchInputs={touchInputs}
            callbacks={engineCallbacks}
            engineRefOut={handleEngineRefOut}
          />

          {/* Low-Occlusion HUD */}
          <HUD
            level={currentLevel}
            score={score}
            progressPercent={progressPercent}
            distanceMeters={distanceMeters}
            speed={speed}
            isMuted={!progress.soundEnabled}
            onPause={handlePause}
            onToggleMute={handleToggleMute}
          />

          {/* Mobile Touch Controls */}
          <MobileControls
            onInput={(inputs) => setTouchInputs((prev) => ({ ...prev, ...inputs }))}
            accentColor={currentLevel.accentColor}
          />
        </>
      )}

      {/* 5. Pause Modal */}
      {screen === 'paused' && (
        <PauseModal
          levelTitle={currentLevel.title}
          isMuted={!progress.soundEnabled}
          onResume={handleResume}
          onRestart={handleRestartLevel}
          onLevelSelect={() => setScreen('level_select')}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* 6. Game Over Modal */}
      {screen === 'game_over' && (
        <GameOverModal
          reason={gameOverReason}
          score={score}
          hasCheckpoint={hasCheckpoint}
          onRespawnCheckpoint={handleRespawnCheckpoint}
          onRestart={handleRestartLevel}
          onLevelSelect={() => setScreen('level_select')}
        />
      )}

      {/* 7. Sector Victory Modal */}
      {screen === 'victory' && (
        <VictoryModal
          levelId={currentLevelId}
          levelTitle={currentLevel.title}
          score={victoryScore}
          stars={victoryStars}
          onNextLevel={() => {
            const nextLvl = currentLevelId + 1;
            if (nextLvl <= 5) {
              setCurrentLevelId(nextLvl);
              setScreen('story_intro');
            } else {
              setScreen('final_cinematic');
            }
          }}
          onRestart={handleRestartLevel}
          onLevelSelect={() => setScreen('level_select')}
        />
      )}

      {/* 8. Epic Freedom Protocol Ending Cinematic */}
      {screen === 'final_cinematic' && (
        <FinalCinematicModal
          finalScore={score}
          onPlayAgain={() => {
            setCurrentLevelId(1);
            setScreen('menu');
          }}
        />
      )}

      {/* 9. Settings Modal */}
      {showSettings && (
        <SettingsModal
          progress={progress}
          onUpdateProgress={handleUpdateProgress}
          onResetProgress={handleResetProgress}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
