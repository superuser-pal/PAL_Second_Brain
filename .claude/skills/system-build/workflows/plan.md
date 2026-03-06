# Plan Workflow

Generate an implementation plan from a feature specification.

## Prerequisites

- Feature file exists (FEATURE.md or spec.md)
- Status is `specified` or `clarified`

## Steps

1. **Load context**
   - Detect format: Check for `FEATURE.md` (v2) or `spec.md` (v1)
   - v2: Read `domains/{domain}/01_PROJECTS/FEAT_NNN_name/FEATURE.md` (## Specification section)
   - v1: Read `domains/{domain}/01_PROJECTS/FEAT_NNN_name/spec.md`
   - Read `domains/{domain}/00_CONTEXT/constitution.md` (if exists)
   - Reference `templates/feature_template.md` for structure

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

5. **Write plan section**
   - v2: Append `## Implementation Plan` section to FEATURE.md
   - v1: Write to `domains/{domain}/01_PROJECTS/FEAT_NNN_name/plan.md`
   - Update frontmatter:
     ```yaml
     status: planned
     current_phase: planning
     phase_history:
       - ... existing entries
       - { phase: planning, date: {today}, by: plan }
     ```

6. **Report completion**
   - Show plan path and artifacts created
   - Suggest `tasks` workflow as next step

## Guidelines

- Verify all spec requirements have implementation approach
- Flag constitution violations early
- Keep phases small and testable

## Output

- v2: `## Implementation Plan` section in FEATURE.md
- v1: `plan.md` file
- Optional: `data-model.md`, `contracts/`
- Status: `planned`
- Current Phase: `planning`
- Next: `tasks`
