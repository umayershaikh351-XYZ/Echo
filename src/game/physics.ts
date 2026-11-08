import {
  BoundingBox,
  Checkpoint,
  Collectible,
  Drone,
  GameInputs,
  Hazard,
  Platform,
  PlayerState,
  Vector2D,
} from './types';

// Constants
export const GRAVITY = 1100; // px/s^2
export const RUN_ACCEL = 2200; // px/s^2
export const RUN_DECEL = 1400; // px/s^2
export const BASE_RUN_SPEED = 240; // px/s continuous parkour run
export const MAX_RUN_SPEED = 340; // px/s active right run
export const SPRINT_SPEED = 460; // px/s sprint boost
export const JUMP_VELOCITY = -490; // px/s
export const WALL_JUMP_VX = 340; // px/s
export const WALL_JUMP_VY = -440; // px/s
export const WALL_SLIDE_MAX_FALL = 140; // px/s
export const SLIDE_DURATION = 0.65; // seconds
export const SLIDE_SPEED = 420; // px/s
export const VAULT_DURATION = 0.35; // seconds
export const COYOTE_TIME = 0.12; // seconds
export const JUMP_BUFFER_TIME = 0.12; // seconds

export const PLAYER_NORMAL_WIDTH = 24;
export const PLAYER_NORMAL_HEIGHT = 56;
export const PLAYER_SLIDE_HEIGHT = 26;

export function checkAABB(a: BoundingBox, b: BoundingBox): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function createInitialPlayerState(spawn: Vector2D): PlayerState {
  return {
    x: spawn.x,
    y: spawn.y,
    vx: 0,
    vy: 0,
    width: PLAYER_NORMAL_WIDTH,
    height: PLAYER_NORMAL_HEIGHT,
    facing: 1,
    isGrounded: false,
    isSliding: false,
    isVaulting: false,
    isWallSliding: false,
    isSprinting: false,
    isDead: false,
    hasWon: false,
    slideTimer: 0,
    vaultTimer: 0,
    wallDirection: 0,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    animationState: 'idle',
    animTimer: 0,
    currentCheckpoint: { ...spawn },
    score: 0,
    speedMultiplier: 1.0,
  };
}

export interface PhysicsStepResult {
  player: PlayerState;
  events: {
    jumped: boolean;
    landed: boolean;
    slid: boolean;
    vaulted: boolean;
    wallJumped: boolean;
    checkpointReached?: string;
    collected?: Collectible;
    died: boolean;
    deathReason?: string;
    reachedFinish: boolean;
  };
}

