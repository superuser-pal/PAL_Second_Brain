# process_inbox Workflow

Add standardized YAML frontmatter to raw notes in the inbox.

## Step 1: Scan Inbox Notes

```bash
ls inbox/notes/*.md 2>/dev/null || echo "No markdown files found"
```

Identify all markdown files in the inbox/notes folder.

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

## Step 5: Add Frontmatter

For each note, construct and insert frontmatter:

```yaml
---
status: ready
domain: [user-selected-domain]
project: [user-selected-project or null]
category: [user-selected-category]
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
