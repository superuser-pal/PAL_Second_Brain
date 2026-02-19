---
title: PAL Agents System
version: 3.0.0
layer: SYSTEM
purpose: Configuration system, structure, and operational rules for PAL agents
last_updated: 2026-02-07
---

# PAL Agents System

**Specialized AI personas that handle domain-specific work through dedicated context, workflows, and operational rules.**

---

## THIS IS THE AUTHORITATIVE SOURCE

All agents in the PAL Second Brain **MUST** follow the structure and conventions defined in this document. When creating or modifying agents, reference this file for:

- Required file structure and naming
- Template sections and 8-section structure
- Two-group context loading (Base + Domain)
- Domain binding (mandatory) and file mapping
- Inline capability declaration (Section 5 of each agent)
- Activation and dismissal protocols

**Location:** `.claude/agents/`

---

## What Are Agents?

**Agents** are specialized AI personas configured with specific knowledge, responsibilities, and operational rules for extended domain work.

### Key Characteristics

| Characteristic       | Description                                                             |
| :------------------- | :---------------------------------------------------------------------- |
| **Persona**          | Defined role, identity, and communication style                         |
| **Domain**           | Bound to a specific domain (mandatory) with inherited context           |
| **Context**          | Two-group loading: Base (3 fixed REFs) + Domain (configurable AUTO/REF) |
| **Capabilities**     | Declared inline in agent file (Section 5: My Capabilities)              |
| **Responsibilities** | Specific tasks the agent handles                                        |
| **Lifecycle**        | Loaded on demand, dismissed when complete                               |
| **State**            | Maintains session context until dismissed                               |

### Agents vs Skills vs PAL Master

| Aspect         | PAL Master                | Agents                    | Skills                            |
| :------------- | :------------------------ | :------------------------ | :-------------------------------- |
| **Purpose**    | Orchestration and routing | Extended domain sessions  | Domain-specific capabilities      |
| **Duration**   | Always active             | Loaded for session        | Activated per task                |
| **Invocation** | Default at session start  | `/load-[agent]` command   | Automatic (intent-based)          |
| **Context**    | Base + System config      | Base + Domain             | Skill-specific only               |
| **Persona**    | Generalist orchestrator   | Domain specialist         | None (capability only)            |
| **State**      | Session-wide              | Until dismissed           | Stateless                         |
| **Example**    | Routes user to blog agent | Blog Agent writes content | Blogging skill provides workflows |

### When to Use Each

- **PAL Master:** General tasks, routing, system operations, quick queries
- **Agents:** Extended work in a single domain, multiple related tasks, deep expertise needed
- **Skills:** One-off domain tasks, workflow execution, capability access

---

## Mandatory Domain Binding

**Every agent MUST be bound to a domain. There are no agents without domains.**

### Rules

1. The `domain` field in YAML frontmatter is **required** — agent creation cannot proceed without it.
2. The specified domain must **already exist** at `domains/[domain-name]/` with a valid `INDEX.md`.
3. If the domain does not exist, **stop and ask the user** to create it first (or invoke the `create-domain` skill) before continuing agent creation.
4. Do NOT create an agent file until the domain is confirmed to exist.

### Domain Binding Process

1. Agent specifies `domain: [domain-name]` in YAML frontmatter
2. System verifies `domains/[domain-name]/INDEX.md` exists
3. INDEX.md serves as the **source of truth** for domain files
4. Agent author maps files from INDEX.md to `[AUTO]` or `[REF]`

---

## Naming Conventions (MANDATORY)

| Category               | Convention            | Example                | Purpose                  |
| :--------------------- | :-------------------- | :--------------------- | :----------------------- |
| **Agent file**         | `lower-kebab-case.md` | `blog-agent.md`        | Agent definition file    |
| **YAML name**          | `lower-kebab-case`    | `name: blog-agent`     | Matches file name        |
| **Domain field**       | `PascalCase`          | `domain: BlogContent`  | Matches domain directory |
| **Invocation command** | `/load-[agent-name]`  | `/load-blog-agent`     | Load and activate agent  |
| **Dismiss command**    | `*dismiss`            | `*dismiss`             | End agent session        |

