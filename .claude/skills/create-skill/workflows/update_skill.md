# update_skill Workflow

**Purpose:** Add workflows or modify an existing skill while maintaining canonical structure and naming conventions.

---

## Step 1: Read the Authoritative Source

**REQUIRED FIRST:** Read the canonical structure:

```
SKILL_LOGIC.md
```

---

## Step 2: Read the Current Skill

```bash
~/.claude/skills/[skill-name]/SKILL.md
```

Understand the current:

- Description (single-line with USE WHEN)
- Workflow routing (in markdown body)
- Existing naming conventions

---

## Step 3: Understand the Update

What needs to change?

- Adding a new workflow?
- Modifying the description/triggers?
- Updating documentation?

---

## Step 4: Make Changes

### To Add a New Workflow:

1. **Determine naming:**
   - PASS: `create.md`, `update_daemon_info.md`, `sync_repo.md`
   - FAIL: `Create.md`, `update-daemon-info.md`, `SYNC_REPO.md`

2. **Create the workflow file:**

```bash
touch ~/.claude/skills/[skill-name]/workflows/[workflow_name].md
```

Example:

```bash
touch ~/.claude/skills/daemon/workflows/update_public_repo.md
```

3. **Add entry to `## Workflow Routing` section in SKILL.md:**

```markdown
## Workflow Routing

| Workflow              | Trigger            | File                             |
| :-------------------- | :----------------- | :------------------------------- |
| **existing_workflow** | "existing trigger" | `workflows/existing_workflow.md` |
| **new_workflow**      | "new trigger"      | `workflows/new_workflow.md`      |
```

4. **Write the workflow content**

### To Update Triggers:

Modify the single-line `description` in YAML frontmatter:

```yaml
description: [What it does]. USE WHEN [updated intent triggers using OR]. [Capabilities].
```

### To Add a Tool:

1. **Create naming tool file:**

```bash
touch ~/.claude/skills/[skill-name]/tools/tool_name.ts
touch ~/.claude/skills/[skill-name]/tools/tool_name.help.md
```

2. **Ensure tools/ directory exists:**

```bash
mkdir -p ~/.claude/skills/[skill-name]/tools
```

---

## Step 5: Verify Naming

After making changes, verify naming:

```bash
ls ~/.claude/skills/[skill-name]/workflows/
ls ~/.claude/skills/[skill-name]/tools/
```

All files must use `lower_snake_case`:

- PASS: `workflow_name.md`
- PASS: `tool_name.ts`, `tool_name.help.md`
- FAIL: `WorkflowName.md`, `workflow-name.md`, `toolName.ts`

---

## Step 6: Final Checklist

### Naming Conventions

- [ ] New workflow files use `lower_snake_case`
- [ ] New tool files use `lower_snake_case`
- [ ] Routing table names match file names exactly

### Structure

- [ ] YAML still has single-line description with USE WHEN
- [ ] No separate `triggers:` or `workflows:` arrays in YAML
- [ ] Markdown body has `## Workflow Routing` section
- [ ] All routes point to existing files
- [ ] New workflow files have routing entries

---

## Done

Skill updated while maintaining canonical structure and naming conventions.
