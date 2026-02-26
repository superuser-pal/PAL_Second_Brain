# PAL Second Brain - Agents Requirements

**Document Purpose:** Functional requirements for all PAL agents, written for non-technical builders and developers.

**Version:** 1.2.0
**Last Updated:** 2026-02-13

---

## What is an Agent?

An agent is a specialized persona that takes over your PAL session to handle a specific domain of work. Think of agents as expert assistants — each one focuses on a particular area and has access to the relevant context for that work.

**Key Concept:** While PAL Master is a generalist orchestrator, domain agents are specialists. You load an agent when you want focused, extended work in a particular area.

---

## 2.0 Agent Architecture Requirements

### 2.0.1 Agents are Single Files

**Given** an agent exists
**When** it is stored in PAL
**Then** it is a single `.md` file in `.claude/agents/` (no subdirectories)

Category: Validation
Verification: Check `.claude/agents/` and confirm only `.md` files exist, no folders
Source: [AGENTS_LOGIC.md](.claude/base/system/AGENTS_LOGIC.md)

---

### 2.0.2 Agents Must Bind to a Domain

**Given** a domain agent is created
**When** the agent file is written
**Then** it specifies a `domain:` field that matches an existing domain in `domains/`

Category: Validation
Verification: Check any domain agent's YAML and confirm `domain:` field exists and matches a real domain
Source: [AGENTS_LOGIC.md](.claude/base/system/AGENTS_LOGIC.md)

---

### 2.0.3 Agent YAML Has Exactly 4 Fields

**Given** an agent file is created
**When** the YAML frontmatter is written
**Then** it contains only:
- `name` (lower-kebab-case)
- `description` (brief purpose)
- `version` (semantic version)
- `domain` (matching domain directory)

Category: Validation
Verification: Check any agent's YAML frontmatter and confirm exactly 4 fields
Source: [AGENTS_LOGIC.md](.claude/base/system/AGENTS_LOGIC.md)

---

### 2.0.4 Agents Use 8-Section Structure

**Given** an agent file is created
**When** the content is written
**Then** it follows these 8 sections:
1. **Identity & Persona** — Who the agent is
2. **Activation Protocol** — Steps to initialize
3. **Command Menu** — Available commands
4. **How I Work** — Classify → Route → Execute logic
5. **My Capabilities** — Skills, workflows, prompts
6. **Session State Model** — What to track
7. **Error Handling & Recovery** — How to handle failures
8. **Operational Rules** — Behavior constraints

Category: Validation
Verification: Open any agent file and confirm all 8 sections are present
Source: [agent_template.md](.claude/skills/create-agent/agent_template.md)

---

### 2.0.5 Agent Activation Follows 6 Steps

**Given** an agent is loaded
**When** it activates
**Then** it executes these steps in order:
1. Load Persona (agent file already in context)
2. Load Base Context (3 fixed REFs: ABOUTME, DIRECTIVES, GUARDRAILS)
3. Load Domain Context (INDEX.md as AUTO, domain folders as REF)
4. Extract User Name from ABOUTME.md
5. Display Greeting with Command Menu
6. **STOP and wait for user input** (do not auto-execute)

Category: Functional
Verification: Load an agent and confirm greeting appears with menu, then waits for input
Source: [AGENTS_LOGIC.md](.claude/base/system/AGENTS_LOGIC.md)

---

### 2.0.6 Agent Capabilities Declared in Section 5

**Given** an agent has access to skills and workflows
**When** these capabilities are documented
**Then** they are listed inline in Section 5 with:
- `name` — Skill/workflow name
- `location` — File path
- `use_when` — Trigger phrases

Category: Validation
Verification: Check Section 5 of any agent and confirm capabilities have all three fields
Source: [AGENTS_LOGIC.md](.claude/base/system/AGENTS_LOGIC.md)

---

### 2.0.7 Agents Cannot Infer Capabilities

**Given** an agent's capabilities are listed in Section 5
**When** a user requests something not in that list
**Then** the agent informs the user it's out of scope
**And then** suggests using `*dismiss` to return to PAL Master

Category: Functional
Verification: Ask an agent to do something outside its capabilities and confirm it declines
Source: [AGENTS_LOGIC.md](.claude/base/system/AGENTS_LOGIC.md)

---

## 2.1 Agent: PAL Master

**What It Does:** PAL Master is the primary orchestration agent — the generalist who routes your requests to the right skills, agents, or workflows.

**When It Activates:** PAL Master is active at session start (default agent). It handles routing and general requests.

**Source:** [pal-master.md](.claude/agents/pal-master.md)

---

### 2.1.1 PAL Master Loads Three-Layer Context

**Given** a PAL session starts
**When** PAL Master activates
**Then** it has reference access to:

