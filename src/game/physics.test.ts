import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkAABB,
  createInitialPlayerState,
  updatePhysics,
  PLAYER_NORMAL_HEIGHT,
  PLAYER_SLIDE_HEIGHT,
  JUMP_VELOCITY,
  GRAVITY,
} from './physics';
import { GameInputs, Platform, Hazard } from './types';

const EMPTY_INPUTS: GameInputs = {
  left: false,
  right: false,
  jump: false,
  slide: false,
  sprint: false,
  action: false,
};

test('AABB collision returns true on overlapping boxes', () => {
  const boxA = { x: 0, y: 0, width: 20, height: 20 };
  const boxB = { x: 10, y: 10, width: 20, height: 20 };
  const boxC = { x: 30, y: 30, width: 20, height: 20 };

  assert.equal(checkAABB(boxA, boxB), true);
  assert.equal(checkAABB(boxA, boxC), false);
});

test('Gravity pulls ungrounded player downward', () => {
  const player = createInitialPlayerState({ x: 100, y: 100 });
  const result = updatePhysics(player, EMPTY_INPUTS, [], [], [], [], [], 5000, 0.016);
  assert.ok(result.player.vy > 0, 'Velocity Y should become positive due to gravity');
  assert.ok(result.player.y > 100, 'Player Y should increase downward');
});

test('Player lands solidly on platform and is marked isGrounded', () => {
  const player = createInitialPlayerState({ x: 100, y: 180 });
  const platform: Platform = {
    id: 'ground',
    type: 'solid',
    x: 0,
    y: 200,
    width: 500,
    height: 50,
  };

  // Run a couple steps
  let state = player;
  for (let i = 0; i < 5; i++) {
    const res = updatePhysics(state, EMPTY_INPUTS, [platform], [], [], [], [], 5000, 0.02);
    state = res.player;
  }

  assert.equal(state.isGrounded, true);
  assert.equal(state.y, platform.y - state.height);
  assert.equal(state.vy, 0);
});

test('Jump launches grounded player upward', () => {
  const player = createInitialPlayerState({ x: 100, y: 200 - PLAYER_NORMAL_HEIGHT });
  player.isGrounded = true;

  const jumpInputs: GameInputs = { ...EMPTY_INPUTS, jump: true };
  const res = updatePhysics(player, jumpInputs, [], [], [], [], [], 5000, 0.016);

  assert.equal(res.events.jumped, true);
  assert.ok(res.player.vy < -400, 'Player vy should be negative upward launch');
  assert.equal(res.player.isGrounded, false);
});

test('Sliding reduces player height to PLAYER_SLIDE_HEIGHT', () => {
  const player = createInitialPlayerState({ x: 100, y: 200 - PLAYER_NORMAL_HEIGHT });
  player.isGrounded = true;

  const slideInputs: GameInputs = { ...EMPTY_INPUTS, slide: true };
  const res = updatePhysics(player, slideInputs, [], [], [], [], [], 5000, 0.016);

  assert.equal(res.events.slid, true);
  assert.equal(res.player.isSliding, true);
  assert.equal(res.player.height, PLAYER_SLIDE_HEIGHT);
});

test('Hazard collision triggers player death', () => {
  const player = createInitialPlayerState({ x: 100, y: 100 });
  const laser: Hazard = {
    id: 'laser-1',
    type: 'laser',
    active: true,
    x: 90,
    y: 90,
    width: 40,
    height: 40,
  };

  const res = updatePhysics(player, EMPTY_INPUTS, [], [laser], [], [], [], 5000, 0.016);
  assert.equal(res.events.died, true);
  assert.equal(res.player.isDead, true);
});

test('Reaching finishX triggers victory condition', () => {
  const player = createInitialPlayerState({ x: 4995, y: 100 });
  player.vx = 300; // moving at full speed
  const inputs: GameInputs = { ...EMPTY_INPUTS, right: true };
  const res = updatePhysics(player, inputs, [], [], [], [], [], 5000, 0.03);

  assert.equal(res.events.reachedFinish, true);
  assert.equal(res.player.hasWon, true);
});

test('Continuous parkour running moves player forward horizontally on platform without wall collision glitch', () => {
  const player = createInitialPlayerState({ x: 100, y: 200 - PLAYER_NORMAL_HEIGHT });
  player.isGrounded = true;
  const platform: Platform = {
    id: 'ground',
    type: 'solid',
    x: 0,
    y: 200,
    width: 600,
    height: 100,
  };

  const initialX = player.x;
  // Step physics forward 10 frames
  let state = player;
  for (let i = 0; i < 10; i++) {
    const res = updatePhysics(state, EMPTY_INPUTS, [platform], [], [], [], [], 5000, 0.02);
    state = res.player;
  }

  assert.ok(state.x > initialX, 'Player should have moved forward with continuous parkour momentum');
  assert.ok(state.vx > 0, 'Velocity X should be positive');
  assert.equal(state.isGrounded, true, 'Player should remain grounded on the platform');
});
