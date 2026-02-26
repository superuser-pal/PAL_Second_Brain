# PAL Second Brain - Core System Requirements

**Document Purpose:** Functional requirements for the PAL Second Brain core architecture, written for non-technical builders and developers.

**Version:** 1.0.0
**Last Updated:** 2026-02-13

---

## What is PAL?

PAL (Patterned Agentic Logic) is a pattern-based modular system that helps you organize your thoughts, manage projects, and interact with AI through structured context. Think of it as a "second brain" that understands your preferences, knows your projects, and can perform tasks on your behalf.

**Key Concept:** Instead of starting every conversation from scratch, PAL remembers who you are, what you're working on, and how you like things done.

---

## System Architecture Overview

PAL is organized into three layers, like a building with three floors:

| Layer        | What It Contains                     | Purpose                        |
| ------------ | ------------------------------------ | ------------------------------ |
| **USER**     | Your identity, preferences, contacts | "Who am I and what do I like?" |
| **SYSTEM**   | Workflows, routing logic, tools      | "How does PAL work?"           |
| **SECURITY** | Safety rules, data policies          | "What should PAL never do?"    |

---

## 0.1 Core Requirements

### 0.1.1 Load User Context at Session Start

**Given** a user starts a new PAL session
**When** the session initializes
**Then** the system loads the user's base context (identity, preferences, directives) so PAL knows who it's working with

Category: Functional
Verification: Start a new session and confirm ABOUTME.md and DIRECTIVES.md are indexed in context
Source: [ORCHESTRATION.md](.claude/base/system/ORCHESTRATION.md)

---

### 0.1.2 Route User Intent to the Right Capability

**Given** the user expresses a request in natural language
**When** PAL Master analyzes the request
**Then** the system matches the intent to the appropriate skill, agent, or workflow based on "USE WHEN" triggers (not keyword matching)

Category: Functional
Verification: Say "I need to organize my research notes" and confirm note-taking skill activates
Source: [ORCHESTRATION.md](.claude/base/system/ORCHESTRATION.md)

---

### 0.1.3 Activate Skills Based on Conceptual Matching

**Given** multiple skills exist in the system
**And given** each skill has a USE WHEN trigger describing when it should activate
**When** a user's intent conceptually matches a skill's USE WHEN description
**Then** that skill is activated and its workflows become available

Category: Functional
Verification: Say "Help me plan the API project" and confirm project-management skill activates
Source: [SKILL_LOGIC.md](.claude/base/system/SKILL_LOGIC.md)

---

### 0.1.4 Load Agents on Explicit Command

**Given** domain agents exist for specialized work
**When** a user issues a `/[agent-name]` command (e.g., `/pal-builder`)
**Then** the specified agent loads with its domain context and persona, replacing PAL Master for that session

Category: Functional
Verification: Run `/pal-builder` and confirm PAL Builder greeting appears with its menu
Source: [AGENTS_LOGIC.md](.claude/base/system/AGENTS_LOGIC.md)

---

### 0.1.5 Dismiss Agents and Return to PAL Master

**Given** a domain agent is currently active
**When** the user issues the `*dismiss` command
**Then** the agent session ends and control returns to PAL Master

Category: Functional
Verification: While in PAL Builder, run `*dismiss` and confirm PAL Master takes over
Source: [AGENTS_LOGIC.md](.claude/base/system/AGENTS_LOGIC.md)

---

### 0.1.6 Present Plans Before Complex Operations

**Given** a user requests a task that involves:

- Multiple file changes (3 or more files)
- Destructive operations (deleting, overwriting)
- Security-sensitive actions
- Architectural changes

**When** PAL prepares to execute the task
**Then** the system presents a plan showing:

- Objective (what will be done)
- Steps (numbered sequence of actions)
- Files affected (marked as NEW/MODIFY/DELETE)
- Risks (if any)

**And then** waits for user approval before executing