**USER Layer:**
- ABOUTME.md, DIRECTIVES.md, TECHSTACK.md, TERMINOLOGY.md
- DIGITALASSETS.md, CONTACTS.md, RESUME.md, ART.md

**SYSTEM Layer:**
- ORCHESTRATION.md, ARCHITECTURE.md, WORKFLOWS.md
- MEMORY_LOGIC.md, TOOLBOX.md

**SECURITY Layer:**
- GUARDRAILS.md, REPOS_RULES.md

Category: Functional
Verification: Run `*context` and confirm all three layers are indexed
Source: [pal-master.md](.claude/agents/pal-master.md)

---

### 2.1.2 PAL Master Classifies Intent

**Given** a user sends a message
**When** PAL Master processes it
**Then** it classifies the intent as:
- **Explicit request** — Direct command or clear ask
- **Implicit intent** — Needs interpretation
- **Context-dependent** — Needs user/domain context
- **Ambiguous** — Multiple interpretations (ask user)

Category: Functional
Verification: Send an ambiguous message and confirm PAL Master asks for clarification
Source: [pal-master.md](.claude/agents/pal-master.md)

---

### 2.1.3 PAL Master Routes to Best Capability

**Given** user intent is classified
**When** PAL Master decides how to handle it
**Then** it routes to the best option:
1. Skill Activation (matches USE WHEN)
2. Agent Loading (user requests `/*`)
3. Workflow Execution
4. Tool Selection
5. Direct Response

Category: Functional
Verification: Request skill-related work and confirm appropriate skill activates
Source: [ORCHESTRATION.md](.claude/base/system/ORCHESTRATION.md)

---

### 2.1.4 PAL Master Shows Menu Commands

**Given** PAL Master is active
**When** the user needs options
**Then** PAL Master provides these commands:

| Command | Action |
|---------|--------|
| `*menu` | Redisplay menu |
| `*skills` | List available skills |
| `*workflows` | List available workflows |
| `*agents` | Show domain agents |
| `*context` | Show loaded context |
| `*help` | Show help documentation |
| `*dismiss` | Dismiss PAL Master |

Category: UI
Verification: Run `*menu` and confirm all commands are listed
Source: [pal-master.md](.claude/agents/pal-master.md)

---

### 2.1.5 PAL Master Presents Plans for Complex Tasks

**Given** a user requests a complex task (3+ files, destructive, architectural)
**When** PAL Master prepares to execute
**Then** it presents a plan with:
- Objective
- Numbered steps
- Files affected (NEW/MODIFY/DELETE)
- Risks

**And then** waits for approval (yes/no/modify)

Category: Functional
Verification: Request a multi-file change and confirm plan is presented before execution
Source: [ORCHESTRATION.md](.claude/base/system/ORCHESTRATION.md)

---

## 2.2 Agent: PAL Builder

**What It Does:** PAL Builder is the system architect for developing and improving PAL itself. It uses specification-driven design to create structured, validated improvements.

**When It Activates:** Load with `/pal-builder`. Dismiss with `*dismiss`.

**Source:** [pal-builder.md](.claude/agents/pal-builder.md)

---

### 2.2.1 PAL Builder Binds to pal-builder Domain

**Given** PAL Builder is loaded
**When** it activates
**Then** it loads context from `domains/pal-builder/`:
- `[AUTO]` INDEX.md — Domain Source of Truth
- `[REF]` 00_CONTEXT/ — Architecture decisions
- `[REF]` 01_PROJECTS/ — Active specs and plans
- `[REF]` 02_SESSIONS/ — Session logs
- `[REF]` 03_ASSETS/ — Reference materials
- `[REF]` 04_OUTPUTS/ — Generated artifacts
- `[REF]` 05_ARCHIVE/ — Completed work

Category: Functional
Verification: Load PAL Builder and run `*context` to confirm domain files are indexed
Source: [pal-builder.md](.claude/agents/pal-builder.md)

---

### 2.2.2 PAL Builder Has System-Build Skill

**Given** PAL Builder is active
**When** a user requests specification work
**Then** it uses the system-build skill with workflows:
- `specify` — Create feature specification
- `plan` — Create implementation plan
- `tasks` — Generate task breakdown
- `implement` — Execute tasks
- `checklist` — Create quality checks
- `clarify` — Resolve ambiguities
- `analyze` — Cross-artifact consistency

Category: Functional
Verification: Ask to create a spec and confirm system-build skill activates
Source: [system-build SKILL.md](.claude/skills/system-build/SKILL.md)

---

### 2.2.3 PAL Builder Has Creation Skills

