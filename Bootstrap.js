import { Engine } from "./Engine.js";

export function bootstrap() {
  const canvas = document.getElementById("viewport");
  if (!canvas) throw new Error("Canvas #viewport not found");
  const engine = new Engine(canvas);
  engine.start();
  return engine;
}
