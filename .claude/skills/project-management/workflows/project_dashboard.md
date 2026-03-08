# Project Dashboard Workflow

**Purpose:** Generate and update a persistent dashboard file at `Inbox/Tasks/DASHBOARD.md` with comprehensive project and task statistics across all domains.

**Version:** 2.0.0 (Minimum Viable Dashboard)

---

## Prerequisites

- At least one domain exists in `Domains/`
- Project files follow naming convention: `*_PROJECT.md` or `PLAN_*.md`
- Located in `Domains/*/01_PROJECTS/`

---

## Workflow Steps

### Step 1: Scan All Projects

Scan all domains for project files:

**Patterns to match:**
- `Domains/*/01_PROJECTS/*_PROJECT.md`
- `Domains/*/01_PROJECTS/PLAN_*.md`

**Example output:**
```
Scanning projects across all domains...
Found 5 projects in 3 domains
```

---

### Step 2: Parse Project Metadata

For each project file, extract:

**YAML Frontmatter Fields:**
- `name` - Project identifier (UPPER_SNAKE_CASE)
- `status` - Current state (planning, active, in-progress, review, completed, blocked)
- `priority` - Importance level (high, medium, low, null)
- `domain` - Parent domain (PascalCase)
- `created` - Creation date (YYYY-MM-DD)
- `last_modified` - Last update date (YYYY-MM-DD)
- `due_date` - Deadline (YYYY-MM-DD or null)
- `owner` - Assigned person (string or null)
- `task_total` - Total task count (number)
- `task_open` - Open task count (number)
- `task_done` - Completed task count (number)

**Task Section Parsing:**
- Count lines starting with `- [ ]` or `- [x]` in:
  - `### Open` section
  - `### In Progress` section
  - `### Done` section

---

### Step 3: Calculate Health Indicators

**Overdue Count:**
- Projects where `due_date < today` AND `status != completed`

**Stale Count:**
- Projects where `last_modified < today - 30 days` AND `status != completed`

**Blocked Count:**
- Projects where `status = 'blocked'`

---

### Step 4: Aggregate Statistics

**Projects by Status:**
- Count projects in each status category (planning, active, in-progress, review, completed, blocked)

**Projects by Priority:**
- Count projects in each priority level (high, medium, low, unset/null)

**Task Breakdown:**
- Sum all `task_open` across projects
- Sum all `task_in_progress` across projects (if tracked)
- Sum all `task_done` across projects
- Calculate `total_tasks` = open + in_progress + done

**Completion Rate:**
- `completion_pct = (task_done / total_tasks) * 100`

---

### Step 5: Generate Dashboard File

Create/overwrite `Inbox/Tasks/DASHBOARD.md` with:

#### Frontmatter (YAML)

```yaml
---
# Document Identity
type: dashboard
generated: 2026-03-08T14:30:00
version: 1.0.0

# Scan Summary
domains_scanned: 7
domains_with_projects: 3
projects_scanned: 5

# Project Status Summary
projects_by_status:
  planning: 3
  active: 1
  in_progress: 0
  review: 0
  completed: 0
  blocked: 0

# Priority Distribution
projects_by_priority:
  high: 2
  medium: 2
  low: 1
  unset: 0

# Task Metrics
total_tasks: 33
task_breakdown:
  open: 29
  in_progress: 0
  done: 4

# Health Indicators
overdue_count: 0
stale_count: 1
blocked_count: 0
---
```

#### Content Structure

