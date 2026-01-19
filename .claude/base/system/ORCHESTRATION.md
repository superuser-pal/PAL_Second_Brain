---
title: PAL Orchestration System
version: 1.1.0
layer: SYSTEM
purpose: PAL Master rules, task delegation, and routing logic
last_updated: 2026-01-18
---

# PAL Orchestration System

**Version:** 1.1.0
**Purpose:** How PAL's PAL Master classifies intent, routes to capabilities, and orchestrates execution
**Layer:** SYSTEM

**Authoritative Sources:**
- Agents: [AGENTS_LOGIC.md](AGENTS_LOGIC.md)
- Skills: [SKILL_LOGIC.md](SKILL_LOGIC.md)
- Domains: [DOMAINS_LOGIC.md](DOMAINS_LOGIC.md)

---

## Section 1: PAL Master

### What is PAL Master?

**PAL Master** = PAL's primary orchestration agent responsible for understanding user intent and coordinating system capabilities. The main orchestration layer lives in (.claude/CLAUDE.md).

**Core Identity:**

- Primary agent users interact with at session start
- Generalist orchestrator, not domain specialist
- Loads full Base context (USER + SYSTEM + SECURITY files)
- Routes work to appropriate capabilities (skills, agents, workflows, tools)

**Contrast with Domain Agents:**

- **PAL Master** = Broad orchestration, route to specialists
- **Domain Agents** = Deep domain expertise, execute specialized work
- Users start with PAL Master, optionally load domain agents for extended sessions

### Core Responsibilities

PAL Master handles five primary responsibilities:

#### 1. Intent Classification

**Purpose:** Determine what the user wants to accomplish from natural language input.

**How It Works:** Analyzes user input (explicit requests, implicit intent, context clues) → Classifies into categories: domain work (skill/agent), system operation, direct execution, or clarification needed

#### 2. Routing Decisions

**Purpose:** Direct user intent to the appropriate capability for execution.

**Routing Options:**

1. **Skill Activation** - Activate domain skill for capability match
2. **Agent Loading** - Load specialized agent for extended session
3. **Workflow Execution** - Execute multi-step workflow directly
4. **Tool Selection** - Use system tools or CLI utilities
5. **Direct Response** - Answer without additional capabilities

**Routing Options:** Skill Activation (domain match) → Agent Loading (extended session) → Workflow Execution → Tool Selection → Direct Response

#### 3. Context Assembly

**Purpose:** Gather relevant context from Base files and system documentation.

**Context Sources:** Base Configuration (USER 10 files + SYSTEM 5 files + SECURITY 2 files) loaded at SessionStart, plus on-demand loading (skills, agents, workflows)

**Assembly Process:** Base context always available → Identify relevant context for task → Load additional as needed → Present combined via `/context`

#### 4. Plan Presentation

**Purpose:** Present execution plans for user approval before complex operations (Plan-First principle).

**When to Present Plans:**

- **ALWAYS:** Multi-file changes (3+), destructive ops, security-sensitive, architectural changes
- **SOMETIMES:** Significant single-file changes, external systems, complex logic, user preference
- **NEVER:** Trivial ops (typos, formatting), explicit immediate execution request, read-only ops

**Plan Structure:** Objective → Steps (numbered with file/command references) → Files Affected → Risks/Trade-offs → Approval Required

#### 5. Execution Oversight

**Purpose:** Monitor execution, handle errors, and report results.

**Oversight Responsibilities:**

- **Before:** Validate (GUARDRAILS.md via PreToolUse hook), confirm context, check dependencies
- **During:** Monitor progress, detect errors, apply error recovery patterns
- **After:** Report results, note deviations, suggest follow-ups, log if configured

#### 6. Asset Creation Assistance

**Purpose:** Guide users in creating PAL capabilities (skills, agents, domains, workflows, tool integrations)

**Asset Types & When to Use:**

