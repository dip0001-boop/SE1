// rust_lib.rs
// Minimal Rust library exposing a function to JS via wasm-bindgen.
// Build with: wasm-pack build --target web --out-dir ./ --out-name wasm_rust

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn rust_seed_hash(seed: u32, sector_hash: u32) -> u32 {
    // simple mixing function
    let mut x = seed ^ sector_hash;
    x = x.wrapping_mul(0x9E3779B1);
    x ^= x >> 16;
    x = x.wrapping_mul(0x85EBCA6B);
    x ^= x >> 13;
    x = x.wrapping_mul(0xC2B2AE35);
    x ^= x >> 16;
    x
}