```markdown
# Project Dashboard

> Generated: 2026-03-08 14:30:00 | Domains: 7 | Projects: 5 | Tasks: 33

## 📊 Executive Summary

| Metric | Value | Status |
|--------|-------|--------|
| Total Projects | 5 | 🟢 |
| Total Tasks | 33 | 🟡 |
| Completion Rate | 12% | 🔴 |
| Overdue Projects | 0 | 🟢 |
| Blocked Projects | 0 | 🟢 |
| Stale Projects | 1 | 🟡 |

**Key Insight**: High task volume with low completion rate. Consider focusing on completing existing tasks before starting new projects.

---

## 🚨 Alerts & Priorities

### High Priority Projects (2)

| Project | Domain | Status | Tasks (O/I/D) | Due Date | Owner |
|---------|--------|--------|---------------|----------|-------|
| [PROJECT_OBSIDIAN_INTEGRATION](../Domains/PALProduct/01_PROJECTS/PROJECT_OBSIDIAN_INTEGRATION.md) | PALProduct | planning | 4/0/8 | - | Rodrigo |
| [PLAN_GROWTH_STRATEGY](../Domains/LaraLou/01_PROJECTS/PLAN_GROWTH_STRATEGY.md) | LaraLou | active | 12/0/0 | - | Rodrigo |

### Overdue Projects (0)

*No overdue projects. Great!*

### Blocked Projects (0)

*No blocked projects.*

### Stale Projects (1)

| Project | Domain | Last Modified | Days Stale |
|---------|--------|---------------|------------|
| [PROJECT_EXAMPLE](../Domains/PALBuilder/01_PROJECTS/PROJECT_EXAMPLE.md) | PALBuilder | 2026-02-01 | 35 |

**Recommended Actions**:
- Review stale project: Archive or assign ownership

---

## 📈 Project Status Distribution

```
Planning:     ███████░░░  3 projects (60%)
Active:       ██░░░░░░░░  1 project  (20%)
In Progress:  ░░░░░░░░░░  0 projects (0%)
Review:       ░░░░░░░░░░  0 projects (0%)
Completed:    █░░░░░░░░░  1 project  (20%)
─────────────────────────────────────
Total:                    5 projects
```

**Task Distribution**:

| Status | Count | Percentage |
|--------|-------|------------|
| Open | 29 | 88% |
| In Progress | 0 | 0% |
| Done | 4 | 12% |
| **Total** | **33** | **100%** |

**Analysis**: Heavy concentration in planning stage. Move projects to active status to increase execution.

---

## 🗂️ By Domain

### PALProduct (2 projects, 15 tasks)

| Project | Status | Priority | Open | In Progress | Done | Completion | Due Date |
|---------|--------|----------|------|-------------|------|------------|----------|
| [PROJECT_OBSIDIAN_INTEGRATION](../Domains/PALProduct/01_PROJECTS/PROJECT_OBSIDIAN_INTEGRATION.md) | planning | high | 4 | 0 | 8 | 67% | - |
| [PROJECT_SEMANTIC_NOTE_TAKING](../Domains/PALProduct/01_PROJECTS/PROJECT_SEMANTIC_NOTE_TAKING.md) | planning | medium | 3 | 0 | 0 | 0% | - |

**Domain Health**: 🟢 Good progress on Obsidian integration

---

### LaraLou (3 projects, 18 tasks)

| Project | Status | Priority | Open | In Progress | Done | Completion | Due Date |
|---------|--------|----------|------|-------------|------|------------|----------|
| [PLAN_GROWTH_STRATEGY](../Domains/LaraLou/01_PROJECTS/PLAN_GROWTH_STRATEGY.md) | active | high | 12 | 0 | 0 | 0% | - |
| [PLAN_VIRAL_NOTE_ANALYSIS](../Domains/LaraLou/01_PROJECTS/PLAN_VIRAL_NOTE_ANALYSIS.md) | active | medium | 6 | 0 | 0 | 0% | - |

**Domain Health**: 🟡 High task load, zero completion. Focus on one project at a time.

---

### Other Domains

**PALBuilder**: No active projects | [Create Project](../Domains/PALBuilder/01_PROJECTS/)
**PALGrowth**: No active projects | [Create Project](../Domains/PALGrowth/01_PROJECTS/)
**LifeOS**: No active projects | [Create Project](../Domains/LifeOS/01_PROJECTS/)
**Studio**: No active projects | [Create Project](../Domains/Studio/01_PROJECTS/)

---

## ⚡ Quick Actions

### Common Commands
- `pull tasks` - Refresh MASTER.md with latest tasks
- `update plan` - Sync changes back to project files
- `create project` - Start a new project
- `archive project` - Archive completed projects

### Related Files
- [MASTER.md](./MASTER.md) - Aggregated task list
- [Projects.base](../Bases/Projects.base) - Obsidian dashboard view

### Project File Locations
- PALProduct: [01_PROJECTS](../Domains/PALProduct/01_PROJECTS/)
- LaraLou: [01_PROJECTS](../Domains/LaraLou/01_PROJECTS/)
- PALBuilder: [01_PROJECTS](../Domains/PALBuilder/01_PROJECTS/)

---

**Last Updated**: 2026-03-08 14:30:00
**Dashboard Version**: 1.0.0
```

