# Weekly Closing Workflow

## Purpose

Close the current week with metrics calculation and retrospective. Run on Sunday as part of sunday_ritual or standalone.

## Steps

### Step 1: Load Active Week

1. Scan `Inbox/Plan/` for file with `status: active` in frontmatter
2. If none found, exit with message: "No active week to close. Run weekly_planning to start a new week."
3. Read the active week file and extract:
   - `week_number`, `start_date`, `end_date`
   - `week_goal`
   - `planned_capacity`
   - Committed tasks list

### Step 2: Calculate Metrics

1. Count tasks by status in the week file:
   - `[x]` = done
   - `[ ]` = not started
   - `[/]` = in progress
   - `[!]` = blocked
2. Calculate velocity: `completed_count / planned_capacity`
3. If previous week file exists, compare velocities

### Step 3: Present Week Summary

```markdown
## Week W[X] Closing — [start_date] to [end_date]

### Goal
[week_goal]

### Metrics
- Committed: [N] tasks
- Completed: [M] tasks
- Velocity: [X]%
- vs Previous Week: [+/-Y%]

### Task Status
#### Completed
- [x] Task A
- [x] Task B

#### Incomplete
- [ ] Task C (not started)
- [/] Task D (in progress)
- [!] Task E (blocked)
```

### Step 4: Handle Incomplete Tasks

For each incomplete task, ask user to select action:

1. **Carry forward** — Move to next week's committed tasks
2. **Move to backlog** — Change status to `[I]` in source project
3. **Drop** — Mark as `[-]` (Not Doing) in source project

Update the source project files accordingly via `update_plan`.

### Step 5: Gather Retrospective

1. Ask: "What went well this week?"
2. Ask: "What could have gone better?"
3. Ask: "Any action items for next week?"
4. Collect responses

### Step 6: Update Week File

1. Set `status: closed`
2. Set `closed: [today's date]`
3. Calculate and set `velocity`
4. Set `completed_count`
5. Append retrospective content to Retrospective section

### Step 7: Archive Week Files

1. Move the closed week file (W[X]_YYYY-MM-DD.md) to `Inbox/Plan/archive/`
2. Find all daily files (DD-MM-YY.md, *_weekly_review.md) in `Inbox/Plan/` from this week's date range
3. Move them to `Inbox/Plan/archive/`
4. Report: "Archived week file and [N] daily file(s)"

### Step 8: Complete

Confirm:

```
Week W[X] closed:
- Goal: [week_goal]
- Velocity: [X]% ([M]/[N] tasks)
- Carried forward: [P] tasks
- Moved to backlog: [Q] tasks
- Dropped: [R] tasks
- Retrospective saved

Ready to run weekly_planning for next week.
```
