# PAL Feature Catalog

> Complete reference for all PAL Second Brain capabilities

**Version:** 0.1.0-alpha
**Last Updated:** 2026-02-16

---

## Overview

PAL v0.1 includes:

| Component | Count |
|-----------|-------|
| Skills | 8 |
| Workflows | 40 |
| Agents | 5 |
| Domains | 4 |
| Hooks | 3 |

---

## Skills

### **1. create-agent**

**Purpose:** Create and validate domain agents for PAL

**Workflows:**
| Workflow | Description |
|----------|-------------|
| `create_agent` | Create a new domain agent from template with 8-section structure |
| `validate_agent` | Check agent structure compliance (YAML, sections, capabilities) |
| `adapt_agent` | Convert external agent definition to PAL format |

**Triggers:** "create agent", "new agent", "agent structure", "validate agent", "check agent", "domain agent"

**Example:**
> "Create a new agent for managing my recipes"

**Location:** `.claude/skills/create-agent/`

---

### 2. create-domain

**Purpose:** Create and manage PAL domains (project workspaces)

**Workflows:**
| Workflow | Description |
|----------|-------------|
| `create_domain` | Create new domain with standard 6-folder structure |
| `validate_domain` | Check domain structure and INDEX.md compliance |
| `map_domain` | Sync domain after file changes, detect naming violations |
| `archive_domain` | Move deprecated content to 05_ARCHIVE with deprecation header |

**Triggers:** "create domain", "new domain", "domain structure", "validate domain", "map domain", "sync domain", "archive domain", "project workspace", "housekeeping"

**Example:**
> "Create a new domain for my side project"

**Location:** `.claude/skills/create-domain/`

---

### 3. create-skill

**Purpose:** Create, validate, and canonicalize PAL skills

**Workflows:**
| Workflow | Description |
|----------|-------------|
| `create_skill` | Create new skill with SKILL.md, workflows/, and tools/ directories |
| `validate_skill` | Check skill compliance (USE WHEN, structure, naming) |
| `update_skill` | Add new workflows to existing skill |
| `canonicalize_skill` | Fix non-standard naming and structure issues |

**Triggers:** "create skill", "new skill", "skill structure", "canonicalize", "validate skill", "check skill"

**Example:**
> "Create a skill for managing my reading list"

**Location:** `.claude/skills/create-skill/`

---

### 4. life-management

**Purpose:** Manage personal life context within the life-os domain

**Workflows:**
| Workflow | Description |
|----------|-------------|
| `update` | Add or edit life context (beliefs, mission, goals, lessons, projects) |
| `extract` | Process notes from 03_ASSETS and classify into 7 life categories |
| `export` | Generate life summary report to 04_OUTPUTS |

**Triggers:** "update beliefs", "add goal", "life mission", "add lesson", "update projects", "mental models", "frames", "extract notes", "process ideas", "export life summary", "life report"

**Life Categories:**
- Mission — Your purpose and direction
- Beliefs — Core convictions and values
- Frames — Mental frameworks and perspectives
- Models — Mental models for decision-making
- Learned — Lessons and insights
- Goals — Objectives and targets
- Projects — Active initiatives

**Example:**
> "Add a new goal: Launch my newsletter by Q2"

**Location:** `.claude/skills/life-management/`

---

### 5. note-taking

**Purpose:** Manage notes from inbox through processing to distribution across domains

**Workflows:**
| Workflow | Description |
|----------|-------------|
| `braindump` | Capture stream-of-consciousness thoughts with analysis |
| `process_inbox` | Add YAML frontmatter to raw notes in inbox/notes/ |
| `distribute_notes` | Move processed notes to domain 03_ASSETS/ |
| `ingest_longform` | Convert PDF/DOCX/TXT to structured markdown with summary |
| `url_dump` | Fetch URL content, extract key insights, create note |

**Triggers:** "process notes", "organize notes", "add frontmatter", "distribute notes", "ingest PDF", "ingest document", "convert document", "inbox notes", "note management", "scan inbox", "move notes to domain", "braindump", "brain dump", "capture thoughts", "dump thoughts", "url dump", "save link", "bookmark url", "capture url", "save for later"

**Example:**
> "Braindump: I've been thinking about reorganizing my project structure..."

**Location:** `.claude/skills/note-taking/`

---

### 6. project-management

**Purpose:** Manage projects and tasks across domains with bidirectional sync

