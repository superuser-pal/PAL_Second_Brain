# create_domain Workflow

Create a new PAL domain following the canonical structure from DOMAINS_LOGIC.md.

## Step 1: Read the Authoritative Source

**REQUIRED FIRST:**

Read the domain system documentation: `DOMAINS_LOGIC.md`

## Step 2: Gather Requirements

Ask the user:

1. What is the domain name? (will be converted to PascalCase)
2. Brief description of the domain's purpose
3. Who owns this domain? (optional)

## Step 3: Validate Domain Name

Convert user input to `PascalCase`:

| User Input        | Converted Name    |
| ----------------- | ----------------- |
| "Project Alpha"   | `ProjectAlpha`    |
| "My Blog Project" | `MyBlogProject`   |
| "API_Integration" | `ApiIntegration`  |

## Step 3.5: Determine Destination Repository

Ask user:
> "Where should this domain be created?"
> 1. **Personal** - `Domains/` (main repo - private project)
> 2. **Open Source** - `Domains/PALOpenSource/Domains/` (template domain)

Based on answer, set base path:
- **Personal:** `Domains/[DomainName]/`
- **Open Source:** `Domains/PALOpenSource/Domains/[DomainName]/`

After creation, update `.claude/core/reference/REPO_ROUTING.md` domains section with the new entry.

## Step 4: Create Directory Structure

```bash
mkdir -p {base_path}/00_CONTEXT
mkdir -p {base_path}/01_PROJECTS
mkdir -p {base_path}/02_SESSIONS
mkdir -p {base_path}/03_PAGES
mkdir -p {base_path}/04_OUTPUT
mkdir -p {base_path}/05_ARCHIVE
```

**Example (Personal):**

```bash
mkdir -p Domains/[DomainName]/00_CONTEXT
# ... etc
```

**Example (Open Source):**

```bash
mkdir -p Domains/PALOpenSource/Domains/[DomainName]/00_CONTEXT
# ... etc
```

## Step 5: Create README.md Files

Create README.md in each core folder from templates:

```bash
cp .claude/skills/create-domain/templates/README.00_CONTEXT.template.md domains/[DomainName]/00_CONTEXT/README.md
cp .claude/skills/create-domain/templates/README.01_PROJECTS.template.md domains/[DomainName]/01_PROJECTS/README.md
cp .claude/skills/create-domain/templates/README.02_SESSIONS.template.md domains/[DomainName]/02_SESSIONS/README.md
cp .claude/skills/create-domain/templates/README.03_PAGES.template.md domains/[DomainName]/03_PAGES/README.md
cp .claude/skills/create-domain/templates/README.04_OUTPUT.template.md domains/[DomainName]/04_OUTPUT/README.md
cp .claude/skills/create-domain/templates/README.05_ARCHIVE.template.md domains/[DomainName]/05_ARCHIVE/README.md
```

Each README documents the folder's purpose, naming conventions, and usage guidelines.

## Step 5.5: Create Ad-Hoc Tasks Project

Create `domains/[DomainName]/01_PROJECTS/AD_HOC_TASKS.md` to capture standalone tasks for this domain.

```yaml
---
name: AD_HOC_TASKS
status: active
priority: medium
domain: [DomainName]
created: [YYYY-MM-DD]
last_modified: [YYYY-MM-DD]
due_date: null
owner: null
tags: ["ad-hoc", "tasks"]
---

# Project: Ad-Hoc Tasks

## Objective

A centralized collection of standalone, ad-hoc tasks for the [DomainName] domain that do not belong to a specific larger project.

## Tasks

### Open

### In Progress

### Done

## Notes

## References
```

## Step 6: Create INDEX.md

Create `domains/[DomainName]/INDEX.md` with this template:

```markdown
---
name: [DomainName]
description: [User's description]
status: active
created: [YYYY-MM-DD]
updated: [YYYY-MM-DD]
owner: [Owner if provided]
---

# [Domain Name Title Case]

[User's description expanded into overview paragraph]

## Current State

[Initial state - typically "Domain created. Ready for planning."]

## Key Facts

- **Created:** [Date]
- **Purpose:** [Brief purpose]
- **Status:** Active

## Active Work

| Project                  | Status | Last Updated |
| ------------------------ | ------ | ------------ |
| _No active projects yet_ | -      | -            |

## Quick Links

- [Context](00_CONTEXT/)
- [Projects](01_PROJECTS/)
- [Sessions](02_SESSIONS/)
- [Assets](03_PAGES/)
- [Outputs](04_OUTPUT/)
- [Archive](05_ARCHIVE/)
```

