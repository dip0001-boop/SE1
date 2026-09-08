#!/usr/bin/env bash
# build_wasm.sh
# Helper script to build Rust (wasm-pack) and C/C++ (emcc) WASM artifacts.
# Requires: wasm-pack, emscripten (emcc) in PATH.

set -e

echo "Building Rust WASM (wasm-pack)..."
if command -v wasm-pack >/dev/null 2>&1; then
  # Build into root as wasm_rust_bg.wasm + wasm_rust.js
  wasm-pack build --target web --out-dir ./ --out-name wasm_rust
else
  echo "wasm-pack not found; skip Rust build"
fi

echo "Building C++ WASM (emcc)..."
if command -v emcc >/dev/null 2>&1; then
  emcc cpp_module.cpp -O3 -s WASM=1 -s EXPORTED_FUNCTIONS="['_cpp_seed_hash']" -o wasm_cpp.js
  emcc c_module.c -O3 -s WASM=1 -s EXPORTED_FUNCTIONS="['_c_seed_hash']" -o wasm_c.js
else
  echo "emcc not found; skip C/C++ build"
fi

echo "Done. Artifacts (if built): wasm_rust_bg.wasm, wasm_rust.js, wasm_cpp.wasm, wasm_cpp.js, wasm_c.wasm, wasm_c.js"
