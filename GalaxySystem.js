import { System } from "./System.js";
import { createTransform } from "./Transform.js";
import { createSector } from "./Sector.js";
import { createStar } from "./Star.js";
import { createPlanet } from "./Planet.js";
import { createNebula } from "./Nebula.js";

export class GalaxySystem extends System {
  update(_dt) {
    // explicit generation only
  }

  generateSector(seed, sectorId) {
    let state = seed ^ hashString(sectorId);

    function rand() {
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      return (state >>> 0) / 0xffffffff;
    }

    const starCount = 20 + Math.floor(rand() * 31);
    for (let i = 0; i < starCount; i++) {
      const ex = (rand() - 0.5) * 100;
      const ey = (rand() - 0.5) * 100;
      const ez = (rand() - 0.5) * 100;

      const e = this.ecs.createEntity();
      this.ecs.addComponent(e, "Transform", createTransform(ex, ey, ez));
      this.ecs.addComponent(e, "Sector", createSector(sectorId));

      const spectral = pickSpectral(rand());
      const star = createStar(
        spectral,
        Math.max(0.1, rand() * 10),
        0.5 + rand() * 5,
        spectralColor(spectral)
      );
      this.ecs.addComponent(e, "Star", star);

      const planetCount = Math.floor(rand() * 6);
      for (let p = 0; p < planetCount; p++) {
        const pe = this.ecs.createEntity();
        const angle = rand() * Math.PI * 2;
        const dist = 2 + p * (1 + rand() * 2);
        const px = ex + Math.cos(angle) * dist;
        const py = ey;
        const pz = ez + Math.sin(angle) * dist;

        this.ecs.addComponent(pe, "Transform", createTransform(px, py, pz));
        this.ecs.addComponent(pe, "Sector", createSector(sectorId));

        const planet = createPlanet(
          0.2 + rand() * 1.5,
          dist,
          10 + rand() * 90,
          rand(),
          rand() < 0.6 ? "rocky" : rand() < 0.5 ? "gas" : "ice",
          rand() < 0.5
        );
        this.ecs.addComponent(pe, "Planet", planet);
      }
    }

    if (rand() < 0.15) {
      const ne = this.ecs.createEntity();
      const nx = (rand() - 0.5) * 200;
      const ny = (rand() - 0.5) * 200;
      const nz = (rand() - 0.5) * 200;
      this.ecs.addComponent(ne, "Transform", createTransform(nx, ny, nz));
      this.ecs.addComponent(ne, "Sector", createSector(sectorId));
      const neb = createNebula(
        { x: nx, y: ny, z: nz },
        30 + rand() * 70,
        [rand() * 0.8 + 0.2, rand() * 0.8 + 0.2, rand() * 0.8 + 0.2],
        Math.floor(rand() * 0xffffffff)
      );
      this.ecs.addComponent(ne, "Nebula", neb);
    }
  }
}

function hashString(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function pickSpectral(r) {
  if (r < 0.02) return "O";
  if (r < 0.08) return "B";
  if (r < 0.18) return "A";
  if (r < 0.4) return "F";
  if (r < 0.7) return "G";
  if (r < 0.9) return "K";
  return "M";
}

function spectralColor(type) {
  switch (type) {
    case "O": return [0.8, 0.9, 1.0];
    case "B": return [0.7, 0.8, 1.0];
    case "A": return [0.9, 0.9, 1.0];
    case "F": return [1.0, 0.98, 0.9];
    case "G": return [1.0, 0.95, 0.8];
    case "K": return [1.0, 0.85, 0.6];
    default: return [1.0, 0.7, 0.5];
  }
}
