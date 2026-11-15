(() => {
  'use strict';

  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const PROGS = [
    { roots: [48, 45, 41, 43], iv: [[0, 7, 11, 16], [0, 7, 10, 15], [0, 7, 11, 16], [0, 7, 9, 14]] },
    { roots: [45, 41, 43, 40], iv: [[0, 7, 10, 15], [0, 7, 12, 16], [0, 7, 10, 14], [0, 7, 10, 15]] },
    { roots: [40, 41, 40, 46], iv: [[0, 7, 10, 13], [0, 7, 10, 13], [0, 6, 10, 15], [0, 6, 9, 13]] }
  ];

  class AeroSinematicAudioEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.boostGain = null;
      this.compressor = null;
      this.analyser = null;
      this.padFilter = null;
      this.padOscs = [];
      this.subOsc = null;
      this.subGain = null;
      this.windGain = null;
      this.windFilter = null;
      this.crackleGain = null;
      this.humGain = null;
      this.musicBus = null;
      this.reverbSend = null;
      this.delaySend = null;
      this.delay = null;
      this.noiseBuf = null;
      this.schedTimer = null;
      this.nextTime = 0;
      this.step = 0;
      this.tension = 0;
      this.targetTension = 0;
      this.isInitialized = false;
      this.isPlaying = false;
      this.currentMode = 'air';
      this.currentStage = 'stage1';
      this.currentFireRisk = 25;
      this.currentBortle = 3;
    }

    init(volume) {
      if (this.isInitialized) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = (this.ctx = new AudioCtx());
      const sr = ctx.sampleRate;

      this.compressor = ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -16;
      this.compressor.knee.value = 18;
      this.compressor.ratio.value = 6;
      this.compressor.attack.value = 0.005;
      this.compressor.release.value = 0.2;

      this.boostGain = ctx.createGain();
      this.boostGain.gain.value = 2.0;

      this.masterGain = ctx.createGain();
      this.masterGain.gain.value = volume;

      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.85;

      this.masterGain.connect(this.boostGain);
      this.boostGain.connect(this.compressor);
      this.compressor.connect(this.analyser);
      this.analyser.connect(ctx.destination);

      this.musicBus = ctx.createGain();
      this.musicBus.connect(this.masterGain);

      const convolver = ctx.createConvolver();
      convolver.buffer = this._makeImpulse(2.8, 2.6);
      this.reverbSend = ctx.createGain();
      this.reverbSend.gain.value = 0.38;
      this.musicBus.connect(this.reverbSend);
      this.reverbSend.connect(convolver);
      convolver.connect(this.masterGain);

      this.delay = ctx.createDelay(1.5);
      this.delay.delayTime.value = 0.75;
      const fb = ctx.createGain();
      fb.gain.value = 0.34;
      const delayLP = ctx.createBiquadFilter();
      delayLP.type = 'lowpass';
      delayLP.frequency.value = 2600;
      this.delaySend = ctx.createGain();
      this.delaySend.gain.value = 0.28;
      this.musicBus.connect(this.delaySend);
      this.delaySend.connect(this.delay);
      this.delay.connect(delayLP);
      delayLP.connect(fb);
      fb.connect(this.delay);
      delayLP.connect(this.masterGain);
      delayLP.connect(convolver);

      this.padFilter = ctx.createBiquadFilter();
      this.padFilter.type = 'lowpass';
      this.padFilter.frequency.value = 1500;
      this.padFilter.Q.value = 0.8;
      this.padFilter.connect(this.musicBus);

      [130.81, 196.0, 246.94, 329.63].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.value = f;
        g.gain.value = 0.11;
        osc.connect(g);
        g.connect(this.padFilter);
        osc.start();
        this.padOscs.push({ osc, gain: g });
      });

      const padLfo = ctx.createOscillator();
      const padLfoGain = ctx.createGain();
      padLfo.frequency.value = 0.07;
      padLfoGain.gain.value = 160;
      padLfo.connect(padLfoGain);
      padLfoGain.connect(this.padFilter.frequency);
      padLfo.start();

      this.subOsc = ctx.createOscillator();
      this.subOsc.type = 'sine';
      this.subOsc.frequency.value = 65.41;
      this.subGain = ctx.createGain();
      this.subGain.gain.value = 0.14;
      this.subOsc.connect(this.subGain);
      this.subGain.connect(this.masterGain);
      this.subOsc.start();

      this.noiseBuf = ctx.createBuffer(1, sr, sr);
      const nd = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < sr; i++) nd[i] = Math.random() * 2 - 1;

      const bufSize = sr * 2;
      const pinkBuf = ctx.createBuffer(1, bufSize, sr);
      const data = pinkBuf.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufSize; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555;
        b1 = 0.99332 * b1 + w * 0.075;
        b2 = 0.969 * b2 + w * 0.1538;
        data[i] = (b0 + b1 + b2 + w * 0.5362) * 0.05;
      }
      const windSrc = ctx.createBufferSource();
      windSrc.buffer = pinkBuf;
      windSrc.loop = true;
      this.windFilter = ctx.createBiquadFilter();
      this.windFilter.type = 'bandpass';
      this.windFilter.frequency.value = 550;
      this.windFilter.Q.value = 0.6;
      this.windGain = ctx.createGain();
      this.windGain.gain.value = 0.04;
      windSrc.connect(this.windFilter);
      this.windFilter.connect(this.windGain);
      this.windGain.connect(this.masterGain);
      windSrc.start();

      const windLfo = ctx.createOscillator();
      const windLfoGain = ctx.createGain();
      windLfo.frequency.value = 0.11;
      windLfoGain.gain.value = 260;
      windLfo.connect(windLfoGain);
      windLfoGain.connect(this.windFilter.frequency);
      windLfo.start();

      const crackleBuf = ctx.createBuffer(1, bufSize, sr);
      const cData = crackleBuf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        cData[i] = Math.random() > 0.982 ? (Math.random() * 2 - 1) * 0.65 : 0;
      }
      const crackleSrc = ctx.createBufferSource();
      crackleSrc.buffer = crackleBuf;
      crackleSrc.loop = true;
      const crackleFilter = ctx.createBiquadFilter();
      crackleFilter.type = 'bandpass';
      crackleFilter.frequency.value = 1100;
      this.crackleGain = ctx.createGain();
      this.crackleGain.gain.value = 0;
      crackleSrc.connect(crackleFilter);
      crackleFilter.connect(this.crackleGain);
      this.crackleGain.connect(this.masterGain);
      crackleSrc.start();

      const hum = ctx.createOscillator();
      hum.type = 'sawtooth';
      hum.frequency.value = 100;
      const humLP = ctx.createBiquadFilter();
      humLP.type = 'lowpass';
      humLP.frequency.value = 320;
      this.humGain = ctx.createGain();
      this.humGain.gain.value = 0;
      hum.connect(humLP);
      humLP.connect(this.humGain);
      this.humGain.connect(this.masterGain);
      hum.start();

      this.schedTimer = setInterval(() => this._tick(), 30);
      this.isInitialized = true;
    }

    _makeImpulse(sec, decay) {
      const sr = this.ctx.sampleRate;
      const len = Math.floor(sr * sec);
      const buf = this.ctx.createBuffer(2, len, sr);
      for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
      return buf;
    }

    _computeTension(mode, stage, fireRisk, bortle) {
      if (mode === 'fire') return clamp(fireRisk / 100, 0, 1);
      if (mode === 'light') return clamp((bortle - 1) / 8, 0, 1);
      const map = { stage1: 0.0, stage2: 0.2, stage3: 0.5, stage4: 0.78, stage5: 1.0 };
      return map[stage] !== undefined ? map[stage] : 0;
    }

    _bpm() {
      return lerp(60, 152, Math.pow(this.tension, 1.15));
    }

    _tick() {
      if (!this.isPlaying || !this.ctx) return;
      this.tension += (this.targetTension - this.tension) * 0.02;
      const s16 = 60 / this._bpm() / 4;
      this.delay.delayTime.setTargetAtTime(s16 * 3, this.ctx.currentTime, 0.2);
      while (this.nextTime < this.ctx.currentTime + 0.25) {
        this._scheduleStep(this.step, this.nextTime, s16);
        this.nextTime += s16;
        this.step++;
      }
    }

    _scheduleStep(step, t, s16) {
      const T = this.tension;
      const tier = T < 0.34 ? 0 : T < 0.68 ? 1 : 2;
      const pi = step % 16;
      const bar = Math.floor(step / 16);
      const prog = PROGS[tier];
      const ci = bar % 4;
      const off = this.currentMode === 'fire' ? -3 : 0;
      const root = prog.roots[ci] + off;
      const iv = prog.iv[ci];
      const note = (k, oct) => mtof(root + iv[k % 4] + oct);
      const e = pi % 2 === 0;
      const q = pi % 4 === 0;

      if (pi === 0) this._setChord(root, iv, t);

      if (tier === 0) {
        if (e && Math.random() < 0.55) {
          const k = [0, 1, 2, 3, 2, 1, 3, 2][(pi / 2) % 8];
          this._pluck(note(k, 24), t, 2.4, 0.1, 'sine', 3800);
        }
        if (pi === 0) this._pluck(mtof(root - 12), t, 4.0, 0.12, 'sine', 500);
        if (pi === 8 && Math.random() < 0.5) this._pluck(note(3, 12), t, 3.0, 0.07, 'triangle', 2500);
        if (q && Math.random() < 0.18 && this.currentMode === 'air') this._chirp(t);
        if (this.currentMode === 'light' && e && Math.random() < 0.22) {
          const star = [84, 86, 88, 91, 93][Math.floor(Math.random() * 5)];
          this._pluck(mtof(star), t, 2.6, 0.05, 'sine', 5000);
        }
      } else if (tier === 1) {
        if (e && Math.random() < 0.85) {
          const k = [0, 2, 1, 3, 2, 1, 3, 0][(pi / 2) % 8];
          this._pluck(note(k, 12), t, 0.7, 0.1, 'triangle', 2400);
        }
        if (q) this._pluck(mtof(root - 12), t, 0.5, 0.14, 'sine', 400);
        if (pi % 8 === 0) this._kick(t, 0.35);
        if (pi % 4 === 2) this._hat(t, 0.05);
        if (this.currentMode === 'fire' && pi % 8 === 6) this._kick(t, 0.3);
      } else {
        const k = [0, 2, 1, 3, 0, 2, 3, 1][pi % 8];
        this._pluck(note(k, pi % 8 >= 4 ? 24 : 12), t, 0.22, 0.085, 'sawtooth', 2200 + T * 1500);
        if (e) this._pluck(mtof(root - 12), t, 0.18, 0.16, 'square', 300);
        if (q) this._kick(t, 0.55);
        if (pi % 2 === 1) this._hat(t, 0.07);
        if (pi % 8 === 4) this._alarm(t, s16 * 2, mtof(root + (ci % 2 ? 30 : 24)));
        if (this.currentMode === 'fire' && pi % 8 === 6) this._kick(t, 0.5);
      }
    }

    _setChord(root, iv, t) {
      const when = Math.max(t, this.ctx.currentTime);
      this.padOscs.forEach((v, i) => v.osc.frequency.setTargetAtTime(mtof(root + iv[i]), when, 0.3));
      this.subOsc.frequency.setTargetAtTime(mtof(root - 12), when, 0.3);
    }

    _pluck(freq, t, dur, vol, type = 'sine', cut = 3000) {
      const ctx = this.ctx;
      const o = ctx.createOscillator();
      const o2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      const f = ctx.createBiquadFilter();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      o2.type = 'sine';
      o2.frequency.value = freq * 2;
      g2.gain.value = 0.22;
      f.type = 'lowpass';
      f.frequency.setValueAtTime(cut, t);
      f.frequency.exponentialRampToValueAtTime(Math.max(200, cut * 0.25), t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(f);
      o2.connect(g2);
      g2.connect(f);
      f.connect(g);
      g.connect(this.musicBus);
      o.start(t);
      o2.start(t);
      o.stop(t + dur + 0.1);
      o2.stop(t + dur + 0.1);
    }

    _kick(t, vol) {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(130, t);
      o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);
      o.connect(g);
      g.connect(this.masterGain);
      o.start(t);
      o.stop(t + 0.3);
    }

    _hat(t, vol) {
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuf;
      const hp = this.ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 7500;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      src.connect(hp);
      hp.connect(g);
      g.connect(this.masterGain);
      src.start(t, Math.random() * 0.8);
      src.stop(t + 0.06);
    }

    _alarm(t, dur, freq) {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'square';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.035, t + 0.01);
      g.gain.setValueAtTime(0.035, t + dur * 0.7);
      g.gain.linearRampToValueAtTime(0.0001, t + dur);
      o.connect(g);
      g.connect(this.musicBus);
      o.start(t);
      o.stop(t + dur + 0.02);
    }

    _chirp(t) {
      const f0 = 2300 + Math.random() * 1200;
      for (let n = 0; n < 2; n++) {
        const s = t + n * 0.16;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(f0, s);
        o.frequency.linearRampToValueAtTime(f0 * 1.35, s + 0.05);
        o.frequency.linearRampToValueAtTime(f0 * 0.95, s + 0.11);
        g.gain.setValueAtTime(0.0001, s);
        g.gain.linearRampToValueAtTime(0.03, s + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, s + 0.12);
        o.connect(g);
        g.connect(this.musicBus);
        o.start(s);
        o.stop(s + 0.14);
      }
    }

    playNote(freq, decay, vol, wave = 'sine') {
      if (!this.ctx) return;
      this._pluck(freq, this.ctx.currentTime, decay, vol, wave, 3000);
    }

    updateSonification(mode, metrics, stage, fireRisk, bortle, isMuted, volume) {
      this.currentMode = mode;
      this.currentStage = stage;
      this.currentFireRisk = fireRisk;
      this.currentBortle = bortle;
      this.targetTension = this._computeTension(mode, stage, fireRisk, bortle);
      if (!this.isInitialized || !this.isPlaying) return;

      const now = this.ctx.currentTime;
      const T = this.targetTension;
      this.masterGain.gain.setTargetAtTime(isMuted ? 0 : volume, now, 0.1);

      this.padFilter.frequency.setTargetAtTime(lerp(1700, 650, T) * (mode === 'fire' ? 0.8 : 1), now, 0.5);
      this.subGain.gain.setTargetAtTime(lerp(0.12, 0.2, T), now, 0.4);
      this.reverbSend.gain.setTargetAtTime(lerp(0.38, 0.1, T), now, 0.5);
      this.delaySend.gain.setTargetAtTime(lerp(0.28, 0.12, T), now, 0.5);
      const spread = 3 + T * 28; // gerildikçe akort bozulur
      this.padOscs.forEach((v, i) => v.osc.detune.setTargetAtTime((i % 2 ? 1 : -1) * spread, now, 0.4));

      this.windGain.gain.setTargetAtTime(0.03 + 0.12 * T, now, 0.4);

      let crackle = 0;
      if (mode === 'fire') crackle = T >= 0.5 ? 0.05 + 0.2 * T : 0;
      else if (mode === 'air') crackle = T >= 0.45 ? (T - 0.4) * 0.15 : 0;
      else crackle = bortle >= 5 ? 0.04 * T : 0;
      this.crackleGain.gain.setTargetAtTime(crackle, now, 0.3);

      this.humGain.gain.setTargetAtTime(mode === 'light' ? T * 0.03 : 0, now, 0.4);
    }

    async start(volume, mode, metrics, stage, fireRisk, bortle, isMuted) {
      this.init(volume);
      if (this.ctx.state === 'suspended') await this.ctx.resume();
      this.isPlaying = true;
      this.nextTime = this.ctx.currentTime + 0.08;
      this.currentMode = mode;
      this.targetTension = this._computeTension(mode, stage, fireRisk, bortle);
      this.tension = this.targetTension;
      this.updateSonification(mode, metrics, stage, fireRisk, bortle, isMuted, volume);
    }

    stop() {
      this.isPlaying = false;
      if (this.isInitialized) {
        this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
      }
    }

    setVolume(val, isMuted) {
      if (this.isInitialized) {
        this.masterGain.gain.setTargetAtTime(isMuted ? 0 : val, this.ctx.currentTime, 0.05);
      }
    }

    getAnalyser() { return this.analyser; }
  }

  window.AeroAudioEngine = AeroSinematicAudioEngine;
})();
