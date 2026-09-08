const sectorSeeds = new Map();

export function getSectorSeed(sectorId) {
  if (sectorSeeds.has(sectorId)) return sectorSeeds.get(sectorId);
  const seed = hashString(sectorId) ^ 0x1234abcd;
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