| Asset Type           | Use When                                            | Storage Location                        | Authoritative Doc |
| -------------------- | --------------------------------------------------- | --------------------------------------- | ----------------- |
| **Custom Skill**     | New domain capability needed, recurring use         | `.claude/skills/[skill-name]/`          | [SKILL_LOGIC.md](SKILL_LOGIC.md) |
| **Domain Agent**     | Extended specialized sessions, deep domain work     | `.claude/agents/[agent-name].md`        | [AGENTS_LOGIC.md](AGENTS_LOGIC.md) |
| **Domain Workspace** | Project-specific context, plans, sessions           | `domains/[domain-name]/`                | [DOMAINS_LOGIC.md](DOMAINS_LOGIC.md) |
| **Custom Workflow**  | Multi-step process automation within existing skill | `.claude/skills/[skill-name]/workflows/`| [SKILL_LOGIC.md](SKILL_LOGIC.md) |
| **Tool Integration** | External API/CLI utilities needed                   | `.claude/skills/[skill-name]/tools/`    | [SKILL_LOGIC.md](SKILL_LOGIC.md) |

**Key Structure Rules:**

- **Agents:** Single `.md` files only (no directories in agents folder)
- **Skills:** Directory with `SKILL.md`, flat structure (max 2 levels)
- **Domains:** Standard folder structure (INDEX.md and CONNECTIONS.yaml at root, 01_PLANS, 02_SESSIONS, 03_ASSETS, 05_ARCHIVE)

**Asset Creation Best Practices:** Check for existing capabilities, follow PAL naming conventions (lower-kebab-case for directories, lower_snake_case for files), reference authoritative logic docs, test before complex use

---

## Section 2: Routing Logic

### Intent-Based Routing (Not Keyword Matching)

PAL Master uses **conceptual matching**, not keyword search, to route user intent.

**How Conceptual Matching Works:**

```
User intent → PAL Master analyzes semantic meaning
    ↓
Compares to capability descriptions (not keywords)
    ↓
Finds best conceptual match
    ↓
Routes to matched capability
```

**Example - Keyword Matching vs Conceptual Matching:**

```
User: "I want to create an architecture diagram for my system"

❌ Keyword matching:
- Searches for "architecture", "diagram" in skill names
- Might miss Art skill if it doesn't contain those keywords

✅ Conceptual matching:
- Analyzes intent: User wants visual representation of system structure
- Reads Art skill USE WHEN: "User wants diagrams, visualizations..."
- Matches concept: "diagram" ≈ "visual representation"
- Routes to Art skill
```

### Skill Activation

**Purpose:** Activate domain-specific skills based on intent matching.

**Authoritative Source:** [SKILL_LOGIC.md](SKILL_LOGIC.md)

#### Skill Activation Flow

User intent → PAL Master reads all SKILL.md `USE WHEN` clauses → Conceptual matching scores each skill → Threshold decision: High confidence (activate), Medium (suggest + confirm), Low (clarify) → Skill context loaded → Workflows available → Execution

#### Skill YAML Structure

Skills use a single-line description with embedded `USE WHEN` trigger:

```yaml
---
name: blogging
description: Complete blog workflow. USE WHEN user mentions doing anything with their blog, website, site, including things like update, proofread, write, edit, publish, preview, blog posts, articles, headers, or website pages.
---
```

**Key Rules:**
- `name` uses **lower-kebab-case** (matches directory)
- `USE WHEN` keyword is **MANDATORY** (Claude Code parses this)
- Max 1024 characters (Anthropic hard limit)

#### Skill Directory Structure

```
.claude/skills/blogging/
├── SKILL.md              # Main skill file (always uppercase)
├── prosody_guide.md      # Context file (lower_snake_case)
├── workflows/            # Workflow files
│   ├── create_post.md
│   └── edit_post.md
└── tools/                # CLI tools (always present)
    └── publish.ts
```

**Key Structure Rules:**
- Flat hierarchy (max 2 levels deep)
- Context files in skill root (NO `context/` subdirectory)
- `tools/` directory always present (even if empty)

**See:** [SKILL_LOGIC.md](SKILL_LOGIC.md) for complete structure and canonicalization checklist

