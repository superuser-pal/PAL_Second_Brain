# Tasks Workflow

Break implementation plan into actionable, dependency-ordered tasks.

## Prerequisites

- spec.md and plan.md exist in feature folder
- spec.md status is `planned`

## Steps

1. **Load context**
   - Read `domains/{domain}/01_PROJECTS/FEAT_NNN_name/spec.md` (user stories, priorities)
   - Read `domains/{domain}/01_PROJECTS/FEAT_NNN_name/plan.md` (tech stack, phases)
   - Optional: `data-model.md`, `contracts/`, `research.md`

2. **Generate tasks by phase**
   - Phase 1: Setup (project initialization)
   - Phase 2: Foundational (blocking prerequisites)
   - Phase 3+: User Stories in priority order (P1 → P2 → P3)
   - Final: Polish & cross-cutting concerns

3. **Task format**
   ```
   - [ ] T001 [P] [US1] Description with file path
   ```
   - `T001` = sequential ID
   - `[P]` = parallelizable (optional)
   - `[US1]` = user story label (required for story phases)

4. **Write tasks.md**
   - Write to `domains/{domain}/01_PROJECTS/FEAT_NNN_name/tasks.md`
   - Include dependency graph and parallel opportunities
   - Each task must be specific enough to execute without additional context
   - Update spec.md frontmatter:
     ```yaml
     status: tasked
     next_step: checklist
     phase_history:
       - ... existing entries
       - { phase: tasked, date: {today}, by: tasks }
     ```

5. **Report completion**
   - Show total task count, tasks per story
   - Suggest `checklist` or `analyze` workflow

## Guidelines

- Organize by user story for independent implementation
- Each story phase should be independently testable
- Tests optional unless explicitly requested

## Output

- `domains/{domain}/01_PROJECTS/FEAT_NNN_name/tasks.md`
- Status: `tasked`
- Next: `checklist`
