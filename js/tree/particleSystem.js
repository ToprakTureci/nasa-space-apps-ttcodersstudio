(() => {
  'use strict';

  class BiosphereParticleSystem {
    constructor() {
      this.leaves = [];
      this.oxygenOrbs = [];
      this.smogParticles = [];
      this.fireEmbers = [];
      this.maxLeaves = 40;
      this.maxOxygen = 25;
      this.maxSmog = 65;
      this.maxEmbers = 70;
    }

    init(w, h) {
      this.leaves = Array.from({ length: this.maxLeaves }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.8,
        vy: 0.6 + Math.random() * 0.9,
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

      this.fireEmbers = Array.from({ length: this.maxEmbers }, () => ({
        x: w * 0.35 + Math.random() * (w * 0.3),
        y: h * 0.4 + Math.random() * (h * 0.5),
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(1.2 + Math.random() * 2.2),
        size: 1.2 + Math.random() * 3.2,
        alpha: 0.4 + Math.random() * 0.6,
        life: Math.random()
      }));
    }

    updateAndRender(ctx, w, h, mode, stage, fireRisk, reduceMotion) {
      if (this.leaves.length === 0) this.init(w, h);

      // YANGIN MODU PARÇACIKLARI (ALEVLER & KIVILCIMLAR)
      if (mode === 'fire') {
        if (fireRisk >= 40) {
          this.fireEmbers.forEach(e => {
            if (!reduceMotion) {
              e.x += e.vx + Math.sin(e.life * 10) * 0.6;
              e.y += e.vy;
              e.life += 0.02;
              if (e.y < h * 0.05 || e.life > 1) {
                e.y = h * 0.75 + Math.random() * (h * 0.15);
                e.x = w * 0.35 + Math.random() * (w * 0.3);
                e.life = 0;
              }
            }
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
            ctx.fillStyle = e.life < 0.4 ? 'rgba(255, 230, 100, 0.95)' : 'rgba(255, 87, 34, 0.75)';
            ctx.shadowColor = '#FF5722';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          });

          ctx.fillStyle = 'rgba(60, 25, 20, 0.28)';
          ctx.fillRect(0, 0, w, h);
        }
        return;
      }

      // HAVA MODU PARÇACIKLARI (5 EVRE)
      if (stage === 'stage1' || stage === 'stage2') {
        const count = stage === 'stage1' ? this.oxygenOrbs.length : Math.floor(this.oxygenOrbs.length * 0.5);
        for (let i = 0; i < count; i++) {
          const p = this.oxygenOrbs[i];
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
        }
      }

      if (stage === 'stage3' || stage === 'stage4') {
        const count = stage === 'stage4' ? this.leaves.length : Math.floor(this.leaves.length * 0.45);
        for (let i = 0; i < count; i++) {
          const l = this.leaves[i];
          if (!reduceMotion) {
            l.x += l.vx + Math.sin(l.angle * 1.5) * 0.4;
            l.y += l.vy * (stage === 'stage4' ? 1.4 : 1.0);
            l.angle += l.spin;
            if (l.y > h - 18) {
              l.y = h * 0.2 + Math.random() * (h * 0.3);
              l.x = w * 0.25 + Math.random() * (w * 0.5);
            }
          }
          ctx.save();
          ctx.translate(l.x, l.y);
          ctx.rotate(l.angle);
          ctx.fillStyle = stage === 'stage4' ? `rgba(180, 83, 9, ${l.alpha})` : `rgba(245, 158, 11, ${l.alpha})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, l.size, l.size * 0.52, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      if (stage === 'stage5') {
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
          ctx.fillStyle = p.isToxic ? `rgba(239, 68, 68, ${p.alpha * 0.65})` : `rgba(148, 163, 184, ${p.alpha * 0.55})`;
          ctx.fill();
        });
        ctx.fillStyle = 'rgba(50, 42, 40, 0.36)';
        ctx.fillRect(0, 0, w, h);
      }
    }
  }

  window.AeroParticleSystem = BiosphereParticleSystem;
})();
