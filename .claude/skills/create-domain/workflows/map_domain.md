# map_domain Workflow

End-of-session housekeeping: scan domain for changes, enforce naming conventions, and synchronize INDEX.md.

## Step 1: Identify Target Domain

Ask the user which domain to map, or detect from context.

```bash
ls domains/
```

## Step 2: Scan Domain Folders

Scan the three content folders for files:

```bash
ls domains/[domain-name]/01_PLANS/
ls domains/[domain-name]/02_SESSIONS/
ls domains/[domain-name]/03_ASSETS/
```

## Step 3: Check Naming Conventions

For each file found, check against expected format:

| Location | Expected Format | Violation Example | Auto-Fix To |
|----------|-----------------|-------------------|-------------|
| 01_PLANS/ | `PLAN_XXX.md` | `feature_x.md` | `PLAN_FEATURE_X.md` |
| 02_SESSIONS/ | `YYYY-MM-DD_title.md` | `meeting_notes.md` | `[TODAY]_meeting_notes.md` |
| 03_ASSETS/ | `lower_snake_case.md` | `MyDoc.md` | `my_doc.md` |

### Auto-Fix Rules

**Plans (01_PLANS/):**
- Must start with `PLAN_`
- Must be UPPER_SNAKE_CASE
- Fix: `feature_x.md` → `PLAN_FEATURE_X.md`
- Fix: `plan_feature.md` → `PLAN_FEATURE.md`

**Sessions (02_SESSIONS/):**
- Must start with date `YYYY-MM-DD_`
- Rest is lower_snake_case
- Fix: `meeting.md` → `[TODAY]_meeting.md`
- Fix: `2026-01-18-notes.md` → `2026-01-18_notes.md`

**Assets (03_ASSETS/):**
- Must be lower_snake_case
- Fix: `MyDocument.md` → `my_document.md`
- Fix: `API-Reference.md` → `api_reference.md`

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

Scan 01_PLANS/ and rebuild the Active Work table:

```markdown
## Active Work

| Plan | Status | Last Updated |
|------|--------|--------------|
| PLAN_FEATURE_X.md | In Progress | 2026-01-18 |
| PLAN_MIGRATION.md | Blocked | 2026-01-15 |
```

**Status Detection:**
- Read each plan's YAML frontmatter for `status:` field
- If no status field, default to "Unknown"

### 5b. Update Metadata

Update INDEX.md YAML frontmatter:
- Set `updated:` to today's date

### 5c. Update Key Facts (Optional)

If significant changes detected (new plans, many new assets), offer to update Key Facts section.

## Step 6: Report Summary

Output summary of changes:

```markdown
## Domain Map Complete: [domain-name]

### Files Scanned
- 01_PLANS/: [X] files
- 02_SESSIONS/: [X] files
- 03_ASSETS/: [X] files

### Naming Fixes Applied
- [old_name] → [new_name]
- [old_name] → [new_name]

### INDEX.md Updates
- Active Work table refreshed ([X] plans)
- Updated date: [YYYY-MM-DD]

### Domain Health
[HEALTHY | X issues remaining]
```

## Done

Domain mapped and synchronized. INDEX.md reflects current state.
