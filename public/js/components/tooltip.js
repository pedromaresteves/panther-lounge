"use strict";

import { ChordBox } from "vexchords";

class ChordTooltip {
  constructor() {
    this.tooltip = document.createElement("div");
    this.tooltip.className = "chord-tooltip";
    this.tooltip.setAttribute("role", "tooltip");
    this.tooltip.setAttribute("aria-hidden", "true");
    this.tooltip.innerHTML = `
      <div class="chord-tooltip-header">
        <button class="chord-tooltip-arrow chord-tooltip-arrow-left" aria-label="Previous position">←</button>
        <span class="chord-tooltip-title"></span>
        <button class="chord-tooltip-arrow chord-tooltip-arrow-right" aria-label="Next position">→</button>
      </div>
      <div class="chord-tooltip-diagram"></div>
    `;
    document.body.appendChild(this.tooltip);

    this.currentChord = null;
    this.currentPositionIndex = 0;
    this.positions = [];

    this._setupEventListeners();
  }

  _setupEventListeners() {
    this.tooltip.querySelector(".chord-tooltip-arrow-left").addEventListener("click", () => this._navigatePosition(-1));
    this.tooltip.querySelector(".chord-tooltip-arrow-right").addEventListener("click", () => this._navigatePosition(1));
  }

  _navigatePosition(direction) {
    if (!this.positions.length) return;

    this.currentPositionIndex = (this.currentPositionIndex + direction + this.positions.length) % this.positions.length;
    this._renderDiagram();
  }

  // Parse chord name into key, suffix, and bass note (e.g., "A", "Am", "C#m7", "D7/F#", "N.C.")
  _parseChordName(chordName) {
    if (chordName === 'N.C.') return { key: null, suffix: null, bass: null };

    // Handle slash chords (e.g., "D7/F#", "Am/G")
    const slashMatch = chordName.match(/^(.+?)\/([A-G][b#]?)$/);
    if (slashMatch) {
      // Parse the chord name before the slash (e.g., "Am" or "D7")
      const baseChord = slashMatch[1];
      const baseMatch = baseChord.match(/^([A-G][b#]?)(.*)$/);
      if (!baseMatch) return { key: null, suffix: null, bass: null };
      
      let suffix = baseMatch[2] || 'major';
      // Normalize minor chord suffixes
      if (suffix === 'm') suffix = 'minor';
      if (suffix === 'min') suffix = 'minor';
      
      return {
        key: baseMatch[1],
        suffix: suffix,
        bass: slashMatch[2],
        isMinor: baseMatch[2].includes('m') || baseMatch[2].includes('min')
      };
    }

    const regex = /^([A-G][b#]?)(.*)$/;
    const match = chordName.match(regex);
    if (!match) return { key: null, suffix: null, bass: null };

    let suffix = match[2] || 'major';
    // Normalize minor chord suffixes
    if (suffix === 'm') suffix = 'minor';
    if (suffix === 'min') suffix = 'minor';

    return {
      key: match[1],
      suffix: suffix,
      bass: null
    };
  }

  async show(chordName, targetElement) {
    this.currentChord = chordName;
    this.currentPositionIndex = 0;

    try {
      const { key, suffix, bass, isMinor } = this._parseChordName(chordName);
      if (!key) {
        this.hide();
        return;
      }

      // Use cached chordsDB if available
      let positions = [];
      if (window.chordsDB) {
        // Handle slash chords (e.g., "D7/F#", "Am/G")
        if (bass) {
          // Fetch positions for the base chord (e.g., "D7" or "Am")
          let basePositions = window.chordsDB[key]?.[suffix] || [];
          
          // Fallback to shorthand suffix (e.g., "m" for "minor") if no positions found
          if (basePositions.length === 0 && suffix === 'minor') {
            basePositions = window.chordsDB[key]?.['m'] || [];
          }
          
          // Fetch positions for the bass note (e.g., "A/G")
          let bassPositions = [];
          if (isMinor) {
            bassPositions = window.chordsDB[key]?.[`m/${bass}`] || [];
            // Fallback to major slash chord if minor slash chord not found
            if (bassPositions.length === 0) {
              bassPositions = window.chordsDB[key]?.[`/${bass}`] || [];
            }
          } else {
            bassPositions = window.chordsDB[key]?.[`/${bass}`] || [];
          }
          } else {
            bassPositions = window.chordsDB[key]?.[`/${bass}`] || [];
          }
          
          // For slash chords, prioritize bass positions that are compatible with the base chord
          // E.g., for "Am/G", prioritize positions from "m_G" that work with "minor"
          positions = [...bassPositions];
          
          // If no bass positions, fall back to base chord positions
          if (positions.length === 0) {
            positions = [...basePositions];
          }
        } else {
          // Try the normalized suffix first (e.g., "minor" for "m")
          positions = window.chordsDB[key]?.[suffix] || [];
          
          // Fallback to shorthand suffix (e.g., "m" for "minor") if no positions found
          if (positions.length === 0 && suffix === 'minor') {
            positions = window.chordsDB[key]?.['m'] || [];
          }
        }
        
        if (positions.length === 0) {
          console.warn(`No positions found for chord: ${key}${suffix}${bass ? `/${bass}` : ''}`);
        }
      }

      if (positions.length) {
        this.positions = positions;
        this._renderDiagram();
        this._positionTooltip(targetElement);
        this.tooltip.setAttribute("aria-hidden", "false");
        this.tooltip.setAttribute("aria-label", `Chord diagram for ${chordName}`);
      } else {
        this.hide();
      }
    } catch (error) {
      console.error("Failed to fetch chord data:", error);
      this.hide();
    }
  }

  _renderDiagram() {
    const diagramContainer = this.tooltip.querySelector(".chord-tooltip-diagram");
    const titleElement = this.tooltip.querySelector(".chord-tooltip-title");

    if (!this.positions.length) return;

    const position = this.positions[this.currentPositionIndex];
    console.log("Rendering position:", this.positions);
    titleElement.textContent = `${this.currentChord} (Position ${this.currentPositionIndex + 1}/${this.positions.length})`;

    diagramContainer.innerHTML = "";

    new ChordBox(diagramContainer, 80, 120, {
      numStrings: 6,
      numFrets: 5,
      showTuning: false,
      defaultColor: "#000",
      fretColor: "#000",
      labelColor: "#000",
      stringColor: "#000",
      fretWidth: 2,
      labelWeight: "bold",
    }).draw({
      chord: position.frets.map((value, index) => [position.frets.length - index, value === -1 ? 'x' : value]),
      position: position.barres,
    });
  }

  _positionTooltip(targetElement) {
    const rect = targetElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    this.tooltip.style.top = `${rect.top + scrollTop - this.tooltip.offsetHeight - 10}px`;
    this.tooltip.style.left = `${rect.left + scrollLeft + (rect.width / 2) - (this.tooltip.offsetWidth / 2)}px`;
  }

  hide() {
    this.tooltip.setAttribute("aria-hidden", "true");
    this.positions = [];
    this.currentChord = null;
  }
}

// Initialize and expose the tooltip globally
const chordTooltip = new ChordTooltip();
window.chordTooltip = chordTooltip;

export default ChordTooltip;