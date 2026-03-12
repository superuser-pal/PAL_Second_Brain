# Morning Check-in Workflow

## Purpose

Start the day with a clear picture of system state and set intentional focus areas.

## Steps

### Step 1: Scan Inbox Health

1. Count files in `Inbox/Notes/` — report total unprocessed
2. Read the `active_tasks` count from `Inbox/Tasks/MASTER.md` frontmatter — report pending task items
3. If unprocessed items > 5, flag: "Inbox needs attention"
4. Prompt: "You have [X] unprocessed notes. Would you like to process them now before setting daily intentions?"
   - If yes, invoke `process_inbox` workflow first.

### Step 2: Surface Active Projects

1. Grep frontmatter from all `Domains/*/01_PROJECTS/PROJECT_*.md` and `PLAN_*.md` files
2. Extract: name, status, domain, task_open, task_total
3. Filter to `status: active` or `status: planning`
4. Present as a markdown table sorted by task_open DESC

### Step 3: Check Yesterday's Activity

1. Read the most recent file in `.claude/sessions/` by date
2. Summarize in 2-3 bullets: what was worked on, key outcomes
3. If no session file exists, note: "No session log from yesterday"

### Step 4: Check Today's Daily Note

1. Check if `Inbox/Daily/DD-MM-YY.md` exists (today's date)
2. If exists, read and surface any existing intentions or notes
3. If not, note that we'll create it in Step 6

### Step 5: Present Morning Briefing

Present the following as a structured briefing:

```
## Morning Briefing — [Date]

### Inbox
- Notes: [X] unprocessed
- Tasks: [X] pending

### Active Projects
[Table from Step 2]

### Yesterday
[Summary from Step 3]
```

### Step 6: Set Daily Intentions

1. Ask: "What are your top 1-3 focus areas for today?"
2. Note: Users can explicitly select tasks from the Active Projects table. If a task is selected, automatically update its state to `[/]` (In-Progress) using the task source reference.
3. Collect user response
4. Create or update `Inbox/Daily/DD-MM-YY.md` with:

```yaml
---
date: DD-MM-YY
type: daily
mood:
energy:
---

## Intentions
- [User's focus areas]

## Morning Briefing
[Briefing from Step 5]
```

### Step 7: Complete

Confirm: "Morning check-in complete. [X] active projects, [Y] inbox items. Focus: [intentions summary]."
