# People File Schema

## Purpose

Structured people files for active relationship tracking. Each person gets their own .md file in `.claude/core/user/People/` with standardized frontmatter that Obsidian Bases can query.

## Frontmatter Schema

```yaml
---
type: person
name: Full Name
email: email@example.com
company: Company Name
relationship: professional    # professional | personal | family | collaborator
stage: active                 # lead | active | dormant | archived
next_action: 2026-03-01       # YYYY-MM-DD — when to follow up
next_action_note: Follow up on proposal
last_contact: 2026-02-27      # YYYY-MM-DD — last interaction date
domains:                      # PAL domains this person relates to
  - PALProduct
  - LaraLou (Blog)
tags: [product, toyota]
notes: Brief context about the relationship
---
```

## Required Fields

| Field | Type | Description |
| :--- | :--- | :--- |
| `type` | string | Always `person` |
| `name` | string | Full display name |
| `relationship` | enum | professional, personal, family, collaborator |
| `last_contact` | date | Last meaningful interaction |

## Optional Fields

| Field | Type | Description |
| :--- | :--- | :--- |
| `email` | string | Primary email |
| `company` | string | Current organization |
| `stage` | enum | lead, active, dormant, archived |
| `next_action` | date | When to follow up |
| `next_action_note` | string | What the follow-up is about |
| `domains` | list | PAL domains they connect to |
| `tags` | list | Freeform tags |
| `notes` | string | Brief relationship context |

## File Naming

`.claude/core/user/People/Full Name.md` — use the person's display name as filename.

## Body Content

Below the frontmatter, free-form notes about the person: interaction history, shared context, project involvement. No required structure.

## Bases Integration

`Bases/People.base` provides two views:
- **Needs Follow-up** — people where `next_action <= today`
- **All Contacts** — sorted by last_contact DESC

## Relationship to CONTACTS.md

`CONTACTS.md` (`.claude/core/user/`) remains the static reference for AI context loading. `.claude/core/user/People/` files are the active tracking layer. CONTACTS.md can reference People/ files for details.
