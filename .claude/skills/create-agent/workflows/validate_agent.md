# validate_agent Workflow

Validate an existing domain agent against the AGENTS_LOGIC.md canonical structure.

## Step 1: Read the Authoritative Source

**REQUIRED FIRST:**

1. Read the agent system documentation: `AGENTS_LOGIC.md`
2. Note the Complete Checklist section for validation criteria

## Step 2: Identify the Agent

Ask the user which agent to validate, or accept the agent name from the request.

**Agent file location:** `.claude/agents/[agent-name].md`

## Step 3: Read the Agent File

```bash
cat .claude/agents/[agent-name].md
```

If the file doesn't exist, report: "Agent file not found at `.claude/agents/[agent-name].md`"

## Step 4: Validate Structure

### 4.1 File Location

- [ ] Agent file exists in `.claude/agents/`
- [ ] Filename follows `lower-kebab-case.md` convention
- [ ] Single file (no directories in agents folder)

**If issue found:**

```
ISSUE: [Description]
FIX: [How to fix]
```

### 4.2 YAML Frontmatter

Check for required fields:

- [ ] `name` field present (lower-kebab-case)
- [ ] `description` field present
- [ ] `version` field present (semantic versioning: X.Y.Z)
- [ ] `domain` field present (lower-kebab-case)

Check optional fields format (if present):

- [ ] `skills` is a list of valid skill names
- [ ] `workflows` uses format `skill-name/workflow_name`
- [ ] `prompts` is a list of prompt names

**Validation Rules:**

- `name` must match filename (without .md)
- `domain` must reference an existing domain

## Step 5: Validate Domain Binding

### 5.1 Domain Exists

```bash
ls domains/[domain-name]/INDEX.md
```

- [ ] Domain directory exists at `domains/[domain-name]/`
- [ ] INDEX.md exists at domain root

**If domain doesn't exist:**

```
ISSUE: Domain '[domain-name]' not found
FIX: Either create the domain using create-domain skill, or update the agent's domain field to an existing domain
```

### 5.2 Domain INDEX.md Valid

- [ ] INDEX.md has valid YAML frontmatter
- [ ] INDEX.md contains required sections (Current State, Key Facts, Active Work)

## Step 6: Validate Four-Layer Context

Check that the Activation Protocol section includes all four layers:

### 6.1 USER Layer

- [ ] Section exists under "USER Layer"
- [ ] References files from `.claude/base/user/`
- [ ] Uses [AUTO] or [REF] markers

**Required USER files (at minimum):**

- ABOUTME.md
- DIRECTIVES.md

### 6.2 SYSTEM Layer

- [ ] Section exists under "SYSTEM Layer"
- [ ] References files from `.claude/base/system/`
- [ ] Uses [AUTO] or [REF] markers

### 6.3 SECURITY Layer

- [ ] Section exists under "SECURITY Layer"
- [ ] References files from `.claude/base/security/`
- [ ] Uses [AUTO] or [REF] markers

**Required SECURITY files:**

- GUARDRAILS.md

### 6.4 DOMAIN Layer

- [ ] Section exists under "DOMAIN Layer"
- [ ] References files from `domains/[domain-name]/`
- [ ] INDEX.md marked as [AUTO]
- [ ] Other files marked appropriately

## Step 7: Validate Template Sections

Check for all required sections:

- [ ] Activation Protocol with 5 steps
- [ ] Context Configuration with all 4 layers
- [ ] Persona section (Role, Identity, Communication Style, Core Principles)
- [ ] Menu section with command table
- [ ] Menu Handlers section with processing rules
- [ ] Core Responsibilities section with numbered items
- [ ] Operational Rules section with numbered rules
- [ ] Greeting Template with menu display

**Missing Sections:**

```
ISSUE: Missing section: [Section Name]
FIX: Add [Section Name] section following the template in agent_template.md
```

## Step 8: Validate Capability Binding

If `skills`, `workflows`, or `prompts` are defined:

### 8.1 Skills Validation

For each skill in `skills:`:

```bash
ls .claude/skills/[skill-name]/SKILL.md
```

- [ ] Each listed skill exists in `.claude/skills/`

### 8.2 Workflows Validation

For each workflow in `workflows:`:

- [ ] Format is `skill-name/workflow_name`
- [ ] Skill exists
- [ ] Workflow file exists at `.claude/skills/[skill-name]/workflows/[workflow_name].md`

### 8.3 Prompts Validation

For each prompt in `prompts:`:

- [ ] Prompt exists in `.claude/prompts/` or skill locations

## Step 9: Validate Operational Rules

Check for essential rules:

- [ ] First-person voice rule included
- [ ] `*dismiss` command documented
- [ ] Security validation referenced (GUARDRAILS.md)
- [ ] Stay-in-character rule included

## Step 10: Generate Report

### Report Format

```
## Agent Validation Report: [agent-name]

**File:** `.claude/agents/[agent-name].md`
**Domain:** [domain-name]
**Status:** [VALID | ISSUES FOUND]

### Summary

- Total checks: [N]
- Passed: [N]
- Issues: [N]

### Issues Found

[If any issues, list them here with fixes]

1. **[Issue Category]**
   - Issue: [Description]
   - Fix: [How to fix]

2. **[Issue Category]**
   - Issue: [Description]
   - Fix: [How to fix]

### Passed Checks

- [x] File location and naming
- [x] YAML frontmatter
- [x] Domain binding
- [x] Four-layer context
- [x] Template sections
- [x] Capability binding
- [x] Operational rules

### Recommendations

[Optional suggestions for improvement]
```

## Validation Checklist Reference

From AGENTS_LOGIC.md:

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

Validation complete. Report generated with all issues and fixes.
