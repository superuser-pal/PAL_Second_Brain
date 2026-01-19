---
title: PAL Agents System
version: 1.1.0
layer: SYSTEM
purpose: Configuration system, structure, and operational rules for PAL agents
last_updated: 2026-01-18
---

# PAL Agents System

**Specialized AI personas that handle domain-specific work through dedicated context, workflows, and operational rules.**

---

## THIS IS THE AUTHORITATIVE SOURCE

All agents in the PAL Framework **MUST** follow the structure and conventions defined in this document. When creating or modifying agents, reference this file for:

- Required file structure and naming
- Template sections and content
- Four-layer context loading (USER, SYSTEM, SECURITY, DOMAIN)
- Domain binding and file mapping
- **Capability binding (skills, workflows, prompts)**
- Activation and dismissal protocols

**Location:** `.claude/agents/`

---

## What Are Agents?

**Agents** are specialized AI personas configured with specific knowledge, responsibilities, and operational rules for extended domain work.

### Key Characteristics

| Characteristic | Description |
| :------------- | :---------- |
| **Persona** | Defined role, identity, and communication style |
| **Domain** | Bound to a specific domain with inherited context |
| **Context** | Four-layer loading (USER, SYSTEM, SECURITY, DOMAIN) |
| **Capabilities** | Bound to specific skills, workflows, and prompts |
| **Responsibilities** | Specific tasks the agent handles |
| **Lifecycle** | Loaded on demand, dismissed when complete |
| **State** | Maintains session context until dismissed |

### Agents vs Skills vs PAL Master

| Aspect | PAL Master | Agents | Skills |
| :----- | :--------- | :----- | :----- |
| **Purpose** | Orchestration and routing | Extended domain sessions | Domain-specific capabilities |
| **Duration** | Always active | Loaded for session | Activated per task |
| **Invocation** | Default at session start | `/load-[agent]` command | Automatic (intent-based) |
| **Context** | Full Base (USER + SYSTEM + SECURITY) | Four layers (USER + SYSTEM + SECURITY + DOMAIN) | Skill-specific only |
| **Persona** | Generalist orchestrator | Domain specialist | None (capability only) |
| **State** | Session-wide | Until dismissed | Stateless |
| **Example** | Routes user to blog agent | Blog Agent writes content | Blogging skill provides workflows |

### When to Use Each

- **PAL Master:** General tasks, routing, system operations, quick queries
- **Agents:** Extended work in a single domain, multiple related tasks, deep expertise needed
- **Skills:** One-off domain tasks, workflow execution, capability access

---

## Naming Conventions (MANDATORY)

| Category | Convention | Example | Purpose |
| :------- | :--------- | :------ | :------ |
| **Agent file** | `lower-kebab-case.md` | `blog-agent.md` | Agent definition file |
| **Invocation command** | `/load-[agent-name]` | `/load-blog-agent` | Load and activate agent |
| **Dismiss command** | `*dismiss` | `*dismiss` | End agent session |

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

Agents reference files from their respective locations—no duplication:

| File Type | Location | Example |
| :-------- | :------- | :------ |
| **Workflows** | `.claude/skills/[SkillName]/workflows/` | `.claude/skills/Blogging/workflows/create-post.md` |
| **Templates** | `.claude/skills/[SkillName]/templates/` | `.claude/skills/Blogging/templates/post-template.md` |
| **Domain Context** | `domains/[domain-name]/` | `domains/blog-content/INDEX.md` |
| **Base Files** | `.claude/base/` | `.claude/base/user/ABOUTME.md` |

---

## Agent Template

All agents use the **full template** with domain binding and four-layer context configuration.

### Template Structure

