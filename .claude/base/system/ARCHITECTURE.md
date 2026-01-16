---
title: PAL System Architecture
version: 1.0.0
layer: SYSTEM
purpose: Founding principles, philosophy, and master system map
last_updated: 2026-01-13
---

# PAL System Architecture

**Version:** 1.0.0
**Purpose:** PAL's architectural foundation - the "Constitution" defining WHY the system works this way
**Layer:** SYSTEM

---

## Section 1: System Philosophy

### PAL's Core Statement

> "PAL is a pattern-based modular system that empowers non-technical professionals to architect AI systems through organized context engineering, educational documentation, and simple modular configuration."

### What This Means

**PAL is NOT:** Black box abstraction, automation replacement, pre-configured limits

**PAL IS:** Transparent framework, tutorial-driven documentation, modular growth platform

---

## Section 2: PAL's 10 Core Principles

PAL's architecture is built on 10 foundational principles:

### Core Pillars

#### 1. Technical-Literate First

**Principle:** Empower users through education, not abstraction.

**What This Means:**

- Users learn HOW the system operates, not just what it does
- Documentation explains patterns, workflows, and routing logic
- Complexity is revealed progressively, not hidden
- Editing logic files transforms users into system architects

#### 2. Context > Prompts

**Principle:** Context engineering beats prompt engineering.

**What This Means:**

- Base configuration files provide persistent context for the system behaviour
- Organizing context in an editable and navigable way provides more control over system responses
- Skills and agents inherit context from specific knowledge domains
- Only necessary context is loaded to prevent system overload.

**Example:**

```
Your TECHSTACK.md says: "Prefer TypeScript with strict mode"
Your DIRECTIVES.md says: "Always explain trade-offs"

PAL Master reads this BEFORE any task →
Every coding task automatically uses TypeScript + explains decisions
```

**Trade-off:** Upfront configuration effort, but consistent behavior without repetitive prompting.

#### 3. Plan-First Execution

**Principle:** Recommended workflow for transparency (NOT enforced).

**What This Means:**

- Users are encouraged to approach every operation in "Plan Mode" first.
- The system provides all key details to build and understand the plan.
- Users verify context, task comprehension, and intended output before execution
- Planning yields better results through transparency and mutual agreement

#### 4. Pattern-Based System

**Principle:** Low-floor, high-ceiling design through composable patterns.

**What This Means:**

- Patterns are repetitive, modular structures that define how the system operates
- They dictate best practices for the ingestion, management and execution of operations
- Pattern Library documents system building blocks for users to understand and adopt
- Simple, recognizable patterns combine and stack to create complex workflows

#### 5. Code Before Prompts

**Principle:** Executable code creates deterministic behavior.

**What This Means:**

- Users should transform repetitive system actions into code to ensure 100% predictability
- Executing code via Bun or NPM eliminates model hallucinations during complex tasks
- Deterministic logic is preferred over prompts for critical system integrity and security
- Prompts handle creative variability while code manages the underlying system plumbing

#### 6. Domain-Driven Documentation

**Principle:** Structure context around specific domains to prevent context pollution and ensure precision.

**What This Means:**

- All related information is documented within specific domain folders
- Every domain acts as a siloed environment containing its own index, templates, documentation, and plans
- Keeping data organized within domains ensures information is structured, easy to access, and highly relevant
- Agents and workflows are explicitly instructed to interact with these domain structures to maintain system reliability

#### 7. Self Update System

**Principle:** System can evolve and improve itself.

**What This Means:**

- Updates are modular and self-contained to specific areas of the system
- Skills can be added or modified without system rebuild
- Pattern Library expands with new operation templates
- Users maintain system evolution through file updates paired with AI assistance

#### 8. Pattern Library Management

**Principle:** System operations documented as educational patterns.

**What This Means:**

- Pattern Library in `docs/patterns/` explains HOW system works
- Patterns organized into groups depending on the type of block (hooks, skills, workflows, tools, etc.)
- Users read patterns to understand, PAL Master references patterns
- Patterns reflect best practices for efficient operations and optimize token usage and cost

#### 9. PAL Master with Specialized Sub-Agents

**Principle:** Primary orchestrator with domain-specific agents for focused work.

**What This Means:**

- **PAL Master** = Primary agent, handles routing and orchestration
- **Domain Agents** = Specialized agents loaded via `/load-[agent]` commands
- Domain agents inherit Base context + domain skills + workflows
- Users load agent configurations to ensure the right context is being loaded

#### 10. Permission to Fail

**Principle:** Graceful degradation and error transparency.

**What This Means:**

- System errors are visible and explained, not hidden
- Workflows can fail at steps without system crash
- Error Recovery Pattern documents graceful degradation
- Users learn from failures through transparent error reporting

---

## Section 3: Layered Architecture

PAL organizes context and operations into 3 layers:

