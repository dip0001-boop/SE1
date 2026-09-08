export class System {
  constructor(ecs) {
    this.ecs = ecs;
  }

  update(_dt) {
    // override in subclasses
  }
}
