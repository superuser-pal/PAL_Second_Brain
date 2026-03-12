# Pull Tasks Workflow

**Purpose:** Scan all projects across all domains and aggregate open/in-progress tasks into a master task list.

## Prerequisites

- At least one domain with projects in `01_PROJECTS/`
- `Inbox/Tasks/` directory exists at project root

## Workflow Steps

### Step 1: Scan All Domains and Inbox

Find all domains in `/domains/` directory. Also include Inbox as a source:

```
Scanning domains...
Found: example-domain, client-project, internal-tools, Inbox
```

### Step 2: Discover Project and Inbox Files

For each domain, scan `01_PROJECTS/` for files matching `*_PROJECT.md`.
Additionally, scan `Inbox/Notes/` and `Inbox/Daily/` for markdown files containing tasks or `[action]` items:

```
Scanning projects and notes...
  example-domain: 2 projects
  client-project: 3 projects
  internal-tools: 1 project
  Inbox: 5 notes
Total: 6 projects, 5 notes
```

### Step 3: Parse Project Tasks

For each project file and Inbox note:

1. Read YAML frontmatter (name, status, priority, domain if applicable)
2. For project files, parse task sections (`### Active`, `### Inactive`, `### Done`)
3. For Inbox files, scan for explicit `[action]` observations or checklist items `- [ ]`
4. Extract tasks by reading checkbox symbols: `[ ]`, `[/]`, `[!]`, `[?]`, `[I]`, `[-]`, `[x]`
5. Separate into active (todo, in-progress) and inactive (blocked, paused, backlog, not-doing) groups

**Task Parsing Rules:**

- Line starts with `- [ ]`, `- [x]`, or `- [action]`
- Status determined by tag (`#open`, `#in-progress`, `#done`), or checkbox symbol
- Preserve full task text (minus the tag for display)

### Step 4: Generate MASTER.md

Create `Inbox/Tasks/MASTER.md` with aggregated tasks:

```markdown
---
last_pulled: 2026-02-11 14:30
domains_scanned:
  - example-domain
  - client-project
  - internal-tools
total_projects: 6
total_tasks: 17
active_tasks: 12
inactive_tasks: 5
---

# Task Master List

> Last synchronized: 2026-02-11 14:30
> Run `update plan` to push changes back to projects

**Checkbox Symbol Reference:**
- `[ ]` To Do  |  `[/]` In Progress  |  `[!]` Blocked  |  `[?]` Paused  |  `[I]` Backlog  |  `[-]` Not Doing  |  `[x]` Done

---

## example-domain

### API_INTEGRATION_PROJECT

> Source: domains/example-domain/01_PROJECTS/API_INTEGRATION_PROJECT.md
> Priority: high | Status: in-progress

#### Active (3 tasks)
- [ ] Research API documentation
- [ ] Create authentication flow
- [/] Implement payment endpoints

#### Inactive (3 tasks)
- [!] Deploy to production (waiting for security review)
- [?] Add rate limiting (paused until Q2)
- [I] Add webhook handlers

---

### SECURITY_AUDIT_PROJECT

> Source: domains/example-domain/01_PROJECTS/SECURITY_AUDIT_PROJECT.md
> Priority: medium | Status: planning

#### Active (2 tasks)
- [ ] Review access controls
- [ ] Audit logging configuration

---

## client-project

### WEBSITE_REDESIGN_PROJECT

> Source: domains/client-project/01_PROJECTS/WEBSITE_REDESIGN_PROJECT.md
> Priority: high | Status: in-progress

#### Active (3 tasks)
- [ ] Finalize color palette
- [/] Build responsive navigation
- [/] Implement hero section

---

## Inbox Actions

> Source: Inbox/Notes/ and Inbox/Daily/

#### Active (2 tasks)
- [ ] Update documentation based on user feedback (from notes)
- [ ] Review new API endpoints

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
  Active tasks: 12
    - [ ] To Do: 8
    - [/] In Progress: 4
  Inactive tasks: 5
    - [!] Blocked: 1
    - [?] Paused: 1
    - [I] Backlog: 2
    - [-] Not Doing: 1

Output: Inbox/Tasks/MASTER.md

To push changes back to projects, run: update plan
```

## Task Source Reference Format

Each project section includes a source reference for bidirectional sync:

```markdown
> Source: domains/[domain]/01_PROJECTS/[NAME]\_PROJECT.md
```

This reference is used by `update_plan` workflow to locate the original file.

## Error Handling

| Error                        | Resolution                                |
| ---------------------------- | ----------------------------------------- |
| No domains found             | Report "No domains exist"                 |
| Domain has no 01_PROJECTS/   | Skip domain, note in summary              |
| Project has no task sections | Skip project, note in summary             |
| Inbox/Tasks/ doesn't exist   | Create the directory                      |
| Parse error in project       | Log warning, continue with other projects |

## Output

- `Inbox/Tasks/MASTER.md` - Aggregated task list with source references
- Summary report with scan statistics
