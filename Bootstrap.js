import { Engine } from "./Engine.js";

export function bootstrap() {
  const canvas = document.getElementById("viewport");
  if (!canvas) throw new Error("Canvas #viewport not found");
  // ensure canvas fills window
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  const engine = new Engine(canvas);
  engine.start();
  return engine;
}
