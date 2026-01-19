---
name: create-agent
description: Create and validate domain agents. USE WHEN create agent, new agent, agent structure, validate agent, check agent, domain agent. AgentSearch('create-agent') for docs.
---

# create-agent

MANDATORY agent creation framework for ALL domain agent creation requests.

## Authoritative Sources

**Before creating ANY agent, READ:**

- `AGENTS_LOGIC.md` - Agent structure and four-layer context
- `DOMAINS_LOGIC.md` - Domain structure and binding

## Naming Conventions (MANDATORY)

| Category         | Convention         | Example            | Purpose                           |
| :--------------- | :----------------- | :----------------- | :-------------------------------- |
| **Agent file**   | `lower-kebab-case` | `blog-agent.md`    | Agent definition in `.claude/agents/` |
| **YAML name**    | `lower-kebab-case` | `name: blog-agent` | Matches file name                 |
| **Domain field** | `lower-kebab-case` | `domain: blog-content` | Matches domain directory       |

**Key Rules:**

- Agents are **single files** in `.claude/agents/` (NO directories)
- Every agent must bind to a domain via `domain:` field
- Agents load four-layer context: USER, SYSTEM, SECURITY, DOMAIN

---

## Workflow Routing

| Workflow           | Trigger                              | File                          |
| :----------------- | :----------------------------------- | :---------------------------- |
| **create_agent**   | "create agent", "new agent"          | `workflows/create_agent.md`   |
| **validate_agent** | "validate agent", "check agent"      | `workflows/validate_agent.md` |

## Examples

**Example 1: Create a new domain agent**

```
User: "Create an agent for my blog content"
-> Invokes create_agent workflow
-> Reads AGENTS_LOGIC.md and DOMAINS_LOGIC.md
-> Checks if blog-content domain exists (creates if not)
-> Creates blog-agent.md with four-layer context
-> Configures domain binding and capability binding
```

**Example 2: Validate an existing agent**

```
User: "Validate the security-agent"
-> Invokes validate_agent workflow
-> Reads agent file from .claude/agents/
-> Checks YAML frontmatter (name, description, version, domain)
-> Validates domain exists and INDEX.md present
-> Verifies four-layer context configuration
-> Reports issues with specific fixes
```

**Example 3: Create agent for non-existent domain**

```
User: "Create a project-alpha agent"
-> Invokes create_agent workflow
-> Checks domains/project-alpha/ - not found
-> Invokes create-domain skill to create domain first
-> Creates project-alpha-agent.md with domain binding
-> Configures [AUTO]/[REF] loading from INDEX.md
```

## Quick Reference

**Agent File Location:** `.claude/agents/[agent-name].md`

**Required YAML Fields:**

- `name` - lower-kebab-case
- `description` - Brief purpose
- `version` - Semantic version
- `domain` - Domain to bind to

**Optional YAML Fields:**

- `skills` - List of skills
- `workflows` - Specific workflows (format: `skill-name/workflow_name`)
- `prompts` - Prompt templates

**Four-Layer Context:**

1. USER - Identity, preferences (`.claude/base/user/`)
2. SYSTEM - Architecture, workflows (`.claude/base/system/`)
3. SECURITY - Guardrails, policies (`.claude/base/security/`)
4. DOMAIN - Domain-specific context (`domains/[domain-name]/`)

**Full Template:** See `agent_template.md`
