/**
 * AeroJukebox — Prosedürel Fraktal Biyosfer Ağacı Motoru
 * Doğal dallanma açısı, kalınlık değişimi, rüzgar esintisi (sway),
 * kabuk çatlağı ve klorofil geçiş fiziği.
 */
(() => {
  'use strict';

  class FractalTreeRenderer {
    constructor() {
      this.simHealth = 1.0; // 1.0 = Canlı, 0.5 = Stres, 0.0 = Kurumuş
      this.animTime = 0;
    }

    lerp(a, b, t) { return a + (b - a) * t; }

    mixRGB(c1, c2, t) {
      const r = Math.round(this.lerp(c1[0], c2[0], t));
      const g = Math.round(this.lerp(c1[1], c2[1], t));
      const b = Math.round(this.lerp(c1[2], c2[2], t));
      return `rgb(${r},${g},${b})`;
    }

    drawBranch(ctx, len, angle, width, depth, sway) {
      ctx.save();
      ctx.rotate(angle + sway * (6 - depth) * 0.016);

      // Gövde & Dal Rengi (Sağlığa göre kahverengiden kül grisine)
      ctx.strokeStyle = this.mixRGB([65, 75, 89], [94, 58, 34], this.simHealth);
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -len);
      ctx.stroke();

      ctx.translate(0, -len);

      if (depth > 0) {
        // İkili doğal fraktal çatallanma
        this.drawBranch(ctx, len * 0.73, -0.42, width * 0.68, depth - 1, sway);
        this.drawBranch(ctx, len * 0.73, 0.42, width * 0.68, depth - 1, sway);
      }

      // YAPRAK KATMANLARI (Sadece uç dallarda ve ağaç canlıysa)
      if (depth <= 2 && this.simHealth > 0.12) {
        const leafClusters = Math.ceil(this.simHealth * 4);
        for (let i = 0; i < leafClusters; i++) {
          const ox = Math.sin(depth * 13 + i) * 22;
          const oy = Math.cos(depth * 19 + i) * 16;
          const radius = this.lerp(4.5, 15.5, this.simHealth);

          // Canlı yeşilden stres sarısına yumuşak renk değişimi
          ctx.fillStyle = this.simHealth > 0.55
            ? this.mixRGB([217, 155, 38], [16, 185, 129], (this.simHealth - 0.55) / 0.45)
            : this.mixRGB([95, 75, 62], [245, 158, 11], this.simHealth / 0.55);

          ctx.globalAlpha = this.lerp(0.42, 0.92, this.simHealth);
          ctx.beginPath();
          ctx.arc(ox, oy, radius, 0, Math.PI * 2);
          ctx.fill();

          // Evre 1: Sağlıklı çiçek tomurcukları
          if (this.simHealth > 0.78 && i === 0) {
            ctx.fillStyle = '#FEF08A';
            ctx.beginPath();
            ctx.arc(ox + 4, oy - 3, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1.0;
      }

      ctx.restore();
    }

    render(ctx, w, h, stage, reduceMotion) {
      const targetHealth = stage === 'good' ? 1.0 : stage === 'moderate' ? 0.5 : 0.05;
      this.simHealth = this.lerp(this.simHealth, targetHealth, 0.04);
      if (!reduceMotion) this.animTime += 0.024;

      // 1. Gökyüzü Işık Atmosferi (Halo)
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, this.mixRGB([20, 24, 33], [6, 45, 95], this.simHealth));
      sky.addColorStop(1, this.mixRGB([45, 40, 36], [16, 75, 115], this.simHealth));
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // 2. Tepe ve Zemin Tabakası
      ctx.fillStyle = this.mixRGB([38, 34, 30], [20, 85, 48], this.simHealth);
      ctx.beginPath();
      ctx.ellipse(w / 2, h, w * 0.72, 46, 0, Math.PI, 0);
      ctx.fill();

      // 3. Organik Ağaç İskeleti & Kökler
      const sway = reduceMotion ? 0 : Math.sin(this.animTime) * (0.35 + this.simHealth * 0.65);

      ctx.save();
      ctx.translate(w / 2, h - 36);

      // Kökler
      ctx.strokeStyle = this.mixRGB([65, 75, 89], [94, 58, 34], this.simHealth);
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.quadraticCurveTo(-10, -10, 0, -14);
      ctx.quadraticCurveTo(10, -10, 18, 0);
      ctx.stroke();

      // Fraktal Gövde ve Dallar
      this.drawBranch(ctx, 68, 0, 14, 4, sway);
      ctx.restore();
    }
  }

  window.AeroTreeRenderer = FractalTreeRenderer;
})();
