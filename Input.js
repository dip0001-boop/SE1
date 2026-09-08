export class Input {
  constructor(canvas) {
    this.keys = new Set();
    this.mouse = { x: 0, y: 0, down: false };

    window.addEventListener("keydown", (e) => this.keys.add(e.key));
    window.addEventListener("keyup", (e) => this.keys.delete(e.key));

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = (e.clientX - rect.left) / rect.width;
      this.mouse.y = (e.clientY - rect.top) / rect.height;
    });

    canvas.addEventListener("mousedown", () => (this.mouse.down = true));
    canvas.addEventListener("mouseup", () => (this.mouse.down = false));
  }
}
