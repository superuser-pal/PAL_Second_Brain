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

## Step 3b: Observation Extraction

Extract atomic observations from the raw content, categorizing each:

**Process:**
1. Identify distinct statements in the raw input
2. For each statement, determine the most appropriate category
3. Format as structured observations

**Categories:** fact, idea, decision, technique, requirement, question, insight, problem, solution, action

**Example Extraction:**
```
Raw: "I've been thinking about using Redis for caching. The API is rate limited to 1000 calls/hour. Need to review the docs tomorrow."

Extracted:
- [idea] Use Redis for caching #caching #infrastructure
- [fact] API is rate limited to 1000 calls/hour #api #limits
- [action] Review the API documentation #api #tasks
```

**Rules:**
- Each observation must be atomic (single subject-verb-object)
- Suggest 2-3 relevant tags per observation
- Present extractions to user for confirmation/adjustment

## Step 4: Domain and Theme Detection

Analyze content to detect target domain, themes, and determine if splitting is appropriate.

### Step 4a: Domain Detection

Before category detection, identify which domain(s) the content relates to.

**Reference:** `templates/domain_patterns.md`

**Process:**

1. **Score each domain** against raw content using pattern matching:
   - Primary keyword match: +40% (max 1)
   - Secondary keyword match: +25% each (max 2)
   - Exclusion pattern: -30% each

2. **Build detection table:**

| Domain | Primary Match | Secondary Matches | Exclusions | Score |
|--------|---------------|-------------------|------------|-------|
| PALBuilder | [yes/no] | [0-2] | [count] | [X%] |
| LifeOS | [yes/no] | [0-2] | [count] | [X%] |
| Studio | [yes/no] | [0-2] | [count] | [X%] |
| PALOpenSource | [yes/no] | [0-2] | [count] | [X%] |
| PALProduct | [yes/no] | [0-2] | [count] | [X%] |
| LaraLou | [yes/no] | [0-2] | [count] | [X%] |

3. **Determine outcome:**
   - If top domain >= 80%: `detected_domain = [domain]` (high confidence)
   - If top domain 60-79%: `detected_domain = [domain]` (medium confidence, will confirm)
   - If multiple domains >= 70%: Flag for overlap handling (Step 4e)
   - If no domain >= 60%: `detected_domain = null` (will show menu in Step 5)

### Step 4b: LifeOS Category Detection

**Condition:** Only runs if `detected_domain == LifeOS` OR `detected_domain == null`

If LifeOS is detected (or no domain detected), check for specific category patterns:

| Pattern | Category | Confidence Signal |
|---------|----------|-------------------|
| "I believe...", values, worldview | `beliefs.md` | Strong |
| "My purpose...", "why I...", direction | `mission.md` | Strong |
| "I see it as...", perspective shifts | `frames.md` | Medium |
| "When X, I do Y", decision frameworks | `models.md` | Medium |
| "I learned...", "I realized...", insights | `learned.md` | Strong |
| "I want to...", aspirations, targets | `goals.md` | Strong |
| "I'm working on...", initiatives | `projects.md` | Strong |

**Outcome:**
- If category detected: Set `detected_category = [category].md`
- If no category: Set `detected_category = notes`

Note all detected patterns with confidence levels.

### Step 4c: Segment by Topic

Identify distinct themes in the braindump:

1. **Segment content** by topic shifts:
   - Paragraph breaks often indicate topic changes
   - Explicit markers ("Also...", "Another thing...", "Separately...")
   - Domain changes (from PALBuilder to LifeOS, etc.)
   - Category changes (from beliefs to goals, etc.)

2. **For each segment:**
   - Run domain detection (Step 4a patterns)
   - If LifeOS, run category detection (Step 4b patterns)
   - Assign confidence score (0-100%)

### Step 4d: Split Decision Logic

**Split when ALL conditions met:**
- 2+ distinct themes identified
- Each theme has confidence >= 70%
- Themes have **different domains** OR **different LifeOS categories**

**Don't split when:**
- Single dominant theme (>80% of content)
- Themes share same domain AND same category
- Example: "PAL workflow idea + PAL template idea" both map to PALBuilder = don't split

