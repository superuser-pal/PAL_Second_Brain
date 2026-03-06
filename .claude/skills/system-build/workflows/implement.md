# Implement Workflow

Execute tasks from tasks.md, tracking progress in real-time.

## Prerequisites

- Feature file with tasks exists
- Status is `tasked`

## Steps

1. **Load context**
   - Detect format: Check for `FEATURE.md` (v2) or `tasks.md` (v1)
   - v2: Read FEATURE.md (## Tasks, ## Specification sections)
   - v1: Read `tasks.md`, `plan.md`, `spec.md`
   - Optional: `data-model.md`, `contracts/`

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

5. **On completion - Generate UAT**
   - Verify all tasks marked `[X]`
   - v2: Populate `## Testing Instructions` section:
     - Generate step-by-step testing guide from user stories
     - Extract acceptance criteria from ## Specification into checklist
     - Add to `## Implementation Notes` section
   - v1: (Skip UAT generation for old format)
   - Update frontmatter:
     ```yaml
     status: implemented
     current_phase: testing
     phase_history:
       - ... existing entries
       - { phase: implemented, date: {today}, by: implement }
     ```

6. **UAT Prompt (v2 only)**
   - Present testing instructions to user
   - **STOP and WAIT for user feedback**:
     - **PASS**: User confirms tests pass → Update status to `tested`, proceed to document
     - **FAIL**: Capture feedback in `## Implementation Notes > Testing Feedback`, create new tasks, loop back to step 3

7. **Report completion**
   - Show tasks completed
   - v2: Present testing instructions, await user testing
   - v1: Suggest `document` workflow

## Guidelines

- Execute TDD if tests exist: tests before implementation
- Provide clear error messages with context
- v2: Always generate UAT after implementation
- v2: Do NOT proceed to document until user confirms tests pass

## Output

- v2: Tasks marked `[X]` in FEATURE.md, ## Testing Instructions populated
- v1: tasks.md with completed tasks marked `[X]`
- Status: `implemented` (awaiting UAT for v2)
- Next: User testing (v2) or `document` (v1)
