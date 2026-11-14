/**
 * AeroJukebox — Sinematik Web Audio Sonifikasyon Motoru
 * C Lydian (Temiz), D Dorian (Orta) ve A Minor Tritone (Kirli) ambient katmanları.
 */
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

      // 4 Sesli Sinematik Pad Akoru
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

      // Analog Sub-Bass
      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = 'sine';
      this.subOsc.frequency.value = 65.41;
      this.subGain = this.ctx.createGain();
      this.subGain.gain.value = 0.12;
      this.subOsc.connect(this.subGain);
      this.subGain.connect(this.masterGain);
      this.subOsc.start();

      // Atmosferik Pembe Gürültü (Rüzgar)
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

      // Kirli Hava PM2.5 Parazit & Geiger Çıtırtısı
      const crackleBuf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const cData = crackleBuf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        cData[i] = Math.random() > 0.98 ? (Math.random() * 2 - 1) * 0.7 : 0;
      }
      const crackleSrc = this.ctx.createBufferSource();
      crackleSrc.buffer = crackleBuf;
      crackleSrc.loop = true;
      const crackleFilter = this.ctx.createBiquadFilter();
      crackleFilter.type = 'highpass';
      crackleFilter.frequency.value = 1800;
      this.crackleGain = this.ctx.createGain();
      this.crackleGain.gain.value = 0;
      crackleSrc.connect(crackleFilter);
      crackleFilter.connect(this.crackleGain);
      this.crackleGain.connect(this.masterGain);
      crackleSrc.start();

      this.padFilter.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Kristal Doğa Çanları
      this.chimeTimer = setInterval(() => {
        if (!this.isPlaying) return;
        if (this.currentStage === 'good' && Math.random() < 0.5) {
          const pentatonic = [523.25, 659.25, 783.99, 987.77, 1046.50];
          this.playCrystalNote(pentatonic[Math.floor(Math.random() * pentatonic.length)], 1.8, 0.06);
        } else if (this.currentStage === 'hazardous' && Math.random() < 0.6) {
          this.playCrystalNote(140 + Math.random() * 200, 0.05, 0.04, 'sawtooth');
        }
      }, 1600);

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

    updateSonification(metrics, stage, isMuted, volume) {
      this.currentStage = stage;
      if (!this.isInitialized || !this.isPlaying) return;
      const now = this.ctx.currentTime;
      const aqi = metrics.aqi;
      const pm25 = metrics.pm25;

      this.masterGain.gain.setTargetAtTime(isMuted ? 0 : volume, now, 0.1);

      if (aqi <= 50) {
        // C Lydian Maj9
        const chord = [130.81, 196.0, 246.94, 293.66];
        this.padOscs.forEach((v, i) => v.osc.frequency.setTargetAtTime(chord[i], now, 0.4));
        this.subOsc.frequency.setTargetAtTime(65.41, now, 0.4);
        this.padFilter.frequency.setTargetAtTime(1400, now, 0.4);
        this.windGain.gain.setTargetAtTime(0.04, now, 0.3);
        this.crackleGain.gain.setTargetAtTime(0, now, 0.2);
      } else if (aqi <= 150) {
        // D Dorian Sus4
        const chord = [146.83, 196.0, 220.0, 293.66];
        this.padOscs.forEach((v, i) => v.osc.frequency.setTargetAtTime(chord[i], now, 0.4));
        this.subOsc.frequency.setTargetAtTime(73.42, now, 0.4);
        this.padFilter.frequency.setTargetAtTime(800, now, 0.4);
        this.windGain.gain.setTargetAtTime(0.08, now, 0.3);
        this.crackleGain.gain.setTargetAtTime(0.02, now, 0.2);
      } else {
        // A Minor + Tritone Gerilimi
        const chord = [110.0, 155.56, 164.81, 220.0];
        this.padOscs.forEach((v, i) => v.osc.frequency.setTargetAtTime(chord[i], now, 0.4));
        this.subOsc.frequency.setTargetAtTime(55.0, now, 0.4);
        this.padFilter.frequency.setTargetAtTime(420, now, 0.4);
        this.windGain.gain.setTargetAtTime(0.12, now, 0.3);
        const crackleLvl = Math.min(0.25, Math.max(0.05, pm25 / 180));
        this.crackleGain.gain.setTargetAtTime(crackleLvl, now, 0.2);
      }
    }

    async start(volume, metrics, stage, isMuted) {
      this.init(volume);
      if (this.ctx.state === 'suspended') await this.ctx.resume();
      this.isPlaying = true;
      this.updateSonification(metrics, stage, isMuted, volume);
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