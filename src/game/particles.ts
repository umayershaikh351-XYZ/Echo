export interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxLife: number;
  life: number;
  color: string;
  shape: 'circle' | 'line' | 'square';
  alpha: number;
}

export class ParticleSystem {
  private pool: Particle[] = [];
  private poolSize: number;
  private nextIndex: number = 0;

  constructor(size: number = 300) {
    this.poolSize = size;
    for (let i = 0; i < size; i++) {
      this.pool.push({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 2,
        maxLife: 1,
        life: 0,
        color: '#ffffff',
        shape: 'circle',
        alpha: 1,
      });
    }
  }

  public emit(
    x: number,
    y: number,
    vx: number,
    vy: number,
    size: number,
    life: number,
    color: string,
    shape: 'circle' | 'line' | 'square' = 'circle'
  ) {
    const p = this.pool[this.nextIndex];
    p.active = true;
    p.x = x;
    p.y = y;
    p.vx = vx;
    p.vy = vy;
    p.size = size;
    p.maxLife = life;
    p.life = life;
    p.color = color;
    p.shape = shape;
    p.alpha = 1;

    this.nextIndex = (this.nextIndex + 1) % this.poolSize;
  }

  public emitDust(x: number, y: number, count: number = 8) {
    for (let i = 0; i < count; i++) {
      const angle = Math.PI + (Math.random() - 0.5) * 1.4;
      const speed = 40 + Math.random() * 80;
      this.emit(
        x + (Math.random() - 0.5) * 16,
        y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed * 0.4 - 20,
        3 + Math.random() * 3,
        0.35 + Math.random() * 0.2,
        '#64748b'
      );
    }
  }

  public emitSparks(x: number, y: number, color: string = '#f43f5e', count: number = 16) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 240;
      this.emit(
        x,
        y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        2 + Math.random() * 2,
        0.25 + Math.random() * 0.3,
        color,
        'line'
      );
    }
  }

  public emitSprintTrail(x: number, y: number, facing: number, color: string = '#38bdf8') {
    this.emit(
      x - facing * 12 + (Math.random() - 0.5) * 6,
      y + (Math.random() - 0.5) * 20,
      -facing * (40 + Math.random() * 30),
      (Math.random() - 0.5) * 20,
      3,
      0.22,
      color,
      'circle'
    );
  }

  public update(dt: number) {
    for (let i = 0; i < this.poolSize; i++) {
      const p = this.pool[i];
      if (!p.active) continue;

      p.life -= dt;
      if (p.life <= 0) {
        p.active = false;
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.alpha = Math.max(0, p.life / p.maxLife);
    }
  }

  public draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    ctx.save();
    for (let i = 0; i < this.poolSize; i++) {
      const p = this.pool[i];
      if (!p.active) continue;

      const sx = p.x - cameraX;
      const sy = p.y - cameraY;

      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.strokeStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'line') {
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx - p.vx * 0.04, sy - p.vy * 0.04);
        ctx.stroke();
      } else {
        ctx.fillRect(sx - p.size / 2, sy - p.size / 2, p.size, p.size);
      }
    }
    ctx.restore();
  }
}
