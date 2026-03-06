# Clarify Workflow

Resolve ambiguities in feature specification through targeted clarification questions and tie additions to existing requirements.

## Prerequisites

- Feature file exists (FEATURE.md or spec.md)
- Status allows clarification (`draft` or `specified`)

## Steps

1. **Load context**
   - Detect format: Check for `FEATURE.md` (v2) or `spec.md` (v1)
   - Read from detected file:
     - v2: Read `domains/{domain}/01_PROJECTS/FEAT_NNN_name/FEATURE.md`
     - v1: Read `domains/{domain}/01_PROJECTS/FEAT_NNN_name/spec.md`

2. **Scan for ambiguities**
   - Categories: Scope, Data Model, UX Flow, Non-Functional, Integrations, Edge Cases
   - Mark each category: Clear / Partial / Missing

3. **Generate questions** (max 5)
   - Only ask if answer materially impacts architecture, tasks, or testing
   - Each question: multiple-choice (2-5 options) or short answer (≤5 words)
   - Provide recommended answer with reasoning

4. **Interactive questioning**
   - Present ONE question at a time
   - After user answers → record and proceed
   - Stop when: all resolved, user says "done", or 5 questions asked

5. **Update feature file**
   - v2 format (FEATURE.md):
     - Add clarifications to `## Specification` section
     - Create `### Clarifications` subsection with `#### Session YYYY-MM-DD`
     - Record: `- Q: [question] → A: [answer]`
     - Apply clarifications to relevant specification sections
     - Update frontmatter:
       ```yaml
       status: clarified
       current_phase: specification
       phase_history:
         - ... existing entries
         - { phase: clarified, date: {today}, by: clarify }
       ```
   - v1 format (spec.md):
     - Add `## Clarifications` section with `### Session YYYY-MM-DD`
     - Record questions and answers
     - Apply to relevant sections
     - Update frontmatter as above

6. **Report completion**
   - Questions asked/answered, sections updated
   - Suggest `plan` workflow

## Output

- Updated feature file (FEATURE.md or spec.md) with clarifications
- Status: `clarified` (or stays `specified`)
- Current Phase: `specification`
- Next: `plan`

## Purpose

This workflow helps:
- Understand user intent behind feature requests
- Tie new additions to existing requirements in the system
- Resolve ambiguities that would impact architecture or implementation
- Ensure feature aligns with PAL's existing patterns and conventions