Category: Functional
Verification: Request a multi-file refactor and confirm a plan is presented before any changes
Source: [ORCHESTRATION.md](.claude/base/system/ORCHESTRATION.md)

---

### 0.1.7 Execute Trivial Operations Without Planning

**Given** a user requests a simple task such as:

- Fixing a typo
- Reading a file
- Displaying information

**When** PAL analyzes the request
**Then** the system executes immediately without presenting a plan

Category: Functional
Verification: Ask to fix a typo and confirm it executes without a plan prompt
Source: [ORCHESTRATION.md](.claude/base/system/ORCHESTRATION.md)

---

### 0.1.8 Validate Operations Against Guardrails

**Given** any operation that writes, deletes, or modifies files
**When** the operation is about to execute
**Then** the system checks the operation against GUARDRAILS.md rules
**And then** blocks catastrophic operations, warns about risky ones, and allows safe ones

Category: Security
Verification: Attempt a blocked operation (per GUARDRAILS.md) and confirm it is rejected
Source: [GUARDRAILS.md](.claude/base/security/GUARDRAILS.md)

---

### 0.1.9 Maintain First-Person Voice

**Given** any response from PAL Master or any domain agent
**When** the system communicates with the user
**Then** it uses first-person voice ("I", "my", "me")
**And then** never refers to itself in third person ("PAL does" or "the system")

Category: UI
Verification: Review agent responses and confirm first-person pronouns are used throughout
Source: [ARCHITECTURE.md](.claude/base/system/ARCHITECTURE.md)

---

### 0.1.10 Minimize Context Loading (Zero Trust)

**Given** files exist in the PAL structure (user files, system files, domain files)
**When** a session is active
**Then** the system only loads files that are:

1. Explicitly requested by the user
2. Required by the current agent's configuration
3. Necessary for the current task

**And then** avoids loading unnecessary files to prevent token waste

Category: Functional
Verification: Run `*context` and confirm only relevant files are loaded, not entire directory trees
Source: [MEMORY_LOGIC.md](.claude/base/system/MEMORY_LOGIC.md)

---

## 0.2 Domain Workspace Requirements

### 0.2.1 Create Domains with Standard Structure

**Given** a user requests a new domain (project workspace)
**When** the domain is created
**Then** the system creates the following folder structure:

```
domains/[domain-name]/
├── INDEX.md              # Source of Truth
├── CONNECTIONS.yaml      # External integrations
├── 00_CONTEXT/           # Background and reference docs
├── 01_PROJECTS/          # Active project files
├── 02_SESSIONS/          # Session logs
├── 03_ASSETS/            # Reference materials
├── 04_OUTPUTS/           # Generated deliverables
└── 05_ARCHIVE/           # Deprecated content
```

Category: Functional
Verification: Create a new domain and confirm all 6 folders plus INDEX.md and CONNECTIONS.yaml exist
Source: [DOMAINS_LOGIC.md](.claude/base/system/DOMAINS_LOGIC.md)

---

### 0.2.2 INDEX.md as Source of Truth

**Given** a domain exists
**When** an agent loads the domain context
**Then** INDEX.md is loaded first as the authoritative source of domain state
**And then** other folders are indexed but not read until needed

Category: Functional
Verification: Load a domain agent and confirm INDEX.md appears as [AUTO] in context
Source: [DOMAINS_LOGIC.md](.claude/base/system/DOMAINS_LOGIC.md)

---

### 0.2.3 Bind Agents to Domains

**Given** every domain agent requires a domain
**When** an agent is created
**Then** it must specify a `domain:` field in its YAML frontmatter that matches an existing domain

Category: Validation
Verification: Attempt to create an agent with a non-existent domain and confirm it fails
Source: [AGENTS_LOGIC.md](.claude/base/system/AGENTS_LOGIC.md)

---

## 0.3 Naming Convention Requirements

### 0.3.1 Follow Naming Conventions for Files

