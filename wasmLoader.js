// wasmLoader.js
// Small ESM helper to load a wasm module and return its exports.
// Usage: const mod = await loadWasmModule('./wasm_cpp.wasm', { env: {} });

export async function loadWasmModule(url, importObject = {}) {
  if (typeof WebAssembly === 'undefined') {
    throw new Error('WebAssembly not supported');
  }

  // Try instantiateStreaming first
  try {
    if (WebAssembly.instantiateStreaming) {
      const resp = await fetch(url);
      const result = await WebAssembly.instantiateStreaming(resp, importObject);
      return result.instance.exports;
    }
  } catch (e) {
    // fall through to arrayBuffer path
  }

  const bytes = await (await fetch(url)).arrayBuffer();
  const mod = await WebAssembly.compile(bytes);
  const instance = await WebAssembly.instantiate(mod, importObject);
  return instance.exports;
}
