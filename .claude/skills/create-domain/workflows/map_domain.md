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
ls domains/[DomainName]/03_PAGES/
ls domains/[DomainName]/04_OUTPUT/
ls domains/[DomainName]/05_ARCHIVE/
```

## Step 2.5: Check README Files

Verify README.md exists in each core folder:

```bash
ls domains/[DomainName]/00_CONTEXT/README.md
ls domains/[DomainName]/01_PROJECTS/README.md
ls domains/[DomainName]/02_SESSIONS/README.md
ls domains/[DomainName]/03_PAGES/README.md
ls domains/[DomainName]/04_OUTPUT/README.md
ls domains/[DomainName]/05_ARCHIVE/README.md
```

**If any README is missing:**

1. Report which folders are missing README files
2. Offer to create them from templates:
   ```bash
   cp .claude/skills/create-domain/templates/README.00_CONTEXT.template.md domains/[DomainName]/00_CONTEXT/README.md
   cp .claude/skills/create-domain/templates/README.01_PROJECTS.template.md domains/[DomainName]/01_PROJECTS/README.md
   cp .claude/skills/create-domain/templates/README.02_SESSIONS.template.md domains/[DomainName]/02_SESSIONS/README.md
   cp .claude/skills/create-domain/templates/README.03_PAGES.template.md domains/[DomainName]/03_PAGES/README.md
   cp .claude/skills/create-domain/templates/README.04_OUTPUT.template.md domains/[DomainName]/04_OUTPUT/README.md
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
| 03_PAGES/ | `lower_snake_case.md` | `api_documentation.md` | Renamed to standard pattern |
| 04_OUTPUT/ | Flexible (no enforcement) | — | — |
| 05_ARCHIVE/ | Original file name | Preserve names | — | — |

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

**Assets (03_PAGES/):**
- Must be lower_snake_case
- Fix: `MyDocument.md` → `my_document.md`
- Fix:**Pages (03_PAGES/):**
*(List any newly discovered reference files here)*

**Outputs (04_OUTPUT/):**
*(List any new generated files here)*nt. Skip during convention checks.

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

## Step 7: Validate System Index

Validate `.claude/core/reference/SYSTEM_INDEX.md` (the writable Skills Registry) against the filesystem.

### 7a. Check All Registered Skills Exist on Disk

For each row in the Skills Registry table, verify the skill directory exists:

```bash
# For each skill in SYSTEM_INDEX.md
ls .claude/skills/[skill-name]/SKILL.md
```

Flag any entries where the skill directory or SKILL.md is missing as **orphaned registry entries**.

### 7b. Check All Skills on Disk Have Registry Entries

Scan all skills on disk and check they have at least one entry in SYSTEM_INDEX.md:

```bash
ls .claude/skills/*/SKILL.md
```

For each skill found, verify it appears in the Skills Registry. Flag any missing as **unregistered skills**.

### 7c. Report Results

```markdown
### System Index Validation
- Registered skills: [N]
- Skills on disk: [N]
- Orphaned entries (in registry but not on disk): [list or "none"]
- Unregistered skills (on disk but not in registry): [list or "none"]
```

If orphaned entries found → offer to remove them from SYSTEM_INDEX.md.
If unregistered skills found → offer to add them (ask which agent to assign).

## Step 8: Report Summary

Output summary of changes:

```markdown
## Domain Map Complete: [DomainName]

### Files Scanned
- 00_CONTEXT/: [X] files
- 01_PROJECTS/: [X] files
- 02_SESSIONS/: [X] files
- 03_PAGES/: [X] files
- 04_OUTPUT/: [X] files
- 05_ARCHIVE/: [X] files

### README Files
- 00_CONTEXT/README.md: [FOUND | CREATED | MISSING]
- 01_PROJECTS/README.md: [FOUND | CREATED | MISSING]
- 02_SESSIONS/README.md: [FOUND | CREATED | MISSING]
- 03_PAGES/README.md: [FOUND | CREATED | MISSING]
- 04_OUTPUT/README.md: [FOUND | CREATED | MISSING]
- 05_ARCHIVE/README.md: [FOUND | CREATED | MISSING]

### Naming Fixes Applied
- [old_name] → [new_name]
- [old_name] → [new_name]

### INDEX.md Updates
- Active Work table refreshed ([X] projects)
- Updated date: [YYYY-MM-DD]

### Routing Table
- Agent: [agent-name] → [FOUND | MISSING | NO AGENT FOR DOMAIN]

### System Index Validation
- Registered skills: [N]
- Orphaned entries: [list or "none"]
- Unregistered skills: [list or "none"]

### Domain Health
[HEALTHY | X issues remaining]
```

## Done

Domain mapped and synchronized. INDEX.md reflects current state. System index validated.