**Do split when:**
- Example: "PAL architecture decision + personal career goal" = different domains (PALBuilder vs LifeOS)
- Example: "Beliefs about work + lessons learned" = same domain (LifeOS), different categories
- Example: "Video production plan + newsletter idea" = different domains (Studio vs LaraLou)

### Step 4e: Overlap Handling

**Condition:** Multiple domains scored >= 70%

When content matches multiple domains with high confidence, present choice:

```
This content could belong to multiple destinations:

1. [Domain1] / [category] ([X%]) - "[matched pattern]"
2. [Domain2] / [category] ([Y%]) - "[matched pattern]"

Where should this go?
```

**User selects primary destination:**
- Set `detected_domain = [selected]`
- Non-selected match can be added as relation in Step 5b

### Step 4f: Present Split Options

If split conditions are met, present to user:

```
I detected 2 distinct themes in this braindump:

Theme 1: [topic summary]
  Domain: [detected_domain]
  Category: [category if LifeOS, else "notes"]
  Confidence: [X%]
  Content: "[preview of first ~50 chars]..."

Theme 2: [topic summary]
  Domain: [detected_domain]
  Category: [category if LifeOS, else "notes"]
  Confidence: [Y%]
  Content: "[preview of first ~50 chars]..."

Options:
1. Keep as single note (themes are related)
2. Split into 2 separate notes

Your choice:
```

### Step 4g: Execute Split

If user chooses to split:

1. **Create separate files** for each theme:
   - `braindump_YYYY-MM-DD_HHMM_theme1.md`
   - `braindump_YYYY-MM-DD_HHMM_theme2.md`

2. **Assign individual frontmatter** to each:
   - Each gets its own `category`, `domain`, `type`
   - Each gets relevant subset of tags

3. **Add cross-references** using `originated_with` relation:
   ```markdown
   ## Relations

   - originated_with [[braindump_YYYY-MM-DD_HHMM_theme2]]
   ```

4. **Process each note** through remaining steps (5b, 6b, etc.)

### Cancel Handling

If user cancels split prompt: Keep as single note, proceed with primary category.

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

## Step 5: Domain and Category Assignment

Assignment flow depends on detection results from Step 4.

### Case A: LifeOS domain + category detected

Present detection for confirmation:

```
I detected this content belongs to: LifeOS / [category]

Domain confidence: [X%]
Category confidence: [Y%]

Extracted: "[relevant quote from content]..."

Is this classification correct? (Y/N/Edit)
```

- **User confirms (Y):** Set `domain: LifeOS`, `category: [detected].md`, `status: ready`
- **User edits:** Apply user's correction
- **User rejects (N):** Proceed to manual selection (Case D)

### Case B: Non-LifeOS domain detected

Present detection for confirmation:

```
I detected this content belongs to: [domain]

Confidence: [X%]
Evidence: "[matched keywords/patterns]"

Is this correct? (Y/N/Edit)
```

- **User confirms (Y):** Set `domain: [detected]`, `category: notes`, `status: ready`
- **User edits:** Show domain selection menu (Case D)
- **User rejects (N):** Proceed to manual selection (Case D)

### Case C: LifeOS domain detected, no category

Present domain with category selection:

```
I detected this belongs to LifeOS but couldn't determine the category.

Which life-context file should this go to?

1. beliefs.md  - Core beliefs and values
2. frames.md   - Mental perspectives and lenses
3. learned.md  - Lessons and insights
4. mission.md  - Purpose and direction
5. models.md   - Decision frameworks
6. goals.md    - Objectives and aspirations
7. projects.md - Active initiatives
8. None        - Keep as general LifeOS note

Your choice:
```

- **User selects 1-7:** Set `domain: LifeOS`, `category: [selected].md`, `status: ready`
- **User selects 8 (None):** Set `domain: LifeOS`, `category: notes`, `status: ready`

### Case D: No domain detected (manual selection)

Ask user to select domain:

```
I couldn't determine a clear domain for this content.

Available domains:
1. LifeOS        - Personal beliefs, goals, projects, life philosophy
2. PALBuilder    - PAL system development, specs, architecture
3. Studio        - Video production, presentations, visual content
4. PALOpenSource - Release management, public distribution
5. PALProduct    - Product strategy, roadmap, user research
6. LaraLou       - Substack content, newsletter, blog
7. None          - Keep as domain-agnostic inbox note

Your choice:
```

