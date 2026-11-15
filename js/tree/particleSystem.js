(() => {
  'use strict';

  class BiosphereParticleSystem {
    constructor() {
      this.leaves = [];
      this.oxygenOrbs = [];
      this.smogParticles = [];
      this.fireEmbers = [];
      this.fireflies = [];
      this.ash = [];
      this.t = 0;
    }

    init(w, h) {
      this.leaves = Array.from({ length: 40 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.8, vy: 0.6 + Math.random() * 0.9,
        angle: Math.random() * Math.PI * 2, spin: (Math.random() - 0.5) * 0.05,
        size: 3 + Math.random() * 3.5, alpha: 0.65 + Math.random() * 0.35
      }));

      this.oxygenOrbs = Array.from({ length: 26 }, () => ({
        x: w * 0.25 + Math.random() * (w * 0.5), y: h * 0.3 + Math.random() * (h * 0.5),
        vx: (Math.random() - 0.5) * 0.35, vy: -(0.35 + Math.random() * 0.7),
        size: 1.5 + Math.random() * 2.5, alpha: 0.3 + Math.random() * 0.6, pulse: Math.random() * Math.PI * 2
      }));

      this.smogParticles = Array.from({ length: 65 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: 1.1 + Math.random() * 1.8, vy: (Math.random() - 0.5) * 0.45,
        size: 1.8 + Math.random() * 4.2, alpha: 0.15 + Math.random() * 0.45, isToxic: Math.random() > 0.65
      }));

      this.fireEmbers = Array.from({ length: 75 }, () => ({
        x: w * 0.35 + Math.random() * (w * 0.3), y: h * 0.4 + Math.random() * (h * 0.5),
        vx: (Math.random() - 0.5) * 1.3, vy: -(1.2 + Math.random() * 2.3),
        size: 1.4 + Math.random() * 3.2, life: Math.random()
      }));

      this.fireflies = Array.from({ length: 30 }, () => ({
        x: Math.random() * w, y: h * 0.15 + Math.random() * (h * 0.65),
        angle: Math.random() * Math.PI * 2, speed: 0.4 + Math.random() * 0.7,
        size: 1.6 + Math.random() * 2.2, phase: Math.random() * Math.PI * 2
      }));

      this.ash = Array.from({ length: 45 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5, vy: 0.3 + Math.random() * 0.6,
        size: 1 + Math.random() * 2, alpha: 0.2 + Math.random() * 0.4, ph: Math.random() * 6.28
      }));
    }

    glow(ctx, x, y, r, rgb, a) {
      ctx.fillStyle = `rgba(${rgb}, ${a * 0.18})`;
      ctx.beginPath(); ctx.arc(x, y, r * 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(${rgb}, ${a * 0.45})`;
      ctx.beginPath(); ctx.arc(x, y, r * 1.7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(${rgb}, ${a})`;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }

    updateAndRender(ctx, w, h, mode, stage, fireRisk, bortle, reduceMotion) {
      if (this.leaves.length === 0) this.init(w, h);
      if (!reduceMotion) this.t += 0.016;
      const gust = reduceMotion ? 0 : Math.sin(this.t * 0.6) * 0.5 + Math.sin(this.t * 1.7) * 0.2;

      if (mode === 'light') {
        const isDarkSky = bortle <= 3;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        this.fireflies.forEach((f, idx) => {
          if (!reduceMotion) {
            f.angle += (Math.random() - 0.5) * 0.25;
            if (isDarkSky) {
              f.x = (f.x + Math.cos(f.angle) * f.speed + w) % w;
              f.y = Math.max(20, Math.min(h - 30, f.y + Math.sin(f.angle) * f.speed));
            } else {
              const targetX = w * 0.85, targetY = h * 0.18;
              f.x += (targetX - f.x) * 0.02 + Math.cos(f.phase * 3) * 1.6;
              f.y += (targetY - f.y) * 0.02 + Math.sin(f.phase * 3) * 1.6;
            }
            f.phase += 0.06;
          }

          if (bortle <= 4 || idx % 2 === 0) {
            const glow = 0.35 + 0.65 * Math.abs(Math.sin(f.phase));
            if (isDarkSky) this.glow(ctx, f.x, f.y, f.size, '190, 242, 100', glow);
            else this.glow(ctx, f.x, f.y, f.size * 0.8, '253, 224, 71', glow * 0.7);
          }
        });
        ctx.restore();
        return;
      }

      if (mode === 'fire') {
        if (fireRisk >= 40) {
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          this.fireEmbers.forEach(e => {
            if (!reduceMotion) {
              e.x += e.vx + Math.sin(e.life * 10) * 0.6 + gust * 0.6;
              e.y += e.vy;
              e.life += 0.02;
              if (e.y < h * 0.05 || e.life > 1) {
                e.y = h * 0.75 + Math.random() * (h * 0.15);
                e.x = w * 0.35 + Math.random() * (w * 0.3);
                e.life = 0;
              }
            }
            const fade = 1 - e.life * 0.7;
            const hot = e.life < 0.4;
            this.glow(ctx, e.x, e.y, e.size * (1 - e.life * 0.4), hot ? '255, 200, 90' : '255, 87, 34', 0.9 * fade);
          });
          ctx.restore();

          ctx.fillStyle = 'rgba(70, 62, 60, 0.6)';
          this.ash.forEach(a => {
            if (!reduceMotion) {
              a.x += a.vx + Math.sin(this.t + a.ph) * 0.3 + gust * 0.5;
              a.y += a.vy;
              if (a.y > h) { a.y = -5; a.x = Math.random() * w; }
              if (a.x > w) a.x = 0; else if (a.x < 0) a.x = w;
            }
            ctx.globalAlpha = a.alpha;
            ctx.fillRect(a.x, a.y, a.size * 1.6, a.size);
          });
          ctx.globalAlpha = 1;

          ctx.fillStyle = 'rgba(60, 25, 20, 0.28)';
          ctx.fillRect(0, 0, w, h);
        }
        return;
      }

      if (stage === 'stage1' || stage === 'stage2') {
        const count = stage === 'stage1' ? this.oxygenOrbs.length : Math.floor(this.oxygenOrbs.length * 0.5);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < count; i++) {
          const p = this.oxygenOrbs[i];
          if (!reduceMotion) {
            p.x += p.vx + Math.sin(p.pulse) * 0.2 + gust * 0.15;
            p.y += p.vy; p.pulse += 0.04;
            if (p.y < h * 0.08 || p.x < 0 || p.x > w) { p.y = h * 0.75; p.x = w * 0.3 + Math.random() * (w * 0.4); }
          }
          this.glow(ctx, p.x, p.y, p.size, '52, 211, 153', p.alpha * (0.7 + 0.3 * Math.sin(p.pulse)));
        }
        ctx.restore();
      }

      if (stage === 'stage3' || stage === 'stage4') {
        const count = stage === 'stage4' ? this.leaves.length : Math.floor(this.leaves.length * 0.45);
        for (let i = 0; i < count; i++) {
          const l = this.leaves[i];
          if (!reduceMotion) {
            l.x += l.vx + Math.sin(l.angle * 1.5) * 0.4 + gust * 0.8;
            l.y += l.vy * (stage === 'stage4' ? 1.4 : 1.0); l.angle += l.spin;
            if (l.y > h - 18) { l.y = h * 0.2 + Math.random() * (h * 0.3); l.x = w * 0.25 + Math.random() * (w * 0.5); }
            if (l.x > w + 10) l.x = -10; else if (l.x < -10) l.x = w + 10;
          }
          ctx.save(); ctx.translate(l.x, l.y); ctx.rotate(l.angle);
          ctx.fillStyle = stage === 'stage4' ? `rgba(180, 83, 9, ${l.alpha})` : `rgba(245, 158, 11, ${l.alpha})`;
          ctx.beginPath(); ctx.ellipse(0, 0, l.size, l.size * 0.52, 0, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = 'rgba(60, 25, 5, 0.45)';
          ctx.lineWidth = 0.6;
          ctx.beginPath(); ctx.moveTo(-l.size, 0); ctx.lineTo(l.size, 0); ctx.stroke();
          ctx.restore();
        }
      }

      if (stage === 'stage5') {
        this.smogParticles.forEach(p => {
          if (!reduceMotion) {
            p.x += p.vx + gust * 0.4; p.y += p.vy;
            if (p.x > w + 12) { p.x = -10; p.y = Math.random() * h; }
          }
          const col = p.isToxic ? '239, 68, 68' : '148, 163, 184';
          const a = p.isToxic ? p.alpha * 0.65 : p.alpha * 0.55;
          ctx.fillStyle = `rgba(${col}, ${a * 0.25})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = `rgba(${col}, ${a})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.fillStyle = 'rgba(50, 42, 40, 0.36)'; ctx.fillRect(0, 0, w, h);
      }
    }
  }

  window.AeroParticleSystem = BiosphereParticleSystem;
})();
