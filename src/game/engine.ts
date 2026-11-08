import { audio } from './audio';
import { drawSilhouetteEcho } from './animation';
import { ParticleSystem } from './particles';
import {
  createInitialPlayerState,
  PLAYER_NORMAL_HEIGHT,
  PLAYER_SLIDE_HEIGHT,
  updatePhysics,
} from './physics';
import {
  Checkpoint,
  Collectible,
  Drone,
  GameInputs,
  Hazard,
  LevelData,
  Platform,
  PlayerState,
} from './types';

export interface GameEngineCallbacks {
  onScoreUpdate: (score: number) => void;
  onProgressUpdate: (progressPercent: number, distanceMeters: number) => void;
  onSpeedUpdate: (speed: number) => void;
  onCheckpoint: (name: string) => void;
  onGameOver: (reason: string, finalScore: number) => void;
  onVictory: (finalScore: number, stars: number) => void;
}

export class GameEngine {
  public level: LevelData;
  public player: PlayerState;
  public platforms: Platform[];
  public hazards: Hazard[];
  public drones: Drone[];
  public checkpoints: Checkpoint[];
  public collectibles: Collectible[];

  public particles: ParticleSystem;
  public cameraX: number = 0;
  public cameraY: number = 0;
  public screenShake: number = 0;

  private callbacks: GameEngineCallbacks;
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private animationFrameId: number | null = null;
  private lastTime: number = 0;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  public inputs: GameInputs = {
    left: false,
    right: false,
    jump: false,
    slide: false,
    sprint: false,
    action: false,
  };

  constructor(level: LevelData, callbacks: GameEngineCallbacks) {
    this.level = level;
    this.callbacks = callbacks;
    this.particles = new ParticleSystem(350);

    // Deep clone level items so state resets cleanly
    this.platforms = JSON.parse(JSON.stringify(level.platforms));
    this.hazards = JSON.parse(JSON.stringify(level.hazards));
    this.drones = JSON.parse(JSON.stringify(level.drones));
    this.checkpoints = JSON.parse(JSON.stringify(level.checkpoints));
    this.collectibles = JSON.parse(JSON.stringify(level.collectibles));

    this.player = createInitialPlayerState({ x: 80, y: 340 });
    this.cameraX = this.player.x - 200;
    this.cameraY = this.player.y - 200;
  }

  public bindCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  public start() {
    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    audio.startMusic(this.level.id);

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.loop(performance.now());
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    this.isPaused = false;
    this.lastTime = performance.now();
    audio.startMusic(this.level.id);
  }

