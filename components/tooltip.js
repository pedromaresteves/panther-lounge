// Client-side tooltip implementation for chord diagrams

// Create a tooltip container
function createTooltip() {
  const tooltip = document.createElement('div');
  tooltip.style.position = 'absolute';
  tooltip.style.background = 'white';
  tooltip.style.border = '1px solid #ccc';
  tooltip.style.padding = '10px';
  tooltip.style.borderRadius = '5px';
  tooltip.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  tooltip.style.zIndex = '1000';
  tooltip.style.display = 'none';
  tooltip.id = 'chord-tooltip';
  document.body.appendChild(tooltip);
  return tooltip;
}

// Map our suffixes to VexChords-compatible suffixes
function mapSuffixToVexChords(suffix) {
  // Handle major variations
  if (suffix === 'major' || suffix === '') return 'M';
  if (suffix === 'major7' || suffix === 'maj7' || suffix === 'M7') return 'M7';

  // Handle minor variations  
  if (suffix === 'm' || suffix === 'min' || suffix === 'minor') return 'm';
  if (suffix === 'm7' || suffix === 'min7' || suffix === 'minor7') return 'm7';

  // Handle 7th chords
  if (suffix === '7') return '7';
  if (suffix === 'maj7') return 'M7';

  // Handle other common suffixes
  if (suffix === 'sus4') return 'sus4';
  if (suffix === 'sus2') return 'sus2';
  if (suffix === 'dim' || suffix === '°') return 'dim';
  if (suffix === 'aug' || suffix === '+') return 'aug';
  if (suffix === 'add9') return 'add9';

  // Default to major if we don't recognize the suffix
  return 'M';
}

// Render chord diagram into tooltip using VexChords
function renderChordDiagram(chordName, tooltip) {
  // Check if this is the enhanced tooltip with content/status elements
  const isEnhancedTooltip = tooltip.querySelector('#chord-tooltip-content') !== null;

  try {
    if (isEnhancedTooltip) {
      // For enhanced tooltip, render in the content area
      const contentElement = tooltip.querySelector('#chord-tooltip-content');
      contentElement.innerHTML = '';

      const chordBox = document.createElement('div');
      chordBox.style.width = '150px';
      chordBox.style.height = '150px';
      contentElement.appendChild(chordBox);

      const vexChordBox = new window.VexChords.ChordBox(chordBox, {
        width: 150,
        height: 150,
      });

      // Parse chord name and map suffix to VexChords format
      const [root, suffix] = parseChordName(chordName);
      const vexSuffix = mapSuffixToVexChords(suffix);
      
      // Try to build the chord structure using VexChords build function
      try {
          const chordStructure = window.VexChords.build(root, 'E', vexSuffix + ' E');
          vexChordBox.draw(chordStructure);
      } catch (buildError) {
          console.warn(`Could not build chord ${chordName} with VexChords build function:`, buildError);

          // Fallback: Try to find a manual chord definition
          const manualChord = getManualChordDefinition(root, suffix);
          if (manualChord) {
              vexChordBox.draw(manualChord);
          } else {
              // If all else fails, show error in tooltip
              throw new Error(`Unsupported chord: ${chordName}`);
          }
      }
    } else {
      // For simple tooltip, clear and render
      tooltip.innerHTML = '';

      const chordBox = document.createElement('div');
      chordBox.style.width = '150px';
      chordBox.style.height = '150px';
      tooltip.appendChild(chordBox);

      const vexChordBox = new window.VexChords.ChordBox(chordBox, {
        width: 150,
        height: 150,
      });

      // Parse chord name and map suffix to VexChords format
      const [root, suffix] = parseChordName(chordName);
      const vexSuffix = mapSuffixToVexChords(suffix);
      
      // Try to build the chord structure using VexChords build function
      try {
          const chordStructure = window.VexChords.build(root, 'E', vexSuffix + ' E');
          vexChordBox.draw(chordStructure);
      } catch (buildError) {
          console.warn(`Could not build chord ${chordName} with VexChords build function:`, buildError);

          // Fallback: Try to find a manual chord definition
          const manualChord = getManualChordDefinition(root, suffix);
          if (manualChord) {
              vexChordBox.draw(manualChord);
          } else {
              // If all else fails, show error in tooltip
              throw new Error(`Unsupported chord: ${chordName}`);
          }
      }
    }
  } catch (error) {
    console.error('Error rendering chord diagram with VexChords:', error);

    // Fallback to text representation
    if (isEnhancedTooltip) {
      const contentElement = tooltip.querySelector('#chord-tooltip-content');
      if (contentElement) {
        contentElement.innerHTML = `
          <div style="font-weight: bold; font-size: 16px;">${chordName}</div>
          <div style="font-size: 12px; color: #666; margin-top: 8px;">Chord diagram unavailable</div>
        `;
      }
    } else {
      tooltip.textContent = chordName + ' chord';
      tooltip.style.textAlign = 'center';
      tooltip.style.lineHeight = '150px';
    }
  }
}

