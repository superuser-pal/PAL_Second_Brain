---
title: PAL Domains System
version: 0.1.0
layer: SYSTEM
purpose: Configuration system and structure for project workspace domains
last_updated: 2026-01-18
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

**Purpose:** Provide structured, siloed environments for project work. Each domain contains its own index, plans, sessions, and assets.

**Key Characteristics:**

- **Context containers** - Domains are documentation and reference materials, not executable workflows
- **Agent-loaded** - Domains are loaded via Domain Agents, not auto-activated like skills
- **Siloed environments** - Each domain is isolated to prevent context pollution
- **Source of Truth** - The INDEX.md file serves as the single source of truth for the domain

---

## Naming Conventions (MANDATORY)

**Domain naming follows PAL's standard file naming conventions for consistency across the system.**

| Category             | Convention            | Example                  | Purpose                                      |
| :------------------- | :-------------------- | :----------------------- | :------------------------------------------- |
| **Domain directory** | `lower-kebab-case`    | `project-alpha/`         | Standard IDE navigation.                     |
| **INDEX.md**         | `UPPER_SNAKE_CASE.md` | `INDEX.md`               | Source of Truth file (at domain root).       |
| **CONNECTIONS.yaml** | `UPPER_SNAKE_CASE`    | `CONNECTIONS.yaml`       | External sources configuration (at domain root). |
| **Core folders**     | `NN_UPPER_CASE`       | `01_PLANS/`              | Numbered prefixes for sorting + visibility.  |
| **Plan files**       | `UPPER_SNAKE_CASE.md` | `PLAN_FEATURE_X.md`      | Active plan files in 01_PLANS/.              |
| **Session logs**     | `YYYY-MM-DD_title.md` | `2026-01-15_sync.md`     | Chronological session logs.                  |
| **Asset files**      | `lower_snake_case.md` | `api_documentation.md`   | Reference materials and assets.              |

**Convention Rules:**

- **Domain directories:** Use `lower-kebab-case` for standard IDE navigation
- **INDEX.md and CONNECTIONS.yaml:** Always at domain root (not in a subdirectory)
- **Core folders:** Numbered prefix (01_, 02_, etc.) + UPPER_CASE for visibility and sorting
- **Session logs:** Date prefix for chronological sorting
- **Assets:** Use `lower_snake_case` (active work convention)

---

## Directory Structure

Every domain follows this structure:

```
domains/domain-name/              # lower-kebab-case directory name
├── INDEX.md                      # Source of Truth (at domain root)
├── CONNECTIONS.yaml              # External sources (at domain root)
├── 01_PLANS/                     # Active plan files
│   ├── PLAN_FEATURE_X.md         # Active plan for Feature X
│   └── PLAN_MIGRATION.md         # Active plan for migration work
├── 02_SESSIONS/                  # Chronological interaction logs
│   ├── 2026-01-15_kickoff.md     # Session log with date prefix
│   └── 2026-01-18_review.md      # Another session log
├── 03_ASSETS/                    # Raw documentation and reference materials
│   ├── api_documentation.md      # Reference material
│   ├── architecture_diagram.png  # Visual assets
│   └── requirements.md           # Project requirements
└── 05_ARCHIVE/                   # Stale plans and old logs (Deprecation Pattern)
    └── PLAN_OLD_FEATURE.md       # Archived plan
```

**Core Components:**

