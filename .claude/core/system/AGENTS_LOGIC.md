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
| **Invocation** | Default at session start  | `/[agent]` command        | Automatic (intent-based)          |
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
2. The specified domain must **already exist** at `Domains/[DomainName]/` with a valid `INDEX.md`.
3. If the domain does not exist, **stop and ask the user** to create it first (or invoke the `create-domain` skill) before continuing agent creation.
4. Do NOT create an agent file until the domain is confirmed to exist.

### Domain Binding Process

1. Agent specifies `domain: [domain-name]` in YAML frontmatter
2. System verifies `Domains/[DomainName]/INDEX.md` exists
3. INDEX.md serves as the **source of truth** for domain files
4. Agent author maps files from INDEX.md to `[AUTO]` or `[REF]`

---

## Naming Conventions (MANDATORY)

| Category               | Convention            | Example               | Purpose                  |
| :--------------------- | :-------------------- | :-------------------- | :----------------------- |
| **Agent file**         | `lower-kebab-case.md` | `blog-agent.md`       | Agent definition file    |
| **YAML name**          | `lower-kebab-case`    | `name: blog-agent`    | Matches file name        |
| **Domain field**       | `PascalCase`          | `domain: BlogContent` | Matches domain directory |
| **Invocation command** | `/[agent-name]`       | `/blog-agent`         | Load and activate agent  |
| **Dismiss command**    | `*dismiss`            | `*dismiss`            | End agent session        |

### Convention Rules

1. **Agent files** are single `.md` files in `.claude/agents/`
2. **No nested directories** in the agents folder
3. **Related files** live in their respective locations:
   - Workflows → `.claude/skills/[SkillName]/workflows/`
   - Templates → `.claude/skills/[SkillName]/templates/`
   - Domain context → `Domains/[DomainName]/`
4. **Invocation command** follows pattern: `/[agent-name]`
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
| **Domain Context** | `Domains/[DomainName]/`                 | `Domains/BlogContent/INDEX.md`                       |
| **Base Files**     | `.claude/core/`                         | `.claude/core/user/ABOUTME.md`                       |
| **Routing Table**  | `.claude/core/reference/`               | `.claude/core/reference/ROUTING_TABLE.md`            |

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

### Activation Protocol

Domain agents follow a 6-step boot sequence:

1. **Load Persona** — Agent file already in context
2. **Load Domain Files** — Execute AUTO files (INDEX.md)
3. **Load Domain Folders** — Index REF folders from domain
4. **Extract User Name** — From ABOUTME.md
5. **Display Greeting** — State role, show Command Menu
6. **Wait for Input** — STOP and wait (do not auto-execute)

---

## Context Model: Domain-Centric

Domain agents load context primarily from their domain. Base context (ABOUTME, DIRECTIVES, GUARDRAILS) is loaded automatically via the `session-start` hook and does not need to be explicitly managed by the agent.

### Domain Context (Mapped from INDEX.md)

Mapped from the domain's `INDEX.md`. Step 2 loads the domain files, and Step 3 indexes the folders.

Mapped from the domain's `INDEX.md`. Each agent author decides what is `[AUTO]` vs `[REF]`.

**Base domain structure:**

```
Domains/[DomainName]/
├── 00_CONTEXT/        # Domain-specific context and reference docs
├── 01_PROJECTS/       # Active project files
├── 02_SESSIONS/       # Session logs
├── 03_PAGES/         # Pages and reference materials
├── 04_WORKSPACE/        # Agent workspace and staging area
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

**Zero Trust Principle:** Default to `[REF]`. Only use `[AUTO]` for files required in every interaction. Domain `INDEX.md` is the standard Step 2 AUTO load.

### Example Configuration

**Step 2: Load Domain Files**

- [AUTO] `Domains/BlogContent/INDEX.md` — Domain source of truth

**Step 3: Load Domain Folders**

- [REF] `Domains/BlogContent/00_CONTEXT/` — Domain reference docs
- [REF] `Domains/BlogContent/01_PROJECTS/` — Active projects
- [REF] `Domains/BlogContent/02_SESSIONS/` — Session logs
- [REF] `Domains/BlogContent/03_PAGES/` — Reference materials
- [REF] `Domains/BlogContent/04_WORKSPACE/` — Agent workspace and staging area
- [REF] `Domains/BlogContent/05_ARCHIVE/` — Archived items
- [REF] `Domains/BlogContent/CONNECTIONS.yaml` — Integrations

---

## Registry Capability Model

Agent capabilities are registered in `.claude/core/reference/SYSTEM_INDEX.md` (the Skills Registry). Agents point to the registry instead of declaring capabilities inline.

### How It Works

1. Skills are assigned to agents via rows in SYSTEM_INDEX.md's Skills Registry table
2. When `*skills` is invoked, the agent reads SYSTEM_INDEX.md and filters for its own name
3. When `*workflows` is invoked, the agent reads the SKILL.md routing tables for its registered skills
4. Capabilities are scoped by the registry: an agent only has skills assigned to it in SYSTEM_INDEX.md
5. A skill can be assigned to multiple agents (one row per assignment)

### Example: Section 5 of a Domain Agent

```markdown
## 5. My Capabilities

My skills are registered in `.claude/core/reference/SYSTEM_INDEX.md`.

