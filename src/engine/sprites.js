import { clamp } from '../data.js';

export function drawRoundedRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function drawPuppy(ctx, x, y, size, character, blink = 0) {
  const fur = character?.palette?.fur || '#ffd39d';
  const ear = character?.palette?.ear || '#c98c5e';
  const shirt = character?.palette?.shirt || '#9ecfff';

  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = ear;
  ctx.beginPath();
  ctx.ellipse(-size * 0.3, -size * 0.28, size * 0.16, size * 0.22, -0.4, 0, Math.PI * 2);
  ctx.ellipse(size * 0.3, -size * 0.28, size * 0.16, size * 0.22, 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = fur;
  ctx.beginPath();
  ctx.arc(0, -size * 0.08, size * 0.34, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = shirt;
  drawRoundedRect(ctx, -size * 0.28, size * 0.08, size * 0.56, size * 0.4, size * 0.14, shirt);

  ctx.fillStyle = '#ffffff';
  const eyeH = clamp(size * 0.09 * (1 - blink), 1, size * 0.09);
  ctx.beginPath();
  ctx.ellipse(-size * 0.11, -size * 0.12, size * 0.07, eyeH, 0, 0, Math.PI * 2);
  ctx.ellipse(size * 0.11, -size * 0.12, size * 0.07, eyeH, 0, 0, Math.PI * 2);
  ctx.fill();

  if (blink < 0.9) {
    ctx.fillStyle = '#20314f';
    ctx.beginPath();
    ctx.arc(-size * 0.11, -size * 0.11, size * 0.03, 0, Math.PI * 2);
    ctx.arc(size * 0.11, -size * 0.11, size * 0.03, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#2f3a59';
  ctx.beginPath();
  ctx.arc(0, -size * 0.02, size * 0.035, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#2f3a59';
  ctx.lineWidth = Math.max(2, size * 0.02);
  ctx.beginPath();
  ctx.arc(0, size * 0.03, size * 0.08, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  ctx.restore();
}

export function drawMapPath(ctx, points) {
  if (points.length < 2) {
    return;
  }
  ctx.save();
  ctx.lineWidth = 10;
  ctx.strokeStyle = 'rgba(255,255,255,0.65)';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    const p = points[i];
    ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
  ctx.restore();
}

export function drawSparkle(ctx, x, y, size, color = '#ffe16f') {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.35, 0);
  ctx.lineTo(0, size);
  ctx.lineTo(-size * 0.35, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawSoftBackground(ctx, width, height, colors) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.18;
  for (let i = 0; i < 8; i += 1) {
    const radius = Math.max(width, height) * (0.12 + i * 0.03);
    ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#ffe9b8';
    ctx.beginPath();
    ctx.arc(width * (0.1 + (i * 0.11) % 1), height * (0.08 + (i * 0.12) % 1), radius * 0.11, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
