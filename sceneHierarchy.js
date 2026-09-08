// sceneHierarchy.js
export class SceneTree {
  constructor(rootEl) {
    this.rootEl = rootEl;
    this.onSelect = null;
    this.items = [];
  }

  set(items) {
    this.items = items;
    this.render();
  }

  render() {
    this.rootEl.innerHTML = "";
    for (const it of this.items) {
      const div = document.createElement("div");
      div.className = "scene-item";
      div.textContent = it.name;
      div.onclick = () => {
        this.rootEl.querySelectorAll(".scene-item").forEach(n => n.classList.remove("selected"));
        div.classList.add("selected");
        if (this.onSelect) this.onSelect(it);
      };
      this.rootEl.appendChild(div);
    }
  }
}