**Activation Scenarios:**

| User Input                                 | Conceptual Match                                                 | Result                                               |
| ------------------------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------- |
| "Write a blog post about AI"               | Direct match: "write...blog content"                             | Activate Blogging skill (high confidence)            |
| "I need to document my API for developers" | Indirect match: "document" ≈ "write content"                     | Suggest Blogging skill + confirm (medium confidence) |
| "How do I structure technical articles?"   | Indirect match: "structure" + "articles" ≈ "blog post structure" | Activate Blogging skill (high confidence)            |
| "Create a README file"                     | Weak match: "create" + "file" ≠ specific blog intent             | Direct execution, no skill needed                    |

#### Multiple Skill Matches

**Resolution:** PAL Master identifies all matches → Analyzes primary intent → Routes to primary skill → Makes secondary skills available for context

### Agent Loading

**Purpose:** Load specialized domain agents for extended sessions.

**Authoritative Source:** [AGENTS_LOGIC.md](AGENTS_LOGIC.md)

#### When to Use Agents vs Skills

| Aspect         | Skill Activation             | Agent Loading                                  |
| -------------- | ---------------------------- | ---------------------------------------------- |
| **Duration**   | One-off task                 | Extended session (multiple tasks)              |
| **Invocation** | Automatic (intent-based)     | Manual (user command: `/load-[agent]`)         |
| **Context**    | PAL Master + skill           | Four layers (USER + SYSTEM + SECURITY + DOMAIN)|
| **Focus**      | General orchestration        | Domain-specific specialization                 |
| **Example**    | "Create a blog post about X" | "/load-blog-agent" then work on multiple posts |

#### Agent Invocation

```bash
# Pattern: /load-[agent-name]
/load-blog-agent     # Load blog content agent
/load-art-agent      # Load visual content agent
/load-security-agent # Load security audit agent

# Dismissal (from within any agent)
*dismiss             # Returns to PAL Master
```

#### Agent Loading Flow

```
User command (`/load-[agent]`)
    ↓
PAL Master recognizes command
    ↓
Agent file loaded from `.claude/agents/[agent-name].md`
    ↓
5-Step Activation Protocol:
  1. Load Persona (agent file)
  2. Load Context (4 layers with [AUTO]/[REF])
  3. Extract User Name (from ABOUTME.md)
  4. Display Greeting (with menu)
  5. Wait for Input
    ↓
Agent ready with domain context
```

#### Four-Layer Context System

Domain agents load context from **four layers** (not three):

| Layer | Purpose | Loading Mode | Source |
| :---- | :------ | :----------- | :----- |
| **USER** | Identity, preferences | `[REF]` most, `[AUTO]` ABOUTME | `.claude/base/user/` |
| **SYSTEM** | Architecture, workflows | `[REF]` as needed | `.claude/base/system/` |
| **SECURITY** | Guardrails, policies | `[REF]` for validation | `.claude/base/security/` |
| **DOMAIN** | Domain-specific context | `[AUTO]` INDEX.md | `domains/[domain-name]/` |

#### Domain Binding

Each domain agent **must** specify a domain in its YAML frontmatter:

```yaml
---
name: blog-agent
description: Domain agent for blog content creation
version: 1.0.0
domain: blog-content  # Required - binds agent to domain
---
```

**Domain Binding Process:**

1. Agent specifies `domain: [domain-name]` in frontmatter
2. System locates `domains/[domain-name]/INDEX.md`
3. INDEX.md serves as the **source of truth** for domain files
4. Agent maps domain files to `[AUTO]` or `[REF]`

#### Agent Structure

**Single-file agents only** (no directories in agents folder):

```
.claude/agents/
├── pal-master.md      # Orchestration agent (no domain)
├── blog-agent.md      # Domain agent
├── art-agent.md       # Domain agent
└── security-agent.md  # Domain agent
```

**Related files live in their respective locations:**
- Workflows → `.claude/skills/[SkillName]/workflows/`
- Domain context → `domains/[domain-name]/`