| Layer        | Purpose                                         | Files   | Key Files                                                                         | Characteristics                                                                                                                                  | Access Pattern                                                                                  |
| ------------ | ----------------------------------------------- | ------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| **USER**     | Personal context, preferences, domain knowledge | 8 files | ABOUTME, DIRECTIVES, DIGITALASSETS, CONTACTS, TECHSTACK, TERMINOLOGY, RESUME, ART | • Uppercase filenames<br>• User-editable, frequently updated<br>• YAML frontmatter<br>• Persistent context to PAL Master                         | SessionStart hook loads all → PAL Master has full context → Skills/agents inherit               |
| **SYSTEM**   | Operational logic, orchestration, workflows     | 5 files | ARCHITECTURE, ORCHESTRATION, WORKFLOWS, MEMORY_LOGIC, TOOLBOX                     | • Uppercase filenames<br>• User-readable, infrequently modified<br>• YAML frontmatter<br>• Documents HOW system operates                         | PAL Master references for logic → Pattern Library provides education → Users read to understand |
| **SECURITY** | Permissive security with catastrophic blocking  | 2 files | GUARDRAILS, REPOS_RULES                                                           | • Uppercase filenames<br>• User-configurable, rarely modified<br>• Enforced via PreToolUse hook<br>• Blocks catastrophic, allows controlled risk | PreToolUse hook reads files → Validates against rules → Block/warn/allow decision               |

---

## Section 4: Master System Map

