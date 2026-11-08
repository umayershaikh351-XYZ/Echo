export type GameScreen = 'menu' | 'level_select' | 'settings' | 'story_intro' | 'playing' | 'paused' | 'game_over' | 'victory' | 'final_cinematic';

export type PlayerAnimationState = 
  | 'idle'
  | 'running'
  | 'sprinting'
  | 'jumping'
  | 'falling'
  | 'landing'
  | 'sliding'
  | 'vaulting'
  | 'wall_slide'
  | 'wall_jump'
  | 'death'
  | 'victory';

export interface Vector2D {
  x: number;
  y: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Platform extends BoundingBox {
  id: string;
  type: 'solid' | 'rooftop' | 'conveyor' | 'moving' | 'wall' | 'bridge';
  speed?: number; // for conveyor (px/s) or moving platform
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
  moveDirection?: 'horizontal' | 'vertical';
  surfaceColor?: string;
  accentColor?: string;
}

export interface Hazard extends BoundingBox {
  id: string;
  type: 'laser' | 'spikes' | 'electric_wire' | 'fall_pit';
  active: boolean;
  interval?: number; // for periodic lasers
  timer?: number;
  color?: string;
  orientation?: 'horizontal' | 'vertical';
}

export interface Drone {
  id: string;
  x: number;
  y: number;
  originX: number;
  originY: number;
  radius: number;
  patrolRange: number;
  speed: number;
  direction: number;
  detectionAngle: number;
  detectionDistance: number;
  state: 'patrol' | 'alert' | 'attack';
  alertTimer: number;
  laserCooldown: number;
  color: string;
}

export interface Checkpoint {
  id: string;
  x: number;
  y: number;
  reached: boolean;
  name: string;
}

export interface Collectible {
  id: string;
  x: number;
  y: number;
  type: 'data_cube' | 'speed_boost' | 'lore_chip';
  collected: boolean;
  value: number;
}

export interface LevelStory {
  title: string;
  chapter: string;
  environment: string;
  briefing: string;
  objective: string;
}

export interface LevelData {
  id: number;
  title: string;
  subtitle: string;
  difficulty: 'Easy' | 'Medium' | 'Medium-Hard' | 'Hard' | 'Very Hard';
  difficultyStars: number;
  length: number; // in world coordinate pixels
  environment: 'prison_rooftop' | 'neon_city' | 'industrial_factory' | 'high_security' | 'central_tower';
  story: LevelStory;
  skyColorTop: string;
  skyColorBottom: string;
  accentColor: string;
  fogColor: string;
  platforms: Platform[];
  hazards: Hazard[];
  drones: Drone[];
  checkpoints: Checkpoint[];
  collectibles: Collectible[];
  finishX: number;
  cameraMinY?: number;
  cameraMaxY?: number;
}

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  facing: 1 | -1;
  isGrounded: boolean;
  isSliding: boolean;
  isVaulting: boolean;
  isWallSliding: boolean;
  isSprinting: boolean;
  isDead: boolean;
  hasWon: boolean;
  slideTimer: number;
  vaultTimer: number;
  wallDirection: number;
  coyoteTimer: number;
  jumpBufferTimer: number;
  animationState: PlayerAnimationState;
  animTimer: number;
  currentCheckpoint: Vector2D | null;
  score: number;
  speedMultiplier: number;
}

export interface UserProgress {
  unlockedLevel: number;
  completedLevels: number[];
  highScores: Record<number, number>;
  starsEarned: Record<number, number>;
  soundVolume: number;
  musicVolume: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  touchControls: boolean;
  particlesEnabled: boolean;
}

export interface GameInputs {
  left: boolean;
  right: boolean;
  jump: boolean;
  slide: boolean;
  sprint: boolean;
  action: boolean;
}
