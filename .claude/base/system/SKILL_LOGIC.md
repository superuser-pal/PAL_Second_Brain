---
title: PAL Skills System
version: 1.1.0
layer: SYSTEM
purpose: Mandatory configuration system and structure for all PAL skills
last_updated: 2026-01-18
---

# PAL Skills System

**The MANDATORY configuration system for ALL PAL skills.**

---

## THIS IS THE AUTHORITATIVE SOURCE

This document defines the **required structure** for every skill in the PAL framework.

**ALL skill creation MUST follow this structure** - including skills created by the CreateSkill skill.

**"Canonicalize a skill"** = Restructure it to match this exact format, including proper naming conventions.

If a skill does not follow this structure, it is not properly configured and will not work correctly.

---

## Naming Conventions (MANDATORY)

**Skill naming follows PAL's standard file naming conventions for consistency across the system.**

| Category             | Convention            | Example                  | Purpose                                      |
| :------------------- | :-------------------- | :----------------------- | :------------------------------------------- |
| **Skill directory**  | `lower-kebab-case`    | `create-skill/`          | Standard IDE navigation.                     |
| **SKILL.md**         | `UPPER_SNAKE_CASE.md` | `SKILL.md`               | System protocol file (always uppercase).     |
| **Workflow files**   | `lower_snake_case.md` | `create_post.md`         | Active work files within skill.              |
| **Reference docs**   | `lower_snake_case.md` | `prosody_guide.md`       | Active work files within skill.              |
| **Tool files**       | `lower_snake_case.ts` | `manage_server.ts`       | Active work files within skill.              |
| **Help files**       | `lower_snake_case.md` | `manage_server.help.md`  | Active work files within skill.              |
| **YAML name**        | `lower-kebab-case`    | `name: create-skill`     | Matches directory name for consistency.      |

**Convention Rules:**
- **Skill directories:** Use `lower-kebab-case` for standard IDE navigation
- **SKILL.md:** Always uppercase (system protocol convention)
- **All other files:** Use `lower_snake_case` (active work convention)
- **YAML name field:** Matches directory name in `lower-kebab-case`

**Exception:** `SKILL.md` is always uppercase (convention for the main skill file).

---

## The Required Structure

Every SKILL.md has two parts:

### 1. YAML Frontmatter (Single-Line Description)

```yaml
---
name: skill-name
description: [What it does]. USE WHEN [intent triggers using OR]. [Additional capabilities].
implements: Science              # Optional: declares Science Protocol compliance
science_cycle_time: meso         # Optional: micro | meso | macro
---
```

**Rules:**
- `name` uses **lower-kebab-case** (matches directory name)
- `description` is a **single line** (not multi-line with `|`)
- `USE WHEN` keyword is **MANDATORY** (Claude Code parses this for skill activation)
- Use intent-based triggers with `OR` for multiple conditions
- Max 1024 characters (Anthropic hard limit)
- **NO separate `triggers:` or `workflows:` arrays in YAML**

### Science Protocol Compliance (Optional)

Skills that involve systematic investigation, iteration, or evidence-based improvement can declare Science Protocol compliance:

```yaml
implements: Science
science_cycle_time: meso
```

**What This Means:**
- The skill embodies the scientific method: Goal → Observe → Hypothesize → Experiment → Measure → Analyze → Iterate
- This is documentation of the mapping, not runtime coupling
- Skills implement Science like classes implement interfaces—they follow the pattern independently

**Cycle Time Options:**
| Level | Cycle Time | Formality | Example Skills |
|-------|------------|-----------|----------------|
| `micro` | Seconds-Minutes | Implicit (internalized) | Most skills |
| `meso` | Hours-Days | Explicit when stuck | Evals, Research, Development |
| `macro` | Weeks-Months | Formal documentation | Major architecture work |

### 2. Markdown Body (Workflow Routing + Examples + Documentation)

```markdown
# Skill Name

[Brief description of what the skill does]

## [Additional Sections]

[Documentation, quick reference, critical paths, etc.]
```

