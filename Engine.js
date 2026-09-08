import { Loop } from "./Loop.js";
import { Input } from "./Input.js";
import { ECS } from "./ECS.js";
import { Renderer } from "./Renderer.js";
import { GalaxySystem } from "./GalaxySystem.js";
import { GalaxyManager } from "./GalaxyManager.js";

export class Engine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ecs = new ECS();
    this.input = new Input(canvas);

    this.galaxySystem = new GalaxySystem(this.ecs);
    this.galaxyManager = new GalaxyManager(this.ecs, this.galaxySystem);

    this.renderer = new Renderer(canvas, this.ecs);
    this.loop = new Loop((dt) => this.update(dt), () => this.render());
  }

  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }

  update(dt) {
    this.galaxySystem.update(dt);
  }

  render() {
    this.renderer.render();
  }
}
