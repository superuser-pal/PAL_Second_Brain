---
name: asset-classes
description: PAL Asset Class property schemas — 6 entity types with strict frontmatter definitions
type: reference
version: 1.0.0
last_updated: 2026-03-15
---

# Asset Classes

Six entity types in the PAL system. Each has a strict frontmatter schema. Properties must appear in the order listed.

---

## 1. Domain (INDEX.md)

**Location:** `Domains/[DomainName]/INDEX.md`

```yaml
name: DomainName           # PascalCase
description: "..."         # Purpose/scope of this domain
status: active             # active | paused | completed | archived
last_updated: 2026-03-15   # YYYY-MM-DD
```

---

## 2. Project (01_PROJECTS/*.md)

**Location:** `Domains/[DomainName]/01_PROJECTS/PROJECT_*.md`

```yaml
name: PROJECT_NAME         # UPPER_SNAKE_CASE
domain: DomainName         # Link to parent domain
goal: "Goal Name"          # Link to GOAL_*.md or descriptive text
status: planning           # planning | in_progress | blocked | completed | cancelled
priority: medium           # low | medium | high | critical
target_deadline: null      # YYYY-MM-DD or null
task_progress: "0/5"       # Fraction string (completed/total)
tags: []                   # Keyword array
created: 2026-03-15        # YYYY-MM-DD
last_updated: 2026-03-15   # YYYY-MM-DD
```

---

## 2b. Task List (01_PROJECTS/AD_HOC_TASKS.md)

**Location:** `Domains/[DomainName]/01_PROJECTS/AD_HOC_TASKS.md`

One file per domain. Holds standalone tasks not tied to any specific project.

```yaml
name: AD_HOC_TASKS
type: task-list
domain: DomainName         # Parent domain
last_updated: 2026-03-15   # YYYY-MM-DD
```

---

## 3. Page (02_PAGES/*.md)

**Location:** `Domains/[DomainName]/02_PAGES/*.md`

```yaml
name: page_name            # lower_snake_case
origin: manual             # braindump | ai-output | manual
type: note                 # concept | decision | reference | meeting | idea | note | belief | frame | lesson | model | goal | plan
status: unprocessed        # unprocessed | ready | processed
description: null          # 1-2 sentence summary of content and key value
domain: DomainName         # Parent domain (PascalCase)
project: null              # Optional link to PROJECT_*.md filename (or null)
origin_agent: null         # Domain agent name — required when origin: ai-output, null otherwise
url: null                  # External source URL (or null)
favorite: false            # Boolean — Obsidian renders as checkbox in Properties panel
tags: []                   # Keyword array
created: 2026-03-15        # YYYY-MM-DD
last_updated: 2026-03-15   # YYYY-MM-DD
```

> **Obsidian note:** `favorite` uses a native boolean (`true`/`false`). Obsidian automatically renders boolean frontmatter fields as checkboxes in the Properties panel and supports `note.favorite == true` filter syntax in Bases.

> **origin_agent rule:** Only populate when `origin: ai-output`. Set to the name of the agent that generated the content (e.g., `pal-builder`). Leave `null` for all other origins.

---

## 4. Context (00_CONTEXT/*.md, excluding GOAL_*)

**Location:** `Domains/[DomainName]/00_CONTEXT/*.md` (not matching `GOAL_*.md`)

```yaml
name: context_name         # lower_snake_case
domain: DomainName         # Parent domain
description: "..."         # Core philosophy, rules, or reference content summary
status: active             # active | deprecated
tags: []                   # Keyword array
last_updated: 2026-03-15   # YYYY-MM-DD
```

---

## 5. Goal (00_CONTEXT/GOAL_*.md)

**Location:** `Domains/[DomainName]/00_CONTEXT/GOAL_*.md`

```yaml
name: "Goal Name"          # Human readable title
domain: DomainName         # Parent domain
description: "..."         # What success looks like when this goal is achieved
status: Active             # Active | Hit | Missed
target_deadline: 2026-12-31  # YYYY-MM-DD
projects_related: []       # Array of PROJECT_*.md filenames linked to this goal
last_updated: 2026-03-15   # YYYY-MM-DD
```

---

## 6. Domain Agent (.claude/agents/*.md)

**Location:** `.claude/agents/[agent-name].md`

```yaml
name: agent-name           # lower-kebab-case
domain: DomainName         # Bound domain (must match an existing domain)
description: "..."         # Role and purpose summary
version: 1.0.0             # Semver
last_updated: 2026-03-15   # YYYY-MM-DD
```

---

## Folder Structure Reference

```
Domains/[DomainName]/
├── INDEX.md               → Domain asset class
├── CONNECTIONS.yaml       → External integrations
├── 00_CONTEXT/            → Context + Goal assets
│   ├── *.md               → Context files (name, domain, description, status, tags, last_updated)
│   └── GOAL_*.md          → Goal files (name, domain, description, status, target_deadline, projects_related, last_updated)
├── 01_PROJECTS/           → Project assets
│   └── PROJECT_*.md
├── 02_PAGES/              → Page assets (reference material, frequently accessed)
├── 03_OUTPUT/             → AI-generated staging (review before promoting)
├── 04_SESSIONS/           → Session logs (least accessed)
└── 05_ARCHIVE/            → Deprecated/completed content
```

---

## Validation Rules

- Property order must match schemas above
- `status` values must use listed enums exactly
- `priority` values must use listed enums exactly
- `type` (Page) must use listed enum values exactly: concept | decision | reference | meeting | idea | note | belief | frame | lesson | model | goal | plan
- `origin` (Page) must use listed enum values exactly: braindump | ai-output | manual
- `status` (Page) must use listed enum values exactly: unprocessed | ready | processed
- `target_deadline` and `url` use `null` (not empty string) when absent
- `tags` and `projects_related` use `[]` (not null) when empty
- `favorite` is boolean (`true`/`false`, not quoted)
- Dates use ISO format: `YYYY-MM-DD`
- Extra fields injected by Obsidian (`created`, `updated` as ISO timestamps) are tolerated — do not remove them, they are managed by the editor
