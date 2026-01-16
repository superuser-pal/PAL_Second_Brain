---
title: PAL Workflows System
version: 1.0.0
category: System
layer: SYSTEM
purpose: Multi-step actions, pipeline logic, and workflow composition
last_updated: 2026-01-13
---

# PAL Workflows System

**Version:** 1.0.0
**Purpose:** How PAL executes multi-step workflows with composition patterns
**Layer:** SYSTEM

---

## Section 1: Workflow Fundamentals

### What is a Workflow?

**Workflow** = Multi-step sequence of actions designed to accomplish a specific goal

**Key Characteristics:**

- **Structured** - Predefined steps with clear order
- **Repeatable** - Same workflow produces consistent results
- **Composable** - Workflows can call other workflows
- **Observable** - Progress visible at each step
- **Recoverable** - Can handle errors gracefully

**Contrast with Direct Execution:**

| Aspect            | Direct Execution   | Workflow Execution             |
| ----------------- | ------------------ | ------------------------------ |
| **Steps**         | Single action      | Multiple coordinated steps     |
| **Structure**     | Ad-hoc             | Predefined sequence            |
| **Repeatability** | Varies             | Consistent                     |
| **Visibility**    | Single result      | Step-by-step progress          |
| **Example**       | "Fix typo in file" | "Create and publish blog post" |

**When to Use Workflows:**

```
Use workflow when:
- Task has 3+ distinct steps
- Steps have dependencies (Step 2 needs Step 1 result)
- Task will be repeated frequently
- Process needs consistency (e.g., publishing checklist)
- Users need visibility into progress

Direct execution when:
- Single simple action
- One-off task with no repeatability need
- Immediate result expected
```

### Workflow Types

PAL supports three workflow types:

#### 1. Sequential Workflows

**Definition:** Steps execute in linear order (Step 1 → Step 2 → Step 3)

**Characteristics:**

- Each step completes before next begins
- No branching or conditional logic
- Predictable execution path
- Simplest workflow type

**Example:**

```
CreateBlogPost workflow:
1. Gather requirements
2. Create outline
3. Draft content
4. Review and refine
5. Format and save
```

**Use When:**

- Steps must happen in specific order
- No conditional branching needed
- Simple linear process

**See:** [Sequential Execution Pattern](../../docs/patterns/Execution/sequential-execution-pattern.md)

#### 2. Conditional Workflows

**Definition:** Execution path depends on previous step results or conditions

**Characteristics:**

- Branching logic (if/else)
- Different paths for different scenarios
- Runtime decisions based on data
- More complex than sequential

**Example:**

```
PublishBlogPost workflow:
1. Check if post exists
   → If NO: Error, abort workflow
   → If YES: Continue
2. Validate content
   → If validation fails: Report issues, ask for fixes
   → If validation passes: Continue
3. Check if draft or published
   → If draft: Publish to website
   → If already published: Update existing post
4. Send notification
```

**Use When:**

- Execution path varies based on conditions
- Error handling requires different actions
- User decisions affect workflow path

**See:** [Conditional Execution Pattern](../../docs/patterns/Execution/conditional-execution-pattern.md)

#### 3. Nested Workflows

**Definition:** One workflow calls another workflow as a step

**Characteristics:**

- Workflows compose hierarchically
- Sub-workflows encapsulate complex steps
- Reusable workflow components
- Most powerful composition pattern

**Example:**

```
PublishBlogPost workflow:
1. Call ReviewBlogPost workflow (nested)
   └─> ReviewBlogPost executes:
       - Check grammar
       - Validate links
       - Ensure tone matches DIRECTIVES.md
       - Return: Pass/Fail
2. If review passes:
   Call ValidateInput workflow (nested, Security skill)
   └─> ValidateInput executes:
       - Scan for credentials
       - Check for PII
       - Validate against GUARDRAILS.md
       - Return: Safe/Unsafe
3. If validation passes:
   Publish to website (direct action)
4. Call NotificationWorkflow (nested)
   └─> NotificationWorkflow executes:
       - Send desktop notification
       - Log to session transcript
       - Update status file
```

