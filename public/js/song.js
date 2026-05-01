
export default function songPong() {
    const lyricsContainer = document.querySelector('#lyrics-container');
    if (!lyricsContainer) return;
    
    const lyricsText = lyricsContainer.dataset.lyrics;
    const utils = {
        parseChords: function(text) {
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
        
        renderChordsHTML: function(segments) {
            if (!Array.isArray(segments)) {
                return '';
            }
            
            return segments.map(segment => {
                const escapedContent = this.escapeHtml(segment.content);
                return `<span class="${segment.type}">${escapedContent}</span>`;
            }).join('');
        },
        
        escapeHtml: function(text) {
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
}