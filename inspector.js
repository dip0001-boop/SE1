// inspector.js
export class Inspector {
  constructor(rootEl) {
    this.rootEl = rootEl;
    this.current = null;
  }

  inspect(item) {
    this.current = item;
    this.render();
  }

  render() {
    const el = this.rootEl;
    el.innerHTML = "";
    if (!this.current) return;
    const title = document.createElement("div");
    title.textContent = this.current.name;
    title.style.fontWeight = "600";
    title.style.marginBottom = "8px";
    el.appendChild(title);

    const t = this.current.transform;
    this.addNumberField(el, "X", t.x, (v) => t.x = v);
    this.addNumberField(el, "Y", t.y, (v) => t.y = v);
    this.addNumberField(el, "Z", t.z, (v) => t.z = v);
  }

  addNumberField(root, label, value, onChange) {
    const wrap = document.createElement("div");
    wrap.className = "field";
    const lab = document.createElement("label");
    lab.textContent = label;
    const input = document.createElement("input");
    input.type = "number";
    input.value = value;
    input.onchange = () => onChange(Number(input.value));
    wrap.appendChild(lab);
    wrap.appendChild(input);
    root.appendChild(wrap);
  }
}
