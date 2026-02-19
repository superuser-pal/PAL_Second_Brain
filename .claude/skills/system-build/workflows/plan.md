# Plan Workflow

Generate an implementation plan from a feature specification.

## Prerequisites

- spec.md exists in feature folder
- spec.md status is `draft` or `specified`

## Steps

1. **Load context**
   - Read `domains/{domain}/01_PROJECTS/FEAT_NNN_name/spec.md`
   - Read `domains/{domain}/00_CONTEXT/constitution.md` (if exists)
   - Reference `templates/plan_template.md` for structure

2. **Generate implementation plan**
   - Extract technical context from spec requirements
   - Mark unknowns as `[NEEDS RESEARCH: topic]`
   - Check constitution compliance (document any justified deviations)
   - Define implementation phases with clear milestones
   - Identify dependencies and integration points

3. **Research unknowns** (if any)
   - For each NEEDS RESEARCH → investigate and document decision
   - Format: Decision → Rationale → Alternatives considered

4. **Design artifacts** (if applicable)
   - `data-model.md` - Entities, fields, relationships
   - `contracts/` - API schemas (OpenAPI/GraphQL)

5. **Write plan.md**
   - Write to `domains/{domain}/01_PROJECTS/FEAT_NNN_name/plan.md`
   - Update spec.md frontmatter:
     ```yaml
     status: planned
     next_step: tasks
     phase_history:
       - ... existing entries
       - { phase: planned, date: {today}, by: plan }
     ```

6. **Report completion**
   - Show plan path and artifacts created
   - Suggest `tasks` workflow as next step

## Guidelines

- Verify all spec requirements have implementation approach
- Flag constitution violations early
- Keep phases small and testable

## Output

- `domains/{domain}/01_PROJECTS/FEAT_NNN_name/plan.md`
- Optional: `data-model.md`, `contracts/`
- Status: `planned`
- Next: `tasks`
