---
title: PAL Workflows System
version: 1.0.0
layer: SYSTEM
purpose: Strict structural constraints for constructing workflows
last_updated: 2026-03-17
---

## 1. Mandatory Location & Naming

- **Location:** MUST be nested strictly one level inside a skill: `.claude/skills/[skill-name]/workflows/`
- **Naming:** `lower_snake_case.md` (e.g., `generate_report.md`)
- **Action Naming:** Keep names verb-led (`build_x.md`, `format_y.md`).

---

## 2. Required File Format

All workflows MUST follow this markdown structure:

```markdown
---
description: [Short action-oriented description of what this achieves, e.g. "Generates a standard weekly report"]
---

# [Workflow Name]

## Parameters
- List expected inputs from user/agent.

## Prerequisites
- State what must be true before starting (e.g., "Must be in a specific directory").

## Steps (MANDATORY REQUIRED NUMBERED LIST)
1. First distinct action.
2. Second distinct action.
   - 2a. Sub steps.
3. Third distinct action.

## Validation/Success Criteria
- How to determine the workflow succeeded.
```

---

## 3. Execution Constraints

- Agents MUST execute numbered steps in order.
- Agents CANNOT skip steps unless explicitly instructed.
- Agents MUST stop and report to the user if a step fails.
- Agents MUST validate the output against "Validation Criteria" before completing the workflow.

---
