import { width, height } from "./SandApi";
const fps = new (class {
  constructor() {
    if (typeof window === "undefined") {
      return;
    }
    this.fps = document.getElementById("fps");
    this.frames = [];
    this.times = [];
    this.lastFrameTimeStamp = performance.now();
  }

  render(d) {
    if (!this.fps) {
      this.fps = document.getElementById("fps");
      this.frames = [];
      this.times = [];
      this.lastFrameTimeStamp = performance.now();
    }

    // Convert the delta time since the last frame render into a measure
    // of frames per second.
    const now = performance.now();
    const delta = now - this.lastFrameTimeStamp;
    this.lastFrameTimeStamp = now;
    const fps = (1 / delta) * 1000;

    // Save only the latest 100 timings.
    this.frames.push(fps);
    if (this.frames.length > 30) {
      this.frames.shift();
    }
    // this.times.push(d);
    // if (this.times.length > 30) {
    //   this.times.shift();
    // }
    // Find the max, min, and mean of our 100 latest timings.
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    for (let i = 0; i < this.frames.length; i++) {
      sum += this.frames[i];
      min = Math.min(this.frames[i], min);
      max = Math.max(this.frames[i], max);
    }
    let mean = sum / this.frames.length;

    // Render the statistics.
    if (this.fps) {
      this.fps.textContent = `${Math.round(mean)}fps`;
      // this.fps.textContent = `${width}x${height}  ${Math.round(max)}ms`;
    }
  }
})();

export { fps };