**Use When:**

- Workflow step is complex enough to be its own workflow
- Multiple workflows share common sub-steps
- Need modular, reusable workflow components

**See:** [Nested Execution Pattern](../../docs/patterns/Execution/nested-execution-pattern.md)

---

## Section 2: Workflow Structure

### Standard Workflow Definition

Every workflow follows this structure:

```yaml
---
name: WorkflowName
version: 1.0.0
purpose: One-sentence description of what this workflow accomplishes
trigger: When this workflow should be used
skill: SkillName (if workflow is skill-specific)
type: sequential | conditional | nested
---

## Overview
[Brief description of what this workflow does and why it exists]

## Prerequisites
- [Required context or conditions before workflow can execute]
- [Example: Blog post draft must exist]
- [Example: User must have publishing credentials configured]

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

[Additional steps...]

## Outputs
- [Final artifact 1] - [Description]
- [Final artifact 2] - [Description]

## Error Handling
- **If Step X fails:** [Recovery action]
- **If validation fails:** [Recovery action]

## Related Workflows
- [Related Workflow 1] - [How it relates]
- [Related Workflow 2] - [How it relates]
```

### Workflow Metadata

**Required Fields:**

- `name` - TitleCase, descriptive (e.g., CreateBlogPost)
- `version` - Semantic versioning (1.0.0)
- `purpose` - One-sentence summary
- `trigger` - When to use this workflow
- `type` - sequential, conditional, or nested

**Optional Fields:**

- `skill` - If workflow belongs to specific skill
- `author` - Who created this workflow
- `last_updated` - Date of last modification
- `tags` - Categorization tags

### Step Definition Guidelines

**Good Step Definition:**

```markdown
### Step 2: Create Content Outline

**Purpose:** Generate structured outline for blog post
**Actions:**

- Review topic and target audience from Step 1
- Create introduction hook
- Define 3-5 main sections with key points
- Plan conclusion with call-to-action

**Expected Output:** Markdown outline with hierarchical structure
```

**Poor Step Definition:**

```markdown
### Step 2: Outline

Do the outline.
```

**Key Principles:**

- **Clarity** - Each step's purpose is obvious
- **Specificity** - Actions are concrete, not vague
- **Observable** - Output can be verified
- **Self-contained** - Step makes sense in isolation

---

## Section 3: Workflow Composition

### Sequential Composition

**Pattern:** Execute workflows one after another

```
Workflow A completes → Workflow B begins → Workflow C begins
```

**Example:**

```
Blog Publishing Pipeline:
1. CreateBlogPost workflow → Produces draft
2. ReviewBlogPost workflow → Validates content
3. PublishBlogPost workflow → Publishes to website

Each workflow completes before next begins.
User approves at each stage.
```

**Implementation:**

```
PAL Master:
"I'll execute the blog publishing pipeline in 3 workflows:

1. CreateBlogPost
   - Gather requirements
   - Create outline
   - Draft content
   - Save draft

2. ReviewBlogPost
   - Check grammar and spelling
   - Validate links
   - Ensure tone matches DIRECTIVES.md
   - Report issues or approve

3. PublishBlogPost
   - Publish to website
   - Send notification

Proceed with pipeline?"

User: "yes"

[PAL Master executes each workflow sequentially]
```

**See:** [Sequential Execution Pattern](../../docs/patterns/Execution/sequential-execution-pattern.md)

### Conditional Composition

**Pattern:** Choose workflow based on runtime conditions

```
IF condition → Workflow A
ELSE → Workflow B
```

**Example:**

```
Content Publishing Decision:
IF post already exists:
  → Execute UpdateBlogPost workflow
ELSE:
  → Execute CreateBlogPost workflow

Runtime decision based on file existence check.
```

**Implementation:**

```
PAL Master:
"Checking if blog post exists..."

Check result: Post exists (blog/ai-ethics.md)

"Post already exists. I'll use UpdateBlogPost workflow instead of CreateBlogPost.

UpdateBlogPost workflow:
1. Load existing content
2. Apply requested changes
3. Preserve metadata
4. Update modification date
5. Save updated post

Proceed?"
```

