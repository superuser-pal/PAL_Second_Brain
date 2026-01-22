# Editorial Illustration Workflow

**Hand-drawn Excalidraw-style illustrations for blog headers and editorial content.**

---

## Purpose

Header images and editorial illustrations that visually represent content concepts.

**Use for:** Blog headers, article illustrations, concept visualizations, editorial art.

**Full aesthetic documentation:** `$PAL_DIR/skills/Art/Aesthetic.md`

---

## Visual Aesthetic

**Style:** PromptPal Clean Line-Art - professional, friendly, and minimalist.

### Core Rules

1. **Clean Line-Art technique** - Smooth, medium-weight black lines with rounded terminals.
2. **White background #FFFFFF** - The "Canvas" provides maximum clarity and brand consistency.
3. **Conceptual subjects** - Use metaphorical imagery to represent the core concept.
4. **Spot Color strategy** - Use PAL Purple #7450db ONLY for the focal point/hero element.
5. **Minimalist composition** - Heavy use of negative space; every line must be intentional.

---

## Workflow Steps

### Step 1: Understand the Content

**Before doing anything:**

1. Read the full content (blog post, essay, article)
2. Identify the core concept or argument
3. Extract key metaphors, imagery, or concrete elements
4. Determine what should be visualized

**Output:** Clear understanding of what to illustrate.

---

### Step 2: Design Composition

**Determine what to draw:**

1. **What is the content ABOUT?**
   - Not surface-level - the actual core concept
   - What visual would represent THAT?

2. **What are concrete elements?**
   - Nouns, objects, metaphors from the content
   - These should appear in the illustration

3. **What is the emotional register?**
   - Technical, hopeful, warning, discovery, etc.
   - This affects line quality and composition

4. **Composition approach:**
   - Centered, minimalist, breathing space
   - Subjects should fill the frame
   - NOT cluttered, NOT busy

**Output:** A clear composition design.

---

### Step 3: Construct the Prompt

### Prompt Template

```
Clean line-art editorial illustration on a stark white background.

BACKGROUND: Pure white #FFFFFF - clean, no texture, no grid lines.

SUBJECT: [WHAT TO DRAW - the core visual metaphor]

STYLE - PROMPTPAL LINE-ART:
- Smooth, consistent medium-weight black lines
- Slightly rounded terminals/corners
- Professional vector-like quality (NOT sketchy or hairy)
- Minimalist and approachable

COMPOSITION:
- Subjects LARGE and centered (not lost in white space)
- Uncluttered with high use of negative space
- One clear focal point for the spot color

COLOR:
- Canvas: White #FFFFFF (MANDATORY)
- Outlines: Black #000000 for all structure
- Spot Color: PAL Purple #7450db for the main subject/hero element (15-20%)
- Secondary: Soft Lavender #AF9BFF for subtle details or connectors (5%)
- Environment: Humans and tools remain strictly black & white

EMOTIONAL REGISTER: [TECHNICAL/DISCOVERY/WARNING/PROGRESS/etc.]

CRITICAL:
- NO dark backgrounds
- NO gradients or shadows; use stippling (dots) for depth
- Subjects must be the primary focus of the white frame
```

---

### Step 4: Execute Generation

```bash
bun run $PAL_DIR/.claude/skills/art/Tools/Generate.ts \
  --model nano-banana-pro \
  --prompt "[YOUR PROMPT]" \
  --size 2K \
  --aspect-ratio 1:1 \
  --output ~/Downloads/header.png
```

**For blog headers that need thumbnails:**

```bash
bun run $PAL_DIR/.claude/skills/art/Tools/Generate.ts \
  --model nano-banana-pro \
  --prompt "[YOUR PROMPT]" \
  --size 2K \
  --aspect-ratio 1:1 \
  --thumbnail \
  --output ~/Downloads/header.png
```

This creates BOTH:

- `header.png` - With transparent background (for inline display)
- `header-thumb.png` - With solid background (for social previews)

---

### Step 5: Validation

### Must Have

- [ ] Stark white background #FFFFFF
- [ ] Smooth, solid black outlines #000000
- [ ] PAL Purple #7450db used as the primary spot color focal point
- [ ] Subject fills the frame effectively
- [ ] Stipple shading for depth (no gradients)
- [ ] Professional, clean editorial quality

### Must NOT Have

- [ ] Dark or colored backgrounds
- [ ] Sketchy, wobbly, or "hairy" lines
- [ ] Purple used on background elements or secondary characters
- [ ] Generic 3D AI style
- [ ] Busy, cluttered compositions
- [ ] Shadows or glows

### If Validation Fails

| Problem               | Fix                                                   |
| --------------------- | ----------------------------------------------------- |
| Subjects too small    | Add "LARGE SUBJECTS that FILL THE FRAME"              |
| Light background      | Emphasize "dark background #0a0a0f"                   |
| Too perfect           | Add "hand-drawn Excalidraw style, slightly imperfect" |
| Doesn't match content | Re-read content, identify better visual metaphor      |

---

## Aspect Ratio Guide

| Use Case             | Aspect Ratio | Notes                  |
| -------------------- | ------------ | ---------------------- |
| Blog header (square) | 1:1          | Default for most posts |
| Wide banner          | 16:9         | For wide layouts       |
| Social preview       | 1:1 or 16:9  | Platform dependent     |

---

**The workflow: Understand → Design → Prompt → Generate → Validate**
