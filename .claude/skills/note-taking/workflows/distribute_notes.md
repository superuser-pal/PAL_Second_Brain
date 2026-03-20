# distribute_notes Workflow

Distribute processed notes from inbox to their designated domain folders. Uses Jaccard similarity to find the best matching target files across `02_PAGES/`, `00_CONTEXT/`, and `01_PROJECTS/`, presents a confirmation list, and writes only to confirmed targets.

---

## Step 1: Read Agent Context

Before scanning any files, check if a domain agent is active.

1. Read `.claude/sessions/.current-session`
2. If file exists and contains YAML with `agent`, `domain`, and `loaded_paths`:
   - Parse `loaded_paths` as the **agent candidate pool** (list of pre-loaded file paths)
   - Store `agent_domain` for domain mismatch check (Step 3b)
3. If file is absent, empty, or unparseable → set agent candidate pool to `null` (no-agent session)

---

## Step 2: Scan Inbox Notes

```bash
ls Inbox/Notes/*.md 2>/dev/null || echo "No markdown files found"
```

For each file:
1. Read frontmatter
2. Parse: `status`, `domain`, `destination`, `project`, `type`, `origin`
3. Filter:
   - `status: ready` → Add to distribution queue
   - `status: unprocessed` → Skip (needs process_inbox first)
   - `domain: _unassigned` → Skip (needs domain assignment)
   - No frontmatter → Skip (run process_inbox first)

---

## Step 2b: Detect LifeOS Types

Check if `domain: LifeOS` and `type` is a LifeOS-specific type:

| Type | LifeOS Location |
|------|-----------------|
| `belief` | 00_CONTEXT/beliefs.md |
| `frame` | 00_CONTEXT/frames.md |
| `lesson` | 00_CONTEXT/learned.md |
| `model` | 00_CONTEXT/models.md |
| `goal` | 00_CONTEXT/GOAL_*.md (create new GOAL file) |

- If `domain: LifeOS` AND `type` matches above → Route directly via LifeOS distribution (Step 7b). Skip smart routing steps below.
- `plan` and `note` types with `domain: LifeOS` → proceed through smart routing like all other domains.

---

## Step 3: Determine Scan Pool

For each note in the distribution queue:

1. Read `destination` field from frontmatter:

| `destination` value | Scan pool |
|---|---|
| `pages` | `Domains/[domain]/02_PAGES/` only |
| `context` | `Domains/[domain]/00_CONTEXT/` only |
| `projects` | `Domains/[domain]/01_PROJECTS/` only |
| `all` | All three folders |
| `null` / absent | All three folders |

2. Remove any folder from the pool that does not exist on disk — skip silently.

### Step 3b: Agent Domain Mismatch Check

If an agent is active (`agent_domain` is set):
- Compare `agent_domain` to the note's `domain` field
- If they differ → **do not use agent candidate pool for this note** (wrong domain); fall back to cold scan only
- If they match → use agent candidate pool as described in Step 4

---

## Step 4: Collect Candidates

For each folder in the scan pool:

1. Glob all `.md` files in that folder
2. For each file:
   - If file path is in the **agent candidate pool** → mark as `pre-loaded: true`, skip disk read for content (use already-loaded content)
   - Otherwise → read frontmatter only (do not load full file content)
3. Build candidate list:
   ```
   { path, folder, title, tags, description, pre_loaded }
   ```

Agent-context candidates are listed before cold-scan candidates in all subsequent steps.

---

## Step 5: Score Candidates (Jaccard Similarity)

Apply Jaccard similarity to each candidate against the note being distributed.

### Algorithm

**Input sets:**
- Note: extract tags + significant words from `description`, `name`, and observation content
- Candidate: extract tags + significant words from `title`, `description`, `tags` frontmatter fields

**Score:**
```
J(A, B) = |A ∩ B| / |A ∪ B|
```

**Combined score:**
```
score = (Jaccard × 0.6) + (tag_overlap × 0.4)
```
Where `tag_overlap = matching_tags / total_unique_tags`.

**Threshold:** Score >= 0.60 (60%) → include in confirmation list. Below threshold → exclude.

**Fallback:** If no candidates score >= 60% → proceed to Step 5b.

### Step 5b: No-Match Fallback

If no candidates score above threshold:

```
No matching files found in [scan pool folders].

Options:
1. Create new page in 02_PAGES/ (recommended)
2. Expand search to all folders (override destination scope)
3. Keep in inbox — skip distribution for this note

Your choice (1-3):
```

- Option 1 → Skip to Step 7 (standard distribution, new file)
- Option 2 → Reset scan pool to all three folders, repeat Steps 4–5 once
- Option 3 → Set `status: insubstantial`, skip note

---

## Step 6: Confirmation List

Present all candidates above threshold as a single numbered list:

```
Smart distribution for: [note filename]
Domain: [domain]

Matching targets found:

  [agent context]
  1. 00_CONTEXT/beliefs.md (84%)
  2. 01_PROJECTS/PROJECT_FEATURE_X.md (71%)

  [pages]
  3. 02_PAGES/product_philosophy.md (65%)

Select targets (e.g. "1", "1 3", "all", or "none"):
```

**Rules:**
- Agent-context candidates appear first under `[agent context]` header
- Cold-scan candidates appear after under their folder name
- If no agent is active, skip the `[agent context]` header entirely
- User enters comma or space-separated numbers, "all", or "none"
- "none" → proceed to Step 5b (no-match fallback options)

