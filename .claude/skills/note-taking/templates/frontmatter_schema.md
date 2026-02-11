# Note Frontmatter Schema

This document defines the YAML frontmatter schema for notes managed by the note-taking skill.

## Complete Schema

```yaml
---
status: unprocessed
domain: null
project: null
category: notes
created: 2026-02-11
last_modified: 2026-02-11
source_type: manual
source_file: null
source_url: null
tags: []
---
```

## Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `status` | enum | Processing status | `ready` |
| `domain` | string\|null | Target domain name | `project-alpha` |
| `category` | enum | Note category | `research` |
| `created` | date | Creation date | `2026-02-11` |
| `last_modified` | date | Last modification | `2026-02-11` |

## Status Values

| Status | Meaning | Location |
|--------|---------|----------|
| `unprocessed` | Needs domain/project assignment | inbox/notes/ |
| `ready` | Ready for distribution | inbox/notes/ |
| `processed` | Distributed to domain | domains/*/03_ASSETS/ |
| `archived` | Moved to archive | domains/*/05_ARCHIVE/ |

## Category Values

| Category | Use For |
|----------|---------|
| `research` | Research notes, findings, analysis |
| `meeting` | Meeting notes, action items |
| `idea` | Ideas, brainstorming, concepts |
| `reference` | Reference materials, documentation |
| `notes` | General notes (default) |

## Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `project` | string\|null | Linked PROJECT_*.md file |
| `source_type` | enum | How note was created |
| `source_file` | string\|null | Original filename |
| `source_url` | string\|null | Source URL |
| `tags` | array | Categorization tags |

## Source Type Values

| Type | Description |
|------|-------------|
| `manual` | Created manually |
| `pdf` | Ingested from PDF |
| `docx` | Ingested from Word document |
| `txt` | Ingested from text file |
| `web` | Captured from web |

## Domain Field Rules

- Must be `lower-kebab-case`
- Must match existing domain in `domains/`
- Set to `null` for domain-agnostic notes
- Validated during `distribute_notes` workflow

## Project Field Rules

- Must match file in `domains/[domain]/01_PROJECTS/`
- Format: `PROJECT_NAME.md` (include extension)
- Set to `null` if not project-specific
- When set, `distribute_notes` adds reference link to project

## Tags Field Rules

- Array of strings
- Use lowercase, hyphenated tags
- Example: `["api", "backend", "authentication"]`