// Get manual chord definition for chords not supported by build function
function getManualChordDefinition(root, suffix) {
    // Map of common chord shapes that might not be in the builder
    const manualChords = {
        // Major 7th chords
        'CM7': { chord: [[1, 'x'], [2, 1], [3, 2], [4, 2], [5, 'x'], [6, 1]], position: 1 },
        'DM7': { chord: [[1, 2], [2, 1], [3, 2], [4, 0], [5, 'x'], [6, 'x']], position: 2 },
        'EM7': { chord: [[1, 0], [2, 0], [3, 1], [4, 2], [5, 0], [6, 0]], position: 0 },
        'FM7': { chord: [[1, 1], [2, 1], [3, 2], [4, 1], [5, 'x'], [6, 1]], position: 1 },
        'GM7': { chord: [[1, 3], [2, 2], [3, 0], [4, 0], [5, 'x'], [6, 3]], position: 3 },
        'AM7': { chord: [[1, 0], [2, 0], [3, 2], [4, 1], [5, 0], [6, 0]], position: 0 },
        'BM7': { chord: [[1, 2], [2, 1], [3, 2], [4, 2], [5, 'x'], [6, 2]], position: 2 },
        
        // Major chords
        'C': { chord: [[1, 'x'], [2, 1], [3, 2], [4, 2], [5, 'x'], [6, 1]], position: 1 },
        'D': { chord: [[1, 2], [2, 1], [3, 2], [4, 0], [5, 'x'], [6, 'x']], position: 2 },
        'E': { chord: [[1, 0], [2, 0], [3, 1], [4, 2], [5, 2], [6, 0]], position: 0 },
        'F': { chord: [[1, 1], [2, 1], [3, 2], [4, 3], [5, 3], [6, 1]], position: 1 },
        'G': { chord: [[1, 3], [2, 2], [3, 0], [4, 0], [5, 'x'], [6, 3]], position: 3 },
        'A': { chord: [[1, 0], [2, 0], [3, 2], [4, 2], [5, 2], [6, 0]], position: 0 },
        'B': { chord: [[1, 2], [2, 1], [3, 2], [4, 2], [5, 'x'], [6, 2]], position: 2 },
        
        // Minor chords
        'Cm': { chord: [[1, 'x'], [2, 1], [3, 2], [4, 2], [5, 'x'], [6, 1]], position: 1 },
        'Dm': { chord: [[1, 1], [2, 1], [3, 2], [4, 0], [5, 'x'], [6, 'x']], position: 1 },
        'Em': { chord: [[1, 0], [2, 0], [3, 0], [4, 2], [5, 2], [6, 0]], position: 0 },
        'Fm': { chord: [[1, 1], [2, 1], [3, 1], [4, 3], [5, 3], [6, 1]], position: 1 },
        'Gm': { chord: [[1, 3], [2, 1], [3, 0], [4, 0], [5, 'x'], [6, 3]], position: 3 },
        'Am': { chord: [[1, 0], [2, 0], [3, 2], [4, 2], [5, 1], [6, 0]], position: 0 },
        'Bm': { chord: [[1, 2], [2, 0], [3, 2], [4, 2], [5, 'x'], [6, 2]], position: 2 }
    };

    // Check if we have a manual definition for this chord
    const chordKey = root + suffix;
    if (manualChords[chordKey]) {
        return manualChords[chordKey];
    }

    return null; // No manual definition available
}