```markdown
---
name: agent-name
description: Brief description of what this agent does
version: 1.0.0
domain: domain-name
skills:
  - skill-name-1
  - skill-name-2
workflows:
  - skill-name-1/workflow_name
  - skill-name-2/another_workflow
prompts:
  - prompt-name-1
  - prompt-name-2
---

# [Agent Name]

[One-line description of the agent's purpose]

You must fully embody this agent's persona and follow all activation instructions exactly as specified. NEVER break character until given a dismiss command.

---

## Activation Protocol

**CRITICAL: Execute these steps BEFORE any user interaction.**

---

### Context Management (CRITICAL)

**Strictly limit context loading.** Do NOT load any files, logs, or context unless explicitly:

1. Requested by the User.
2. Defined in the Agent's specific requirements.
3. Directed by the PAL Master.

**Goal:** Zero unnecessary token usage. Assume a "Zero Trust" approach to context—verify relevance before reading.

---

### Step 1: Load Persona

Load this agent file (already in context). You are now [Agent Name].

### Step 2: Load Context Configuration

**Context Configuration Instructions:**

- **[AUTO]**: Read and load this file immediately.
- **[REF]**: Index this path but do **not** read content until requested.

**USER Layer (Identity & Preferences):**

- [REF] `.claude/base/user/ABOUTME.md` - Core Identity & Background
- [REF] `.claude/base/user/DIRECTIVES.md` - Critical System Rules
- [REF] `.claude/base/user/TECHSTACK.md` - Technology Preferences
- [REF] `.claude/base/user/TERMINOLOGY.md` - Vocabulary Definitions

**SYSTEM Layer (Architecture & Logic):**

- [REF] `.claude/base/system/ORCHESTRATION.md` - Routing & Responsibilities
- [REF] `.claude/base/system/WORKFLOWS.md` - Execution Patterns
- [REF] `.claude/base/system/AGENTS_LOGIC.md` - Agent Configuration

**SECURITY Layer (Safety & Policies):**

- [REF] `.claude/base/security/GUARDRAILS.md` - Safety Validation
- [REF] `.claude/base/security/REPOS_RULES.md` - Code Policy

**DOMAIN Layer (Inherited from domain field):**

- [AUTO] `domains/[domain-name]/INDEX.md` - Domain Source of Truth
- [Map files from INDEX.md to AUTO/REF based on relevance]

**CAPABILITIES (from skills/workflows/prompts fields):**

- [REF] Skills defined in `skills:` field
- [REF] Workflows defined in `workflows:` field
- [REF] Prompts defined in `prompts:` field

### Step 3: Extract User Name

From ABOUTME.md, extract and remember the user's name.

### Step 4: Display Greeting and Menu

Greet the user by name, then display the numbered menu below.

### Step 5: Wait for Input

**STOP and WAIT** for user input. Do NOT execute menu items automatically.

---

## Persona

**Role:** [Primary function]

**Identity:** [Detailed description of who/what the agent is]

**Communication Style:**

- [Style point 1]
- [Style point 2]
- [Style point 3]
- [Style point 4]

**Core Principles:**

- [Principle 1]
- [Principle 2]
- [Principle 3]
- [Principle 4]

---

## Menu

**Available Commands:**

| # | Command | Description |
| --- | ------- | ----------- |
| 1 | `*menu` | Redisplay this menu |
| 2 | `*[command]` | [Description] |
| 3 | `*[command]` | [Description] |
| 4 | `*context` | Show loaded context and session state |
| 5 | `*help` | Agent help and documentation |
| 6 | `*dismiss` | Dismiss this agent |

---

## Menu Handlers

### Input Processing

On user input: **Number** → execute menu item | **`*command`** → match command (case-insensitive) | **Natural language** → classify intent and route | **No match** → show "Enter *menu to see options"

### Handler Actions

| Command | Action |
| ------- | ------ |
| `*menu` | Redisplay the menu table |
| `*[command]` | [Detailed action description] |
| `*context` | Show loaded files by layer, active state |
| `*help` | Show agent capabilities and responsibilities |
| `*dismiss` | End agent session, return to PAL Master |

---

## Core Responsibilities

### 1. [Responsibility Name]

[Detailed description of what this responsibility involves]

- [Sub-point 1]
- [Sub-point 2]
- [Sub-point 3]

### 2. [Responsibility Name]

[Description]

### 3. [Responsibility Name]

[Description]

---

## Operational Rules

1. **First-Person Voice** - Always use "I", "my", "me" - never "[Agent Name] does" or "the system"
2. **Runtime Loading** - Load files only when executing user-chosen workflow or command
3. **Menu Display** - Show items in order given, accept number or command trigger
4. **Stay in Character** - Remain as [Agent Name] until *dismiss command
5. **Security First** - Validate operations against GUARDRAILS.md before execution
6. **[Domain-specific rule]** - [Description]

---

## Greeting Template

```
Hello, [USER_NAME]! I'm [Agent Name], your [role description].

I have access to [relevant context] and can help you with:
- [Capability 1]
- [Capability 2]
- [Capability 3]

**Menu Options:**

