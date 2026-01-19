# create-skill Workflow

Create a new skill following the canonical structure with proper lower-kebab-case and lower_snake_case naming.

## Step 1: Read the Authoritative Sources

**REQUIRED FIRST:**

1. Read the skill system documentation: `SKILL_LOGIC.md`
2. Read the canonical example: `~/.claude/skills/blogging/SKILL.md`

## Step 2: Understand the Request

Ask the user:

1. What does this skill do?
2. What should trigger it?
3. What workflows does it need?

## Step 3: Determine Naming

**Skill naming follows PAL's standard file naming conventions.**

| Component       | Format                | Example                 |
| :-------------- | :-------------------- | :---------------------- |
| Skill directory | `lower-kebab-case`    | `create-skill/`         |
| SKILL.md        | `UPPER_SNAKE_CASE.md` | `SKILL.md`              |
| Workflow files  | `lower_snake_case.md` | `create_skill.md`       |
| Reference docs  | `lower_snake_case.md` | `prosody_guide.md`      |
| Tool files      | `lower_snake_case.ts` | `manage_server.ts`      |
| Help files      | `lower_snake_case.md` | `manage_server.help.md` |
| YAML name       | `lower-kebab-case`    | `name: create-skill`    |

**Wrong naming (NEVER use):**

- `Blogging`, `CreateSkill`, `CREATESKILL` -> Use `blogging`, `create-skill`
- `Create.md`, `UpdateInfo.md`, `SYNC_REPO.md` -> Use `create.md`, `update_info.md`

## Step 4: Create the Skill Directory

```bash
mkdir -p ~/.claude/skills/[skill-name]/workflows
mkdir -p ~/.claude/skills/[skill-name]/tools
```

**Example:**

```bash
mkdir -p ~/.claude/skills/daemon/workflows
mkdir -p ~/.claude/skills/daemon/tools
```

## Step 5: Create SKILL.md

Follow this exact structure:

```yaml
---
name: skill-name
description: [What it does]. USE WHEN [intent triggers using OR]. [Additional capabilities].
---

# skill-name

[Brief description]

## Workflow Routing

| Workflow | Trigger | File |
| :--- | :--- | :--- |
| **workflow_one** | "trigger phrase" | `workflows/workflow_one.md` |
| **workflow_two** | "another trigger" | `workflows/workflow_two.md` |

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

User: "[Different request patterns]"
→ [Process]
→ [Output/result]

```

## [Additional Documentation]

[Any other relevant info]
```

## Step 6: Create Workflow Files

For each workflow in the routing section:

```bash
touch ~/.claude/skills/[skill-name]/workflows/[workflow_name].md
```

### Workflow-to-Tool Integration (REQUIRED for workflows with CLI tools)

**If a workflow calls a CLI tool, it MUST include intent-to-flag mapping tables.**

This pattern translates natural language user requests into appropriate CLI flags:

```markdown
## Intent-to-Flag Mapping

### Model/Mode Selection

| User Says                         | Flag            | When to Use      |
| --------------------------------- | --------------- | ---------------- |
| "fast", "quick", "draft"          | `--model haiku` | Speed priority   |
| (default), "best", "high quality" | `--model opus`  | Quality priority |

### Output Options

| User Says     | Flag            | Effect            |
| ------------- | --------------- | ----------------- |
| "JSON output" | `--format json` | Machine-readable  |
| "detailed"    | `--verbose`     | Extra information |

## Execute Tool

Based on user request, construct the CLI command:

\`\`\`bash
bun tool_name.ts \
 [FLAGS_FROM_INTENT_MAPPING] \
 --required-param "value"
\`\`\`
```

**Why this matters:**

- Tools have rich configuration via flags
- Workflows should expose this flexibility, not hardcode single patterns
- Users speak naturally; workflows translate to precise CLI

**Reference:** `TOOLBOX.md`

**Examples (lower_snake_case):**

```bash
touch ~/.claude/skills/daemon/workflows/update_daemon_info.md
touch ~/.claude/skills/daemon/workflows/update_public_repo.md
touch ~/.claude/skills/blogging/workflows/create.md
touch ~/.claude/skills/blogging/workflows/publish.md
```

## Step 7: Verify Naming

Run this check:

```bash
ls ~/.claude/skills/[skill-name]/
ls ~/.claude/skills/[skill-name]/workflows/
ls ~/.claude/skills/[skill-name]/tools/
```

Verify ALL files follow the correct naming:

- `SKILL.md` (uppercase)
- `workflow_name.md` (lower_snake_case)
- `tool_name.ts` (lower_snake_case)
- `tool_name.help.md` (lower_snake_case)

## Step 8: Final Checklist

### Naming Conventions

- [ ] Skill directory uses lower-kebab-case (e.g., `blogging/`, `daemon/`)
- [ ] YAML `name:` uses lower-kebab-case (matches directory)
- [ ] All workflow files use lower_snake_case (e.g., `create.md`, `update_info.md`)
- [ ] All reference docs use lower_snake_case (e.g., `prosody_guide.md`)
- [ ] All tool files use lower_snake_case (e.g., `manage_server.ts`)
- [ ] Routing table workflow names match file names exactly

### YAML Frontmatter

- [ ] Single-line `description` with embedded `USE WHEN` clause
- [ ] No separate `triggers:` or `workflows:` arrays
- [ ] Description uses intent-based language
- [ ] Description under 1024 characters

### Markdown Body

- [ ] `## Workflow Routing` section with table format
- [ ] All workflow files have routing entries
- [ ] `## Examples` section with 2-3 concrete usage patterns

### Structure

- [ ] `tools/` directory exists (even if empty)
- [ ] No `backups/` directory inside skill
- [ ] Workflows contain ONLY work execution procedures
- [ ] Reference docs live at skill root (not in workflows/)
- [ ] Each CLI tool has a corresponding `.help.md` documentation file

## Done

Skill created following canonical structure with proper naming conventions throughout.
