---
name: create-agent
description: Create and validate domain agents. USE WHEN create agent, new agent, agent structure, validate agent, check agent, domain agent. AgentSearch('create-agent') for docs.
---

# create-agent

MANDATORY agent creation framework for ALL domain agent creation requests.

## Authoritative Sources

**Before creating ANY agent, READ:**

- `AGENTS_LOGIC.md` — Agent structure, context model, and 8-section template
- `DOMAINS_LOGIC.md` — Domain structure and binding

## Naming Conventions (MANDATORY)

| Category          | Convention         | Example                | Purpose                               |
| :---------------- | :----------------- | :--------------------- | :------------------------------------ |
| **Agent file**    | `lower-kebab-case` | `blog-agent.md`        | Agent definition in `.claude/agents/` |
| **YAML name**     | `lower-kebab-case` | `name: blog-agent`     | Matches file name                     |
| **Domain field**  | `lower-kebab-case` | `domain: blog-content` | Matches domain directory              |
| **Routing entry** | `lower-kebab-case` | `name: blog-agent`     | Entry in `ROUTING_TABLE.md`           |

**Key Rules:**

- Agents are **single files** in `.claude/agents/` (NO directories)
- Every agent must bind to an existing domain via `domain:` field
- YAML contains only 4 fields: `name`, `description`, `version`, `domain`
- Capabilities (skills, workflows, prompts) are declared **inline in Section 5** of the agent file

---

## Pre-Creation Checks (MANDATORY)

Before creating any agent file, verify:

1. **Domain exists** — Check that `domains/[domain-name]/INDEX.md` exists
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
2. Check if domains/blog-content/ exists with INDEX.md
   → If missing: STOP, ask user to create domain first
   → If exists: proceed
3. Create blog-agent.md in .claude/agents/ using agent_template.md
   → YAML: name, description, version, domain (4 fields only)
   → 8-section structure: Identity, Activation, Menu, How I Work,
     My Capabilities, State, Errors, Rules
   → Base Context: 3 fixed REFs (ABOUTME, DIRECTIVES, GUARDRAILS)
   → Domain Context: INDEX.md as [AUTO], domain folders as [REF]
   → Section 5: declare skills/workflows/prompts inline with use_when triggers
4. Add agent to ROUTING_TABLE.md
   → name, domain, location, routes_to (one line)
5. Run validation checklist from AGENTS_LOGIC.md
6. Suggest running map-domain to regenerate SYSTEM_INDEX.md
```

**Example 2: Validate an existing agent**

```
User: "Validate the security-agent"
1. Read agent file from .claude/agents/security-agent.md
2. Check YAML frontmatter:
   → Has exactly 4 fields: name, description, version, domain
   → No skills/workflows/prompts in YAML
3. Validate domain binding:
   → Domain exists at domains/[domain-name]/
   → INDEX.md present in domain directory
4. Validate 8-section structure:
   → Identity & Persona, Activation Protocol, Command Menu,
     How I Work, My Capabilities, Session State Model,
     Error Handling & Recovery, Operational Rules
5. Validate Section 5 (My Capabilities):
   → Skills listed with name, location, use_when
   → Workflows listed with name, source, location, use_when
   → Listed skills exist in .claude/skills/
   → Listed workflows exist in their respective skill directories
   → Capability rules present (no inference, no borrowing, out-of-scope → *dismiss)
6. Check ROUTING_TABLE.md for matching entry
7. Validate context configuration:
   → Base Context: 3 fixed REFs
   → Domain Context: INDEX.md as [AUTO], others as [REF]
8. Report issues with specific fixes
```

**Example 3: Create agent for non-existent domain**

```
User: "Create a project-alpha agent"
1. Check domains/project-alpha/ → NOT FOUND
2. STOP — inform user: "The domain 'project-alpha' doesn't exist yet.
   Would you like me to create it first?"
3. If user confirms: invoke create-domain skill
4. Once domain exists with INDEX.md: proceed with agent creation (Example 1)
```

**Example 4: Adapt a non-standard agent**

```
User: "Adapt this custom agent to the PAL template"
1. Read existing agent file
2. Identify non-standard sections or complex logic
3. Create domains/[domain]/00_CONTEXT/[agent]_logic.md
4. Move custom logic to the new context file
5. Re-author the agent file using agent_template.md
6. Reference the logic file in Activation Protocol (Section 2)
7. Run validate-agent to confirm compliance
```

---

## Quick Reference

**Agent File Location:** `.claude/agents/[agent-name].md`

**Required YAML Fields (4 only):**

- `name` — lower-kebab-case, matches filename
- `description` — Brief purpose
- `version` — Semantic version
- `domain` — Must match an existing domain in `domains/`

**No other YAML fields.** Capabilities are declared inline in Section 5.

**8-Section Structure:**

1. Identity & Persona
2. Activation Protocol (6 steps)
3. Command Menu
4. How I Work (Classify → Route → Execute)
5. My Capabilities (inline skills, workflows, prompts)
6. Session State Model
7. Error Handling & Recovery
8. Operational Rules

**Context Model (Base + Domain):**

- Base: [REF] ABOUTME.md, DIRECTIVES.md, GUARDRAILS.md
- Domain: [AUTO] INDEX.md + [REF] domain folders

**Base Domain Structure:**

```
domains/[domain-name]/
├── 00_CONTEXT/
├── 01_PROJECTS/
├── 02_SESSIONS/
├── 03_ASSETS/
├── 04_OUTPUTS/
├── 05_ARCHIVE/
├── CONNECTIONS.yaml
└── INDEX.md
```

**Post-Creation Steps:**

1. Add agent entry to `PAL_Base/System/ROUTING_TABLE.md` (name, domain, location, routes_to)
2. Run `map-domain` to regenerate `SYSTEM_INDEX.md`

**Full Template:** See `agent_template.md`
