# audit_naming Workflow

Audit all files and folders across the PAL system for naming convention compliance and YAML frontmatter validity.

## Step 1: Define Naming Rules

Reference from `CLAUDE.md`:

| Category                     | Convention            | Regex Pattern                                 | Example                |
| ---------------------------- | --------------------- | --------------------------------------------- | ---------------------- |
| System Protocols             | `UPPER_SNAKE_CASE.md` | `^[A-Z][A-Z0-9_]*\.md$`                       | `DIRECTIVES.md`        |
| Domain Folders               | `PascalCase`          | `^[A-Z][a-zA-Z0-9]*$`                         | `ProjectAlpha`         |
| Skill/System Folders         | `lower-kebab-case`    | `^[a-z][a-z0-9-]*$`                           | `create-agent`         |
| Agent Files                  | `lower-kebab-case.md` | `^[a-z][a-z0-9-]*\.md$`                       | `life-coach.md`        |
| Context Files (00_CONTEXT/)  | `lower_snake_case.md` | `^[a-z][a-z0-9_]*\.md$`                       | `background_info.md`   |
| Project Files (01_PROJECTS/) | `PROJECT_XXX.md`      | `^PROJECT_[A-Z0-9_]+\.md$`                    | `PROJECT_FEATURE_X.md` |
| Session Files (02_SESSIONS/) | `YYYY-MM-DD_title.md` | `^[0-9]{4}-[0-9]{2}-[0-9]{2}_[a-z0-9_]+\.md$` | `2026-01-15_sync.md`   |
| Asset Files (03_ASSETS/)     | `lower_snake_case.md` | `^[a-z][a-z0-9_]*\.md$`                       | `api_docs.md`          |
| Output Files (04_OUTPUTS/)   | Flexible              | —                                             | No enforcement         |
| Archive Files (05_ARCHIVE/)  | Preserve original     | —                                             | No enforcement         |

## Step 2: Check System Protocol Files

Scan `.claude/base/` for all `.md` files (excluding subdirectory README files):

```bash
find .claude/base/ -name "*.md" -not -name "README.md"
```

For each file:

- [ ] Filename matches `UPPER_SNAKE_CASE.md`

**If violation:** Flag with suggested rename.

## Step 3: Check Domain Folder Names

```bash
ls Domains/
```

For each domain directory:

- [ ] Name matches `PascalCase` (starts with uppercase, no hyphens, no underscores, no spaces)

**If violation:** Flag with suggested rename.

## Step 4: Check Skill and System Folder Names

```bash
ls .claude/skills/
ls .claude/base/
```

For each directory (excluding `node_modules`, `.DS_Store`, `.archive`):

- [ ] Name matches `lower-kebab-case`

**If violation:** Flag with suggested rename.

## Step 5: Check Agent File Names

```bash
ls .claude/agents/
```

For each `.md` file:

- [ ] Filename matches `lower-kebab-case.md`

**If violation:** Flag with suggested rename.

## Step 6: Check Domain Content Files

For each domain in `Domains/`:

### 6a. Context files (00_CONTEXT/)

- [ ] Each `.md` file (except README.md) follows `lower_snake_case.md`

### 6b. Project files (01_PROJECTS/)

- [ ] Each `.md` file (except README.md) follows `PROJECT_XXX.md`

### 6c. Session files (02_SESSIONS/)

- [ ] Each `.md` file (except README.md) follows `YYYY-MM-DD_title.md`

### 6d. Asset files (03_ASSETS/)

- [ ] Each `.md` file (except README.md) follows `lower_snake_case.md`

### 6e. Output files (04_OUTPUTS/)

- Skip — no naming enforcement

### 6f. Archive files (05_ARCHIVE/)

- Skip — preserve original names

## Step 7: Validate YAML Frontmatter

### 7a. Agent Files

For each file in `.claude/agents/`:

Read YAML frontmatter and check:

- [ ] `name` field present (lower-kebab-case, matches filename)
- [ ] `description` field present (non-empty string)
- [ ] `version` field present (semantic versioning X.Y.Z)
- [ ] `domain` field present

### 7b. Skill Files

For each `SKILL.md` in `.claude/skills/*/`:

Read YAML frontmatter and check:

- [ ] `name` field present (lower-kebab-case, matches parent directory name)
- [ ] `description` field present (non-empty string)

### 7c. Domain INDEX Files

For each `INDEX.md` in `Domains/*/`:

Read YAML frontmatter and check:

- [ ] `name` field present
- [ ] `description` field present (non-empty string)
- [ ] `status` field present (one of: active, paused, completed, archived)
- [ ] `created` field present (YYYY-MM-DD format)
- [ ] `updated` field present (YYYY-MM-DD format)

## Step 8: Generate Report

```markdown
## Naming Audit Report — [DATE]

### Summary

- Files checked: [N]
- Naming violations: [N]
- Frontmatter issues: [N]

### Naming Convention Violations

| Location                | Current Name | Expected Convention | Suggested Fix |
| ----------------------- | ------------ | ------------------- | ------------- |
| .claude/base/reference/ | [name]       | UPPER_SNAKE_CASE.md | [fix]         |
| Domains/                | [name]       | PascalCase          | [fix]         |
| .claude/skills/         | [name]       | lower-kebab-case    | [fix]         |
| .claude/agents/         | [name]       | lower-kebab-case.md | [fix]         |
| Domains/X/00_CONTEXT/   | [name]       | lower_snake_case.md | [fix]         |
| Domains/X/01_PROJECTS/  | [name]       | PROJECT_XXX.md      | [fix]         |
| Domains/X/02_SESSIONS/  | [name]       | YYYY-MM-DD_title.md | [fix]         |

### Frontmatter Issues

| File   | Type         | Issue                       | Fix                  |
| ------ | ------------ | --------------------------- | -------------------- |
| [path] | Agent        | Missing `version` field     | Add `version: 1.0.0` |
| [path] | Skill        | Missing `description` field | Add description      |
| [path] | Domain INDEX | Missing `status` field      | Add `status: active` |

### Result

[ALL CLEAR | X violations found]
```

## Step 9: Offer Fixes

If issues found, offer:

1. **Naming violations** → Propose renames (user must confirm each or confirm all)
2. **Missing frontmatter fields** → Add missing fields with sensible defaults
3. **Incorrect frontmatter values** → Suggest corrections

**Important:** Renames may affect references in other files. After any rename, suggest running `audit_references` to check for broken links.

## Done

Naming audit complete. Report generated with all convention violations and frontmatter issues.
