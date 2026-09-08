import { Loop } from "./Loop.js";
import { Input } from "./Input.js";
import { ECS } from "./ECS.js";
import { Renderer } from "./Renderer.js";
import { GalaxySystem } from "./GalaxySystem.js";
import { GalaxyManager } from "./GalaxyManager.js";
import { OrbitSystem } from "./OrbitSystem.js";

export class Engine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ecs = new ECS();
    this.input = new Input(canvas);

    this.galaxySystem = new GalaxySystem(this.ecs);
    this.galaxyManager = new GalaxyManager(this.ecs, this.galaxySystem);
    this.orbitSystem = new OrbitSystem(this.ecs);

    this.renderer = new Renderer(canvas, this.ecs);
    this.loop = new Loop((dt) => this.update(dt), () => this.render());
    this._pendingSectorRequests = new Set();
  }

  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }

  async update(dt) {
    // camera movement (WASD)
    if (this.input.keys.has("w")) this.renderer.camera.z -= 80 * dt;
    if (this.input.keys.has("s")) this.renderer.camera.z += 80 * dt;
    if (this.input.keys.has("a")) this.renderer.camera.x -= 80 * dt;
    if (this.input.keys.has("d")) this.renderer.camera.x += 80 * dt;
    if (this.input.keys.has("q")) this.renderer.camera.y -= 80 * dt;
    if (this.input.keys.has("e")) this.renderer.camera.y += 80 * dt;

    // update orbiting planets
    this.orbitSystem.update(dt);

    // auto-generate sector under camera
    const sectorId = this.galaxyManager.sectorIdForPosition(
      this.renderer.camera.x,
      this.renderer.camera.y,
      this.renderer.camera.z
    );

    if (!this.galaxyManager.generated.has(sectorId) && !this._pendingSectorRequests.has(sectorId)) {
      this._pendingSectorRequests.add(sectorId);
      try {
        const res = await fetch(`/api/galaxy/sector?sectorId=${encodeURIComponent(sectorId)}`);
        const json = await res.json();
        this.galaxyManager.generateSectorIfNeeded(json.seed, json.sectorId);
      } catch (err) {
        console.error("Failed to fetch sector seed", err);
      } finally {
        this._pendingSectorRequests.delete(sectorId);
      }
    }
  }

  render() {
    this.renderer.render();
  }
}