  public stop() {
    this.isRunning = false;
    audio.stopMusic();
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public respawnAtCheckpoint() {
    const spawn = this.player.currentCheckpoint || { x: 80, y: 340 };
    this.player = createInitialPlayerState(spawn);
    this.player.isDead = false;
    this.screenShake = 0;
    this.lastTime = performance.now();
    this.isPaused = false;
  }

  public restart() {
    this.platforms = JSON.parse(JSON.stringify(this.level.platforms));
    this.hazards = JSON.parse(JSON.stringify(this.level.hazards));
    this.drones = JSON.parse(JSON.stringify(this.level.drones));
    this.checkpoints = JSON.parse(JSON.stringify(this.level.checkpoints));
    this.collectibles = JSON.parse(JSON.stringify(this.level.collectibles));

    this.player = createInitialPlayerState({ x: 80, y: 340 });
    this.cameraX = this.player.x - 200;
    this.cameraY = this.player.y - 200;
    this.screenShake = 0;
    this.lastTime = performance.now();
    this.isPaused = false;
    audio.startMusic(this.level.id);
  }

  private loop = (currentTime: number) => {
    if (!this.isRunning) return;

    const rawDt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    const dt = Math.min(rawDt, 0.05);

    if (!this.isPaused) {
      this.update(dt);
    }
    this.render();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    // 1. Update moving platforms
    for (const plat of this.platforms) {
      if (plat.type === 'moving' && plat.speed) {
        if (plat.moveDirection === 'horizontal' && plat.minX !== undefined && plat.maxX !== undefined) {
          plat.x += plat.speed * dt;
          if (plat.x > plat.maxX) {
            plat.x = plat.maxX;
            plat.speed = -Math.abs(plat.speed);
          } else if (plat.x < plat.minX) {
            plat.x = plat.minX;
            plat.speed = Math.abs(plat.speed);
          }
        } else if (plat.moveDirection === 'vertical' && plat.minY !== undefined && plat.maxY !== undefined) {
          plat.y += plat.speed * dt;
          if (plat.y > plat.maxY) {
            plat.y = plat.maxY;
            plat.speed = -Math.abs(plat.speed);
          } else if (plat.y < plat.minY) {
            plat.y = plat.minY;
            plat.speed = Math.abs(plat.speed);
          }
        }
      }
    }

    // 2. Update oscillating hazards (pulsing lasers)
    for (const h of this.hazards) {
      if (h.type === 'laser' && h.interval) {
        h.timer = (h.timer || 0) + dt;
        if (h.timer >= h.interval) {
          h.timer = 0;
          h.active = !h.active;
        }
      }
    }

    // 3. Update drones patrol
    for (const drone of this.drones) {
      if (drone.state === 'patrol') {
        drone.x += drone.speed * drone.direction * dt;
        if (drone.x > drone.originX + drone.patrolRange) {
          drone.direction = -1;
        } else if (drone.x < drone.originX - drone.patrolRange) {
          drone.direction = 1;
        }
      }
    }

    // 4. Update physics & player
    const prevGrounded = this.player.isGrounded;
    const prevSliding = this.player.isSliding;

    const { player, events } = updatePhysics(
      this.player,
      this.inputs,
      this.platforms,
      this.hazards,
      this.drones,
      this.checkpoints,
      this.collectibles,
      this.level.finishX,
      dt
    );
    this.player = player;

    // Trigger sound effects and particle feedback
    if (events.jumped) {
      audio.playJump();
      this.particles.emitDust(this.player.x + this.player.width / 2, this.player.y + this.player.height, 6);
    }
    if (events.wallJumped) {
      audio.playWallJump();
      this.particles.emitSparks(this.player.x + (this.player.facing > 0 ? 0 : this.player.width), this.player.y + 20, this.level.accentColor, 8);
    }
    if (events.landed) {
      audio.playLand();
      this.particles.emitDust(this.player.x + this.player.width / 2, this.player.y + this.player.height, 10);
      this.screenShake = Math.max(this.screenShake, 3);
    }
    if (events.slid && !prevSliding) {
      audio.playSlide();
      this.particles.emitDust(this.player.x + (this.player.facing > 0 ? -10 : 30), this.player.y + this.player.height, 8);
    }
    if (events.vaulted) {
      audio.playVault();
      this.particles.emitSparks(this.player.x + 10, this.player.y + 15, this.level.accentColor, 6);
    }
    if (events.checkpointReached) {
      audio.playCheckpoint();
      this.screenShake = 4;
      this.particles.emitSparks(this.player.x, this.player.y + 20, '#38bdf8', 20);
      this.callbacks.onCheckpoint(events.checkpointReached);
    }
    if (events.collected) {
      audio.playCollectible();
      this.particles.emitSparks(events.collected.x, events.collected.y, '#facc15', 14);
    }

    // Footstep rhythm while grounded and running
    if (this.player.isGrounded && Math.abs(this.player.vx) > 30 && !this.player.isSliding) {
      audio.playFootstep();
    }

    // Sprint speed particles
    if (this.player.isSprinting) {
      this.particles.emitSprintTrail(
        this.player.x + this.player.width / 2,
        this.player.y + this.player.height - 15,
        this.player.facing,
        this.level.accentColor
      );
    }

    // Death handling
    if (events.died) {
      audio.playDeath();
      this.screenShake = 12;
      this.particles.emitSparks(this.player.x + this.player.width / 2, this.player.y + 25, '#ef4444', 35);
      this.callbacks.onGameOver(events.deathReason || 'Eliminated by THE GRID', this.player.score);
      this.isPaused = true;
      return;
    }

    // Victory handling
    if (events.reachedFinish && !this.player.isDead) {
      audio.playVictory();
      this.screenShake = 6;
      this.particles.emitSparks(this.player.x + 30, this.player.y + 20, '#06b6d4', 40);
      // Calculate star rating (1-3 stars based on score)
      const stars = this.player.score >= 1200 ? 3 : this.player.score >= 600 ? 2 : 1;
      this.callbacks.onVictory(this.player.score, stars);
      this.isPaused = true;
      return;
    }

    // 5. Update particles & screen shake
    this.particles.update(dt);
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 25);
    }

