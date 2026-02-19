# map_domain Workflow

End-of-session housekeeping: scan domain for changes, enforce naming conventions, synchronize INDEX.md, and regenerate the system-wide capability index.

## Step 1: Identify Target Domain

Ask the user which domain to map, or detect from context.

```bash
ls domains/
```

## Step 2: Scan Domain Folders

Scan all six content folders for files:

```bash
ls domains/[DomainName]/00_CONTEXT/
ls domains/[DomainName]/01_PROJECTS/
ls domains/[DomainName]/02_SESSIONS/
ls domains/[DomainName]/03_ASSETS/
ls domains/[DomainName]/04_OUTPUTS/
ls domains/[DomainName]/05_ARCHIVE/
```

## Step 2.5: Check README Files

Verify README.md exists in each core folder:

```bash
ls domains/[DomainName]/00_CONTEXT/README.md
ls domains/[DomainName]/01_PROJECTS/README.md
ls domains/[DomainName]/02_SESSIONS/README.md
ls domains/[DomainName]/03_ASSETS/README.md
ls domains/[DomainName]/04_OUTPUTS/README.md
ls domains/[DomainName]/05_ARCHIVE/README.md
```

**If any README is missing:**

1. Report which folders are missing README files
2. Offer to create them from templates:
   ```bash
   cp .claude/skills/create-domain/templates/README.00_CONTEXT.template.md domains/[DomainName]/00_CONTEXT/README.md
   cp .claude/skills/create-domain/templates/README.01_PROJECTS.template.md domains/[DomainName]/01_PROJECTS/README.md
   cp .claude/skills/create-domain/templates/README.02_SESSIONS.template.md domains/[DomainName]/02_SESSIONS/README.md
   cp .claude/skills/create-domain/templates/README.03_ASSETS.template.md domains/[DomainName]/03_ASSETS/README.md
   cp .claude/skills/create-domain/templates/README.04_OUTPUTS.template.md domains/[DomainName]/04_OUTPUTS/README.md
   cp .claude/skills/create-domain/templates/README.05_ARCHIVE.template.md domains/[DomainName]/05_ARCHIVE/README.md
   ```
3. Continue with workflow after user confirms

## Step 3: Check Naming Conventions

For each file found, check against expected format:

| Location | Expected Format | Violation Example | Auto-Fix To |
|----------|-----------------|-------------------|-------------|
| 00_CONTEXT/ | `lower_snake_case.md` | `MyContext.md` | `my_context.md` |
| 01_PROJECTS/ | `PROJECT_XXX.md` | `feature_x.md` | `PROJECT_FEATURE_X.md` |
| 02_SESSIONS/ | `YYYY-MM-DD_title.md` | `meeting_notes.md` | `[TODAY]_meeting_notes.md` |
| 03_ASSETS/ | `lower_snake_case.md` | `MyDoc.md` | `my_doc.md` |
| 04_OUTPUTS/ | Flexible (no enforcement) | — | — |
| 05_ARCHIVE/ | Preserve original name | — | — |

### Auto-Fix Rules

**Context (00_CONTEXT/):**
- Must be lower_snake_case
- Fix: `DomainRules.md` → `domain_rules.md`
- Fix: `Background-Info.md` → `background_info.md`

**Projects (01_PROJECTS/):**
- Must start with `PROJECT_`
- Must be UPPER_SNAKE_CASE
- Fix: `feature_x.md` → `PROJECT_FEATURE_X.md`
- Fix: `project_feature.md` → `PROJECT_FEATURE.md`

**Sessions (02_SESSIONS/):**
- Must start with date `YYYY-MM-DD_`
- Rest is lower_snake_case
- Fix: `meeting.md` → `[TODAY]_meeting.md`
- Fix: `2026-01-18-notes.md` → `2026-01-18_notes.md`

**Assets (03_ASSETS/):**
- Must be lower_snake_case
- Fix: `MyDocument.md` → `my_document.md`
- Fix: `API-Reference.md` → `api_reference.md`

**Outputs (04_OUTPUTS/):**
- No naming enforcement. Skip during convention checks.

**Archive (05_ARCHIVE/):**
- Preserve original filenames. Do not rename archived files.

## Step 4: Apply Fixes (With Confirmation)

For each violation found:

1. Show the proposed rename
2. Ask user to confirm (or confirm all at once)
3. Execute rename:

```bash
mv domains/[domain]/[folder]/[old_name] domains/[domain]/[folder]/[new_name]
```

## Step 5: Update INDEX.md

### 5a. Refresh Active Work Table

Scan 01_PROJECTS/ and rebuild the Active Work table:

