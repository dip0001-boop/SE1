// storage.js
// Deterministic per-deploy seed storage. Use GALAXY_SALT env to vary across deploys.

const sectorSeeds = new Map();
const DEPLOY_SALT = (process.env.GALAXY_SALT ? Number(process.env.GALAXY_SALT) : Date.now()) >>> 0;

export function getSectorSeed(sectorId) {
  if (sectorSeeds.has(sectorId)) return sectorSeeds.get(sectorId);
  const base = hashString(sectorId);
  // Mix with deploy salt so different deploys produce different universes
  const seed = (base ^ DEPLOY_SALT ^ 0x9E3779B1) >>> 0;
  sectorSeeds.set(sectorId, seed);
  return seed;
}

function hashString(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}
