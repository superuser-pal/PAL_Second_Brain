---
name: create-domain
description: Create and validate PAL domains (project workspaces). USE WHEN create domain, new domain, domain structure, validate domain, map domain, sync domain, archive domain, project workspace, housekeeping. SkillSearch('create-domain') for docs.
---

# create-domain

MANDATORY domain creation framework for ALL domain creation requests.

## Authoritative Source

**Before creating ANY domain, READ:** `DOMAINS_LOGIC.md`

## Naming Conventions (MANDATORY)

**Domain naming follows PAL's standard file naming conventions.**

| Category             | Convention            | Example                  | Purpose                                      |
| :------------------- | :-------------------- | :----------------------- | :------------------------------------------- |
| **Domain directory** | `lower-kebab-case`    | `project-alpha/`         | Standard IDE navigation.                     |
| **INDEX.md**         | `UPPER_SNAKE_CASE.md` | `INDEX.md`               | Source of Truth file (at domain root).       |
| **CONNECTIONS.yaml** | `UPPER_SNAKE_CASE`    | `CONNECTIONS.yaml`       | External sources configuration.              |
| **Core folders**     | `NN_UPPER_CASE`       | `01_PLANS/`              | Numbered prefixes for sorting + visibility.  |
| **Plan files**       | `UPPER_SNAKE_CASE.md` | `PLAN_FEATURE_X.md`      | Active plan files in 01_PLANS/.              |
| **Session logs**     | `YYYY-MM-DD_title.md` | `2026-01-15_sync.md`     | Chronological session logs.                  |
| **Asset files**      | `lower_snake_case.md` | `api_documentation.md`   | Reference materials and assets.              |

---

## Workflow Routing

| Workflow             | Trigger                                | File                              |
| :------------------- | :------------------------------------- | :-------------------------------- |
| **create_domain**    | "create domain", "new domain"          | `workflows/create_domain.md`      |
| **validate_domain**  | "validate domain", "check domain"      | `workflows/validate_domain.md`    |
| **map_domain**       | "map domain", "sync domain", "housekeeping", "update index" | `workflows/map_domain.md` |
| **archive_domain**   | "archive domain", "deprecate domain"   | `workflows/archive_domain.md`     |

## Examples

**Example 1: Create a new domain from scratch**

```
User: "Create a domain for my blog project"
-> Invokes create_domain workflow
-> Reads DOMAINS_LOGIC.md for structure requirements
-> Creates domains/blog-project/ with all required folders
-> Generates INDEX.md with YAML frontmatter and template
-> Creates empty CONNECTIONS.yaml with schema comments
```

**Example 2: Sync domain after adding files**

```
User: "Map my project-alpha domain"
-> Invokes map_domain workflow
-> Scans 01_PLANS/, 02_SESSIONS/, 03_ASSETS/
-> Detects naming violations, auto-fixes with confirmation
-> Refreshes INDEX.md Active Work table
-> Reports summary of changes
```

**Example 3: Archive old content**

```
User: "Archive the old feature plan in my project domain"
-> Invokes archive_domain workflow
-> Moves file to 05_ARCHIVE/ with deprecation header
-> Updates INDEX.md to remove from Active Work
-> Confirms archive complete
```

## Domain Structure

Every domain follows this structure:

```
domains/domain-name/              # lower-kebab-case directory
├── INDEX.md                      # Source of Truth (at domain root)
├── CONNECTIONS.yaml              # External sources (at domain root)
├── 01_PLANS/                     # Active plan files
├── 02_SESSIONS/                  # Chronological interaction logs
├── 03_ASSETS/                    # Reference materials
└── 05_ARCHIVE/                   # Deprecated content
```

**Nesting Limit:** Do not exceed three vertical levels below the domain root.