**Workflow routing format:** Table with Workflow, Trigger, File columns
- Workflow names in **lower_snake_case** matching file names
- Simple trigger description
- File path in backticks

**When to show the workflow message:**
- ONLY output the message when actually loading and executing a workflow file
- If the skill handles the request directly without calling a workflow, do NOT show the message
- The message indicates "I'm reading and following instructions from a workflow file"

---

## Dynamic Loading Pattern (Recommended for Large Skills)

**Purpose:** Reduce context on skill invocation by keeping SKILL.md minimal and loading additional context files only when needed.

### How Loading Works

**Session Startup:**
- Only frontmatter (YAML) loads from all SKILL.md files for routing

**Skill Invocation:**
- Full SKILL.md body loads when skill is invoked
- Additional .md context files load when referenced by workflows or called directly

**Benefit:** Most skill invocations don't need all documentation - load only what workflows actually use.

### The Pattern

**SKILL.md** = Minimal routing + quick reference (30-50 lines)
**Additional .md files** = Context files - SOPs for specific aspects (loaded on-demand)

### Structure

```
skills/skill-name/
├── SKILL.md                    # Minimal routing - loads on invocation
├── aesthetic.md                # Context file - SOP for aesthetic handling
├── examples.md                 # Context file - SOP for examples
├── api_reference.md            # Context file - SOP for API usage
├── tools.md                    # Context file - SOP for tool usage
├── workflows/                  # Workflow execution files
│   ├── create.md
│   └── update.md
└── tools/                      # Actual CLI tools
    └── generate.ts
```

### 🚨 CRITICAL: NO Context/ Subdirectory 🚨

**NEVER create a Context/ or Docs/ subdirectory.**

The additional .md files ARE the context files. They live **directly in the skill root directory** alongside SKILL.md.

**WRONG (DO NOT DO THIS):**
```
skills/skill-name/
├── SKILL.md
└── context/              ❌ NEVER CREATE THIS DIRECTORY
    ├── aesthetic.md
    └── examples.md
```

**CORRECT:**
```
skills/skill-name/
├── SKILL.md
├── aesthetic.md          ✅ Context file in skill root
└── examples.md           ✅ Context file in skill root
```

**The skill directory itself IS the context.** Additional .md files are context files that provide SOPs for specific aspects of the skill's operation.

---

## Canonicalization

**"Canonicalize a skill"** means restructuring it to match this document exactly.

### When to Canonicalize

- Skill has old YAML format (separate `triggers:` or `workflows:` arrays)
- Skill uses incorrect naming conventions (not lower-kebab-case for directories, not lower_snake_case for files)
- Skill is missing `USE WHEN` in description
- Skill lacks `## Examples` section
- Skill has `backups/` inside its directory
- Workflow routing uses old format

### Canonicalization Checklist

#### Naming Conventions
- [ ] Skill directory uses lower-kebab-case
- [ ] All workflow files use lower_snake_case
- [ ] All reference docs use lower_snake_case
- [ ] All tool files use lower_snake_case
- [ ] Routing table names match file names exactly
- [ ] YAML `name:` uses lower-kebab-case (matches directory)

#### YAML Frontmatter
- [ ] Single-line `description` with embedded `USE WHEN`
- [ ] No separate `triggers:` or `workflows:` arrays
- [ ] Description uses intent-based language
- [ ] Description under 1024 characters

#### Markdown Body
- [ ] `## Workflow Routing` section with table format
- [ ] All workflow files have routing entries
- [ ] `## Examples` section with 2-3 concrete patterns

#### Structure
- [ ] `tools/` directory exists (even if empty)
- [ ] No `backups/` directory inside skill
- [ ] Reference docs at skill root (not in Workflows/)
- [ ] Workflows contain ONLY execution procedures

---

## Examples Section (REQUIRED)

**Every skill MUST have an `## Examples` section** showing 2-3 concrete usage patterns.