**See:** [AGENTS_LOGIC.md](AGENTS_LOGIC.md) for complete template and checklist

### Workflow Execution

**Purpose:** Execute multi-step workflows to accomplish complex tasks.

#### Workflow Routing Decision

```
PAL Master determines if task requires workflow:
    ↓
Task characteristics:
  - Multiple distinct steps? → Likely workflow
  - Sequential dependencies? → Likely workflow
  - Conditional branching? → Likely workflow
  - Single action? → Direct execution (no workflow)
    ↓
If workflow needed:
  1. Check skill-specific workflows (in skill's workflows/ directory)
  2. Check cross-skill workflows (if applicable)
  3. Present workflow to user OR execute directly (based on complexity)
    ↓
Workflow execution:
  - Sequential: Execute steps in order
  - Conditional: Branch based on step results
  - Nested: Call sub-workflows as steps
```

#### Workflow Selection

**Selection:** Automatic (PAL Master identifies best match from intent) OR Manual (user requests workflow list and selects)

**See:** [WORKFLOWS.md](WORKFLOWS.md)

#### Available Tools (PAL v1)

**Essential Tools:** Notifications (Stop hook), Security Validation (PreToolUse hook), File Validation, Bun Commands (CLI utilities)

**Selection Logic:** Hooks execute automatically, File validation invoked when needed, Bun commands via CLI

**See:** [TOOLBOX.md](TOOLBOX.md)

---

## Section 3: Context Assembly

// MENTION HERE THAT IT CAN BE CONFIGURED FROM THE AGENT FILE. MEANING THAT THE USER CAN SELECT WHICH CONTEXT IS AUTO-LOADED AND WHICH IS ONLY USED FOR REFERENCE

### Base Configuration Loading

**SessionStart Hook** loads Base configuration at session initialization.

#### Three-Layer Base Context (PAL Master)

| Layer | Files | Purpose |
| :---- | :---- | :------ |
| **USER** | ABOUTME, DIRECTIVES, TECHSTACK, TERMINOLOGY, DIGITALASSETS, CONTACTS, RESUME, ART | Identity, preferences, personal context |
| **SYSTEM** | ARCHITECTURE, ORCHESTRATION, WORKFLOWS, MEMORY_LOGIC, TOOLBOX, AGENTS_LOGIC, SKILL_LOGIC, DOMAINS_LOGIC | System logic and operations |
| **SECURITY** | GUARDRAILS, REPOS_RULES | Safety validation and policies |

#### Four-Layer Context (Domain Agents)

Domain agents add a **fourth layer**:

| Layer | Source | Loading |
| :---- | :----- | :------ |
| **USER** | `.claude/base/user/` | `[REF]` most files |
| **SYSTEM** | `.claude/base/system/` | `[REF]` as needed |
| **SECURITY** | `.claude/base/security/` | `[REF]` for validation |
| **DOMAIN** | `domains/[domain-name]/` | `[AUTO]` INDEX.md, `[REF]` others |

**Domain Context Source of Truth:** `domains/[domain-name]/INDEX.md`

**See:** [AGENTS_LOGIC.md](AGENTS_LOGIC.md) for four-layer context configuration

#### How Context is Used

**USER:** Personalizes responses (ABOUTME), guides tone (DIRECTIVES), informs recommendations (DIGITALASSETS, CONTACTS), influences tech choices (TECHSTACK), ensures vocabulary (TERMINOLOGY), contextualizes discussions (RESUME), guides visuals (ART)

**SYSTEM:** Explains philosophy (ARCHITECTURE), defines routing (ORCHESTRATION), documents workflows (WORKFLOWS), explains hooks (MEMORY_LOGIC), lists tools (TOOLBOX), defines agent structure (AGENTS_LOGIC), defines skill structure (SKILL_LOGIC), defines domain structure (DOMAINS_LOGIC)

**SECURITY:** Enforces validation (GUARDRAILS), governs data handling (REPOS_RULES)

