# braindump Workflow

Capture stream-of-consciousness thoughts with intelligent analysis and life-context classification.

## Trigger Phrases

- "braindump"
- "brain dump"
- "capture thoughts"
- "dump my thoughts"
- "get this out of my head"

## Output Location

- **Path:** `inbox/notes/braindump_YYYY-MM-DD_HHMM.md`
- **Status:** `ready` (if category assigned) or `unprocessed` (if user skips)

---

## Step 1: Get Timestamp

```bash
date '+%Y-%m-%d %H:%M'
```

Store this value for ALL timestamp fields in frontmatter and filename.

## Step 2: Collect Raw Input

Prompt the user:

> "What's on your mind? Share your thoughts freely."

Accept any format:
- Stream of consciousness
- Voice-to-text output
- Bullet points
- Rambling paragraphs

**No filtering, no judgment - capture everything exactly as provided.**

## Step 3: Content Analysis

Analyze the input to extract:

### Meta-Analysis
- **Word Count:** [count]
- **Energy Level:** high | medium | low
- **Emotional Tone:** excited | frustrated | curious | concerned | neutral | mixed

### Structural Analysis
- **Main Themes:** [3-5 primary topics]
- **Supporting Ideas:** [related concepts]
- **Questions Raised:** [explicit and implicit]
- **Decisions Contemplated:** [choices being considered]
- **Action Items:** [tasks identified]

### Strategic Insights
- **Key Insights:** [important realizations]
- **Pattern Recognition:** [connections to prior thinking]
- **Implications:** [impact on goals/projects]

## Step 4: Detect Category Patterns

Scan content for LifeOS category indicators:

| Pattern | Category | Confidence Signal |
|---------|----------|-------------------|
| "I believe...", values, worldview | `beliefs.md` | Strong |
| "My purpose...", "why I...", direction | `mission.md` | Strong |
| "I see it as...", perspective shifts | `frames.md` | Medium |
| "When X, I do Y", decision frameworks | `models.md` | Medium |
| "I learned...", "I realized...", insights | `learned.md` | Strong |
| "I want to...", aspirations, targets | `goals.md` | Strong |
| "I'm working on...", initiatives | `projects.md` | Strong |

Note all detected patterns with confidence levels.

## Step 4b: Detect Subsection

After determining category, detect which **subsection** the content belongs to:

| Category | Subsections | Detection Patterns |
|----------|-------------|-------------------|
| beliefs.md | Worldview, Values, Convictions | "I see the world...", principles, strong beliefs |
| mission.md | Purpose, Vision, Direction | "my purpose...", "I envision...", "I'm heading toward..." |
| frames.md | Mental Lenses, Perspectives | "I see it as...", "think of it like..." |
| models.md | Decision Frameworks, Heuristics | "when X, I do Y", "my rule is..." |
| learned.md | Insights, Realizations, Lessons | "I learned...", "I realized...", "what worked..." |
| goals.md | Short-term, Medium-term, Long-term | timeframe indicators |
| projects.md | Active, Planned, On Hold | status indicators |

**Detection Rules:**
- If clear subsection match: Set `subsection: [detected]`
- If unclear: Set `subsection: null` (will append at end of file)

## Step 5: Category Assignment

### If clear pattern detected:

Present detection to user for confirmation:

```
I detected content that fits: [category]

Extracted: "[relevant quote from content]..."

Is this classification correct? (Y/N/Edit)
```

- **User confirms (Y):** Set `category: [detected]`, `status: ready`, `domain: LifeOS`
- **User edits:** Apply user's correction
- **User rejects (N):** Proceed to manual selection

### If NO clear pattern detected:

Ask user to select:

```
I couldn't determine a clear category for this content.

Which life-context file should this go to?

1. beliefs.md  - Core beliefs and values
2. frames.md   - Mental perspectives and lenses
3. learned.md  - Lessons and insights
4. mission.md  - Purpose and direction
5. models.md   - Decision frameworks
6. goals.md    - Objectives and aspirations
7. projects.md - Active initiatives
8. None        - Keep as general note

Your choice:
```

- **User selects 1-7:** Set `category: [selected].md`, `status: ready`, `domain: LifeOS`
- **User selects 8 (None):** Set `category: notes`, `status: unprocessed`, `domain: null`

## Step 6: Build Structured Output

Generate markdown file:

```yaml
---
status: [ready|unprocessed]
domain: [LifeOS|null]
project: null
category: [selected category]
subsection: [detected subsection|null]
created: YYYY-MM-DD
last_modified: YYYY-MM-DD
source_type: braindump
source_file: null
source_url: null
tags: ["braindump", "theme1", "theme2"]
---
```

```markdown
# Braindump: [Auto-generated Title Based on Main Theme]

## Raw Thoughts

[Original user content preserved exactly]

## Analysis

### Main Themes
1. **[Theme 1]:** [significance]
2. **[Theme 2]:** [significance]
3. **[Theme 3]:** [significance]

### Questions Raised
- [Question 1]
- [Question 2]

### Decisions Contemplated
- [Decision 1 with options]

## Strategic Intelligence

### Key Insights
1. **[Insight 1]:** [implications]
2. **[Insight 2]:** [implications]

### Action Items

#### Immediate (24-48 hours)
- [ ] [action]

#### Short-term (1-2 weeks)
- [ ] [action]

## Extracted Content

### For [category]
> [Extracted statement ready for appending to target file]

## Processing Notes

- **Energy Level:** [assessment]
- **Emotional Tone:** [assessment]
- **Category Confidence:** [percentage] - [reasoning]
```

## Step 7: Save File

Filename format: `braindump_YYYY-MM-DD_HHMM.md`

```bash
# Verify file was saved
ls inbox/notes/braindump_*.md
```

## Step 8: Report Summary

Present results:

```markdown
## Braindump Complete

**Saved:** inbox/notes/braindump_YYYY-MM-DD_HHMM.md
**Status:** [ready|unprocessed]
**Category:** [category]
**Subsection:** [subsection|null]
**Domain:** [LifeOS|null]

### Main Themes Identified
- [Theme 1]
- [Theme 2]
- [Theme 3]

### Extracted Content
> "[Preview of extracted content]..."

### Next Steps
```

**If `status: ready`:**
> Run `distribute notes` to append content to LifeOS/[category]

**If `status: unprocessed`:**
> Run `process_inbox` to assign category, then `distribute notes`

---

## Error Handling

- **Empty input:** "Please share your thoughts first. What's on your mind?"
- **Very short input (<10 words):** Process normally but note "Limited content for analysis"
- **No themes detected:** Save with `category: notes`, `status: unprocessed`
- **Multiple categories detected:** Present all to user, ask which is primary

## Next Workflows

After braindump, suggest:
- `process_inbox` - If status is unprocessed, assign category
- `distribute_notes` - Move to LifeOS domain and append to target file
