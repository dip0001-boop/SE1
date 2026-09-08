export class Loop {
  constructor(update, render) {
    this.update = update;
    this.render = render;
    this.running = false;
    this.last = 0;
    this.rafId = 0;
    this.tick = this.tick.bind(this);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  tick(now) {
    if (!this.running) return;
    const dt = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    this.update(dt);
    this.render();
    this.rafId = requestAnimationFrame(this.tick);
  }
}
