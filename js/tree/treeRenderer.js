(() => {
  'use strict';

  class UltraFractalTreeRenderer {
    constructor() {
      this.simHealth = 1.0;
      this.animTime = 0;
      this.stars = Array.from({ length: 75 }, (_, i) => ({
        nx: Math.abs(Math.sin(i * 19.31) * 43758.5) % 1,
        ny: (Math.abs(Math.cos(i * 7.13) * 19381.2) % 1) * 0.72,
        r: 0.8 + (i % 3) * 0.7,
        twinkleOffset: i * 0.7
      }));
    }

    lerp(a, b, t) { return a + (b - a) * t; }

    mixRGB(c1, c2, t) {
      const r = Math.round(this.lerp(c1[0], c2[0], t));
      const g = Math.round(this.lerp(c1[1], c2[1], t));
      const b = Math.round(this.lerp(c1[2], c2[2], t));
      return `rgb(${r},${g},${b})`;
    }

    drawVolumetricFoliage(ctx, ox, oy, baseRadius, health, isNightMode) {
      if (health < 0.1) return;

      let cDark, cMid, cLight;
      if (isNightMode) {
        cDark = [10, 35, 32]; cMid = [16, 78, 62]; cLight = [35, 120, 95];
      } else if (health > 0.8) {
        cDark = [6, 78, 59]; cMid = [16, 185, 129]; cLight = [52, 211, 153];
      } else if (health > 0.55) {
        cDark = [20, 83, 45]; cMid = [34, 197, 94]; cLight = [110, 231, 183];
      } else if (health > 0.35) {
        cDark = [120, 53, 15]; cMid = [217, 119, 6]; cLight = [251, 191, 36];
      } else {
        cDark = [69, 26, 3]; cMid = [146, 64, 14]; cLight = [180, 83, 9];
      }

      const r = baseRadius * this.lerp(0.3, 1.0, health);

      ctx.fillStyle = this.mixRGB(cDark, cMid, 0.2);
      ctx.beginPath();
      ctx.arc(ox - r * 0.15, oy + r * 0.15, r * 1.05, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = this.mixRGB(cDark, cMid, 0.7);
      ctx.beginPath();
      ctx.arc(ox, oy, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgb(${cLight[0]},${cLight[1]},${cLight[2]})`;
      ctx.beginPath();
      ctx.arc(ox + r * 0.2, oy - r * 0.2, r * 0.65, 0, Math.PI * 2);
      ctx.fill();

      if (!isNightMode && health > 0.85) {
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(ox + r * 0.25, oy - r * 0.1, 2.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    drawBranch(ctx, len, angle, width, depth, sway, isBurning, isNightMode) {
      ctx.save();
      ctx.rotate(angle + sway * (6 - depth) * 0.018);

      ctx.strokeStyle = isBurning
        ? (depth <= 1 ? '#1A0C08' : '#2D150B')
        : isNightMode ? '#272220' : this.mixRGB([75, 85, 99], [94, 58, 34], this.simHealth);

      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(0, 0);
      const curve = (depth % 2 === 0 ? 1 : -1) * (len * 0.08);
      ctx.quadraticCurveTo(curve, -len * 0.5, 0, -len);
      ctx.stroke();

      if (depth >= 3 && !isBurning && !isNightMode) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(curve * 0.5, -len * 0.2);
        ctx.lineTo(curve * 0.5, -len * 0.7);
        ctx.stroke();
      }

      ctx.translate(0, -len);

      if (depth > 0) {
        this.drawBranch(ctx, len * 0.74, -0.42 + Math.sin(depth) * 0.06, width * 0.68, depth - 1, sway, isBurning, isNightMode);
        this.drawBranch(ctx, len * 0.70, 0.44 - Math.cos(depth) * 0.06, width * 0.66, depth - 1, sway, isBurning, isNightMode);
      }

      if (isBurning && depth <= 2) {
        const flameH = 14 + Math.sin(this.animTime * 14 + depth) * 8;
        ctx.fillStyle = depth % 2 === 0 ? 'rgba(255, 87, 34, 0.9)' : 'rgba(255, 193, 7, 0.95)';
        ctx.beginPath();
        ctx.moveTo(-5, 0);
        ctx.quadraticCurveTo(0, -flameH, 5, 0);
        ctx.fill();
      }

      if (!isBurning && depth <= 2) {
        const h = isNightMode ? 0.85 : this.simHealth;
        this.drawVolumetricFoliage(ctx, 0, 0, 19, h, isNightMode);
        this.drawVolumetricFoliage(ctx, -10, -5, 14, h, isNightMode);
        this.drawVolumetricFoliage(ctx, 10, -6, 14, h, isNightMode);
      }

      ctx.restore();
    }

    render(ctx, w, h, mode, stage, fireRisk, bortle, reduceMotion) {
      if (!reduceMotion) this.animTime += 0.024;
      const isFire = mode === 'fire';
      const isLight = mode === 'light';
      const isBurning = isFire && fireRisk >= 50;

      const sky = ctx.createLinearGradient(0, 0, 0, h);
      if (isLight) {
        const pollutionT = Math.min(1, Math.max(0, (bortle - 1) / 8));
        sky.addColorStop(0, this.mixRGB([3, 7, 18], [55, 42, 32], pollutionT));
        sky.addColorStop(1, this.mixRGB([10, 22, 46], [185, 125, 65], pollutionT));
      } else if (isFire) {
        const t = fireRisk / 100;
        sky.addColorStop(0, this.mixRGB([12, 18, 30], [70, 18, 10], t));
        sky.addColorStop(1, this.mixRGB([22, 30, 44], [140, 40, 12], t));
      } else {
        const targetH = stage === 'stage1' ? 1.0 : stage === 'stage2' ? 0.8 : stage === 'stage3' ? 0.55 : stage === 'stage4' ? 0.3 : 0.02;
        this.simHealth = this.lerp(this.simHealth, targetH, 0.05);
        sky.addColorStop(0, this.mixRGB([14, 20, 32], [8, 48, 88], this.simHealth));
        sky.addColorStop(1, this.mixRGB([30, 38, 52], [18, 76, 110], this.simHealth));
      }
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      if (isLight) {
        const starVisibility = Math.max(0, 1 - (bortle - 1) / 6.5);
        if (starVisibility > 0.05) {
          this.stars.forEach(s => {
            const alpha = starVisibility * (0.4 + 0.6 * Math.abs(Math.sin(this.animTime + s.twinkleOffset)));
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(s.nx * w, s.ny * h, s.r, 0, Math.PI * 2);
            ctx.fill();
          });
        }
        if (bortle >= 4) {
          const glareAlpha = ((bortle - 3) / 6) * 0.45;
          const cone = ctx.createRadialGradient(w * 0.85, h * 0.18, 4, w * 0.6, h * 0.6, w * 0.6);
          cone.addColorStop(0, `rgba(255, 210, 120, ${glareAlpha + 0.3})`);
          cone.addColorStop(1, 'rgba(255, 180, 80, 0)');
          ctx.fillStyle = cone;
          ctx.fillRect(0, 0, w, h);
        }
      }

      const hillGrad = ctx.createLinearGradient(0, h - 50, 0, h);
      if (isLight) {
        hillGrad.addColorStop(0, '#0f2922'); hillGrad.addColorStop(1, '#06120f');
      } else if (isFire) {
        hillGrad.addColorStop(0, isBurning ? '#26140E' : '#332924'); hillGrad.addColorStop(1, '#150A07');
      } else {
        hillGrad.addColorStop(0, this.mixRGB([40, 45, 54], [24, 94, 52], this.simHealth));
        hillGrad.addColorStop(1, this.mixRGB([20, 24, 30], [14, 56, 32], this.simHealth));
      }
      ctx.fillStyle = hillGrad;
      ctx.beginPath();
      ctx.ellipse(w / 2, h + 10, w * 0.72, 54, 0, Math.PI, 0);
      ctx.fill();

      const sway = reduceMotion ? 0 : Math.sin(this.animTime) * (isBurning ? 1.3 : (0.35 + (isLight ? 0.6 : this.simHealth) * 0.65));
      ctx.save();
      ctx.translate(w / 2, h - 34);

      ctx.strokeStyle = isBurning ? '#1A0C08' : isLight ? '#272220' : this.mixRGB([65, 75, 89], [94, 58, 34], this.simHealth);
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-22, 4);
      ctx.quadraticCurveTo(-12, -8, 0, -16);
      ctx.quadraticCurveTo(12, -8, 22, 4);
      ctx.stroke();

      this.drawBranch(ctx, 72, 0, 16, 4, sway, isBurning, isLight);
      ctx.restore();
    }
  }

  window.AeroTreeRenderer = UltraFractalTreeRenderer;
})();
