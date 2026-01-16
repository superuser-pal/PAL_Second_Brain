---
title: PAL Orchestration System
version: 1.0.0
layer: SYSTEM
purpose: PAL Master rules, task delegation, and routing logic
last_updated: 2026-01-13
---

# PAL Orchestration System

**Version:** 1.0.0
**Purpose:** How PAL's PAL Master classifies intent, routes to capabilities, and orchestrates execution
**Layer:** SYSTEM

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

**See:** [Skill Routing Pattern](../../docs/patterns/Routing/skill-routing-pattern.md)

#### 3. Context Assembly

**Purpose:** Gather relevant context from Base files, patterns, and system documentation.

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

**See:** [Error Recovery Pattern](../../docs/patterns/Integrity/error-recovery-pattern.md)

#### 6. Asset Creation Assistance

**Purpose:** Guide users in creating PAL capabilities (skills, agents, domains, workflows, tool integrations)

**Asset Types & When to Use:**

| Asset Type           | Use When                                            | Creation Method     | Storage Location                        |
| -------------------- | --------------------------------------------------- | ------------------- | --------------------------------------- |
| **Custom Skill**     | New domain capability needed, recurring use         | CreateSkill skill   | `.claude/skills/[SkillName]/`           |
| **Domain Agent**     | Extended specialized sessions, deep domain work     | Agents skill        | `.claude/agents/[AgentName]/`           |
| **External Domain**  | Access external knowledge base (company docs, APIs) | DomainManager skill | `.claude/domains/[DomainName]/`         |
| **Custom Workflow**  | Multi-step process automation within existing skill | Direct creation     | `.claude/skills/[SkillName]/workflows/` |
| **Tool Integration** | External API/CLI utilities needed                   | Direct creation     | `.claude/tools/`                        |

**Asset Creation Best Practices:** Check for existing capabilities, follow PAL conventions, include activation clauses, add security validation, document thoroughly, test before complex use, version control separately

**See:** CreateSkill, Agents, DomainManager skills for detailed guidance

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

#### Skill Activation Flow

User intent → PAL Master reads all SKILL.md USE WHEN clauses → Conceptual matching scores each skill → Threshold decision: High confidence (activate), Medium (suggest + confirm), Low (clarify) → Skill context loaded → Workflows available → Execution

#### Example: Blogging Skill Activation

```markdown
# Blogging Skill - SKILL.md

USE WHEN:

- User wants to write, edit, or publish blog content
- User needs blog post structure or templates
- User asks about blogging best practices
- User wants to manage blog drafts or published posts
```

**Activation Scenarios:**

| User Input                                 | Conceptual Match                                                 | Result                                               |
| ------------------------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------- |
| "Write a blog post about AI"               | Direct match: "write...blog content"                             | Activate Blogging skill (high confidence)            |
| "I need to document my API for developers" | Indirect match: "document" ≈ "write content"                     | Suggest Blogging skill + confirm (medium confidence) |
| "How do I structure technical articles?"   | Indirect match: "structure" + "articles" ≈ "blog post structure" | Activate Blogging skill (high confidence)            |
| "Create a README file"                     | Weak match: "create" + "file" ≠ specific blog intent             | Direct execution, no skill needed                    |

#### Multiple Skill Matches

**Resolution:** PAL Master identifies all matches → Analyzes primary intent → Routes to primary skill → Makes secondary skills available for context

**See:** [Skill Routing Pattern](../../docs/patterns/Routing/skill-routing-pattern.md)

### Agent Loading

**Purpose:** Load specialized domain agents for extended sessions.

#### When to Use Agents vs Skills

| Aspect         | Skill Activation             | Agent Loading                                  |
| -------------- | ---------------------------- | ---------------------------------------------- |
| **Duration**   | One-off task                 | Extended session (multiple tasks)              |
| **Invocation** | Automatic (intent-based)     | Manual (user command: `/load-[agent]`)         |
| **Context**    | PAL Master + skill           | Dedicated agent + skill pre-loaded             |
| **Focus**      | General orchestration        | Domain-specific specialization                 |
| **Example**    | "Create a blog post about X" | "/load-blog-agent" then work on multiple posts |

#### Available Agent Commands (PAL v1)

```bash
# Blogging domain
/load-blog-agent
# Activates: Blog Agent with Blogging skill pre-loaded
# Use for: Multiple blog posts, content series, blog management

# Creative generation domain
/load-art-agent
# Activates: Art Agent with Art skill pre-loaded
# Use for: Diagram series, visual content creation, design work

# Security auditing domain
/load-security-agent
# Activates: Security Agent with Security skill pre-loaded
# Use for: Security audits, vulnerability assessment, code review

# Meta-prompting domain
/load-prompting-agent
# Activates: Prompting Agent with Prompting skill pre-loaded
# Use for: Prompt engineering, template creation, meta-prompt work
```

#### Agent Loading Flow

User command (`/load-[agent]`) → PAL Master recognizes → Agent initialization (Load Base + Pre-load skill + Load workflows + Apply domain context) → Agent ready with skill pre-loaded

#### Domain Agent Characteristics

**ARE:** Specialized single-domain focus, pre-loaded skill/workflows, inherit Base context, optimized for extended work

**ARE NOT:** Separate AI models, different personalities (unless configured), isolated from Base, mandatory

