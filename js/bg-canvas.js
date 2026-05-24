(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  const PARTICLES = 40;
  const particles  = [];

  // Brand palette — vary between two greens and a warm teal
  const COLORS = ['#16A97A', '#0D8562', '#1BBE88', '#0A6B4E'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  // Draw a single paw print centred at (0,0), radius = r
  function drawPaw(x, y, r, angle, alpha, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.globalAlpha = alpha;
    ctx.fillStyle   = color;

    // Main pad — slightly taller oval
    ctx.beginPath();
    ctx.ellipse(0, r * 0.18, r * 0.44, r * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();

    // Four toe pads — smaller ovals arranged in an arc above the main pad
    const toes = [
      { dx: -r * 0.40, dy: -r * 0.10 },
      { dx: -r * 0.14, dy: -r * 0.40 },
      { dx:  r * 0.14, dy: -r * 0.40 },
      { dx:  r * 0.40, dy: -r * 0.10 },
    ];
    const tr = r * 0.19;
    toes.forEach(({ dx, dy }) => {
      ctx.beginPath();
      ctx.ellipse(dx, dy, tr, tr * 0.84, dx < 0 ? 0.25 : -0.25, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  class Particle {
    constructor(scattered) {
      this.init(scattered);
    }

    init(scattered) {
      this.r      = Math.random() * 22 + 8;        // 8 – 30 px
      this.x      = Math.random() * W;
      this.y      = scattered ? Math.random() * H : H + this.r + 10;
      this.speed  = Math.random() * 0.35 + 0.12;  // very slow drift up
      this.angle  = Math.random() * Math.PI * 2;
      this.spin   = (Math.random() - 0.5) * 0.004;
      this.wPhase = Math.random() * Math.PI * 2;
      this.wFreq  = Math.random() * 0.008 + 0.004;
      this.wAmp   = Math.random() * 0.5 + 0.2;
      this.maxA   = Math.random() * 0.055 + 0.018; // subtle opacity cap
      this.alpha  = scattered ? Math.random() * this.maxA : 0;
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    update() {
      this.y      -= this.speed;
      this.wPhase += this.wFreq;
      this.x      += Math.sin(this.wPhase) * this.wAmp;
      this.angle  += this.spin;

      // Fade in from bottom, fade out near top
      const fadeZone = H * 0.18;
      if (this.y > H - fadeZone) {
        this.alpha = Math.min(this.alpha + 0.0015, this.maxA);
      } else if (this.y < fadeZone) {
        this.alpha = Math.max(0, this.alpha - 0.002);
      }

      if (this.y < -this.r - 10) this.init(false);
    }

    draw() {
      if (this.alpha <= 0) return;
      drawPaw(this.x, this.y, this.r, this.angle, this.alpha, this.color);
    }
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(tick);
  }

  function boot() {
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < PARTICLES; i++) particles.push(new Particle(true));
    tick();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', boot)
    : boot();
})();
