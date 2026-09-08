// gizmo.js
// Simple 2D screen-space gizmo that manipulates Transform component directly.
// For prototype: translate only; rotate/scale stubs.

export class Gizmo {
  constructor(renderer, canvasEl) {
    this.renderer = renderer;
    this.canvas = canvasEl;
    this.mode = "translate";
    this.attached = null;
    this.dragging = false;
    this.start = null;

    this.canvas.addEventListener("mousedown", (e) => this.onDown(e));
    window.addEventListener("mousemove", (e) => this.onMove(e));
    window.addEventListener("mouseup", (e) => this.onUp(e));
  }

  setMode(m) { this.mode = m; }

  attachToEntity(entityId) {
    this.attached = entityId;
  }

  screenToWorld(x, y) {
    // simple unproject assuming camera projection and view
    const rect = this.canvas.getBoundingClientRect();
    const nx = (x - rect.left) / rect.width * 2 - 1;
    const ny = 1 - (y - rect.top) / rect.height * 2;
    // approximate world position at camera.z - 200
    const cam = this.renderer.camera;
    const worldX = cam.x + nx * 200;
    const worldY = cam.y + ny * 200;
    return { x: worldX, y: worldY };
  }

  onDown(e) {
    if (!this.attached) return;
    this.dragging = true;
    this.start = { x: e.clientX, y: e.clientY };
  }

  onMove(e) {
    if (!this.dragging || !this.attached) return;
    const dx = e.clientX - this.start.x;
    const dy = e.clientY - this.start.y;
    const t = window.engine.ecs.getComponent(this.attached, "Transform");
    if (!t) return;
    // map screen delta to world delta
    t.x += dx * 0.1;
    t.y -= dy * 0.1;
    this.start = { x: e.clientX, y: e.clientY };
  }

  onUp() {
    this.dragging = false;
  }
}
