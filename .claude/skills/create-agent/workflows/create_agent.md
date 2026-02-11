# create_agent Workflow

Create a new domain agent following the 8-section structure with proper naming, two-group context (Base + Domain), inline capabilities, and routing table registration.

## Step 1: Read the Authoritative Sources

**REQUIRED FIRST:**

1. Read the agent system documentation: `AGENTS_LOGIC.md`
2. Read the domain system documentation: `DOMAINS_LOGIC.md`
3. Read the agent template: `agent_template.md` (in this skill's root)

## Step 2: Understand the Request

Ask the user:

1. **Purpose:** What is this agent's primary role/function?
2. **Domain:** What domain should this agent be bound to?
3. **Capabilities:** What skills, workflows, or prompts should it own?
4. **Persona:** Any specific communication style or identity?

## Step 3: Determine Naming

**Agent naming follows PAL's standard conventions.**

| Component | Format | Example |
| :-------- | :----- | :------ |
| Agent file | `lower-kebab-case.md` | `blog-agent.md` |
| YAML name | `lower-kebab-case` | `name: blog-agent` |
| Domain field | `lower-kebab-case` | `domain: blog-content` |
| Invocation | `/load-[agent-name]` | `/load-blog-agent` |

**Naming Rules:**

- Agent file lives in `.claude/agents/` (single file, NO directories)
- Name should be descriptive: `[domain]-agent` or `[purpose]-agent`
- Name must match YAML `name:` field exactly

**Wrong naming (NEVER use):**

- `BlogAgent.md`, `BLOG_AGENT.md` → Use `blog-agent.md`
- Directories in agents folder → Single files only

## Step 4: Check Domain Existence

**Check if the domain exists:**

```bash
ls domains/[domain-name]/INDEX.md
```

**If domain does NOT exist:**

1. Inform user: "The domain '[domain-name]' doesn't exist yet."
2. Invoke the `create-domain` skill to create the domain first
3. Wait for domain creation to complete
4. Continue with agent creation

**If domain exists:**

- Proceed to Step 5

## Step 5: Review Domain Structure

Read the domain's INDEX.md to understand available context:

```bash
cat domains/[domain-name]/INDEX.md
```

Note the domain's:

- Current state
- Key facts
- Active work
- Available assets in 03_ASSETS/

## Step 6: Create Agent File

Create the agent file in `.claude/agents/` using `agent_template.md` as the base.

```bash
touch .claude/agents/[agent-name].md
```

## Step 7: Configure YAML Frontmatter

Fill in the YAML frontmatter with exactly 4 fields:

```yaml
---
name: agent-name
description: Brief description of what this agent does
version: 1.0.0
domain: domain-name
---
```

**Required Fields:**

- `name` — lower-kebab-case (matches file name without .md)
- `description` — Clear, concise purpose
- `version` — Start with `1.0.0`
- `domain` — Must match existing domain in `domains/`

**No other YAML fields.** Capabilities are declared inline in Section 5.

## Step 8: Configure Two-Group Context

Set up the context configuration in the Activation Protocol section (Section 2):

**Base Context (fixed — same for every agent):**

```markdown
- [REF] `PAL_Base/User/ABOUTME.md` — Core Identity & Background
- [REF] `PAL_Base/User/DIRECTIVES.md` — Critical System Rules
- [REF] `PAL_Base/Security/GUARDRAILS.md` — Safety Validation
```

**Domain Context (configurable — mapped from INDEX.md):**

```markdown
- [AUTO] `domains/[domain-name]/INDEX.md` — Domain Source of Truth
- [REF] `domains/[domain-name]/00_CONTEXT/` — Domain-specific context and reference docs
- [REF] `domains/[domain-name]/01_PROJECTS/` — Active project files
- [REF] `domains/[domain-name]/02_SESSIONS/` — Session logs
- [REF] `domains/[domain-name]/03_ASSETS/` — Reference materials and resources
- [REF] `domains/[domain-name]/04_OUTPUTS/` — Generated deliverables
- [REF] `domains/[domain-name]/05_ARCHIVE/` — Completed or deprecated items
- [REF] `domains/[domain-name]/CONNECTIONS.yaml` — Domain connections and integrations
```

**Loading Mode Guidelines:**

- Use `[AUTO]` sparingly — only for INDEX.md and critical files
- Use `[REF]` for most files — load on demand
- Domain INDEX.md is ALWAYS `[AUTO]`

## Step 9: Configure Section 1 — Identity & Persona

Fill in:

- **Role:** Primary function of this agent
- **Voice:** 4 bullet points (first-person always, plus 3 domain-specific style points)
- **Core Principles:** 4 guiding principles (Zero Trust Context, 2 domain-specific, Security first)

## Step 10: Configure Section 3 — Command Menu

Set up the standard command table:

| # | Command | Description | Action |
| --- | ------- | ----------- | ------ |
| 1 | `*menu` | Redisplay this menu | Print this table |
| 2 | `*skills` | List my skills | Display Section 5 → Skills |
| 3 | `*workflows` | List my workflows | Display Section 5 → Workflows |
| 4 | `*context` | Show loaded context and session state | Show loaded files by layer, active skill (Sec 6) |
| 5 | `*help` | Agent help and documentation | Show responsibilities summary |
| 6 | `*dismiss` | Dismiss this agent | Confirm with user, end session, return to PAL Master |

## Step 11: Configure Section 4 — How I Work

Fill in 3–4 domain-specific routing examples:

- "[Example request 1]" → `[skill-name]` skill ([why it matches])
- "[Example request 2]" → `[workflow-name]` workflow ([why it matches])
- "[Example request 3]" → Respond directly (domain context sufficient)
- "[Unrelated request]" → Out of scope, suggest returning to PAL Master

## Step 12: Configure Section 5 — My Capabilities

Declare all skills, workflows, and prompts this agent owns **inline**:

```yaml
### Skills
- name: [skill-name]
  location: .claude/skills/[skill-name]/SKILL.md
  use_when: "[Natural language trigger]"

### Workflows
- name: [workflow-name]
  source: [skill-name]/[workflow_name]
  location: .claude/skills/[skill-name]/workflows/[workflow_name].md
  use_when: "[Natural language trigger]"

### Prompts
- name: [prompt-name]
  location: .claude/prompts/[prompt-name].md
  use_when: "[Natural language trigger]"
```

**Include capability rules at the end of Section 5:**

- If a capability is not listed above, I do not have it.
- Do not infer, hallucinate, or borrow capabilities from other agents.
- If a request requires capabilities outside my scope, suggest returning to PAL Master via `*dismiss`.

**Verify all declared capabilities exist:**

```bash
# Check each skill exists
ls .claude/skills/[skill-name]/SKILL.md

# Check each workflow exists
ls .claude/skills/[skill-name]/workflows/[workflow_name].md
```

## Step 13: Configure Remaining Sections

**Section 6 — Session State Model:** Use standard template (tracks user name, loaded files, active skill/workflow, execution history).

**Section 7 — Error Handling & Recovery:** Use standard template (6 error categories, 6-step recovery protocol).

**Section 8 — Operational Rules:** Include standard 10 rules, customize if domain requires additional constraints.

## Step 14: Set Document Metadata

At the bottom of the agent file:

```markdown
---

**Document Version:** 1.0.0
**Last Updated:** [YYYY-MM-DD]
**Related Files:** PAL_Base/System/ORCHESTRATION.md, PAL_Base/System/ROUTING_TABLE.md, domains/[domain-name]/INDEX.md

---
```

## Step 15: Register in Routing Table

Add the new agent to `PAL_Base/System/ROUTING_TABLE.md`:

```yaml
- name: [agent-name]
  domain: [domain-name]
  location: .claude/agents/[agent-name].md
  routes_to: "[comma-separated keywords describing what this agent handles]"
```

**Verify the entry was added:**

```bash
grep "[agent-name]" PAL_Base/System/ROUTING_TABLE.md
```

## Step 16: Final Checklist

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

### 8-Section Structure

- [ ] Section 1: Identity & Persona (role, voice, principles)
- [ ] Section 2: Activation Protocol (6 steps)
- [ ] Section 3: Command Menu (unified table with actions)
- [ ] Section 4: How I Work (classify → route → execute pipeline)
- [ ] Section 5: My Capabilities (inline skills, workflows, prompts with use_when)
- [ ] Section 6: Session State Model (tracked data, reset rules)
- [ ] Section 7: Error Handling & Recovery (categories, protocol)
- [ ] Section 8: Operational Rules (numbered constraints)

### Context Configuration

- [ ] Base Context: 3 fixed REFs (ABOUTME, DIRECTIVES, GUARDRAILS)
- [ ] Domain Context: INDEX.md as [AUTO], other files as [REF]
- [ ] Zero Trust applied — minimal [AUTO] usage

### Domain Binding

- [ ] `domain` field matches valid domain in `domains/`
- [ ] Domain INDEX.md exists at `domains/[domain-name]/INDEX.md`
- [ ] Domain files mapped to [AUTO]/[REF] in Activation Protocol

### Capability Declaration

- [ ] Section 5 lists all skills with name, location, use_when
- [ ] Section 5 lists all workflows with name, source, location, use_when
- [ ] Section 5 lists prompts if any
- [ ] All listed skills exist in `.claude/skills/`
- [ ] All listed workflows exist in their respective skill directories
- [ ] Capability rules present (no inference, no borrowing, out-of-scope → *dismiss)
- [ ] Capabilities align with agent's domain and responsibilities

### Routing Table

- [ ] Agent entry added to `PAL_Base/System/ROUTING_TABLE.md`
- [ ] Entry includes: name, domain, location, routes_to

### Operational Validation

- [ ] First-person voice enforced in rules
- [ ] `*dismiss` command included in menu
- [ ] Security validation referenced (GUARDRAILS.md)
- [ ] Stay-in-character rule included
- [ ] Out-of-scope handling defined (redirect to PAL Master)

## Step 17: Suggest Index Regeneration

Inform the user:

> "Agent created successfully. Run `map-domain` to regenerate `SYSTEM_INDEX.md` so the system-wide capability view stays current."

## Done

Agent created following the 8-section structure with inline capabilities, two-group context (Base + Domain), and routing table registration.

**Invocation:** `/load-[agent-name]`
