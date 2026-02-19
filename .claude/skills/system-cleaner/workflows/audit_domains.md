# audit_domains Workflow

Validate all domains under `Domains/` for structural completeness, INDEX.md consistency, and agent cross-references.

## Step 1: List All Domains

```bash
ls Domains/
```

Record each domain directory name.

## Step 2: Validate Folder Structure

For each domain, verify these required components exist:

| Component          | Required | Check            |
| ------------------ | -------- | ---------------- |
| `INDEX.md`         | Yes      | At domain root   |
| `CONNECTIONS.yaml` | Yes      | At domain root   |
| `00_CONTEXT/`      | Yes      | Directory exists |
| `01_PROJECTS/`     | Yes      | Directory exists |
| `02_SESSIONS/`     | Yes      | Directory exists |
| `03_ASSETS/`       | Yes      | Directory exists |
| `04_OUTPUTS/`      | Yes      | Directory exists |
| `05_ARCHIVE/`      | Yes      | Directory exists |

```bash
ls -la Domains/[DomainName]/
```

**If missing:** Flag as `MISSING STRUCTURE: [component]`.

## Step 3: Validate INDEX.md Content

For each domain's `INDEX.md`:

### 3a. YAML Frontmatter

Check for required fields:

- [ ] `name` — present
- [ ] `description` — present
- [ ] `status` — present (active | paused | completed | archived)
- [ ] `created` — present (YYYY-MM-DD format)
- [ ] `updated` — present (YYYY-MM-DD format)

### 3b. Required Sections

- [ ] `## Current State` — Summary of status
- [ ] `## Key Facts` — Important context
- [ ] `## Active Work` — Table with Project, Status, Last Updated columns
- [ ] `## Quick Links` — Links to all six folders

**If missing:** Flag as `INDEX ISSUE: missing [field/section]`.

## Step 4: Cross-Check Active Work ↔ 01_PROJECTS/

For each domain:

1. Read `INDEX.md` → extract Active Work table entries (project names)
2. List actual files in `01_PROJECTS/`:
   ```bash
   ls Domains/[DomainName]/01_PROJECTS/
   ```
3. Compare:
   - [ ] Every project in Active Work table has a corresponding file in `01_PROJECTS/`
   - [ ] Every file in `01_PROJECTS/` (excluding README.md) is listed in Active Work table

**If mismatch:**

- Project in table but no file → `STALE TABLE ENTRY`
- File exists but not in table → `UNLISTED PROJECT`

## Step 5: Cross-Check Domain ↔ Agent Binding

### 5a. Find Domain's Agent

For each domain, search for an agent that binds to it:

```bash
grep -l "domain:" .claude/agents/*.md
```

Read each agent's YAML frontmatter `domain:` field. Match against the domain name.

### 5b. Verify Agent References Domain Correctly

If an agent is found for this domain:

- [ ] Agent's `domain:` field matches the domain directory name
- [ ] Agent's Activation Protocol (Section 2) references `Domains/[DomainName]/INDEX.md`
- [ ] Agent's domain context loading references the correct domain subfolders

### 5c. Check ROUTING_TABLE

- [ ] The domain's agent has an entry in ROUTING_TABLE.md
- [ ] The `domain` field in the routing entry matches

**If no agent found:** Flag as `DOMAIN WITHOUT AGENT` (valid but worth noting).

## Step 6: Check Nesting Depth

For each domain, verify no folder exceeds 3 levels below the domain root:

```bash
find Domains/[DomainName] -mindepth 4 -type d
```

**If deep nesting found:** Flag as `NESTING TOO DEEP: [path]`.

## Step 7: Generate Report

```markdown
## Domain Audit Report — [DATE]

### Summary

- Domains scanned: [N]
- Domains healthy: [N]
- Domains with issues: [N]

### Per-Domain Results

#### [DomainName]

**Structure:**

- [x] INDEX.md exists
- [x] CONNECTIONS.yaml exists
- [x] All 6 folders present
- [ ] Missing: [component]

**INDEX.md:**

- [x] Valid frontmatter
- [x] Required sections present
- [ ] Issue: [description]

**Active Work Sync:**

- Projects in table: [N]
- Files in 01_PROJECTS/: [N]
- Stale table entries: [list]
- Unlisted projects: [list]

**Agent Binding:**

- Agent: [agent-name] | Status: [BOUND | NO AGENT | MISMATCH]

**Nesting Depth:**

- [OK | violations listed]

---

[Repeat for each domain]

### Overall Result

[ALL CLEAR | X total issues across Y domains]
```

## Step 8: Offer Fixes

If issues found, offer:

1. **Missing folders** → Create them
2. **Missing INDEX.md fields/sections** → Add from template
3. **Stale table entries** → Remove from Active Work
4. **Unlisted projects** → Add to Active Work table
5. **Missing CONNECTIONS.yaml** → Create empty template
6. **Nesting violations** → Suggest flattening with semantic naming

## Done

Domain audit complete. Report generated with structural and consistency issues.
