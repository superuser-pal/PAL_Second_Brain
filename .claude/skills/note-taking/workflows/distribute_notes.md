# distribute_notes Workflow

Distribute processed notes from inbox to their designated domain 03_ASSETS/ folders.

## Step 1: Scan Inbox Notes

```bash
ls inbox/notes/*.md 2>/dev/null || echo "No markdown files found"
```

## Step 2: Filter Notes with Frontmatter

For each file:
1. Read file and check for YAML frontmatter
2. Parse frontmatter to extract: `status`, `domain`, `project`
3. Filter based on status:
   - `status: ready` → Add to distribution queue
   - `status: unprocessed` → Skip (needs processing first)
   - No frontmatter → Skip (run process_inbox first)

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

## Step 6: Move Note to Domain

```bash
mv "inbox/notes/[original].md" "domains/[domain]/03_ASSETS/[converted].md"
```

After moving, update the note's frontmatter:
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

### Notes Distributed
| Note | Domain | Location | Project Updated |
|------|--------|----------|-----------------|
| research_notes.md | project-alpha | 03_ASSETS/ | PROJECT_FEATURE_X.md |
| api_reference.md | api-project | 03_ASSETS/ | - |

### Notes Skipped (no frontmatter or unprocessed)
- raw_note.md (no frontmatter)
- draft.md (status: unprocessed)

### Notes Skipped (domain not found)
- orphan_note.md → domain 'old-project' not found

### Conflicts Resolved
- existing_doc.md → renamed to existing_doc_20260211.md

**Total:** X distributed, Y skipped
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
