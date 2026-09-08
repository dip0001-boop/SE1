// preloader.js
export async function preloadAssets(manifestPath = "/preloadManifest.json", onProgress = null) {
  try {
    const res = await fetch(manifestPath);
    const manifest = await res.json();
    const assets = manifest.assets || [];
    let loaded = 0;
    const total = assets.length;
    const results = {};
    for (const a of assets) {
      try {
        const r = await fetch(a);
        if (!r.ok) throw new Error("404 " + a);
        // small assets: read as blob for caching; large wasm left as response
        const ct = r.headers.get("content-type") || "";
        if (ct.includes("application/wasm") || a.endsWith(".wasm")) {
          // keep as response for later instantiateStreaming
          results[a] = r;
        } else {
          results[a] = await r.blob();
        }
      } catch (e) {
        // non-fatal: continue
        console.warn("preload failed", a, e);
      }
      loaded++;
      if (onProgress) onProgress(loaded / total, a);
    }
    return results;
  } catch (err) {
    console.warn("preload manifest failed", err);
    return {};
  }
}
