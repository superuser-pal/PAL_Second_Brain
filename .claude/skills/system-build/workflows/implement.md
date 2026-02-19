# Implement Workflow

Execute tasks from tasks.md, tracking progress in real-time.

## Prerequisites

- tasks.md exists in feature folder
- spec.md status is `tasked` or `validated` or `analyzed`

## Steps

1. **Load context**
   - Read `domains/{domain}/01_PROJECTS/FEAT_NNN_name/tasks.md`
   - Read `domains/{domain}/01_PROJECTS/FEAT_NNN_name/plan.md`
   - Optional: `data-model.md`, `contracts/`, `checklist.md`

2. **Check checklists** (if checklist.md exists)
   - Count completed `[X]` vs incomplete `[ ]` items
   - If incomplete items exist → ask user to proceed or complete first
   - If all complete → proceed automatically

3. **Execute tasks phase-by-phase**
   - Setup → Foundational → User Stories → Polish
   - Respect dependencies: sequential tasks in order
   - Parallel tasks `[P]` can run together
   - Mark completed tasks as `[X]` in tasks.md

4. **Update status during execution**
   - On start: Set status to `implementing`
   - Report progress after each task
   - Halt on non-parallel task failure
   - Continue parallel tasks independently, report failures

5. **On completion**
   - Verify all tasks marked `[X]`
   - Update spec.md frontmatter:
     ```yaml
     status: implemented
     next_step: document
     phase_history:
       - ... existing entries
       - { phase: implemented, date: {today}, by: implement }
     ```

6. **Report completion**
   - Show tasks completed, any skipped/failed
   - Suggest `document` workflow

## Guidelines

- Execute TDD if tests exist: tests before implementation
- Provide clear error messages with context
- If tasks incomplete, suggest running `tasks` workflow first

## Output

- tasks.md with completed tasks marked `[X]`
- Status: `implementing` → `implemented`
- Next: `document`
