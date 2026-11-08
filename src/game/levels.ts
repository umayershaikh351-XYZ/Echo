import { LevelData } from './types';

export const LEVELS: LevelData[] = [
  // ================= LEVEL 1 =================
  {
    id: 1,
    title: 'Level 1: The Awakening',
    subtitle: 'Futuristic Prison Rooftop',
    difficulty: 'Easy',
    difficultyStars: 1,
    length: 3800,
    environment: 'prison_rooftop',
    skyColorTop: '#0a0d18',
    skyColorBottom: '#181e33',
    accentColor: '#38bdf8', // Neon Sky Cyan
    fogColor: 'rgba(15, 23, 42, 0.45)',
    finishX: 3600,
    cameraMinY: -100,
    cameraMaxY: 650,
    story: {
      title: 'THE AWAKENING',
      chapter: 'CHAPTER I',
      environment: 'SURVEILLANCE PENITENTIARY 09',
      briefing: 'The year is 2097. Inside THE GRID, human movement is monitored and suppressed. You found an encrypted drive exposing their central surveillance architecture. Now you run.',
      objective: 'Master parkour momentum: Run, jump across prison gaps, and slide under security vent barriers.',
    },
    platforms: [
      // Starting landing
      { id: 'p1-1', type: 'rooftop', x: 0, y: 400, width: 600, height: 200, surfaceColor: '#1e293b', accentColor: '#38bdf8' },
      // First small hop
      { id: 'p1-2', type: 'rooftop', x: 680, y: 400, width: 450, height: 200, surfaceColor: '#1e293b', accentColor: '#38bdf8' },
      // Low pipe barrier to slide under (x: 880, y: 340, width: 30, height: 35) - clearance beneath is ~25px
      { id: 'p1-pipe1', type: 'solid', x: 880, y: 340, width: 40, height: 35, surfaceColor: '#475569', accentColor: '#ef4444' },
      // Step up platform
      { id: 'p1-3', type: 'rooftop', x: 1210, y: 350, width: 500, height: 250, surfaceColor: '#1e293b', accentColor: '#38bdf8' },
      // Small waist barrier to vault over
      { id: 'p1-barrier1', type: 'solid', x: 1450, y: 320, width: 30, height: 30, surfaceColor: '#64748b', accentColor: '#38bdf8' },
      // Gap jump to prison watchtower wing
      { id: 'p1-4', type: 'rooftop', x: 1800, y: 370, width: 550, height: 230, surfaceColor: '#1e293b', accentColor: '#38bdf8' },
      // High sliding obstacle
      { id: 'p1-pipe2', type: 'solid', x: 2050, y: 310, width: 50, height: 35, surfaceColor: '#475569', accentColor: '#ef4444' },
      // Ascending rooftops
      { id: 'p1-5', type: 'rooftop', x: 2450, y: 310, width: 400, height: 290, surfaceColor: '#1e293b', accentColor: '#38bdf8' },
      { id: 'p1-6', type: 'rooftop', x: 2950, y: 260, width: 750, height: 340, surfaceColor: '#1e293b', accentColor: '#38bdf8' },
    ],
    hazards: [
      // Gap pits between platforms are handled naturally by y > 1100
      { id: 'h1-wire', type: 'electric_wire', active: true, x: 2150, y: 460, width: 250, height: 15, color: '#38bdf8' },
    ],
    drones: [],
    checkpoints: [
      { id: 'cp1-1', x: 1260, y: 350, reached: false, name: 'Cellblock Gateway' },
      { id: 'cp1-2', x: 2480, y: 310, reached: false, name: 'Outer Perimeter' },
    ],
    collectibles: [
      { id: 'col1-1', x: 450, y: 360, type: 'data_cube', collected: false, value: 100 },
      { id: 'col1-2', x: 1000, y: 360, type: 'data_cube', collected: false, value: 100 },
      { id: 'col1-3', x: 1465, y: 280, type: 'speed_boost', collected: false, value: 150 },
      { id: 'col1-4', x: 2200, y: 330, type: 'data_cube', collected: false, value: 100 },
      { id: 'col1-5', x: 3300, y: 220, type: 'lore_chip', collected: false, value: 300 },
    ],
  },

  // ================= LEVEL 2 =================
  {
    id: 2,
    title: 'Level 2: Neon District',
    subtitle: 'Cyber City Rooftops & Drones',
    difficulty: 'Medium',
    difficultyStars: 2,
    length: 4400,
    environment: 'neon_city',
    skyColorTop: '#08051a',
    skyColorBottom: '#220b38',
    accentColor: '#f43f5e', // Neon Rose Red
    fogColor: 'rgba(34, 11, 56, 0.45)',
    finishX: 4200,
    cameraMinY: -150,
    cameraMaxY: 650,
    story: {
      title: 'NEON DISTRICT',
      chapter: 'CHAPTER II',
      environment: 'SECTOR 4 COMMERCIAL SPRAWL',
      briefing: 'You breached the prison perimeter and surfaced above the bustling neon billboards. Automated security drones are scouring the sky with sweeping searchlights. Avoid their beams.',
      objective: 'Leap across long building gaps, vault security barricades, and evade drone searchlights.',
    },
    platforms: [
      // Starting billboard deck
      { id: 'p2-1', type: 'rooftop', x: 0, y: 400, width: 550, height: 200, surfaceColor: '#170f29', accentColor: '#f43f5e' },
      // Long jump to glass atrium roof
      { id: 'p2-2', type: 'rooftop', x: 670, y: 420, width: 480, height: 200, surfaceColor: '#170f29', accentColor: '#f43f5e' },
      // Tall barrier wall requiring wall-jump
      { id: 'p2-wall1', type: 'wall', x: 1220, y: 220, width: 35, height: 250, surfaceColor: '#3b1d5c', accentColor: '#f43f5e' },
      // Elevated platform on other side
      { id: 'p2-3', type: 'rooftop', x: 1255, y: 280, width: 420, height: 320, surfaceColor: '#170f29', accentColor: '#f43f5e' },
      // Moving neon maintenance platform
      {
        id: 'p2-move1',
        type: 'moving',
        x: 1780,
        y: 320,
        width: 140,
        height: 25,
        minX: 1740,
        maxX: 2020,
        moveDirection: 'horizontal',
        speed: 80,
        surfaceColor: '#38bdf8',
        accentColor: '#38bdf8',
      },
      // Rooftop with slide under neon sign
      { id: 'p2-4', type: 'rooftop', x: 2120, y: 360, width: 600, height: 240, surfaceColor: '#170f29', accentColor: '#f43f5e' },
      { id: 'p2-sign1', type: 'solid', x: 2360, y: 300, width: 70, height: 35, surfaceColor: '#f43f5e', accentColor: '#f43f5e' },
      // Rooftop descent
      { id: 'p2-5', type: 'rooftop', x: 2820, y: 400, width: 420, height: 200, surfaceColor: '#170f29', accentColor: '#f43f5e' },
      // Final sprint strip
      { id: 'p2-6', type: 'rooftop', x: 3350, y: 320, width: 950, height: 280, surfaceColor: '#170f29', accentColor: '#f43f5e' },
    ],
    hazards: [
      { id: 'h2-laser1', type: 'laser', active: true, x: 1980, y: 480, width: 140, height: 12, color: '#f43f5e' },
      { id: 'h2-laser2', type: 'laser', active: true, x: 3240, y: 440, width: 110, height: 12, color: '#f43f5e' },
    ],
    drones: [
      {
        id: 'd2-1',
        x: 900,
        y: 280,
        originX: 900,
        originY: 280,
        radius: 18,
        patrolRange: 160,
        speed: 55,
        direction: 1,
        detectionAngle: Math.PI / 2,
        detectionDistance: 170,
        state: 'patrol',
        alertTimer: 0,
        laserCooldown: 0,
        color: '#f43f5e',
      },
      {
        id: 'd2-2',
        x: 2550,
        y: 220,
        originX: 2550,
        originY: 220,
        radius: 18,
        patrolRange: 180,
        speed: 65,
        direction: 1,
        detectionAngle: Math.PI / 2,
        detectionDistance: 190,
        state: 'patrol',
        alertTimer: 0,
        laserCooldown: 0,
        color: '#f43f5e',
      },
    ],
    checkpoints: [
      { id: 'cp2-1', x: 1300, y: 280, reached: false, name: 'Neon Arcade Spine' },
      { id: 'cp2-2', x: 2850, y: 400, reached: false, name: 'Transit Skyway' },
    ],
    collectibles: [
      { id: 'col2-1', x: 500, y: 350, type: 'data_cube', collected: false, value: 150 },
      { id: 'col2-2', x: 1240, y: 160, type: 'lore_chip', collected: false, value: 350 },
      { id: 'col2-3', x: 1870, y: 270, type: 'data_cube', collected: false, value: 150 },
      { id: 'col2-4', x: 2400, y: 350, type: 'speed_boost', collected: false, value: 200 },
      { id: 'col2-5', x: 3700, y: 270, type: 'data_cube', collected: false, value: 150 },
    ],
  },

  // ================= LEVEL 3 =================
  {
    id: 3,
    title: 'Level 3: The Industrial Fall',
    subtitle: 'Automated Foundry & Conveyors',
    difficulty: 'Medium-Hard',
    difficultyStars: 3,
    length: 5000,
    environment: 'industrial_factory',
    skyColorTop: '#100c08',
    skyColorBottom: '#29180c',
    accentColor: '#f97316', // Neon Molten Orange
    fogColor: 'rgba(41, 24, 12, 0.5)',
    finishX: 4800,
    cameraMinY: -150,
    cameraMaxY: 700,
    story: {
      title: 'THE INDUSTRIAL FALL',
      chapter: 'CHAPTER III',
      environment: 'HEAVY FABRICATION COMPLEX C',
      briefing: 'Deep inside the Grid’s automated manufacturing foundry. Robotic sorting arms, high-velocity conveyor belts, and molten thermal laser cutters defend the facility.',
      objective: 'Ride conveyor belts to build high jump momentum, time leaps past pulsating lasers, and uncover the central transmission link.',
    },
    platforms: [
      // Starting catwalk
      { id: 'p3-1', type: 'rooftop', x: 0, y: 420, width: 500, height: 200, surfaceColor: '#27201c', accentColor: '#f97316' },
      // High-speed conveyor belt moving forward!
      { id: 'p3-conv1', type: 'conveyor', x: 580, y: 420, width: 450, height: 35, speed: 120, surfaceColor: '#451a03', accentColor: '#f97316' },
      // Stepping crane platform
      { id: 'p3-2', type: 'rooftop', x: 1140, y: 340, width: 380, height: 280, surfaceColor: '#27201c', accentColor: '#f97316' },
      // Low crushing gear (slide under!)
      { id: 'p3-gear1', type: 'solid', x: 1320, y: 280, width: 60, height: 35, surfaceColor: '#78350f', accentColor: '#f97316' },
      // Vertical moving lift
      {
        id: 'p3-lift1',
        type: 'moving',
        x: 1620,
        y: 350,
        width: 130,
        height: 25,
        minY: 200,
        maxY: 420,
        moveDirection: 'vertical',
        speed: 70,
        surfaceColor: '#ea580c',
        accentColor: '#ea580c',
      },
      // Upper conduit
      { id: 'p3-3', type: 'rooftop', x: 1840, y: 220, width: 480, height: 400, surfaceColor: '#27201c', accentColor: '#f97316' },
      // Opposing conveyor belt (pushes player backward, needs sprint!)
      { id: 'p3-conv2', type: 'conveyor', x: 2420, y: 360, width: 500, height: 35, speed: -90, surfaceColor: '#451a03', accentColor: '#f97316' },
      // Laser obstacle on top of conveyor
      { id: 'p3-pipe3', type: 'solid', x: 2680, y: 300, width: 50, height: 35, surfaceColor: '#78350f', accentColor: '#f97316' },
      // Molten vat crossing
      { id: 'p3-4', type: 'rooftop', x: 3020, y: 320, width: 360, height: 300, surfaceColor: '#27201c', accentColor: '#f97316' },
      // Moving platform 2
      {
        id: 'p3-move2',
        type: 'moving',
        x: 3480,
        y: 300,
        width: 140,
        height: 25,
        minX: 3450,
        maxX: 3750,
        moveDirection: 'horizontal',
        speed: 85,
        surfaceColor: '#ea580c',
        accentColor: '#ea580c',
      },
      // Terminal factory bridge
      { id: 'p3-5', type: 'rooftop', x: 3980, y: 300, width: 900, height: 320, surfaceColor: '#27201c', accentColor: '#f97316' },
    ],
    hazards: [
      // Periodic laser barrier
      { id: 'h3-laser1', type: 'laser', active: true, interval: 2.2, timer: 0, x: 1980, y: 150, width: 12, height: 70, color: '#f97316', orientation: 'vertical' },
      { id: 'h3-laser2', type: 'laser', active: true, interval: 1.8, timer: 0.9, x: 3180, y: 250, width: 12, height: 70, color: '#f97316', orientation: 'vertical' },
      // Spikes below vat
      { id: 'h3-spikes1', type: 'spikes', active: true, x: 2920, y: 550, width: 100, height: 20, color: '#ea580c' },
    ],
    drones: [
      {
        id: 'd3-1',
        x: 2150,
        y: 160,
        originX: 2150,
        originY: 160,
        radius: 20,
        patrolRange: 150,
        speed: 70,
        direction: 1,
        detectionAngle: Math.PI / 2,
        detectionDistance: 200,
        state: 'patrol',
        alertTimer: 0,
        laserCooldown: 0,
        color: '#f97316',
      },
      {
        id: 'd3-2',
        x: 4200,
        y: 220,
        originX: 4200,
        originY: 220,
        radius: 20,
        patrolRange: 200,
        speed: 80,
        direction: 1,
        detectionAngle: Math.PI / 2,
        detectionDistance: 210,
        state: 'patrol',
        alertTimer: 0,
        laserCooldown: 0,
        color: '#f97316',
      },
    ],
    checkpoints: [
      { id: 'cp3-1', x: 1200, y: 340, reached: false, name: 'Pneumatic Lift' },
      { id: 'cp3-2', x: 3060, y: 320, reached: false, name: 'Thermal Foundry' },
    ],
    collectibles: [
      { id: 'col3-1', x: 750, y: 360, type: 'data_cube', collected: false, value: 200 },
      { id: 'col3-2', x: 1680, y: 170, type: 'lore_chip', collected: false, value: 400 },
      { id: 'col3-3', x: 2650, y: 320, type: 'speed_boost', collected: false, value: 250 },
      { id: 'col3-4', x: 3600, y: 240, type: 'data_cube', collected: false, value: 200 },
      { id: 'col3-5', x: 4400, y: 250, type: 'lore_chip', collected: false, value: 400 },
    ],
  },

  // ================= LEVEL 4 =================
  {
    id: 4,
    title: 'Level 4: The Last Pursuit',
    subtitle: 'High-Security Grid Citadel',
    difficulty: 'Hard',
    difficultyStars: 4,
    length: 5600,
    environment: 'high_security',
    skyColorTop: '#0b0014',
    skyColorBottom: '#2d0438',
    accentColor: '#ec4899', // Electric Magenta
    fogColor: 'rgba(45, 4, 56, 0.45)',
    finishX: 5400,
    cameraMinY: -150,
    cameraMaxY: 650,
    story: {
      title: 'THE LAST PURSUIT',
      chapter: 'CHAPTER IV',
      environment: 'INNER SANCTUM AIRWAY',
      briefing: 'The security AI has deployed hunter-killer seeker drones. Patrol frequencies are on maximum red alert. You must run at full velocity across high-altitude sky bridges to reach the Central Tower.',
      objective: 'Outrun aggressive pursuit drones, chain wall kicks, and time narrow slide clearances.',
    },
    platforms: [
      { id: 'p4-1', type: 'rooftop', x: 0, y: 380, width: 480, height: 240, surfaceColor: '#1d0b28', accentColor: '#ec4899' },
      // Quick gap to elevated ridge
      { id: 'p4-2', type: 'rooftop', x: 590, y: 350, width: 380, height: 270, surfaceColor: '#1d0b28', accentColor: '#ec4899' },
      // Barrier vault
      { id: 'p4-bar1', type: 'solid', x: 810, y: 320, width: 30, height: 30, surfaceColor: '#701a75', accentColor: '#ec4899' },
      // Double wall jump alley
      { id: 'p4-wall1', type: 'wall', x: 1080, y: 140, width: 35, height: 280, surfaceColor: '#701a75', accentColor: '#ec4899' },
      { id: 'p4-wall2', type: 'wall', x: 1240, y: 140, width: 35, height: 280, surfaceColor: '#701a75', accentColor: '#ec4899' },
      { id: 'p4-top3', type: 'rooftop', x: 1275, y: 220, width: 450, height: 400, surfaceColor: '#1d0b28', accentColor: '#ec4899' },
      // Low pipe in mid-run
      { id: 'p4-pipe1', type: 'solid', x: 1520, y: 160, width: 60, height: 35, surfaceColor: '#701a75', accentColor: '#ec4899' },
      // High-speed gap sequence
      { id: 'p4-4', type: 'rooftop', x: 1830, y: 340, width: 320, height: 280, surfaceColor: '#1d0b28', accentColor: '#ec4899' },
      { id: 'p4-5', type: 'rooftop', x: 2270, y: 300, width: 320, height: 320, surfaceColor: '#1d0b28', accentColor: '#ec4899' },
      // Moving platform in gap
      {
        id: 'p4-move1',
        type: 'moving',
        x: 2710,
        y: 280,
        width: 130,
        height: 25,
        minX: 2680,
        maxX: 2950,
        moveDirection: 'horizontal',
        speed: 100,
        surfaceColor: '#ec4899',
        accentColor: '#ec4899',
      },
      // Rooftop with rapid slide & vault combo
      { id: 'p4-6', type: 'rooftop', x: 3180, y: 320, width: 700, height: 300, surfaceColor: '#1d0b28', accentColor: '#ec4899' },
      { id: 'p4-pipe2', type: 'solid', x: 3420, y: 260, width: 60, height: 35, surfaceColor: '#701a75', accentColor: '#ec4899' },
      { id: 'p4-bar2', type: 'solid', x: 3680, y: 290, width: 30, height: 30, surfaceColor: '#701a75', accentColor: '#ec4899' },
      // Final skybridge approach
      { id: 'p4-7', type: 'rooftop', x: 4000, y: 260, width: 1500, height: 360, surfaceColor: '#1d0b28', accentColor: '#ec4899' },
    ],
    hazards: [
      { id: 'h4-laser1', type: 'laser', active: true, interval: 1.5, timer: 0.2, x: 2020, y: 270, width: 12, height: 70, color: '#ec4899', orientation: 'vertical' },
      { id: 'h4-laser2', type: 'laser', active: true, interval: 1.5, timer: 0.8, x: 4400, y: 190, width: 12, height: 70, color: '#ec4899', orientation: 'vertical' },
      { id: 'h4-laser3', type: 'laser', active: true, interval: 1.5, timer: 0.4, x: 4800, y: 190, width: 12, height: 70, color: '#ec4899', orientation: 'vertical' },
    ],
    drones: [
      {
        id: 'd4-1',
        x: 700,
        y: 240,
        originX: 700,
        originY: 240,
        radius: 20,
        patrolRange: 160,
        speed: 80,
        direction: 1,
        detectionAngle: Math.PI / 2,
        detectionDistance: 220,
        state: 'patrol',
        alertTimer: 0,
        laserCooldown: 0,
        color: '#ec4899',
      },
      {
        id: 'd4-2',
        x: 2400,
        y: 190,
        originX: 2400,
        originY: 190,
        radius: 20,
        patrolRange: 180,
        speed: 90,
        direction: 1,
        detectionAngle: Math.PI / 2,
        detectionDistance: 240,
        state: 'patrol',
        alertTimer: 0,
        laserCooldown: 0,
        color: '#ec4899',
      },
      {
        id: 'd4-chaser',
        x: 3900,
        y: 180,
        originX: 3900,
        originY: 180,
        radius: 22,
        patrolRange: 300,
        speed: 100,
        direction: 1,
        detectionAngle: Math.PI / 2,
        detectionDistance: 260,
        state: 'patrol',
        alertTimer: 0,
        laserCooldown: 0,
        color: '#ef4444',
      },
    ],
    checkpoints: [
      { id: 'cp4-1', x: 1320, y: 220, reached: false, name: 'Watchtower Spire' },
      { id: 'cp4-2', x: 3220, y: 320, reached: false, name: 'Citadel Gate' },
    ],
    collectibles: [
      { id: 'col4-1', x: 700, y: 290, type: 'data_cube', collected: false, value: 250 },
      { id: 'col4-2', x: 1160, y: 120, type: 'lore_chip', collected: false, value: 500 },
      { id: 'col4-3', x: 2350, y: 240, type: 'speed_boost', collected: false, value: 300 },
      { id: 'col4-4', x: 3500, y: 290, type: 'data_cube', collected: false, value: 250 },
      { id: 'col4-5', x: 4600, y: 200, type: 'lore_chip', collected: false, value: 500 },
    ],
  },

  // ================= LEVEL 5 =================
  {
    id: 5,
    title: 'Level 5: Freedom Protocol',
    subtitle: 'The Central Surveillance Monolith',
    difficulty: 'Very Hard',
    difficultyStars: 5,
    length: 6400,
    environment: 'central_tower',
    skyColorTop: '#030712',
    skyColorBottom: '#0f172a',
    accentColor: '#06b6d4', // Pure Cyber Cyan
    fogColor: 'rgba(6, 182, 212, 0.25)',
    finishX: 6150,
    cameraMinY: -200,
    cameraMaxY: 650,
    story: {
      title: 'FREEDOM PROTOCOL',
      chapter: 'CHAPTER V — THE FINALE',
      environment: 'THE CENTRAL MONOLITH',
      briefing: 'The crown of THE GRID. The master broadcasting transmitter is at the apex of the central spire. Override the signal broadcast, make the final leap of faith, and shut down the surveillance grid forever.',
      objective: 'Overcome the ultimate parkour challenge: Master all mechanics at blistering speed and trigger the FREEDOM PROTOCOL.',
    },
    platforms: [
      { id: 'p5-1', type: 'rooftop', x: 0, y: 400, width: 450, height: 220, surfaceColor: '#090d16', accentColor: '#06b6d4' },
      // Rapid sprint into forward conveyor
      { id: 'p5-conv1', type: 'conveyor', x: 530, y: 400, width: 450, height: 35, speed: 140, surfaceColor: '#083344', accentColor: '#06b6d4' },
      // Low pipe slide right off conveyor
      { id: 'p5-pipe1', type: 'solid', x: 800, y: 340, width: 50, height: 35, surfaceColor: '#164e63', accentColor: '#06b6d4' },
      // Elevated spire pad
      { id: 'p5-2', type: 'rooftop', x: 1080, y: 300, width: 380, height: 320, surfaceColor: '#090d16', accentColor: '#06b6d4' },
      // Triple wall vault challenge
      { id: 'p5-w1', type: 'wall', x: 1540, y: 150, width: 35, height: 280, surfaceColor: '#0891b2', accentColor: '#06b6d4' },
      { id: 'p5-w2', type: 'wall', x: 1720, y: 120, width: 35, height: 310, surfaceColor: '#0891b2', accentColor: '#06b6d4' },
      { id: 'p5-3', type: 'rooftop', x: 1755, y: 200, width: 400, height: 420, surfaceColor: '#090d16', accentColor: '#06b6d4' },
      // High-speed moving platform over void
      {
        id: 'p5-move1',
        type: 'moving',
        x: 2250,
        y: 220,
        width: 140,
        height: 25,
        minX: 2220,
        maxX: 2520,
        moveDirection: 'horizontal',
        speed: 110,
        surfaceColor: '#06b6d4',
        accentColor: '#06b6d4',
      },
      // Intermediate tower
      { id: 'p5-4', type: 'rooftop', x: 2740, y: 260, width: 420, height: 360, surfaceColor: '#090d16', accentColor: '#06b6d4' },
      { id: 'p5-pipe2', type: 'solid', x: 2950, y: 200, width: 60, height: 35, surfaceColor: '#164e63', accentColor: '#06b6d4' },
      // Vertical lift ascending to transmitter mast
      {
        id: 'p5-lift1',
        type: 'moving',
        x: 3240,
        y: 280,
        width: 130,
        height: 25,
        minY: 100,
        maxY: 320,
        moveDirection: 'vertical',
        speed: 85,
        surfaceColor: '#06b6d4',
        accentColor: '#06b6d4',
      },
      // Transmitter mast runway
      { id: 'p5-5', type: 'rooftop', x: 3460, y: 120, width: 650, height: 500, surfaceColor: '#090d16', accentColor: '#06b6d4' },
      { id: 'p5-bar1', type: 'solid', x: 3750, y: 90, width: 30, height: 30, surfaceColor: '#0891b2', accentColor: '#06b6d4' },
      { id: 'p5-pipe3', type: 'solid', x: 3950, y: 60, width: 60, height: 35, surfaceColor: '#164e63', accentColor: '#06b6d4' },
      // Final epic jump gap leading to the Monolith Apex
      { id: 'p5-conv2', type: 'conveyor', x: 4200, y: 160, width: 450, height: 35, speed: 180, surfaceColor: '#083344', accentColor: '#06b6d4' },
      // The Central Monolith
      { id: 'p5-6', type: 'rooftop', x: 4800, y: 220, width: 1500, height: 400, surfaceColor: '#090d16', accentColor: '#06b6d4' },
    ],
    hazards: [
      { id: 'h5-l1', type: 'laser', active: true, interval: 1.2, timer: 0.1, x: 2820, y: 190, width: 12, height: 70, color: '#06b6d4', orientation: 'vertical' },
      { id: 'h5-l2', type: 'laser', active: true, interval: 1.2, timer: 0.6, x: 3620, y: 50, width: 12, height: 70, color: '#06b6d4', orientation: 'vertical' },
      { id: 'h5-l3', type: 'laser', active: true, interval: 1.2, timer: 0.3, x: 5200, y: 150, width: 12, height: 70, color: '#06b6d4', orientation: 'vertical' },
      { id: 'h5-l4', type: 'laser', active: true, interval: 1.2, timer: 0.8, x: 5600, y: 150, width: 12, height: 70, color: '#06b6d4', orientation: 'vertical' },
    ],
    drones: [
      {
        id: 'd5-1',
        x: 1200,
        y: 200,
        originX: 1200,
        originY: 200,
        radius: 22,
        patrolRange: 200,
        speed: 85,
        direction: 1,
        detectionAngle: Math.PI / 2,
        detectionDistance: 240,
        state: 'patrol',
        alertTimer: 0,
        laserCooldown: 0,
        color: '#06b6d4',
      },
      {
        id: 'd5-2',
        x: 2900,
        y: 140,
        originX: 2900,
        originY: 140,
        radius: 22,
        patrolRange: 220,
        speed: 95,
        direction: 1,
        detectionAngle: Math.PI / 2,
        detectionDistance: 250,
        state: 'patrol',
        alertTimer: 0,
        laserCooldown: 0,
        color: '#06b6d4',
      },
      {
        id: 'd5-3',
        x: 5000,
        y: 120,
        originX: 5000,
        originY: 120,
        radius: 25,
        patrolRange: 350,
        speed: 110,
        direction: 1,
        detectionAngle: Math.PI / 2,
        detectionDistance: 280,
        state: 'patrol',
        alertTimer: 0,
        laserCooldown: 0,
        color: '#06b6d4',
      },
    ],
    checkpoints: [
      { id: 'cp5-1', x: 1120, y: 300, reached: false, name: 'Sub-Spire Conduit' },
      { id: 'cp5-2', x: 3520, y: 120, reached: false, name: 'Broadcast Array' },
      { id: 'cp5-3', x: 4860, y: 220, reached: false, name: 'The Monolith Apex' },
    ],
    collectibles: [
      { id: 'col5-1', x: 700, y: 340, type: 'data_cube', collected: false, value: 300 },
      { id: 'col5-2', x: 1630, y: 90, type: 'lore_chip', collected: false, value: 600 },
      { id: 'col5-3', x: 2400, y: 160, type: 'speed_boost', collected: false, value: 350 },
      { id: 'col5-4', x: 3850, y: 40, type: 'data_cube', collected: false, value: 300 },
      { id: 'col5-5', x: 5400, y: 160, type: 'lore_chip', collected: false, value: 1000 },
    ],
  },
];
