# process_inbox Workflow

Add standardized YAML frontmatter to raw notes in the inbox.

## Step 1: Scan Inbox Notes

```bash
ls inbox/notes/*.md 2>/dev/null || echo "No markdown files found"
```

Identify all markdown files in the inbox/notes folder.

## Step 1b: Agent Detection

Check if a domain agent is currently loaded:

**Detection Method:**
- Check if agent context is present in current session
- Agent provides access to domain files for relation suggestions and dedup

**Outcomes:**
- **Agent loaded:** Full processing available (relations, dedup, domain context)
- **No agent loaded:** Blind mode - limited processing (see Step 1b-blind below)

## Step 1b-blind: Blind Mode (No Agent Loaded)

**Condition:** No domain agent is loaded.

When no agent context is available, offer the user a choice:

### Blind Mode Prompt

```
No domain agent is currently loaded.

Without an agent, the following features are limited:
- No relation suggestions (no domain context)
- No dedup check (can't scan existing notes)
- Domain and project must be manually assigned or left unassigned

Options:
1. Proceed with partial processing
   - Observations will be categorized
   - Type will be assigned
   - Tags will be extracted
   - Domain set to `_unassigned`
   - Status set to `draft`

2. Load an agent first
   - Run `/[agent-name]` to load a domain agent
   - Then rerun process_inbox for full features

Your choice:
```

### Option 1: Proceed with Partial Processing

If user chooses to proceed:
1. Continue to Step 2+
2. Skip Steps 3b, 4c (agent-dependent)
3. Set in frontmatter:
   - `domain: _unassigned`
   - `project: _unassigned`
   - `status: draft`
4. Note remains in inbox for future reprocessing

### Option 2: Load Agent First

If user chooses to load agent:
1. Display available agents: `ls .claude/agents/*.md`
2. Instruct: "Run `/[agent-name]` then rerun process_inbox"
3. Exit workflow

### Cancel Handling

If user cancels: Exit workflow, leave notes unchanged.

## Step 2: Check for Existing Frontmatter

For each file found:
1. Read the file content
2. Check if it starts with `---` on line 1 and has a closing `---`
3. If frontmatter exists, add to "skip" list
4. If no frontmatter, add to processing queue

## Step 3: List Available Domains

```bash
ls -d domains/*/ 2>/dev/null | xargs -I {} basename {}
```

Present available domains to user for selection.

## Step 3b: Dedup Check (Requires Agent)

**Condition:** Only runs when domain agent is loaded.

Before creating a new note, check for similar existing notes in the target domain.

### Similarity Scoring Algorithm

```
score = 0

# Exact title match (100% - immediate match)
if normalize(new.title) == normalize(existing.title):
    return 100

# Same domain + 2+ shared tags (40%)
if new.domain == existing.domain:
    shared_tags = intersection(new.tags, existing.tags)
    if len(shared_tags) >= 2:
        score += 40

# Content similarity via Jaccard index (30%)
key_terms_new = extract_nouns_verbs(new.content)
key_terms_existing = extract_nouns_verbs(existing.content)
jaccard = len(intersection) / len(union)
if jaccard > 0.5:
    score += 30

# Single shared tag (20%)
if len(shared_tags) == 1:
    score += 20

return score
```

**Threshold:** Score >= 60% triggers dedup prompt.

### Dedup Prompt

When similar note found:

```
Similar note found in [domain]:

Existing: [[existing_note_title]]
Match score: [score]%
Matched on: [title/tags/content]

Options:
1. Append to existing note (merge content)
2. Create separate note with relation (adds `relates_to [[existing_note]]`)
3. Proceed as new note (no relation)

Your choice:
```

**Cancel Handling:** If user cancels, create note as new without any relation (Option 3 behavior).

### Merge Behavior (Option 1)

When appending to existing:
1. Read existing note content
2. Add new observations to `## Observations` section
3. Merge tags (union of both sets)
4. Update `last_modified` timestamp
5. Do NOT create new file - modify existing

## Step 4: Gather Note Information

For each note without frontmatter, prompt user for:

1. **Domain:** Which domain does this note belong to?
   - Show list of available domains
   - Accept `null` if note is domain-agnostic

2. **Project:** Is this note linked to a specific project?
   - If domain selected, list projects: `ls domains/[domain]/01_PROJECTS/PROJECT_*.md`
   - Accept `null` if not project-specific

3. **Category:** What type of note is this?

   **LifeOS Categories** (auto-sets domain to LifeOS):
   - `beliefs.md` - Core beliefs and values
   - `frames.md` - Mental perspectives and lenses
   - `learned.md` - Lessons and insights
   - `mission.md` - Purpose and direction
   - `models.md` - Decision frameworks
   - `goals.md` - Objectives and aspirations
   - `projects.md` - Active initiatives

   **General Categories:**
   - `research` - Research notes, findings, analysis
   - `meeting` - Meeting notes, action items
   - `idea` - Ideas, brainstorming, concepts
   - `reference` - Reference materials, documentation
   - `notes` - General notes (default)

   **Note:** If user selects a LifeOS category (ending in `.md`), automatically set `domain: LifeOS`