## Step 7: Create CONNECTIONS.yaml

Create `domains/[DomainName]/CONNECTIONS.yaml` with schema template:

```yaml
# External APIs this domain interacts with
apis: []
  # - name: api-name
  #   url: https://api.example.com
  #   docs: https://docs.example.com
  #   auth_type: api_key | oauth | basic | none
  #   notes: Usage notes

# External documentation sources
documentation: []
  # - name: doc-name
  #   url: https://docs.example.com
  #   notes: What this covers

# Data sources
data_sources: []
  # - name: source-name
  #   type: postgresql | redis | etc
  #   notes: Access notes
```

## Step 8: Verify Structure

Run verification:

```bash
ls -la domains/[DomainName]/
ls domains/[DomainName]/*/README.md
```

Expected output:

- `INDEX.md`
- `CONNECTIONS.yaml`
  - `00_CONTEXT/` (with README.md)
- `01_PROJECTS/` (with README.md and AD_HOC_TASKS.md)
- `02_SESSIONS/` (with README.md)
- `03_PAGES/` (with README.md)
- `04_OUTPUT/` (with README.md)
- `05_ARCHIVE/` (with README.md)

## Step 8.5: Check for Domain Agent

Ask the user:

> "Does this domain need a domain agent?"
> 1. **Yes** — Create a new domain agent now
> 2. **No** — Skip agent creation

**If Yes:**

Invoke the `create_agent` workflow:

- Location: `.claude/skills/create-agent/workflows/create_agent.md`
- The domain name from Step 3 is the binding domain — pass it forward as the `domain:` field
- Wait for agent creation to complete before continuing

**If No:** Proceed to Step 9.

## Step 9: Update CLAUDE.md Active Domains Table

Update `.claude/CLAUDE.md` — add a new row to the **Active Domains** table under `### Active Domains`:

```markdown
| [DomainName] | [agent-name or —] | [Brief purpose] |
```

- If an agent was created in Step 8.5: use its `name` field (lower-kebab-case)
- If no agent was created: use `—` as placeholder
- Derive purpose from the description provided in Step 2

After editing, verify the table renders correctly with consistent column alignment.

## Step 10: Final Checklist

### Structure

- [ ] Domain directory uses PascalCase
- [ ] INDEX.md exists at domain root
- [ ] CONNECTIONS.yaml exists at domain root
- [ ] All six core folders exist (00_CONTEXT, 01_PROJECTS, 02_SESSIONS, 03_PAGES, 04_OUTPUT, 05_ARCHIVE)
- [ ] `01_PROJECTS/AD_HOC_TASKS.md` exists

### INDEX.md

- [ ] Contains proper YAML frontmatter (name, description, status, created, updated)
- [ ] Contains template sections (Current State, Key Facts, Active Work, Quick Links)
- [ ] Active Work table references Projects (not Plans)
- [ ] Quick Links reference all six folders

### Naming

- [ ] Core folders use NN_UPPER_CASE format (01_PROJECTS, not projects)

### README Files

- [ ] 00_CONTEXT/README.md exists
- [ ] 01_PROJECTS/README.md exists
- [ ] 02_SESSIONS/README.md exists
- [ ] 03_PAGES/README.md exists
- [ ] 04_OUTPUT/README.md exists
- [ ] 05_ARCHIVE/README.md exists

### Domain Agent

- [ ] Domain agent created (or `—` noted intentionally in CLAUDE.md)

### CLAUDE.md

- [ ] Active Domains table updated with new domain row

## Done

Domain created following canonical structure. Ready for use with Domain Agents.

**Next Steps:**

1. Add context and reference docs to `00_CONTEXT/`
2. Add project files to `01_PROJECTS/` as needed
3. Log sessions in `02_SESSIONS/`
4. Store reference materials in `03_PAGES/`