### Convention Rules

1. **Agent files** are single `.md` files in `.claude/agents/`
2. **No nested directories** in the agents folder
3. **Related files** live in their respective locations:
   - Workflows → `.claude/skills/[SkillName]/workflows/`
   - Templates → `.claude/skills/[SkillName]/templates/`
   - Domain context → `domains/[domain-name]/`
4. **Invocation command** follows pattern: `/load-[agent-name]`
5. **Dismiss command** is always `*dismiss`

---

## Agent Structure

### File Layout

All agents are **single files** in the `.claude/agents/` directory:

```
.claude/agents/
├── pal-master.md          # Orchestration agent
├── blog-agent.md          # Domain agent for blogging
├── art-agent.md           # Domain agent for visual content
└── security-agent.md      # Domain agent for security audits
```

### Related Files Location

Agents reference files from their respective locations — no duplication:

| File Type          | Location                                | Example                                              |
| :----------------- | :-------------------------------------- | :--------------------------------------------------- |
| **Workflows**      | `.claude/skills/[SkillName]/workflows/` | `.claude/skills/Blogging/workflows/create-post.md`   |
| **Templates**      | `.claude/skills/[SkillName]/templates/` | `.claude/skills/Blogging/templates/post-template.md` |
| **Domain Context** | `domains/[DomainName]/`                 | `domains/BlogContent/INDEX.md`                       |
| **Base Files**     | `.claude/base/`                         | `.claude/base/user/ABOUTME.md`                       |
| **Routing Table**  | `.claude/base/reference/`               | `.claude/base/reference/ROUTING_TABLE.md`            |

---

## Agent Template

All agents follow the **8-section structure** defined below. See `agent_template.md` for the complete fillable template.

### YAML Frontmatter

```yaml
---
name: [agent-name]
description: [Brief description]
version: 1.0.0
domain: [domain-name]
---
```

**Required fields:** `name`, `description`, `version`, `domain`. No other fields.

### 8-Section Structure

Every domain agent must contain these 8 sections in order:

| #   | Section                       | Purpose                                                                  |
| --- | ----------------------------- | ------------------------------------------------------------------------ |
| 1   | **Identity & Persona**        | Role, voice, core principles — who the agent is                          |
| 2   | **Activation Protocol**       | 6-step boot sequence (see below)                                         |
| 3   | **Command Menu**              | Available commands with actions in a unified table                       |
| 4   | **How I Work**                | Classify → Route → Execute pipeline, plan protocol, execution oversight  |
| 5   | **My Capabilities**           | Inline declaration of skills, workflows, and prompts owned by this agent |
| 6   | **Session State Model**       | What gets tracked, what resets, when                                     |
| 7   | **Error Handling & Recovery** | Error categories, recovery protocol, graceful degradation                |
| 8   | **Operational Rules**         | Numbered behavioral constraints                                          |

---

## Context Model: Base + Domain

Domain agents load context from two groups. This replaces the previous four-layer model.

### Base Context (Fixed)

Three files, always `[REF]`. These are the same for every domain agent:

- [REF] `PAL_Base/User/ABOUTME.md` — Core Identity & Background
- [REF] `PAL_Base/User/DIRECTIVES.md` — Critical System Rules
- [REF] `PAL_Base/Security/GUARDRAILS.md` — Safety Validation

### Domain Context (Configurable)

Mapped from the domain's `INDEX.md`. Each agent author decides what is `[AUTO]` vs `[REF]`.

**Base domain structure:**

