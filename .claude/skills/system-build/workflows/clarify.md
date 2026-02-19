# Clarify Workflow

Resolve ambiguities in spec.md through targeted clarification questions.

## Prerequisites

- spec.md exists in feature folder
- spec.md status is `draft`

## Steps

1. **Load context**
   - Read `domains/{domain}/01_PROJECTS/FEAT_NNN_name/spec.md`

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

5. **Update spec.md**
   - Add `## Clarifications` section with `### Session YYYY-MM-DD`
   - Record: `- Q: [question] → A: [answer]`
   - Apply clarifications to relevant spec sections
   - Update frontmatter:
     ```yaml
     status: specified
     next_step: plan
     phase_history:
       - ... existing entries
       - { phase: specified, date: {today}, by: clarify }
     ```

6. **Report completion**
   - Questions asked/answered, sections updated
   - Suggest `plan` workflow

## Output

- Updated spec.md with clarifications
- Status: `specified`
- Next: `plan`
