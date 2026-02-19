# document_skill Workflow

Generate requirements documentation from a skill's structure and workflows.

## Prerequisites

- Skill folder exists at `.claude/skills/[skill-name]/`
- SKILL.md exists with valid YAML frontmatter
- At least one workflow in `workflows/` subfolder

## Steps

1. **Parse input**
   - Extract skill name from user input
   - If not provided: prompt for skill name
   - Validate skill exists at `.claude/skills/[skill-name]/`
   - If not found: ERROR "Skill not found at [path]. Run `ls .claude/skills/` to see available skills."

2. **Load skill context**
   - Read `.claude/skills/[skill-name]/SKILL.md`
   - Extract YAML frontmatter: `name`, `description`
   - Extract `USE WHEN` triggers from description field
   - Parse Workflow Routing table (if exists)
   - Parse Authoritative Sources section (if exists)

3. **Load workflow files**
   - List all `.md` files in `.claude/skills/[skill-name]/workflows/`
   - For each workflow file, extract:
     - Workflow name (from filename and H1 heading)
     - Trigger phrases (from Workflow Routing table in SKILL.md)
     - Prerequisites section
     - Steps section (numbered steps)
     - Output section
     - Error Handling section (if exists)

4. **Determine section ID**
   - Read `Domains/PALBuilder/03_REQUIREMENTS/01_SKILLS.md`
   - Find highest existing section number (e.g., `## 1.6 Skill:`)
   - Next section number = highest + 1 (e.g., 1.7)
   - Section ID format: `1.[N]` where N is the next available number

5. **Generate skill section header**
   - Format:
     ```markdown
     ## 1.[N] Skill: [skill-name]

     **What It Does:** [First sentence from description, without USE WHEN clause]

     **Activates When:** [USE WHEN triggers as quoted list]

     **Source:** [skill-name SKILL.md](.claude/skills/[skill-name]/SKILL.md)

     ---
     ```

6. **Extract requirements from SKILL.md**
   - **Workflow activation requirements:**
     - For each row in Workflow Routing table, create:
       ```markdown
       ### 1.[N].[M] [Workflow Name] Activates on Trigger

       **Given** the [skill-name] skill is active
       **When** user mentions "[trigger phrases]"
       **Then** the [workflow-name] workflow executes

       Category: Functional
       Verification: Say "[example trigger]" and confirm [workflow-name] workflow activates
       Source: [skill-name SKILL.md](.claude/skills/[skill-name]/SKILL.md)
       ```
   - **Authoritative source requirements (if section exists):**
     - For each authoritative source, create:
       ```markdown
       ### 1.[N].[M] Reference [Source Name] for [Purpose]

       **Given** a workflow in [skill-name] runs
       **When** [data type] information is needed
       **Then** the workflow consults [source path]

       Category: Validation
       Verification: Run workflow and confirm [source] is referenced
       Source: [skill-name SKILL.md](.claude/skills/[skill-name]/SKILL.md)
       ```

7. **Extract requirements from workflows**
   - For each workflow file:
     - **Prerequisite requirements (select most important):**
       ```markdown
       ### 1.[N].[M] Verify [Prerequisite] Before [Workflow]

       **Given** user invokes [workflow-name]
       **When** prerequisites are checked
       **Then** [prerequisite condition] must be true

       **If [prerequisite] is missing:**
       **Then** workflow stops with clear error message

       Category: Validation
       Verification: Attempt [workflow] without [prerequisite] and confirm error
       Source: [workflow_name.md](.claude/skills/[skill-name]/workflows/[workflow_name].md)
       ```
     - **Functional requirements (major steps only):**
       ```markdown
       ### 1.[N].[M] [Step Description]

       **Given** [context from previous steps or prerequisites]
       **When** [workflow-name] executes [step description]
       **Then** [outcome or output]

       Category: Functional
       Verification: Run [workflow] and confirm [outcome]
       Source: [workflow_name.md](.claude/skills/[skill-name]/workflows/[workflow_name].md)
       ```
     - **Output requirements:**
       ```markdown
       ### 1.[N].[M] [Workflow] Produces [Output]

       **Given** [workflow-name] completes successfully
       **When** outputs are examined
       **Then** [output artifact] exists at [location]

       Category: Functional
       Verification: Run [workflow] and confirm [output] exists
       Source: [workflow_name.md](.claude/skills/[skill-name]/workflows/[workflow_name].md)
       ```

8. **Assemble requirements section**
   - Combine all generated requirements
   - Number requirements sequentially within section: 1.[N].1, 1.[N].2, ...
   - Ensure horizontal rules (`---`) separate requirements

9. **Update 01_SKILLS.md**
   - Find insertion point (after last skill section, before any closing content)
   - Insert new section with all requirements
   - Add horizontal rule after last requirement

10. **Update README.md summary**
    - Read `Domains/PALBuilder/03_REQUIREMENTS/README.md`
    - Update "Skills (1.X.Y)" section mapping to include new skill
    - Update Requirements Summary table:
      - Increment Skills sections count
      - Increment Skills requirements count
      - Recalculate Total

11. **Report completion**
    - Show:
      - Skill documented: [skill-name]
      - Section ID: 1.[N]
      - Requirements generated: [count]
      - Target document: `03_REQUIREMENTS/01_SKILLS.md`
    - Suggest next steps: "Document another skill" or "Review generated requirements"

## Guidelines

- **Selectivity over completeness:** Not every workflow step becomes a requirement. Focus on:
  - Steps that produce verifiable outputs
  - Steps that make decisions or branch
  - Steps that validate inputs
  - Steps that interact with external files
- **Avoid duplication:** If a behavior is already covered in 1.0 Skill Architecture Requirements, do not duplicate it
- **Quality over quantity:** 3-7 requirements per workflow is typical. Very simple workflows may have 1-2.
- **Verification must be concrete:** "Run workflow X" is not enough. Specify what to observe.
- **Source links are critical:** Every requirement must trace back to its implementation file.
- **Respect exclusions:** Check README.md "Excluded from Documentation" section before documenting.

## Output

- New section added to `Domains/PALBuilder/03_REQUIREMENTS/01_SKILLS.md`
- README.md summary table updated
- No status tracking (skills don't follow spec.md lifecycle)

## Error Handling

| Error | Resolution |
|-------|------------|
| Skill not found | "Skill directory not found at [path]. Run `ls .claude/skills/` to see available skills." |
| No workflows found | "No workflows found in [skill]/workflows/. Ensure workflows exist before documenting." |
| SKILL.md missing | "SKILL.md not found. This is required for documentation. See create-skill for structure." |
| Skill already documented | "Section 1.[N] for [skill-name] already exists in 01_SKILLS.md. Update existing section or choose a different skill." |
| Skill in exclusion list | "Skill [name] is in the excluded list in README.md. Remove from exclusions first if documentation is needed." |