```
domains/[DomainName]/
├── 00_CONTEXT/        # Domain-specific context and reference docs
├── 01_PROJECTS/       # Active project files
├── 02_SESSIONS/       # Session logs
├── 03_ASSETS/         # Reference materials and resources
├── 04_OUTPUTS/        # Generated deliverables
├── 05_ARCHIVE/        # Completed or deprecated items
├── CONNECTIONS.yaml   # Domain connections and integrations
└── INDEX.md           # Domain source of truth (always AUTO)
```

This is the standard structure. Agent authors may add or remove folders based on domain needs, but this is the starting point.

### Loading Rules

| Mode       | Behavior                                | Use When                                      |
| :--------- | :-------------------------------------- | :-------------------------------------------- |
| **[AUTO]** | Read and load immediately at activation | Critical for all interactions (use sparingly) |
| **[REF]**  | Index path, load on demand              | Needed only for specific tasks                |

**Zero Trust Principle:** Default to `[REF]`. Only use `[AUTO]` for files required in every interaction. Domain `INDEX.md` is the one standard exception.

### Example Configuration

```markdown
**Base Context:**

- [REF] `PAL_Base/User/ABOUTME.md`
- [REF] `PAL_Base/User/DIRECTIVES.md`
- [REF] `PAL_Base/Security/GUARDRAILS.md`

**Domain Context (BlogContent):**

- [AUTO] `domains/BlogContent/INDEX.md` — Domain source of truth
- [REF] `domains/BlogContent/00_CONTEXT/` — Domain reference docs
- [REF] `domains/BlogContent/01_PROJECTS/` — Active projects
- [REF] `domains/BlogContent/02_SESSIONS/` — Session logs
- [REF] `domains/BlogContent/03_ASSETS/` — Reference materials
- [REF] `domains/BlogContent/04_OUTPUTS/` — Generated deliverables
- [REF] `domains/BlogContent/05_ARCHIVE/` — Archived items
- [REF] `domains/BlogContent/CONNECTIONS.yaml` — Integrations
```

---

## Inline Capability Model

Agent capabilities are declared **inline in the agent file** (Section 5: My Capabilities). A comprehensive read-only index is available in `.claude/base/reference/SYSTEM_INDEX.md`.

### How It Works

1. Each agent declares its own skills, workflows, and prompts directly in Section 5
2. When `*skills` or `*workflows` is invoked, the agent reads its own Section 5 — zero external file loads
3. Capabilities are scoped by architecture: an agent only sees what's in its own file
4. No filtering logic is needed — the boundary is structural, not procedural

### Example: Section 5 of a Blog Agent

```yaml
### Skills
- name: blogging
  location: .claude/skills/blogging/SKILL.md
  use_when: "User wants to write, edit, or manage blog posts"

- name: seo-optimizer
  location: .claude/skills/seo-optimizer/SKILL.md
  use_when: "User wants to optimize content for search engines"

### Workflows
- name: create-post
  source: blogging/create_post
  location: .claude/skills/blogging/workflows/create_post.md
  use_when: "User wants to write a new blog post"

- name: optimize-seo
  source: seo-optimizer/optimize_seo
  location: .claude/skills/seo-optimizer/workflows/optimize_seo.md
  use_when: "User wants to run SEO optimization on a post"
```

### Rules

- **Agent owns its capabilities:** skills, workflows, and prompts are declared in the agent's own file
- **No external lookup:** `*skills` and `*workflows` read Section 5 directly (already in context)
- **No inference:** if a capability is not listed in Section 5, it does not exist for this agent
- **No borrowing:** agents never access another agent's capabilities
- **Out of scope:** if a request needs capabilities this agent doesn't have, suggest `*dismiss` to return to PAL Master

### Routing Table (PAL Master Only)

PAL Master uses `ROUTING_TABLE.md` for the `*agents` command — a lightweight file listing all agents, their domains, and routing hints. Domain agents do NOT access this file.

### System Index (Reference Only)