| Component | Purpose | Location |
|-----------|---------|----------|
| **INDEX.md** | Source of Truth (overview, state, key facts) | Domain root |
| **CONNECTIONS.yaml** | External sources configuration | Domain root |
| **01_PLANS/** | Active planning documents | PLAN_XXX.md files for ongoing work |
| **02_SESSIONS/** | Interaction logs and decisions | Date-prefixed session summaries |
| **03_ASSETS/** | Reference materials | Documentation, data, diagrams |
| **05_ARCHIVE/** | Deprecated content | Stale plans and old logs |

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

| Plan | Status | Last Updated |
|------|--------|--------------|
| PLAN_FEATURE_X.md | In Progress | YYYY-MM-DD |
| PLAN_MIGRATION.md | Blocked | YYYY-MM-DD |

## Quick Links

- [Architecture](03_ASSETS/architecture.md)
- [API Documentation](03_ASSETS/api_documentation.md)
```

### YAML Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Domain name in lower-kebab-case |
| `description` | Yes | Brief description of domain scope |
| `status` | Yes | Current status: active, paused, completed, archived |
| `created` | Yes | Creation date in YYYY-MM-DD format |
| `updated` | Yes | Last update date in YYYY-MM-DD format |
| `owner` | No | Owner name or team responsible |

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

| Section | Field | Description |
|---------|-------|-------------|
| **apis** | name | API identifier |
| | url | Base API URL |
| | docs | Documentation URL |
| | auth_type | Authentication method (api_key, oauth, basic, none) |
| | notes | Usage notes |
| **documentation** | name | Documentation source identifier |
| | url | Documentation URL |
| | notes | What this documentation covers |
| **data_sources** | name | Data source identifier |
| | type | Database or service type |
| | notes | Access notes and purpose |

---

## Domain-Agent Relationship

Domains are accessed through **Domain Agents**. The workflow:

1. **User loads agent:** User invokes a Domain Agent (e.g., `/load-project-alpha-agent`)
2. **Agent has domain expertise:** The agent's configuration specifies which domain(s) it can access
3. **Context loading:** Agent loads the domain's INDEX.md and relevant context as defined in its configuration
4. **Work execution:** Agent operates with domain context, reading from assets and updating plans/sessions

### Agent Configuration Reference

In the agent's configuration file, domain access is specified:

```yaml
---
name: project-alpha-agent
domain: project-alpha
context_files:
  - INDEX.md
  - 03_ASSETS/architecture.md
---
```

**Key Points:**

- Agents define which domain they have expertise in
- Agents specify which context files to load on initialization (INDEX.md at domain root)
- Domains don't auto-activate - they require agent loading
- Multiple agents can share access to the same domain

**See:** [AGENTS_LOGIC.md](AGENTS_LOGIC.md) for complete agent configuration

---

## Plan Files (01_PLANS/)

Plan files use the Planning Pattern for structured project work.

### Plan File Structure

```markdown
---
name: PLAN_FEATURE_X
status: in_progress | blocked | completed | cancelled
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Plan: Feature X

## Objective

[Clear statement of what this plan achieves]

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

## Deprecation Pattern (05_ARCHIVE/)

When plans become stale or sessions are no longer relevant:

1. Move the file to `05_ARCHIVE/`
2. Add a deprecation note at the top of the file
3. Update INDEX.md to remove from Active Work section

```markdown
---
deprecated: YYYY-MM-DD
reason: Feature cancelled | Superseded by PLAN_NEW.md | No longer relevant
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
- [ ] All four core folders exist (01_PLANS, 02_SESSIONS, 03_ASSETS, 05_ARCHIVE)
- [ ] No nesting beyond three levels

### INDEX.md
- [ ] Contains proper YAML frontmatter (name, description, status, created, updated)
- [ ] Contains Source of Truth content (Current State, Key Facts, Active Work)

### Naming
- [ ] Core folders use NN_UPPER_CASE format
- [ ] Plan files use PLAN_XXX.md format
- [ ] Session logs use YYYY-MM-DD_title.md format
- [ ] Asset files use lower_snake_case

### Agent Integration
- [ ] At least one Domain Agent configured to access this domain
- [ ] Agent configuration specifies context files to load

---

## Summary

| Component           | Purpose                        | Location / Naming                            |
| :------------------ | :----------------------------- | :------------------------------------------- |
| **Domain directory**| Contains all domain files      | lower-kebab-case (e.g., `project-alpha/`)    |
| **INDEX.md**        | Source of Truth                | Domain root                                  |
| **CONNECTIONS.yaml**| External sources config        | Domain root                                  |
| **01_PLANS/**       | Active planning documents      | PLAN_XXX.md files                            |
| **02_SESSIONS/**    | Interaction logs               | YYYY-MM-DD_title.md files                    |
| **03_ASSETS/**      | Reference materials            | lower_snake_case files                       |
| **05_ARCHIVE/**     | Deprecated content             | Moved stale plans and logs                   |

This system ensures:

1. Domains provide structured project workspaces
2. Context is siloed to prevent pollution
3. Domain Agents can reliably load and use domain context
4. **All naming follows PAL's standard conventions**

---

**Document Version:** 0.1.0
**Last Updated:** 2026-01-18
**Related Files:** ARCHITECTURE.md, ORCHESTRATION.md, AGENTS_LOGIC.md, WORKFLOWS.md, MEMORY_LOGIC.md, TOOLBOX.md, SKILL_LOGIC.md

---