- **User selects 1 (LifeOS):** Proceed to LifeOS category selection (Case C prompt)
- **User selects 2-6:** Set `domain: [selected]`, `category: notes`, `status: ready`
- **User selects 7 (None):** Set `domain: null`, `category: notes`, `status: unprocessed`

## Step 5b: Relation Entry

Add relations to connect this note to existing knowledge.

### Manual Entry

User can manually specify relations:

```
Add relations to this note? (Enter relation or skip)

Format: relation_type [[Target Note]]
Example: relates_to [[Existing API Notes]]

Available types: part_of, supports, contradicts, evolved_from, informs,
                 blocks, inspired_by, relates_to, originated_with, follows

Enter relation (or press Enter to skip):
```

### Agent Suggestions (when agent loaded)

If domain agent is loaded, suggest relations based on:
- Tags in common with existing notes
- Topic similarity
- Referenced concepts

```
Suggested relations based on domain context:

1. relates_to [[Previous Braindump]] (same tags: #ideas)
2. informs [[Project Planning]] (topic match)

[C]onfirm, [A]djust, or [S]kip each?
```

### Max 5 Relations Enforcement

- Track relation count as user adds
- If count reaches 5, stop accepting:
  ```
  Maximum 5 relations reached. Proceeding to save.
  ```

### Cancel Handling

If user cancels relation entry: Save note without relations, continue workflow.

## Step 6b: Dedup Check Before Save (Requires Agent)

**Condition:** Only runs when domain agent is loaded.

Before saving, check if similar note already exists:

### Process

1. If domain assigned, scan that domain for similar notes
2. Apply similarity scoring (see process_inbox Step 3b)
3. If score >= 60%, present dedup prompt

### Dedup Prompt

```
Similar note exists in [domain]:

Existing: [[existing_note_title]]
Match score: [score]%

Options:
1. Merge into existing note
2. Save as new note with `relates_to [[existing_note]]`
3. Save as new note (no relation)

Your choice:
```

### Cancel Handling

If user cancels: Save as new note without relation (Option 3).

## Step 6: Build Structured Output

Generate markdown file:

```yaml
---
status: [ready|unprocessed]
domain: [LifeOS|PALBuilder|Studio|PALOpenSource|PALProduct|LaraLou (Blog)|null]
project: null
category: [selected category]
type: braindump
subsection: [detected subsection|null]
created: YYYY-MM-DD
last_modified: YYYY-MM-DD
source_type: braindump
source_file: null
source_url: null
tags: ["braindump", "theme1", "theme2"]
---
```

**Domain values:**
- `LifeOS` - Personal life context (with category for specific file)
- `PALBuilder` - PAL system development
- `Studio` - Video/presentation production
- `PALOpenSource` - Release management
- `PALProduct` - Product strategy
- `LaraLou (Blog)` - Substack content
- `null` - Unassigned (requires manual routing)

```markdown
# Braindump: [Auto-generated Title Based on Main Theme]

## Raw Thoughts

[Original user content preserved exactly]

## Observations

[Extracted observations from Step 3b]

- [fact] ...
- [idea] ...
- [insight] ...
- [action] ...

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

## Relations

[Relations from Step 5b, if any]

- relates_to [[Related Note]]
- informs [[Another Note]]

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
**Domain:** [detected domain or "unassigned"]
**Category:** [category]
**Subsection:** [subsection|null]

### Detection Confidence
- Domain: [X%] ([matched pattern or "manual selection"])
- Category: [Y%] (if LifeOS, else "N/A")

### Main Themes Identified
- [Theme 1]
- [Theme 2]
- [Theme 3]

### Extracted Content
> "[Preview of extracted content]..."

### Next Steps
```

**If `domain: LifeOS` and `status: ready`:**
> Run `distribute notes` to append content to LifeOS/[category]

**If `domain: [other]` and `status: ready`:**
> Run `distribute notes` to move to [domain]/03_ASSETS/

**If `status: unprocessed`:**
> Run `process_inbox` to assign domain/category, then `distribute notes`

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
