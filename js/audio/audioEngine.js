(() => {
  'use strict';

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
      this.crackleGain = null;
      this.motifTimer = null;
      this.motifStep = 0;
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
      this.ctx = new AudioCtx();

      // SES YÜKSELTME VE KORUMA ZİNCİRİ (Compressor + 2.2x Makeup Boost)
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -16;
      this.compressor.knee.value = 18;
      this.compressor.ratio.value = 5;

      this.boostGain = this.ctx.createGain();
      this.boostGain.gain.value = 2.2;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = volume;

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.85;

      this.padFilter = this.ctx.createBiquadFilter();
      this.padFilter.type = 'lowpass';
      this.padFilter.frequency.value = 1200;
      this.padFilter.Q.value = 1.0;

      // 4 Sesli Zengin Pad
      const freqs = [130.81, 196.0, 246.94, 329.63];
      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.value = f;
        g.gain.value = 0.13;
        osc.connect(g);
        g.connect(this.padFilter);
        osc.start();
        this.padOscs.push({ osc, gain: g });
      });

      // Derin Sinematik Sub-Bass
      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = 'sine';
      this.subOsc.frequency.value = 65.41;
      this.subGain = this.ctx.createGain();
      this.subGain.gain.value = 0.22;
      this.subOsc.connect(this.subGain);
      this.subGain.connect(this.masterGain);
      this.subOsc.start();

      // Atmosferik Rüzgar (Pembe Gürültü)
      const bufSize = this.ctx.sampleRate * 2;
      const pinkBuf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = pinkBuf.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufSize; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555;
        b1 = 0.99332 * b1 + w * 0.0750;
        b2 = 0.96900 * b2 + w * 0.1538;
        data[i] = (b0 + b1 + b2 + w * 0.5362) * 0.05;
      }
      const windSrc = this.ctx.createBufferSource();
      windSrc.buffer = pinkBuf;
      windSrc.loop = true;
      const windFilter = this.ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.value = 550;
      this.windGain = this.ctx.createGain();
      this.windGain.gain.value = 0.07;
      windSrc.connect(windFilter);
      windFilter.connect(this.windGain);
      this.windGain.connect(this.masterGain);
      windSrc.start();

      // Yangın / Analog Çıtırtı Jeneratörü
      const crackleBuf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const cData = crackleBuf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        cData[i] = Math.random() > 0.982 ? (Math.random() * 2 - 1) * 0.65 : 0;
      }
      const crackleSrc = this.ctx.createBufferSource();
      crackleSrc.buffer = crackleBuf;
      crackleSrc.loop = true;
      const crackleFilter = this.ctx.createBiquadFilter();
      crackleFilter.type = 'bandpass';
      crackleFilter.frequency.value = 1100;
      this.crackleGain = this.ctx.createGain();
      this.crackleGain.gain.value = 0;
      crackleSrc.connect(crackleFilter);
      crackleFilter.connect(this.crackleGain);
      this.crackleGain.connect(this.masterGain);
      crackleSrc.start();

      // Ses Çıkış Zinciri
      this.padFilter.connect(this.masterGain);
      this.masterGain.connect(this.boostGain);
      this.boostGain.connect(this.compressor);
      this.compressor.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // HER EVRE VE MOD İÇİN ÖZGÜN MELODİK MOTİF DÖNGÜSÜ
      this.motifTimer = setInterval(() => {
        if (!this.isPlaying) return;
        this.motifStep = (this.motifStep + 1) % 8;

        // 1. IŞIK KİRLİLİĞİ MOTİFLERİ
        if (this.currentMode === 'light') {
          if (this.currentBortle <= 3) {
            const starNotes = [523.25, 659.25, 783.99, 987.77, 1174.66];
            if (this.motifStep % 2 === 0) {
              this.playNote(starNotes[Math.floor(Math.random() * starNotes.length)], 2.0, 0.09, 'sine');
            }
          } else if (this.currentBortle >= 7) {
            const neonNotes = [220, 261.63, 329.63, 293.66];
            this.playNote(neonNotes[this.motifStep % 4], 0.25, 0.08, 'triangle');
          }
          return;
        }

        // 2. YANGIN MODU MOTİFLERİ
        if (this.currentMode === 'fire') {
          if (this.currentFireRisk >= 60 && this.motifStep % 2 === 0) {
            this.playNote(98.0, 0.45, 0.14, 'triangle');
          }
          return;
        }

        // 3. HAVA KALİTESİ (5 EVRE AYRI MOTİFLER)
        if (this.currentStage === 'stage1') {
          const notes = [523.25, 659.25, 783.99, 987.77, 1046.50];
          if (Math.random() < 0.7) {
            this.playNote(notes[Math.floor(Math.random() * notes.length)], 2.2, 0.09, 'sine');
          }
        } else if (this.currentStage === 'stage2') {
          const kalimba = [392.0, 493.88, 587.33, 659.25];
          if (this.motifStep % 2 === 0) {
            this.playNote(kalimba[(this.motifStep / 2) % 4], 0.8, 0.1, 'triangle');
          }
        } else if (this.currentStage === 'stage3') {
          const dorian = [440.0, 392.0, 349.23, 293.66];
          if (this.motifStep % 2 === 0) {
            this.playNote(dorian[(this.motifStep / 2) % 4], 1.1, 0.09, 'sine');
          }
        } else if (this.currentStage === 'stage4') {
          if (this.motifStep % 2 === 0) {
            this.playNote(110.0, 0.55, 0.14, 'sine');
          }
        } else {
          if (this.motifStep === 0 || this.motifStep === 4) {
            this.playNote(196.0, 1.4, 0.11, 'sine');
          }
        }
      }, 650);

      this.isInitialized = true;
    }

    playNote(freq, decay, vol, wave = 'sine') {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(vol, now + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, now + decay);
      osc.connect(g);
      g.connect(this.padFilter);
      osc.start(now);
      osc.stop(now + decay + 0.08);
    }

    updateSonification(mode, metrics, stage, fireRisk, bortle, isMuted, volume) {
      this.currentMode = mode;
      this.currentStage = stage;
      this.currentFireRisk = fireRisk;
      this.currentBortle = bortle;
      if (!this.isInitialized || !this.isPlaying) return;

      const now = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(isMuted ? 0 : volume, now, 0.1);

      if (mode === 'light') {
        if (bortle <= 3) {
          const chord = [130.81, 196.0, 293.66, 392.0];
          this.padOscs.forEach((v, i) => v.osc.frequency.setTargetAtTime(chord[i], now, 0.4));
          this.subOsc.frequency.setTargetAtTime(65.41, now, 0.4);
          this.padFilter.frequency.setTargetAtTime(1600, now, 0.4);
          this.windGain.gain.setTargetAtTime(0.03, now, 0.3);
          this.crackleGain.gain.setTargetAtTime(0, now, 0.2);
        } else {
          const chord = [120.0, 180.0, 240.0, 300.0];
          this.padOscs.forEach((v, i) => v.osc.frequency.setTargetAtTime(chord[i], now, 0.4));
          this.subOsc.frequency.setTargetAtTime(60.0, now, 0.4);
          this.padFilter.frequency.setTargetAtTime(750, now, 0.4);
          this.windGain.gain.setTargetAtTime(0.08, now, 0.3);
          this.crackleGain.gain.setTargetAtTime(0.04, now, 0.2);
        }
        return;
      }

      if (mode === 'fire') {
        if (fireRisk >= 50) {
          const chord = [87.31, 130.81, 164.81, 196.0];
          this.padOscs.forEach((v, i) => v.osc.frequency.setTargetAtTime(chord[i], now, 0.3));
          this.subOsc.frequency.setTargetAtTime(43.65, now, 0.3);
          this.padFilter.frequency.setTargetAtTime(550, now, 0.3);
          this.windGain.gain.setTargetAtTime(0.14, now, 0.2);
          this.crackleGain.gain.setTargetAtTime(0.22, now, 0.2);
        } else {
          const chord = [130.81, 164.81, 196.0, 246.94];
          this.padOscs.forEach((v, i) => v.osc.frequency.setTargetAtTime(chord[i], now, 0.4));
          this.subOsc.frequency.setTargetAtTime(65.41, now, 0.4);
          this.padFilter.frequency.setTargetAtTime(950, now, 0.4);
          this.windGain.gain.setTargetAtTime(0.05, now, 0.3);
          this.crackleGain.gain.setTargetAtTime(0, now, 0.2);
        }
        return;
      }

      // HAVA MODU 5 EVRE
      const profiles = {
        stage1: { c: [130.81, 164.81, 196.0, 246.94], sub: 65.41, f: 1600, w: 0.03, cr: 0 },
        stage2: { c: [130.81, 196.0, 246.94, 293.66], sub: 65.41, f: 1200, w: 0.05, cr: 0 },
        stage3: { c: [146.83, 196.0, 220.0, 261.63], sub: 73.42, f: 850, w: 0.08, cr: 0.02 },
        stage4: { c: [130.81, 164.81, 196.0, 233.08], sub: 55.0, f: 580, w: 0.11, cr: 0.05 },
        stage5: { c: [98.0, 138.59, 146.83, 207.65], sub: 41.20, f: 380, w: 0.14, cr: 0.09 }
      };
      const p = profiles[stage] || profiles.stage1;
      this.padOscs.forEach((v, i) => v.osc.frequency.setTargetAtTime(p.c[i], now, 0.4));
      this.subOsc.frequency.setTargetAtTime(p.sub, now, 0.4);
      this.padFilter.frequency.setTargetAtTime(p.f, now, 0.4);
      this.windGain.gain.setTargetAtTime(p.w, now, 0.3);
      this.crackleGain.gain.setTargetAtTime(p.cr, now, 0.3);
    }

    async start(volume, mode, metrics, stage, fireRisk, bortle, isMuted) {
      this.init(volume);
      if (this.ctx.state === 'suspended') await this.ctx.resume();
      this.isPlaying = true;
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
