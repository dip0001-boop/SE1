// RenderSystem.js
import { System } from "./System.js";

export class RenderSystem extends System {
  constructor(ecs) {
    super(ecs);
    this.stars = [];
    this.planets = [];
    this.nebulae = [];
  }

  update(_dt) {
    this.stars.length = 0;
    this.planets.length = 0;
    this.nebulae.length = 0;

    const starEntities = this.ecs.query("Transform", "Star");
    for (const e of starEntities) {
      const t = this.ecs.getComponent(e, "Transform");
      const s = this.ecs.getComponent(e, "Star");
      if (t && s) this.stars.push({ entity: e, transform: t, star: s });
    }

    const planetEntities = this.ecs.query("Transform", "Planet");
    for (const e of planetEntities) {
      const t = this.ecs.getComponent(e, "Transform");
      const p = this.ecs.getComponent(e, "Planet");
      if (t && p) this.planets.push({ entity: e, transform: t, planet: p });
    }

    const nebEntities = this.ecs.query("Transform", "Nebula");
    for (const e of nebEntities) {
      const t = this.ecs.getComponent(e, "Transform");
      const n = this.ecs.getComponent(e, "Nebula");
      if (t && n) this.nebulae.push({ entity: e, transform: t, nebula: n });
    }
  }
}