**Given** PAL Builder is active
**When** a user wants to create PAL components
**Then** it has access to:
- `create-skill` — Create new skills
- `create-agent` — Create new agents
- `create-domain` — Create new domains

Category: Functional
Verification: Ask to create a skill and confirm create-skill activates
Source: [pal-builder.md](.claude/agents/pal-builder.md)

---

### 2.2.4 PAL Builder Shows Spec-Focused Menu

**Given** PAL Builder is active
**When** the menu is displayed
**Then** it includes:

| Command | Action |
|---------|--------|
| `*menu` | Redisplay menu |
| `*skills` | List available skills |
| `*workflows` | List available workflows |
| `*context` | Show loaded context |
| `*spec` | Create a specification |
| `*plan` | Create implementation plan |
| `*tasks` | Generate task breakdown |
| `*save-session` | Save session log |
| `*help` | Agent help |
| `*dismiss` | End session |

Category: UI
Verification: Load PAL Builder and confirm menu shows spec-focused commands
Source: [pal-builder.md](.claude/agents/pal-builder.md)

---

### 2.2.5 PAL Builder Routes Files Correctly

**Given** files are created in PAL Builder session
**When** they are saved
**Then** they go to the correct folder:

| File Type | Destination | Naming |
|-----------|-------------|--------|
| Architecture decisions | 00_CONTEXT/ | lower_snake_case.md |
| Active specs/plans | 01_PROJECTS/ | PROJECT_*.md or PLAN_*.md |
| Session logs | 02_SESSIONS/ | YYYY-MM-DD_title.md |
| Reference docs | 03_ASSETS/ | lower_snake_case.md |
| Generated artifacts | 04_OUTPUTS/ | Flexible |
| Completed work | 05_ARCHIVE/ | Preserve original name |

Category: Validation
Verification: Create different file types and confirm they route to correct folders
Source: [pal-builder.md](.claude/agents/pal-builder.md)

---

## 2.3 Agent: Studio Agent

**What It Does:** Studio Agent is a specialist for high-fidelity video production and Scaledraw presentations. It manages the end-to-end production lifecycle.

**When It Activates:** Load with `/studio-agent`. Activates when working on video production, presentation visuals, or Scaledraw files.

**Source:** [studio-agent.md](.claude/agents/studio-agent.md)

---

### 2.3.1 Studio Agent Binds to studio Domain

**Given** Studio Agent is loaded
**When** it activates
**Then** it loads context from `domains/studio/`:
- `[AUTO]` INDEX.md — Domain Source of Truth
- `[REF]` 01_PLANS/ — Production plans
- `[REF]` 02_SESSIONS/ — Production session logs
- `[REF]` 03_ASSETS/whiteboards/ — Scaledraw .excalidraw files
- `[REF]` 03_ASSETS/media/ — Production icons and pictures

Category: Functional
Verification: Load Studio Agent and run `*context` to confirm domain files are indexed
Source: [studio-agent.md](.claude/agents/studio-agent.md)

---

### 2.3.2 Studio Agent Focuses on Production-Ready Content

**Given** Studio Agent is active
**When** content is created or discussed
**Then** the agent maintains a "no-brainstorming" policy — all content must be production-ready

Category: Functional
Verification: Attempt brainstorming and confirm agent redirects to production focus
Source: [studio-agent.md](.claude/agents/studio-agent.md)

---

### 2.3.3 Studio Agent Has Art Skill

**Given** Studio Agent is active
**When** visual creation is needed
**Then** it uses the `art` skill for diagrams and visual creation

Category: Functional
Verification: Request a diagram and confirm art skill activates
Source: [studio-agent.md](.claude/agents/studio-agent.md)

---

### 2.3.4 Studio Agent Shows Production Menu

**Given** Studio Agent is active
**When** the menu is displayed
**Then** it includes:

| Command | Action |
|---------|--------|
| `*menu` | Redisplay menu |
| `*status` | Show production state |
| `*plans` | Manage production plans |
| `*whiteboards` | List Scaledraw files |
| `*media` | List production media |
| `*session` | Log a production session |
| `*context` | Show loaded context |
| `*help` | Agent help |
| `*dismiss` | End session |

Category: UI
Verification: Load Studio Agent and confirm menu shows production commands
Source: [studio-agent.md](.claude/agents/studio-agent.md)

---

### 2.3.5 Studio Agent Manages Whiteboards

**Given** Scaledraw files exist
**When** the user requests `*whiteboards`
**Then** Studio Agent lists all `.excalidraw` files in `03_ASSETS/whiteboards/`

Category: Functional
Verification: Run `*whiteboards` and confirm .excalidraw files are listed
Source: [studio-agent.md](.claude/agents/studio-agent.md)

---

## 2.4 Agent: Substack Manager

