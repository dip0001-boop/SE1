// c_module.c
// Minimal C function exported for Emscripten.
// Build with emcc c_module.c -O3 -s WASM=1 -s EXPORTED_FUNCTIONS="['_c_seed_hash']" -o wasm_c.js

#include <stdint.h>

uint32_t c_seed_hash(uint32_t seed, uint32_t sector_hash) {
    uint32_t x = seed ^ sector_hash;
    x = x * 0x9E3779B1u;
    x ^= x >> 16;
    x = x * 0x85EBCA6Bu;
    x ^= x >> 13;
    x = x * 0xC2B2AE35u;
    x ^= x >> 16;
    return x;
}
