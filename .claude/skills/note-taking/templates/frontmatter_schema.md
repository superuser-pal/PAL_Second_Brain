# Note Frontmatter Schema

This document defines the YAML frontmatter schema for notes managed by the note-taking skill.

## Complete Schema

```yaml
---
status: unprocessed
domain: null
project: null
category: notes
type: note
subsection: null
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
| `domain` | string\|null | Target domain name | `ProjectAlpha` |
| `category` | enum | Note category | `research` |
| `type` | enum | Entity type | `concept` |
| `created` | date | Creation date | `2026-02-11` |
| `last_modified` | date | Last modification | `2026-02-11` |

## Status Values

| Status | Meaning | Location |
|--------|---------|----------|
| `unprocessed` | Needs domain/project assignment | inbox/notes/ |
| `draft` | Partial processing (no agent context) | inbox/notes/ |
| `ready` | Ready for distribution | inbox/notes/ |
| `processed` | Distributed to domain | domains/*/03_ASSETS/ |
| `archived` | Moved to archive | domains/*/05_ARCHIVE/ |

## Entity Type Values

| Type | Purpose | Template Sections |
|------|---------|-------------------|
| `concept` | Knowledge artifact | Definition, Context, Key Points, Examples |
| `decision` | Recorded choice | Context, Options, Decision, Rationale, Consequences |
| `reference` | External resource | Source, Summary, Key Quotes, Relevance |
| `meeting` | Interaction record | Meeting Info, Discussion, Decisions, Action Items |
| `braindump` | Stream of thought | Raw Thoughts, Analysis, Themes |
| `idea` | Early-stage concept | Core Idea, Inspiration, Potential, Questions |
| `note` | Generic note (default) | Title, Content, Tags |

**See:** `templates/entity_types.md` for full template structures

## Category Values

### LifeOS Categories (auto-route to LifeOS domain)

| Category | Use For | LifeOS Location |
|----------|---------|-----------------|
| `beliefs.md` | Core beliefs, values, worldview | 00_CONTEXT/ |
| `frames.md` | Mental perspectives, lenses | 00_CONTEXT/ |
| `learned.md` | Lessons, insights, realizations | 00_CONTEXT/ |
| `mission.md` | Purpose, life direction | 00_CONTEXT/ |
| `models.md` | Decision frameworks | 00_CONTEXT/ |
| `goals.md` | Objectives, aspirations | 01_PROJECTS/ |
| `projects.md` | Active initiatives | 01_PROJECTS/ |

### General Categories

| Category | Use For |
|----------|---------|
| `research` | Research notes, findings, analysis |
| `meeting` | Meeting notes, action items |
| `idea` | Ideas, brainstorming, concepts |
| `reference` | Reference materials, documentation |
| `notes` | General notes (default) |

### Category Routing Logic

- **LifeOS categories** (ending in `.md`): Content is appended to the target file in LifeOS domain, original note moved to `03_ASSETS/`
- **General categories**: Note file is moved to `domains/[domain]/03_ASSETS/`

## Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `project` | string\|null | Linked PROJECT_*.md file |
| `subsection` | string\|null | Target subsection for smart insertion |
| `source_type` | enum | How note was created |
| `source_file` | string\|null | Original filename |
| `source_url` | string\|null | Source URL |
| `tags` | array | Categorization tags |

## URL Capture Fields

**Used when `source_type` is `url-article` or `url-tool`:**

| Field | Type | Description |
|-------|------|-------------|
| `url_domain` | string | Source domain (e.g., "example.com") |
| `url_author` | string\|null | Author if detected |
| `url_published` | date\|null | Publication date if detected |
| `url_read_time` | string\|null | Estimated read time (e.g., "5 minutes") |
| `content_type` | enum | article\|tool\|video\|reference\|research |
| `relevance` | enum | high\|medium\|low |

**Tool-specific fields (when `content_type: tool`):**

| Field | Type | Description |
|-------|------|-------------|
| `pricing` | enum | free\|freemium\|paid\|enterprise |
| `eval_status` | enum | to-evaluate\|evaluated\|in-use\|passed |

### URL Capture Example

```yaml
---
status: "ready"
domain: null
project: null
category: "reference"
subsection: null
created: "2026-02-16"
last_modified: "2026-02-16"
source_type: "url-tool"
source_file: null
source_url: "https://github.com/example/tool"
tags: ["url-capture", "tool", "automation"]
url_domain: "github.com"
url_author: null
url_published: null
url_read_time: null
content_type: "tool"
relevance: "high"
pricing: "free"
eval_status: "to-evaluate"
---
```

## Source Type Values

| Type | Description |
|------|-------------|
| `manual` | Created manually |
| `braindump` | Captured via braindump workflow |
| `pdf` | Ingested from PDF |
| `docx` | Ingested from Word document |
| `txt` | Ingested from text file |
| `web` | Captured from web |
| `url-article` | URL capture - article/blog/content |
| `url-tool` | URL capture - tool/software/utility |

## Domain Field Rules

- Must be `PascalCase`
- Must match existing domain in `domains/`
- Set to `null` for domain-agnostic notes
- Set to `_unassigned` for notes processed in blind mode (no agent)
- Validated during `distribute_notes` workflow

### Valid Domains

| Domain | Folder Name | Purpose |
|--------|-------------|---------|
| LifeOS | `LifeOS` | Personal life context (beliefs, goals, projects) |
| PALBuilder | `PALBuilder` | PAL system development, specs, architecture |
| Studio | `Studio` | Video production, presentations, visual content |
| PALOpenSource | `PALOpenSource` | Release management, public distribution |
| PALProduct | `PALProduct` | Product strategy, roadmap, user research |
| LaraLou | `LaraLou (Blog)` | Substack content, newsletter, growth |

### Domain Detection

The `braindump` workflow auto-detects domains using pattern matching:

1. Patterns defined in `templates/domain_patterns.md`
2. Confidence scoring: Primary (40%) + Secondary (25% x2) = max 90%
3. Threshold: >= 60% triggers suggestion

**When multiple domains match (>= 70% each):** User chooses primary destination.

**See:** `templates/domain_patterns.md` for full pattern definitions

## Project Field Rules

- Must match file in `domains/[domain]/01_PROJECTS/`
- Format: `PROJECT_NAME.md` (include extension)
- Set to `null` if not project-specific
- When set, `distribute_notes` adds reference link to project

## Subsection Field Rules

- Used for smart insertion into LifeOS files
- Set by braindump workflow based on content analysis
- When set, distribute_notes inserts content under the `## [subsection]` heading
- If null or heading not found, content appends at end of file

