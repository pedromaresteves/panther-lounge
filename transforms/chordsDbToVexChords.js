function chordsDbToVexChords(chordsDbEntry, variationIndex = 0) {
  const position = chordsDbEntry.positions[variationIndex];
  if (!position) throw new Error(`Variation ${variationIndex} not found`);

  // Parse frets and fingers strings into arrays
  const frets = position.frets.split('').map((fret, i) => {
    const fretNum = fret === 'x' ? -1 : parseInt(fret, 10);
    return [i, fretNum];
  });

  const fingers = position.fingers.split('').map((finger, i) => {
    const fingerNum = finger === '0' ? 0 : parseInt(finger, 10);
    return [i, fingerNum];
  });

  // Extract barre frets
  const barres = position.barres ? [position.barres] : [];

  // Determine position (first non-zero fret, or 0 for open chords)
  const firstFret = Math.min(
    ...position.frets.split('').filter(f => f !== 'x' && f !== '0').map(f => parseInt(f, 10))
  );
  const vexPosition = firstFret > 0 ? firstFret : 0;

  return {
    chord: `${chordsDbEntry.key}${chordsDbEntry.suffix === 'major' ? '' : chordsDbEntry.suffix}`,
    position: vexPosition,
    barres,
    fingers,
    frets,
    tuning: ["E", "A", "D", "G", "B", "E"], // Standard tuning
  };
}

export default chordsDbToVexChords;