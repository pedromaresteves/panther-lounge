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

  // Parse chord name into key and suffix (e.g., "A", "Am", "C#m7", "N.C.")
  _parseChordName(chordName) {
    if (chordName === 'N.C.') return { key: null, suffix: null };
    
    const regex = /^([A-G][b#]?)(.*)$/;
    const match = chordName.match(regex);
    if (!match) return { key: null, suffix: null };
    
    return {
      key: match[1],
      suffix: match[2] || 'major'
    };
  }
  
  async show(chordName, targetElement) {
    this.currentChord = chordName;
    this.currentPositionIndex = 0;
    
    try {
      const { key, suffix } = this._parseChordName(chordName);
      if (!key) {
        this.hide();
        return;
      }
      
      // Use cached chordsDB if available
      let positions = [];
      if (window.chordsDB) {
        positions = window.chordsDB[key]?.[suffix] || [];
        if (positions.length === 0) {
          console.warn(`No positions found for chord: ${key}${suffix}`);
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
      chord: {
        fingers: position.fingers,
        barres: position.barres,
        capo: position.capo,
        position: 1,
        frets: position.frets,
      },
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