| Category | Valid Subsections |
|----------|-------------------|
| beliefs.md | Worldview, Values, Convictions |
| mission.md | Purpose, Vision, Direction |
| frames.md | Mental Lenses, Perspectives |
| models.md | Decision Frameworks, Heuristics |
| learned.md | Insights, Realizations, Lessons |
| goals.md | Short-term, Medium-term, Long-term |
| projects.md | Active, Planned, On Hold |

## Tags Field Rules

- Array of strings
- Use lowercase, hyphenated tags
- Example: `["api", "backend", "authentication"]`

---

## Observation Syntax

Notes can contain structured observations using this syntax:

```markdown
- [category] content #tag1 #tag2
```

**Valid Categories:** fact, idea, decision, technique, requirement, question, insight, problem, solution, action

**See:** `templates/observation_categories.md` for full documentation

---

## Relation Syntax

Notes can link to other notes using Obsidian wikilinks:

```markdown
## Relations

- supports [[Target Note]]
- contradicts [[Another Note]]
- evolved_from [[Original Idea]]
```

**Valid Relation Types:** part_of, supports, contradicts, evolved_from, informs, blocks, inspired_by, relates_to, originated_with, follows

**Rules:**
- Max 5 relations per note
- Forward references allowed (links to notes that don't exist yet)
- Uses Obsidian wikilink syntax for graph view compatibility

**See:** `templates/relation_types.md` for full documentation
