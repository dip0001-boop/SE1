// ScriptHost.js (updated)
import { loadDotnetRuntime, invokeDotnetMethod } from "./dotnetLoader.js";

export class ScriptHost {
  constructor(ecs, renderer) {
    this.ecs = ecs;
    this.renderer = renderer;
    this.dotnet = null;
    this._hotReloadCallbacks = [];
  }

  async init() {
    this.dotnet = await loadDotnetRuntime();
    if (!this.dotnet) return false;
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

  exposeAPI() {
    window.EngineAPI = {
      createEntity: () => this.ecs.createEntity(),
      addTransform: (e, x, y, z) => this.ecs.addComponent(e, "Transform", { x, y, z, rx:0, ry:0, rz:0, sx:1, sy:1, sz:1 }),
      addStar: (e, spectral, luminosity, radius, r, g, b) => this.ecs.addComponent(e, "Star", { spectralType: spectral, luminosity, radius, color: [r,g,b] }),
      setCamera: (x,y,z) => { this.renderer.camera.x = x; this.renderer.camera.y = y; this.renderer.camera.z = z; },
      // hot reload trigger for C# assembly replacement
      _hotReload: async () => {
        try {
          if (window.DotNet && window.DotNet.attachHotReload) {
            await window.DotNet.attachHotReload();
          }
          // call OnStart again
          await invokeDotnetMethod("GameAssembly", "GameScript", "OnStart");
          console.log("C# hot reload applied");
        } catch (e) {
          console.warn("Hot reload failed", e);
        }
      }
    };
  }
}
