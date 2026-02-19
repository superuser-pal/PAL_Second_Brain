# Checklist Workflow

Generate quality validation checklists for requirements (not implementation testing).

## Prerequisites

- spec.md exists in feature folder
- spec.md status is `tasked`

## Purpose

Checklists are **unit tests for requirements** - they validate completeness, clarity, and consistency of requirements, NOT implementation behavior.

## Steps

1. **Load context**
   - Read `domains/{domain}/01_PROJECTS/FEAT_NNN_name/spec.md`
   - Read plan.md and tasks.md if they exist

2. **Clarify checklist theme** (1-3 questions)
   - Derive theme: ux, api, security, data, integration
   - Identify focus areas from user input

3. **Generate checklist items**
   - Format: `- [ ] CHK001 [Theme] Question about requirement quality`
   - Focus on: Completeness, Clarity, Consistency, Measurability, Coverage
   - CORRECT: "Are visual hierarchy requirements defined with measurable criteria?"
   - WRONG: "Verify the button clicks correctly" (that's implementation testing)

4. **Write checklist.md**
   - Write to `domains/{domain}/01_PROJECTS/FEAT_NNN_name/checklist.md`
   - Update spec.md frontmatter:
     ```yaml
     status: validated
     next_step: analyze
     phase_history:
       - ... existing entries
       - { phase: validated, date: {today}, by: checklist }
     ```

5. **Report completion**
   - Show checklist path and item count
   - Suggest `analyze` workflow

## Output

- `domains/{domain}/01_PROJECTS/FEAT_NNN_name/checklist.md`
- Status: `validated`
- Next: `analyze`
