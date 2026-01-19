# canonicalize_skill Workflow

**Purpose:** Restructure an existing skill to match the canonical format with proper naming conventions.

---

## Step 1: Read the Authoritative Source

**REQUIRED FIRST:** Read the canonical structure:

```
SKILL_LOGIC.md
```

This defines exactly what "canonicalize" means.

---

## Step 2: Read the Current Skill

```bash
~/.claude/skills/[skill-name]/SKILL.md
```

Identify what's wrong:

- Multi-line description using `|`?
- Separate `triggers:` array in YAML? (OLD FORMAT)
- Separate `workflows:` array in YAML? (OLD FORMAT)
- Missing `USE WHEN` in description?
- Workflow routing missing from markdown body?
- **Workflow files not using `lower_snake_case`?**
- **Skill directory not using `lower-kebab-case`?**

---

## Step 3: Backup

```bash
cp -r ~/.claude/skills/[skill-name]/ ~/.claude/history/backups/[skill-name]-backup-$(date +%Y%m%d)/
```

**Note:** Backups go to `~/.claude/history/backups/`, NEVER inside skill directories.

---

## Step 4: Enforce Naming Conventions

**CRITICAL: All naming must follow PAL standards.**

### Skill Directory Name

```
WRONG: Blogging, Daemon, CreateSkill, createskill
CORRECT: blogging, daemon, create-skill
```

### Workflow File Names

```
WRONG: Create.md, UpdateDaemonInfo.md, SyncRepo.md
CORRECT: create.md, update_daemon_info.md, sync_repo.md
```

### Reference Doc Names

```
WRONG: ProsodyGuide.md, SchemaSpec.md, ApiReference.md
CORRECT: prosody_guide.md, schema_spec.md, api_reference.md
```

### Tool Names

```
WRONG: ManageServer.ts, MANAGE_SERVER.ts
CORRECT: manage_server.ts (with manage_server.help.md)
```

**Rename files if needed:**

```bash
# Example: rename workflow files
cd ~/.claude/skills/[skill-name]/workflows/
mv Create.md create.md
mv UpdateInfo.md update_info.md
mv SyncRepo.md sync_repo.md
```

---

## Step 5: Enforce Flat Folder Structure

**CRITICAL: Maximum 2 levels deep - `skills/skill-name/category/`**

### Check for Nested Folders

Scan for folders deeper than 2 levels:

```bash
# Find any folders 3+ levels deep (FORBIDDEN)
find ~/.claude/skills/[skill-name]/ -type d -mindepth 2 -maxdepth 3
```

### Common Violations to Fix

**Nested Workflows:**

```
WRONG: workflows/company/due_diligence.md
FIX: workflows/company_due_diligence.md
```

**Nested Tools:**

```
WRONG: tools/utils/helper.ts
FIX: tools/helper.ts
```

### Flatten Procedure

1. **Identify nested files**: Find any file 3+ levels deep
2. **Rename for clarity**: `category/file.md` -> `category_file.md`
3. **Move to parent**: Move up one level to proper location
4. **Update references**: Search for old paths and update

**Example:**

```bash
# Before (3 levels - WRONG)
skills/osint/workflows/company/due_diligence.md

# After (2 levels - CORRECT)
skills/osint/workflows/company_due_diligence.md
```

**Rule:** If you need to organize many files, use clear filenames NOT subdirectories.

---

## Step 6: Convert YAML Frontmatter

**From old format (WRONG):**

```yaml
---
name: SkillName
description: |
  What the skill does.

triggers:
  - USE WHEN user mentions X
  - USE WHEN user wants to Y

workflows:
  - USE WHEN user wants to A: workflows/a.md
  - USE WHEN user wants to B: workflows/b.md
---
```

**To new format (CORRECT):**

```yaml
---
name: skill-name
description: What the skill does. USE WHEN user mentions X OR user wants to Y. Additional capabilities.
---
```

**Key changes:**

- Skill name in `lower-kebab-case`
- Combine description + triggers into single-line `description` with `USE WHEN`
- Remove `triggers:` array entirely
- Remove `workflows:` array from YAML (moves to body)

---

## Step 6: Add Workflow Routing to Body

Add `## Workflow Routing` section in markdown body:

```markdown
# skill-name

[Description]

## Workflow Routing

| Workflow         | Trigger              | File                        |
| :--------------- | :------------------- | :-------------------------- |
| **workflow_one** | "trigger phrase one" | `workflows/workflow_one.md` |
| **workflow_two** | "trigger phrase two" | `workflows/workflow_two.md` |

## Examples

[Required examples section]

## [Rest of documentation]
```

**Note:** Workflow names in routing table must match file names exactly (`lower_snake_case`).

---

## Step 7: Remove Redundant Routing

If the markdown body already had routing information in a different format, consolidate it into the standard `## Workflow Routing` section. Delete any duplicate routing tables or sections.

---

## Step 8: Ensure All Workflows Are Routed

List workflow files:

```bash
ls ~/.claude/skills/[skill-name]/workflows/
```

For EACH file:

1. Verify `lower_snake_case` naming (rename if needed)
2. Ensure there's a routing entry in `## Workflow Routing`
3. Verify routing entry matches exact file name

---

## Step 9: Add Examples Section

**REQUIRED:** Every skill needs an `## Examples` section with 2-3 concrete usage patterns.

```markdown
## Examples

**Example 1: [Common use case]**
```

User: "[Typical user request]"
→ Invokes workflow_one workflow
→ [What skill does]
→ [What user gets back]

```

**Example 2: [Another use case]**
```

User: "[Different request]"
→ [Process]
→ [Output]

```

```

Place the Examples section after Workflow Routing.

---

## Step 10: Verify

Run checklist:

### Naming Conventions

- [ ] Skill directory uses `lower-kebab-case` (e.g., `blogging`, `create-skill`)
- [ ] All workflow files use `lower_snake_case` (e.g., `create.md`, `update_info.md`)
- [ ] All reference docs use `lower_snake_case` (e.g., `prosody_guide.md`)
- [ ] All tool files use `lower_snake_case` (e.g., `manage_server.ts`)
- [ ] Routing table workflow names match file names exactly

### YAML Frontmatter

- [ ] `name:` uses `lower-kebab-case`
- [ ] `description:` is single-line with embedded `USE WHEN` clause
- [ ] No separate `triggers:` or `workflows:` arrays in YAML
- [ ] Description uses intent-based language
- [ ] Description is under 1024 characters

### Markdown Body

- [ ] `## Workflow Routing` section present
- [ ] Routing uses table format with Workflow, Trigger, File columns
- [ ] All workflow files have routing entries
- [ ] `## Examples` section with 2-3 concrete usage patterns

### Structure

- [ ] `tools/` directory exists (even if empty)
- [ ] Workflows contain ONLY work execution procedures
- [ ] Reference docs live at skill root (not in workflows/)
- [ ] No `backups/` directory inside skill

---

## Naming Reference

| Type            | Wrong                        | Correct                       |
| :-------------- | :--------------------------- | :---------------------------- |
| Skill directory | `Blogging`, `CreateSkill`    | `blogging`, `create-skill`    |
| Workflow file   | `Create.md`, `UpdateInfo.md` | `create.md`, `update_info.md` |
| Tool file       | `ManageServer.ts`            | `manage_server.ts`            |

---

## Done

Skill now matches the canonical structure with proper naming conventions throughout.