**Complex Conditional Example:**

```
Review Outcome Decision:
IF review passes AND no security issues:
  → PublishBlogPost workflow
ELSE IF review passes BUT security issues found:
  → FixSecurityIssues workflow → PublishBlogPost workflow
ELSE IF review fails:
  → ReportIssues workflow → (user fixes) → ReviewBlogPost workflow (retry)
```

**See:** [Conditional Execution Pattern](../../docs/patterns/Execution/conditional-execution-pattern.md)

### Nested Composition

**Pattern:** One workflow calls another as a step

```
Workflow A:
  Step 1: Action
  Step 2: Call Workflow B (nested)
    └─> Workflow B executes completely
    └─> Returns result to Workflow A
  Step 3: Use result from Workflow B
  Step 4: Action
```

**Example:**

```
PublishBlogPost workflow (parent):
  Step 1: Validate prerequisites
  Step 2: Call ReviewBlogPost workflow (nested)
    └─> ReviewBlogPost workflow:
        - Check grammar
        - Validate links
        - Check tone
        - Return: Pass/Fail
  Step 3: If review passes, call ValidateInput workflow (nested)
    └─> ValidateInput workflow (Security skill):
        - Scan for credentials
        - Check for PII
        - Return: Safe/Unsafe
  Step 4: If validation passes, publish
  Step 5: Call NotificationWorkflow (nested)
```

**Benefits:**

- **Modularity** - Sub-workflows reusable elsewhere
- **Maintainability** - Update sub-workflow once, affects all parent workflows
- **Clarity** - Complex steps abstracted into named workflows
- **Testing** - Test sub-workflows independently

**Limitations:**

- **Complexity** - Deeper nesting harder to debug
- **Performance** - Nested calls add overhead
- **Dependency** - Parent workflow depends on sub-workflow stability

**Best Practice:** Limit nesting to 2-3 levels deep

**See:** [Nested Execution Pattern](../../docs/patterns/Execution/nested-execution-pattern.md)

### Parallel Composition (Future)

**Status:** Planned for PAL v2+

**Pattern:** Execute workflows simultaneously

```
Workflow A ┐
Workflow B ├─> All execute in parallel
Workflow C ┘
```

---

## Section 4: Creating Custom Workflows

### When to Create Custom Workflows

**Create custom workflow when:**

- You repeat a multi-step process frequently
- Process needs consistency across executions
- Multiple people need to follow same process
- Process is complex enough to benefit from documentation
- You want to compose workflow with existing workflows

**Don't create workflow for:**

- One-off tasks with no repeatability need
- Simple single-step actions
- Highly variable processes with no consistent pattern
- Tasks better suited for direct human judgment

### Custom Workflow Template

```yaml
---
name: YourWorkflowName
version: 1.0.0
purpose: [One sentence describing what this workflow accomplishes]
trigger: [When this workflow should be used]
skill: [SkillName if workflow belongs to a skill, otherwise omit]
type: sequential | conditional | nested
author: [Your name]
last_updated: YYYY-MM-DD
tags: [workflow, category, domain]
---

## Overview
[2-3 sentences explaining what this workflow does, why it exists, and when to use it]

## Prerequisites
- [Condition or context that must exist before workflow can run]
- [Required files, credentials, or setup]
- [Any dependencies on other workflows or tools]

## Steps

### Step 1: [Descriptive Step Name]
**Purpose:** [What this step accomplishes in one sentence]
**Actions:**
- [Specific action 1]
- [Specific action 2]
- [Specific action 3]

**Expected Output:** [What this step produces]

**Notes:** [Optional: any caveats, variations, or important details]

### Step 2: [Descriptive Step Name]
[Follow same structure as Step 1]

[Continue for all steps...]

## Outputs
- [Primary output 1] - [Description and format]
- [Secondary output 2] - [Description and format]

## Error Handling
- **If [error condition 1]:** [Recovery action or guidance]
- **If [error condition 2]:** [Recovery action or guidance]

## Related Workflows
- [Related Workflow Name] - [How it relates: "Run before this", "Alternative to", "Extends", etc.]

## Examples

### Example 1: [Scenario Name]
[Brief description of example scenario]

**Input:**
- [Input parameter 1]: [Value]
- [Input parameter 2]: [Value]

**Execution:**
[Brief description of how workflow executed in this example]

**Output:**
- [Output produced]

## Customization Notes
[Optional: How users can adapt this workflow to their needs]

## Version History
- **1.0.0** (YYYY-MM-DD): Initial creation
```

