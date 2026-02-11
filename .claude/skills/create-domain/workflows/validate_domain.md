# validate_domain Workflow

Validate an existing PAL domain against the canonical structure from DOMAINS_LOGIC.md.

## Step 1: Read the Authoritative Source

**REQUIRED FIRST:**

Read the domain system documentation: `DOMAINS_LOGIC.md`

## Step 2: Identify Target Domain

Ask the user which domain to validate, or detect from context.

List available domains:

```bash
ls domains/
```

## Step 3: Check Directory Structure

Verify these components exist:

| Component | Required | Check |
|-----------|----------|-------|
| `INDEX.md` | Yes | At domain root |
| `CONNECTIONS.yaml` | Yes | At domain root |
| `00_CONTEXT/` | Yes | Directory exists |
| `01_PROJECTS/` | Yes | Directory exists |
| `02_SESSIONS/` | Yes | Directory exists |
| `03_ASSETS/` | Yes | Directory exists |
| `04_OUTPUTS/` | Yes | Directory exists |
| `05_ARCHIVE/` | Yes | Directory exists |

```bash
ls -la domains/[domain-name]/
```

## Step 4: Validate INDEX.md

### 4a. Check YAML Frontmatter

Required fields:

| Field | Required | Format |
|-------|----------|--------|
| `name` | Yes | lower-kebab-case |
| `description` | Yes | String |
| `status` | Yes | active \| paused \| completed \| archived |
| `created` | Yes | YYYY-MM-DD |
| `updated` | Yes | YYYY-MM-DD |
| `owner` | No | String |

### 4b. Check Required Sections

- [ ] `## Current State` — Summary of project status
- [ ] `## Key Facts` — Important context bullets
- [ ] `## Active Work` — Table of active projects (from 01_PROJECTS/)
- [ ] `## Quick Links` — Links to all six folders

## Step 5: Validate CONNECTIONS.yaml

Check schema compliance:

- [ ] Valid YAML syntax
- [ ] Contains `apis:` section (can be empty array)
- [ ] Contains `documentation:` section (can be empty array)
- [ ] Contains `data_sources:` section (can be empty array)

## Step 6: Check Naming Conventions

### Folder Names

| Folder | Expected Format | Valid Examples |
|--------|-----------------|----------------|
| Domain directory | lower-kebab-case | `project-alpha`, `my-blog` |
| Core folders | NN_UPPER_CASE | `00_CONTEXT`, `01_PROJECTS`, `02_SESSIONS` |

### File Names

| Location | Expected Format | Valid Examples |
|----------|-----------------|----------------|
| 00_CONTEXT/ | lower_snake_case.md | `background_info.md`, `domain_rules.md` |
| 01_PROJECTS/ | PROJECT_XXX.md | `PROJECT_FEATURE_X.md`, `PROJECT_MIGRATION.md` |
| 02_SESSIONS/ | YYYY-MM-DD_title.md | `2026-01-15_sync.md` |
| 03_ASSETS/ | lower_snake_case | `api_documentation.md` |
| 04_OUTPUTS/ | Flexible (no enforcement) | Any naming convention |
| 05_ARCHIVE/ | Preserve original name | No renaming expected |

## Step 7: Check Nesting Depth

Maximum depth: 3 levels below domain root.

**Allowed:**
```
domains/project-alpha/03_ASSETS/diagrams/architecture.png  # 3 levels - OK
```

**Not Allowed:**
```
domains/project-alpha/03_ASSETS/diagrams/v1/draft/file.png  # 5 levels - TOO DEEP
```

## Step 8: Generate Report

Output validation results:

```markdown
## Domain Validation Report: [domain-name]

### Structure Check
- [ ] INDEX.md exists
- [ ] CONNECTIONS.yaml exists
- [ ] 00_CONTEXT/ exists
- [ ] 01_PROJECTS/ exists
- [ ] 02_SESSIONS/ exists
- [ ] 03_ASSETS/ exists
- [ ] 04_OUTPUTS/ exists
- [ ] 05_ARCHIVE/ exists

### INDEX.md Check
- [ ] Valid YAML frontmatter
- [ ] Required fields present (name, description, status, created, updated)
- [ ] Required sections present (Current State, Key Facts, Active Work, Quick Links)
- [ ] Active Work table tracks projects (not plans)
- [ ] Quick Links reference all six folders

### CONNECTIONS.yaml Check
- [ ] Valid YAML syntax
- [ ] Required sections present (apis, documentation, data_sources)

### Naming Conventions
- [ ] Domain directory: lower-kebab-case
- [ ] Core folders: NN_UPPER_CASE
- [ ] Context files: lower_snake_case.md format
- [ ] Project files: PROJECT_XXX.md format
- [ ] Session files: YYYY-MM-DD_title.md format
- [ ] Asset files: lower_snake_case
- [ ] Output files: flexible (no enforcement)
- [ ] Archive files: preserved original names

### Nesting Depth
- [ ] No folder exceeds 3 levels below domain root

### Issues Found
[List any issues with suggested fixes]

### Result
[PASS | FAIL with issue count]
```

## Step 9: Offer Fixes

If issues found, offer to fix:

1. **Missing folders:** Create them
2. **Missing INDEX.md:** Generate from template
3. **Missing CONNECTIONS.yaml:** Generate empty template
4. **Naming issues:** Suggest renames (user must approve)
5. **Missing sections in INDEX.md:** Add template sections
6. **Old references (plans instead of projects):** Update INDEX.md tables and links

## Done

Domain validation complete. Report generated with any issues and suggested fixes.
