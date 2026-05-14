// This module imports VexChords from npm and exposes it to the window object
// This allows both module and non-module code to access VexChords

import { ChordBox, POSITIONS, SHAPES, build, draw } from 'vexchords';

console.log('Exposing VexChords to window object...');

// Create VexChords namespace on window
window.VexChords = {
  ChordBox: ChordBox,
  POSITIONS: POSITIONS,
  SHAPES: SHAPES,
  build: build,
  draw: draw
};

console.log('VexChords exposed to window:', {
  available: typeof window.VexChords !== 'undefined',
  hasChordBox: typeof window.VexChords?.ChordBox !== 'undefined',
  hasDraw: typeof window.VexChords?.draw !== 'undefined'
});

export { ChordBox, POSITIONS, SHAPES, build, draw };