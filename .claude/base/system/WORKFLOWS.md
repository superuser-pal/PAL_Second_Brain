---
title: PAL Workflows System
version: 1.1.0
layer: SYSTEM
purpose: Configuration system and structure for PAL workflows
last_updated: 2026-01-18
---

# PAL Workflows System

**The configuration system for PAL workflow definitions and execution.**

---

## THIS IS THE AUTHORITATIVE SOURCE

This document defines the **required structure** for workflows in the PAL framework.

**ALL workflow creation MUST follow this structure.**

If a workflow does not follow this structure, it will not execute correctly within the PAL system.

---

## What Are Workflows?

**Workflows** = Multi-step sequences of actions designed to accomplish a specific goal.

**Location:** `.claude/skills/[skill-name]/workflows/` (ONLY within skills)

**Purpose:** Enable structured, repeatable, and observable execution of complex tasks.

**Key Characteristics:**

- **Structured** - Predefined steps with clear order
- **Repeatable** - Same workflow produces consistent results
- **Composable** - Workflows can call other workflows
- **Observable** - Progress visible at each step
- **Recoverable** - Can handle errors gracefully

**When to Use Workflows:**

| Use Workflow When | Use Direct Execution When |
| :---------------- | :------------------------ |
| Task has 3+ distinct steps | Single simple action |
| Steps have dependencies | One-off task |
| Task will be repeated frequently | Immediate result expected |
| Process needs consistency | No repeatability need |
| Users need progress visibility | Simple file operation |

---

## Naming Conventions (MANDATORY)

**Workflow naming follows PAL's standard file naming conventions.**

| Category | Convention | Example | Purpose |
| :------- | :--------- | :------ | :------ |
| **Workflows directory** | `workflows/` | `.claude/skills/blogging/workflows/` | Standard location within skill. |
| **Workflow files** | `lower_snake_case.md` | `create_post.md` | Workflow definition files. |
| **Workflow name (YAML)** | `TitleCase` | `name: CreatePost` | Human-readable identifier. |

**Convention Rules:**

- **Directory:** Always `workflows/` within the skill directory
- **Files:** Use `lower_snake_case` with `.md` extension
- **YAML name:** Use `TitleCase` for readability

---

## Directory Structure

**Workflows MUST be contained within skills.** There are no cross-skill or standalone workflows.

```
.claude/skills/[skill-name]/
├── SKILL.md                    # Skill definition
├── workflows/                  # Workflow directory
│   ├── create_post.md          # Workflow file
│   ├── edit_post.md            # Workflow file
│   └── publish_post.md         # Workflow file
└── tools/                      # Skill tools
```

**Key Rules:**

- Workflows live **only** inside `.claude/skills/[skill-name]/workflows/`
- If a workflow is needed, it must belong to an appropriate skill
- No `.claude/workflows/` directory exists at system level

---

## Workflow Types

PAL supports three workflow types:

### 1. Sequential Workflows

**Definition:** Steps execute in linear order (Step 1 → Step 2 → Step 3).

```
CreateBlogPost workflow:
1. Gather requirements
2. Create outline
3. Draft content
4. Review and refine
5. Format and save
```

**Use when:** Steps must happen in specific order with no branching.

### 2. Conditional Workflows

**Definition:** Execution path depends on previous step results or conditions.

```
PublishBlogPost workflow:
1. Check if post exists
   → If NO: Error, abort
   → If YES: Continue
2. Validate content
   → If fails: Report issues
   → If passes: Continue
3. Publish to website
```

**Use when:** Execution path varies based on runtime conditions.

### 3. Nested Workflows

**Definition:** One workflow calls another workflow as a step.

```
PublishBlogPost workflow:
1. Call ReviewBlogPost workflow (nested)
   └─> Returns: Pass/Fail
2. If review passes, call ValidateInput workflow (nested)
   └─> Returns: Safe/Unsafe
3. If validation passes, publish
4. Call NotificationWorkflow (nested)
```

**Use when:** Workflow step is complex enough to be its own workflow, or multiple workflows share common sub-steps.

**Best Practice:** Limit nesting to 2-3 levels deep.

---

## Workflow Template

Every workflow follows this structure:

```yaml
---
name: WorkflowName
version: 1.0.0
purpose: One-sentence description of what this workflow accomplishes
trigger: When this workflow should be used
type: sequential | conditional | nested
---

## Overview
[Brief description of what this workflow does]

## Prerequisites
- [Required context or conditions]
- [Example: Blog post draft must exist]

## Steps

### Step 1: [Step Name]
**Purpose:** [What this step accomplishes]
**Actions:**
- [Action 1]
- [Action 2]

**Expected Output:** [What this step produces]

### Step 2: [Step Name]
**Purpose:** [What this step accomplishes]
**Actions:**
- [Action 1]
- [Action 2]

**Expected Output:** [What this step produces]

## Outputs
- [Final artifact 1] - [Description]

## Error Handling
- **If Step X fails:** [Recovery action]
```

### Required Fields

| Field | Description |
| :---- | :---------- |
| `name` | TitleCase, descriptive (e.g., CreateBlogPost) |
| `version` | Semantic versioning (1.0.0) |
| `purpose` | One-sentence summary |
| `trigger` | When to use this workflow |
| `type` | sequential, conditional, or nested |

### Optional Fields

| Field | Description |
| :---- | :---------- |
| `author` | Who created this workflow |
| `last_updated` | Date of last modification |
| `tags` | Categorization tags |

---

## Workflow Composition

### Sequential Composition

Execute workflows one after another:

```
Blog Publishing Pipeline:
1. CreateBlogPost workflow → Produces draft
2. ReviewBlogPost workflow → Validates content
3. PublishBlogPost workflow → Publishes to website

Each workflow completes before next begins.
```

### Conditional Composition

Choose workflow based on runtime conditions:

```
Content Publishing Decision:
IF post already exists:
  → Execute UpdateBlogPost workflow
ELSE:
  → Execute CreateBlogPost workflow
```

### Nested Composition

One workflow calls another as a step:

```
PublishBlogPost workflow:
  Step 1: Validate prerequisites
  Step 2: Call ReviewBlogPost workflow (nested)
    └─> Returns result to parent
  Step 3: Use result, continue or abort
```

**Benefits:** Modularity, maintainability, clarity, independent testing.

---

## Execution & Error Handling

### Progress Visibility

PAL Master provides progress updates during workflow execution:

```
Executing CreateBlogPost workflow (5 steps)

Step 1/5: Gather Requirements ✓ Complete
Step 2/5: Research & Outline ⏳ In progress...
```

### Error Handling

When errors occur mid-workflow:

```
Step 4/5: Publish ❌ Error

Error details:
- Network connection failed
- Post NOT published

Options:
1. Retry Step 4
2. Save draft for manual publishing
3. Abort workflow
```

**Key Patterns:**

- Provide clear error messages
- Offer recovery options (retry, save, abort)
- Allow resumption from failed step when possible

---

## Complete Checklist

Before a workflow is complete:

### Structure

- [ ] Workflow lives in `.claude/skills/[skill-name]/workflows/`
- [ ] Workflow file uses `lower_snake_case.md` naming
- [ ] Parent skill exists and references the workflow

### Content

- [ ] YAML frontmatter includes all required fields (name, version, purpose, trigger, type)
- [ ] Overview section explains what and why
- [ ] Prerequisites are documented
- [ ] Each step has Purpose, Actions, and Expected Output
- [ ] Outputs section lists final artifacts
- [ ] Error Handling section covers failure scenarios

### Integration

- [ ] Skill's SKILL.md references this workflow
- [ ] Workflow trigger aligns with skill's USE WHEN clause
- [ ] Nested workflows (if any) exist and are accessible

---

## Summary

| Component | Purpose | Location |
| :-------- | :------ | :------- |
| **Workflow files** | Multi-step execution definitions | `.claude/skills/[skill-name]/workflows/` |
| **Sequential** | Linear step execution | Steps execute in order |
| **Conditional** | Branching execution | Path depends on conditions |
| **Nested** | Composable workflows | Workflows call other workflows |

This system ensures:

1. Workflows provide structured, repeatable execution
2. Workflows are always contained within skills
3. Progress is visible at each step
4. Errors are handled gracefully with recovery options
5. **All naming follows PAL's standard conventions**

---

**Document Version:** 1.1.0
**Last Updated:** 2026-01-18
**Related Files:** ARCHITECTURE.md, ORCHESTRATION.md, SKILL_LOGIC.md, AGENTS_LOGIC.md, DOMAINS_LOGIC.md, MEMORY_LOGIC.md, TOOLBOX.md

---