**Why Examples Matter:**
- Anthropic research shows examples improve tool selection accuracy from 72% to 90%
- Descriptions tell Claude WHEN to activate; examples show HOW the skill works
- Claude learns the full input→behavior→output pattern, not just trigger keywords

**Example Format:**
```markdown
## Examples

**Example 1: [Use case name]**
```
User: "[Actual user request]"
→ Invokes workflow_name workflow
→ [What the skill does - action 1]
→ [What user receives back]
```

**Example 2: [Another use case]**
```
User: "[Different request pattern]"
→ [Process steps]
→ [Output/result]
```
```

**Guidelines:**
- Use 2-3 examples per skill (not more)
- Show realistic user requests (natural language)
- Include the workflow or action taken (lower_snake_case)
- Show what output/result the user gets
- Cover the most common use cases

---

## Intent Matching, Not String Matching

We use **intent matching**, not exact phrase matching.

**Example description:**
```yaml
description: Complete blog workflow. USE WHEN user mentions doing anything with their blog, website, site, including things like update, proofread, write, edit, publish, preview, blog posts, articles, headers, or website pages, etc.
```

**Key Principles:**
- Use intent language: "user mentions", "user wants to", "including things like"
- Don't list exact phrases in quotes
- Cover the domain conceptually
- Use `OR` to combine multiple trigger conditions

---

## Directory Structure

Every skill follows this structure:

```
skill-name/                   # lower-kebab-case directory name
├── SKILL.md                  # Main skill file (always uppercase)
├── quick_start_guide.md      # Context/reference files in root (lower_snake_case)
├── defense_mechanisms.md     # Context/reference files in root (lower_snake_case)
├── examples.md               # Context/reference files in root (lower_snake_case)
├── tools/                    # CLI tools (ALWAYS present, even if empty)
│   ├── tool_name.ts          # TypeScript CLI tool (lower_snake_case)
│   └── tool_name.help.md     # Tool documentation (lower_snake_case)
└── workflows/                # Work execution workflows (lower-kebab-case folder)
    ├── create.md             # Workflow file (lower_snake_case)
    ├── update_info.md        # Workflow file (lower_snake_case)
    └── sync_repo.md          # Workflow file (lower_snake_case)
```

- **SKILL.md** - Contains single-line description in YAML, workflow routing and documentation in body
- **Context files (in root)** - Documentation, guides, reference materials live in skill root, NOT in subdirectories (lower_snake_case names)
- **tools/** - CLI tools for automation (ALWAYS present directory, even if empty)
- **workflows/** - Contains work execution workflows ONLY (lower_snake_case names)
- **NO resources/ or docs/ subdirectories** - Context files go in skill root

---

## Flat Folder Structure (MANDATORY)

**CRITICAL: Keep folder structure FLAT - maximum 2 levels deep.**

### The Rule

Skills use a **flat hierarchy** - no deep nesting of subdirectories.

**Maximum depth:** `skills/skill-name/category/`

### ✅ ALLOWED (2 levels max)

```
skills/osint/SKILL.md                           # Skill root
skills/osint/workflows/company_due_diligence.md # Workflow - one level deep
skills/osint/tools/analyze.ts                   # Tool - one level deep
skills/osint/company_tools.md                   # Context file - in root
skills/osint/examples.md                        # Context file - in root
```

### ❌ FORBIDDEN (Too deep OR wrong location)

```
skills/osint/resources/examples.md              # Context files go in root, NOT resources/
skills/osint/docs/company_tools.md              # Context files go in root, NOT docs/
skills/osint/templates/primitives/extract.md    # THREE levels - NO
skills/osint/workflows/company/due_diligence.md # THREE levels - NO
```

### Why Flat Structure

1. **Discoverability** - Easy to find files with simple `ls` or `grep`
2. **Simplicity** - Less cognitive overhead navigating directories
3. **Speed** - Faster file operations without deep traversal
4. **Maintainability** - Harder to create organizational complexity
5. **Consistency** - Every skill follows same simple pattern

---

## CLI Tools (`tools/` directory)

**Every skill MUST have a `tools/` directory**, even if empty. CLI tools automate repetitive tasks and manage stateful resources.

### When to Create a CLI Tool

Create CLI tools for:
- **Server management** - start, stop, restart, status
- **State queries** - check if running, get configuration
- **Repeated operations** - tasks executed frequently by workflows
- **Complex automation** - multi-step processes that benefit from encapsulation

### Tool Requirements

Every CLI tool must:
1. **Be TypeScript** - Use `#!/usr/bin/env bun` shebang
2. **Use lower_snake_case naming** - `tool_name.ts`, not `tool-name.ts` or `ToolName.ts`
3. **Have a help file** - `tool_name.help.md` with full documentation
4. **Support `--help`** - Display usage information
5. **Use colored output** - ANSI colors for terminal feedback
6. **Handle errors gracefully** - Clear error messages, appropriate exit codes
7. **Expose configuration via flags** - Enable behavioral control

### Tool Structure

```typescript
#!/usr/bin/env bun
/**
 * tool_name.ts - Brief description
 *
 * Usage:
 *   bun ${PAI_DIR}/skills/skill-name/tools/tool_name.ts <command> [options]
 *
 * Commands:
 *   start     Start the thing
 *   stop      Stop the thing
 *   status    Check status
 *
 */
