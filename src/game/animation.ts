import { PlayerAnimationState, PlayerState } from './types';

export interface SilhouetteBone {
  x: number;
  y: number;
}

export function drawSilhouetteEcho(
  ctx: CanvasRenderingContext2D,
  player: PlayerState,
  screenX: number,
  screenY: number,
  accentColor: string = '#06b6d4'
) {
  const { animationState, animTimer, facing, vx, vy, isSprinting } = player;

  ctx.save();
  ctx.translate(screenX + player.width / 2, screenY + player.height);
  ctx.scale(facing, 1);

  // Ground level is at local y = 0
  const t = animTimer;
  const speedRatio = Math.min(1.5, Math.abs(vx) / 320);

  // Default joint offsets
  let head: SilhouetteBone = { x: 2, y: -48 };
  let neck: SilhouetteBone = { x: 1, y: -42 };
  let chest: SilhouetteBone = { x: 0, y: -34 };
  let pelvis: SilhouetteBone = { x: -2, y: -24 };

  let leftKnee: SilhouetteBone = { x: 4, y: -12 };
  let leftFoot: SilhouetteBone = { x: 6, y: 0 };
  let rightKnee: SilhouetteBone = { x: -6, y: -12 };
  let rightFoot: SilhouetteBone = { x: -8, y: 0 };

  let leftElbow: SilhouetteBone = { x: 8, y: -26 };
  let leftHand: SilhouetteBone = { x: 12, y: -20 };
  let rightElbow: SilhouetteBone = { x: -8, y: -26 };
  let rightHand: SilhouetteBone = { x: -12, y: -20 };

  // --- Animation Poses ---
  if (animationState === 'idle') {
    const breathe = Math.sin(t * 3) * 1.5;
    head.y += breathe;
    chest.y += breathe * 0.8;
    pelvis.y += breathe * 0.4;
    leftFoot.x = 8;
    rightFoot.x = -8;
  } else if (animationState === 'running') {
    const cycle = t * (8 * Math.max(0.8, speedRatio));
    const legPhase = Math.sin(cycle);
    const legPhaseCos = Math.cos(cycle);

    // Dynamic forward lean
    chest.x = 6;
    head.x = 8;
    head.y = -46 + Math.abs(Math.sin(cycle * 2)) * 2;

    // Legs
    leftKnee = { x: legPhase * 16 + 2, y: -14 + Math.max(0, -legPhaseCos) * 10 };
    leftFoot = { x: legPhase * 22 + 4, y: Math.sin(cycle + 0.3) > 0 ? 0 : -8 };

    rightKnee = { x: -legPhase * 16 + 2, y: -14 + Math.max(0, legPhaseCos) * 10 };
    rightFoot = { x: -legPhase * 22 + 4, y: Math.sin(cycle + Math.PI + 0.3) > 0 ? 0 : -8 };

    // Arms swing opposite to legs
    leftHand = { x: -legPhase * 18 + 6, y: -28 + legPhaseCos * 8 };
    leftElbow = { x: -legPhase * 10 + 2, y: -30 };

    rightHand = { x: legPhase * 18 + 6, y: -28 - legPhaseCos * 8 };
    rightElbow = { x: legPhase * 10 + 2, y: -30 };
  } else if (animationState === 'sprinting') {
    const cycle = t * 13;
    const legPhase = Math.sin(cycle);
    const legPhaseCos = Math.cos(cycle);

    // Aggressive Vector sprint lean
    pelvis = { x: -6, y: -22 };
    chest = { x: 12, y: -30 };
    head = { x: 18, y: -40 + Math.abs(legPhase) * 2 };

    // Deep power stride
    leftKnee = { x: legPhase * 22 + 4, y: -16 + Math.max(0, -legPhaseCos) * 14 };
    leftFoot = { x: legPhase * 28 + 6, y: Math.sin(cycle) > 0 ? 0 : -14 };

    rightKnee = { x: -legPhase * 22 + 4, y: -16 + Math.max(0, legPhaseCos) * 14 };
    rightFoot = { x: -legPhase * 28 + 6, y: Math.sin(cycle + Math.PI) > 0 ? 0 : -14 };

    // Hard pump arms
    leftHand = { x: -legPhase * 24 + 10, y: -24 + legPhaseCos * 14 };
    leftElbow = { x: -legPhase * 14 + 4, y: -28 };

    rightHand = { x: legPhase * 24 + 10, y: -24 - legPhaseCos * 14 };
    rightElbow = { x: legPhase * 14 + 4, y: -28 };
  } else if (animationState === 'jumping') {
    // Air tuck jump
    pelvis = { x: -2, y: -28 };
    chest = { x: 4, y: -36 };
    head = { x: 6, y: -50 };

    // Lifted knees
    leftKnee = { x: 14, y: -20 };
    leftFoot = { x: 8, y: -10 };
    rightKnee = { x: -4, y: -16 };
    rightFoot = { x: -10, y: -8 };

    // Reaching upward arms
    leftElbow = { x: 12, y: -42 };
    leftHand = { x: 18, y: -52 };
    rightElbow = { x: -4, y: -38 };
    rightHand = { x: -2, y: -48 };
  } else if (animationState === 'falling') {
    // Reaching down for landing
    pelvis = { x: -2, y: -28 };
    chest = { x: 4, y: -38 };
    head = { x: 6, y: -50 };

    leftKnee = { x: 6, y: -14 };
    leftFoot = { x: 8, y: -2 };
    rightKnee = { x: -8, y: -16 };
    rightFoot = { x: -6, y: -4 };

    // Stabilizing arms
    leftHand = { x: 18, y: -34 };
    rightHand = { x: -18, y: -34 };
  } else if (animationState === 'sliding') {
    // Ultra-low parkour baseball slide
    pelvis = { x: -12, y: -8 };
    chest = { x: 6, y: -12 };
    head = { x: 14, y: -16 };

    // Stretched out front leg
    leftKnee = { x: 18, y: -6 };
    leftFoot = { x: 30, y: -4 };

    // Bent under back leg
    rightKnee = { x: -6, y: -6 };
    rightFoot = { x: -18, y: -4 };

    // Hand brushing ground for balance
    leftHand = { x: -10, y: -2 };
    leftElbow = { x: -8, y: -12 };
    rightHand = { x: 14, y: -8 };
    rightElbow = { x: 10, y: -14 };
  } else if (animationState === 'vaulting') {
    // Leaping over obstacle
    const vaultProgress = Math.min(1, t / 0.35);
    pelvis = { x: 4, y: -26 };
    chest = { x: 14, y: -32 };
    head = { x: 18, y: -42 };

    // Tucked legs clearing top
    leftKnee = { x: 16, y: -22 };
    leftFoot = { x: 20, y: -16 };
    rightKnee = { x: 4, y: -18 };
    rightFoot = { x: 8, y: -14 };

    // Hands pushing off ledge
    leftHand = { x: 4, y: -12 };
    leftElbow = { x: 8, y: -22 };
    rightHand = { x: 12, y: -14 };
    rightElbow = { x: 14, y: -24 };
  } else if (animationState === 'wall_slide') {
    // Gripping wall on the right
    pelvis = { x: -6, y: -24 };
    chest = { x: 2, y: -34 };
    head = { x: 4, y: -46 };

    leftKnee = { x: 8, y: -14 };
    leftFoot = { x: 12, y: -4 }; // foot against wall
    rightKnee = { x: -4, y: -12 };
    rightFoot = { x: -2, y: -2 };

    // Hands bracing against wall
    leftHand = { x: 14, y: -32 };
    leftElbow = { x: 8, y: -34 };
    rightHand = { x: 12, y: -22 };
    rightElbow = { x: 6, y: -26 };
  } else if (animationState === 'death') {
    // Defeat tumble
    pelvis = { x: -14, y: -12 };
    chest = { x: -22, y: -18 };
    head = { x: -30, y: -24 };

    leftKnee = { x: 6, y: -6 };
    leftFoot = { x: 16, y: -2 };
    rightKnee = { x: -4, y: -8 };
    rightFoot = { x: 4, y: -4 };

    leftHand = { x: -16, y: -4 };
    rightHand = { x: -28, y: -10 };
  } else if (animationState === 'victory') {
    // Victorious heroic stand
    pelvis = { x: 0, y: -24 };
    chest = { x: 0, y: -36 };
    head = { x: 0, y: -50 };

    leftFoot = { x: 10, y: 0 };
    rightFoot = { x: -10, y: 0 };

    // V-sign arms raised to sky
    leftElbow = { x: 14, y: -44 };
    leftHand = { x: 22, y: -58 };
    rightElbow = { x: -14, y: -44 };
    rightHand = { x: -22, y: -58 };
  }

  // --- Draw Jet-Black Silhouette Limbs with Smooth Caps ---
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const silhouetteColor = '#07080a';
  const rimLightColor = accentColor;

  // Render Back Limbs
  ctx.strokeStyle = '#050507';
  ctx.lineWidth = 5;
  // Right Leg (Back)
  ctx.beginPath();
  ctx.moveTo(pelvis.x, pelvis.y);
  ctx.lineTo(rightKnee.x, rightKnee.y);
  ctx.lineTo(rightFoot.x, rightFoot.y);
  ctx.stroke();

  // Right Arm (Back)
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(chest.x, chest.y);
  ctx.lineTo(rightElbow.x, rightElbow.y);
  ctx.lineTo(rightHand.x, rightHand.y);
  ctx.stroke();

  // Torso / Body Core
  ctx.strokeStyle = silhouetteColor;
  ctx.fillStyle = silhouetteColor;

  // Spine / Chest
  ctx.lineWidth = 11;
  ctx.beginPath();
  ctx.moveTo(pelvis.x, pelvis.y);
  ctx.lineTo(chest.x, chest.y);
  ctx.stroke();

  // Pelvis / Hips
  ctx.beginPath();
  ctx.arc(pelvis.x, pelvis.y, 6, 0, Math.PI * 2);
  ctx.fill();

  // Chest / Shoulders
  ctx.beginPath();
  ctx.arc(chest.x, chest.y, 7, 0, Math.PI * 2);
  ctx.fill();

  // Neck & Head
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(chest.x, chest.y);
  ctx.lineTo(neck.x, neck.y);
  ctx.stroke();

  // Head Silhouette
  ctx.beginPath();
  ctx.ellipse(head.x, head.y, 6.5, 7.5, 0.15, 0, Math.PI * 2);
  ctx.fill();

  // Foreground Left Leg
  ctx.lineWidth = 5.5;
  ctx.beginPath();
  ctx.moveTo(pelvis.x, pelvis.y);
  ctx.lineTo(leftKnee.x, leftKnee.y);
  ctx.lineTo(leftFoot.x, leftFoot.y);
  ctx.stroke();

  // Foreground Left Arm
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(chest.x, chest.y);
  ctx.lineTo(leftElbow.x, leftElbow.y);
  ctx.lineTo(leftHand.x, leftHand.y);
  ctx.stroke();

  // --- Vector-Style Neon Visor Band ---
  ctx.save();
  ctx.strokeStyle = rimLightColor;
  ctx.lineWidth = 2.2;
  ctx.shadowColor = rimLightColor;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  // Visor eye line facing forward
  ctx.moveTo(head.x - 1, head.y - 1.5);
  ctx.lineTo(head.x + 5.5, head.y - 0.5);
  ctx.stroke();

  // Subtle runner core light pip
  ctx.fillStyle = rimLightColor;
  ctx.beginPath();
  ctx.arc(chest.x + 2, chest.y - 1, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}
