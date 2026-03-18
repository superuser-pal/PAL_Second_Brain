# Sunday Ritual Workflow

## Purpose

Orchestrate the complete Sunday workflow: close the current week, run weekly review, and plan the upcoming week. This is the primary entry point for the weekly cadence.

## Steps

### Step 1: Check Context

1. Detect current day of week
2. If not Sunday, warn: "Today is [day]. Sunday ritual is designed for Sundays. Continue anyway?"
3. Check for active week in `Inbox/Plan/` (file with `status: active`)

### Step 2: Run Weekly Closing (if active week exists)

1. If active week found:
   - Announce: "Closing Week W[X]..."
   - Invoke `weekly_closing` workflow
   - Wait for completion
2. If no active week:
   - Note: "No active week to close. Proceeding to weekly review."

### Step 3: Run Weekly Review

1. Announce: "Running weekly review..."
2. Invoke `weekly_review` workflow
3. This captures cross-domain progress and themes
4. Wait for completion

### Step 4: Run Weekly Planning

1. Announce: "Planning Week W[X+1]..."
2. Invoke `weekly_planning` workflow
3. This sets the goal and committed tasks for the upcoming week
4. Wait for completion

### Step 5: Complete

Present summary:

```markdown
## Sunday Ritual Complete

### Week W[X] Closed
- Velocity: [X]%
- Tasks completed: [M]/[N]
- Retrospective saved

### Weekly Review
- Sessions: [X] this week
- Themes: [summary]
- Inbox: [N] items

### Week W[X+1] Planned
- Goal: [week_goal]
- Committed tasks: [N]
- Status: [active|planning]

Ready for the week ahead.
```