### Best Practices for Workflow Design

#### 1. Single Responsibility

**Each workflow should have one clear purpose.**

❌ Bad:

```
CreateAndPublishBlogPostAndNotifyTeam workflow
- Does too many things
- Hard to reuse parts
- Complex error handling
```

✅ Good:

```
CreateBlogPost workflow → Creates draft
PublishBlogPost workflow → Publishes draft
NotificationWorkflow → Notifies team

Compose as needed, each workflow has single purpose
```

#### 2. Observable Steps

**Users should see progress at each step.**

❌ Bad:

```
Step 1: Do everything
[Black box operation with no visibility]
```

✅ Good:

```
Step 1: Gather requirements → User sees requirements collected
Step 2: Create outline → User sees outline structure
Step 3: Draft content → User sees draft sections
Step 4: Refine → User sees improvements
```

#### 3. Clear Error Handling

**Define what happens when steps fail.**

❌ Bad:

```
Step 3: Publish to website
[If fails, workflow crashes with generic error]
```

✅ Good:

```
Step 3: Publish to website
Error handling:
- If network error: Retry 3 times, then save draft for manual publish
- If authentication fails: Prompt for credentials, retry
- If validation fails: Show errors, offer to fix and retry
```

#### 4. Reusable Components

**Design workflows to be composable.**

❌ Bad:

```
CreateAndPublishBlogPost workflow
- Contains review logic embedded in step 3
- Review logic can't be reused elsewhere
```

✅ Good:

```
ReviewBlogPost workflow (separate, reusable)
CreateBlogPost workflow calls ReviewBlogPost as nested workflow
PublishBlogPost workflow also calls ReviewBlogPost
```

#### 5. Sensible Defaults

**Provide defaults, allow overrides.**

✅ Good:

```
Step 1: Determine tone
- Default: Use DIRECTIVES.md tone setting
- Override: User can specify different tone for this post
```

### Integrating Custom Workflows with Skills

**If your workflow belongs to a skill:**

1. Create workflow file in skill's `workflows/` directory:

   ```
   .claude/skills/YourSkill/workflows/your-workflow.md
   ```

2. Reference workflow in skill's SKILL.md:

   ```markdown
   # YourSkill SKILL.md

   ## Available Workflows

   - YourWorkflow - [Brief description]
   - [Links to workflow files]
   ```

3. Ensure skill's USE WHEN clauses cover scenarios where workflow applies

4. Test workflow through skill activation (not just direct execution)

**If your workflow is cross-skill or general:**

1. Create workflow file in a general workflows directory:

   ```
   .claude/workflows/your-workflow.md
   ```

2. Document workflow in WORKFLOWS.md (this file)

3. Make workflow discoverable through PAL Master queries

---

## Section 5: Workflow Execution Monitoring

### Progress Visibility

**PAL Master provides progress updates during workflow execution:**

```
PAL Master:
"Executing CreateBlogPost workflow (5 steps)

Step 1/5: Gather Requirements ✓ Complete
- Topic: AI Ethics
- Audience: Technical professionals
- Tone: Professional, balanced
- Length: 1500-2000 words

Step 2/5: Research & Outline ⏳ In progress..."
```

### Step-by-Step Approval (Optional)

**For critical workflows, users can request step-by-step approval:**

