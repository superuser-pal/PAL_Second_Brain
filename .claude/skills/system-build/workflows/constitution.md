# Constitution Workflow

Update the project constitution that governs all features.

## Prerequisites

- Domain context available

## Steps

1. **Locate constitution**
   - Primary: `domains/{domain}/00_CONTEXT/constitution.md`
   - If not found: Create from principles provided by user

2. **Collect updates**
   - If user provides principle updates → apply them
   - Otherwise → infer from repo context (README, docs)
   - Update version: MAJOR (breaking), MINOR (new principle), PATCH (clarification)

3. **Draft updated constitution**
   - Replace placeholders with concrete text
   - Preserve heading hierarchy
   - Ensure principles are declarative and testable
   - Update dates: `LAST_AMENDED_DATE` = today

4. **Validate**
   - No unexplained placeholders remaining
   - Dates in ISO format (YYYY-MM-DD)
   - Principles free of vague language

5. **Write constitution**
   - Write to `domains/{domain}/00_CONTEXT/constitution.md`

6. **Report completion**
   - Version change (old → new)
   - Modified/added/removed principles
   - Suggested commit message

## Guidelines

- Constitution principles are non-negotiable within project scope
- Keep principles declarative and testable
- Use semantic versioning for changes

## Output

- Updated `domains/{domain}/00_CONTEXT/constitution.md`
