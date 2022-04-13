import { cellCount } from "./SandApi";
import { sands, fireEvent, fireEventPhase } from "./SandApi";

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
      for (let i = 0; i < cellCount; i++) {
        scheme.order.push(i * 4);
      }
      scheme.isSetup = true;
    },
    tick: (scheme) => {
      if (!scheme.isSetup) scheme.setup(scheme);

      shuffle(scheme.order);
      for (const index of scheme.order) {
        fireEvent(index);
      }
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