**Workflows:**
| Workflow | Description |
|----------|-------------|
| `create_project` | Create PROJECT_*.md in domain's 01_PROJECTS/ |
| `pull_tasks` | Aggregate tasks from all domains into /tasks/MASTER.md |
| `update_plan` | Push task status updates back to project files |
| `project_dashboard` | Display all projects grouped by status |
| `archive_project` | Move completed project to 05_ARCHIVE |

**Task Format:**
```markdown
- [ ] Task description `#open`
- [ ] Task description `#in-progress`
- [x] Task description `#done`
```

**Triggers:** "create project", "new project", "pull tasks", "sync tasks", "update plan", "project status", "list projects", "task dashboard", "archive project", "project management", "track tasks"

**Example:**
> "Create a project for the website redesign in the Studio domain"

**Location:** `.claude/skills/project-management/`

---

### 7. system-build (based on Spec-Kit Driven Development)

**Purpose:** Specification-driven development toolkit for building and extending PAL

**Workflows:**
| Workflow | Description |
|----------|-------------|
| `specify` | Create feature specification with requirements |
| `plan` | Generate implementation plan from specification |
| `tasks` | Break plan into numbered, phased actionable tasks |
| `implement` | Execute tasks with verification |
| `checklist` | Create quality validation checklist |
| `clarify` | Resolve specification ambiguities through Q&A |
| `analyze` | Check cross-artifact consistency (spec ↔ plan ↔ tasks) |
| `constitution` | Update project governance and principles |
| `document` | Generate requirements documentation |
| `document_skill` | Extract requirements from existing skill |
| `tasks_to_issues` | Export tasks to GitHub issues |

**Workflow Sequence:**
1. `specify` → Create specification
2. `clarify` → Resolve ambiguities (optional)
3. `plan` → Generate implementation plan
4. `tasks` → Break into actionable items
5. `checklist` → Create quality checks
6. `analyze` → Verify consistency
7. `implement` → Execute tasks
8. `tasks_to_issues` → Export to GitHub (optional)

**Triggers:** "create spec", "specification", "feature spec", "implementation plan", "generate tasks", "task breakdown", "checklist", "clarify requirements", "analyze consistency", "constitution", "system build", "build system", "develop PAL"

**Example:**
> "Create a spec for adding dark mode to the system"

**Location:** `.claude/skills/system-build/`

---

### 8. system-cleaner

**Purpose:** System-wide housekeeping for auditing PAL integrity and hygiene

**Workflows:**
| Workflow | Description |
|----------|-------------|
| `audit_references` | Detect unregistered items and dead references |
| `audit_domains` | Validate domain folder structure and INDEX.md sync |
| `audit_naming` | Check file/folder naming convention compliance |
| `audit_orphans` | Find unclaimed skills and stale sessions |
| `health_report` | Run all audits and calculate system health score |

**Health Status:**
- **HEALTHY** — 0 issues
- **MINOR ISSUES** — 1-5 issues
- **NEEDS ATTENTION** — 6+ issues

**Triggers:** "audit system", "check references", "validate naming", "find orphans", "health report", "system health", "clean system"

**Example:**
> "Run a health report on the system"

**Location:** `.claude/skills/system-cleaner/`

---

## Hooks

Hooks are TypeScript code that executes at specific system lifecycle points. They provide deterministic behavior for context loading, security validation, and session management.

### SessionStart

**Trigger:** When a PAL session begins (Globally)

**Purpose:** Load base context so PAL knows who you are and how to operate

**Location:** `.claude/tools/hooks/session-start.ts`

**What It Loads:**
- **USER Layer:** ABOUTME.md, DIRECTIVES.md, TERMINOLOGY.md, CONTACTS.md
- **SYSTEM Layer:** ARCHITECTURE.md, ORCHESTRATION.md, WORKFLOWS.md, MEMORY_LOGIC.md, TOOLBOX.md
- **SECURITY Layer:** GUARDRAILS.md, REPOS_RULES.md

**Result:** PAL Master initializes with full context, ready to process your requests.

---

### PreToolUse

**Trigger:** Before any tool (write, delete, execute) runs

**Purpose:** Security validation to prevent catastrophic operations

**Location:** `.claude/tools/hooks/pre-tool-use.ts`

**What It Does:**
1. Reads operation details (tool, path, action)
2. Checks against GUARDRAILS.md rules
3. Checks data policies in REPOS_RULES.md
4. Makes decision:
   - **BLOCK** — Catastrophic operation, stop immediately
   - **WARN** — Risky operation, ask for confirmation
   - **ALLOW** — Safe operation, proceed

**Protected Paths:**
- `.claude/base/` — System files (warn on edit)
- `.env`, `credentials.*` — Secrets (block)
- `node_modules/` — Dependencies (block write)

---

### Stop

**Trigger:** When a PAL session ends

**Purpose:** Cleanup, notifications, and session logging

**Location:** `.claude/tools/hooks/stop.ts`

**What It Does:**
- Sends configured notifications (if enabled)
- Saves session transcript (if configured)
- Logs session summary
- Performs cleanup operations

---

## Agents

### PAL Master

**Role:** Primary orchestrator and router

**Domain:** None (system-wide)

**When Active:** Default agent at session start

**Capabilities:**
- Intent classification (understand what you want)
- Skill activation (match request to skill)
- Agent loading (load specialists on request)
- Context assembly (gather relevant files)
- Plan presentation (show plans before execution)
- Execution oversight (monitor and report)

**Commands:**
| Command | Description |
|---------|-------------|
| `*menu` | Show available commands |
| `*skills` | List all skills |
| `*workflows` | List available workflows |
| `*agents` | Show domain agents |
| `*context` | Display loaded context |
| `*help` | Show help documentation |
| `*dismiss` | Exit (returns to self) |

---

### 1. PAL Builder

**Role:** System architect for PAL development

**Domain:** PALBuilder

**Load Command:** `/load-pal-builder`

**Skills:** system-build, create-skill, create-agent, create-domain

**When to Use:** Building or extending PAL itself — creating new skills, agents, domains, or specifications

**Commands:**
| Command | Description |
|---------|-------------|
| `*menu` | Show available commands |
| `*spec` | Create a specification |
| `*plan` | Create implementation plan |
| `*tasks` | Generate task breakdown |
| `*implement` | Execute implementation |
| `*context` | Show loaded context |
| `*save-session` | Save session log |
| `*dismiss` | Return to PAL Master |

---

### 2. Life Coach

**Role:** Personal life management

**Domain:** LifeOS

**Load Command:** `/load-life-coach`

**Skills:** life-management

**When to Use:** Working with your personal context — updating beliefs, adding goals, processing life notes

**Managed Files:**
- `mission.md` — Your purpose and direction
- `beliefs.md` — Core convictions
- `frames.md` — Mental frameworks
- `models.md` — Mental models
- `learned.md` — Lessons and insights
- `goals.md` — Objectives and targets
- `projects.md` — Active initiatives

**Commands:**
| Command | Description |
|---------|-------------|
| `*update` | Add or edit life context |
| `*extract` | Process notes into life files |
| `*export` | Generate life summary report |
| `*status` | Show domain state |
| `*files` | List life context files |
| `*dismiss` | Return to PAL Master |


---

## Domains

Domains are project workspaces for organizing project-specific work, documentation, and context. Each domain is a siloed environment with its own index, plans, sessions, and assets.

### Domain Structure

All domains follow this standard structure:

```
domains/[DomainName]/
├── INDEX.md              # Source of Truth (at root)
├── CONNECTIONS.yaml      # External integrations (at root)
├── 00_CONTEXT/           # Background and reference docs
├── 01_PROJECTS/          # Active project files (PROJECT_*.md)
├── 02_SESSIONS/          # Session logs (YYYY-MM-DD_title.md)
├── 03_ASSETS/            # Reference materials
├── 04_OUTPUTS/           # Generated deliverables
└── 05_ARCHIVE/           # Deprecated content
```

**Nesting Limit:** Maximum 3 levels below domain root

---

### Available Domains

#### 1. PALBuilder

**Purpose:** PAL system development workspace

**Agent:** PAL Builder

**Contains:**
- Architecture decisions
- Feature specifications
- Implementation plans
- Requirements documentation
- Session logs

---

#### 2. LifeOS

**Purpose:** Personal life management

**Agent:** Life Coach

**Contains:**
- Mission and purpose
- Beliefs and values
- Mental models and frames
- Goals and projects
- Lessons learned

---

## Quick Reference

### Skill Activation

Skills activate via **intent matching**, not keywords. PAL Master reads your request, understands the concept, and matches to the best skill.

### Agent Loading

```bash
/load-pal-builder       # Load PAL Builder
/load-life-coach        # Load Life Coach
/load-studio-agent      # Load Studio Agent
/load-substack-manager  # Load Substack Manager
*dismiss                # Return to PAL Master
```

### Essential Commands

| Command | Description |
|---------|-------------|
| `*menu` | Show available commands |
| `*skills` | List all skills |
| `*agents` | Show domain agents |
| `*context` | Display loaded context |
| `*dismiss` | Exit current agent |

---

**Document Version:** 0.1.0-alpha
**Last Updated:** 2026-02-16