export function updatePhysics(
  player: PlayerState,
  inputs: GameInputs,
  platforms: Platform[],
  hazards: Hazard[],
  drones: Drone[],
  checkpoints: Checkpoint[],
  collectibles: Collectible[],
  finishX: number,
  dt: number
): PhysicsStepResult {
  const clampedDt = Math.min(dt, 0.05);
  const events: PhysicsStepResult['events'] = {
    jumped: false,
    landed: false,
    slid: false,
    vaulted: false,
    wallJumped: false,
    died: false,
    reachedFinish: false,
  };

  if (player.isDead) {
    player.animTimer += clampedDt;
    return { player, events };
  }

  // 1. Handle timers
  if (player.coyoteTimer > 0) player.coyoteTimer -= clampedDt;
  if (player.jumpBufferTimer > 0) player.jumpBufferTimer -= clampedDt;
  if (inputs.jump) player.jumpBufferTimer = JUMP_BUFFER_TIME;

  // 2. Sliding mechanic
  if (inputs.slide && player.isGrounded && !player.isSliding && player.slideTimer <= 0) {
    player.isSliding = true;
    player.slideTimer = SLIDE_DURATION;
    player.height = PLAYER_SLIDE_HEIGHT;
    player.vx = player.facing * SLIDE_SPEED;
    events.slid = true;
  }

  if (player.isSliding) {
    player.slideTimer -= clampedDt;
    player.height = PLAYER_SLIDE_HEIGHT;
    // Keep slide momentum
    player.vx = player.facing * (SLIDE_SPEED * Math.max(0.65, player.slideTimer / SLIDE_DURATION));
    if (player.slideTimer <= 0) {
      // Check if space above to stand up
      const testBox: BoundingBox = {
        x: player.x,
        y: player.y - (PLAYER_NORMAL_HEIGHT - PLAYER_SLIDE_HEIGHT),
        width: player.width,
        height: PLAYER_NORMAL_HEIGHT,
      };
      let blockedAbove = false;
      for (const plat of platforms) {
        if (checkAABB(testBox, plat)) {
          blockedAbove = true;
          break;
        }
      }
      if (!blockedAbove) {
        player.isSliding = false;
        player.y -= (PLAYER_NORMAL_HEIGHT - PLAYER_SLIDE_HEIGHT);
        player.height = PLAYER_NORMAL_HEIGHT;
      } else {
        player.slideTimer = 0.1; // extend slide until obstacle passed
      }
    }
  } else {
    player.height = PLAYER_NORMAL_HEIGHT;
  }

  // 3. Vaulting mechanic (leaping over waist-height barrier)
  if (player.isVaulting) {
    player.vaultTimer -= clampedDt;
    player.vx = player.facing * (MAX_RUN_SPEED * 1.15);
    player.vy = -120; // gentle arc
    if (player.vaultTimer <= 0) {
      player.isVaulting = false;
    }
  }

  // 4. Continuous parkour running & movement (Vector-inspired)
  const targetMaxSpeed = inputs.sprint
    ? SPRINT_SPEED
    : inputs.right
    ? MAX_RUN_SPEED
    : BASE_RUN_SPEED;
  player.isSprinting = inputs.sprint && Math.abs(player.vx) > BASE_RUN_SPEED * 1.1;

  if (!player.isSliding && !player.isVaulting) {
    if (inputs.left) {
      // Active braking or reversing
      player.facing = -1;
      player.vx = Math.max(-140, player.vx - RUN_DECEL * 1.8 * clampedDt);
    } else {
      // Natural forward parkour momentum
      player.facing = 1;
      if (player.vx < targetMaxSpeed) {
        player.vx = Math.min(targetMaxSpeed, player.vx + RUN_ACCEL * clampedDt);
      } else if (player.vx > targetMaxSpeed) {
        player.vx = Math.max(targetMaxSpeed, player.vx - RUN_DECEL * clampedDt);
      }
    }
  }

  // 5. Jump logic with buffering & coyote time
  const canJump = (player.isGrounded || player.coyoteTimer > 0) && !player.isSliding;
  if (player.jumpBufferTimer > 0 && canJump) {
    player.vy = JUMP_VELOCITY;
    player.isGrounded = false;
    player.coyoteTimer = 0;
    player.jumpBufferTimer = 0;
    events.jumped = true;
  } else if (player.jumpBufferTimer > 0 && player.isWallSliding) {
    // Wall Jump!
    player.vx = -player.wallDirection * WALL_JUMP_VX;
    player.vy = WALL_JUMP_VY;
    player.facing = -player.wallDirection as 1 | -1;
    player.isWallSliding = false;
    player.jumpBufferTimer = 0;
    events.wallJumped = true;
  }

  // Variable jump height cut when releasing jump key while ascending
  if (!inputs.jump && player.vy < -150) {
    player.vy *= 0.55;
  }

  // 6. Gravity & Wall sliding
  if (!player.isVaulting) {
    if (player.isWallSliding && player.vy > 0) {
      player.vy = Math.min(player.vy + (GRAVITY * 0.4) * clampedDt, WALL_SLIDE_MAX_FALL);
    } else {
      player.vy += GRAVITY * clampedDt;
    }
  }

  // 7. Check platform horizontal movement before moving player
  const newX = player.x + player.vx * clampedDt;
  const playerBoxX: BoundingBox = {
    x: newX,
    y: player.y + 4, // shrink top
    width: player.width,
    height: Math.max(8, player.height - 14), // shrink bottom to never catch floor platform beneath feet!
  };

  let hitWall = false;
  player.wallDirection = 0;

  for (const plat of platforms) {
    // Ground platform beneath feet is never a horizontal wall
    if (plat.y >= player.y + player.height - 6) {
      continue;
    }

    // A platform the player is already standing on or within horizontally is not a side wall
    if (player.x >= plat.x && player.x + player.width <= plat.x + plat.width) {
      continue;
    }

    if (checkAABB(playerBoxX, plat)) {
      // Check if obstacle is vaultable barrier (barrier height <= 42px and player moving forward)
      const obstacleHeight = plat.height;
      const barrierTopDiff = plat.y - (player.y + player.height - 32);
      if (
        player.isGrounded &&
        !player.isSliding &&
        !player.isVaulting &&
        obstacleHeight <= 42 &&
        barrierTopDiff >= -20 &&
        (inputs.jump || inputs.action || Math.abs(player.vx) > 160)
      ) {
        player.isVaulting = true;
        player.vaultTimer = VAULT_DURATION;
        player.y = plat.y - player.height - 4;
        events.vaulted = true;
        break;
      }

      // Solid collision resolution
      if (player.vx > 0) {
        player.x = plat.x - player.width;
        player.wallDirection = 1;
      } else if (player.vx < 0) {
        player.x = plat.x + plat.width;
        player.wallDirection = -1;
      }
      player.vx = 0;
      hitWall = true;
      break;
    }
  }

  if (!hitWall) {
    player.x = newX;
  }

  // 8. Vertical movement & collision
  const newY = player.y + player.vy * clampedDt;
  const playerBoxY: BoundingBox = {
    x: player.x + 2,
    y: newY,
    width: player.width - 4,
    height: player.height,
  };

  let wasGrounded = player.isGrounded;
  player.isGrounded = false;
  player.isWallSliding = false;

  for (const plat of platforms) {
    if (checkAABB(playerBoxY, plat)) {
      if (player.vy >= 0 && player.y < plat.y) {
        // Landing on platform top
        player.y = plat.y - player.height;
        player.vy = 0;
        player.isGrounded = true;
        if (!wasGrounded) {
          events.landed = true;
        }

        // Conveyor belt or moving platform effects
        if (plat.type === 'conveyor' && plat.speed) {
          player.x += plat.speed * clampedDt;
        }
      } else if (player.vy < 0 && player.y + player.height > plat.y + plat.height) {
        // Hitting ceiling
        player.y = plat.y + plat.height;
        player.vy = 0;
      }
      break;
    }
  }

  if (!player.isGrounded) {
    player.y = newY;
    if (wasGrounded) {
      player.coyoteTimer = COYOTE_TIME;
    }
    // Check wall slide
    if (hitWall && player.vy > 0 && (inputs.left || inputs.right)) {
      player.isWallSliding = true;
    }
  }

  // 9. Hazard collisions
  const currentBox: BoundingBox = {
    x: player.x,
    y: player.y,
    width: player.width,
    height: player.height,
  };

  // Pit death check (fallen off screen)
  if (player.y > 1100) {
    player.isDead = true;
    events.died = true;
    events.deathReason = 'Fell into the abyss';
    return { player, events };
  }

  for (const hazard of hazards) {
    if (!hazard.active) continue;
    if (checkAABB(currentBox, hazard)) {
      player.isDead = true;
      events.died = true;
      events.deathReason = hazard.type === 'laser' ? 'Vaporized by laser grid' : 'Crushed by hazard';
      return { player, events };
    }
  }

  // 10. Drone searchlights & contact
  for (const drone of drones) {
    const dx = (player.x + player.width / 2) - drone.x;
    const dy = (player.y + player.height / 2) - drone.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Direct collision with drone body
    if (dist < drone.radius + player.width / 2) {
      player.isDead = true;
      events.died = true;
      events.deathReason = 'Eliminated by surveillance drone';
      return { player, events };
    }

    // Drone searchlight detection zone
    if (drone.state === 'patrol') {
      const droneFacingAngle = drone.detectionAngle; // radians
      const angleToPlayer = Math.atan2(dy, dx);
      let angleDiff = Math.abs(angleToPlayer - droneFacingAngle);
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      angleDiff = Math.abs(angleDiff);

      if (dist < drone.detectionDistance && angleDiff < 0.45) {
        // Player detected! Alert drone
        drone.state = 'alert';
        drone.alertTimer = 1.0;
      }
    } else if (drone.state === 'alert') {
      drone.alertTimer -= clampedDt;
      if (drone.alertTimer <= 0) {
        drone.state = 'attack';
      }
    } else if (drone.state === 'attack') {
      // Aggressive chase towards player
      const moveSpeed = drone.speed * 1.5;
      drone.x += (dx / (dist || 1)) * moveSpeed * clampedDt;
      drone.y += (dy / (dist || 1)) * moveSpeed * clampedDt;
    }
  }

  // 11. Checkpoints
  for (const cp of checkpoints) {
    if (!cp.reached && Math.abs((player.x + player.width / 2) - cp.x) < 40 && Math.abs(player.y - cp.y) < 100) {
      cp.reached = true;
      player.currentCheckpoint = { x: cp.x, y: cp.y - player.height };
      events.checkpointReached = cp.name;
      player.score += 250;
    }
  }

  // 12. Collectibles (data cubes, lore chips)
  for (const col of collectibles) {
    if (!col.collected) {
      const colBox: BoundingBox = { x: col.x - 12, y: col.y - 12, width: 24, height: 24 };
      if (checkAABB(currentBox, colBox)) {
        col.collected = true;
        player.score += col.value;
        events.collected = col;
      }
    }
  }

  // 13. Goal / Finish line check
  if (player.x >= finishX) {
    player.hasWon = true;
    events.reachedFinish = true;
  }

  // 14. Determine animation state
  player.animTimer += clampedDt;
  if (player.isVaulting) {
    player.animationState = 'vaulting';
  } else if (player.isSliding) {
    player.animationState = 'sliding';
  } else if (player.isWallSliding) {
    player.animationState = 'wall_slide';
  } else if (!player.isGrounded) {
    if (player.vy < -80) {
      player.animationState = 'jumping';
    } else {
      player.animationState = 'falling';
    }
  } else if (Math.abs(player.vx) > MAX_RUN_SPEED * 0.95) {
    player.animationState = 'sprinting';
  } else if (Math.abs(player.vx) > 20) {
    player.animationState = 'running';
  } else {
    player.animationState = 'idle';
  }

  return { player, events };
}
