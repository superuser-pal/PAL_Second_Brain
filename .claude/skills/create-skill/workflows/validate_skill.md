# validate_skill Workflow

**Purpose:** Check if an existing skill follows the canonical structure with proper naming conventions.

---

## Step 1: Read the Authoritative Source

**REQUIRED FIRST:** Read the canonical structure:

```
SKILL_LOGIC.md
```

---

## Step 2: Read the Target Skill

```bash
~/.claude/skills/[skill-name]/SKILL.md
```

---

## Step 3: Check Naming Conventions

### Skill Directory

```bash
ls ~/.claude/skills/ | grep -i [skill-name]
```

Verify `lower-kebab-case`:

- PASS: `blogging`, `daemon`, `create-skill`
- FAIL: `Blogging`, `Daemon`, `CreateSkill`, `createskill`

### Workflow Files

```bash
ls ~/.claude/skills/[skill-name]/workflows/
```

Verify `lower_snake_case`:

- PASS: `create.md`, `update_daemon_info.md`, `sync_repo.md`
- FAIL: `Create.md`, `update-daemon-info.md`, `SYNC_REPO.md`

### Tool Files

```bash
ls ~/.claude/skills/[skill-name]/tools/
```

Verify `lower_snake_case`:

- PASS: `manage_server.ts`, `manage_server.help.md`
- FAIL: `ManageServer.ts`, `manage-server.ts`, `MANAGE_SERVER.ts`

---

## Step 4: Check YAML Frontmatter

Verify the YAML has:

### Single-Line Description with USE WHEN

```yaml
---
name: skill-name
description: [What it does]. USE WHEN [intent triggers using OR]. [Additional capabilities].
---
```

**Check for violations:**

- Multi-line description using `|` (WRONG)
- Missing `USE WHEN` keyword (WRONG)
- Separate `triggers:` array in YAML (OLD FORMAT - WRONG)
- Separate `workflows:` array in YAML (OLD FORMAT - WRONG)
- `name:` not in `lower-kebab-case` (WRONG)

---

## Step 5: Check Markdown Body

Verify the body has:

### Workflow Routing Section

```markdown
## Workflow Routing

| Workflow         | Trigger          | File                        |
| :--------------- | :--------------- | :-------------------------- |
| **workflow_one** | "trigger phrase" | `workflows/workflow_one.md` |
```

**Check for violations:**

- Missing `## Workflow Routing` section
- Workflow names not in `lower_snake_case`
- File paths not matching actual file names

### Examples Section

```markdown
## Examples

**Example 1: [Use case]**
```

User: "[Request]"
→ [Action]
→ [Result]

```

```

**Check:** Examples section required (WRONG if missing)

---

## Step 6: Check Workflow Files

```bash
ls ~/.claude/skills/[skill-name]/workflows/
```

Verify:

- Every file uses `lower_snake_case` naming
- Every file has a corresponding entry in `## Workflow Routing` section
- Every routing entry points to an existing file
- Routing table names match file names exactly

---

## Step 7: Check Structure

```bash
ls -la ~/.claude/skills/[skill-name]/
```

Verify:

- `tools/` directory exists (even if empty)
- No `backups/` directory inside skill
- Reference docs at skill root (not in workflows/)

---

## Step 7a: Check CLI-First Integration (for skills with CLI tools)

**If the skill has CLI tools in `tools/`:**

### CLI Tool Configuration Flags

Check each tool for flag-based configuration:

```bash
bun ~/.claude/skills/[skill-name]/tools/[tool_name].ts --help
```

Verify the tool exposes behavioral configuration via flags:

- Mode flags (--fast, --thorough, --dry-run) where applicable
- Output flags (--format, --quiet, --verbose)
- Resource flags (--model, etc.) if applicable

### Workflow Intent-to-Flag Mapping

For workflows that call CLI tools, check for intent-to-flag mapping tables:

```bash
grep -l "Intent-to-Flag" ~/.claude/skills/[skill-name]/workflows/*.md
```

**Required pattern in workflows with CLI tools:**

```markdown
## Intent-to-Flag Mapping

| User Says | Flag            | When to Use    |
| --------- | --------------- | -------------- |
| "fast"    | `--model haiku` | Speed priority |
```

**Reference:** `TOOLBOX.md`

---

## Step 8: Report Results

**COMPLIANT** if all checks pass:

### Naming Conventions

- [ ] Skill directory uses `lower-kebab-case`
- [ ] All workflow files use `lower_snake_case`
- [ ] All reference docs use `lower_snake_case`
- [ ] All tool files use `lower_snake_case`
- [ ] Routing table names match file names

### YAML Frontmatter

- [ ] `name:` uses `lower-kebab-case`
- [ ] `description:` is single-line with `USE WHEN`
- [ ] No separate `triggers:` or `workflows:` arrays
- [ ] Description under 1024 characters

### Markdown Body

- [ ] `## Workflow Routing` section present
- [ ] `## Examples` section with 2-3 patterns
- [ ] All workflows have routing entries

### Structure

- [ ] `tools/` directory exists
- [ ] No `backups/` inside skill

### CLI-First Integration (for skills with CLI tools)

- [ ] CLI tools expose configuration via flags (not hardcoded)
- [ ] Workflows that call CLI tools have intent-to-flag mapping tables

**NON-COMPLIANT** if any check fails. Recommend using `canonicalize_skill` workflow.