### Component Relationships

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER LAYER                                   │
│                                                                       │
│  ABOUTME • DIRECTIVES • DIGITALASSETS • CONTACTS • TECHSTACK         │
│  TERMINOLOGY • RESUME • ART                                           │
│                                                                       │
│  [User's persistent context - loaded at session start]               │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
                     ┌────────────────────────┐
                     │   SessionStart Hook    │
                     │  (Loads Base Context)  │
                     └────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         PAL MASTER                                   │
│                                                                       │
│  Core Responsibilities:                                              │
│  • Intent Classification (analyze user request)                      │
│  • Routing Decisions (skill/agent/workflow/tool)                     │
│  • Context Assembly (Base + patterns)                                │
│  • Plan Presentation (when appropriate)                              │
│  • Execution Oversight (monitor and report)                          │
│                                                                       │
│  Has access to: USER context, SYSTEM docs, SECURITY rules            │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
                    ┌──────────────────────────┐
                    │   Routing Logic           │
                    │                           │
                    │  • Skill Activation       │
                    │  • Agent Loading          │
                    │  • Workflow Execution     │
                    │  • Tool Selection         │
                    └──────────────────────────┘
                                  ↓
          ┌───────────────────────┼───────────────────────┐
          ↓                       ↓                       ↓
    ┌─────────┐           ┌─────────────┐         ┌──────────┐
    │ SKILLS  │           │   AGENTS    │         │WORKFLOWS │
    │         │           │             │         │          │
    │Blogging │           │Blog Agent   │         │Sequential│
    │Art      │           │Art Agent    │         │Condition.│
    │Security │           │Security Ag. │         │Nested    │
    │Prompting│           │(via /load-*)│         │          │
    └─────────┘           └─────────────┘         └──────────┘
          ↓                       ↓                       ↓
    ┌────────────────────────────────────────────────────────┐
    │              PreToolUse Hook                            │
    │         (Security validation before execution)          │
    └────────────────────────────────────────────────────────┘
                                  ↓
                          [ Execution ]
                                  ↓
    ┌────────────────────────────────────────────────────────┐
    │                Stop Hook                                │
    │       (Notifications on session end)                    │
    └────────────────────────────────────────────────────────┘
```

### Supporting Documentation

```
docs/patterns/                    [Pattern Library - Educational]
├── Routing/
│   ├── skill-routing-pattern.md      → How skills activate
│   ├── agent-routing-pattern.md      → How agents load
│   └── tool-routing-pattern.md       → How tools route (future)
├── Execution/
│   ├── sequential-execution-pattern.md → Linear workflows
│   ├── conditional-execution-pattern.md → Branching logic
│   └── nested-execution-pattern.md    → Workflow composition
└── Integrity/
    ├── security-validation-pattern.md → PreToolUse validation
    ├── file-validation-pattern.md     → Structure checks
    └── error-recovery-pattern.md      → Graceful degradation
```

### Data Flow Visualization

```
User Input (through CLI, IDE, or API)
    ↓
PAL Master receives input
    ↓
Intent Classification
    ↓
┌────────────────────────────────────────────────┐
│ Routing Decision:                               │
│ • Skill match? → Activate skill                 │
│ • Agent requested? (/load-*) → Load agent      │
│ • Otherwise → Direct workflow/tool execution   │
└────────────────────────────────────────────────┘
    ↓
Context Assembly (USER + SYSTEM + patterns)
    ↓
Plan Presentation (if complex task) → User Approval
    ↓
┌────────────────────────────────────────────────┐
│ PreToolUse Hook validates:                     │
│ • GUARDRAILS.md rules                           │
│ • REPOS_RULES.md data policies                  │
│ • Decision: Block / Warn / Allow                │
└────────────────────────────────────────────────┘
    ↓
Tool/Workflow Execution
    ↓
Results returned to user
    ↓
Session End → Stop Hook (notifications)
```

---

## Section 5: Skills Architecture

### What Are Skills?

**Skills** = Domain-specific capabilities containing knowledge, workflows, and execution logic

**Location:** `.claude/skills/` directory

**Purpose:** Execute domain-specific work (write blog posts, generate art, audit security, create prompts)

### Skill Structure

Each skill follows this structure:

```
.claude/skills/Blogging/
├── SKILL.md                 # Skill definition with YAML frontmatter
├── workflows/               # Workflow definitions
│   ├── create-blog-post.md
│   ├── edit-blog-post.md
│   └── publish-blog-post.md
├── templates/ (optional)    # Reusable templates
├── tools/ (optional)        # Skill-specific CLI tools
└── examples/ (optional)     # Example outputs
```

### Skill Activation

Skills activate via **intent-based routing** and user natural language.

```markdown
# SKILL.md excerpt

USE WHEN:

- User wants to write, edit, or publish blog content
- User needs blog post structure or templates
- User asks about blogging best practices
- User wants to manage blog drafts or published posts
```

**How It Works:**

1. User expresses intent: "I need to write a blog post about AI ethics"
2. PAL Master reads all `SKILL.md` files
3. Conceptually matches intent to Blogging skill USE WHEN clauses
4. Activates Blogging skill (loads context into PAL Master)
5. Blogging workflows become available
6. PAL Master suggests relevant workflow or user selects

**See:** [Skill Routing Pattern](../../docs/patterns/Routing/skill-routing-pattern.md) for detailed documentation

---

## Section 6: Hook System Architecture

### What Are Hooks?

**Hooks** = TypeScript code that executes at specific system lifecycle points

**Location:** `.claude/tools/hooks/` directory

**Purpose:** Control system behavior deterministically (context loading, security validation, notifications)

### PAL v1 Hooks (3 Essential)

| Hook             | Trigger Point          | Purpose                                                     | Implementation     |
| ---------------- | ---------------------- | ----------------------------------------------------------- | ------------------ |
| **SessionStart** | Session initialization | Load Base context (USER + SYSTEM + SECURITY files)          | `session-start.ts` |
| **PreToolUse**   | Before tool execution  | Validate operation against GUARDRAILS.md and REPOS_RULES.md | `pre-tool-use.ts`  |
| **Stop**         | Session end            | Send notifications, save transcript, log summary            | `stop.ts`          |

### Hook Execution Flow

**Session Lifecycle:**

1. **Session Start** → SessionStart hook loads Base (USER + SYSTEM + SECURITY files) → PAL Master initialized with full context
2. **During Execution** → Before tool use, PreToolUse hook validates against GUARDRAILS.md and REPOS_RULES.md → Decision: Block (catastrophic) / Warn (risky) / Allow (safe)
3. **Session End** → Stop hook executes: notifications, save transcript, log summary, cleanup

**See table above for detailed hook specifications. See:** [MEMORY_LOGIC.md](MEMORY_LOGIC.md) for hook implementation guidance

---

## Section 7: Extension Points

PAL is designed for user customization and extension:

| Extension Type    | When to Extend                                                                                                                                  | How to Extend                        | Key Details                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------- |
| **Skills**        | Domain-specific work requires specialized knowledge, workflows, vocabulary                                                                      | Use skill creation commands/patterns | Each skill includes SKILL.md definition, workflows/, optional templates/ and tools/   |
| **Base Files**    | USER Layer: When preferences/context changes<br>SYSTEM Layer: When changing fundamental behavior (rare)<br>SECURITY Layer: When policies evolve | Direct file editing in PAL_Base/     | **Best Practice:** Maintain in version control, review changes in session transcripts |
| **Custom Agents** | Extended domain work requiring specialized persona                                                                                              | Use agent creation commands/patterns | Agents inherit Base context + domain skill, loaded via `/load-[agent]`                |
| **Toolbox**       | Need CLI utilities, external integrations, workflow automation                                                                                  | Add to `.claude/tools/` directory    | **See:** [TOOLBOX.md](TOOLBOX.md) for configuration                                   |

### Current Toolbox (PAL v1)

- Notifications (Stop hook)
- Security Validation (PreToolUse hook)
- File Validation
- Bun Commands (CLI utilities)

---

**Document Version:** 1.0.0
**Last Updated:** 2026-01-14
**Related Files:** ORCHESTRATION.md, WORKFLOWS.md, MEMORY_LOGIC.md, TOOLBOX.md, GUARDRAILS.md

---
