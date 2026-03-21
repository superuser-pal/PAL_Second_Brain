# Weekly Review Workflow

## Purpose

Cross-domain progress review, inbox health check, and goal alignment. Run once per week (suggested: Sunday evening or Monday morning).

## Steps

### Step 1: Aggregate Project Status

1. Grep frontmatter from all `Domains/*/01_PROJECTS/PROJECT_*.md` and `PLAN_*.md`
2. Extract: name, status, domain, task_open, task_total, task_done
3. Present as markdown table grouped by domain
4. Calculate: total tasks done this week (compare with last weekly review if exists)

### Step 2: Inbox Health Check

1. Count all files in `Inbox/Notes/` by status (unprocessed, draft, ready)
2. Count files in `Inbox/Dashboards/`
3. Report totals and flag if unprocessed > 10: "Inbox overflow — consider running process-inbox"
4. Prompt: "You have [X] unprocessed notes. Would you like to process them now via `process_inbox`?"

### Step 3: Review Daily Notes

1. List all `Inbox/Plan/DD-MM-YY.md` files from the past 7 days
2. Extract key themes: accomplishments, learnings, blockers
3. Summarize patterns: "This week you focused on [X], got blocked on [Y]"

### Step 4: Session Activity

1. List session files from `.claude/sessions/` for the past 7 days
2. Count sessions and summarize topics worked on
3. Note: "X sessions this week, focused on: [topics]"

### Step 5: Identify Stalled Projects

1. From Step 1 data, flag projects where:
   - `task_open > 0` and no tasks moved to done in the past week
   - `status: active` but no session activity related to that project
2. Present as: "Stalled projects needing attention: [list]"

### Step 6: Present Weekly Summary

```markdown
## Weekly Review — Week of [Date Range]

### Progress
[Table from Step 1]
[Tasks completed this week: X]

### Inbox Health
- Unprocessed notes: [X]
- Ready to distribute: [X]
- Pending tasks: [X]

### This Week's Themes
[Patterns from Step 3]

### Sessions
[Summary from Step 4]

### Needs Attention
[Stalled projects from Step 5]
```

### Step 7: Set Next Week's Focus

1. Note: "Detailed task selection will happen in weekly_planning workflow"
2. Ask: "What are your high-level priorities or themes for next week?"
3. Collect response (themes only, not specific tasks)

### Step 8: Write Weekly Entry

Create `Inbox/Plan/DD-MM-YY_weekly_review.md`:

```yaml
---
date: DD-MM-YY
type: weekly-review
week_number: [calculated]
---
```

Append full weekly summary + next week's focus.

### Step 9: Complete

Confirm: "Weekly review complete. [X] tasks done, [Y] projects active, [Z] inbox items. Next week's focus: [priorities]."
