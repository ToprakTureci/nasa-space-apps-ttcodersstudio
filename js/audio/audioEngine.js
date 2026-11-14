(() => {
  'use strict';

  class AeroSinematicAudioEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.analyser = null;
      this.padFilter = null;
      this.padOscs = [];
      this.subOsc = null;
      this.subGain = null;
      this.windGain = null;
      this.crackleGain = null;
      this.chimeTimer = null;
      this.isInitialized = false;
      this.isPlaying = false;
    }

    init(volume) {
      if (this.isInitialized) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = volume;

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.85;

      this.padFilter = this.ctx.createBiquadFilter();
      this.padFilter.type = 'lowpass';
      this.padFilter.frequency.value = 1200;

      const freqs = [130.81, 196.0, 246.94, 329.63];
      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.value = f;
        g.gain.value = 0.08;
        osc.connect(g);
        g.connect(this.padFilter);
        osc.start();
        this.padOscs.push({ osc, gain: g });
      });

      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = 'sine';
      this.subOsc.frequency.value = 65.41;
      this.subGain = this.ctx.createGain();
      this.subGain.gain.value = 0.12;
      this.subOsc.connect(this.subGain);
      this.subGain.connect(this.masterGain);
      this.subOsc.start();

      const bufSize = this.ctx.sampleRate * 2;
      const pinkBuf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = pinkBuf.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555;
        b1 = 0.99332 * b1 + white * 0.0750;
        b2 = 0.96900 * b2 + white * 0.1538;
        data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.04;
      }
      const windSrc = this.ctx.createBufferSource();
      windSrc.buffer = pinkBuf;
      windSrc.loop = true;
      const windFilter = this.ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.value = 650;
      this.windGain = this.ctx.createGain();
      this.windGain.gain.value = 0.06;
      windSrc.connect(windFilter);
      windFilter.connect(this.windGain);
      this.windGain.connect(this.masterGain);
      windSrc.start();

      const crackleBuf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const cData = crackleBuf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        cData[i] = Math.random() > 0.97 ? (Math.random() * 2 - 1) * 0.8 : 0;
      }
      const crackleSrc = this.ctx.createBufferSource();
      crackleSrc.buffer = crackleBuf;
      crackleSrc.loop = true;
      const crackleFilter = this.ctx.createBiquadFilter();
      crackleFilter.type = 'highpass';
      crackleFilter.frequency.value = 1600;
      this.crackleGain = this.ctx.createGain();
      this.crackleGain.gain.value = 0;
      crackleSrc.connect(crackleFilter);
      crackleFilter.connect(this.crackleGain);
      this.crackleGain.connect(this.masterGain);
      crackleSrc.start();

      this.padFilter.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      this.chimeTimer = setInterval(() => {
        if (!this.isPlaying) return;
        if (this.currentMode === 'fire') {
          if (this.currentFireRisk >= 50 && Math.random() < 0.7) {
            this.playCrystalNote(180 + Math.random() * 260, 0.08, 0.07, 'sawtooth');
          }
        } else {
          if (this.currentStage === 'stage1' && Math.random() < 0.6) {
            const notes = [523.25, 659.25, 783.99, 987.77, 1046.50];
            this.playCrystalNote(notes[Math.floor(Math.random() * notes.length)], 1.8, 0.06);
          }
        }
      }, 1500);

      this.isInitialized = true;
    }

    playCrystalNote(freq, decay, vol, wave = 'sine') {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(0.001, now);
      g.gain.exponentialRampToValueAtTime(vol, now + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, now + decay);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + decay + 0.05);
    }

    updateSonification(mode, metrics, stage, fireRisk, isMuted, volume) {
      this.currentMode = mode;
      this.currentStage = stage;
      this.currentFireRisk = fireRisk;
      if (!this.isInitialized || !this.isPlaying) return;

      const now = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(isMuted ? 0 : volume, now, 0.1);

      // YANGIN MODU SES MOTORU
      if (mode === 'fire') {
        if (fireRisk >= 50) {
          const fireChord = [98.0, 146.83, 174.61, 220.0];
          this.padOscs.forEach((v, i) => v.osc.frequency.setTargetAtTime(fireChord[i], now, 0.3));
          this.subOsc.frequency.setTargetAtTime(49.0, now, 0.3);
          this.padFilter.frequency.setTargetAtTime(650, now, 0.3);
          this.windGain.gain.setTargetAtTime(0.14, now, 0.2);
          this.crackleGain.gain.setTargetAtTime(0.25, now, 0.2);
        } else {
          const dryChord = [130.81, 164.81, 196.0, 246.94];
          this.padOscs.forEach((v, i) => v.osc.frequency.setTargetAtTime(dryChord[i], now, 0.4));
          this.subOsc.frequency.setTargetAtTime(65.41, now, 0.4);
          this.padFilter.frequency.setTargetAtTime(1000, now, 0.4);
          this.windGain.gain.setTargetAtTime(0.06, now, 0.2);
          this.crackleGain.gain.setTargetAtTime(0.01, now, 0.2);
        }
        return;
      }

      // HAVA MODU SES MOTORU (5 EVRE)
      const aqi = metrics.aqi;
      const pm25 = metrics.pm25;

      if (stage === 'stage1') {
        const chord = [130.81, 164.81, 196.0, 246.94];
        this.padOscs.forEach((v, i) => v.osc.frequency.setTargetAtTime(chord[i], now, 0.4));
        this.subOsc.frequency.setTargetAtTime(65.41, now, 0.4);
        this.padFilter.frequency.setTargetAtTime(1600, now, 0.4);
        this.windGain.gain.setTargetAtTime(0.03, now, 0.3);
        this.crackleGain.gain.setTargetAtTime(0, now, 0.2);
      } else if (stage === 'stage2') {
        const chord = [130.81, 196.0, 246.94, 293.66];
        this.padOscs.forEach((v, i) => v.osc.frequency.setTargetAtTime(chord[i], now, 0.4));
        this.subOsc.frequency.setTargetAtTime(65.41, now, 0.4);
        this.padFilter.frequency.setTargetAtTime(1300, now, 0.4);
        this.windGain.gain.setTargetAtTime(0.05, now, 0.3);
        this.crackleGain.gain.setTargetAtTime(0, now, 0.2);
      } else if (stage === 'stage3') {
        const chord = [146.83, 196.0, 220.0, 261.63];
        this.padOscs.forEach((v, i) => v.osc.frequency.setTargetAtTime(chord[i], now, 0.4));
        this.subOsc.frequency.setTargetAtTime(73.42, now, 0.4);
        this.padFilter.frequency.setTargetAtTime(950, now, 0.4);
        this.windGain.gain.setTargetAtTime(0.08, now, 0.3);
        this.crackleGain.gain.setTargetAtTime(0.02, now, 0.2);
      } else if (stage === 'stage4') {
        const chord = [164.81, 196.0, 246.94, 293.66];
        this.padOscs.forEach((v, i) => v.osc.frequency.setTargetAtTime(chord[i], now, 0.4));
        this.subOsc.frequency.setTargetAtTime(82.41, now, 0.4);
        this.padFilter.frequency.setTargetAtTime(650, now, 0.4);
        this.windGain.gain.setTargetAtTime(0.11, now, 0.3);
        this.crackleGain.gain.setTargetAtTime(0.05, now, 0.2);
      } else {
        const chord = [110.0, 155.56, 164.81, 220.0];
        this.padOscs.forEach((v, i) => v.osc.frequency.setTargetAtTime(chord[i], now, 0.4));
        this.subOsc.frequency.setTargetAtTime(55.0, now, 0.4);
        this.padFilter.frequency.setTargetAtTime(420, now, 0.4);
        this.windGain.gain.setTargetAtTime(0.14, now, 0.3);
        const crackleLvl = Math.min(0.25, Math.max(0.06, pm25 / 180));
        this.crackleGain.gain.setTargetAtTime(crackleLvl, now, 0.2);
      }
    }

    async start(volume, mode, metrics, stage, fireRisk, isMuted) {
      this.init(volume);
      if (this.ctx.state === 'suspended') await this.ctx.resume();
      this.isPlaying = true;
      this.updateSonification(mode, metrics, stage, fireRisk, isMuted, volume);
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
