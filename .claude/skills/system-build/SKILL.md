---
name: system-build
description: Specification-driven development toolkit for PAL system building. USE WHEN create spec, specification, feature spec, implementation plan, generate tasks, task breakdown, checklist, clarify requirements, analyze consistency, constitution, system build, build system, develop PAL.
---

# system-build

Specification-driven development toolkit for structured PAL system building and feature implementation. Provides workflows for creating specifications, planning implementation, generating tasks, and quality validation.

## Workflow Routing

| Workflow | Trigger | File |
| :--- | :--- | :--- |
| **specify** | "create spec", "feature specification", "new feature" | `workflows/specify.md` |
| **plan** | "implementation plan", "technical plan", "design plan" | `workflows/plan.md` |
| **tasks** | "generate tasks", "break down plan", "task list" | `workflows/tasks.md` |
| **implement** | "implement feature", "execute tasks", "start implementation" | `workflows/implement.md` |
| **checklist** | "create checklist", "quality check", "validation checklist" | `workflows/checklist.md` |
| **clarify** | "clarify spec", "resolve ambiguities", "spec questions" | `workflows/clarify.md` |
| **analyze** | "analyze consistency", "cross-artifact analysis" | `workflows/analyze.md` |
| **constitution** | "update constitution", "project governance" | `workflows/constitution.md` |
| **document** | "document feature", "generate requirements", "create docs" | `workflows/document.md` |
| **document_skill** | "document skill", "skill requirements", "skill docs" | `workflows/document_skill.md` |
| **tasks_to_issues** | "create issues", "export to GitHub" | `workflows/tasks_to_issues.md` |

## Templates

Located in `templates/` directory:

- `spec_template.md` - Feature specification structure
- `plan_template.md` - Implementation plan structure
- `tasks_template.md` - Task breakdown structure
- `checklist_template.md` - Quality checklist structure
- `agent_file_template.md` - Agent file template

## Workflow Sequence

```
1. specify → Create feature specification
2. clarify → Resolve ambiguities (optional)
3. plan → Generate implementation plan
4. tasks → Break plan into actionable tasks
5. checklist → Create quality checklists
6. analyze → Cross-artifact consistency check
7. implement → Execute tasks
8. document → Generate requirements documentation
9. tasks_to_issues → Export to GitHub issues
```

## Examples

**Example 1: Create a new feature specification**

```
User: "Create a spec for user authentication with OAuth2"
→ Invokes specify workflow
→ Generates branch name and feature directory
→ Creates spec.md using spec_template.md
→ Validates spec quality
→ Reports completion with next steps
```

**Example 2: Generate implementation plan**

```
User: "Create a plan for the auth feature"
→ Invokes plan workflow
→ Loads spec.md and constitution
→ Generates technical context
→ Creates plan.md, research.md, data-model.md
→ Reports artifacts created
```

**Example 3: Break down into tasks**

```
User: "Generate tasks from the plan"
→ Invokes tasks workflow
→ Reads spec.md and plan.md
→ Creates tasks.md with dependencies
→ Returns task count and phases
```

**Example 4: Analyze spec consistency**

```
User: "Analyze the current feature for consistency"
→ Invokes analyze workflow
→ Loads spec.md, plan.md, tasks.md
→ Runs semantic analysis
→ Reports findings with severity
```
