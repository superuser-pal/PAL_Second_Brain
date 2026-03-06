# Tasks Workflow

Break implementation plan into actionable, dependency-ordered tasks.

## Prerequisites

- Feature file with spec and plan exists
- Status is `planned`

## Steps

1. **Load context**
   - Detect format: Check for `FEATURE.md` (v2) or `spec.md`/`plan.md` (v1)
   - v2: Read `FEATURE.md` (## Specification and ## Implementation Plan sections)
   - v1: Read `spec.md` (user stories), `plan.md` (tech stack, phases)
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

4. **Write tasks section**
   - v2: Append `## Tasks` section to FEATURE.md
   - v1: Write to `tasks.md` file
   - Include dependency graph and parallel opportunities
   - Each task must be specific enough to execute without additional context
   - Update frontmatter:
     ```yaml
     status: tasked
     current_phase: tasked
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

- v2: `## Tasks` section in FEATURE.md
- v1: `tasks.md` file
- Status: `tasked`
- Current Phase: `tasked`
- Next: `implement`
