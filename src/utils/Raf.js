export class Raf {
  constructor() {
    this.rafId = 0;
    this.raf = this.raf.bind(this);
    this.callbacks = [];

    this.start();
  }

  start() {
    this.raf();
  }

  stop() {
    cancelAnimationFrame(this.rafId);
  }

  raf() {
    this.callbacks.forEach((callback) => callback());
    this.rafId = requestAnimationFrame(this.raf);
  }

  add(callback) {
    this.callbacks.push(callback);
  }
}

export const raf = new Raf();
