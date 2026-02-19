# Document Workflow

Generate requirements documentation from implemented feature.

## Prerequisites

- spec.md exists with status `implemented`
- Feature implementation is complete

## Steps

1. **Load context**
   - Read `domains/{domain}/01_PROJECTS/FEAT_NNN_name/spec.md`
   - Read `domains/{domain}/01_PROJECTS/FEAT_NNN_name/plan.md`
   - Read `domains/{domain}/01_PROJECTS/FEAT_NNN_name/tasks.md`
   - Read `domains/{domain}/03_REQUIREMENTS/README.md` for ID format

2. **Determine target document**
   - Skill feature → `01_SKILLS.md`
   - Agent feature → `02_AGENTS.md`
   - Core system feature → `00_CORE_SYSTEM.md`

3. **Extract requirements from spec**
   - Convert user stories to Given-When-Then format
   - Assign requirement IDs per README.md numbering scheme
   - Add Category, Verification, and Source fields

4. **Generate requirements section**
   - Section header with "What It Does" and "Activates When"
   - Requirements in Given-When-Then format
   - Link Source to implementation files

5. **Update target document**
   - Add new section at appropriate position
   - Update document's requirements count
   - Update README.md summary table

6. **Update status**
   - Update spec.md frontmatter:
     ```yaml
     status: documented
     next_step: export or archive
     phase_history:
       - ... existing entries
       - { phase: documented, date: {today}, by: document }
     ```

7. **Report completion**
   - Show requirements generated
   - Show target document updated
   - Suggest `tasks_to_issues` or archive

## Output

- Requirements added to `03_REQUIREMENTS/{target}.md`
- README.md summary updated
- Status: `implemented` → `documented`
- Next: `export or archive`
