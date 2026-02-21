const COLORS = ['#ffe16f', '#ff8fb1', '#8ad4ff', '#9ce789', '#c9a2ff'];

export function createParticleSystem(getMode) {
  const particles = [];

  function spawnConfetti(x, y, amount = 24) {
    const lowMode = getMode() === 'low';
    const count = lowMode ? Math.min(12, amount) : amount;
    for (let i = 0; i < count; i += 1) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 240,
        vy: -80 - Math.random() * 220,
        life: 0.9 + Math.random() * 0.9,
        age: 0,
        size: 5 + Math.random() * 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        spin: (Math.random() - 0.5) * 10,
        rot: Math.random() * Math.PI,
      });
    }
  }

  function spawnStars(x, y, amount = 10) {
    const lowMode = getMode() === 'low';
    const count = lowMode ? Math.min(6, amount) : amount;
    for (let i = 0; i < count; i += 1) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 120,
        vy: -40 - Math.random() * 120,
        life: 0.5 + Math.random() * 0.5,
        age: 0,
        size: 3 + Math.random() * 3,
        color: '#ffe16f',
        spin: 0,
        rot: 0,
        star: true,
      });
    }
  }

  function update(dt) {
    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const p = particles[i];
      p.age += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 320 * dt;
      p.rot += p.spin * dt;
      if (p.age >= p.life) {
        particles.splice(i, 1);
      }
    }
  }

  function render(ctx) {
    particles.forEach((p) => {
      const alpha = 1 - p.age / p.life;
      ctx.save();
      ctx.globalAlpha = Math.max(alpha, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;

      if (p.star) {
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size * 0.4, 0);
        ctx.lineTo(0, p.size);
        ctx.lineTo(-p.size * 0.4, 0);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(-p.size * 0.5, -p.size * 0.5, p.size, p.size);
      }
      ctx.restore();
    });
  }

  return {
    spawnConfetti,
    spawnStars,
    update,
    render,
    clear() {
      particles.length = 0;
    },
  };
}
