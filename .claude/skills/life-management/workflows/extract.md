---
description: Extract insights from notes and ideas in 03_ASSETS/ into main life files
---

# Extract Workflow

Extract insights from raw notes, ideas, and journal entries into categorized life files.

## Trigger Phrases

- "extract notes"
- "process my ideas"
- "extract insights"
- "process 03_ASSETS"
- "analyze my notes"
- "distribute notes to files"

## Input Location

- **Source:** `domains/life-os/03_ASSETS/`
- **Supported Formats:** Markdown (.md), text (.txt)
- **Structure:** Files may be loose or in subdirectories

## Extraction Categories (7 Total)

| Category | Target File | Look For |
|----------|-------------|----------|
| Mission | 00_CONTEXT/mission.md | Purpose statements, "why" explanations, life direction |
| Beliefs | 00_CONTEXT/beliefs.md | Worldview, values, convictions, "I believe..." |
| Frames | 00_CONTEXT/frames.md | Perspectives, ways of seeing, mental lenses |
| Models | 00_CONTEXT/models.md | Decision frameworks, thinking tools, heuristics |
| Lessons | 00_CONTEXT/learned.md | Insights, realizations, "I learned that..." |
| Goals | 01_PROJECTS/goals.md | Objectives, targets, aspirations, "I want to..." |
| Projects | 01_PROJECTS/projects.md | Initiatives, work items, things to build/do |

## Execution Workflow

### Phase 1: Discovery

1. **Scan 03_ASSETS/ Directory**
   - Find all text-based files (.md, .txt)
   - Build inventory of files to process
   - Note any date patterns in filenames

2. **Report File Inventory**
   ```
   Found X note files to process:
   - [list files]
   ```

### Phase 2: Deep Analysis

For each file:

1. **Read Complete Content**
   - Load full file contents
   - Note filename for attribution

2. **Extract to Categories**
   Apply reasoning to classify content:

   **Mission** — Look for:
   - "My purpose is..."
   - "I want my life to be about..."
   - "The reason I..."
   - Core "why" statements

   **Beliefs** — Look for:
   - "I believe..."
   - "I think that..."
   - Value statements
   - Worldview expressions

   **Frames** — Look for:
   - "I see this as..."
   - "Think of it like..."
   - Perspective shifts
   - Mental models for viewing situations

   **Models** — Look for:
   - Decision-making approaches
   - "When X, I do Y..."
   - Thinking frameworks
   - Problem-solving patterns

   **Lessons** — Look for:
   - "I learned that..."
   - "I realized..."
   - "What worked/didn't work..."
   - Insights from experience

   **Goals** — Look for:
   - "I want to..."
   - "My goal is..."
   - Aspirations and targets
   - Future state desires

   **Projects** — Look for:
   - "I'm working on..."
   - "I need to build..."
   - Active initiatives
   - Things to create or complete

### Phase 3: Consolidation

1. **Aggregate All Extractions**
   - Group items by target category
   - Preserve source attribution

2. **Deduplicate**
   Apply these rules in order:

   **Rule 1: Exact Match**
   - Case-insensitive exact phrase match = definite duplicate
   - Keep first occurrence, note all sources

   **Rule 2: High Similarity (>80%)**
   - String similarity >80% = likely duplicate
   - Present to user for confirmation before merging

   **Rule 3: Semantic Category Match**
   - Same category + similar intent = potential duplicate
   - Ask user: "These seem related. Merge or keep separate?"

   **Rule 4: When in Doubt**
   - Keep both items with sources noted
   - User can consolidate later

3. **Format for Target Files**
   - Apply formatting guidelines from update.md
   - Prepare content for each target file

### Phase 4: User Review

Present extraction summary:

```markdown
## Extraction Preview

### Mission (X items)
- [Item 1] — *Source: notes_jan.md*
- [Item 2] — *Source: ideas.md*

### Beliefs (X items)
...

### Goals (X items)
...

[etc.]

---

Proceed with updates? (Y/N/Edit)
```

### Phase 5: Apply Updates

Upon user approval:

1. **Create backups** of all target files
2. **Append extracted content** to each file
3. **Log changes** to 02_SESSIONS/UPDATES.md

### Phase 6: Generate Report

Create extraction report in `04_OUTPUTS/`:

**Filename:** `extraction_[YYYY-MM-DD].md`

```markdown
# Extraction Report - [Date]

## Summary
- **Files Processed:** X
- **Total Items Extracted:** Y

## Distribution

| Category | Items | Target File |
|----------|-------|-------------|
| Mission | X | mission.md |
| Beliefs | X | beliefs.md |
| Frames | X | frames.md |
| Models | X | models.md |
| Lessons | X | learned.md |
| Goals | X | goals.md |
| Projects | X | projects.md |

## Extracted Items

### Mission
- [Item] — *Source: [file]*

### Beliefs
- [Item] — *Source: [file]*

[etc.]

---

*Generated: [timestamp]*
```

### Phase 7: Archive Processed Notes

After successful extraction, handle processed notes:

**Option A: Move to Archive**
- Move processed files to `05_ARCHIVE/extracted/`
- Preserves original filename

**Option B: Mark as Extracted**
- Add frontmatter to processed files:
  ```yaml
  ---
  extracted: true
  extracted_date: YYYY-MM-DD
  ---
  ```
- Files with `extracted: true` are SKIPPED on next extraction run
- User can remove marker to re-extract

**Default Behavior:**
1. Ask user: "Archive processed notes or mark as extracted?"
2. If user declines both, warn: "These notes may be re-extracted next time"

## Quality Requirements

1. **Attribution is Mandatory**
   - Every extracted item must have source file noted
   - Preserve context where meaningful

2. **Preserve Original Voice**
   - Keep original phrasing
   - Don't over-summarize

3. **User Approval Required**
   - Show preview before applying changes
   - Allow editing of extractions

4. **Completeness**
   - Process ALL files in 03_ASSETS/
   - Don't skip or truncate content

## Error Handling

- **Empty Directory:** Report "No notes found in 03_ASSETS/" and exit
- **Unreadable Files:** Skip with warning, continue others
- **No Extractions:** Report what was searched, suggest different categorization
- **Backup Failed:** STOP, do not proceed until backup succeeds
