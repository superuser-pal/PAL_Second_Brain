# validate_agent Workflow

Validate an existing domain agent against the AGENTS_LOGIC.md canonical 9-section structure.

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
- [ ] `domain` field present (PascalCase)
- [ ] No extra fields beyond name, description, version, domain

**Validation Rules:**

- `name` must match filename (without .md)
- `domain` must reference an existing domain

## Step 5: Validate Domain Binding

### 5.1 Domain Exists

```bash
ls domains/[DomainName]/INDEX.md
```

- [ ] Domain directory exists at `domains/[DomainName]/`
- [ ] INDEX.md exists at domain root

**If domain doesn't exist:**

```
ISSUE: Domain '[DomainName]' not found
FIX: Either create the domain using create-domain skill, or update the agent's domain field to an existing domain
```

### 5.2 Domain INDEX.md Valid

- [ ] INDEX.md has valid YAML frontmatter
- [ ] INDEX.md contains required sections (Current State, Key Facts, Active Work)

## Step 6: Validate Lean 9-Section Structure

Check for required sections (inherits from AGENT_BASE.md):

- [ ] AGENT_BASE.md reference present (`> Inherits shared behavior from...`)
- [ ] Section 1: Identity & Persona (role, communication traits)
- [ ] Section 2: Activation Files ([AUTO]/[REF] files, with AUTO/REF explanation)
- [ ] Section 3: Activation Folders ([AUTO]/[REF] folders, with AUTO/REF explanation)
- [ ] Section 4: Persistent Memories
- [ ] Section 5: Custom Critical Actions
- [ ] Section 6: Custom Menu Items (bullet list, not table)
- [ ] Section 7: Routing Examples (standalone section)
- [ ] Section 8: Custom Prompts
- [ ] Section 9: Custom Domain Context (bullet list, not table)

**Check for REMOVED content (should NOT be present):**

- [ ] No Voice section (moved to AGENT_BASE.md)
- [ ] No Core Principles section (moved to AGENT_BASE.md)
- [ ] No Plan-Before-Execute section (moved to AGENT_BASE.md)
- [ ] No Classify → Route → Execute section (moved to AGENT_BASE.md)
- [ ] No standard menu items (*menu, *skills, *context, *help, *projects, *dismiss) — these are inherited

**Missing Sections:**

```
ISSUE: Missing section: [Section Name]
FIX: Add [Section Name] section following the template in agent_template.md
```

**Duplicated Content:**

```
ISSUE: [Section] duplicates content from AGENT_BASE.md
FIX: Remove [Section] — it is inherited from AGENT_BASE.md
```

## Step 7: Validate Context Configuration

- [ ] Domain Context: INDEX.md as [AUTO] in Section 2
- [ ] Domain folders as [REF] in Section 3 (unless justified for [AUTO])
- [ ] Base context handled by hook (not in agent file)
- [ ] Zero Trust applied — minimal [AUTO] usage

## Step 8: Validate Registration

- [ ] Agent registered in SYSTEM_INDEX.md (Agents table)
- [ ] Skills registered in SYSTEM_INDEX.md (Skills Registry with Routes To column)
- [ ] Agent registered in ROUTING_TABLE.md

## Step 9: Generate Report

### Report Format

```
## Agent Validation Report: [agent-name]

**File:** `.claude/agents/[agent-name].md`
**Domain:** [DomainName]
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

### Passed Checks

- [x] File location and naming
- [x] YAML frontmatter
- [x] Domain binding
- [x] 9-section structure
- [x] No duplicated AGENT_BASE.md content
- [x] Context configuration
- [x] Registration (SYSTEM_INDEX + ROUTING_TABLE)

### Recommendations

[Optional suggestions for improvement]
```

## Done

Validation complete. Report generated with all issues and fixes.
