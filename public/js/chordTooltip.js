(function () {
  'use strict';

  var ChordTooltip = {
    tooltip: null,
    contentElement: null,
    counterElement: null,
    prevArrow: null,
    nextArrow: null,
    currentShapeIndex: 0,
    currentChordName: '',
    currentChordShapes: [],

    init: function () {
      this.createTooltipDOM();
      this.addEventListeners();
    },

    createTooltipDOM: function () {
      var tooltip = document.createElement('div');
      tooltip.id = 'chord-tooltip';
      tooltip.style.position = 'absolute';
      tooltip.style.background = '#fff';
      tooltip.style.border = '1px solid #ddd';
      tooltip.style.borderRadius = '6px';
      tooltip.style.boxShadow = '0 3px 12px rgba(0,0,0,0.12)';
      tooltip.style.padding = '8px';
      tooltip.style.zIndex = '1000';
      tooltip.style.display = 'none';
      tooltip.style.minWidth = '100px';

      var wrapper = document.createElement('div');
      wrapper.style.position = 'relative';

      var content = document.createElement('div');
      content.id = 'chord-tooltip-content';
      content.style.minHeight = '30px';
      content.style.display = 'flex';
      content.style.alignItems = 'center';
      content.style.justifyContent = 'center';
      wrapper.appendChild(content);

      var counter = document.createElement('div');
      counter.id = 'chord-tooltip-counter';
      counter.style.position = 'absolute';
      counter.style.bottom = '2px';
      counter.style.right = '4px';
      counter.style.fontSize = '10px';
      counter.style.color = '#999';
      counter.style.display = 'none';
      wrapper.appendChild(counter);

      var prev = document.createElement('button');
      prev.className = 'chord-nav-arrow prev';
      prev.textContent = '\u2190';
      prev.style.position = 'absolute';
      prev.style.left = '0';
      prev.style.top = '50%';
      prev.style.transform = 'translateY(-50%)';
      prev.style.display = 'none';
      prev.style.border = 'none';
      prev.style.background = 'rgba(0,0,0,0.04)';
      prev.style.borderRadius = '3px';
      prev.style.cursor = 'pointer';
      prev.style.fontSize = '14px';
      prev.style.padding = '2px 6px';
      wrapper.appendChild(prev);

      var next = document.createElement('button');
      next.className = 'chord-nav-arrow next';
      next.textContent = '\u2192';
      next.style.position = 'absolute';
      next.style.right = '0';
      next.style.top = '50%';
      next.style.transform = 'translateY(-50%)';
      next.style.display = 'none';
      next.style.border = 'none';
      next.style.background = 'rgba(0,0,0,0.04)';
      next.style.borderRadius = '3px';
      next.style.cursor = 'pointer';
      next.style.fontSize = '14px';
      next.style.padding = '2px 6px';
      wrapper.appendChild(next);

      tooltip.appendChild(wrapper);
      document.body.appendChild(tooltip);

      this.tooltip = tooltip;
      this.contentElement = content;
      this.counterElement = counter;
      this.prevArrow = prev;
      this.nextArrow = next;
    },

    addEventListeners: function () {
      var self = this;

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && self.tooltip) {
          self.hide();
        }
      });

      self.tooltip.addEventListener('mouseenter', function () {
        if (window.hideTooltipTimeout) {
          clearTimeout(window.hideTooltipTimeout);
        }
      });

      self.tooltip.addEventListener('mouseleave', function () {
        if (self._navigating) return;
        self.hide();
      });

      self.prevArrow.addEventListener('click', function (e) {
        e.stopPropagation();
        if (window.hideTooltipTimeout) clearTimeout(window.hideTooltipTimeout);
        if (self.currentShapeIndex > 0) {
          self._navigating = true;
          self.currentShapeIndex--;
          var activeChord = document.querySelector('[aria-describedby="chord-tooltip"]');
          if (activeChord) {
            self.show(activeChord.textContent, activeChord);
          }
          setTimeout(function () { self._navigating = false; }, 100);
        }
      });

      self.nextArrow.addEventListener('click', function (e) {
        e.stopPropagation();
        if (window.hideTooltipTimeout) clearTimeout(window.hideTooltipTimeout);
        if (self.currentShapeIndex < self.currentChordShapes.length - 1) {
          self._navigating = true;
          self.currentShapeIndex++;
          var activeChord = document.querySelector('[aria-describedby="chord-tooltip"]');
          if (activeChord) {
            self.show(activeChord.textContent, activeChord);
          }
          setTimeout(function () { self._navigating = false; }, 100);
        }
      });
    },

    show: function (chordName, chordElement) {
      var self = this;

      if (self.currentChordName !== chordName) {
        self.currentChordName = chordName;
        self.currentShapeIndex = 0;
        self.currentChordShapes = [];

        var positions = [];
        if (typeof window.chordDatabase !== 'undefined' &&
            typeof window.chordDatabase.findChordPositions === 'function') {
          try {
            positions = window.chordDatabase.findChordPositions(chordName);
          } catch (e) {
            console.warn('Error looking up chord positions:', e);
          }
        } else if (typeof window.chordDatabaseBrowser !== 'undefined') {
          try {
            positions = findChordPositionsFallback(chordName);
          } catch (e) {
            console.warn('Error in fallback chord lookup:', e);
          }
        }
        self.currentChordShapes = positions;
      }

      if (self.currentShapeIndex >= self.currentChordShapes.length) {
        self.currentShapeIndex = 0;
      }

      self.render(chordName);
      self.updateNavigation();

      var rect = chordElement.getBoundingClientRect();
      self.tooltip.style.left = (rect.left + window.scrollX) + 'px';
      self.tooltip.style.top = (rect.bottom + window.scrollY + 5) + 'px';
      self.tooltip.style.display = 'block';
      chordElement.setAttribute('aria-describedby', 'chord-tooltip');
    },

    hide: function () {
      if (this.tooltip) {
        this.tooltip.style.display = 'none';
        document.querySelectorAll('[aria-describedby="chord-tooltip"]').forEach(function (el) {
          el.removeAttribute('aria-describedby');
        });
      }
    },

    render: function (chordName) {
      var self = this;
      self.contentElement.innerHTML = '';

      var position = self.currentChordShapes[self.currentShapeIndex];

      if (position && typeof window.SVGuitarChord !== 'undefined' &&
          typeof window.chordDatabase !== 'undefined' &&
          typeof window.chordDatabase.convertPositionToSvguitarFormat === 'function') {
        try {
          var chordData = window.chordDatabase.convertPositionToSvguitarFormat(position, chordName);
          if (chordData) {
            var container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';
            container.style.width = '120px';
            container.style.height = '140px';
            self.contentElement.appendChild(container);

            var chart = new window.SVGuitarChord(container);
            chart
              .configure({
                width: 110,
                height: 130,
                strings: 6,
                frets: 5,
                tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
                color: '#444',
                backgroundColor: 'none',
                strokeWidth: 1.5,
                nutWidth: 5,
                fingerSize: 0.55,
                fingerColor: '#333',
                fingerTextColor: '#fff',
                fingerTextSize: 10,
                fontFamily: 'Arial, sans-serif',
                fretLabelFontSize: 10,
                tuningsFontSize: 9,
                titleFontSize: 14,
                titleBottomMargin: 0,
                showFretMarkers: false,
                showTuning: true
              })
              .chord(chordData)
              .draw();
            return;
          }
        } catch (e) {
          console.warn('SVGuitar render error:', e);
        }
      }

      if (position) {
        self.renderTextFallback(chordName, position);
      } else {
        self.renderNameOnly(chordName);
      }
    },

    renderTextFallback: function (chordName, position) {
      var self = this;
      var frets = position.frets || '';
      var parts = frets.split('').reverse();

      var html = '<div style="font-weight:bold;font-size:13px;text-align:center;margin-bottom:4px;">' +
                  escapeHtml(chordName) + '</div>';
      html += '<div style="font-family:monospace;font-size:16px;text-align:center;letter-spacing:2px;">';
      parts.forEach(function (f) {
        html += '<span style="display:inline-block;width:16px;">' + escapeHtml(f) + '</span>';
      });
      html += '</div>';

      self.contentElement.innerHTML = html;
    },

    renderNameOnly: function (chordName) {
      var html = '<div style="font-weight:bold;font-size:13px;text-align:center;">' +
                  escapeHtml(chordName) + '</div>' +
                 '<div style="font-size:10px;color:#999;text-align:center;margin-top:4px;">' +
                  'Diagram unavailable</div>';
      this.contentElement.innerHTML = html;
    },

    updateNavigation: function () {
      var total = this.currentChordShapes.length;
      var index = this.currentShapeIndex;

      if (total > 1) {
        this.prevArrow.style.display = 'block';
        this.nextArrow.style.display = 'block';
        this.prevArrow.disabled = index <= 0;
        this.nextArrow.disabled = index >= total - 1;
        this.prevArrow.style.opacity = this.prevArrow.disabled ? '0.3' : '1';
        this.nextArrow.style.opacity = this.nextArrow.disabled ? '0.3' : '1';
        this.counterElement.textContent = (index + 1) + '/' + total;
        this.counterElement.style.display = 'block';
      } else {
        this.prevArrow.style.display = 'none';
        this.nextArrow.style.display = 'none';
        this.counterElement.style.display = 'none';
      }
    }
  };

  function findChordPositionsFallback(chordName) {
    var rootMatch = chordName.match(/^[A-G][#b]?/);
    if (!rootMatch) return [];
    var root = rootMatch[0].replace('#', 'sharp');
    var suffix = chordName.slice(rootMatch[0].length)
      .replace('maj', 'major')
      .replace('min', 'minor')
      .replace('m', 'minor') || 'major';
    var rootObj = window.chordDatabaseBrowser.chords[root];
    if (!rootObj) return [];
    var match = rootObj.filter(function (c) { return c && c.suffix === suffix; });
    return match.length > 0 ? (match[0].positions || []) : [];
  }

  function escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function init() {
    ChordTooltip.init();
    window.chordTooltip = ChordTooltip;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
