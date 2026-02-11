---
title: PAL Domains System
version: 2.0.0
layer: SYSTEM
purpose: Configuration system and structure for project workspace domains
last_updated: 2026-02-07
---

# PAL Domains System

**The configuration system for PAL project workspace domains.**

---

## THIS IS THE AUTHORITATIVE SOURCE

This document defines the **required structure** for every domain in the PAL framework.

**ALL domain creation MUST follow this structure.**

If a domain does not follow this structure, it will not load correctly when accessed by Domain Agents.

---

## What Are Domains?

**Domains** = Project workspaces for organizing project-specific work, documentation, and context.

**Location:** `domains/[domain-name]/` at project root

**Purpose:** Provide structured, siloed environments for project work. Each domain contains its own index, projects, sessions, and assets.

**Key Characteristics:**

- **Context containers** — Domains are documentation and reference materials, not executable workflows
- **Agent-loaded** — Domains are loaded via Domain Agents, not auto-activated like skills
- **Siloed environments** — Each domain is isolated to prevent context pollution
- **Source of Truth** — The INDEX.md file serves as the single source of truth for the domain
- **Agent prerequisite** — Every domain agent must bind to an existing domain. No agents without domains.

---

## Naming Conventions (MANDATORY)

**Domain naming follows PAL's standard file naming conventions for consistency across the system.**

| Category             | Convention            | Example                | Purpose                                          |
| :------------------- | :-------------------- | :--------------------- | :----------------------------------------------- |
| **Domain directory** | `lower-kebab-case`    | `project-alpha/`       | Standard IDE navigation.                         |
| **INDEX.md**         | `UPPER_SNAKE_CASE.md` | `INDEX.md`             | Source of Truth file (at domain root).           |
| **CONNECTIONS.yaml** | `UPPER_SNAKE_CASE`    | `CONNECTIONS.yaml`     | External sources configuration (at domain root). |
| **Core folders**     | `NN_UPPER_CASE`       | `01_PROJECTS/`         | Numbered prefixes for sorting + visibility.      |
| **Context files**    | `lower_snake_case.md` | `background_info.md`   | Reference docs in 00_CONTEXT/.                   |
| **Project files**    | `UPPER_SNAKE_CASE.md` | `PROJECT_FEATURE_X.md` | Active project files in 01_PROJECTS/.            |
| **Session logs**     | `YYYY-MM-DD_title.md` | `2026-01-15_sync.md`   | Chronological session logs.                      |
| **Asset files**      | `lower_snake_case.md` | `api_documentation.md` | Reference materials and assets.                  |
| **Output files**     | Flexible              | Any naming             | Generated deliverables in 04_OUTPUTS/.           |

**Convention Rules:**

- **Domain directories:** Use `lower-kebab-case` for standard IDE navigation
- **INDEX.md and CONNECTIONS.yaml:** Always at domain root (not in a subdirectory)
- **Core folders:** Numbered prefix (00*, 01*, etc.) + UPPER_CASE for visibility and sorting
- **Context files:** Use `lower_snake_case` for reference docs and domain background
- **Project files:** Use `PROJECT_` prefix + UPPER_SNAKE_CASE for active work
- **Session logs:** Date prefix for chronological sorting
- **Assets:** Use `lower_snake_case` (active work convention)
- **Outputs:** Flexible naming — generated deliverables have no enforced pattern
- **Archive:** Preserve original filenames when moving to 05_ARCHIVE/

---

## Directory Structure

Every domain follows this structure:

