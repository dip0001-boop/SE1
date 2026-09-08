// wasm_api_example.js
// Demonstrates loading the C++/C wasm glue (if you built with emcc) or raw wasm functions.
// If you used emcc to produce wasm_cpp.js glue, include that script instead and call Module._cpp_seed_hash.
// This example uses raw wasm file and the loader above.

import { loadWasmModule } from './wasmLoader.js';

export async function exampleUseCppWasm() {
  try {
    const exports = await loadWasmModule('/wasm_cpp.wasm', {});
    // exported function name depends on how you compiled; Emscripten raw exports may be mangled.
    if (exports.cpp_seed_hash) {
      const v = exports.cpp_seed_hash(12345, 67890);
      console.log('cpp_seed_hash ->', v);
      return v;
    } else if (exports._cpp_seed_hash) {
      const v = exports._cpp_seed_hash(12345, 67890);
      console.log('cpp_seed_hash (underscore) ->', v);
      return v;
    } else {
      console.warn('cpp wasm export not found');
    }
  } catch (err) {
    console.error('Failed to load cpp wasm', err);
  }
}

export async function exampleUseRustWasm() {
  // If you built with wasm-pack, it produces wasm_rust.js glue that you can import:
  // import init, { rust_seed_hash } from './wasm_rust.js';
  // await init();
  // const v = rust_seed_hash(12345, 67890);
  // console.log('rust_seed_hash ->', v);
}
