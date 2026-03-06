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

3. **Determine destination repository**
   - Ask user: "Is this feature for your personal system or the open-source framework?"
     1. **Personal** - Stays in main repo (default)
     2. **Open Source** - Goes to `Domains/PALOpenSource/` submodule
   - Based on answer, set base path:
     - **Personal:** `Domains/{domain}/01_PROJECTS/`
     - **Open Source:** `Domains/PALOpenSource/Domains/PALBuilder/01_PROJECTS/`
   - Record routing decision for spec.md frontmatter

4. **Create feature folder**
   - Create `{base_path}/FEAT_NNN_short-name/`

5. **Generate specification**
   - Reference `templates/feature_template.md` for structure
   - Extract from description: actors, actions, data, constraints
   - Fill **ONLY the ## Specification section**:
     - Overview
     - User Stories & Acceptance Criteria (Given-When-Then format)
     - Edge Cases
     - Requirements (Functional Requirements + Key Entities)
     - Success Criteria (measurable, technology-agnostic)
   - Leave other sections (Implementation Plan, Tasks, Testing Instructions, etc.) as placeholders from template
   - Mark unclear aspects with `[NEEDS CLARIFICATION: question]` (max 3)

6. **Write FEATURE.md**
   - Write to `{base_path}/FEAT_NNN_short-name/FEATURE.md`
   - Include YAML frontmatter with status tracking:
     ```yaml
     feature: FEAT_NNN_short-name
     branch: NNN-short-name
     created: {today}
     status: specified
     routing: personal | open-source
     target_path: {resolved_path}
     current_phase: specification
     phase_history:
       - { phase: specification, date: {today}, by: specify }
     input: "{feature_description}"
     ```

7. **Report completion**
   - Show feature ID, spec path, and next step
   - If NEEDS CLARIFICATION markers exist → suggest `clarify` workflow
   - Otherwise → suggest `plan` workflow

## Guidelines

- Focus on WHAT and WHY, not HOW
- Write for business stakeholders, not developers
- Success criteria must be measurable and technology-agnostic
- Remove sections that don't apply (don't leave as "N/A")

## Output

- `{base_path}/FEAT_NNN_short-name/FEATURE.md`
  - Personal: `Domains/{domain}/01_PROJECTS/FEAT_NNN_short-name/FEATURE.md`
  - Open Source: `Domains/PALOpenSource/Domains/PALBuilder/01_PROJECTS/FEAT_NNN_short-name/FEATURE.md`
- Status: `specified`
- Current Phase: `specification`
- Routing: `personal` or `open-source` (recorded in frontmatter)
- Next: `clarify` (if ambiguities) or `plan`

## Format Detection Note

- New format (v2): `FEATURE.md` in feature folder
- Old format (v1): `spec.md`, `plan.md`, `tasks.md`, `checklist.md` in feature folder
- Both formats coexist - workflows detect and handle appropriately
