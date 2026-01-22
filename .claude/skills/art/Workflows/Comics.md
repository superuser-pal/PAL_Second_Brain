# Editorial Comics Workflow

**Sequential panel storytelling with sophisticated hand-drawn aesthetic.**

---

## Purpose

Editorial comics use sequential panels to explain concepts, tell stories, or illustrate scenarios.

**Use for:**

- Explaining complex concepts through narrative
- Before/during/after sequences
- Illustrated thought experiments
- Multi-step processes shown visually
- Scenario storytelling

---

## Visual Aesthetic

**Style:** PromptPal Sequential Art - Sophisticated, clean line-art, NOT cartoonish.

### Core Characteristics

1. **Multi-panel** - 3-4 panels telling a sequential story.
2. **Editorial style** - Minimalist, professional, and clear.
3. **PromptPal Figures** - Human characters follow the brand style (professional-casual, realistic proportions).
4. **Clean Line-Art** - Medium-weight black lines with rounded terminals.
5. **Narrative flow** - Panels build logically to make a point.
6. **Minimal dialogue** - Visual storytelling prioritized over text.

---

## Color System

```
| Role | Hex | Usage |
| :--- | :--- | :--- |
| **Canvas** | `#FFFFFF` | Overall white background for the strip |
| **Panel Border** | `#000000` | Solid black, slightly rounded panel frames |
| **Line Work** | `#000000` | Character outlines and environmental structure |
| **PAL Purple** | `#7450db` | Main focal point (Mascot or primary action) |
| **Soft Lavender** | `#AF9BFF` | Secondary details or highlight flows |
| **Text Primary** | `#1A1A1A` | Dialogue, captions, and labels |
```

### Color Strategy

- Dark overall canvas with slightly lighter panel backgrounds
- Characters primarily white linework
- PAL Purple accent on protagonist
- Minimal color - mostly linework

---

## Workflow Steps

### Step 1: Define Comic Narrative

**Plan the story:**

```
COMIC CONCEPT: [What you're illustrating]
PANELS: [3 or 4]

NARRATIVE ARC:
Panel 1: [Setup - initial state]
Panel 2: [Action/Complication - what changes]
Panel 3: [Escalation or Result]
Panel 4: [Punchline/Insight] (if 4 panels)

DIALOGUE (Minimal):
Panel 1: "[Optional text]"
Panel 2: "[Optional text]"
Panel 3: "[Optional text]"
Panel 4: "[Punchline]"

CHARACTERS:
- [Character 1]: [Description, PAL Purple accent]
- [Character 2]: [Description, Secondary accent if needed]
```

---

### Step 2: Design Panel Layout

**Panel arrangement options:**

- Horizontal strip (3-4 panels left to right)
- Vertical strip (3-4 panels top to bottom)
- Grid (2x2 for 4 panels)

**Panel sizing:**

- Equal sized panels (classic)
- Final panel larger (punchline emphasis)

---

### Step 3: Construct Prompt

### Prompt Template

```
Hand-drawn editorial comic strip on dark background.

STYLE: PromptPal brand aesthetic. Bold, clean cartoon line-art with flat color blocking. Approachable and professional, not sketchy.

BACKGROUND: Dark #0a0a0f canvas with #1a1a2e panel backgrounds.

COMIC STRUCTURE: [3-panel / 4-panel] [horizontal / vertical / grid]

PANEL LAYOUT:
- [Number] panels arranged [direction]
- Hand-drawn panel borders (slightly wobbly)
- Panel sizes: [Equal / Varied]

CHARACTER DESIGN:
- Human characters: Professional-casual attire. Expressive cartoon proportions (slightly larger heads for clear facial expressions). Bold features (e.g., glasses, beards) defined by solid black fills where appropriate.
- Mascot: PromptPal robot icon, rounded square head, PAL Purple #7450db body. Friendly, simple face.
- Outlines: Thick, uniform weight, clean solid black #000000 lines. No sketchiness.

COMIC NARRATIVE: "[Overall concept]"

PANEL 1 - [SETUP]:
Scene: [What's happening]
Characters: [Who, doing what]
Dialogue: "[Text]" or no text

PANEL 2 - [COMPLICATION]:
Scene: [What changes]
Characters: [Actions]
Dialogue: "[Text]" or no text

PANEL 3 - [RESULT]:
Scene: [Outcome]
Characters: [Final states]
Dialogue: "[Text]" or no text

PANEL 4 - [PUNCHLINE] (if 4 panels):
Scene: [Revelation]
Characters: [Conclusion]
Dialogue: "[Insight text]"

COLOR USAGE:
- White #FFFFFF for canvas and background elements (like papers).
- Black #000000 for all linework, text, and solid fills for dark hair/pants.
- PAL Purple #7450db ONLY for the AI mascot main body.
- Soft Lavender #AF9BFF for secondary paths or highlights if needed.
- **SHADING RULE:** No gradients and NO stipple dots. Shading is achieved solely through solid blocks of darker flat color (e.g., solid darker purple blocks on the robot's sides/arms to show depth).

CRITICAL:
- Sophisticated editorial style (NOT cutesy)
- Clear narrative flow across panels
- Character consistency throughout
- Visual storytelling prioritized
- Professional quality
```

---

### Step 4: Determine Aspect Ratio

| Layout             | Aspect Ratio |
| ------------------ | ------------ |
| 3-panel horizontal | 16:9 or 21:9 |
| 4-panel horizontal | 21:9         |
| 3-panel vertical   | 9:16         |
| 4-panel grid (2x2) | 1:1          |

---

### Step 5: Execute Generation

```bash
bun run $PAL_DIR/.claude/skills/art/Tools/Generate.ts \
  --model nano-banana-pro \
  --prompt "[YOUR PROMPT]" \
  --size 2K \
  --aspect-ratio 16:9 \
  --output ~/Downloads/comic.png
```

---

### Step 6: Validation

#### Must Have

- [ ] Stark white background #FFFFFF (NO dark mode).
- [ ] Clean, solid black line-art outlines.
- [ ] 1-3 focal points using PAL Purple #7450db.
- [ ] Character consistency across all panels.
- [ ] Realistic human proportions (NOT cutesy or stubby).

#### Must NOT Have

- [ ] Dark or colored backgrounds.
- [ ] Cartoonish or "chibi" styles.
- [ ] Gradients, glows, or drop shadows.
- [ ] Purple used on humans or generic environment objects.

### Character Validation

- [ ] Angular construction (NOT round)
- [ ] Adult proportions 1:7 (NOT stubby 1:3)
- [ ] Minimal geometric faces
- [ ] Emotion through gesture
- [ ] Consistent across panels

---

## Example Narratives

### Example 1: "Before/After AI" (3 panels)

- Panel 1: Person struggling with manual task
- Panel 2: AI assistant appears
- Panel 3: Task completed, person relieved

### Example 2: "Security Theater" (4 panels)

- Panel 1: Fancy lock on flimsy door
- Panel 2: Simple lock on solid door
- Panel 3: Intruder easily bypasses fancy setup
- Panel 4: Stopped by simple solid approach

---

**The workflow: Define → Design → Prompt → Generate → Validate**
