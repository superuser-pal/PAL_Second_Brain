# create_agent Workflow

Create a new domain agent following the canonical structure with proper naming and four-layer context configuration.

## Step 1: Read the Authoritative Sources

**REQUIRED FIRST:**

1. Read the agent system documentation: `AGENTS_LOGIC.md`
2. Read the domain system documentation: `DOMAINS_LOGIC.md`
3. Read the agent template: `agent_template.md` (in this skill's root)

## Step 2: Understand the Request

Ask the user:

1. **Purpose:** What is this agent's primary role/function?
2. **Domain:** What domain should this agent be bound to?
3. **Capabilities:** What skills, workflows, or prompts should it have access to?
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

- `BlogAgent.md`, `BLOG_AGENT.md` -> Use `blog-agent.md`
- Directories in agents folder -> Single files only

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

Create the agent file in `.claude/agents/`:

```bash
touch .claude/agents/[agent-name].md
```

## Step 7: Configure YAML Frontmatter

Fill in the YAML frontmatter:

```yaml
---
name: agent-name
description: Brief description of what this agent does
version: 1.0.0
domain: domain-name
skills:
  - skill-name-1
  - skill-name-2
workflows:
  - skill-name/workflow_name
prompts:
  - prompt-name
---
```

**Required Fields:**

- `name` - lower-kebab-case (matches file name without .md)
- `description` - Clear, concise purpose
- `version` - Start with `1.0.0`
- `domain` - Must match existing domain in `domains/`

**Optional Fields:**

- `skills` - List skills for full access
- `workflows` - List specific workflows (format: `skill-name/workflow_name`)
- `prompts` - List prompt templates

## Step 8: Configure Four-Layer Context

Set up the context configuration in the Activation Protocol section:

**USER Layer:**

```markdown
- [REF] `.claude/base/user/ABOUTME.md` - Core Identity & Background
- [REF] `.claude/base/user/DIRECTIVES.md` - Critical System Rules
- [REF] `.claude/base/user/TECHSTACK.md` - Technology Preferences
- [REF] `.claude/base/user/TERMINOLOGY.md` - Vocabulary Definitions
```

**SYSTEM Layer:**

```markdown
- [REF] `.claude/base/system/ORCHESTRATION.md` - Routing & Responsibilities
- [REF] `.claude/base/system/WORKFLOWS.md` - Execution Patterns
- [REF] `.claude/base/system/AGENTS_LOGIC.md` - Agent Configuration
```

**SECURITY Layer:**

```markdown
- [REF] `.claude/base/security/GUARDRAILS.md` - Safety Validation
- [REF] `.claude/base/security/REPOS_RULES.md` - Code Policy
```

**DOMAIN Layer:**

Map files from the domain's INDEX.md:

```markdown
- [AUTO] `domains/[domain-name]/INDEX.md` - Domain Source of Truth
- [REF] `domains/[domain-name]/01_PLANS/` - Active plans
- [REF] `domains/[domain-name]/02_SESSIONS/` - Session logs
- [REF] `domains/[domain-name]/03_ASSETS/` - Reference materials
```

**Loading Mode Guidelines:**

- Use `[AUTO]` sparingly - only for INDEX.md and critical files
- Use `[REF]` for most files - load on demand
- Domain INDEX.md is ALWAYS `[AUTO]`

## Step 9: Configure Persona

Fill in the Persona section:

- **Role:** Primary function of this agent
- **Identity:** Detailed description
- **Communication Style:** 4 bullet points
- **Core Principles:** 4 guiding principles

## Step 10: Configure Menu

Customize the menu for this agent's domain:

| # | Command | Description |
| --- | ------- | ----------- |
| 1 | `*menu` | Redisplay this menu |
| 2 | `*[domain-command]` | [Domain-specific action] |
| 3 | `*[domain-command]` | [Domain-specific action] |
| 4 | `*context` | Show loaded context and session state |
| 5 | `*help` | Agent help and documentation |
| 6 | `*dismiss` | Dismiss this agent |

## Step 11: Configure Core Responsibilities

Define 3-5 core responsibilities specific to this agent's domain:

1. **[Primary Responsibility]** - Main function
2. **[Secondary Responsibility]** - Supporting function
3. **[Tertiary Responsibility]** - Additional capability

## Step 12: Customize Greeting Template

Update the greeting to reflect:

- Agent's name and role
- Domain-specific context it has access to
- Key capabilities (3 bullet points)

## Step 13: Set Operational Rules

Include standard rules plus domain-specific rules:

1. First-Person Voice
2. Runtime Loading
3. Menu Display
4. Stay in Character
5. Security First
6. [Domain-specific rule]

## Step 14: Update Document Metadata

At the bottom of the agent file:

```markdown
---

**Document Version:** 1.0.0
**Last Updated:** YYYY-MM-DD
**Related Files:** domains/[domain-name]/INDEX.md, [other relevant files]

---
```

## Step 15: Final Checklist

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
- [ ] All listed workflows exist in their respective skills
- [ ] All listed prompts exist in `.claude/prompts/` or skill locations
- [ ] Capabilities align with agent's domain and responsibilities

### Operational Validation

- [ ] First-person voice enforced in rules
- [ ] `*dismiss` command documented
- [ ] Security validation referenced
- [ ] Stay-in-character rule included

## Done

Agent created following canonical structure with proper naming, four-layer context, and domain binding.

**Invocation:** `/load-[agent-name]`
