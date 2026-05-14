// Standalone chord tooltip that doesn't depend on modules
// This will be loaded as a regular script

console.log('Loading standalone chord tooltip...');

// Enhanced chord tooltip implementation
function createEnhancedChordTooltip() {
  const tooltip = document.createElement('div');
  tooltip.style.position = 'absolute';
  tooltip.style.background = 'white';
  tooltip.style.border = '1px solid #ccc';
  tooltip.style.padding = '0';
  tooltip.style.borderRadius = '5px';
  tooltip.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  tooltip.style.zIndex = '1000';
  tooltip.style.display = 'none';
  tooltip.style.minWidth = '120px';
  tooltip.id = 'chord-tooltip';
  
  tooltip.innerHTML = `
    <div id="chord-tooltip-content" style="padding: 10px; text-align: center; min-height: 40px;">
      <!-- Chord content will be inserted here -->
    </div>
    <div id="chord-tooltip-status" style="font-size: 11px; color: #666; padding: 4px 8px; background: #f8f9fa; border-top: 1px solid #e9ecef; text-align: center;">
      Chord diagrams loading...
    </div>
  `;
  
  document.body.appendChild(tooltip);
  return tooltip;
}

function getChordInfo(chordName) {
  // Basic chord information for common chords
  const chordInfo = {
    'C': {notes: 'C-E-G', type: 'Major'},
    'Cm': {notes: 'C-E♭-G', type: 'Minor'},
    'G': {notes: 'G-B-D', type: 'Major'},
    'G7': {notes: 'G-B-D-F', type: 'Dominant 7th'},
    'D': {notes: 'D-F#-A', type: 'Major'},
    'Dm': {notes: 'D-F-A', type: 'Minor'},
    'A': {notes: 'A-C#-E', type: 'Major'},
    'Am': {notes: 'A-C-E', type: 'Minor'},
    'E': {notes: 'E-G#-B', type: 'Major'},
    'Em': {notes: 'E-G-B', type: 'Minor'},
    'F': {notes: 'F-A-C', type: 'Major'},
    'Fm': {notes: 'F-A♭-C', type: 'Minor'},
    'B': {notes: 'B-D#-F#', type: 'Major'},
    'Bm': {notes: 'B-D-F#', type: 'Minor'}
  };
  
  // Extract root note
  const root = chordName.match(/^[A-G][#b]?/)?.[0] || 'C';
  const suffix = chordName.slice(root.length);
  
  // Return chord information
  if (chordInfo[chordName]) {
    return {
      name: chordName,
      notes: chordInfo[chordName].notes,
      type: chordInfo[chordName].type
    };
  } else if (suffix === 'm') {
    const majorChord = root;
    if (chordInfo[majorChord]) {
      return {
        name: chordName,
        notes: chordInfo[majorChord].notes.replace('♭', '').replace('#', '') + '♭',
        type: 'Minor'
      };
    }
  } else if (suffix.includes('7')) {
    const majorChord = root;
    if (chordInfo[majorChord]) {
      return {
        name: chordName,
        notes: chordInfo[majorChord].notes + '-F',
        type: 'Dominant 7th'
      };
    }
  }
  
  // Default information
  return {
    name: chordName,
    notes: 'Notes not available',
    type: 'Chord'
  };
}

const ChordTooltip = {
  tooltip: null,
  contentElement: null,
  statusElement: null,
  
  init: function() {
    console.log('Initializing enhanced chord tooltip');
    this.tooltip = createEnhancedChordTooltip();
    this.contentElement = document.getElementById('chord-tooltip-content');
    this.statusElement = document.getElementById('chord-tooltip-status');
    
    // Set up keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.tooltip) {
        this.hide();
      }
    });
    
    // Update status to indicate VexChords is loading
    if (this.statusElement) {
      this.statusElement.textContent = 'Chord diagrams loading...';
      this.statusElement.style.color = '#666';
    }
  },
  
  show: function(chordName, chordElement) {
    if (!this.tooltip) {
      this.init();
    }
    
    // Get chord information
    const chordInfo = getChordInfo(chordName);
    
    // Update tooltip content
    if (this.contentElement) {
      this.contentElement.innerHTML = `
        <div style="font-weight: bold; font-size: 16px;">${chordInfo.name}</div>
        <div style="font-size: 12px; color: #666; margin-top: 4px;">${chordInfo.type}</div>
        <div style="font-size: 11px; color: #999; margin-top: 2px;">${chordInfo.notes}</div>
      `;
    }
    
    // Position tooltip near the chord
    const rect = chordElement.getBoundingClientRect();
    this.tooltip.style.left = `${rect.left + window.scrollX}px`;
    this.tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
    this.tooltip.style.display = 'block';
    
    // Add accessibility attributes
    chordElement.setAttribute('aria-describedby', 'chord-tooltip');
  },
  
  hide: function() {
    if (this.tooltip) {
      this.tooltip.style.display = 'none';
      
      // Remove accessibility attributes
      const activeElement = document.activeElement;
      if (activeElement && activeElement.classList.contains('chord')) {
        activeElement.removeAttribute('aria-describedby');
      }
    }
  },
  
  // Method to upgrade to VexChords when available
  upgradeToVexChords: function() {
    if (this.statusElement) {
      this.statusElement.textContent = 'Chord diagrams enabled!';
      this.statusElement.style.color = '#28a745';
      this.statusElement.style.background = '#d4edda';
    }
    console.log('Chord tooltip upgraded to VexChords');
  },
  
  // Method to handle VexChords failure
  handleVexChordsFailure: function() {
    if (this.statusElement) {
      this.statusElement.textContent = 'Chord diagrams unavailable';
      this.statusElement.style.color = '#dc3545';
      this.statusElement.style.background = '#f8d7da';
    }
    console.warn('VexChords failed to load, using enhanced text tooltip');
  }
};

// Initialize when DOM is ready
function initializeChordTooltip() {
  if (document.readyState === 'loading') {
    // Still loading, wait for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', function() {
      window.chordTooltip = ChordTooltip;
      ChordTooltip.init();
      console.log('Enhanced standalone chord tooltip initialized');
    });
  } else {
    // DOM already loaded, initialize immediately
    window.chordTooltip = ChordTooltip;
    ChordTooltip.init();
    console.log('Enhanced standalone chord tooltip initialized');
  }
}

// Start initialization
console.log('Standalone chord tooltip script loaded, waiting for DOM...');
initializeChordTooltip();