// RNG.js
// xorshift32 and helper to create rand() from seed

export function xorshift32(seed) {
  let state = seed >>> 0;
  if (state === 0) state = 0xdeadbeef;
  return function rand() {
    state ^= (state << 13) >>> 0;
    state ^= (state >>> 17) >>> 0;
    state ^= (state << 5) >>> 0;
    return (state >>> 0) / 0xFFFFFFFF;
  };
}

export function hashStringToUint32(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}
