/**
 * AeroJukebox — Biyosfer Parçacık Fizik Motoru
 * Evre 1: Oksijen Küreleri & Polen (Temiz)
 * Evre 2: Dökülen Yaprak Fiziği & Rüzgar Süzülmesi (Orta)
 * Evre 3: PM2.5 / PM10 Toksik Duman & Kül Fırtınası (Kirli)
 */
(() => {
  'use strict';

  class BiosphereParticleSystem {
    constructor() {
      this.leaves = [];
      this.oxygenOrbs = [];
      this.smogParticles = [];
      this.maxLeaves = 35;
      this.maxOxygen = 20;
      this.maxSmog = 65;
    }

    init(w, h) {
      this.leaves = Array.from({ length: this.maxLeaves }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.75,
        vy: 0.6 + Math.random() * 0.85,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.05,
        size: 3 + Math.random() * 3.5,
        alpha: 0.65 + Math.random() * 0.35
      }));

      this.oxygenOrbs = Array.from({ length: this.maxOxygen }, () => ({
        x: w * 0.25 + Math.random() * (w * 0.5),
        y: h * 0.3 + Math.random() * (h * 0.5),
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(0.35 + Math.random() * 0.7),
        size: 1.5 + Math.random() * 2.5,
        alpha: 0.3 + Math.random() * 0.6,
        pulse: Math.random() * Math.PI * 2
      }));

      this.smogParticles = Array.from({ length: this.maxSmog }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 1.1 + Math.random() * 1.8,
        vy: (Math.random() - 0.5) * 0.45,
        size: 1.8 + Math.random() * 4.2,
        alpha: 0.15 + Math.random() * 0.45,
        isToxic: Math.random() > 0.65
      }));
    }

    updateAndRender(ctx, w, h, stage, reduceMotion) {
      if (this.leaves.length === 0) this.init(w, h);

      // EVRE 1: CANLI OKSİJEN & POLEN
      if (stage === 'good') {
        this.oxygenOrbs.forEach(p => {
          if (!reduceMotion) {
            p.x += p.vx + Math.sin(p.pulse) * 0.2;
            p.y += p.vy;
            p.pulse += 0.04;
            if (p.y < h * 0.08 || p.x < 0 || p.x > w) {
              p.y = h * 0.75;
              p.x = w * 0.3 + Math.random() * (w * 0.4);
            }
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(52, 211, 153, ${p.alpha})`;
          ctx.shadowColor = '#10B981';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // EVRE 2: DÖKÜLEN VE SÜZÜLEN YAPRAKLAR
      else if (stage === 'moderate') {
        this.leaves.forEach(l => {
          if (!reduceMotion) {
            l.x += l.vx + Math.sin(l.angle * 1.5) * 0.4;
            l.y += l.vy;
            l.angle += l.spin;
            if (l.y > h - 18) {
              l.y = h * 0.2 + Math.random() * (h * 0.3);
              l.x = w * 0.25 + Math.random() * (w * 0.5);
            }
          }
          ctx.save();
          ctx.translate(l.x, l.y);
          ctx.rotate(l.angle);
          ctx.fillStyle = `rgba(245, 158, 11, ${l.alpha})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, l.size, l.size * 0.52, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      // EVRE 3: YOĞUN SMOG VE ASİT KÜLÜ
      else if (stage === 'hazardous') {
        this.smogParticles.forEach(p => {
          if (!reduceMotion) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x > w + 12) {
              p.x = -10;
              p.y = Math.random() * h;
            }
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.isToxic
            ? `rgba(239, 68, 68, ${p.alpha * 0.65})`
            : `rgba(148, 163, 184, ${p.alpha * 0.55})`;
          ctx.fill();
        });

        // Kirlilik sis perdesi
        ctx.fillStyle = 'rgba(50, 42, 40, 0.32)';
        ctx.fillRect(0, 0, w, h);
      }
    }
  }

  window.AeroParticleSystem = BiosphereParticleSystem;
})();
