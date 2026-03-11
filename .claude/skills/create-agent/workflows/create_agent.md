# create_agent Workflow

Create a new lean domain agent that inherits from AGENT_BASE.md, with proper naming, domain context, and routing table registration.

## Step 1: Read the Authoritative Sources

**REQUIRED FIRST:**

1. Read `AGENT_BASE.md` — Shared default behavior all agents inherit
2. Read `AGENTS_LOGIC.md` — Agent structure, lean 9-section format
3. Read `DOMAINS_LOGIC.md` — Domain structure and binding
4. Read `agent_template.md` (in this skill's root) — Lean agent template

## Step 2: Understand the Request

Ask the user:

1. **Purpose:** What is this agent's primary role/function?
2. **Domain:** What domain should this agent be bound to?
3. **Capabilities:** What skills, workflows, or prompts should it own?
4. **Persona:** Any specific communication style or identity?

## Step 3: Determine Naming

**Agent naming follows PAL's standard conventions.**

| Component    | Format                | Example               |
| :----------- | :-------------------- | :-------------------- |
| Agent file   | `lower-kebab-case.md` | `blog-agent.md`       |
| YAML name    | `lower-kebab-case`    | `name: blog-agent`    |
| Domain field | `PascalCase`          | `domain: BlogContent` |
| Invocation   | `/[agent-name]`       | `/blog-agent`         |

**Naming Rules:**

- Agent file lives in `.claude/agents/` (single file, NO directories)
- Name should be descriptive: `[domain]-agent` or `[purpose]-agent`
- Name must match YAML `name:` field exactly

## Step 4: Check Domain Existence

**Check if the domain exists:**

```bash
ls domains/[DomainName]/INDEX.md
```

**If domain does NOT exist:**

1. Inform user: "The domain '[DomainName]' doesn't exist yet."
2. Invoke the `create-domain` skill to create the domain first
3. Wait for domain creation to complete
4. Continue with agent creation

**If domain exists:**

- Proceed to Step 5

## Step 5: Review Domain Structure

Read the domain's INDEX.md to understand available context:

```bash
cat domains/[DomainName]/INDEX.md
```

Note the domain's:

- Current state
- Key facts
- Active work
- Available assets

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
- `domain` — PascalCase, must match existing domain in `domains/`

**No other YAML fields.**

## Step 8: Configure 9 Sections

Fill in each section of the agent template:

### Section 1: Identity & Persona

- **Role:** Primary function of this agent
- **Communication Traits:** Only traits that differ from base voice (first-person, direct, fact-based)

### Section 2: Activation Files

```markdown
> AUTO = loaded immediately at activation | REF = indexed only, loaded on demand

- [AUTO] `domains/[DomainName]/INDEX.md` — Domain Source of Truth
```

### Section 3: Activation Folders

```markdown
> AUTO = loaded immediately at activation | REF = indexed only, loaded on demand

- [REF] `domains/[DomainName]/00_CONTEXT/` — Background knowledge
- [REF] `domains/[DomainName]/01_PROJECTS/` — Active project files
- [REF] `domains/[DomainName]/02_SESSIONS/` — Session logs
- [REF] `domains/[DomainName]/03_ASSETS/` — Reference materials
- [REF] `domains/[DomainName]/04_OUTPUTS/` — Agent deliverables
- [REF] `domains/[DomainName]/05_ARCHIVE/` — Deprecated content
- [REF] `domains/[DomainName]/CONNECTIONS.yaml` — Domain connections
```

### Section 4: Persistent Memories

- Key domain knowledge the agent should always remember
- User preferences relevant to this domain

### Section 5: Custom Critical Actions

- Domain-specific execution rules (numbered from 7)

### Section 6: Custom Menu Items

- Domain-specific commands as bullet list
- Format: `*command` — description → action

### Section 7: Routing Examples

- 3-4 domain-specific routing examples
- Include skill matches, direct responses, and out-of-scope

### Section 8: Custom Prompts

- Persistent behavioral instructions

### Section 9: Custom Domain Context

- Non-standard folder structure or routing rules (if any)
- Format: **file type** → folder — naming

**CRITICAL:** Do NOT include Voice, Core Principles, Plan-Before-Execute, Classify-Route-Execute, or standard menu items — these are all inherited from AGENT_BASE.md.

## Step 9: Set Document Metadata

At the bottom of the agent file:

```markdown
---

**Document Version:** 1.0.0
**Last Updated:** [YYYY-MM-DD]
**Related Files:** .claude/core/system/AGENT_BASE.md, .claude/core/reference/ROUTING_TABLE.md, domains/[DomainName]/INDEX.md

---
```

## Step 10: Register in Routing Table

Add the new agent to `.claude/core/reference/ROUTING_TABLE.md`:

```yaml
- name: [agent-name]
  domain: [DomainName]
  location: .claude/agents/[agent-name].md
  routes_to: "[comma-separated keywords describing what this agent handles]"
```

## Step 11: Register Skills in SYSTEM_INDEX.md

Add skill assignments to `.claude/core/reference/SYSTEM_INDEX.md` Skills Registry:

```markdown
| [skill-name] | [agent-name] | [routing signals from USE WHEN] | [skill location] |
```

## Step 12: Create Command File

Create a command file in `.claude/commands/agent/` using `command_template.md` (in this skill's root) as the base.

```bash
touch .claude/commands/agent/[agent-name].md
```

**Fill the command file:**

- Replace `[Agent Name]` with the agent's human-readable name (e.g., `Blog Agent`)
- Replace `[agent-name]` with the agent's file name (e.g., `blog-agent`)

## Step 13: Final Checklist

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
- [ ] No extra fields

### Lean 9-Section Structure (inherits from AGENT_BASE.md)

- [ ] AGENT_BASE.md reference present (`> Inherits shared behavior from...`)
- [ ] Section 1: Identity & Persona (role, communication traits)
- [ ] Section 2: Activation Files ([AUTO]/[REF] with explanation)
- [ ] Section 3: Activation Folders ([AUTO]/[REF] with explanation)
- [ ] Section 4: Persistent Memories
- [ ] Section 5: Custom Critical Actions
- [ ] Section 6: Custom Menu Items (bullet list, not table)
- [ ] Section 7: Routing Examples (standalone section)
- [ ] Section 8: Custom Prompts
- [ ] Section 9: Custom Domain Context (bullet list, not table)
- [ ] No Voice section (inherited from AGENT_BASE.md)
- [ ] No Core Principles section (inherited from AGENT_BASE.md)
- [ ] No Plan-Before-Execute section (inherited from AGENT_BASE.md)
- [ ] No standard menu items duplicated (inherited from AGENT_BASE.md)

### Context Configuration

- [ ] Domain Context: INDEX.md as [AUTO], other files as [REF]
- [ ] Zero Trust applied — minimal [AUTO] usage

### Domain Binding

- [ ] `domain` field matches valid domain in `domains/`
- [ ] Domain INDEX.md exists at `domains/[DomainName]/INDEX.md`

### Registration

- [ ] Agent entry added to `.claude/core/reference/ROUTING_TABLE.md`
- [ ] Skills registered in `SYSTEM_INDEX.md` with Routes To column
- [ ] Command file exists in `.claude/commands/agent/`

### Operational Validation

- [ ] Standard menu inherited (no duplication needed)
- [ ] Out-of-scope handling in routing examples

## Done

Agent created following the lean 9-section structure with AGENT_BASE.md inheritance, domain context, and routing table registration.

**Invocation:** `/[agent-name]`