---

## Step 7: Write to Confirmed Targets

For each confirmed target:

### Determine write action:

| Target folder | File exists? | Action |
|---|---|---|
| `02_PAGES/` | No | Create new file (move from inbox) |
| `02_PAGES/` | Yes | Append to existing page |
| `00_CONTEXT/` | Yes | Append to context file (smart insertion per Step 7b rules) |
| `01_PROJECTS/` | Yes | Append to project file under `## References` or `## Notes` section |

### For append targets:

```markdown
---

## From: [source_note_title]
_Added: YYYY-MM-DD from [[source_note_filename]]_

[source_note_body — excluding frontmatter]
```

### For new page creation (`02_PAGES/`):

- Convert filename to `lower_snake_case`
- Check for conflicts (Step 6 original flow)
- Move file from `Inbox/Notes/` to `Domains/[domain]/02_PAGES/[filename].md`
- Update frontmatter: `status: processed`, `last_updated: today`

---

## Step 7b: Append to LifeOS File (LifeOS Distribution)

**For notes with LifeOS types** (belief, frame, lesson, model, goal) where `domain: LifeOS`:

1. **Determine target path:**
   ```
   type: belief → Domains/LifeOS/00_CONTEXT/beliefs.md
   type: frame  → Domains/LifeOS/00_CONTEXT/frames.md
   type: lesson → Domains/LifeOS/00_CONTEXT/learned.md
   type: model  → Domains/LifeOS/00_CONTEXT/models.md
   type: goal   → Domains/LifeOS/00_CONTEXT/GOAL_[name].md (create new GOAL file)
   ```

2. **Create backup before modification:**
   - Ensure backup directory exists: `Domains/LifeOS/05_ARCHIVE/backups/`
   - Copy target file to backup:
     ```bash
     cp "Domains/LifeOS/[folder]/[category]" \
        "Domains/LifeOS/05_ARCHIVE/backups/[category]_YYYY-MM-DD_HH-MM-SS.md"
     ```
   - If backup fails, STOP and report error (do not proceed with append)

3. **Extract content from note:**
   - Look for `## Extracted Content` or `## For [category]` section
   - If not found, use entire note content (excluding frontmatter)

4. **Smart insertion based on subsection:**

   **If `subsection` field is set (not null):**
   - Read target file and find `## [subsection]` heading
   - Insert content BEFORE the section delimiter

   **If `subsection` is null or heading not found:**
   - Append at end of file (before "Last Updated" footer)

5. **Move original note to LifeOS assets:**
   ```bash
   mv "Inbox/Notes/[original].md" "Domains/LifeOS/02_PAGES/[converted].md"
   ```

6. **Update note frontmatter:** `status: processed`, `last_updated: today`

7. **Log change to UPDATES.md:**
   - Append to `Domains/LifeOS/04_SESSIONS/UPDATES.md`

---

## Step 7c: Validate Relations

For each note being distributed, check its `## Relations` section:

1. Parse relations (format: `- relation_type [[Target Note]]`)
2. For each relation target, check if it exists in the destination domain
3. If missing → warn (forward reference), do not block distribution

---

## Step 7d: Action Extraction to PROJECT Files

**Condition:** Note has a `project:` field AND agent context is loaded.

1. Scan note for `- [action] content #tags`
2. Locate project file at `Domains/[domain]/01_PROJECTS/[project]`
3. Add each action as task under `## Tasks`:
   ```markdown
   - [ ] [action content] (from: [[Source Note]])
   ```

**No agent:** Skip action extraction. Actions remain in note observations for second pass.

---

## Step 7e: Standalone Task Extraction

**Condition:** Note has actionable tasks but NO `project:` field.

1. Scan for `- [action] content` or `- [ ] content`
2. Route to `Domains/[domain]/01_PROJECTS/AD_HOC_TASKS.md` (create if missing)
3. Add under `### Open` with backlink to source note

---

## Step 8: Update Project Reference

If note has `project:` field set (not null):

1. Read project file
2. Find or create `## References` section
3. Add link: `- [note_title](../02_PAGES/[filename].md) - Added YYYY-MM-DD`
4. Update project's `updated:` frontmatter field

---

## Step 9: Update Domain INDEX.md

Update `updated:` field in `Domains/[domain]/INDEX.md` to today.

---

## Step 10: Report Summary

```
## Distribution Complete

### Notes Distributed
| Note | Domain | Target(s) | Action | Project Updated |
|------|--------|-----------|--------|-----------------|
| research_notes.md | PALBuilder | 00_CONTEXT/constitution.md | appended | — |
| meeting_notes.md | PALBuilder | 02_PAGES/meeting_notes.md | created | PROJECT_X.md |

### Notes Skipped
- raw_note.md (no frontmatter)
- draft.md (status: unprocessed)

### Notes Kept in Inbox
- small_note.md (user chose: keep in inbox)

Total: X distributed, Y skipped, Z kept
```

---

## Error Handling

- **Missing domain:** Report error, leave note in inbox
- **Missing project file:** Warn but still move note, skip project update
- **Destination scope returns no matches:** Offer fallback (Step 5b)
- **Write conflict on new page:** Prompt — overwrite, rename (append timestamp), or skip
- **Agent domain mismatch:** Fall back to cold scan silently, no warning needed