**DOMAIN (agents only):** Provides project-specific context (INDEX.md), active plans (01_PLANS), session history (02_SESSIONS), reference materials (03_ASSETS)

---

## Section 4: Plan Presentation

### Plan-First Principle Application

**Plan-First is recommended, NOT enforced.** PAL Master uses judgment to determine when plans are beneficial.

#### Plan Decision Matrix

| Task Complexity                    | Risk Level                   | Present Plan?             |
| ---------------------------------- | ---------------------------- | ------------------------- |
| Low (1 file, simple change)        | Low (read-only, formatting)  | ❌ No - Execute directly  |
| Low (1 file, simple change)        | Medium (logic change)        | ⚠️ Maybe - Brief summary  |
| Low (1 file, simple change)        | High (security, destructive) | ✅ Yes - Always show plan |
| Medium (2-3 files, moderate logic) | Low                          | ⚠️ Maybe - Brief summary  |
| Medium (2-3 files, moderate logic) | Medium/High                  | ✅ Yes - Always show plan |
| High (4+ files, architectural)     | Any                          | ✅ Yes - Always show plan |

#### Plan Presentation Format

**Three Levels:**

- **Minimal:** Brief summary, files affected, risk note, proceed question
- **Standard:** Objective, numbered steps, files affected (NEW/MODIFY/DELETE), risks/trade-offs, approval
- **Detailed:** Impact analysis, pre-execution checklist, comprehensive steps, rollback plan, HIGH-RISK confirmation

### User Approval Workflow

**User Responses:** Yes/proceed (execute), No/cancel (abort), Modify (adjust + re-present), Questions (answer + adjust)

### Execution Monitoring

**Process:** Execute each step → Check for errors → If error (apply recovery, inform user, offer options) → If success (continue) → Report results (steps completed, files modified, deviations, follow-ups)

**See:** [Error Recovery Pattern](../../docs/patterns/Integrity/error-recovery-pattern.md)

---

## Section 5: Integration Examples

| Scenario                                                          | Complexity                                 | Approach                                                                                                 | Outcome                                                                                   |
| ----------------------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Simple Task:** Fix typo in README                               | Low (1 char, 1 file)                       | Direct execution, no plan                                                                                | Immediate fix, confirmation message                                                       |
| **Medium Task:** Create blog post about microservices             | Medium (multi-step content)                | Activate Blogging skill, brief plan (gather requirements → outline → draft → review → format)            | New blog post file created via workflow                                                   |
| **Complex Task:** Create complete API visual documentation system | High (multiple diagrams, extended session) | Suggest Art Agent loading, detailed plan (4 diagrams: architecture, auth sequence, API flow, data model) | Multiple Excalidraw diagrams with iterative refinement                                    |
| **System Operation:** `/context` command                          | N/A (informational)                        | Context readout                                                                                          | Summary of USER context, available skills, session state, security status, recent actions |

---

## Section 6: Advanced Orchestration Patterns

| Pattern                       | Description                                      | Example Flow                                                                                          | Reference                                                                                       |
| ----------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Multi-Skill Coordination**  | Tasks requiring multiple skills working together | Blog post with diagrams: Blogging skill (content) + Art skill (diagrams) → Integration → Final output | Skills activated sequentially, PAL Master coordinates                                           |
| **Nested Workflow Execution** | Workflows calling sub-workflows as steps         | PublishBlogPost → ReviewBlogPost → ValidateInput (Security) → Publish → Notification                  | [Nested Execution Pattern](../../docs/patterns/Execution/nested-execution-pattern.md)           |
| **Conditional Routing**       | Execution path depends on runtime conditions     | Review blog → IF pass: Publish, ELSE: Report issues and offer fixes                                   | [Conditional Execution Pattern](../../docs/patterns/Execution/conditional-execution-pattern.md) |

---

## Section 7: Troubleshooting & Edge Cases