---

## Status Indicators Logic

**Executive Summary Status**:

| Indicator | Threshold |
|-----------|-----------|
| 🟢 Green | Good: completion > 30%, overdue = 0, blocked = 0 |
| 🟡 Yellow | Attention: completion 10-30%, overdue < 3, blocked < 2 |
| 🔴 Red | Critical: completion < 10%, overdue ≥ 3, blocked ≥ 2 |

**Domain Health**:

| Indicator | Criteria |
|-----------|----------|
| 🟢 Green | ≥ 1 active project, completion ≥ 20%, no overdue |
| 🟡 Yellow | Planning only OR completion 10-20% OR 1 overdue |
| 🔴 Red | All blocked/stale OR completion < 10% OR 2+ overdue |

---

## Progress Bar Logic

Each block represents 10% of total projects:

```
Total projects = 5
Planning = 3 → 60% → 6 blocks filled

███████░░░  3 projects (60%)
```

- Filled blocks (█) = count in that status / total * 10
- Empty blocks (░) = 10 - filled blocks

---

## File Output Logic

**Always generate file:**
- Path: `Inbox/Tasks/DASHBOARD.md`
- Mode: Overwrite (no prompt needed)
- This is a regenerated view, not an editable file

**No terminal display:**
- Dashboard is file-only output
- User opens `DASHBOARD.md` in Obsidian after generation

---

## Error Handling

| Error | Resolution |
|-------|------------|
| No domains found | Generate empty dashboard with guidance message |
| No projects found | Show "No projects. Run 'create project' to start." |
| Parse error in project file | Skip project, log warning, continue |
| Missing frontmatter fields | Use defaults (priority=null, status=planning) |
| Invalid due_date format | Treat as null, don't fail |

---

## Edge Cases

**0 Projects:**
- Generate dashboard with zeros
- Show "No projects. Run 'create project' to start."
- Include domain links for creating first project

**No Overdue:**
- Display "*No overdue projects. Great!*"

**No Blocked:**
- Omit blocked projects section entirely

**No Stale:**
- Omit stale projects section entirely

**No High Priority:**
- Display "*No high priority projects.*"

---

## Validation Checklist

After generating dashboard:

- [ ] Frontmatter parses correctly in Obsidian
- [ ] All markdown tables render properly
- [ ] Progress bars use correct Unicode (█ and ░)
- [ ] Links to project files resolve (relative paths work)
- [ ] Status indicators display (🟢🟡🔴)
- [ ] Timestamp uses ISO 8601 format (YYYY-MM-DDTHH:MM:SS)
- [ ] All required frontmatter fields present
- [ ] Handles edge cases (0 projects, no overdue, etc.)
- [ ] Domain health calculations correct
- [ ] File overwrites cleanly (no duplicate content)

---

## Integration Points

**MASTER.md:**
- Task-level view (individual tasks listed)
- DASHBOARD.md = Project-level view (aggregated stats)

**Projects.base (Obsidian):**
- Query on project files (live data)
- DASHBOARD.md = Pre-computed summary (snapshot)

**Domain INDEX.md files:**
- Source of truth for individual domains
- DASHBOARD.md = Cross-domain rollup

---

**Workflow Version:** 2.0.0
**Last Updated:** 2026-03-08
**Related Workflows:** pull_tasks.md, update_plan.md, create_project.md