```
domains/domain-name/              # lower-kebab-case directory name
├── INDEX.md                      # Source of Truth (at domain root)
├── CONNECTIONS.yaml              # External sources (at domain root)
├── 00_CONTEXT/                   # Domain-specific context and reference docs
│   ├── background_info.md        # Domain background and context
│   └── domain_rules.md          # Domain-specific rules or constraints
├── 01_PROJECTS/                  # Active project files
│   ├── PROJECT_FEATURE_X.md     # Active project for Feature X
│   └── PROJECT_MIGRATION.md     # Active project for migration work
├── 02_SESSIONS/                  # Chronological interaction logs
│   ├── 2026-01-15_kickoff.md    # Session log with date prefix
│   └── 2026-01-18_review.md    # Another session log
├── 03_ASSETS/                    # Raw documentation and reference materials
│   ├── api_documentation.md     # Reference material
│   ├── architecture_diagram.png # Visual assets
│   └── requirements.md         # Project requirements
├── 04_OUTPUTS/                   # Generated deliverables
│   └── quarterly_report.pdf     # Output files (flexible naming)
└── 05_ARCHIVE/                   # Deprecated content (Deprecation Pattern)
    └── PROJECT_OLD_FEATURE.md   # Archived project
```

**Core Components:**

| Component            | Purpose                                      | Location                              |
| -------------------- | -------------------------------------------- | ------------------------------------- |
| **INDEX.md**         | Source of Truth (overview, state, key facts) | Domain root                           |
| **CONNECTIONS.yaml** | External sources configuration               | Domain root                           |
| **00_CONTEXT/**      | Domain-specific context and reference docs   | Background info, rules, constraints   |
| **01_PROJECTS/**     | Active project documents                     | PROJECT_XXX.md files for ongoing work |
| **02_SESSIONS/**     | Interaction logs and decisions               | Date-prefixed session summaries       |
| **03_ASSETS/**       | Reference materials                          | Documentation, data, diagrams         |
| **04_OUTPUTS/**      | Generated deliverables                       | Reports, exports, generated files     |
| **05_ARCHIVE/**      | Deprecated content                           | Archived projects and old logs        |

**Nesting Limit:** Do not exceed three vertical levels below the domain root. Flatten deeper structures using semantic naming.

---

## INDEX.md Configuration

The INDEX.md file at the domain root serves as the **Source of Truth** for the domain.

### Structure

```markdown
---
name: domain-name
description: Brief description of what this domain covers.
status: active | paused | completed | archived
created: YYYY-MM-DD
updated: YYYY-MM-DD
owner: [Owner name or team]
---

# Domain Name

[Overview paragraph describing the domain's purpose and scope]

## Current State

[Summary of where the project currently stands]

## Key Facts

- **Fact 1:** [Important context]
- **Fact 2:** [Important context]
- **Fact 3:** [Important context]

## Active Work

| Project              | Status      | Last Updated |
| -------------------- | ----------- | ------------ |
| PROJECT_FEATURE_X.md | In Progress | YYYY-MM-DD   |
| PROJECT_MIGRATION.md | Blocked     | YYYY-MM-DD   |

## Quick Links

- [Context](00_CONTEXT/)
- [Projects](01_PROJECTS/)
- [Sessions](02_SESSIONS/)
- [Assets](03_ASSETS/)
- [Outputs](04_OUTPUTS/)
- [Archive](05_ARCHIVE/)
```

### YAML Frontmatter Fields

| Field         | Required | Description                                         |
| ------------- | -------- | --------------------------------------------------- |
| `name`        | Yes      | Domain name in lower-kebab-case                     |
| `description` | Yes      | Brief description of domain scope                   |
| `status`      | Yes      | Current status: active, paused, completed, archived |
| `created`     | Yes      | Creation date in YYYY-MM-DD format                  |
| `updated`     | Yes      | Last update date in YYYY-MM-DD format               |
| `owner`       | No       | Owner name or team responsible                      |

---

## CONNECTIONS.yaml Schema

The CONNECTIONS.yaml file defines external sources that inform this domain.

### Structure

```yaml
# External APIs this domain interacts with
apis:
  - name: stripe
    url: https://api.stripe.com
    docs: https://stripe.com/docs/api
    auth_type: api_key
    notes: Payment processing for subscriptions

  - name: github
    url: https://api.github.com
    docs: https://docs.github.com/en/rest
    auth_type: oauth
    notes: Repository management

# External documentation sources
documentation:
  - name: company-wiki
    url: https://wiki.company.com/project-alpha
    notes: Internal project documentation

  - name: vendor-docs
    url: https://vendor.com/docs
    notes: Third-party integration reference

# Data sources
data_sources:
  - name: analytics-db
    type: postgresql
    notes: Read-only access to analytics data

  - name: config-store
    type: redis
    notes: Feature flag configuration
```

### Schema Fields

| Section           | Field     | Description                                         |
| ----------------- | --------- | --------------------------------------------------- |
| **apis**          | name      | API identifier                                      |
|                   | url       | Base API URL                                        |
|                   | docs      | Documentation URL                                   |
|                   | auth_type | Authentication method (api_key, oauth, basic, none) |
|                   | notes     | Usage notes                                         |
| **documentation** | name      | Documentation source identifier                     |
|                   | url       | Documentation URL                                   |
|                   | notes     | What this documentation covers                      |
| **data_sources**  | name      | Data source identifier                              |
|                   | type      | Database or service type                            |
|                   | notes     | Access notes and purpose                            |

---

## Domain-Agent Relationship

Domains are accessed through **Domain Agents**. The workflow:

1. **User loads agent:** User invokes a Domain Agent (e.g., `/load-project-alpha-agent`)
2. **Agent has domain binding:** The agent's YAML frontmatter specifies which domain it binds to via the `domain:` field
3. **Context loading:** Agent loads Base Context (3 fixed REFs: ABOUTME, DIRECTIVES, GUARDRAILS) plus Domain Context (INDEX.md as AUTO, domain folders as REF)
4. **Work execution:** Agent operates with domain context, reading from assets and updating projects/sessions

### Agent Configuration Reference

In the agent's YAML frontmatter, domain binding is specified:

```yaml
---
name: project-alpha-agent
description: Domain agent for Project Alpha
version: 1.0.0
domain: project-alpha
---
```

**Key Points:**

- Agents bind to exactly one domain via the `domain:` field (mandatory)
- Domain must exist before agent creation — if it doesn't, create the domain first
- Agent capabilities (skills, workflows, prompts) are defined inline in the agent file (Section 5: My Capabilities)
- Domains don't auto-activate — they require agent loading
- Multiple agents can share access to the same domain

**See:** [AGENTS_LOGIC.md](AGENTS_LOGIC.md) for complete agent configuration and 8-section structure

---

## Context Files (00_CONTEXT/)

Context files provide domain-specific background, rules, and reference information that applies across the domain.

### Context File Structure

```markdown
---
name: [descriptive-name]
type: background | rules | reference | constraints
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# [Title]

[Content providing domain context, background information, rules, or reference material]
```

**Naming:** `lower_snake_case.md` (e.g., `background_info.md`, `domain_rules.md`)

**Use for:** Domain background, operating rules, constraints, reference information that informs work across the domain.

---

## Project Files (01_PROJECTS/)

Project files use a structured format for tracking active work.

### Project File Structure

```markdown
---
name: PROJECT_FEATURE_X
status: in_progress | blocked | completed | cancelled
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Project: Feature X

## Objective

[Clear statement of what this project achieves]

## Current Status

[Where we are in execution]

## Tasks

- [ ] Task 1
- [ ] Task 2
- [x] Completed task

## Blockers

[Any blocking issues]

## Next Steps

[Immediate next actions]
```

---

## Session Logs (02_SESSIONS/)

Session logs capture interaction history and decisions.

### Session Log Structure

```markdown
---
date: YYYY-MM-DD
participants: [Names or identifiers]
type: sync | review | planning | decision
---

# Session: [Title]

## Summary

[Brief overview of what was discussed/decided]

## Key Decisions

1. [Decision 1]
2. [Decision 2]

## Action Items

- [ ] @owner: Action item
- [ ] @owner: Another action item

## Notes

[Detailed notes if needed]
```

---

## Outputs (04_OUTPUTS/)

Output files are generated deliverables produced from domain work.

**Naming:** Flexible — no enforced naming convention. Use whatever naming makes sense for the deliverable type.

**Examples:** Reports, exports, generated documents, compiled assets, presentations.

**Note:** When outputs are no longer actively referenced, they can be archived to `05_ARCHIVE/`.

---

## Deprecation Pattern (05_ARCHIVE/)

When projects become stale, sessions are no longer relevant, or outputs are superseded:

1. Move the file to `05_ARCHIVE/`
2. Add a deprecation header at the top of the file
3. Update INDEX.md to remove from Active Work section (if applicable)
4. Preserve original filenames — do not rename archived files

```markdown
---
deprecated: YYYY-MM-DD
reason: Project completed | Superseded by PROJECT_NEW.md | No longer relevant | Cancelled
original_location:
  [00_CONTEXT/ | 01_PROJECTS/ | 02_SESSIONS/ | 03_ASSETS/ | 04_OUTPUTS/]
---

[Original content below]
```

---

## Complete Checklist

Before a domain is complete:

### Structure

- [ ] Domain directory uses lower-kebab-case
- [ ] INDEX.md exists at domain root
- [ ] CONNECTIONS.yaml exists at domain root (can be empty if no external sources)
- [ ] All six core folders exist (00_CONTEXT, 01_PROJECTS, 02_SESSIONS, 03_ASSETS, 04_OUTPUTS, 05_ARCHIVE)
- [ ] No nesting beyond three levels

### INDEX.md

- [ ] Contains proper YAML frontmatter (name, description, status, created, updated)
- [ ] Contains Source of Truth content (Current State, Key Facts, Active Work, Quick Links)
- [ ] Active Work table tracks projects from 01_PROJECTS/
- [ ] Quick Links reference all six folders

### Naming

- [ ] Core folders use NN_UPPER_CASE format
- [ ] Context files use lower_snake_case.md format
- [ ] Project files use PROJECT_XXX.md format
- [ ] Session logs use YYYY-MM-DD_title.md format
- [ ] Asset files use lower_snake_case
- [ ] Output files use flexible naming (no enforcement)
- [ ] Archive files preserve original names

### Agent Integration

- [ ] At least one Domain Agent configured to bind to this domain
- [ ] Agent's `domain:` field matches this domain's directory name

---

## Summary

| Component            | Purpose                      | Location / Naming                         |
| :------------------- | :--------------------------- | :---------------------------------------- |
| **Domain directory** | Contains all domain files    | lower-kebab-case (e.g., `project-alpha/`) |
| **INDEX.md**         | Source of Truth              | Domain root                               |
| **CONNECTIONS.yaml** | External sources config      | Domain root                               |
| **00_CONTEXT/**      | Domain context and reference | lower_snake_case.md files                 |
| **01_PROJECTS/**     | Active project documents     | PROJECT_XXX.md files                      |
| **02_SESSIONS/**     | Interaction logs             | YYYY-MM-DD_title.md files                 |
| **03_ASSETS/**       | Reference materials          | lower_snake_case files                    |
| **04_OUTPUTS/**      | Generated deliverables       | Flexible naming                           |
| **05_ARCHIVE/**      | Deprecated content           | Preserved original filenames              |

This system ensures:

1. Domains provide structured project workspaces
2. Context is siloed to prevent pollution
3. Domain Agents can reliably load and use domain context
4. Every domain agent binds to an existing domain
5. **All naming follows PAL's standard conventions**

---

**Document Version:** 2.0.0
**Last Updated:** 2026-02-07
**Related Files:** ARCHITECTURE.md, ORCHESTRATION.md, AGENTS_LOGIC.md, WORKFLOWS.md, MEMORY_LOGIC.md, TOOLBOX.md, SKILL_LOGIC.md

---
