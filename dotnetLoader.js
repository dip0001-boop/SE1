// dotnetLoader.js
// Minimal bootstrap to load a prebuilt Blazor/Mono WASM runtime and call exported methods.
// Expect dotnet.wasm and the compiled C# app to be in root (or served path).

export async function loadDotnetRuntime() {
  // This is a minimal loader for the official dotnet WASM runtime.
  // For a production pipeline use Microsoft docs to publish a Blazor WebAssembly app.
  if (!window.dotnet) {
    // dynamic import of the official loader if present
    try {
      // dotnet.js should be present (from dotnet publish)
      await import("./dotnet.js");
    } catch (e) {
      console.warn("dotnet.js not found; C# scripting disabled", e);
      return null;
    }
  }
  // dotnet.run will be available after dotnet.js loads; call to initialize runtime
  if (window.dotnet && window.dotnet.run) {
    await window.dotnet.run();
    return window.dotnet;
  }
  return null;
}

// Helper to call a static method in a loaded assembly via JS interop
export async function invokeDotnetMethod(assemblyName, typeName, methodName, ...args) {
  if (!window.DotNet) throw new Error("DotNet runtime not loaded");
  // DotNet.invokeMethodAsync(assemblyName, methodIdentifier, args...)
  return await window.DotNet.invokeMethodAsync(assemblyName, `${typeName}.${methodName}`, ...args);
}