```markdown
## Active Work

| Project | Status | Last Updated |
|---------|--------|--------------|
| PROJECT_FEATURE_X.md | In Progress | 2026-01-18 |
| PROJECT_MIGRATION.md | Blocked | 2026-01-15 |
```

**Status Detection:**
- Read each project's YAML frontmatter for `status:` field
- If no status field, default to "Unknown"

### 5b. Update Metadata

Update INDEX.md YAML frontmatter:
- Set `updated:` to today's date

### 5c. Update Key Facts (Optional)

If significant changes detected (new projects, many new assets), offer to update Key Facts section.

## Step 6: Validate Routing Table

Check that the domain's agent is properly registered in `PAL_Base/System/ROUTING_TABLE.md`.

### 6a. Identify Domain Agent

```bash
# Find which agent binds to this domain
grep -l "domain: [DomainName]" .claude/agents/*.md
```

### 6b. Verify Routing Entry

Check `ROUTING_TABLE.md` for a matching entry:
- `name` matches the agent filename
- `domain` matches the domain being mapped
- `location` points to the correct agent file

### 6c. Report Issues

- If agent exists but routing entry is missing → flag for user to add
- If routing entry exists but agent file is missing → flag as orphaned entry
- If no agent binds to this domain → note (domain without agent is valid but worth flagging)

## Step 7: Regenerate System Index

Rebuild `PAL_Base/System/SYSTEM_INDEX.md` from all agent files. This provides a read-only system-wide view of all capabilities.

### 7a. Scan All Agents

```bash
ls .claude/agents/*.md
```

### 7b. Extract Capabilities from Each Agent

For each agent file, read **Section 5: My Capabilities** and extract:
- **Agent metadata:** `name`, `domain` from YAML frontmatter
- **Skills:** `name`, `location`, `use_when` from Section 5 → Skills
- **Workflows:** `name`, `source`, `location`, `use_when` from Section 5 → Workflows
- **Prompts:** `name`, `location`, `use_when` from Section 5 → Prompts (if any)

### 7c. Build Index Tables

Generate `SYSTEM_INDEX.md` with:

```markdown
---
title: PAL System Index
version: 1.0.0
layer: SYSTEM
purpose: Read-only system-wide capability index — regenerated by map-domain workflow
generated_at: [TIMESTAMP]
status: GENERATED — Do not edit manually. Run map-domain to regenerate.
---

# System Index

> ⚠ This file is auto-generated. Source of truth is each agent's Section 5.

## Agents
| Agent | Domain | Location |
|-------|--------|----------|
| [from ROUTING_TABLE.md] |

## All Skills
| Skill | Agent | Location | Use When |
|-------|-------|----------|----------|
| [extracted from each agent's Section 5] |

## All Workflows
| Workflow | Agent | Source | Location |
|----------|-------|--------|----------|
| [extracted from each agent's Section 5] |

## All Prompts
| Prompt | Agent | Location | Use When |
|--------|-------|----------|----------|
| [extracted from each agent's Section 5] |

---
Generated: [TIMESTAMP]
Agent files scanned: [N]
Total capabilities: [N] agents · [N] skills · [N] workflows · [N] prompts
```

### 7d. Write File

Write the generated index to `PAL_Base/System/SYSTEM_INDEX.md`, overwriting any previous version.

## Step 8: Report Summary

Output summary of changes:

```markdown
## Domain Map Complete: [DomainName]

### Files Scanned
- 00_CONTEXT/: [X] files
- 01_PROJECTS/: [X] files
- 02_SESSIONS/: [X] files
- 03_ASSETS/: [X] files
- 04_OUTPUTS/: [X] files
- 05_ARCHIVE/: [X] files

### README Files
- 00_CONTEXT/README.md: [FOUND | CREATED | MISSING]
- 01_PROJECTS/README.md: [FOUND | CREATED | MISSING]
- 02_SESSIONS/README.md: [FOUND | CREATED | MISSING]
- 03_ASSETS/README.md: [FOUND | CREATED | MISSING]
- 04_OUTPUTS/README.md: [FOUND | CREATED | MISSING]
- 05_ARCHIVE/README.md: [FOUND | CREATED | MISSING]

### Naming Fixes Applied
- [old_name] → [new_name]
- [old_name] → [new_name]

### INDEX.md Updates
- Active Work table refreshed ([X] projects)
- Updated date: [YYYY-MM-DD]

### Routing Table
- Agent: [agent-name] → [FOUND | MISSING | NO AGENT FOR DOMAIN]

### System Index
- Regenerated SYSTEM_INDEX.md
- Agents scanned: [N]
- Total: [N] skills · [N] workflows · [N] prompts

### Domain Health
[HEALTHY | X issues remaining]
```

## Done

Domain mapped and synchronized. INDEX.md reflects current state. System index regenerated.