```
User: "Run CreateBlogPost but ask me before each step"

PAL Master:
"I'll execute CreateBlogPost with step-by-step approval.

Step 1: Gather Requirements
- Prompt for topic, audience, tone, length
Proceed with Step 1? (yes/no)"

User: "yes"

[Step 1 executes]

PAL Master:
"Step 1 complete. Results:
- Topic: AI Ethics
- Audience: Technical professionals
- Tone: Professional, balanced
- Length: 1500-2000 words

Step 2: Research & Outline
- Generate outline structure with key points
Proceed with Step 2? (yes/no)"
```

### Error Handling During Execution

**When errors occur mid-workflow:**

```
PAL Master:
"Executing PublishBlogPost workflow (5 steps)

Step 1/5: Pre-publish Validation ✓ Complete
Step 2/5: Security Check ✓ Complete
Step 3/5: Prepare for Publication ✓ Complete
Step 4/5: Publish ❌ Error

Error details:
- Network connection to publishing platform failed
- Post NOT published

Options:
1. Retry Step 4 (publish again)
2. Save draft for manual publishing
3. Abort workflow

Choose option:"
```

**See:** [Error Recovery Pattern](../../docs/patterns/Integrity/error-recovery-pattern.md)

---

## Conclusion

PAL's workflow system enables **structured, repeatable execution** through:

1. **Three Workflow Types** - Sequential, Conditional, Nested
2. **Standard Structure** - Consistent workflow definitions with metadata, steps, outputs
3. **Composition Patterns** - Sequential, conditional, nested, and (future) parallel composition
4. **Custom Workflow Creation** - Templates and best practices for building your own
5. **Execution Monitoring** - Progress visibility, error handling, step-by-step approval

**For Users:**

- Use pre-built workflows from skills
- Create custom workflows for repeated processes
- Compose workflows for complex tasks
- Monitor execution progress

**For PAL Master:**

- Execute workflows step-by-step
- Provide progress visibility
- Handle errors gracefully with recovery options
- Support nested workflow composition

**Next Steps:**

- Read [MEMORY_LOGIC.md](MEMORY_LOGIC.md) for context tracking and hooks
- Read [TOOLBOX.md](TOOLBOX.md) for available tools and integrations
- Read [Execution Patterns](../../docs/patterns/Execution/) for detailed pattern documentation
- Explore skill workflows in `.claude/skills/[SkillName]/workflows/`

---

**Document Version:** 1.0.0
**Last Updated:** 2026-01-14
**Related Files:** ARCHITECTURE.md, ORCHESTRATION.md, MEMORY_LOGIC.md, TOOLBOX.md

---

## Migration & Integration

> **AI INSTRUCTIONS**: When this file is placed in a new project, follow these integration steps.

### Layer Classification

- **Layer**: SYSTEM
- **Priority**: 13 (after ORCHESTRATION - execution patterns)
- **Dependencies**: ORCHESTRATION.md (workflows are triggered by orchestration)

### Target Location

```
[PROJECT_ROOT]/PAL_Base/System/WORKFLOWS.md
```

### Integration Steps

1. **Verify Directory Structure**

   ```bash
   mkdir -p PAL_Base/System
   ```

2. **Place File**

   - Copy this file to `PAL_Base/System/WORKFLOWS.md`
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
   - Request a multi-step task
   - Verify PAL uses appropriate workflow type (sequential, conditional, nested)

### How This File Is Used

| System Component | Usage                                      |
| ---------------- | ------------------------------------------ |
| **PAL Master**   | Selects and executes appropriate workflows |
| **Skills**       | Define domain-specific workflows           |
| **Execution**    | Follows workflow composition patterns      |
| **Monitoring**   | Reports progress per workflow step         |

### Customization Required

This file is **reference documentation** - typically NOT customized:

- [ ] **Review** - Understand 3 workflow types (sequential, conditional, nested)
- [ ] **Validate** - Ensure workflow patterns match your needs
- [ ] **Optional** - Add notes about custom workflow patterns

### First-Use Checklist

- [ ] File placed in `PAL_Base/System/`
- [ ] SessionStart hook loads file at priority 13
- [ ] Workflow types understood
- [ ] Skills reference appropriate workflow patterns
- [ ] PAL executes workflows correctly
