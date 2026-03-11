---
name: create-agent
description: Create and validate domain agents. USE WHEN create agent, new agent, agent structure, validate agent, check agent, domain agent. AgentSearch('create-agent') for docs.
user-invocable: false
---

# create-agent

MANDATORY agent creation system for ALL domain agent creation requests.

## Authoritative Sources

**Before creating ANY agent, READ:**

- `AGENT_BASE.md` — Shared default behavior inherited by all agents
- `AGENTS_LOGIC.md` — Agent structure, lean 8-section format
- `DOMAINS_LOGIC.md` — Domain structure and binding

## Naming Conventions (MANDATORY)

| Category          | Convention         | Example               | Purpose                               |
| :---------------- | :----------------- | :-------------------- | :------------------------------------ |
| **Agent file**    | `lower-kebab-case` | `blog-agent.md`       | Agent definition in `.claude/agents/` |
| **YAML name**     | `lower-kebab-case` | `name: blog-agent`    | Matches file name                     |
| **Domain field**  | `PascalCase`       | `domain: BlogContent` | Matches domain directory              |
| **Routing entry** | `lower-kebab-case` | `name: blog-agent`    | Entry in `ROUTING_TABLE.md`           |

**Key Rules:**

- Agents are **single files** in `.claude/agents/` (NO directories)
- Every agent must bind to an existing domain via `domain:` field
- YAML contains only 4 fields: `name`, `description`, `version`, `domain`
- Agents inherit shared behavior from `AGENT_BASE.md` — only domain-specific content in agent file
- The agent file IS the user's customization surface — no separate customize.md files

---

## Pre-Creation Checks (MANDATORY)

Before creating any agent file, verify:

1. **Domain exists** — Check that `domains/[DomainName]/INDEX.md` exists
2. **If domain missing** — STOP. Ask user to create the domain first (or invoke `create-domain` skill). Do NOT create an agent without a valid domain.
3. **No duplicate** — Check `.claude/agents/` for an existing agent with the same name

---

## Workflow Routing

| Workflow           | Trigger                         | File                          |
| :----------------- | :------------------------------ | :---------------------------- |
| **create_agent**   | "create agent", "new agent"     | `workflows/create_agent.md`   |
| **validate_agent** | "validate agent", "check agent" | `workflows/validate_agent.md` |
| **adapt_agent**    | "adapt agent", "fix agent"      | `workflows/adapt_agent.md`    |

---

## Examples

**Example 1: Create a new domain agent**

```
User: "Create an agent for my blog content"
1. Read AGENTS_LOGIC.md and DOMAINS_LOGIC.md
2. Check if domains/BlogContent/ exists with INDEX.md
   → If missing: STOP, ask user to create domain first
   → If exists: proceed
3. Create blog-agent.md in .claude/agents/ using agent_template.md
   → YAML: name, description, version, domain (4 fields only)
   → 8-section structure: Identity, Activation Files, Activation Folders,
     Persistent Memories, Custom Critical Actions, Custom Menu Items,
     Custom Prompts, Custom Domain Context
   → Domain Context: INDEX.md as [AUTO], domain folders as [REF]
4. Add agent to ROUTING_TABLE.md
   → name, domain, location, routes_to (one line)
5. Register skills in SYSTEM_INDEX.md
6. Run validation checklist from AGENTS_LOGIC.md
```

**Example 2: Validate an existing agent**

```
User: "Validate the security-agent"
1. Read agent file from .claude/agents/security-agent.md
2. Check YAML frontmatter:
   → Has exactly 4 fields: name, description, version, domain
3. Validate domain binding:
   → Domain exists at domains/[DomainName]/
   → INDEX.md present in domain directory
4. Validate 8-section structure:
   → Identity & Persona, Activation Files, Activation Folders,
     Persistent Memories, Custom Critical Actions, Custom Menu Items,
     Custom Prompts, Custom Domain Context
5. Verify NO shared content duplicated from AGENT_BASE.md:
   → No Voice section, no Core Principles, no Plan-Before-Execute,
     no Classify-Route-Execute, no standard menu items
6. Check ROUTING_TABLE.md and SYSTEM_INDEX.md for matching entries
7. Report issues with specific fixes
```

---

## Quick Reference

**Agent File Location:** `.claude/agents/[agent-name].md`

**Required YAML Fields (4 only):**

- `name` — lower-kebab-case, matches filename
- `description` — Brief purpose
- `version` — Semantic version
- `domain` — PascalCase, must match an existing domain in `domains/`

**No other YAML fields.**

**Lean Agent Structure (8 sections, inherits from AGENT_BASE.md):**

1. Identity & Persona (role, communication traits)
2. Activation Files ([AUTO]/[REF] files)
3. Activation Folders ([AUTO]/[REF] folders)
4. Persistent Memories
5. Custom Critical Actions
6. Custom Menu Items (#7+)
7. Custom Prompts
8. Custom Domain Context

**Context Model (Base + Domain):**

- Base: [REF] ABOUTME.md, DIRECTIVES.md, GUARDRAILS.md
- Domain: [AUTO] INDEX.md + [REF] domain folders

**Post-Creation Steps:**

1. Add agent entry to `.claude/core/reference/ROUTING_TABLE.md` (name, domain, location, routes_to)
2. Register skills in `SYSTEM_INDEX.md` Skills Registry with Routes To column

**Full Template:** See `agent_template.md`
