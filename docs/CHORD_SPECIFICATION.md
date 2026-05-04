# Chord Syntax Specification

## Overview
This document defines the bracket chord syntax (`[CHORD]` format) used throughout Panther Lounge for representing guitar chords in plain text.

## Syntax Format

### Basic Pattern
```
[A-G][b#]*[m]?[0-9]*
```

### Components
- **Root**: `A-G` — musical note (required)
- **Accidental**: `b` (flat) or `#` (sharp) — optional
- **Quality**: `m` (minor), `maj`, `min`, `aug`, `dim`, `sus` — optional
- **Voicing**: `0-9` — optional numeric modifiers
- **Bass**: `/[A-G][b#]*` — optional slash chord (e.g., `/F#`)

## Valid Examples

| Chord | Description |
|-------|-------------|
| `[Em]` | E minor |
| `[C]` | C major |
| `[Dsus4]` | D suspended 4th |
| `[C#m7]` | C# minor 7th |
| `[Gmaj7]` | G major 7th |
| `[F#dim]` | F# diminished |
| `[Cmaj7/E]` | C major 7th with E in bass |
| `[Am/G]` | A minor with G in bass |
| `[B♭]` | B flat (Unicode) |

## Invalid Examples

| Invalid | Reason |
|---------|--------|
| `[H]` | H is not a standard chord root (use B) |
| `[Emajor]` | Use `maj` not `major` — `[Emaj]` is correct |
| `[C 7]` | No spaces allowed inside brackets |
| `Em` | Brackets required |
| `[E m]` | No spaces allowed |

## Usage in Text

### Pattern
Chords appear in brackets immediately before the lyrics they modify:

```
[Em]Verse one here
[Am]More lyrics
[Em]Another verse
```

### Multi-line Format
```
[Em]Verse
Here's the first verse
[Am]Here's another line

[G]Chorus
Sing this part
```

### No Lyrics After Chord
It's valid to have a chord with no immediate lyrics:

```
[Em]
Some lyrics follow after a newline
```

## Parsing Behavior

The parser extracts segments in order:
1. Identifies all `[CHORD]` patterns
2. Extracts content between chords as lyrics
3. Returns array of `{ type: 'chord' | 'lyric', content: string }` objects

### Example Parsing
**Input:**
```
[Em]Verse line one
[Am]Verse line two
```

**Output:**
```javascript
[
  { type: 'chord', content: 'Em' },
  { type: 'lyric', content: 'Verse line one\n' },
  { type: 'chord', content: 'Am' },
  { type: 'lyric', content: 'Verse line two' }
]
```

## Rendering

Segments are wrapped in HTML with CSS classes:
- Chords: `<span class="chord">Em</span>`
- Lyrics: `<span class="lyric">Verse line one\n</span>`

CSS styling controls visual presentation (color, font, alignment, etc.).

## Validation Rules

1. **Chord names** must match pattern `/^[A-G][b#]*(?:m|maj|min|aug|dim|sus)?[0-9]*(?:\/[A-G][b#]*)?$/i`
2. **Brackets** are required: `[Em]` not `Em`
3. **No spaces** inside brackets: `[Em]` not `[E m]`
4. **Case-insensitive** (internally normalized): `[em]`, `[Em]`, `[EM]` all valid
5. **Unicode flats/sharps** allowed: `[B♭]`, `[F#]`, both work

## Character Limits

- **Individual chord**: max 20 characters (e.g., `[Cmaj7#11/B♭]`)
- **Total text**: 6000 characters (textarea limit)

## Migration Notes

### From Quill Delta
Old songs stored with Quill rich text editor Delta format must be converted:
- Extract text content from Delta ops
- Parse for `[CHORD]` patterns (if user entered them)
- Store as plain text with brackets

### Backward Compatibility
Songs without brackets are still valid (treated as lyrics-only):
```
Plain lyrics with no chords
```

## Future Enhancements

1. **Unicode support**: Handle more accidental notations (♯, ♭, etc.)
2. **Advanced voicings**: Add support for extended notation if needed
3. **Transposition**: Script to transpose all chords up/down
4. **Chord tooltips**: Show fingering diagrams on hover
