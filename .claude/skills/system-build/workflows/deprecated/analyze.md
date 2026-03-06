# Analyze Workflow

Cross-artifact consistency and quality analysis (read-only).

## Prerequisites

- spec.md, plan.md, and tasks.md exist in feature folder
- spec.md status is `validated`

## Steps

1. **Load artifacts**
   - Read `domains/{domain}/01_PROJECTS/FEAT_NNN_name/spec.md`
   - Read `domains/{domain}/01_PROJECTS/FEAT_NNN_name/plan.md`
   - Read `domains/{domain}/01_PROJECTS/FEAT_NNN_name/tasks.md`
   - Read `domains/{domain}/00_CONTEXT/constitution.md` (if exists)

2. **Detection passes** (max 50 findings)
   - **Duplication**: Near-duplicate requirements
   - **Ambiguity**: Vague terms (fast, scalable) without measurable criteria
   - **Underspecification**: Requirements missing outcomes, tasks missing file paths
   - **Constitution alignment**: Conflicts with MUST principles
   - **Coverage gaps**: Requirements without tasks, tasks without requirements
   - **Inconsistency**: Terminology drift, conflicting requirements

3. **Assign severity**
   - CRITICAL: Constitution violation, zero coverage on core requirement
   - HIGH: Duplicate/conflicting requirements, ambiguous security/performance
   - MEDIUM: Terminology drift, missing non-functional coverage
   - LOW: Style improvements, minor redundancy

4. **Generate report** (no file writes)
   ```markdown
   ## Specification Analysis Report
   | ID | Category | Severity | Location | Summary | Recommendation |

   **Coverage Summary:** Requirements covered: X/Y (Z%)
   **Critical Issues:** N (must resolve before implement)
   ```

5. **Update status** (if no CRITICAL issues)
   - Update spec.md frontmatter:
     ```yaml
     status: analyzed
     next_step: implement
     phase_history:
       - ... existing entries
       - { phase: analyzed, date: {today}, by: analyze }
     ```

6. **Report completion**
   - If CRITICAL: "Resolve issues before proceeding"
   - If clear: Suggest `implement` workflow

## Output

- Analysis report (displayed, not written)
- Status: `analyzed` (if no critical issues)
- Next: `implement`