```

**Principle:** Workflows call tools; tools encapsulate complexity. This keeps workflows simple and tools reusable.

---

## How It Works

1. **Skill Activation**: Claude Code reads skill descriptions at startup. The `USE WHEN` clause in the description determines when the skill activates based on user intent.

2. **Workflow Routing**: Once the skill is active, the `## Workflow Routing` section determines which workflow file to execute.

3. **Workflow Execution**: Follow the workflow file instructions step-by-step.

---

## Skills Are Scripts to Follow

When a skill is invoked, follow the SKILL.md instructions step-by-step rather than analyzing the skill structure.

**The pattern:**
1. Execute voice notification (if present)
2. Use the routing table to find the right workflow
3. Follow the workflow instructions in order
4. Your behavior should match the Examples section

Think of SKILL.md as a script - it already encodes "how to do X" so you can follow it directly.

---

## Complete Checklist

Before a skill is complete:

### Naming Conventions
- [ ] Skill directory uses lower-kebab-case (e.g., `blogging/`, `daemon/`)
- [ ] YAML `name:` uses lower-kebab-case (matches directory)
- [ ] All workflow files use lower_snake_case (e.g., `create.md`, `update_info.md`)
- [ ] All reference docs use lower_snake_case (e.g., `prosody_guide.md`)
- [ ] All tool files use lower_snake_case (e.g., `manage_server.ts`)
- [ ] Routing table workflow names match file names exactly

### YAML Frontmatter
- [ ] Single-line `description` with embedded `USE WHEN` clause
- [ ] No separate `triggers:` or `workflows:` arrays
- [ ] Description uses intent-based language
- [ ] Description under 1024 characters

### Markdown Body
- [ ] `## Workflow Routing` section with table format
- [ ] All workflow files have routing entries
- [ ] **`## Examples` section with 2-3 concrete usage patterns** (REQUIRED)

### Structure
- [ ] `tools/` directory exists (even if empty)
- [ ] No `backups/` directory inside skill
- [ ] Workflows contain ONLY work execution procedures
- [ ] Reference docs live at skill root (not in Workflows/)
- [ ] Each CLI tool has a corresponding `.help.md` documentation file
- [ ] (Recommended) Output Requirements section for variable-output skills

---

**Document Version:** 1.1.0
**Last Updated:** 2026-01-18
**Related Files:** ARCHITECTURE.md, ORCHESTRATION.md, WORKFLOWS.md, AGENTS_LOGIC.md, DOMAINS_LOGIC.md, MEMORY_LOGIC.md, TOOLBOX.md

---