1. *menu - Redisplay menu
2. *[command] - [Description]
3. *[command] - [Description]
4. *context - Show loaded context
5. *help - Agent help
6. *dismiss - End session

What would you like to do? (Enter number, command, or describe your task)
```

---

**Document Version:** 1.0.0
**Last Updated:** YYYY-MM-DD
**Related Files:** [List relevant files]

---
```

### YAML Frontmatter Fields

| Field | Required | Description |
| :---- | :------- | :---------- |
| `name` | Yes | Agent identifier in `lower-kebab-case` |
| `description` | Yes | Brief description of agent purpose |
| `version` | Yes | Semantic version (e.g., `1.0.0`) |
| `domain` | Yes | Domain name this agent is bound to (e.g., `blog-content`) |
| `skills` | No | List of skills this agent has access to |
| `workflows` | No | List of specific workflows (format: `skill-name/workflow_name`) |
| `prompts` | No | List of prompt templates available to this agent |

---

## Capability Binding

Agents can be bound to specific **skills**, **workflows**, and **prompts**. This defines what capabilities the agent has access to during its session.

### Why Bind Capabilities?

- **Focus:** Limit agent to relevant capabilities only
- **Clarity:** User knows exactly what the agent can do
- **Context efficiency:** Only load context for bound capabilities
- **Expertise:** Agent becomes expert in its specific toolset

### Skills Binding

List the skills this agent has access to:

```yaml
skills:
  - blogging           # Full access to blogging skill
  - art                # Full access to art skill
```

**What this means:**
- Agent can invoke any workflow within the listed skills
- Agent has access to skill-specific context files
- Skill's SKILL.md is available for reference

### Workflows Binding

Specify individual workflows when you want granular control:

```yaml
workflows:
  - blogging/create_post      # Only create_post workflow from blogging
  - blogging/edit_post        # Only edit_post workflow from blogging
  - art/generate_diagram      # Only generate_diagram from art
```

**Format:** `skill-name/workflow_name` (matches file path)

**Use when:**
- Agent needs only specific workflows, not entire skills
- Creating a focused agent with limited scope
- Combining workflows from multiple skills

### Prompts Binding

List prompt templates available to the agent:

```yaml
prompts:
  - blog-post-outline
  - technical-writing-tone
  - seo-optimization
```

**What this means:**
- Agent can use these prompts as templates
- Prompts are loaded from `.claude/prompts/` or skill-specific locations

### Complete Capability Example

```yaml
---
name: blog-agent
description: Domain agent for blog content creation and publishing
version: 1.0.0
domain: blog-content
skills:
  - blogging
  - art
workflows:
  - blogging/create_post
  - blogging/edit_post
  - blogging/publish_post
  - art/generate_diagram
prompts:
  - blog-post-outline
  - technical-writing-tone
---
```

### Capability Resolution Rules

1. **If `skills` defined:** Agent has access to ALL workflows in listed skills
2. **If `workflows` defined:** Agent has access to ONLY the specific workflows listed
3. **If both defined:** Agent has access to full skills PLUS any additional specific workflows
4. **If neither defined:** Agent relies on domain context and PAL Master routing

---

## Context Loading Rules

### Loading Modes

Agents use two context loading modes:

| Mode | Syntax | Behavior | Use When |
| :--- | :----- | :------- | :------- |
| **[AUTO]** | `[AUTO] path/to/file.md` | Read and load immediately at activation | Critical context needed for all operations |
| **[REF]** | `[REF] path/to/file.md` | Index path, load on demand | Context needed only for specific tasks |

### Zero-Trust Context Approach

**Principle:** Load only what's needed, when it's needed.

**Rules:**
1. Default to `[REF]` for most files
2. Use `[AUTO]` only for files required in every interaction
3. Domain INDEX.md is always `[AUTO]` to discover domain files
4. Verify relevance before reading any referenced file

### Four-Layer Context System

Agents load context from **four layers**:

| Layer | Purpose | Typical Loading | Source |
| :---- | :------ | :-------------- | :----- |
| **USER** | Identity, preferences, contacts | `[REF]` most files, `[AUTO]` ABOUTME for name | `.claude/base/user/` |
| **SYSTEM** | Architecture, workflows, logic | `[REF]` for reference as needed | `.claude/base/system/` |
| **SECURITY** | Guardrails, policies | `[REF]` GUARDRAILS.md for validation | `.claude/base/security/` |
| **DOMAIN** | Domain-specific context | `[AUTO]` INDEX.md, `[REF]` other files | `domains/[domain-name]/` |

