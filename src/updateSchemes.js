import { cellCount, getIndex, runAfterFrameStatements } from "./SandApi";
import { sands, fireEvent, fireEventPhase } from "./SandApi";
import useStore from "./store.js";

// NOTE:
// Since the world size options were added, most update schemes don't work correctly.
// RANDOM_CYCLIC was updated to work correctly, because it's the one we use.

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1));
    [array[i], array[r]] = [array[r], array[i]];
  }
  return array;
};

export const UPDATE_SCHEMES = {
  ["ORDERED"]: () => {
    for (var i = 0; i < sands.length; i += 4) {
      fireEvent(i);
    }
  },

  ["REVERSE_ORDERED"]: () => {
    for (var i = sands.length - 4; i >= 0; i -= 4) {
      fireEvent(i);
    }
  },

  ["XFIRST_ORDERED"]: () => {
    fireEventPhase({ xFirst: true });
  },

  ["REVERSE_ALTERNATE_ORDERED"]: {
    direction: true,
    tick: (scheme) => {
      if (scheme.direction) {
        for (let i = 0; i < sands.length; i += 4) {
          fireEvent(i);
        }
      } else {
        for (let i = sands.length - 4; i >= 0; i -= 4) {
          fireEvent(i);
        }
      }

      scheme.direction = !scheme.direction;
    },
  },

  ["XREVERSE_ALTERNATE_ORDERED"]: {
    phase: 0,
    phases: [
      { aDirection: 1, bDirection: 1 },
      { aDirection: 1, bDirection: -1 },
    ],
    tick: (scheme) => {
      const phase = scheme.phases[scheme.phase];
      fireEventPhase(phase);

      scheme.phase++;
      if (scheme.phase >= scheme.phases.length) {
        scheme.phase = 0;
      }
    },
  },

  ["XYREVERSE_ALTERNATE_ORDERED"]: {
    phase: 0,
    phases: [
      { xFirst: false, aDirection: 1, bDirection: 1 },
      { xFirst: false, aDirection: -1, bDirection: 1 },
      { xFirst: false, aDirection: -1, bDirection: -1 },
      { xFirst: false, aDirection: 1, bDirection: -1 },
    ],
    tick: (scheme) => {
      const phase = scheme.phases[scheme.phase];
      fireEventPhase(phase);

      scheme.phase++;
      if (scheme.phase >= scheme.phases.length) {
        scheme.phase = 0;
      }
    },
  },

  ["XFIRST_ALTERNATE_ORDERED"]: {
    phase: 0,
    phases: [{ xFirst: false }, { xFirst: true }],
    tick: (scheme) => {
      const phase = scheme.phases[scheme.phase];
      fireEventPhase(phase);

      scheme.phase++;
      if (scheme.phase >= scheme.phases.length) {
        scheme.phase = 0;
      }
    },
  },

  ["XFIRST_REVERSE_ALTERNATE_ORDERED"]: {
    phase: 0,
    phases: [
      { xFirst: false, aDirection: 1, bDirection: 1 },
      { xFirst: false, aDirection: -1, bDirection: -1 },
      { xFirst: true, aDirection: 1, bDirection: 1 },
      { xFirst: true, aDirection: -1, bDirection: -1 },
    ],
    tick: (scheme) => {
      const phase = scheme.phases[scheme.phase];
      fireEventPhase(phase);

      scheme.phase++;
      if (scheme.phase >= scheme.phases.length) {
        scheme.phase = 0;
      }
    },
  },

  ["XFIRST_XYREVERSE_ALTERNATE_ORDERED"]: {
    xFirst: false,
    xFirstTimer: 0,
    phase: 0,
    phases: [
      { aDirection: 1, bDirection: 1 },
      { aDirection: -1, bDirection: 1 },
      { aDirection: -1, bDirection: -1 },
      { aDirection: 1, bDirection: -1 },
    ],
    tick: (scheme) => {
      const phase = scheme.phases[scheme.phase];
      const { xFirst } = scheme;
      fireEventPhase({ ...phase, xFirst });

      scheme.xFirstTimer--;
      if (scheme.xFirstTimer <= 0) {
        scheme.xFirstTimer = 3;
      }

      scheme.phase++;
      if (scheme.phase >= scheme.phases.length) {
        scheme.phase = 0;
      }
    },
  },

  ["YSNAKE_ORDERED"]: {
    tick: () => {
      fireEventPhase({ snake: true, xFirst: true });
    },
  },

  ["SNAKE_ORDERED"]: {
    phase: 0,
    phases: [
      { snake: true, xFirst: true },
      { snake: true, xFirst: false },
    ],
    tick: (scheme) => {
      const phase = scheme.phases[scheme.phase];
      fireEventPhase(phase);

      scheme.phase++;
      if (scheme.phase >= scheme.phases.length) {
        scheme.phase = 0;
      }
    },
  },

  ["SNAKE_REVERSE_ALTERNATE_ORDERED"]: {
    phase: 0,
    phases: [
      { snake: true, xFirst: true },
      { snake: true, xFirst: false, aDirection: -1 },
      { snake: true, xFirst: false },
      { snake: true, xFirst: true, aDirection: -1 },
    ],
    tick: (scheme) => {
      const phase = scheme.phases[scheme.phase];
      fireEventPhase(phase);

      scheme.phase++;
      if (scheme.phase >= scheme.phases.length) {
        scheme.phase = 0;
      }
    },
  },

  ["RANDOM_INDEPENDENT"]: () => {
    for (let i = 0; i < cellCount; i++) {
      const index = Math.floor(Math.random() * cellCount) * 4;
      fireEvent(index);
    }
  },

  ["CYCLIC"]: {
    order: [],
    isSetup: false,
    setup: (scheme) => {
      for (let i = 0; i < cellCount; i++) {
        scheme.order.push(i * 4);
      }
      shuffle(scheme.order);
      scheme.isSetup = true;
    },
    tick: (scheme) => {
      if (!scheme.isSetup) scheme.setup(scheme);

      for (const index of scheme.order) {
        fireEvent(index);
      }
    },
  },

  ["RANDOM_CYCLIC"]: {
    order: [],
    isSetup: false,
    setup: (scheme) => {
      scheme.order.length = 0;
      const { worldWidth, worldHeight } = useStore.getState();
      for (let x = 0; x < worldWidth; x++) {
        for (let y = 0; y < worldHeight; y++) {
          const index = getIndex(x, y);
          scheme.order.push(index);
        }
      }
      scheme.isSetup = true;
    },
    tick: (scheme) => {
      // Refresh order if world size is changed
      const { worldCellCount } = useStore.getState();
      if (scheme.order.length !== worldCellCount) {
        scheme.isSetup = false;
      }

      if (!scheme.isSetup) scheme.setup(scheme);

      shuffle(scheme.order);
      for (const index of scheme.order) {
        fireEvent(index);
      }
    },
  },

  ["BENCHMARK"]: {
    order: [],
    isSetup: false,
    setup: (scheme) => {
      scheme.order.length = 0;
      const { worldWidth, worldHeight } = useStore.getState();
      for (let x = 0; x < worldWidth; x++) {
        for (let y = 0; y < worldHeight; y++) {
          const index = getIndex(x, y);
          scheme.order.push(index);
        }
      }
      scheme.isSetup = true;
    },
    tick: (scheme, drawer) => {
      //======= Setup: World Size =======//
      const { worldCellCount } = useStore.getState();
      if (scheme.order.length !== worldCellCount) {
        scheme.isSetup = false;
      }
      if (!scheme.isSetup) scheme.setup(scheme);

      //======= Setup: Benchmark =======//
      const startingSands = sands.slice();
      const maxTrials = 50;
      const maxReps = 20;

      //======= Benchmark =======//
      let minTotalTime = Infinity;
      let maxTotalTime = -Infinity;
      let minUpdateTime = Infinity;
      let maxUpdateTime = -Infinity;
      let minDrawTime = Infinity;
      let maxDrawTime = -Infinity;

      let totalTimeSum = 0;
      let updateTimeSum = 0;
      let drawTimeSum = 0;

      for (let trial = 0; trial < maxTrials; trial++) {
        let repTotalTimeSum = 0;
        let repUpdateTimeSum = 0;
        let repDrawTimeSum = 0;
        for (let rep = 0; rep < maxReps; rep++) {
          const startTime = performance.now();

          shuffle(scheme.order);
          for (const index of scheme.order) {
            fireEvent(index);
          }
          runAfterFrameStatements();
          const updateEndTime = performance.now();

          drawer.current();
          const drawEndTime = performance.now();

          const totalTime = drawEndTime - startTime;
          const updateTime = updateEndTime - startTime;
          const drawTime = drawEndTime - updateEndTime;
          repTotalTimeSum += totalTime;
          repUpdateTimeSum += updateTime;
          repDrawTimeSum += drawTime;
        }

        const repTotalTimeAverage = repTotalTimeSum / maxReps;
        const repUpdateTimeAverage = repUpdateTimeSum / maxReps;
        const repDrawTimeAverage = repDrawTimeSum / maxReps;

        minTotalTime = Math.min(minTotalTime, repTotalTimeAverage);
        maxTotalTime = Math.max(maxTotalTime, repTotalTimeAverage);
        minUpdateTime = Math.min(minUpdateTime, repUpdateTimeAverage);
        maxUpdateTime = Math.max(maxUpdateTime, repUpdateTimeAverage);
        minDrawTime = Math.min(minDrawTime, repDrawTimeAverage);
        maxDrawTime = Math.max(maxDrawTime, repDrawTimeAverage);

        totalTimeSum += repTotalTimeAverage;
        updateTimeSum += repUpdateTimeAverage;
        drawTimeSum += repDrawTimeAverage;

        // Reset trial
        for (let i = 0; i < sands.length; i++) {
          sands[i] = startingSands[i];
        }
      }

      const totalTimeAverage = totalTimeSum / maxTrials;
      const updateTimeAverage = updateTimeSum / maxTrials;
      const drawTimeAverage = drawTimeSum / maxTrials;

      const totalTimeRange = maxTotalTime - minTotalTime;
      const updateTimeRange = maxUpdateTime - minUpdateTime;
      const drawTimeRange = maxDrawTime - minDrawTime;

      const messageArgs = [
        `Total:`,
        parseFloat(totalTimeAverage.toPrecision(3)),
        `±`,
        parseFloat(totalTimeRange.toPrecision(2)),
        `\nUpdate:`,
        parseFloat(updateTimeAverage.toPrecision(3)),
        `±`,
        parseFloat(updateTimeRange.toPrecision(2)),
        `\nDraw:`,
        parseFloat(drawTimeAverage.toPrecision(3)),
        `±`,
        parseFloat(drawTimeRange.toPrecision(2)),
      ];

      console.log(...messageArgs);
      alert(messageArgs.join(" "));

      //======= Finish =======//
      useStore.setState({ paused: true });
    },
  },

  /*["ATOM_ORDERED"]: {
      manualTagging: true,
      orderMap: new Map(),
      isSetup: false,
      setup: (scheme) => {
        for (let i = 0; i < cellCount; i++) {
          scheme.orderMap.set(i * 4, i * 4);
        }
        scheme.isSetup = true;
      },
      tick: (scheme) => {
        if (!scheme.isSetup) scheme.setup(scheme);
  
        for (let i = 0; i < sands.length; i += 4) {
          const index = scheme.orderMap.get(i);
          scheme.fireAtomEvent(scheme, index);
        }
      },
      fireAtomEvent: (scheme, index) => {
        const swaps = fireEvent(index);
        sands[index + 3] = clock;
  
        if (swaps === undefined) return;
        for (const [a, b] of swaps) {
          const aclock = sands[a + 3];
          const bclock = sands[b + 3];
          sands[a + 3] = bclock;
          sands[b + 3] = aclock;
  
          if (a !== index) scheme.fireAtomEvent(scheme, b);
          if (b !== index) scheme.fireAtomEvent(scheme, a);
        }
      },
    },*/
};
