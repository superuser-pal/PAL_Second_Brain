# add_frontmatter Tool

Add or update YAML frontmatter in markdown files.

## Usage

```bash
bun .claude/skills/note-taking/tools/add_frontmatter.ts [options]
```

## Options

| Option | Short | Description | Required |
|--------|-------|-------------|----------|
| `--file` | `-f` | Target markdown file | Yes |
| `--domain` | `-d` | Domain name (PascalCase) | No |
| `--project` | `-p` | Project file (PROJECT_*.md) | No |
| `--category` | `-c` | Note category | No |
| `--status` | `-s` | Processing status | No |
| `--tags` | `-t` | Comma-separated tags | No |
| `--source-type` | | Source type | No |
| `--source-file` | | Original filename | No |
| `--source-url` | | Source URL | No |
| `--update` | `-u` | Merge with existing frontmatter | No |
| `--force` | | Overwrite existing completely | No |
| `--help` | `-h` | Show help | No |

## Valid Values

**status:**
- `unprocessed` - Needs domain/project assignment
- `ready` - Ready for distribution
- `processed` - Distributed to domain
- `archived` - Moved to archive

**category:**
- `research` - Research notes
- `meeting` - Meeting notes
- `idea` - Ideas and concepts
- `reference` - Reference materials
- `notes` - General notes (default)

**source-type:**
- `manual` - Created manually (default)
- `pdf` - Ingested from PDF
- `docx` - Ingested from Word
- `txt` - Ingested from text
- `web` - Captured from web

## Examples

**Add basic frontmatter:**
```bash
bun add_frontmatter.ts --file inbox/notes/my_note.md \
  --domain ProjectAlpha \
  --status ready
```

**Update existing frontmatter:**
```bash
bun add_frontmatter.ts --file note.md \
  --update \
  --status processed
```

**Add with full metadata:**
```bash
bun add_frontmatter.ts --file note.md \
  --domain BlogContent \
  --project PROJECT_LAUNCH.md \
  --category research \
  --status ready \
  --tags "api,backend,authentication"
```

**Add source information:**
```bash
bun add_frontmatter.ts --file ingested_doc.md \
  --source-type pdf \
  --source-file "original_document.pdf" \
  --category reference
```

## Behavior

- **No flags:** Fails if frontmatter exists
- **--update:** Merges new values with existing
- **--force:** Overwrites existing frontmatter completely

## Validation

- Validates domain exists in `domains/` directory
- Validates status, category, source-type against allowed values
- Auto-generates `created` and `last_modified` dates

## Output

On success, prints:
```
Frontmatter added: inbox/notes/my_note.md
  status: ready
  domain: ProjectAlpha
  project: (none)
  category: notes
```
