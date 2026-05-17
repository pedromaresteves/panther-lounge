
export default function songPong() {
  console.log('songPong function called');
  const lyricsContainer = document.querySelector('#lyrics-container');
  if (!lyricsContainer) {
    console.log('No lyrics container found');
    return;
  }
  console.log('Found lyrics container, setting up chord tooltips');

  const lyricsText = lyricsContainer.dataset.lyrics;
  const utils = {
    parseChords: function (text) {
      if (!text || typeof text !== 'string') {
        return [];
      }

      const segments = [];
      const chordRegex = /\[([^\]]+)\]/g;
      let lastIndex = 0;
      let match;

      while ((match = chordRegex.exec(text)) !== null) {
        // Add any lyric content before this chord
        if (match.index > lastIndex) {
          segments.push({
            type: 'lyric',
            content: text.substring(lastIndex, match.index)
          });
        }

        // Add the chord
        segments.push({
          type: 'chord',
          content: match[1]
        });

        lastIndex = match.index + match[0].length;
      }

      // Add remaining lyric content after last chord
      if (lastIndex < text.length) {
        segments.push({
          type: 'lyric',
          content: text.substring(lastIndex)
        });
      }

      return segments;
    },

    renderChordsHTML: function (segments) {
      if (!Array.isArray(segments)) {
        return '';
      }

      return segments.map(segment => {
        const escapedContent = this.escapeHtml(segment.content);
        return `<span class="${segment.type}">${escapedContent}</span>`;
      }).join('');
    },

    escapeHtml: function (text) {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"]/g, char => map[char]);
    }
  };

  // Parse and render chords
  const segments = utils.parseChords(lyricsText);
  const html = utils.renderChordsHTML(segments);

  // Replace newlines with <br> tags for proper display
  const formattedHtml = html.replace(/\n/g, '<br>');
  lyricsContainer.innerHTML = formattedHtml;

  // Add event listeners for chord tooltips
  const chordElements = lyricsContainer.querySelectorAll('.chord');
  chordElements.forEach(chordElement => {
    chordElement.setAttribute('role', 'button');
    chordElement.setAttribute('tabindex', '0');
    chordElement.setAttribute('aria-label', `Show chord diagram for ${chordElement.textContent.trim()}`);

      // Add debounce for tooltip show to prevent flickering
      let showTimeout = null;
      
      chordElement.addEventListener('mouseenter', () => {
        // Clear any existing timeout
        if (showTimeout) {
          clearTimeout(showTimeout);
        }
        
        // Set a timeout to show the tooltip after 300ms
        showTimeout = setTimeout(() => {
          const chordName = chordElement.textContent.trim();
          if (window.chordTooltip) {
            window.chordTooltip.show(chordName, chordElement);
          } else {
            console.warn('chordTooltip not available for chord:', chordName);
          }
        }, 300);
      });

      // Add delayed hide for tooltip persistence
      chordElement.addEventListener('mouseleave', () => {
        // Set a timeout to hide the tooltip after 300ms
        window.hideTooltipTimeout = setTimeout(() => {
          window.chordTooltip.hide();
        }, 300);
      });

    chordElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const chordName = chordElement.textContent.trim();
        window.chordTooltip.show(chordName, chordElement);
      } else if (e.key === 'Escape') {
        window.chordTooltip.hide();
      }
    });

    chordElement.addEventListener('blur', (e) => {
      const tooltip = document.getElementById('chord-tooltip');
      if (tooltip && e.relatedTarget && tooltip.contains(e.relatedTarget)) {
        return;
      }
      window.chordTooltip.hide();
    });
  });
}