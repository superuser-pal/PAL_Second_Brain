# audit_orphans Workflow

Find orphan files not claimed by any agent, stale session logs ready for archiving, and empty folders that can be cleaned up.

## Step 1: Detect Orphan Skills

### 1a. List all skills on disk

```bash
find .claude/skills/ -name "SKILL.md" -not -path "*.archive*" | sed 's|/SKILL.md||' | xargs -I{} basename {}
```

Record as `skills_on_disk[]`.

### 1b. Collect claimed skills from all agents

For each agent in `.claude/agents/*.md`:

1. Read the file
2. Find **Section 5: My Capabilities** → Skills block
3. Extract each skill `name` value

Record as `claimed_skills[]`.

### 1c. Compare

For each skill in `skills_on_disk[]`:

- [ ] Skill name exists in `claimed_skills[]`

**If unclaimed:** Flag as `ORPHAN SKILL: [skill-name] — not claimed by any agent`.

## Step 2: Detect Orphan Domain Files

For each domain in `Domains/`:

### 2a. Identify the domain's agent

```bash
grep -l "domain:" .claude/agents/*.md
```

Match agent's `domain:` field to this domain.

### 2b. Collect referenced paths

If an agent exists for this domain, read its **Section 2: Activation Protocol** and extract all file/folder paths listed under the Domain Context loading section.

### 2c. Scan domain for unreferenced content

List all files in the domain (excluding README.md files and standard structure files like INDEX.md, CONNECTIONS.yaml):

```bash
find Domains/[DomainName] -type f -not -name "README.md" -not -name "INDEX.md" -not -name "CONNECTIONS.yaml" -not -name ".DS_Store"
```

For each file:

- [ ] File's parent folder is referenced in the agent's activation protocol (by folder-level [REF] or [AUTO])

**Note:** We check at the folder level, not individual file level. If `03_ASSETS/` is [REF]'d in the agent, all files within it are considered covered.

**If folder not referenced:** Flag as `ORPHAN FILE: [path] — parent folder not loaded by agent`.

### 2d. Domains without agents

If no agent binds to this domain, flag all non-structural files as worth reviewing:

```
NOTE: Domain [name] has no bound agent. All content files are effectively orphaned from the agent system.
```

## Step 3: Detect Stale Session Logs

### 3a. Configuration

Default threshold: **30 days**. Ask user if they want a different threshold.

### 3b. Scan all session folders

```bash
find Domains/*/02_SESSIONS/ -name "*.md" -not -name "README.md"
```

### 3c. Check file age

For each session file:

1. Extract date from filename (expected format: `YYYY-MM-DD_title.md`)
2. If filename doesn't contain a date, use file modification time
3. Calculate age in days

- [ ] File is newer than threshold

**If older than threshold:** Flag as `STALE SESSION: [path] — [age] days old`.

### 3d. Suggest archiving

For each stale session, suggest:

```bash
mv Domains/[DomainName]/02_SESSIONS/[filename] Domains/[DomainName]/05_ARCHIVE/[filename]
```

## Step 4: Detect Empty Folders

### 4a. Scan .claude/ directory

```bash
find .claude/ -type d -empty -not -path "*/node_modules/*" -not -path "*/.git/*"
```

### 4b. Scan Domains/ directory

```bash
find Domains/ -type d -empty
```

### 4c. Scan root-level directories

```bash
find . -maxdepth 1 -type d -empty
```

For each empty folder:

- [ ] Determine if it's a structural placeholder (e.g., `04_OUTPUTS/` in a new domain) or truly unused

**Classify as:**

- `STRUCTURAL PLACEHOLDER` — Expected to be empty (new domain folders, output/archive dirs)
- `UNUSED FOLDER` — Not part of any domain or skill structure, likely leftover

## Step 5: Generate Report

```markdown
## Orphans & Hygiene Audit Report — [DATE]

### Summary

- Orphan skills: [N]
- Orphan domain files: [N]
- Stale sessions: [N] (threshold: [X] days)
- Empty folders: [N] ([M] structural, [P] unused)

### Orphan Skills

| Skill  | Location               | Action                                    |
| ------ | ---------------------- | ----------------------------------------- |
| [name] | .claude/skills/[name]/ | Assign to an agent's Section 5 or archive |

### Orphan Domain Files

| Domain   | File   | Reason                                |
| -------- | ------ | ------------------------------------- |
| [domain] | [path] | Parent folder not referenced by agent |
| [domain] | [path] | Domain has no bound agent             |

### Stale Session Logs

| Domain   | File       | Age      | Suggested Action       |
| -------- | ---------- | -------- | ---------------------- |
| [domain] | [filename] | [N] days | Archive to 05_ARCHIVE/ |

### Empty Folders

| Path   | Classification         | Suggested Action      |
| ------ | ---------------------- | --------------------- |
| [path] | Structural placeholder | Keep (expected empty) |
| [path] | Unused                 | Remove or repurpose   |

### Result

[ALL CLEAR | X items need attention]
```

## Step 6: Offer Fixes

If issues found, offer:

1. **Orphan skills** → Assign to an agent or archive (move to `*.archive/` directory)
2. **Stale sessions** → Archive all at once or one-by-one
3. **Empty unused folders** → Remove with user confirmation
4. **Orphan domain files** → Flag for review (don't auto-delete domain content)

**Safety:** Never auto-delete. Always present findings and ask for user confirmation before any changes.

## Done

Orphans and hygiene audit complete. Report generated with all orphaned items and cleanup suggestions.
