# Specify Workflow

Create a feature specification from a natural language description.

## Prerequisites

- User provides feature description
- Domain context available (via agent binding or `--domain` flag)

## Steps

1. **Parse input**
   - Extract feature description from user input
   - If empty: ERROR "No feature description provided"

2. **Generate feature identifiers**
   - Create short-name: 2-4 words, kebab-case (e.g., "user-auth", "api-refactor")
   - Scan `domains/{domain}/01_PROJECTS/` for existing FEAT_NNN folders
   - Calculate next number: highest NNN + 1 (or 001 if none exist)
   - Feature ID: `FEAT_{NNN}_{short-name}`

3. **Create feature folder**
   - Create `domains/{domain}/01_PROJECTS/FEAT_NNN_short-name/`

4. **Generate specification**
   - Reference `templates/spec_template.md` for structure
   - Extract from description: actors, actions, data, constraints
   - Fill User Scenarios with Given-When-Then acceptance criteria
   - Generate Functional Requirements (testable, FR-001 format)
   - Define Success Criteria (measurable, technology-agnostic)
   - Mark unclear aspects with `[NEEDS CLARIFICATION: question]` (max 3)

5. **Write spec.md**
   - Write to `domains/{domain}/01_PROJECTS/FEAT_NNN_short-name/spec.md`
   - Include YAML frontmatter with status tracking:
     ```yaml
     feature: FEAT_NNN_short-name
     branch: NNN-short-name
     created: {today}
     status: draft
     next_step: clarify
     phase_history:
       - { phase: draft, date: {today}, by: specify }
     ```

6. **Report completion**
   - Show feature ID, spec path, and next step
   - If NEEDS CLARIFICATION markers exist → suggest `clarify` workflow
   - Otherwise → suggest `plan` workflow

## Guidelines

- Focus on WHAT and WHY, not HOW
- Write for business stakeholders, not developers
- Success criteria must be measurable and technology-agnostic
- Remove sections that don't apply (don't leave as "N/A")

## Output

- `domains/{domain}/01_PROJECTS/FEAT_NNN_short-name/spec.md`
- Status: `draft`
- Next: `clarify` (if ambiguities) or `plan`
