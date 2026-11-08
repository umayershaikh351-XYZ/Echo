class SoundSystem {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private isMuted: boolean = false;
  private sfxVolume: number = 0.8;
  private musicVolume: number = 0.5;

  // Music sequencing
  private musicTimer: number | null = null;
  private currentTrackLevel: number = 0;
  private step: number = 0;
  private bpm: number = 115;
  private lastFootstepTime: number = 0;

  private initContext() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);
    } catch (e) {
      console.warn('AudioContext not supported or blocked', e);
    }
  }

  public ensureContext() {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 1, this.ctx.currentTime, 0.05);
    }
  }

  public setVolumes(sfxVol: number, musicVol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, sfxVol));
    this.musicVolume = Math.max(0, Math.min(1, musicVol));
    if (this.ctx) {
      if (this.sfxGain) {
        this.sfxGain.gain.setTargetAtTime(this.sfxVolume, this.ctx.currentTime, 0.05);
      }
      if (this.musicGain) {
        this.musicGain.gain.setTargetAtTime(this.musicVolume, this.ctx.currentTime, 0.05);
      }
    }
  }

  // --- Sound Effects ---

  public playFootstep() {
    const now = performance.now();
    if (now - this.lastFootstepTime < 180) return; // prevent too frequent footsteps
    this.lastFootstepTime = now;

    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    // Filtered noise pop
    const bufferSize = this.ctx.sampleRate * 0.035;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600 + Math.random() * 200, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
  }

  public playJump() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(380, t + 0.12);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.14);
  }

  public playLand() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.1);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  public playSlide() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.frequency.exponentialRampToValueAtTime(320, t + 0.38);
    filter.Q.setValueAtTime(2.5, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
  }

  public playVault() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, t);
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.08);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  public playWallJump() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(360, t + 0.08);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  public playLaserZap() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(980, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.18);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.18);
  }

  public playDroneAlert() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.setValueAtTime(660, t + 0.08);
    osc.frequency.setValueAtTime(1100, t + 0.16);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  public playCheckpoint() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.07);

      gain.gain.setValueAtTime(0.25, t + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + i * 0.07);
      osc.stop(t + i * 0.07 + 0.25);
    });
  }

  public playCollectible() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, t);
    osc.frequency.exponentialRampToValueAtTime(1400, t + 0.12);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.14);
  }

  public playDeath() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    // Low sub drop
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();

    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(220, t);
    subOsc.frequency.exponentialRampToValueAtTime(30, t + 0.5);

    subGain.gain.setValueAtTime(0.45, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);

    subOsc.start(t);
    subOsc.stop(t + 0.55);
  }

  public playVictory() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const chords = [
      { freqs: [261.63, 329.63, 392.00], time: 0 },    // C major
      { freqs: [293.66, 369.99, 440.00], time: 0.18 }, // D major
      { freqs: [329.63, 415.30, 493.88], time: 0.36 }, // E major
      { freqs: [392.00, 493.88, 587.33], time: 0.6 },  // G major triumph
    ];

    chords.forEach((chord) => {
      chord.freqs.forEach((freq) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + chord.time);

        gain.gain.setValueAtTime(0.2, t + chord.time);
        gain.gain.exponentialRampToValueAtTime(0.001, t + chord.time + 0.45);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t + chord.time);
        osc.stop(t + chord.time + 0.45);
      });
    });
  }

  public playButtonClick() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, t);
    osc.frequency.exponentialRampToValueAtTime(780, t + 0.04);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  // --- Dynamic Procedural Cyberpunk Soundtrack per Level ---

  public startMusic(levelId: number) {
    this.ensureContext();
    if (!this.ctx || !this.musicGain) return;
    this.stopMusic();

    this.currentTrackLevel = levelId;
    this.step = 0;

    // Set tempo per level
    if (levelId === 1) this.bpm = 100; // The Awakening (tense slow ambient pulse)
    else if (levelId === 2) this.bpm = 118; // Neon District (fast syncopated synthwave)
    else if (levelId === 3) this.bpm = 112; // Industrial Fall (heavy mechanical groove)
    else if (levelId === 4) this.bpm = 132; // The Last Pursuit (high-speed chase thriller)
    else if (levelId === 5) this.bpm = 136; // Freedom Protocol (climax epic rush)
    else this.bpm = 105; // Menu

    const intervalMs = (60 / this.bpm / 4) * 1000; // 16th notes
    this.musicTimer = window.setInterval(() => this.tickMusic(), intervalMs);
  }

  public stopMusic() {
    if (this.musicTimer !== null) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  private tickMusic() {
    if (!this.ctx || !this.musicGain || this.isMuted || this.musicVolume <= 0.01) {
      this.step++;
      return;
    }

    const t = this.ctx.currentTime;
    const lvl = this.currentTrackLevel;
    const step16 = this.step % 16;
    const step32 = this.step % 32;

    // 1. Bassline
    let bassFreq = 55; // A1
    if (lvl === 1) {
      // D minor ambient
      const bassProg = [73.42, 73.42, 65.41, 58.27]; // D2, D2, C2, Bb1
      bassFreq = bassProg[Math.floor(step32 / 8) % bassProg.length];
    } else if (lvl === 2) {
      // F# minor synthwave
      const bassProg = [92.5, 92.5, 82.41, 73.42]; // F#2, F#2, E2, D2
      bassFreq = bassProg[Math.floor(step32 / 8) % bassProg.length];
    } else if (lvl === 3) {
      // C minor industrial
      const bassProg = [65.41, 65.41, 77.78, 58.27]; // C2, C2, Eb2, Bb1
      bassFreq = bassProg[Math.floor(step32 / 8) % bassProg.length];
    } else if (lvl === 4) {
      // E minor pursuit
      const bassProg = [82.41, 82.41, 98.0, 73.42]; // E2, E2, G2, D2
      bassFreq = bassProg[Math.floor(step32 / 8) % bassProg.length];
    } else if (lvl === 5) {
      // Epic D minor into A minor
      const bassProg = [73.42, 87.31, 98.0, 110.0]; // D2, F2, G2, A2
      bassFreq = bassProg[Math.floor(step32 / 8) % bassProg.length];
    } else {
      // Menu
      const bassProg = [65.41, 73.42, 82.41, 73.42];
      bassFreq = bassProg[Math.floor(step32 / 8) % bassProg.length];
    }

    // Trigger bass on 16th note pattern
    if (step16 % 2 === 0 || (lvl >= 4 && step16 % 4 === 3)) {
      const bassOsc = this.ctx.createOscillator();
      const bassFilter = this.ctx.createBiquadFilter();
      const bassGain = this.ctx.createGain();

      bassOsc.type = lvl === 3 ? 'sawtooth' : 'triangle';
      bassOsc.frequency.setValueAtTime(bassFreq, t);

      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(lvl >= 4 ? 420 : 320, t);
      bassFilter.Q.setValueAtTime(3, t);

      bassGain.gain.setValueAtTime(0.24, t);
      bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(this.musicGain);

      bassOsc.start(t);
      bassOsc.stop(t + 0.18);
    }

    // 2. Arpeggio / High Synth Lead
    if (step16 % 2 === 1) {
      const arpScales: Record<number, number[]> = {
        0: [261.63, 329.63, 392.0, 523.25], // C major
        1: [293.66, 349.23, 440.0, 587.33], // D minor
        2: [369.99, 440.0, 554.37, 739.99], // F# minor
        3: [261.63, 311.13, 392.0, 523.25], // C minor
        4: [329.63, 392.0, 493.88, 659.25], // E minor
        5: [293.66, 392.0, 440.0, 587.33, 880.0], // D / A minor
      };
      const scale = arpScales[lvl] || arpScales[0];
      const noteFreq = scale[(Math.floor(this.step / 2)) % scale.length];

      const arpOsc = this.ctx.createOscillator();
      const arpGain = this.ctx.createGain();

      arpOsc.type = 'sine';
      arpOsc.frequency.setValueAtTime(noteFreq, t);

      arpGain.gain.setValueAtTime(0.09, t);
      arpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

      arpOsc.connect(arpGain);
      arpGain.connect(this.musicGain);

      arpOsc.start(t);
      arpOsc.stop(t + 0.1);
    }

    // 3. Cyber Kick Beat
    if (step16 === 0 || step16 === 8 || (lvl >= 4 && (step16 === 10 || step16 === 14))) {
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();

      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(140, t);
      kickOsc.frequency.exponentialRampToValueAtTime(38, t + 0.08);

      kickGain.gain.setValueAtTime(0.3, t);
      kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      kickOsc.connect(kickGain);
      kickGain.connect(this.musicGain);

      kickOsc.start(t);
      kickOsc.stop(t + 0.09);
    }

    // 4. Snare / Hi-hat pulse on 4, 12
    if (step16 === 4 || step16 === 12) {
      const bufferSize = this.ctx.sampleRate * 0.04;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const snare = this.ctx.createBufferSource();
      snare.buffer = buffer;

      const snareFilter = this.ctx.createBiquadFilter();
      snareFilter.type = 'highpass';
      snareFilter.frequency.setValueAtTime(lvl === 3 ? 1800 : 2600, t);

      const snareGain = this.ctx.createGain();
      snareGain.gain.setValueAtTime(0.14, t);
      snareGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      snare.connect(snareFilter);
      snareFilter.connect(snareGain);
      snareGain.connect(this.musicGain);

      snare.start(t);
    }

    this.step++;
  }
}

export const audio = new SoundSystem();
