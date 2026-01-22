---
name: Art
description: Visual content generation with Excalidraw hand-drawn aesthetic. USE WHEN user wants diagrams, visualizations, comics, or editorial illustrations.
---

# Art Skill

Visual content generation system using **Excalidraw hand-drawn** aesthetic with light-mode, tech-forward color palette.

## Output Location

```
ALL GENERATED IMAGES GO TO ~/Downloads/ FIRST
Preview in Finder/Preview before final placement
Only copy to project directories after review
```

## Workflow Routing

Route to the appropriate workflow based on the request:

- Technical or architecture diagram → `Workflows/TechnicalDiagrams.md`
- Blog header or editorial illustration → `Workflows/Essay.md`
- Comic or sequential panels → `Workflows/Comics.md`

---

## Core Aesthetic

**Excalidraw Hand-Drawn** - Clean, approachable technical illustrations with:

- Smooth, uniform black outlines with precise vector-like clarity
- Simple shapes with organic imperfections
- Consistent typography style with Bold and Italic variants for accents and descriptions
- Light mode backgrounds with dark accents

**Full aesthetic documentation:** `$PAL_DIR/skills/Art/Aesthetic.md`

---

## Color System

| Role             | Hex       | Functional Usage                                                           |
| :--------------- | :-------- | :------------------------------------------------------------------------- |
| Canvas           | `#FFFFFF` | The primary workspace background; provides maximum contrast                |
| Primary Accent   | `#7450db` | High-priority focal points: hero elements, main buttons, and key callouts  |
| Secondary Accent | `#AF9BFF` | Low-priority accents: supportive flows, connection lines, and hover states |
| Primary Text     | `#1A1A1A` | All readable content, including titles, labels, and paragraph text         |
| Structural Fill  | `#F3F4F6` | Depth elements: cards, panel backgrounds, or subtle environmental fills    |
| Definition Line  | `#000000` | The "skeleton": used for all borders, outlines, and hand-drawn stroke work |

---

## Image Generation

**Default model:** nano-banana-pro (Gemini 3 Pro)

```bash
bun run $PAL_DIR/skills/Art/Tools/Generate.ts \
  --model nano-banana-pro \
  --prompt "[PROMPT]" \
  --size 2K \
  --aspect-ratio 16:9 \
  --output ~/Downloads/output.png
```

**API keys in:** `$PAL_DIR/.env` (single source of truth for all authentication)

---

## Examples

**Example 1: Technical diagram**

```
User: "create a diagram showing the auth flow"
→ Invokes TECHNICALDIAGRAMS workflow
→ Creates Excalidraw-style architecture visual
→ Outputs PNG with dark background, purple accents
```

**Example 2: Blog header**

```
User: "create a header for my post about AI agents"
→ Invokes ESSAY workflow
→ Generates hand-drawn illustration
→ Saves to ~/Downloads/ for preview
```

**Example 3: Comic strip**

```
User: "create a comic showing the before/after of using AI"
→ Invokes COMICS workflow
→ Creates 3-4 panel sequential narrative
→ Editorial style, not cartoonish
```