**Given** files are created within PAL
**When** naming files
**Then** the system follows these conventions:

| Category          | Convention            | Example              |
| ----------------- | --------------------- | -------------------- |
| System protocols  | `UPPER_SNAKE_CASE.md` | `DIRECTIVES.md`      |
| Folders           | `lower-kebab-case`    | `project-alpha/`     |
| Session logs      | `YYYY-MM-DD_title.md` | `2026-01-15_sync.md` |
| Active work files | `lower_snake_case.md` | `research_notes.md`  |

Category: Validation
Verification: Create files of each type and confirm naming matches conventions
Source: [ARCHITECTURE.md](.claude/base/system/ARCHITECTURE.md)

---

### 0.3.2 Skill Directories Use Kebab Case

**Given** a new skill is created
**When** the skill directory is named
**Then** it uses `lower-kebab-case` (e.g., `create-skill/`, `note-taking/`)

Category: Validation
Verification: Run create-skill and confirm directory name uses kebab-case
Source: [SKILL_LOGIC.md](.claude/base/system/SKILL_LOGIC.md)

---

### 0.3.3 SKILL.md Always Uppercase

**Given** a skill exists
**When** the main skill file is created
**Then** it is named `SKILL.md` (uppercase)

Category: Validation
Verification: Check any skill directory and confirm main file is `SKILL.md` not `skill.md`
Source: [SKILL_LOGIC.md](.claude/base/system/SKILL_LOGIC.md)

---

## 0.4 Session and State Requirements

### 0.4.1 Track Session State During Active Session

**Given** an agent session is active
**When** the user performs actions
**Then** the system tracks:

- User name
- Loaded files by layer
- Active skill/workflow
- Execution history (action → result)
- Pending actions

Category: Functional
Verification: Run `*context` during a session and confirm state information is displayed
Source: [MEMORY_LOGIC.md](.claude/base/system/MEMORY_LOGIC.md)

---

### 0.4.2 Reset State on Agent Dismissal

**Given** an agent session ends via `*dismiss`
**When** control returns to PAL Master
**Then** the previous agent's session state is cleared

Category: Functional
Verification: Load an agent, perform actions, dismiss, then confirm previous state is gone
Source: [AGENTS_LOGIC.md](.claude/base/system/AGENTS_LOGIC.md)

---

## 0.5 Error Handling Requirements

### 0.5.1 Show Errors Transparently

**Given** an operation fails
**When** the error occurs
**Then** the system explains what went wrong in plain language
**And then** suggests possible fixes or alternatives

Category: Functional
Verification: Trigger an intentional error and confirm a clear explanation with suggestions appears
Source: [ARCHITECTURE.md](.claude/base/system/ARCHITECTURE.md)

---

### 0.5.2 Graceful Degradation on Workflow Failure

**Given** a multi-step workflow is executing
**When** one step fails
**Then** the system stops at that step, reports the issue, and allows the user to decide whether to retry, skip, or abort

Category: Functional
Verification: Run a workflow with a failing step and confirm user is given options to proceed
Source: [WORKFLOWS.md](.claude/base/system/WORKFLOWS.md)

---

## Glossary

| Term           | Definition                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------------- |
| **Agent**      | A specialized persona that handles a specific domain (e.g., PAL Builder for system development)    |
| **Skill**      | A reusable capability that provides specific functionality (e.g., note-taking, project-management) |
| **Workflow**   | A sequence of steps that accomplishes a larger goal                                                |
| **Domain**     | A project workspace containing related files, plans, and context                                   |
| **USE WHEN**   | A trigger phrase in skill/agent definitions that describes when they should activate               |
| **Context**    | Information loaded into the session (user identity, preferences, project files)                    |
| **Guardrails** | Safety rules that prevent dangerous or unauthorized operations                                     |

---

**Next:** See [01_SKILLS.md](01_SKILLS.md) for skill-specific requirements.