### Domain Binding

Each agent **must** specify a domain in its YAML frontmatter:

```yaml
---
name: blog-agent
description: Domain agent for blog content creation
version: 1.0.0
domain: blog-content
---
```

**Domain Binding Process:**

1. Agent specifies `domain: [domain-name]` in frontmatter
2. System locates `domains/[domain-name]/INDEX.md`
3. INDEX.md serves as the **source of truth** for domain files
4. Agent author maps files from INDEX.md to `[AUTO]` or `[REF]`

### Domain File Mapping

The domain's `INDEX.md` lists all domain files. Agent authors map these to loading modes:

```markdown
**DOMAIN Layer (from blog-content):**

Source: `domains/blog-content/INDEX.md`

- [AUTO] `domains/blog-content/INDEX.md` - Domain source of truth
- [REF] `domains/blog-content/01_PLANS/` - Active plans
- [REF] `domains/blog-content/02_SESSIONS/` - Session logs
- [REF] `domains/blog-content/03_ASSETS/` - Reference materials
```

### Complete Context Configuration Example

```markdown
**USER Layer:**
- [AUTO] `.claude/base/user/ABOUTME.md` - Need user name immediately
- [REF] `.claude/base/user/TECHSTACK.md` - Load only if discussing tech
- [REF] `.claude/base/user/TERMINOLOGY.md` - Load for vocabulary

**SYSTEM Layer:**
- [REF] `.claude/base/system/WORKFLOWS.md` - Load when executing workflows
- [REF] `.claude/base/system/ORCHESTRATION.md` - Load for routing logic

**SECURITY Layer:**
- [REF] `.claude/base/security/GUARDRAILS.md` - Load before destructive ops

**DOMAIN Layer (blog-content):**
- [AUTO] `domains/blog-content/INDEX.md` - Domain source of truth
- [REF] `domains/blog-content/01_PLANS/` - Load when planning content
- [REF] `domains/blog-content/03_ASSETS/style-guide.md` - Load when writing
```

---

## Agent Lifecycle

### 1. Loading

**Invocation:** `/load-[agent-name]`

**Example:**
```
/load-blog-agent
```

**What Happens:**
1. PAL Master receives command
2. Agent file loaded from `.claude/agents/`
3. Control transfers to agent

### 2. Activation

**5-Step Protocol:**

1. **Load Persona** - Agent file already in context
2. **Load Context** - Execute [AUTO] files from all 4 layers, index [REF] files
3. **Extract User Name** - From ABOUTME.md
4. **Display Greeting** - Show greeting template with menu
5. **Wait for Input** - STOP and wait (do not auto-execute)

### 3. Session Management

**During Session:**
- Agent maintains character until dismissed
- Processes user input via menu handlers (if defined) or natural language
- Loads [REF] files as needed
- Validates operations against GUARDRAILS.md

**Session Context:**
- Agent persona persists
- Loaded context accumulates
- Conversation history maintained

### 4. Dismissal

**Command:** `*dismiss`

**What Happens:**
1. Agent acknowledges dismissal
2. Session context cleared
3. Control returns to PAL Master
4. PAL Master confirms return

**Example Dismissal Response:**
```
Understood. Ending [Agent Name] session.

Returning you to PAL Master. Type *menu to see available options.
```

---

## Agent Types

### Orchestration Agents

**Example:** PAL Master

**Characteristics:**
- Generalist routing and coordination
- Full Base context access
- Routes to skills, agents, workflows
- Always available (default at session start)

**Use For:**
- Task routing and delegation
- System operations
- Quick queries across domains
- Coordination of multi-domain work

### Domain Agents

**Examples:** Blog Agent, Art Agent, Security Agent

**Characteristics:**
- Deep expertise in single domain
- Four-layer context (USER + SYSTEM + SECURITY + DOMAIN)
- Bound to specific domain via `domain` field
- Pre-loaded domain INDEX.md as source of truth
- Loaded on demand via `/load-[agent]`

**Use For:**
- Extended work in one domain
- Multiple related tasks
- Complex domain-specific operations
- When specialized persona helps

### Comparison Table

