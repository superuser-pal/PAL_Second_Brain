# Project Dashboard Workflow

**Purpose:** Display a summary view of all projects and tasks across domains, combining project listing with task statistics.

## Prerequisites

- At least one domain exists in `/domains/`

## Workflow Steps

### Step 1: Scan All Projects

Scan all `domains/*/01_PROJECTS/PROJECT_*.md` files:

```
Scanning projects across all domains...
Found 7 projects in 3 domains
```

### Step 2: Parse Project Metadata

For each project file, extract:
- YAML frontmatter: name, status, priority, domain, due_date, owner
- Task counts: open, in-progress, done

### Step 3: Generate Dashboard Output

Display formatted dashboard:

```
═══════════════════════════════════════════════════════════
                    PROJECT DASHBOARD
═══════════════════════════════════════════════════════════
Generated: 2026-02-11 14:30

───────────────────────────────────────────────────────────
                    SUMMARY
───────────────────────────────────────────────────────────

Projects by Status:
  Planning:     ██░░░░░░░░  2 projects
  In Progress:  ████░░░░░░  4 projects
  Review:       █░░░░░░░░░  1 project
  Completed:    ░░░░░░░░░░  0 projects
  ─────────────────────────
  Total:                    7 projects

Tasks Overview:
  Open:         ████████░░  24 tasks
  In Progress:  ███░░░░░░░  8 tasks
  Done:         ██████░░░░  18 tasks
  ─────────────────────────
  Total:                    50 tasks

───────────────────────────────────────────────────────────
                  HIGH PRIORITY
───────────────────────────────────────────────────────────

PROJECT_API_INTEGRATION (example-domain)
  Status: in-progress | Due: 2026-03-15
  Tasks: 3 open, 2 in-progress, 1 done

PROJECT_SECURITY_AUDIT (security-domain)
  Status: planning | Due: 2026-02-28
  Tasks: 5 open, 0 in-progress, 0 done

───────────────────────────────────────────────────────────
                    OVERDUE
───────────────────────────────────────────────────────────

PROJECT_Q4_REVIEW (internal-domain)
  Status: in-progress | Due: 2026-02-01 (10 days overdue)
  Tasks: 1 open, 2 in-progress, 4 done

───────────────────────────────────────────────────────────
                  BY DOMAIN
───────────────────────────────────────────────────────────

example-domain (3 projects)
├─ PROJECT_API_INTEGRATION    [in-progress] high   3/2/1
├─ PROJECT_DOCUMENTATION      [planning]    medium 4/0/0
└─ PROJECT_TESTING            [review]      low    0/0/8

client-project (2 projects)
├─ PROJECT_WEBSITE_REDESIGN   [in-progress] high   5/3/2
└─ PROJECT_MOBILE_APP         [in-progress] medium 6/2/4

internal-domain (2 projects)
├─ PROJECT_Q4_REVIEW          [in-progress] low    1/2/4
└─ PROJECT_TOOLING            [planning]    medium 5/0/0

───────────────────────────────────────────────────────────
Legend: [status] priority open/in-progress/done

Quick Actions:
  • Run "pull tasks" to aggregate all tasks
  • Run "create project" to add a new project
  • Run "archive project" to archive completed projects
═══════════════════════════════════════════════════════════
```

### Step 4: Optional File Output

If requested, save dashboard to `/tasks/DASHBOARD.md`:

```markdown
---
generated: 2026-02-11 14:30
total_projects: 7
total_tasks: 50
---

# Project Dashboard

## Summary

| Metric | Count |
|--------|-------|
| Total Projects | 7 |
| Planning | 2 |
| In Progress | 4 |
| Review | 1 |
| Completed | 0 |
| Total Tasks | 50 |
| Open Tasks | 24 |
| In Progress Tasks | 8 |
| Done Tasks | 18 |

## High Priority Projects

| Project | Domain | Status | Due | Tasks (O/I/D) |
|---------|--------|--------|-----|---------------|
| PROJECT_API_INTEGRATION | example-domain | in-progress | 2026-03-15 | 3/2/1 |
| PROJECT_SECURITY_AUDIT | security-domain | planning | 2026-02-28 | 5/0/0 |

## Overdue Projects

| Project | Domain | Due Date | Days Overdue |
|---------|--------|----------|--------------|
| PROJECT_Q4_REVIEW | internal-domain | 2026-02-01 | 10 |

## All Projects by Domain

### example-domain

| Project | Status | Priority | Open | In Progress | Done |
|---------|--------|----------|------|-------------|------|
| PROJECT_API_INTEGRATION | in-progress | high | 3 | 2 | 1 |
| PROJECT_DOCUMENTATION | planning | medium | 4 | 0 | 0 |
| PROJECT_TESTING | review | low | 0 | 0 | 8 |

### client-project

| Project | Status | Priority | Open | In Progress | Done |
|---------|--------|----------|------|-------------|------|
| PROJECT_WEBSITE_REDESIGN | in-progress | high | 5 | 3 | 2 |
| PROJECT_MOBILE_APP | in-progress | medium | 6 | 2 | 4 |

### internal-domain

| Project | Status | Priority | Open | In Progress | Done |
|---------|--------|----------|------|-------------|------|
| PROJECT_Q4_REVIEW | in-progress | low | 1 | 2 | 4 |
| PROJECT_TOOLING | planning | medium | 5 | 0 | 0 |
```

## Display Modes

### Terminal Mode (Default)
- Rich ASCII formatting with box drawing
- Color highlighting for priorities (if supported)
- Progress bars for visual representation

### Markdown Mode (--output flag)
- Clean markdown tables
- Suitable for saving to file
- Can be rendered in documentation

### Compact Mode (--compact flag)
```
Dashboard: 7 projects | 24 open | 8 in-progress | 18 done
High Priority: API_INTEGRATION, SECURITY_AUDIT
Overdue: Q4_REVIEW (10d)
```

## Error Handling

| Error | Resolution |
|-------|------------|
| No domains found | Display empty dashboard with guidance |
| No projects found | Display "No projects. Run 'create project' to start." |
| Parse error | Skip project, note in output |

## Output

- Terminal display: Formatted dashboard view
- Optional file: `/tasks/DASHBOARD.md`
