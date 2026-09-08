// ScriptHost.js
import { loadDotnetRuntime, invokeDotnetMethod } from "./dotnetLoader.js";

export class ScriptHost {
  constructor(ecs, renderer) {
    this.ecs = ecs;
    this.renderer = renderer;
    this.dotnet = null;
  }

  async init() {
    this.dotnet = await loadDotnetRuntime();
    if (!this.dotnet) return false;
    // call GameScript.OnStart if present
    try {
      await invokeDotnetMethod("GameAssembly", "GameScript", "OnStart");
    } catch (e) {
      console.warn("C# OnStart not found or failed", e);
    }
    return true;
  }

  async update(dt) {
    if (!this.dotnet) return;
    try {
      await invokeDotnetMethod("GameAssembly", "GameScript", "OnUpdate", dt);
    } catch (e) {
      // ignore missing method
    }
  }

  // Expose engine API for C# via global functions
  exposeAPI() {
    window.EngineAPI = {
      createEntity: () => this.ecs.createEntity(),
      addTransform: (e, x, y, z) => this.ecs.addComponent(e, "Transform", { x, y, z, rx:0, ry:0, rz:0, sx:1, sy:1, sz:1 }),
      addStar: (e, spectral, luminosity, radius, r, g, b) => this.ecs.addComponent(e, "Star", { spectralType: spectral, luminosity, luminosity, radius: radius, color: [r,g,b] }),
      setCamera: (x,y,z) => { this.renderer.camera.x = x; this.renderer.camera.y = y; this.renderer.camera.z = z; }
    };
  }
}
