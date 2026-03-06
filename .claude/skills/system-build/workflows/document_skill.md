# document Workflow

Generate requirements documentation from any PAL system component: skills, commands, or hooks.

## Supported Types

| Type | Source Location | Target Document | ID Prefix |
|------|-----------------|-----------------|-----------|
| `skill` | `.claude/skills/[name]/` | `01_SKILLS.md` | `1` |
| `command` | `.claude/commands/**/[name].md` | `03_COMMANDS.md` | `3` |
| `hook` | `.claude/tools/hooks/[name].ts` | `04_TOOLS_AND_HOOKS.md` | `4` |

## Prerequisites

- Target component exists at expected location
- For skills: SKILL.md exists with valid YAML frontmatter and at least one workflow
- For commands: Command file exists in `.claude/commands/[category]/`
- For hooks: Hook TypeScript file exists in `.claude/tools/hooks/`

## Steps

### 1. Parse Input

- Extract type and name from user input
- Expected format: `document [type] [name]`
- If type not provided: Ask "What type? (skill, command, hook)"
- If name not provided: List available items of that type:
  - For skills: `ls .claude/skills/`
  - For commands: `ls .claude/commands/*/`
  - For hooks: `ls .claude/tools/hooks/`

### 1.5. Determine Target Repository

Before documenting, check the component's location and determine routing:

- If component is in `Domains/PALOpenSource/.claude/` → Document to submodule requirements
- If component is in `.claude/` (main repo root) → Ask user for routing preference:
  > "Should this be documented for:
  > 1. **Personal system** - Requirements stay in main repo
  > 2. **Open Source** - Requirements go to submodule for framework users"

Target paths based on routing:
- **Personal:** `Domains/PALBuilder/03_REQUIREMENTS/`
- **Open Source:** `Domains/PALOpenSource/Domains/PALBuilder/03_REQUIREMENTS/`

### 2. Validate Component Exists

- **Skill:** Check `.claude/skills/[name]/SKILL.md` exists
- **Command:** Check `.claude/commands/**/[name].md` exists (search all subdirectories)
- **Hook:** Check `.claude/tools/hooks/[name].ts` exists

If not found: ERROR with appropriate message and list available items.

### 3. Route by Type

Based on component type, execute the appropriate documentation flow:

---

## Skill Documentation Flow (type=skill)

### 3a. Load Skill Context

- Read `.claude/skills/[skill-name]/SKILL.md`
- Extract YAML frontmatter: `name`, `description`
- Extract `USE WHEN` triggers from description field
- Parse Workflow Routing table (if exists)
- Parse Authoritative Sources section (if exists)

### 4a. Load Workflow Files

- List all `.md` files in `.claude/skills/[skill-name]/workflows/`
- For each workflow file, extract:
  - Workflow name (from filename and H1 heading)
  - Trigger phrases (from Workflow Routing table in SKILL.md)
  - Prerequisites section
  - Steps section (numbered steps)
  - Output section
  - Error Handling section (if exists)

### 5a. Determine Section ID

- Read `domains/PALBuilder/03_REQUIREMENTS/01_SKILLS.md`
- Find highest existing section number (e.g., `## 1.8 Skill:`)
- Next section number = highest + 1 (e.g., 1.9)
- Section ID format: `1.[N]` where N is the next available number

### 6a. Generate Skill Section Header

Format:
```markdown
## 1.[N] Skill: [skill-name]

**What It Does:** [First sentence from description, without USE WHEN clause]

**Activates When:** [USE WHEN triggers as quoted list]

**Source:** [skill-name SKILL.md](.claude/skills/[skill-name]/SKILL.md)

---
```

### 7a. Extract Requirements from SKILL.md

- **Workflow activation requirements:**
  - For each row in Workflow Routing table, create:
    ```markdown
    ### 1.[N].[M] [Workflow Name] Activates on Trigger

    **Given** the [skill-name] skill is active
    **When** user mentions "[trigger phrases]"
    **Then** the [workflow-name] workflow executes

    Category: Functional
    Verification: Say "[example trigger]" and confirm [workflow-name] workflow activates
    Source: [skill-name SKILL.md](.claude/skills/[skill-name]/SKILL.md)
    ```

- **Authoritative source requirements (if section exists):**
  - For each authoritative source, create requirement

### 8a. Extract Requirements from Workflows

For each workflow file:

- **Prerequisite requirements (select most important)**
- **Functional requirements (major steps only)**
- **Output requirements**

### 9a. Assemble and Insert

- Combine all generated requirements
- Number requirements sequentially: 1.[N].1, 1.[N].2, ...
- Insert into `01_SKILLS.md` after last skill section
- Update README.md Requirements Summary

