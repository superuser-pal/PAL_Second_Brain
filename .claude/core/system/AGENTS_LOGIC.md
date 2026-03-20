---
title: PAL Agents System
version: 1.0.0
layer: SYSTEM
purpose: Strict configuration schema for PAL Agents
last_updated: 2026-03-17
---

## 1. Absolute Constraints

- **Single File:** Agents exist purely as a single `.md` file in `.claude/agents/`. No subdirectories.
- **Domain Binding:** EVERY agent MUST have a `domain:` field in its YAML matching an existing `Domains/[Domain]/INDEX.md`.
- **System Index:** Capabilities are defined centrally in `.claude/core/reference/SYSTEM_INDEX.md`. The agent does not hardcode its skills.

---

## 2. Naming Conventions

| Entity | Pattern | Example |
|---|---|---|
| Agent File | `lower-kebab-case.md` | `blog-agent.md` |
| YAML Name | `lower-kebab-case` | `name: blog-agent` |
| Domain Field| `PascalCase` | `domain: BlogContent` |
| Invocation | `/[agent-name]` | `/blog-agent` |

---

## 3. Strict 9-Section File Schema

Every Agent file MUST follow this exact markdown structure inheriting from `AGENT_BASE.md`:

```markdown
---
name: [agent-name]
description: [Brief description]
version: X.Y.Z
domain: [DomainName]
---

# [Agent Name]
> Inherits shared behavior from `.claude/core/system/AGENT_BASE.md`

## 1. Identity & Persona
- Role description and communication constraints.

## 2. Activation Files
- [AUTO] `Domains/[DomainName]/INDEX.md` (Always auto)

## 3. Activation Folders
- [REF] folders (e.g. `00_CONTEXT/`, `01_PROJECTS/`)

## 4. Persistent Memories
- Hardcoded domain facts to remember across sessions.

## 5. Custom Critical Actions
- Any execution rules that override base behavior.

## 6. Custom Menu Items
- `*custom_command` - description -> action

## 7. Routing Examples
- Edge case routing specific to this domain.

## 8. Custom Prompts
- Behavioral tuning for the specific domain persona.

## 9. Custom Domain Context
- Exceptions to the standard routing structure.
```

---

## 4. Two-Group Context Loading Model

Domain Agents enforce standard isolation by loading ONLY:
1. **Base Context (Fixed by System):** `ABOUTME.md`, `DIRECTIVES.md`, `GUARDRAILS.md`
2. **Domain Context (Configured in sections 2/3):** Mapped strictly from `INDEX.md`. Use `[AUTO]` for immediate memory load, `[REF]` for indexing only.

---

## 5. Agent Lifecycle & `.current-session`

Every agent load/dismiss cycle MUST maintain `.claude/sessions/.current-session`:

**On agent load:**
- Write the following YAML to `.claude/sessions/.current-session` (overwrite any existing content):
  ```yaml
  ---
  agent: [agent-name]
  domain: [DomainName]
  loaded_paths:
    - [path to each Always Load file]
  loaded_at: [ISO 8601 timestamp]
  ---
  ```
- This supports mid-session agent switching — the file always reflects the **currently active** agent.

**On `*dismiss`:**
- Clear `.claude/sessions/.current-session` by writing an empty file.

**Consumers:**
- `distribute_notes` workflow reads this file to build an enriched candidate pool without cold scanning agent-loaded files.
- If file is empty or absent, consumers treat it as "no agent active" and fall back to cold scan.

---

