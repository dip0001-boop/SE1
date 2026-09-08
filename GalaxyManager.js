export class GalaxyManager {
  constructor(ecs, galaxySystem) {
    this.ecs = ecs;
    this.galaxySystem = galaxySystem;
    this.generated = new Set();
    this.sectorSize = 100;
  }

  sectorIdForPosition(x, y, z) {
    const sx = Math.floor(x / this.sectorSize);
    const sy = Math.floor(y / this.sectorSize);
    const sz = Math.floor(z / this.sectorSize);
    return `${sx},${sy},${sz}`;
  }

  generateSectorIfNeeded(seed, sectorId) {
    if (this.generated.has(sectorId)) return;
    this.generated.add(sectorId);
    this.galaxySystem.generateSector(seed, sectorId);
  }

  regenerateSector(seed, sectorId) {
    this.generated.delete(sectorId);
    this.generateSectorIfNeeded(seed, sectorId);
  }

  generateSector(seed, sectorId) {
    this.generated.add(sectorId);
    this.galaxySystem.generateSector(seed, sectorId);
  }
}
