import { System } from "./System.js";

/**
 * OrbitSystem updates planet transforms based on orbitalPeriod and phase.
 * Expects Planet component with semiMajorAxis, orbitalPeriod, phase.
 */
export class OrbitSystem extends System {
  update(dt) {
    const planets = this.ecs.query("Transform", "Planet");
    for (const e of planets) {
      const t = this.ecs.getComponent(e, "Transform");
      const p = this.ecs.getComponent(e, "Planet");
      if (!t || !p) continue;
      // advance phase
      p.phase = (p.phase + dt / p.orbitalPeriod) % 1.0;
      const angle = p.phase * Math.PI * 2;
      // assume parent star at same y; semiMajorAxis stored in planet
      // For prototype we orbit around origin of sector (approx)
      const cx = 0;
      const cz = 0;
      t.x = cx + Math.cos(angle) * p.semiMajorAxis;
      t.z = cz + Math.sin(angle) * p.semiMajorAxis;
    }
  }
}
