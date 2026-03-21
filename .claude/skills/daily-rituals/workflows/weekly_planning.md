# Weekly Planning Workflow

## Purpose

Plan the upcoming week by setting a goal and selecting committed tasks. Run on Sunday as part of the sunday_ritual or standalone.

## Steps

### Step 1: Detect Active Week

1. Scan `Inbox/Plan/` for any file with `status: active` in frontmatter
2. If found:
   - Warn: "Active week W[X] exists. Run weekly_closing first or continue planning anyway?"
   - If user chooses to continue, note that the active week will be closed automatically

### Step 2: Calculate Week Dates

1. Determine current ISO week number
2. Set start_date = today (Sunday)
3. Set end_date = Saturday (6 days later)
4. Generate filename: `W[week_number]_[YYYY-MM-DD].md`

### Step 3: Review Available Tasks

1. Read `Inbox/Dashboards/TASKS.md`
2. Pull all tasks with status `[ ]` (To Do) or `[!]` (Blocked)
3. Group by domain and display with project context
4. Show task counts per domain

Present as:

```markdown
## Available Tasks

### [Domain 1] — X tasks
- [ ] Task description (PROJECT_NAME)
- [ ] Task description (AD_HOC_TASKS)

### [Domain 2] — Y tasks
- [ ] Task description (PROJECT_NAME)
```

### Step 4: Set Week Goal

1. Ask: "What is the primary goal for this week? (1 sentence)"
2. This becomes the north star for daily intentions
3. Store in frontmatter as `week_goal`

### Step 5: Select Committed Tasks

1. Present task list from Step 3
2. Ask user to select 3-7 tasks for the week
3. If > 7 tasks selected, warn: "Consider reducing scope for realistic completion"
4. Record selected tasks in the week file under "Committed Tasks > Active"

### Step 6: Optional Stretch Goals

1. Ask: "Any stretch goals if time permits? (optional)"
2. If provided, record under "Stretch Goals" section
3. These are tracked separately from committed tasks

### Step 7: Create Week File

1. Generate `Inbox/Plan/W[week]_[YYYY-MM-DD].md` using template
2. Set frontmatter:
   - `status: planning`
   - `week_number`, `year`, `start_date`, `end_date`
   - `planned_capacity` = count of committed tasks
   - `week_goal` from Step 4
3. Populate Committed Tasks section

### Step 8: Activate Week

1. Ask: "Activate this week and mark committed tasks as in-progress?"
2. If yes:
   - Set `status: active` in week file
   - For each committed task, update source file to `[/]` (In-Progress)
3. If no:
   - Leave `status: planning` for later activation

### Step 9: Complete

Confirm:

```
Week W[X] planned:
- Goal: [week_goal]
- Committed tasks: [N]
- Stretch goals: [M]
- Duration: Sunday [start_date] to Saturday [end_date]
- Status: [active|planning]
```
