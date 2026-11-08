import { UserProgress } from './types';

const STORAGE_KEY = 'echo_grid_save_v1';

const DEFAULT_PROGRESS: UserProgress = {
  unlockedLevel: 1,
  completedLevels: [],
  highScores: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  starsEarned: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  soundVolume: 0.8,
  musicVolume: 0.6,
  soundEnabled: true,
  musicEnabled: true,
  touchControls: true,
  particlesEnabled: true,
};

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      highScores: { ...DEFAULT_PROGRESS.highScores, ...(parsed.highScores || {}) },
      starsEarned: { ...DEFAULT_PROGRESS.starsEarned, ...(parsed.starsEarned || {}) },
    };
  } catch (err) {
    console.warn('Failed to parse saved game progress', err);
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.warn('Failed to save progress to localStorage', err);
  }
}

export function recordLevelCompletion(
  current: UserProgress,
  levelId: number,
  score: number,
  stars: number
): UserProgress {
  const completed = Array.from(new Set([...current.completedLevels, levelId]));
  const nextUnlocked = Math.max(current.unlockedLevel, Math.min(5, levelId + 1));
  const oldScore = current.highScores[levelId] || 0;
  const newHighScores = {
    ...current.highScores,
    [levelId]: Math.max(oldScore, score),
  };
  const oldStars = current.starsEarned[levelId] || 0;
  const newStarsEarned = {
    ...current.starsEarned,
    [levelId]: Math.max(oldStars, stars),
  };

  const updated: UserProgress = {
    ...current,
    unlockedLevel: nextUnlocked,
    completedLevels: completed,
    highScores: newHighScores,
    starsEarned: newStarsEarned,
  };

  saveProgress(updated);
  return updated;
}

export function resetAllProgress(): UserProgress {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
  return DEFAULT_PROGRESS;
}
