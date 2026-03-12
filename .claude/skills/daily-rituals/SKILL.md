---
name: daily-rituals
description: Structured morning, evening, and weekly review workflows. USE WHEN morning routine OR start my day OR evening review OR end of day OR weekly review OR daily checkin OR what should I focus on OR daily ritual OR morning checkin OR evening checkin.
user-invocable: false
---

# daily-rituals

Structured rituals that surface system state — inbox health, domain project status, session history, and life context — to help you start, end, and review your work with intention.

## Workflow Routing

| Workflow | Trigger | File |
| :--- | :--- | :--- |
| **morning_checkin** | "morning routine", "start my day", "morning checkin", "what should I focus on" | `workflows/morning_checkin.md` |
| **evening_review** | "evening review", "end of day", "evening checkin", "wrap up" | `workflows/evening_review.md` |
| **weekly_review** | "weekly review", "week in review", "weekly checkin" | `workflows/weekly_review.md` |

## Examples

**Example 1: Start the day with context**
```
User: "morning routine"
-> Invokes morning_checkin workflow
-> Scans Inbox/ for unprocessed items
-> Reads active PROJECT_*.md files for open tasks
-> Checks yesterday's session log
-> Presents: inbox state, top priorities, suggested focus
-> Creates Inbox/Daily/DD-MM-YY.md with intentions
```

**Example 2: End the day with reflection**
```
User: "end of day"
-> Invokes evening_review workflow
-> Reads today's session logs
-> Summarizes accomplishments and progress
-> Captures learnings and blockers
-> Appends review to Inbox/Daily/DD-MM-YY.md
-> Suggests tomorrow's priority
```

**Example 3: Weekly progress check**
```
User: "weekly review"
-> Invokes weekly_review workflow
-> Aggregates task progress across all domains
-> Reviews inbox health (unprocessed count)
-> Checks project status changes
-> Identifies stalled projects
-> Creates weekly summary in Inbox/Daily/
```

## Data Sources

| Source | What It Provides | How To Read |
| :--- | :--- | :--- |
| `Inbox/Notes/` | Unprocessed note count | `ls` + count files without `status: processed` |
| `Inbox/Tasks/MASTER.md` | Task aggregation stats | Read frontmatter: `open_tasks`, `total_tasks` |
| `Domains/*/01_PROJECTS/PROJECT_*.md` | Active project status | Grep frontmatter for `status`, `task_open` |
| `.claude/sessions/` | Recent session logs | Read most recent session file |
| `Inbox/Daily/` | Previous daily notes | Read yesterday's file if exists |
