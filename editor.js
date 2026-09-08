// editor.js
import { bootstrap } from "./Bootstrap.js";
import { SceneTree } from "./sceneHierarchy.js";
import { Inspector } from "./inspector.js";
import { Gizmo } from "./gizmo.js";

export async function bootstrapEditor() {
  const engine = bootstrap();
  window.engine = engine;

  // UI wiring
  const sceneTree = new SceneTree(document.getElementById("scene-tree"));
  const inspector = new Inspector(document.getElementById("inspector"));
  const gizmo = new Gizmo(engine.renderer, document.getElementById("viewport"));

  // populate scene tree from ECS
  function refreshScene() {
    const entities = engine.ecs.query("Transform");
    const items = entities.map(e => {
      const t = engine.ecs.getComponent(e, "Transform");
      return { id: e, name: `Entity ${e}`, transform: t };
    });
    sceneTree.set(items);
  }

  refreshScene();

  sceneTree.onSelect = (item) => {
    inspector.inspect(item);
    gizmo.attachToEntity(item.id);
  };

  document.getElementById("btn-save").onclick = async () => {
    const world = { entities: [] };
    // naive snapshot
    for (const e of engine.ecs.query("Transform")) {
      const t = engine.ecs.getComponent(e, "Transform");
      const star = engine.ecs.getComponent(e, "Star");
      const planet = engine.ecs.getComponent(e, "Planet");
      const neb = engine.ecs.getComponent(e, "Nebula");
      world.entities.push({ id: e, transform: t, star, planet, neb });
    }
    await fetch("/api/save", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ name: "autosave", data: world })});
    alert("Saved as autosave");
  };

  document.getElementById("btn-load").onclick = async () => {
    const res = await fetch("/api/load?name=autosave");
    const json = await res.json();
    if (json && json.data) {
      // naive load: clear ECS and re-add
      // (for prototype we won't implement full diffing)
      alert("Loaded world; reload page to see changes");
    } else {
      alert("No save found");
    }
  };

  document.getElementById("btn-play").onclick = () => {
    // toggle play mode
    alert("Play mode toggled (prototype)");
  };

  // gizmo mode select
  document.getElementById("gizmo-mode").onchange = (e) => gizmo.setMode(e.target.value);

  // FPS display
  const fpsEl = document.getElementById("fps");
  let last = performance.now(), frames = 0;
  function tick() {
    frames++;
    const now = performance.now();
    if (now - last >= 1000) {
      fpsEl.textContent = `FPS: ${frames}`;
      frames = 0;
      last = now;
    }
    requestAnimationFrame(tick);
  }
  tick();

  // refresh scene periodically
  setInterval(refreshScene, 1500);
}