**Agent Context Inheritance:** Agents support selective context loading for performance.

**Loading Modes:**

- **Full (default):** Inherits all PAL Master context (USER + SYSTEM + SECURITY)
- **Selective:** Load only specified files (configured in AGENT.md)

**Benefits:** Reduced tokens, faster initialization, focused responses, tailored context

**When to Use:** Full (general/multi-domain agents), Selective (specialized/performance-critical agents)

**See:** [Agent Routing Pattern](../../docs/patterns/Routing/agent-routing-pattern.md) for detailed documentation

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

### Base Configuration Loading

**SessionStart Hook** loads Base configuration at session initialization.

#### What Gets Loaded

SessionStart hook loads: USER (10 files: identity, preferences, tools, network) + SYSTEM (5 files: principles, routing, workflows, hooks, tools) + SECURITY (2 files: rules, policies) → PAL Master initialized

#### How Context is Used

**USER:** Personalizes responses (ABOUTME), guides tone (DIRECTIVES), informs recommendations (DIGITALASSETS, CONTACTS), influences tech choices (TECHSTACK), ensures vocabulary (TERMINOLOGY), guides setup (ONBOARDING), contextualizes discussions (RESUME), guides visuals (ART)

**SYSTEM:** Explains philosophy (ARCHITECTURE), defines routing (ORCHESTRATION), documents workflows (WORKFLOWS), explains hooks (MEMORY_LOGIC), lists tools (TOOLBOX)

**SECURITY:** Enforces validation (GUARDRAILS), governs data handling (REPOS_RULES)

**Pattern References:** PAL Master references patterns from `docs/patterns/` when users ask system questions, provides explanations with links for detailed reading

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

1. **PAL Master** - Primary orchestration agent with 5 core responsibilities
2. **Intent-Based Routing** - Conceptual matching, not keywords
3. **Skill Activation** - Domain capabilities activated by USE WHEN matching
4. **Agent Loading** - Specialized agents for extended domain sessions
5. **Context Assembly** - Base configuration + patterns + skills
6. **Plan Presentation** - User approval for complex operations
7. **Execution Oversight** - Monitoring, error handling, result reporting

**For Users:**

- Start with PAL Master (loaded at session start)
- Load domain agents for extended sessions
- Review plans for complex operations
- Request context readout with `/context`

**For PAL Master:**

- Classify intent accurately
- Route to best capability
- Assemble relevant context
- Present plans when beneficial
- Monitor execution and handle errors

**Next Steps:**

- Read [WORKFLOWS.md](WORKFLOWS.md) for workflow definitions and composition
- Read [MEMORY_LOGIC.md](MEMORY_LOGIC.md) for context tracking and hooks
- Read [TOOLBOX.md](TOOLBOX.md) for available tools and integrations
- Read [Pattern Library](../../docs/patterns/) for routing, execution, and integrity patterns

---

**Document Version:** 1.0.0
**Last Updated:** 2026-01-14
**Related Files:** ARCHITECTURE.md, WORKFLOWS.md, MEMORY_LOGIC.md, TOOLBOX.md

---

## Migration & Integration

> **AI INSTRUCTIONS**: When this file is placed in a new project, follow these integration steps.

### Layer Classification

- **Layer**: SYSTEM
- **Priority**: 12 (after ARCHITECTURE - routing logic)
- **Dependencies**: ARCHITECTURE.md (builds on architectural principles)

### Target Location

```
[PROJECT_ROOT]/PAL_Base/System/ORCHESTRATION.md
```

### Integration Steps

1. **Verify Directory Structure**

   ```bash
   mkdir -p PAL_Base/System
   ```

2. **Place File**

   - Copy this file to `PAL_Base/System/ORCHESTRATION.md`
   - Preserve UPPERCASE filename

3. **Register in SessionStart Hook**

   ```typescript
   // In .claude/hooks/session-start.ts
   const systemFiles = [
     "PAL_Base/System/ARCHITECTURE.md", // Priority: 11
     "PAL_Base/System/ORCHESTRATION.md", // Priority: 12
     "PAL_Base/System/WORKFLOWS.md", // Priority: 13
     "PAL_Base/System/MEMORY_LOGIC.md", // Priority: 14
     "PAL_Base/System/TOOLBOX.md", // Priority: 15
   ];
   ```

4. **Validate Integration**
   - Start new Claude Code session
   - Request a complex task
   - Verify PAL follows orchestration logic (intent → routing → execution)

### How This File Is Used

| System Component          | Usage                                           |
| ------------------------- | ----------------------------------------------- |
| **PAL Master**            | Core operating logic for routing and delegation |
| **Intent Classification** | Determines how to handle user requests          |
| **Skill Activation**      | References USE WHEN matching logic              |
| **Plan Presentation**     | Determines when to show plans                   |

### Customization Required

This file is **reference documentation** - typically NOT customized:

- [ ] **Review** - Understand PAL Master's 5 responsibilities
- [ ] **Validate** - Ensure routing logic matches your skills
- [ ] **Optional** - Add notes about custom routing rules

### First-Use Checklist

- [ ] File placed in `PAL_Base/System/`
- [ ] SessionStart hook loads file at priority 12
- [ ] PAL Master responsibilities understood
- [ ] Routing logic aligns with your installed skills
- [ ] PAL routes requests correctly