---

## Command Documentation Flow (type=command)

### 3b. Load Command Context

- Read `.claude/commands/[category]/[name].md`
- Identify category from path (agents/ or sessions/)
- Extract command description and steps

### 4b. Determine Section and ID

- For agent commands: Section 3.1, next available ID
- For session commands: Section 3.2, next available ID
- Read `domains/PALBuilder/03_REQUIREMENTS/03_COMMANDS.md`
- Find highest existing requirement number in target section

### 5b. Generate Command Requirements

Format for each key behavior:
```markdown
### 3.[section].[M] [Behavior Name]

**Given** [context or prerequisite]
**When** [command is invoked or action occurs]
**Then** [expected outcome]

Category: [Functional | Validation | UI]
Verification: [How to test this requirement]
Source: [command-name.md](.claude/commands/[category]/[command-name].md)
```

Focus on:
- Command invocation behavior
- Key steps and outputs
- Error handling
- User feedback

### 6b. Insert and Update

- Insert requirements into appropriate section of `03_COMMANDS.md`
- Update README.md Requirements Summary counts

---

## Hook Documentation Flow (type=hook)

### 3c. Load Hook Context

- Read `.claude/tools/hooks/[name].ts`
- Extract hook type from header comment
- Parse configuration object
- Identify key functions and their purposes
- Extract validation rules (for pre-tool-use) or behaviors

### 4c. Determine Section ID

- All hooks go in Section 4.1
- Read `domains/PALBuilder/03_REQUIREMENTS/04_TOOLS_AND_HOOKS.md`
- Find highest existing requirement number in section 4.1

### 5c. Generate Hook Requirements

Format for each key behavior:
```markdown
### 4.1.[M] [Behavior Name]

**Given** [trigger condition]
**When** [hook executes]
**Then** [expected outcome]

Category: [Functional | Security | UI]
Verification: [How to test this requirement]
Source: [hook-name.ts](.claude/tools/hooks/[hook-name].ts)
```

Focus on:
- Trigger conditions
- Key behaviors and rules
- Security rules (for pre-tool-use: blocked patterns, warned patterns)
- Error handling and graceful degradation

### 6c. Insert and Update

- Insert requirements into section 4.1 of `04_TOOLS_AND_HOOKS.md`
- Update README.md Requirements Summary counts

---

## 10. Report Completion (All Types)

Show:
- Type documented: [skill/command/hook]
- Component name: [name]
- Section ID: [X.Y]
- Requirements generated: [count]
- Target document: [document path]

Suggest next steps: "Document another component" or "Review generated requirements"

## Guidelines

- **Selectivity over completeness:** Not every behavior becomes a requirement. Focus on:
  - Behaviors that produce verifiable outputs
  - Behaviors that make decisions or branch
  - Behaviors that validate inputs
  - Behaviors that interact with external files
  - Security rules and guardrails
- **Avoid duplication:** Don't duplicate behaviors already in architecture sections (1.0, 3.0, 4.0)
- **Quality over quantity:** 3-7 requirements per workflow/command/hook is typical
- **Verification must be concrete:** "Run X" is not enough. Specify what to observe.
- **Source links are critical:** Every requirement must trace back to its implementation file.
- **Respect exclusions:** Check README.md "Excluded from Documentation" section before documenting.

## Output

- New requirements added to appropriate document:
  - Skills → `domains/PALBuilder/03_REQUIREMENTS/01_SKILLS.md`
  - Commands → `domains/PALBuilder/03_REQUIREMENTS/03_COMMANDS.md`
  - Hooks → `domains/PALBuilder/03_REQUIREMENTS/04_TOOLS_AND_HOOKS.md`
- README.md summary table updated

## Error Handling

| Error | Resolution |
|-------|------------|
| Type not recognized | "Unknown type '[type]'. Use: skill, command, or hook." |
| Skill not found | "Skill directory not found at [path]. Run `ls .claude/skills/` to see available skills." |
| Command not found | "Command not found at [path]. Run `ls .claude/commands/*/` to see available commands." |
| Hook not found | "Hook not found at [path]. Run `ls .claude/tools/hooks/` to see available hooks." |
| No workflows in skill | "No workflows found in [skill]/workflows/. Ensure workflows exist before documenting." |
| SKILL.md missing | "SKILL.md not found. This is required for documentation." |
| Already documented | "Section for [name] already exists in [document]. Update existing section or choose a different component." |
| In exclusion list | "[name] is in the excluded list in README.md. Remove from exclusions first if documentation is needed." |