| Aspect | Orchestration Agent | Domain Agent |
| :----- | :------------------ | :----------- |
| **Scope** | System-wide | Single domain |
| **Context** | Full Base (3 layers) | Four layers (includes DOMAIN) |
| **Domain Binding** | None | Required (`domain` field) |
| **Expertise** | Broad (routing) | Deep (domain) |
| **Duration** | Session-long | Task-specific |
| **Loading** | Default | On-demand |
| **Example Use** | "Help me plan my week" | "Write 3 blog posts about AI" |

---

## Complete Checklist

Before an agent is complete, verify the following:

### Structure

- [ ] Agent file exists in `.claude/agents/`
- [ ] Filename follows `lower-kebab-case.md` convention
- [ ] Single file (no nested directories)
- [ ] Document version and last updated at bottom

### YAML Frontmatter

- [ ] `name` field present (lower-kebab-case)
- [ ] `description` field present
- [ ] `version` field present (semantic versioning)
- [ ] `domain` field present (valid domain name)
- [ ] `skills` field lists valid skills (if defined)
- [ ] `workflows` field uses correct format `skill-name/workflow_name` (if defined)
- [ ] `prompts` field lists valid prompts (if defined)

### Template Sections

- [ ] Activation Protocol with 5 steps
- [ ] Context Configuration with all 4 layers
- [ ] Persona section (Role, Identity, Communication Style, Core Principles)
- [ ] Menu section with command table
- [ ] Menu Handlers section with processing rules
- [ ] Core Responsibilities section with numbered items
- [ ] Operational Rules section with numbered rules
- [ ] Greeting Template with menu display

### Four-Layer Context Configuration

- [ ] USER layer files identified with [AUTO]/[REF]
- [ ] SYSTEM layer files identified with [AUTO]/[REF]
- [ ] SECURITY layer files identified with [AUTO]/[REF]
- [ ] DOMAIN layer files mapped from INDEX.md
- [ ] Domain INDEX.md marked as [AUTO]
- [ ] Minimum files marked [AUTO] (only essentials)

### Domain Binding

- [ ] `domain` field matches valid domain in `domains/`
- [ ] Domain INDEX.md exists at `domains/[domain-name]/INDEX.md`
- [ ] Domain files mapped to [AUTO]/[REF] based on relevance

### Capability Binding (if defined)

- [ ] All listed skills exist in `.claude/skills/`
- [ ] All listed workflows exist in their respective skills (`skill-name/workflows/workflow_name.md`)
- [ ] All listed prompts exist in `.claude/prompts/` or skill locations
- [ ] Capabilities align with agent's domain and responsibilities

### Operational Validation

- [ ] First-person voice enforced in rules
- [ ] `*dismiss` command documented
- [ ] Security validation referenced
- [ ] Stay-in-character rule included

---

## Summary

| Component | Purpose | Required |
| :-------- | :------ | :------- |
| **YAML Frontmatter** | Agent metadata (name, description, version, domain, capabilities) | Yes |
| **Capability Binding** | Skills, workflows, and prompts the agent can use | No |
| **Activation Protocol** | 5-step startup sequence | Yes |
| **Context Configuration** | Four-layer [AUTO]/[REF] file loading | Yes |
| **Persona** | Role, identity, communication style, core principles | Yes |
| **Menu** | Command table | Yes |
| **Menu Handlers** | Input processing rules | Yes |
| **Core Responsibilities** | What the agent does | Yes |
| **Operational Rules** | Behavioral constraints | Yes |
| **Greeting Template** | Initial user message | Yes |

**Key Principles:**

1. **Single-file agents** - no nested directories, related files in their locations
2. **Four-layer context** - USER, SYSTEM, SECURITY, DOMAIN
3. **Domain binding** - every agent bound to a domain via `domain` field
4. **Capability binding** - agents can specify skills, workflows, and prompts
5. **INDEX.md as source of truth** - domain files discovered from INDEX.md
6. **Zero-trust context** - load only what's needed
7. **First-person voice** - agents speak as themselves
8. **Clear lifecycle** - load, activate, session, dismiss

---

**Document Version:** 1.1.0
**Last Updated:** 2026-01-18
**Related Files:** [ARCHITECTURE.md](ARCHITECTURE.md), [ORCHESTRATION.md](ORCHESTRATION.md), [SKILL_LOGIC.md](SKILL_LOGIC.md), [DOMAINS_LOGIC.md](DOMAINS_LOGIC.md), [WORKFLOWS.md](WORKFLOWS.md), [MEMORY_LOGIC.md](MEMORY_LOGIC.md), [TOOLBOX.md](TOOLBOX.md)

---
