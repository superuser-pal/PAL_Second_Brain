# Pull Tasks Workflow

**Purpose:** Scan all projects across all domains and aggregate open/in-progress tasks into a master task list.

## Prerequisites

- At least one domain with projects in `01_PROJECTS/`
- `/tasks/` directory exists at project root

## Workflow Steps

### Step 1: Scan All Domains

Find all domains in `/domains/` directory:

```
Scanning domains...
Found: example-domain, client-project, internal-tools
```

### Step 2: Discover Project Files

For each domain, scan `01_PROJECTS/` for files matching `PROJECT_*.md`:

```
Scanning projects...
  example-domain: 2 projects
  client-project: 3 projects
  internal-tools: 1 project
Total: 6 projects
```

### Step 3: Parse Project Tasks

For each project file:

1. Read YAML frontmatter (name, status, priority, domain)
2. Parse task sections (`### Open`, `### In Progress`, `### Done`)
3. Extract tasks with their status tags (`#open`, `#in-progress`, `#done`)
4. Filter to only `#open` and `#in-progress` tasks

**Task Parsing Rules:**
- Line starts with `- [ ]` or `- [x]`
- Status determined by tag: `#open`, `#in-progress`, `#done`
- Preserve full task text (minus the tag for display)

### Step 4: Generate MASTER.md

Create `/tasks/MASTER.md` with aggregated tasks:

```markdown
---
last_pulled: 2026-02-11 14:30
domains_scanned:
  - example-domain
  - client-project
  - internal-tools
total_projects: 6
total_tasks: 16
open_tasks: 12
in_progress_tasks: 4
---

# Task Master List

> Last synchronized: 2026-02-11 14:30
> Run `update plan` to push changes back to projects

---

## example-domain

### PROJECT_API_INTEGRATION
> Source: domains/example-domain/01_PROJECTS/PROJECT_API_INTEGRATION.md
> Priority: high | Status: in-progress

#### Open
- [ ] Research API documentation `#open`
- [ ] Create authentication flow `#open`

#### In Progress
- [ ] Implement payment endpoints `#in-progress`

---

### PROJECT_SECURITY_AUDIT
> Source: domains/example-domain/01_PROJECTS/PROJECT_SECURITY_AUDIT.md
> Priority: medium | Status: planning

#### Open
- [ ] Review access controls `#open`
- [ ] Audit logging configuration `#open`

---

## client-project

### PROJECT_WEBSITE_REDESIGN
> Source: domains/client-project/01_PROJECTS/PROJECT_WEBSITE_REDESIGN.md
> Priority: high | Status: in-progress

#### Open
- [ ] Finalize color palette `#open`

#### In Progress
- [ ] Build responsive navigation `#in-progress`
- [ ] Implement hero section `#in-progress`

---
```

### Step 5: Handle Empty Results

If no open tasks found:

```markdown
---
last_pulled: 2026-02-11 14:30
domains_scanned: [example-domain]
total_projects: 2
total_tasks: 0
---

# Task Master List

No open or in-progress tasks found across all projects.

All projects are either:
- In planning stage with no tasks defined
- Completed with all tasks done
```

### Step 6: Report Summary

```
Tasks pulled successfully!

Scan Summary:
  Domains scanned: 3
  Projects found: 6

Task Breakdown:
  Open tasks: 12
  In-progress tasks: 4
  Total active: 16

Output: /tasks/MASTER.md

To push changes back to projects, run: update plan
```

## Task Source Reference Format

Each project section includes a source reference for bidirectional sync:

```markdown
> Source: domains/[domain]/01_PROJECTS/[PROJECT].md
```

This reference is used by `update_plan` workflow to locate the original file.

## Error Handling

| Error | Resolution |
|-------|------------|
| No domains found | Report "No domains exist" |
| Domain has no 01_PROJECTS/ | Skip domain, note in summary |
| Project has no task sections | Skip project, note in summary |
| /tasks/ doesn't exist | Create the directory |
| Parse error in project | Log warning, continue with other projects |

## Output

- `/tasks/MASTER.md` - Aggregated task list with source references
- Summary report with scan statistics