    // 6. Smooth Camera Follow with lookahead
    if (this.canvas) {
      const targetLookahead = this.player.vx * 0.45;
      const targetCamX = this.player.x - this.canvas.width * 0.32 + targetLookahead;
      const targetCamY = this.player.y - this.canvas.height * 0.6;

      this.cameraX += (targetCamX - this.cameraX) * 0.12;
      this.cameraY += (targetCamY - this.cameraY) * 0.08;

      // Clamp vertical camera bounds
      const minY = this.level.cameraMinY ?? -100;
      const maxY = this.level.cameraMaxY ?? 600;
      this.cameraY = Math.max(minY, Math.min(maxY, this.cameraY));
    }

    // 7. Update HUD metrics
    const progressRatio = Math.min(1, Math.max(0, this.player.x / this.level.finishX));
    this.callbacks.onProgressUpdate(progressRatio, Math.floor(this.player.x / 10));
    this.callbacks.onScoreUpdate(this.player.score);
    this.callbacks.onSpeedUpdate(Math.abs(Math.round(this.player.vx)));
  }

  private render() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Apply screen shake
    let shakeOffsetX = 0;
    let shakeOffsetY = 0;
    if (this.screenShake > 0) {
      shakeOffsetX = (Math.random() - 0.5) * this.screenShake;
      shakeOffsetY = (Math.random() - 0.5) * this.screenShake;
    }

    const camX = this.cameraX + shakeOffsetX;
    const camY = this.cameraY + shakeOffsetY;

    // 1. Sky & Atmospheric Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, this.level.skyColorTop);
    skyGrad.addColorStop(1, this.level.skyColorBottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Distant Parallax Skyline (Layer 0 - factor 0.15)
    this.drawSkylineLayer(ctx, camX * 0.15, width, height, 0.4, '#090c14');

    // 3. Midground Parallax Industrial Structures (Layer 1 - factor 0.4)
    this.drawMidgroundLayer(ctx, camX * 0.4, width, height);

    // 4. World Content (Platforms, Hazards, Drones, Checkpoints, Player)
    ctx.save();
    ctx.translate(-camX, -camY);

    // Draw Platforms
    for (const plat of this.platforms) {
      // Platform body (dark industrial silhouette)
      ctx.fillStyle = plat.surfaceColor || '#1e293b';
      ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

      // Top glowing neon edge
      ctx.strokeStyle = plat.accentColor || this.level.accentColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(plat.x, plat.y);
      ctx.lineTo(plat.x + plat.width, plat.y);
      ctx.stroke();

      // Conveyor belt arrows
      if (plat.type === 'conveyor' && plat.speed) {
        ctx.strokeStyle = this.level.accentColor;
        ctx.lineWidth = 1.5;
        const arrowSpacing = 40;
        const offset = ((performance.now() / 1000) * plat.speed) % arrowSpacing;
        for (let ax = plat.x + offset; ax < plat.x + plat.width; ax += arrowSpacing) {
          if (ax < plat.x || ax > plat.x + plat.width - 15) continue;
          ctx.beginPath();
          if (plat.speed > 0) {
            ctx.moveTo(ax, plat.y + 12);
            ctx.lineTo(ax + 8, plat.y + 18);
            ctx.lineTo(ax, plat.y + 24);
          } else {
            ctx.moveTo(ax + 8, plat.y + 12);
            ctx.lineTo(ax, plat.y + 18);
            ctx.lineTo(ax + 8, plat.y + 24);
          }
          ctx.stroke();
        }
      }
    }

    // Draw Hazards (Lasers, Spikes, Electric Wires)
    for (const hazard of this.hazards) {
      if (!hazard.active) continue;

      if (hazard.type === 'laser') {
        const laserColor = hazard.color || '#ef4444';
        ctx.save();
        ctx.shadowColor = laserColor;
        ctx.shadowBlur = 12;
        ctx.fillStyle = laserColor;
        ctx.fillRect(hazard.x, hazard.y, hazard.width, hazard.height);

        // Core white beam
        ctx.fillStyle = '#ffffff';
        if (hazard.orientation === 'vertical') {
          ctx.fillRect(hazard.x + hazard.width * 0.35, hazard.y, hazard.width * 0.3, hazard.height);
        } else {
          ctx.fillRect(hazard.x, hazard.y + hazard.height * 0.35, hazard.width, hazard.height * 0.3);
        }
        ctx.restore();
      } else if (hazard.type === 'spikes') {
        ctx.fillStyle = hazard.color || '#ea580c';
        const numSpikes = Math.floor(hazard.width / 14);
        for (let i = 0; i < numSpikes; i++) {
          const sx = hazard.x + i * 14;
          ctx.beginPath();
          ctx.moveTo(sx, hazard.y + hazard.height);
          ctx.lineTo(sx + 7, hazard.y);
          ctx.lineTo(sx + 14, hazard.y + hazard.height);
          ctx.closePath();
          ctx.fill();
        }
      }
    }

    // Draw Checkpoints
    for (const cp of this.checkpoints) {
      const activeColor = cp.reached ? '#22c55e' : '#38bdf8';
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cp.x, cp.y);
      ctx.lineTo(cp.x, cp.y - 70);
      ctx.stroke();

      // Holographic banner flag
      ctx.fillStyle = activeColor;
      ctx.shadowColor = activeColor;
      ctx.shadowBlur = cp.reached ? 10 : 4;
      ctx.beginPath();
      ctx.moveTo(cp.x, cp.y - 70);
      ctx.lineTo(cp.x + 35, cp.y - 58);
      ctx.lineTo(cp.x, cp.y - 46);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Draw Collectibles
    const nowTime = performance.now() / 1000;
    for (const col of this.collectibles) {
      if (col.collected) continue;
      const floatY = col.y + Math.sin(nowTime * 4 + col.x) * 4;

      ctx.save();
      ctx.shadowColor = col.type === 'lore_chip' ? '#38bdf8' : col.type === 'speed_boost' ? '#f43f5e' : '#facc15';
      ctx.shadowBlur = 10;
      ctx.fillStyle = ctx.shadowColor;

      // Rotating diamond icon
      ctx.translate(col.x, floatY);
      ctx.rotate(nowTime * 2);
      ctx.fillRect(-7, -7, 14, 14);
      ctx.restore();
    }

    // Draw Drones & Searchlights
    for (const drone of this.drones) {
      this.drawDrone(ctx, drone);
    }

    // Draw Finish Zone Gate
    this.drawFinishGate(ctx, this.level.finishX);

    // Draw Particles
    this.particles.draw(ctx, 0, 0);

    // Draw Player Silhouette
    drawSilhouetteEcho(ctx, this.player, this.player.x, this.player.y, this.level.accentColor);

    ctx.restore();

    // 5. Atmospheric Foreground Fog & Vignette
    this.drawAtmosphereOverlay(ctx, width, height);
  }

  private drawDrone(ctx: CanvasRenderingContext2D, drone: Drone) {
    ctx.save();

    // Searchlight beam
    const isAlert = drone.state === 'alert' || drone.state === 'attack';
    const beamColor = isAlert ? 'rgba(239, 68, 68, 0.35)' : 'rgba(56, 189, 248, 0.2)';
    const beamLength = drone.detectionDistance;
    const spreadAngle = 0.45;

    ctx.fillStyle = beamColor;
    ctx.beginPath();
    ctx.moveTo(drone.x, drone.y);
    ctx.arc(drone.x, drone.y, beamLength, drone.detectionAngle - spreadAngle, drone.detectionAngle + spreadAngle);
    ctx.closePath();
    ctx.fill();

    // Drone chassis
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = isAlert ? '#ef4444' : drone.color;
    ctx.lineWidth = 2.5;

    // Body
    ctx.beginPath();
    ctx.ellipse(drone.x, drone.y, drone.radius, drone.radius * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Thruster props
    const propSpeed = performance.now() * 0.05;
    ctx.fillStyle = '#64748b';
    ctx.fillRect(drone.x - drone.radius - 8, drone.y - 3, 8, 4);
    ctx.fillRect(drone.x + drone.radius, drone.y - 3, 8, 4);

    // Glowing Eye Lens
    ctx.fillStyle = isAlert ? '#ef4444' : drone.color;
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(drone.x, drone.y + 2, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawFinishGate(ctx: CanvasRenderingContext2D, finishX: number) {
    ctx.save();
    const gateColor = this.level.accentColor;
    ctx.strokeStyle = gateColor;
    ctx.lineWidth = 4;
    ctx.shadowColor = gateColor;
    ctx.shadowBlur = 15;

    // Vertical pillars of the extraction gateway
    ctx.beginPath();
    ctx.moveTo(finishX, 100);
    ctx.lineTo(finishX, 420);
    ctx.stroke();

    // Archway top
    ctx.beginPath();
    ctx.arc(finishX + 40, 100, 40, Math.PI, 0);
    ctx.stroke();

    // Pulsing energy field
    const alpha = 0.3 + Math.sin(performance.now() * 0.005) * 0.2;
    ctx.fillStyle = gateColor;
    ctx.globalAlpha = alpha;
    ctx.fillRect(finishX, 100, 80, 320);

    ctx.restore();
  }

  private drawSkylineLayer(
    ctx: CanvasRenderingContext2D,
    offsetX: number,
    width: number,
    height: number,
    alpha: number,
    color: string
  ) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;

    const buildingWidth = 85;
    const baseOffset = (offsetX % (buildingWidth * 12));

    for (let i = -2; i < width / buildingWidth + 4; i++) {
      const bx = i * buildingWidth - baseOffset;
      const bHeight = 180 + ((Math.abs(Math.sin(i * 12.3)) * 220));
      ctx.fillRect(bx, height - bHeight, buildingWidth - 6, bHeight);

      // Antenna beacon light on top
      if (i % 2 === 0) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(bx + (buildingWidth - 6) / 2, height - bHeight - 12, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = color;
      }
    }
    ctx.restore();
  }

  private drawMidgroundLayer(
    ctx: CanvasRenderingContext2D,
    offsetX: number,
    width: number,
    height: number
  ) {
    ctx.save();
    ctx.fillStyle = '#111827';
    ctx.globalAlpha = 0.65;

    const segmentWidth = 140;
    const baseOffset = (offsetX % (segmentWidth * 8));

    for (let i = -1; i < width / segmentWidth + 2; i++) {
      const sx = i * segmentWidth - baseOffset;
      const segHeight = 140 + ((i % 4) * 45);
      ctx.fillRect(sx, height - segHeight, segmentWidth - 12, segHeight);

      // Midground window grids
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      for (let wy = height - segHeight + 15; wy < height - 20; wy += 25) {
        ctx.fillRect(sx + 15, wy, segmentWidth - 42, 6);
      }
      ctx.fillStyle = '#111827';
    }
    ctx.restore();
  }

  private drawAtmosphereOverlay(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Subtle edge vignette
    const vigGrad = ctx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.45,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.85
    );
    vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vigGrad.addColorStop(1, 'rgba(0,0,0,0.65)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, width, height);
  }
}