`SYSTEM_INDEX.md` is a generated read-only file that provides a system-wide view of all capabilities across all agents. It is located in `.claude/base/reference/SYSTEM_INDEX.md` and is never loaded at runtime. It is regenerated by the `map-domain` workflow.

---

## Agent Lifecycle

### 1. Loading

**Invocation:** `/load-[agent-name]`

**What Happens:**

1. PAL Master receives command
2. Agent file loaded from `.claude/agents/`
3. Control transfers to agent

### 2. Activation

**6-Step Protocol:**

1. **Load Persona** — Agent file already in context
2. **Load Base Context** — Index 3 fixed REF files (ABOUTME, DIRECTIVES, GUARDRAILS)
3. **Load Domain Context** — Execute AUTO files (INDEX.md), index REF files from domain
4. **Extract User Name** — From ABOUTME.md
5. **Display Greeting** — State role, show Command Menu
6. **Wait for Input** — STOP and wait (do not auto-execute)

### 3. Session Management

**During Session:**

- Agent maintains character until dismissed
- Processes user input via Command Menu or natural language (Classify → Route → Execute)
- Loads [REF] files as needed
- Validates operations against GUARDRAILS.md
- Recognizes out-of-scope requests and suggests `*dismiss` to return to PAL Master

**Session State Tracks:**

- User name, loaded files (by group: Base / Domain), active skill/workflow, execution history, pending actions

### 4. Dismissal

**Command:** `*dismiss`

**What Happens:**

1. Agent confirms dismissal with user
2. Session state cleared
3. Control returns to PAL Master
4. PAL Master confirms return

---

## Agent Types

### Orchestration Agents

**Example:** PAL Master

**Characteristics:**

- Generalist routing and coordination
- Base + full system config access
- Routes to skills, agents, workflows
- Can list all agents via `ROUTING_TABLE.md`
- Always available (default at session start)

### Domain Agents

**Examples:** Blog Agent, Art Agent, Security Agent

**Characteristics:**

- Deep expertise in single domain
- Base + Domain context
- Bound to specific domain via `domain` field (mandatory)
- Domain INDEX.md as source of truth
- Capabilities declared inline (Section 5)
- Loaded on demand via `/load-[agent]`
- Redirects out-of-scope requests to PAL Master

### Comparison Table

| Aspect             | Orchestration Agent      | Domain Agent                  |
| :----------------- | :----------------------- | :---------------------------- |
| **Scope**          | System-wide              | Single domain                 |
| **Context**        | Base + System config     | Base + Domain                 |
| **Domain Binding** | None                     | Required                      |
| **Capabilities**   | Inline (Section 5)       | Inline (Section 5)            |
| **Agent Routing**  | Loads `ROUTING_TABLE.md` | No access to routing table    |
| **Expertise**      | Broad (routing)          | Deep (domain)                 |
| **Duration**       | Session-long             | Task-specific                 |
| **Loading**        | Default                  | On-demand                     |
| **Example Use**    | "Help me plan my week"   | "Write 3 blog posts about AI" |

---

## Complete Checklist

Before an agent is complete, verify the following:

### Structure

- [ ] Agent file exists in `.claude/agents/`
- [ ] Filename follows `lower-kebab-case.md` convention
- [ ] Single file (no nested directories)
- [ ] Document version and last updated at bottom

### YAML Frontmatter

- [ ] `name` field present (lower-kebab-case, matches filename)
- [ ] `description` field present
- [ ] `version` field present (semantic versioning)
- [ ] `domain` field present (valid, existing domain name)
- [ ] No extra fields (capabilities are declared inline in Section 5)

### Domain Binding

- [ ] `domain` field matches an existing directory in `domains/`
- [ ] `domains/[domain-name]/INDEX.md` exists
- [ ] Domain files mapped to [AUTO]/[REF] in Activation Protocol
- [ ] Domain INDEX.md marked as [AUTO]
- [ ] Minimum files marked [AUTO] (only essentials)

