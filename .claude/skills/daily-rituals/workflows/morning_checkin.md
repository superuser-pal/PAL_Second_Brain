# Morning Check-in Workflow

## Purpose

Start the day with a clear picture of system state and set intentional focus areas.

## Steps

### Step 1: Scan Inbox Health

1. Count files in `Inbox/Notes/` — report total unprocessed
2. Read the `active_tasks` count from `Inbox/Dashboards/TASKS.md` frontmatter — report pending task items
3. If unprocessed items > 5, flag: "Inbox needs attention"
4. Prompt: "You have [X] unprocessed notes. Would you like to process them now before setting daily intentions?"
   - If yes, invoke `process_inbox` workflow first.

### Step 1.5: Surface Active Week

1. Scan `Inbox/Plan/` for file with `status: active` in frontmatter
2. If found, read and extract:
   - `week_number`, `week_goal`
   - Count committed tasks by status (`[ ]`, `[/]`, `[x]`)
   - Calculate days remaining (end_date - today)
3. Present:

```markdown
### Active Week: W[X]
- Goal: [week_goal]
- Progress: [done]/[total] tasks ([X]%)
- Days remaining: [N]

#### Today's Week Tasks
- [ ] Uncommitted task from week
- [/] In-progress task from week
```

4. If no active week, note: "No active week. Run weekly_planning to start one."

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

1. Check if `Inbox/Plan/DD-MM-YY.md` exists (today's date)
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

1. If active week exists, default suggestions to uncommitted week tasks
2. Note: "These intentions align with week goal: [week_goal]"
3. Ask: "What are your top 1-3 focus areas for today?"
4. Users can select tasks from Active Week (Step 1.5) or Active Projects (Step 2)
5. If a task is selected, update its state to `[/]` (In-Progress) in both week file and source project
6. Collect user response
7. Create or update `Inbox/Plan/DD-MM-YY.md` with:

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
