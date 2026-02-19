# distribute_notes Workflow

Distribute processed notes from inbox to their designated domain 03_ASSETS/ folders.

## Step 1: Scan Inbox Notes

```bash
ls inbox/notes/*.md 2>/dev/null || echo "No markdown files found"
```

## Step 2: Filter Notes with Frontmatter

For each file:
1. Read file and check for YAML frontmatter
2. Parse frontmatter to extract: `status`, `domain`, `project`, `category`
3. Filter based on status:
   - `status: ready` → Add to distribution queue
   - `status: unprocessed` → Skip (needs processing first)
   - No frontmatter → Skip (run process_inbox first)

## Step 2b: Detect LifeOS Categories

Check if `category` is a LifeOS target file (ends with `.md`):

| Category | LifeOS Location |
|----------|-----------------|
| `beliefs.md` | 00_CONTEXT/ |
| `frames.md` | 00_CONTEXT/ |
| `learned.md` | 00_CONTEXT/ |
| `mission.md` | 00_CONTEXT/ |
| `models.md` | 00_CONTEXT/ |
| `goals.md` | 01_PROJECTS/ |
| `projects.md` | 01_PROJECTS/ |

- If category ends with `.md` → Add to **LifeOS distribution queue**
- Otherwise → Add to **standard distribution queue**

## Step 3: Validate Domains

For each note to distribute:

```bash
test -f "domains/[note.domain]/INDEX.md" && echo "exists" || echo "missing"
```

- If domain exists, continue
- If domain missing, report error and skip note

## Step 4: Convert Filename

Convert filename to `lower_snake_case` for 03_ASSETS/:

| Original | Converted |
|----------|-----------|
| `My Note.md` | `my_note.md` |
| `Research-Notes.md` | `research_notes.md` |
| `API Reference.md` | `api_reference.md` |

## Step 5: Check for Conflicts

Before moving, check if destination file exists:

```bash
test -f "domains/[domain]/03_ASSETS/[filename].md"
```

If conflict exists, ask user:
1. Overwrite existing file
2. Rename new file (append timestamp)
3. Skip this note

## Step 6: Move Note to Domain (Standard Distribution)

**For notes with general categories** (research, meeting, idea, reference, notes):

```bash
mv "inbox/notes/[original].md" "domains/[domain]/03_ASSETS/[converted].md"
```

After moving, update the note's frontmatter:
- Set `status: processed`
- Update `last_modified` to today's date

## Step 6b: Append to LifeOS File (LifeOS Distribution)

**For notes with LifeOS categories** (beliefs.md, frames.md, learned.md, mission.md, models.md, goals.md, projects.md):

1. **Determine target path:**
   ```
   beliefs.md | frames.md | learned.md | mission.md | models.md
   → domains/LifeOS/00_CONTEXT/[category]

   goals.md | projects.md
   → domains/LifeOS/01_PROJECTS/[category]
   ```

2. **Extract content from note:**
   - Look for `## Extracted Content` or `## For [category]` section
   - If not found, use entire note content (excluding frontmatter)

3. **Smart insertion based on subsection:**

   **If `subsection` field is set (not null):**
   - Read target file and find `## [subsection]` heading
   - Find the end of that section (next `---` or next `##` heading)
   - Insert content BEFORE the section delimiter:
     ```markdown
     ## [Subsection]

     [existing content...]

     ---
     *Source: [original_filename] (YYYY-MM-DD)*

     > [extracted content]

     ---
     ```

   **If `subsection` is null or heading not found:**
   - Append at end of file (before "Last Updated" footer):
     ```markdown

     ---
     *Source: [original_filename] (YYYY-MM-DD)*

     > [extracted content]
     ```

4. **Move original note to LifeOS assets:**
   ```bash
   mv "inbox/notes/[original].md" "domains/LifeOS/03_ASSETS/[converted].md"
   ```

5. **Update note frontmatter:**
   - Set `status: processed`
   - Update `last_modified` to today's date

## Step 7: Update Project Reference

If note has `project:` field set (not null):

1. Read project file:
   ```bash
   cat "domains/[domain]/01_PROJECTS/[project]"
   ```

2. Find or create `## References` section

3. Add link to the new asset:
   ```markdown
   ## References

   - [note_title](../03_ASSETS/[filename].md) - Added YYYY-MM-DD
   ```

4. Update project's `updated:` field in frontmatter to today

If project file doesn't exist, log warning but continue with move.

## Step 8: Update Domain INDEX.md

Update the domain's INDEX.md:
- Set `updated:` field to today's date

```bash
# Read current INDEX.md and update the updated field
```

## Step 9: Report Summary

```markdown
## Distribution Complete

### Notes Distributed (Standard)
| Note | Domain | Location | Project Updated |
|------|--------|----------|-----------------|
| research_notes.md | ProjectAlpha | 03_ASSETS/ | PROJECT_FEATURE_X.md |
| api_reference.md | ApiProject | 03_ASSETS/ | - |

### Notes Distributed (LifeOS)
| Note | Category | Subsection | Appended To | Archive Location |
|------|----------|------------|-------------|------------------|
| braindump_2026-02-16_1430.md | beliefs.md | Values | 00_CONTEXT/beliefs.md | 03_ASSETS/ |
| braindump_2026-02-16_1500.md | goals.md | Short-term | 01_PROJECTS/goals.md | 03_ASSETS/ |

### Notes Skipped (no frontmatter or unprocessed)
- raw_note.md (no frontmatter)
- draft.md (status: unprocessed)

### Notes Skipped (domain not found)
- orphan_note.md → domain 'OldProject' not found

### Conflicts Resolved
- existing_doc.md → renamed to existing_doc_20260211.md

**Total:** X distributed (Y standard, Z LifeOS), W skipped
```

## Error Handling

- **Missing domain:** Report error, leave note in inbox
- **Missing project file:** Warn but still move note, skip project update
- **File conflict:** Prompt user for resolution
- **Permission error:** Report and suggest checking permissions

## Next Steps

After distribution:
- Review notes in their new locations
- Check project files for updated references
- Archive or delete notes from inbox if desired