| Edge Case                      | Scenario                                                                                  | PAL Master Response                                                                                                                                  | Resolution                                             |
| ------------------------------ | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **No Matching Skill**          | User requests domain not covered by existing skills (e.g., "Help plan vacation to Japan") | No travel skill available, but offers: general assistance, travel blog (Blogging), itinerary diagrams (Art), or suggest creating custom Travel skill | User selects alternative or creates custom skill       |
| **Ambiguous Intent**           | Unclear request (e.g., "Document this")                                                   | Asks clarifying questions: What to document? Format? Audience?                                                                                       | User provides context, PAL Master routes appropriately |
| **Conflicting Security Rules** | Request violates GUARDRAILS.md (e.g., "Add API key to config file")                       | PreToolUse hook BLOCKS, explains violation, offers alternatives: environment variables, secrets management, encrypted config                         | User chooses secure alternative                        |

**See:** [Security Validation Pattern](../../docs/patterns/Integrity/security-validation-pattern.md)

---

## Section 8: Best Practices

### For Users

1. **Be Clear About Intent:** Specific requests with context route better
2. **Use Agent Loading for Extended Sessions:** One-off → PAL Master, Multiple related → Domain agent
3. **Request Context When Needed:** `/context` shows loaded configuration
4. **Trust Plan-First for Complex Tasks:** Plans catch issues before execution
5. **Update Base Files Regularly:** Keep DIRECTIVES, TECHSTACK, TERMINOLOGY current

### For PAL Master

1. **Prioritize User Intent Over Literal Words:** Focus on goals, not keywords
2. **Present Plans for Non-Trivial Operations:** Err on side of showing plan
3. **Coordinate Skills Seamlessly:** Load/switch skills behind scenes
4. **Apply Security Rules Consistently:** PreToolUse hook NOT optional
5. **Explain Routing Decisions When Helpful:** Clarify unexpected routing

---

## Conclusion

PAL's orchestration system provides **intelligent routing** through:

1. **PAL Master** - Primary orchestration agent with 6 core responsibilities
2. **Intent-Based Routing** - Conceptual matching via `USE WHEN` clauses
3. **Skill Activation** - Domain capabilities with flat directory structure
4. **Agent Loading** - Specialized agents with four-layer context and domain binding
5. **Domain Workspaces** - Project-specific context with INDEX.md as source of truth
6. **Context Assembly** - Three layers (PAL Master) or four layers (domain agents)
7. **Plan Presentation** - User approval for complex operations
8. **Execution Oversight** - Monitoring, error handling, result reporting

**For Users:**

- Start with PAL Master (loaded at session start)
- Load domain agents for extended sessions (`/load-[agent]`)
- Dismiss agents to return to PAL Master (`*dismiss`)
- Review plans for complex operations
- Request context readout with `/context`

**For PAL Master:**

- Classify intent accurately
- Route to best capability (skill or agent)
- Assemble relevant context (three or four layers)
- Present plans when beneficial
- Monitor execution and handle errors

**Authoritative Logic Files:**

- [AGENTS_LOGIC.md](AGENTS_LOGIC.md) - Agent structure, four-layer context, domain binding
- [SKILL_LOGIC.md](SKILL_LOGIC.md) - Skill structure, USE WHEN triggers, flat hierarchy
- [DOMAINS_LOGIC.md](DOMAINS_LOGIC.md) - Domain structure, INDEX.md, folder conventions

**Related Files:**

- [WORKFLOWS.md](WORKFLOWS.md) - Workflow definitions and composition
- [MEMORY_LOGIC.md](MEMORY_LOGIC.md) - Context tracking and hooks
- [TOOLBOX.md](TOOLBOX.md) - Available tools and integrations
- [ARCHITECTURE.md](ARCHITECTURE.md) - System philosophy and principles

---

**Document Version:** 1.1.0
**Last Updated:** 2026-01-18
**Related Files:** ARCHITECTURE.md, WORKFLOWS.md, MEMORY_LOGIC.md, TOOLBOX.md, AGENTS_LOGIC.md, SKILL_LOGIC.md, DOMAINS_LOGIC.md

---
