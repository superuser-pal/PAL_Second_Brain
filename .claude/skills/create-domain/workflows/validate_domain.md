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
| `01_PLANS/` | Yes | Directory exists |
| `02_SESSIONS/` | Yes | Directory exists |
| `03_ASSETS/` | Yes | Directory exists |
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

- [ ] `## Current State` - Summary of project status
- [ ] `## Key Facts` - Important context bullets
- [ ] `## Active Work` - Table of active plans
- [ ] `## Quick Links` - Links to folders/assets

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
| Core folders | NN_UPPER_CASE | `01_PLANS`, `02_SESSIONS` |

### File Names

| Location | Expected Format | Valid Examples |
|----------|-----------------|----------------|
| 01_PLANS/ | PLAN_XXX.md | `PLAN_FEATURE_X.md` |
| 02_SESSIONS/ | YYYY-MM-DD_title.md | `2026-01-15_sync.md` |
| 03_ASSETS/ | lower_snake_case | `api_documentation.md` |

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
- [ ] 01_PLANS/ exists
- [ ] 02_SESSIONS/ exists
- [ ] 03_ASSETS/ exists
- [ ] 05_ARCHIVE/ exists

### INDEX.md Check
- [ ] Valid YAML frontmatter
- [ ] Required fields present (name, description, status, created, updated)
- [ ] Required sections present

### CONNECTIONS.yaml Check
- [ ] Valid YAML syntax
- [ ] Required sections present (apis, documentation, data_sources)

### Naming Conventions
- [ ] Domain directory: lower-kebab-case
- [ ] Core folders: NN_UPPER_CASE
- [ ] Plan files: PLAN_XXX.md format
- [ ] Session files: YYYY-MM-DD_title.md format
- [ ] Asset files: lower_snake_case

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
5. **Missing sections:** Add template sections

## Done

Domain validation complete. Report generated with any issues and suggested fixes.
