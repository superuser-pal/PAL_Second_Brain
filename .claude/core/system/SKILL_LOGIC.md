---
title: PAL Skills System
version: 1.0.0
layer: SYSTEM
purpose: Mandatory configuration system and structure for all PAL skills
last_updated: 2026-03-17
---

## 1. Naming Conventions (MANDATORY)

| Category             | Convention            | Example                  |
| :------------------- | :-------------------- | :----------------------- |
| **Skill directory**  | `lower-kebab-case`    | `create-skill/`          |
| **SKILL.md**         | `UPPER_SNAKE_CASE.md` | `SKILL.md`               |
| **Workflow files**   | `lower_snake_case.md` | `create_post.md`         |
| **Reference docs**   | `lower_snake_case.md` | `prosody_guide.md`       |
| **Tool files**       | `lower_snake_case.ts` | `manage_server.ts`       |
| **YAML name**        | `lower-kebab-case`    | `name: create-skill`     |

---

## 2. Flat Folder Structure (MAX 2 LEVELS)

Skills MUST use a flat hierarchy. No `Context/` or `Docs/` or `Resources/` sub-directories.

✅ **ALLOWED (2 levels max):**
```text
skills/skill-name/SKILL.md
skills/skill-name/workflows/create.md
skills/skill-name/tools/generate.ts
skills/skill-name/context_file.md
```

---

## 3. Required SKILL.md Structure

Every `SKILL.md` has exactly two parts:

### Part 1: YAML Frontmatter (Single-line constraint)

```yaml
---
name: skill-name
description: [What it does]. USE WHEN [intent triggers using OR]. [Additional capabilities].
---
```
- `name` MUST match directory name.
- `description` MUST contain `USE WHEN` and be a single string (<1024 chars).
- NO separate array fields for triggers or workflows.

### Part 2: Markdown Body (Workflow Routing)

```markdown
# [Skill Name]
[Brief Description]

## Workflow Routing
| Workflow | Trigger | File |
|---|---|---|
| workflow_name | trigger description | `workflows/workflow_name.md` |

## Examples
Must contain 2-3 concrete usage examples showing input, workflow matched, and expected output.
```

---

## 4. Frontmatter-First Query Convention

**NEVER** use `cat` or read full file contents to filter/list. **ALWAYS** use `grep` on YAML frontmatter.
```bash
# CORRECT:
grep -l "status: active" Domains/*/01_PROJECTS/PROJECT_*.md | while read f; do grep -m5 "^status:\|^domain:" "$f"; done
```

---

## 5. Tool Integration Requirement

Every skill MUST have a `tools/` directory, even if empty.
Tools MUST:
- Be TypeScript (`.ts`) with `#!/usr/bin/env bun`
- Have a corresponding `.help.md` file
- Support `--help` flag
- Exit with standard codes (0=Success, 1=Fail)

---