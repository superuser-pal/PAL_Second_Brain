# Technical Diagram Workflow

**Clean line-art technical diagrams with a "Spot Color" brand aesthetic.**

---

## Purpose

Technical diagrams for system architectures, process flows, and presentations.

**Use for:** Architecture diagrams, process flows, pipelines, infrastructure maps, presentations.

---

## Visual Aesthetic

**Style:** Clean, professional line art—approachable with a hand-drawn feel.

### Core Rules

1. **PromptPal Line Style** - Clean black lines, slightly organic, professional terminals.
2. **White background #FFFFFF** - High-contrast "Canvas" (NO dark mode, NO grid lines).
3. **Custom typography** - Geometric and serif hierarchy for professional clarity.
4. **Strategic color** - PAL Purple #7450db for key elements, Soft Lavender #AF9BFF for flows.
5. **Line work dominant** - 70% of elements in black/gray; color used strictly as a focal accent.

---

## Typography System

### TIER 1: Headers & Subtitles

**Elegant wedge-serif style:**

- High stroke contrast, refined serifs.
- Header: Large, bold, Primary Text `#1A1A1A`.
- Subtitle: Smaller, regular weight, Definition Line `#000000`.

### TIER 2: Labels

**Geometric sans-serif:**

- Clean, technical, precise.
- Used for: Box labels, node names.
- Color: Primary Text `#1A1A1A`.

### TIER 3: Insights

**Condensed italic sans:**

- Editorial feel, attention-grabbing.
- Used for: Callouts and annotations.
- Color: PAL Purple `#7450db`.

---

## Color Palette

| Role                | Hex       | Usage                                |
| :------------------ | :-------- | :----------------------------------- |
| **Canvas**          | `#FFFFFF` | Primary background (MANDATORY)       |
| **PAL Purple**      | `#7450db` | Key components, insights (15-20%)    |
| **Soft Lavender**   | `#AF9BFF` | Flows, connections (5-10%)           |
| **Primary Text**    | `#1A1A1A` | Text, labels, headers                |
| **Definition Line** | `#000000` | Hand-drawn borders, boxes, structure |
| **Structural Fill** | `#F3F4F6` | Subtle card backgrounds (if needed)  |

---

## Execution Steps

1. **Understand** - Read the content, identify key components and relationships.
2. **Structure** - Plan the diagram layout (boxes, arrows, hierarchy).
3. **Compose** - Design the visual with title, subtitle, and 1-3 key insights.
4. **Prompt** - Construct using the template below.
5. **Generate** - Execute with CLI tool.
6. **Validate** - Check against brand validation criteria.

## Prompt Template

```
Clean line-art technical diagram on a stark white background.

BACKGROUND: Pure white #FFFFFF - NO grid lines, NO texture, completely clean canvas.

STYLE: Professional hand-drawn line art - clean, medium-weight black vector lines.

TYPOGRAPHY:
- HEADER: Elegant serif, large, #1A1A1A color, top-left position.
- SUBTITLE: Same serif but regular weight, smaller, #000000 color, below header.
- LABELS: Geometric sans-serif, #1A1A1A, clean and technical.
- INSIGHTS: Condensed italic, PAL Purple #7450db, used for callouts with asterisks.

DIAGRAM CONTENT:
Title: '[TITLE]' (Top left)
Subtitle: '[SUBTITLE]' (Below title)
Components: [LIST THE MAIN COMPONENTS]
Connections: [DESCRIBE THE FLOW/RELATIONSHIPS]

Include 1-3 insight callouts like "*key insight here*" in PAL Purple #7450db.

COLOR USAGE:
- Black #000000 for all primary structures and outlines.
- PAL Purple #7450db for key focal components and insights.
- Soft Lavender #AF9BFF for flow arrows and connection paths.
- Keep 70% of image in black/white, purple/lavender as accents only.

VISUAL CHARACTERISTICS:
- Slightly rounded terminals on lines.
- Consistent line weight.
- No gradients or drop shadows; use stipple shading for depth if needed.
- Professional but approachable feel.
```

---

## Intent-to-Flag Mapping

### Model Selection

| User Says                         | Flag                      | When to Use                |
| --------------------------------- | ------------------------- | -------------------------- |
| "fast", "quick", "draft"          | `--model nano-banana`     | Faster iteration           |
| (default), "best", "high quality" | `--model nano-banana-pro` | Best quality (recommended) |
| "flux", "variety"                 | `--model flux`            | Different aesthetic        |

### Size Selection

| User Says             | Flag        | Resolution         |
| --------------------- | ----------- | ------------------ |
| "draft", "preview"    | `--size 1K` | Quick iterations   |
| (default), "standard" | `--size 2K` | Standard output    |
| "high res", "print"   | `--size 4K` | Maximum resolution |

### Aspect Ratio

| User Says                       | Flag                  | Use Case             |
| ------------------------------- | --------------------- | -------------------- |
| "wide", "slide", "presentation" | `--aspect-ratio 16:9` | Default for diagrams |
| "square"                        | `--aspect-ratio 1:1`  | Social media         |
| "ultrawide"                     | `--aspect-ratio 21:9` | Wide system diagrams |

---

## Generate Command

```bash
bun run $PAL_DIR/.claude/skills/art/Tools/Generate.ts \
  --model nano-banana-pro \
  --prompt "[YOUR PROMPT]" \
  --size 2K \
  --aspect-ratio 16:9 \
  --output ~/Downloads/diagram.png
```

---

## Validation

### Must Have

- [ ] Stark white background #FFFFFF (NO dark mode)
- [ ] Clean, solid black line-art aesthetic.
- [ ] Title and subtitle in the bottom center
- [ ] 1-3 insight callouts in PAL Purple #7450db.
- [ ] High-contrast Primary Text #1A1A1A.
- [ ] Strategic color usage (70% black/white, 30% brand color accents).
- [ ] Readable labels and text

### Must NOT Have

- [ ] Dark or colored backgrounds
- [ ] Perfect, cold vector shapes (must have "hand-drawn" warmth)
- [ ] Gradients, glows, or shadows
- [ ] Purple used on generic structural boxes (keep it for insights/hero elements)
- [ ] Over-coloring (everything purple)
- [ ] Generic AI illustration look

### If Validation Fails

| Problem           | Fix                                                 |
| ----------------- | --------------------------------------------------- |
| Light background  | Add "dark background #0a0a0f" more explicitly       |
| Too perfect/clean | Add "hand-drawn, slightly wobbly, Excalidraw style" |
| Wrong colors      | Specify exact hex codes in prompt                   |
| No insights       | Add "include 1-3 callouts in PAL Purple"            |

---

**The workflow: Understand → Structure → Compose → Prompt → Generate → Validate**