**What It Does:** Substack Manager is a growth specialist for managing LaraLou's Substack presence. It handles strategy development, content organization, and audience growth.

**When It Activates:** Load with `/substack-manager`. Activates when working on Substack strategy, essays, or growth planning.

**Source:** [substack-manager.md](.claude/agents/substack-manager.md)

---

### 2.4.1 Substack Manager Binds to laralou Domain

**Given** Substack Manager is loaded
**When** it activates
**Then** it loads context from `domains/LaraLou/`:
- `[AUTO]` INDEX.md — Domain Source of Truth
- `[REF]` 01_PLANS/ — Growth and content strategies
- `[REF]` 03_ASSETS/ — Notes metadata
- `[REF]` 03_ASSETS/essays/ — All published essays

Category: Functional
Verification: Load Substack Manager and run `*context` to confirm domain files are indexed
Source: [substack-manager.md](.claude/agents/substack-manager.md)

---

### 2.4.2 Substack Manager Has Essay Archive Access

**Given** Substack Manager is active
**When** essay references are needed
**Then** it has indexed access to all essays in `03_ASSETS/essays/` with dates and titles

Category: Functional
Verification: Ask about a specific essay date and confirm agent can reference it
Source: [substack-manager.md](.claude/agents/substack-manager.md)

---

### 2.4.3 Substack Manager Shows Growth Menu

**Given** Substack Manager is active
**When** the menu is displayed
**Then** it includes:

| Command | Action |
|---------|--------|
| `*menu` | Redisplay menu |
| `*plan` | Manage strategies and content plans |
| `*session` | Log a strategy session |
| `*context` | Show loaded context |
| `*help` | Agent help |
| `*dismiss` | End session |

Category: UI
Verification: Load Substack Manager and confirm menu shows growth commands
Source: [substack-manager.md](.claude/agents/substack-manager.md)

---

### 2.4.4 Substack Manager Maintains Strategic Focus

**Given** Substack Manager is active
**When** requests are made
**Then** the agent prioritizes:
- Audience-centric content (value for community)
- Strategic consistency (predictable quality cadence)
- Data-informed creative (engagement insights balanced with expression)

Category: Functional
Verification: Request content strategy and confirm focus on audience growth metrics
Source: [substack-manager.md](.claude/agents/substack-manager.md)

---

## 2.5 Common Agent Requirements

### 2.5.1 All Agents Use First-Person Voice

**Given** any agent is active
**When** it communicates
**Then** it uses "I", "my", "me" — never third person ("the agent does")

Category: UI
Verification: Review agent responses and confirm first-person pronouns throughout
Source: [ARCHITECTURE.md](.claude/base/system/ARCHITECTURE.md)

---

### 2.5.2 All Agents Wait After Greeting

**Given** an agent completes its activation protocol
**When** it displays the greeting and menu
**Then** it **STOPS and waits** for user input (no auto-execution)

Category: Functional
Verification: Load any agent and confirm it waits after greeting
Source: [AGENTS_LOGIC.md](.claude/base/system/AGENTS_LOGIC.md)

---

### 2.5.3 All Agents Validate Against Guardrails

**Given** any agent attempts a write/delete operation
**When** the operation is about to execute
**Then** it validates against GUARDRAILS.md first

Category: Security
Verification: Attempt a guardrails-blocked operation and confirm it's rejected
Source: [GUARDRAILS.md](.claude/base/security/GUARDRAILS.md)

---

### 2.5.4 All Agents Handle Errors Transparently

**Given** an error occurs during agent operation
**When** the error is detected
**Then** the agent:
- Explains what went wrong
- Suggests possible fixes
- Offers to retry or abort

Category: Functional
Verification: Trigger an error and confirm clear explanation with options appears
Source: [ARCHITECTURE.md](.claude/base/system/ARCHITECTURE.md)

---

### 2.5.5 All Agents Support *dismiss Command

**Given** any domain agent is active
**When** the user enters `*dismiss`
**Then** session state clears and control returns to PAL Master

Category: Functional
Verification: Run `*dismiss` from any agent and confirm PAL Master takes over
Source: [AGENTS_LOGIC.md](.claude/base/system/AGENTS_LOGIC.md)

---

## Adding New Agents

When creating new domain agents, ensure:

1. Agent is a single `.md` file in `.claude/agents/`
2. YAML has exactly 4 fields: name, description, version, domain
3. Domain exists with INDEX.md before agent creation
4. 8-section structure is followed
5. Capabilities listed in Section 5 with use_when triggers
6. Activation Protocol includes all 6 steps
7. Entry added to ROUTING_TABLE.md

---

**Next:** See [README.md](README.md) for the requirements index and navigation guide.