**View:** Read SYSTEM_INDEX.md, filter for `Agent: blog-agent`
**Add:** Add a row to the Skills Registry table with this agent's name

### Capability Rules

- If a skill is not registered to me in SYSTEM_INDEX.md, I do not have it
- Do not infer, hallucinate, or borrow capabilities from other agents
- Out of scope → suggest `*dismiss`
```

### Rules

- **Registry is source of truth:** skill-to-agent assignments live in SYSTEM_INDEX.md
- **Skill definitions stay in SKILL.md:** USE WHEN triggers, workflow routing, and documentation live in each skill's own file
- **No inference:** if a skill is not registered to this agent in SYSTEM_INDEX.md, it does not exist for this agent
- **No borrowing:** agents never access another agent's capabilities
- **Out of scope:** if a request needs capabilities this agent doesn't have, suggest `*dismiss` to return to PAL Master

### Routing Table (PAL Master Only)

PAL Master uses `ROUTING_TABLE.md` for the `*agents` command — a lightweight file listing all agents, their domains, and routing hints. Domain agents do NOT access this file.

### System Index (Writable Registry)

`SYSTEM_INDEX.md` is the writable capability registry located at `.claude/core/reference/SYSTEM_INDEX.md`. It records which skills belong to which agents. When creating a new skill, register it in SYSTEM_INDEX.md. When creating a new agent, register its skills in SYSTEM_INDEX.md.

---

## Agent Lifecycle

### 1. Loading

**Invocation:** `/[agent-name]`

**What Happens:**

1. PAL Master receives command
2. Agent file loaded from `.claude/agents/`
3. Control transfers to agent

### 2. Activation

**6-Step Protocol:**

1. **Load Persona** — Agent file already in context
2. **Load Domain Files** — Execute AUTO files (INDEX.md)
3. **Load Domain Folders** — Index REF folders from domain
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
- Loaded on demand via `/[agent]`
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

- [ ] `domain` field matches an existing directory in `Domains/`
- [ ] `Domains/[DomainName]/INDEX.md` exists
- [ ] Domain files mapped to [AUTO]/[REF] in Activation Protocol
- [ ] Domain INDEX.md marked as [AUTO]
- [ ] Minimum files marked [AUTO] (only essentials)

### 8-Section Structure

- [ ] Section 1: Identity & Persona (role, voice, principles)
- [ ] Section 2: Activation Protocol (6 steps)
- [ ] Section 3: Command Menu (unified table with actions)
- [ ] Section 4: How I Work (classify → route → execute pipeline)
- [ ] Section 5: My Capabilities (registry pointer to SYSTEM_INDEX.md with capability rules)
- [ ] Section 6: Session State Model (tracked data, reset rules)
- [ ] Section 7: Error Handling & Recovery (categories, protocol, degradation)
- [ ] Section 8: Operational Rules (numbered constraints)

### Context Configuration

- [ ] Domain Context: INDEX.md as [AUTO] in Step 2, folders as [REF] in Step 3
- [ ] Base context handled by hook (not in agent file)
- [ ] Zero Trust applied — minimal [AUTO] usage

### Capability Declaration

- [ ] Section 5 contains registry pointer to SYSTEM_INDEX.md
- [ ] Section 5 includes capability rules (no inference, no borrowing, out-of-scope → `*dismiss`)
- [ ] Skills registered in SYSTEM_INDEX.md for this agent
- [ ] Registered skills exist in `.claude/skills/`
- [ ] Capabilities align with agent's domain and responsibilities

### Post-Creation

- [ ] Agent added to `ROUTING_TABLE.md` (name, domain, location, routes_to)
- [ ] Skills registered in `SYSTEM_INDEX.md` Skills Registry table

### Operational Validation

- [ ] First-person voice enforced in rules
- [ ] `*dismiss` command included in menu
- [ ] Security validation referenced (GUARDRAILS.md)
- [ ] Stay-in-character rule included
- [ ] Out-of-scope handling defined (redirect to PAL Master)

---

## Summary

| Component               | Purpose                                                   | Required |
| :---------------------- | :-------------------------------------------------------- | :------- |
| **YAML Frontmatter**    | Agent metadata (name, description, version, domain)       | Yes      |
| **Identity & Persona**  | Role, voice, core principles                              | Yes      |
| **Activation Protocol** | 6-step startup sequence                                   | Yes      |
| **Command Menu**        | Unified command table with actions                        | Yes      |
| **How I Work**          | Classify → Route → Execute pipeline                       | Yes      |
| **My Capabilities**     | Registry pointer to SYSTEM_INDEX.md with capability rules | Yes      |
| **Session State Model** | What gets tracked and when it resets                      | Yes      |
| **Error Handling**      | Error categories, recovery protocol                       | Yes      |
| **Operational Rules**   | Numbered behavioral constraints                           | Yes      |

**Key Principles:**

1. **Single-file agents** — no nested directories, related files in their locations
2. **Mandatory domain binding** — every agent must bind to an existing domain
3. **Two-group context** — Base (3 fixed REFs) + Domain (configurable AUTO/REF)
4. **Registry capabilities** — skills assigned to agents in SYSTEM_INDEX.md, agents point to registry in Section 5
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
