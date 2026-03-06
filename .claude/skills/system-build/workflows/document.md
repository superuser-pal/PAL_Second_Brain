# Document Workflow

Generate requirements documentation from implemented and tested feature.

## Prerequisites

- Feature file exists (FEATURE.md or spec.md) with status `tested`
- Feature has passed User Acceptance Testing (UAT)
- Feature implementation is complete

## Steps

1. **Pre-condition check**
   - Detect format: Check for `FEATURE.md` (v2) or `spec.md` (v1)
   - Read frontmatter from detected file
   - Verify status is `tested`
   - If status is `implemented` → ERROR: "Feature must pass UAT before documentation. Run testing instructions from ## Testing Instructions section and update status to 'tested' when tests pass."
   - If status is not `tested` or `implemented` → ERROR: "Feature must be implemented and tested before documentation."

2. **Load context**
   - v2 format (FEATURE.md):
     - Read `domains/{domain}/01_PROJECTS/FEAT_NNN_name/FEATURE.md`
     - Extract from sections: ## Specification, ## Implementation Plan, ## Tasks
   - v1 format (4-file):
     - Read `domains/{domain}/01_PROJECTS/FEAT_NNN_name/spec.md`
     - Read `domains/{domain}/01_PROJECTS/FEAT_NNN_name/plan.md`
     - Read `domains/{domain}/01_PROJECTS/FEAT_NNN_name/tasks.md`
   - Read `domains/{domain}/03_REQUIREMENTS/README.md` for ID format

3. **Determine target document**
   - Skill feature → `01_SKILLS.md`
   - Agent feature → `02_AGENTS.md`
   - Core system feature → `00_CORE_SYSTEM.md`

4. **Extract requirements from spec**
   - Convert user stories to Given-When-Then format
   - Assign requirement IDs per README.md numbering scheme
   - Add Category, Verification, and Source fields

5. **Generate requirements section**
   - Section header with "What It Does" and "Activates When"
   - Requirements in Given-When-Then format
   - Link Source to implementation files

6. **Update target document**
   - Add new section at appropriate position
   - Update document's requirements count
   - Update README.md summary table

7. **Update completion summary**
   - v2 format (FEATURE.md):
     - Populate `## Completion Summary` section:
       - `### Requirements Generated` - Links to requirements docs
       - `### Lessons Learned` - Extract from Implementation Notes
     - Update frontmatter:
       ```yaml
       status: documented
       current_phase: completed
       phase_history:
         - ... existing entries
         - { phase: documented, date: {today}, by: document }
       ```
   - v1 format (spec.md):
     - Update spec.md frontmatter as above

8. **Report completion**
   - Show requirements generated
   - Show target document updated
   - Show completion summary location (v2 only)
   - Suggest `tasks_to_issues` or archive

## Output

- Requirements added to `03_REQUIREMENTS/{target}.md`
- README.md summary updated
- Completion summary populated (v2 format only)
- Status: `tested` → `documented`
- Current Phase: `completed`
- Next: `export or archive`

## Format Detection Note

- New format (v2): `FEATURE.md` in feature folder (single file)
- Old format (v1): `spec.md`, `plan.md`, `tasks.md` in feature folder (4-file)
- Both formats coexist - workflow detects and handles appropriately
- **CRITICAL**: v2 format requires UAT to pass (status: `tested`) before documentation