4. **Tags:** Any tags for categorization? (optional)
   - Comma-separated list
   - Will be converted to array

## Step 4a: Type Selection

After category assignment, determine the entity type:

**Auto-Inference Rules:**
| Category/Content Pattern | Suggested Type |
|--------------------------|----------------|
| Category is `meeting` | `meeting` |
| Category is `idea` | `idea` |
| Category is `reference` | `reference` |
| Contains URL/source | `reference` |
| Contains "decided", options considered | `decision` |
| Explains/defines a term | `concept` |
| Otherwise | `note` (default) |

**Process:**
1. Analyze content for type indicators
2. Suggest most likely type to user
3. User confirms or selects different type

```
Suggested type: [inferred_type]

Available types:
1. concept  - Knowledge artifact (explains an idea or term)
2. decision - Recorded choice (documents decision with rationale)
3. reference - External resource (URL, doc, paper)
4. meeting  - Interaction record (attendees, action items)
5. idea     - Early-stage concept (not yet fully developed)
6. note     - Generic note (default)

Your choice: [user input or Enter to accept suggestion]
```

**Cancel Handling:** If user cancels, set `type: note` (default) and continue.

## Step 4b: Observation Categorization

For notes with uncategorized content, extract and categorize observations:

**Process:**
1. Scan note content for statements that can be categorized
2. For each uncategorized statement, suggest appropriate category
3. Present suggestions to user for confirmation

**Valid Categories:** fact, idea, decision, technique, requirement, question, insight, problem, solution, action

**Example:**
```
Found uncategorized content. Suggested categorizations:

1. "API rate limit is 1000/hour" → [fact] #api #limits
2. "Could use Redis for caching" → [idea] #caching
3. "Need to review docs tomorrow" → [action] #tasks

Accept all? (Y/N/Edit individual)
```

**Cancel Handling:** If user cancels, preserve content as-is without categorization.

## Step 4c: Relation Suggestions (Requires Agent)

**Condition:** Only runs when domain agent is loaded.

Scan domain context to suggest relations to existing notes.

### Process

1. **Scan domain context** for existing notes the agent can see
2. **Analyze current note** for potential connections:
   - Shared tags
   - Similar topics/themes
   - Referenced concepts
   - Sequential or dependent content
3. **Propose relations** with appropriate types

### Relation Suggestion Prompt

```
Based on domain context, I suggest these relations:

1. supports [[Existing API Design]] (shared tags: #api, #architecture)
2. evolved_from [[Initial Research Notes]] (similar topic)
3. relates_to [[Performance Optimization]] (referenced concept)

For each relation:
- [C]onfirm - Add this relation
- [A]djust - Change relation type
- [S]kip - Don't add this relation

(Press Enter to confirm all, or respond per relation)

Relation 1: [C/A/S]
```

### Max Relations Enforcement

- Count existing + proposed relations
- If total > 5, warn user:
  ```
  Adding all proposed relations would exceed max 5 per note.
  Currently: [existing_count]
  Proposed: [proposed_count]

  Please select which relations to add (max [remaining] more):
  ```

### Cancel Handling

- If user cancels entirely: Skip all relations, log "user skipped relation suggestions"
- If user skips individual relation: Don't add that relation, continue with others

## Step 5: Add Frontmatter

For each note, construct and insert frontmatter:

```yaml
---
status: ready
domain: [user-selected-domain]
project: [user-selected-project or null]
category: [user-selected-category]
type: [user-selected-type or note]
created: [YYYY-MM-DD]
last_modified: [YYYY-MM-DD]
source_type: manual
source_file: null
source_url: null
tags: [user-provided-tags]
---
```

Use the add_frontmatter tool:
```bash
bun .claude/skills/note-taking/tools/add_frontmatter.ts \
  --file "inbox/notes/[filename]" \
  --domain "[domain]" \
  --project "[project]" \
  --category "[category]" \
  --status "ready" \
  --tags "[tags]"
```

Or manually insert at the beginning of the file.

## Step 6: Report Summary

Present results in this format:

```markdown
## Inbox Processing Complete

### Notes Processed
| Note | Domain | Project | Category |
|------|--------|---------|----------|
| note_name.md | ProjectAlpha | PROJECT_FEATURE_X.md | research |
| another_note.md | BlogContent | null | idea |

### Notes Skipped (already have frontmatter)
- existing_note.md

### Notes Remaining (user skipped)
- skipped_note.md

**Total:** X processed, Y skipped, Z remaining
```

## Error Handling

- **No files found:** Report "inbox/notes/ is empty or contains no .md files"
- **Invalid domain:** List available domains, ask user to select valid one
- **Invalid project:** List available projects in domain, allow skip
- **File read error:** Report error, continue with next file

## Next Steps

After processing, suggest:
- Run `distribute_notes` to move notes to their domains
- Review notes in `inbox/notes/` before distribution