// Parse chord name into root and suffix
function parseChordName(chordName) {
  // Handle slash chords first (e.g., "Am/G", "D7/F#")
  const slashMatch = chordName.match(/^([A-G][#b]?(?:m|maj|min|dim|aug|sus|add|\d)?[#b\d\/]*)\/([A-G][#b]?)$/);

  if (slashMatch) {
    // For slash chords, use the part before the slash as the main chord
    const mainChord = slashMatch[1];
    const bassNote = slashMatch[2];

    // Parse the main chord part
    const rootMatch = mainChord.match(/^[A-G][#b]?/);
    const root = rootMatch ? rootMatch[0] : 'C';
    let suffix = mainChord.slice(root.length);

    // Normalize suffix
    suffix = suffix.replace('/' + bassNote, ''); // Remove any accidental slash
    suffix = suffix || 'major';

    return [root, suffix];
  }

  // Handle regular chords (including extended chords like Fmaj7)
  const rootMatch = chordName.match(/^[A-G][#b]?/);
  const root = rootMatch ? rootMatch[0] : 'C';

  // Extract suffix (everything after root note)
  let suffix = chordName.slice(root.length);

  // Normalize common suffix variations
  suffix = suffix.replace('maj', 'major'); // Convert maj to major
  suffix = suffix.replace('min', 'minor'); // Convert min to minor

  // Handle cases where suffix is empty
  suffix = suffix || 'major';

  return [root, suffix];
}

// ChordTooltip interface for compatibility with existing code
const ChordTooltip = {
  tooltip: null,
  pendingRequests: [],

  init: function () {
    this.tooltip = createTooltip();

    // Set up keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.tooltip) {
        this.hide();
      }
    });

    // Process any pending requests
    this.processPendingRequests();
  },

  show: function (chordName, chordElement) {
    if (!this.tooltip) {
      // If not initialized yet, queue the request
      this.pendingRequests.push({ action: 'show', chordName, chordElement });
      return;
    }

    try {
      renderChordDiagram(chordName, this.tooltip);

      // Position tooltip near the chord
      const rect = chordElement.getBoundingClientRect();
      this.tooltip.style.left = `${rect.left + window.scrollX}px`;
      this.tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
      this.tooltip.style.display = 'block';

      // Add accessibility attributes
      chordElement.setAttribute('aria-describedby', 'chord-tooltip');
    } catch (error) {
      console.error('Error rendering chord diagram:', error);
    }
  },

  hide: function () {
    if (this.tooltip) {
      this.tooltip.style.display = 'none';

      // Remove accessibility attributes
      const activeElement = document.activeElement;
      if (activeElement && activeElement.classList.contains('chord')) {
        activeElement.removeAttribute('aria-describedby');
      }
    } else {
      // If not initialized yet, queue the request
      this.pendingRequests.push({ action: 'hide' });
    }
  },

  processPendingRequests: function () {
    while (this.pendingRequests.length > 0) {
      const request = this.pendingRequests.shift();
      if (request.action === 'show') {
        this.show(request.chordName, request.chordElement);
      } else if (request.action === 'hide') {
        this.hide();
      }
    }
  }
};

// Enhanced tooltip initialization that works with local VexChords
function checkVexChordsAndInit() {
  console.log('Tooltip module: Checking VexChords availability...', typeof window.VexChords);

  if (typeof window.VexChords !== 'undefined') {
    // VexChords is available - enhance the existing chordTooltip
    if (window.chordTooltip) {
      console.log('Enhancing existing chordTooltip with VexChords');

      // Store reference to original methods
      const originalShow = window.chordTooltip.show;
      const originalHide = window.chordTooltip.hide;

      // Override show method to use VexChords when possible
      window.chordTooltip.show = function (chordName, chordElement) {
        try {
          // Try to render with VexChords
          renderChordDiagram(chordName, this.tooltip);

          // Position tooltip near the chord
          const rect = chordElement.getBoundingClientRect();
          this.tooltip.style.left = `${rect.left + window.scrollX}px`;
          this.tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
          this.tooltip.style.display = 'block';

          // Add accessibility attributes
          chordElement.setAttribute('aria-describedby', 'chord-tooltip');

          // Update status if method exists
          if (this.upgradeToVexChords) {
            this.upgradeToVexChords();
          }
        } catch (error) {
          console.error('Error rendering with VexChords, falling back:', error);
          // Fall back to original implementation
          originalShow.call(this, chordName, chordElement);
        }
      };

      // Keep the original hide method
      window.chordTooltip.hide = originalHide;

      console.log('ChordTooltip successfully enhanced with VexChords');
    } else {
      // No existing chordTooltip - initialize the full version
      window.chordTooltip = ChordTooltip;
      ChordTooltip.init();
      console.log('ChordTooltip initialized with VexChords');
    }
  } else {
    // VexChords not available
    console.log('VexChords not available, will use standalone fallback');

    // If we have a standalone tooltip, notify it about the failure
    if (window.chordTooltip && window.chordTooltip.handleVexChordsFailure) {
      window.chordTooltip.handleVexChordsFailure();
    }
  }
}

// Check immediately and also on DOMContentLoaded
document.addEventListener('DOMContentLoaded', checkVexChordsAndInit);

// Also check after a delay in case VexChords loads slowly
setTimeout(checkVexChordsAndInit, 3000);

// Initialize tooltips when imported
console.log('Tooltip module loaded');
checkVexChordsAndInit();