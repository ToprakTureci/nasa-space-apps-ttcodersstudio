(() => {
  'use strict';

  class FractalTreeRenderer {
    constructor() {
      this.simHealth = 1.0;
      this.fireHealth = 0.0;
      this.animTime = 0;
    }

    lerp(a, b, t) { return a + (b - a) * t; }

    mixRGB(c1, c2, t) {
      const r = Math.round(this.lerp(c1[0], c2[0], t));
      const g = Math.round(this.lerp(c1[1], c2[1], t));
      const b = Math.round(this.lerp(c1[2], c2[2], t));
      return `rgb(${r},${g},${b})`;
    }

    drawBranch(ctx, len, angle, width, depth, sway, isBurning) {
      ctx.save();
      ctx.rotate(angle + sway * (6 - depth) * 0.016);

      if (isBurning) {
        ctx.strokeStyle = '#2A1810';
      } else {
        ctx.strokeStyle = this.mixRGB([65, 75, 89], [94, 58, 34], this.simHealth);
      }
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -len);
      ctx.stroke();

      ctx.translate(0, -len);

      if (depth > 0) {
        this.drawBranch(ctx, len * 0.73, -0.42, width * 0.68, depth - 1, sway, isBurning);
        this.drawBranch(ctx, len * 0.73, 0.42, width * 0.68, depth - 1, sway, isBurning);
      }

      // YANGIN MODU: DALLARDA PARLAYAN ALEVLER
      if (isBurning && depth <= 2) {
        const flameH = 10 + Math.sin(this.animTime * 12 + depth) * 6;
        ctx.fillStyle = depth % 2 === 0 ? 'rgba(255, 87, 34, 0.85)' : 'rgba(255, 193, 7, 0.9)';
        ctx.beginPath();
        ctx.moveTo(-4, 0);
        ctx.quadraticCurveTo(0, -flameH, 4, 0);
        ctx.fill();
      }

      // HAVA MODU: 5 KADEMELİ YAPRAK KATMANLARI
      if (!isBurning && depth <= 2 && this.simHealth > 0.08) {
        const leafClusters = Math.ceil(this.simHealth * 4.5);
        for (let i = 0; i < leafClusters; i++) {
          const ox = Math.sin(depth * 13 + i) * 22;
          const oy = Math.cos(depth * 19 + i) * 16;
          const radius = this.lerp(3.5, 16.0, this.simHealth);

          if (this.simHealth > 0.8) {
            ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
          } else if (this.simHealth > 0.55) {
            ctx.fillStyle = 'rgba(52, 211, 153, 0.85)';
          } else if (this.simHealth > 0.35) {
            ctx.fillStyle = 'rgba(245, 158, 11, 0.82)';
          } else {
            ctx.fillStyle = 'rgba(180, 83, 9, 0.75)';
          }

          ctx.beginPath();
          ctx.arc(ox, oy, radius, 0, Math.PI * 2);
          ctx.fill();

          if (this.simHealth > 0.85 && i === 0) {
            ctx.fillStyle = '#FEF08A';
            ctx.beginPath();
            ctx.arc(ox + 4, oy - 3, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.restore();
    }

    render(ctx, w, h, mode, stage, fireRisk, reduceMotion) {
      if (!reduceMotion) this.animTime += 0.024;

      const isFireMode = mode === 'fire';
      const isBurning = isFireMode && fireRisk >= 50;

      // 1. GÖKYÜZÜ ATMOSFERİ
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      if (isFireMode) {
        const t = fireRisk / 100;
        sky.addColorStop(0, this.mixRGB([15, 23, 42], [90, 20, 10], t));
        sky.addColorStop(1, this.mixRGB([30, 41, 59], [180, 50, 15], t));
      } else {
        const targetHealth = stage === 'stage1' ? 1.0 : stage === 'stage2' ? 0.8 : stage === 'stage3' ? 0.55 : stage === 'stage4' ? 0.3 : 0.02;
        this.simHealth = this.lerp(this.simHealth, targetHealth, 0.05);
        sky.addColorStop(0, this.mixRGB([20, 24, 33], [6, 45, 95], this.simHealth));
        sky.addColorStop(1, this.mixRGB([45, 40, 36], [16, 75, 115], this.simHealth));
      }
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // 2. ZEMİN VE TEPE
      if (isFireMode) {
        ctx.fillStyle = isBurning ? '#26140E' : '#2D2824';
      } else {
        ctx.fillStyle = this.mixRGB([38, 34, 30], [20, 85, 48], this.simHealth);
      }
      ctx.beginPath();
      ctx.ellipse(w / 2, h, w * 0.72, 46, 0, Math.PI, 0);
      ctx.fill();

      // 3. AĞAÇ İSKELETİ & DALLAR
      const sway = reduceMotion ? 0 : Math.sin(this.animTime) * (isBurning ? 1.2 : (0.35 + this.simHealth * 0.65));

      ctx.save();
      ctx.translate(w / 2, h - 36);

      ctx.strokeStyle = isBurning ? '#1A0E08' : this.mixRGB([65, 75, 89], [94, 58, 34], this.simHealth);
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.quadraticCurveTo(-10, -10, 0, -14);
      ctx.quadraticCurveTo(10, -10, 18, 0);
      ctx.stroke();

      this.drawBranch(ctx, 68, 0, 14, 4, sway, isBurning);
      ctx.restore();
    }
  }

  window.AeroTreeRenderer = FractalTreeRenderer;
})();
