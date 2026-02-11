---
name: project-management
description: Manage projects and tasks across domains. USE WHEN create project OR new project OR pull tasks OR sync tasks OR update plan OR project status OR list projects OR task dashboard OR archive project OR project management OR track tasks.
---

# Project Management Skill

Centralized project and task management across PAL domains with bidirectional sync between project files and a master task list.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| Create Project | "create project", "new project", "start project" | `workflows/create_project.md` |
| Pull Tasks | "pull tasks", "sync tasks", "aggregate tasks", "gather tasks" | `workflows/pull_tasks.md` |
| Update Plan | "update plan", "push tasks", "sync back", "update projects" | `workflows/update_plan.md` |
| Project Dashboard | "project dashboard", "list projects", "task summary", "show projects" | `workflows/project_dashboard.md` |
| Archive Project | "archive project", "complete project", "close project" | `workflows/archive_project.md` |

## Examples

### Example 1: Create a New Project

**User:** "I want to create a new project for the API integration work"

**Workflow:** `create_project`

**Process:**
1. List available domains for selection
2. Ask for project name: "API Integration"
3. Ask for objective: "Integrate third-party payment API"
4. Ask for initial tasks: "Research API docs, Create auth flow, Implement endpoints"
5. Ask for priority: "high"
6. Generate `PROJECT_API_INTEGRATION.md` in selected domain

**Output:**
```
Project created: domains/example-domain/01_PROJECTS/PROJECT_API_INTEGRATION.md
- Status: planning
- Priority: high
- Tasks: 3 open
- Updated domain INDEX.md
```

### Example 2: Pull Tasks from All Projects

**User:** "Pull all open tasks into the master list"

**Workflow:** `pull_tasks`

**Process:**
1. Scan all domains for PROJECT_*.md files
2. Parse task sections from each project
3. Filter for `#open` and `#in-progress` tasks
4. Generate `/tasks/MASTER.md` with grouped tasks

**Output:**
```
Tasks pulled successfully:
- Domains scanned: 3
- Projects found: 7
- Open tasks: 12
- In-progress tasks: 4
- Master file: /tasks/MASTER.md
```

### Example 3: View Project Dashboard

**User:** "Show me all projects and their status"

**Workflow:** `project_dashboard`

**Process:**
1. Scan all PROJECT_*.md files across domains
2. Parse status, priority, and task counts
3. Generate summary view

**Output:**
```
PROJECT DASHBOARD

By Status:
  Planning:    2 projects
  In Progress: 3 projects
  Review:      1 project
  Completed:   1 project

High Priority:
  - PROJECT_API_INTEGRATION (example-domain) - 3 open tasks
  - PROJECT_SECURITY_AUDIT (security-domain) - 5 open tasks

Overdue: None
```

## Task Format

Tasks in project files use checkbox syntax with status tags:

```markdown
### Open
- [ ] Research API documentation `#open`
- [ ] Create authentication flow `#open`

### In Progress
- [ ] Implement payment endpoint `#in-progress`

### Done
- [x] Set up project structure `#done`
```

**Status Tags:**
- `#open` - Task not started
- `#in-progress` - Task actively being worked on
- `#done` - Task completed

## Quick Reference

| Location | Purpose |
|----------|---------|
| `domains/*/01_PROJECTS/` | Project files (PROJECT_*.md) |
| `/tasks/MASTER.md` | Aggregated task list |
| `project_template.md` | Template for new projects |

## Related Documentation

- [DOMAINS_LOGIC.md](../../PAL_Base/System/DOMAINS_LOGIC.md) - Domain structure
- [create-domain skill](../create-domain/SKILL.md) - Domain creation
