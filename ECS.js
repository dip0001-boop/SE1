import { createEntityId } from "./Entity.js";

export class ECS {
  constructor() {
    this.components = new Map();
  }

  createEntity() {
    return createEntityId();
  }

  destroyEntity(e) {
    for (const compMap of this.components.values()) {
      compMap.delete(e);
    }
  }

  addComponent(entity, name, data) {
    let compMap = this.components.get(name);
    if (!compMap) {
      compMap = new Map();
      this.components.set(name, compMap);
    }
    compMap.set(entity, data);
  }

  removeComponent(entity, name) {
    const compMap = this.components.get(name);
    compMap?.delete(entity);
  }

  getComponent(entity, name) {
    return this.components.get(name)?.get(entity);
  }

  query(...componentNames) {
    if (componentNames.length === 0) return [];
    const maps = componentNames.map((n) => this.components.get(n) || new Map());
    const first = maps[0];
    const result = [];
    for (const e of first.keys()) {
      if (maps.every((m) => m.has(e))) result.push(e);
    }
    return result;
  }
}