### 8-Section Structure

- [ ] Section 1: Identity & Persona (role, voice, principles)
- [ ] Section 2: Activation Protocol (6 steps)
- [ ] Section 3: Command Menu (unified table with actions)
- [ ] Section 4: How I Work (classify → route → execute pipeline)
- [ ] Section 5: My Capabilities (inline skills, workflows, prompts with use_when)
- [ ] Section 6: Session State Model (tracked data, reset rules)
- [ ] Section 7: Error Handling & Recovery (categories, protocol, degradation)
- [ ] Section 8: Operational Rules (numbered constraints)

### Context Configuration

- [ ] Base Context: 3 fixed REFs (ABOUTME, DIRECTIVES, GUARDRAILS)
- [ ] Domain Context: INDEX.md as [AUTO], other files as [REF]
- [ ] Zero Trust applied — minimal [AUTO] usage

### Capability Declaration

- [ ] Section 5 lists all skills owned by this agent (with location and use_when)
- [ ] Section 5 lists all workflows (with source, location, and use_when)
- [ ] Section 5 lists all prompts if any (with location and use_when)
- [ ] Listed skills exist in `.claude/skills/`
- [ ] Listed workflows exist in their respective skill directories
- [ ] Capabilities align with agent's domain and responsibilities
- [ ] Capability rules stated: no inference, no borrowing, out-of-scope → `*dismiss`

### Post-Creation

- [ ] Agent added to `ROUTING_TABLE.md` (name, domain, location, routes_to)
- [ ] `map-domain` run to regenerate `SYSTEM_INDEX.md`

### Operational Validation

- [ ] First-person voice enforced in rules
- [ ] `*dismiss` command included in menu
- [ ] Security validation referenced (GUARDRAILS.md)
- [ ] Stay-in-character rule included
- [ ] Out-of-scope handling defined (redirect to PAL Master)

---

## Summary

| Component               | Purpose                                                  | Required |
| :---------------------- | :------------------------------------------------------- | :------- |
| **YAML Frontmatter**    | Agent metadata (name, description, version, domain)      | Yes      |
| **Identity & Persona**  | Role, voice, core principles                             | Yes      |
| **Activation Protocol** | 6-step startup sequence                                  | Yes      |
| **Command Menu**        | Unified command table with actions                       | Yes      |
| **How I Work**          | Classify → Route → Execute pipeline                      | Yes      |
| **My Capabilities**     | Inline skills, workflows, prompts with use_when triggers | Yes      |
| **Session State Model** | What gets tracked and when it resets                     | Yes      |
| **Error Handling**      | Error categories, recovery protocol                      | Yes      |
| **Operational Rules**   | Numbered behavioral constraints                          | Yes      |

**Key Principles:**

1. **Single-file agents** — no nested directories, related files in their locations
2. **Mandatory domain binding** — every agent must bind to an existing domain
3. **Two-group context** — Base (3 fixed REFs) + Domain (configurable AUTO/REF)
4. **Inline capabilities** — skills, workflows, prompts declared in agent Section 5
5. **8-section structure** — consistent template for all domain agents
6. **INDEX.md as source of truth** — domain files discovered from INDEX.md
7. **Zero Trust context** — load only what's needed
8. **First-person voice** — agents speak as themselves
9. **Clear lifecycle** — load, activate, session, dismiss

---

**Document Version:** 3.0.0
**Last Updated:** 2026-02-07
**Related Files:** [ARCHITECTURE.md](ARCHITECTURE.md), [ORCHESTRATION.md](ORCHESTRATION.md), [SKILL_LOGIC.md](SKILL_LOGIC.md), [DOMAINS_LOGIC.md](DOMAINS_LOGIC.md), [WORKFLOWS.md](WORKFLOWS.md), [MEMORY_LOGIC.md](MEMORY_LOGIC.md), [TOOLBOX.md](TOOLBOX.md)

---
