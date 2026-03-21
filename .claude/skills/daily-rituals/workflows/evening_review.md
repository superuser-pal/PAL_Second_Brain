# Evening Review Workflow

## Purpose

Close the day with a structured reflection — capture what happened, what was learned, and what to prioritize tomorrow.

## Steps

### Step 1: Read Today's Context

1. Check if `Inbox/Plan/DD-MM-YY.md` exists (today's date)
2. If exists, read the morning intentions
3. Scan `Inbox/Notes/` and `Inbox/Dashboards/` for files created or modified with today's date to understand today's captured information and activity.
4. Check for active week in `Inbox/Plan/` — load week_goal and committed tasks

### Step 2: Gather Accomplishments

1. Ask the user to verify completion of today's focused project tasks. If completed, automatically mark them as `[x]` (Done) and trigger `update_tasks`.
2. If active week exists, match accomplishments to week's committed tasks:
   - Auto-mark matched tasks as `[x]` in week file
   - Move task from "Active" to "Done" section in week file
   - Update `completed_count` in week frontmatter
3. Ask: "What did you accomplish today? (Quick bullets are fine)"
4. Supplement with key actions and insights derived from today's notes and tasks.
5. Compile a combined list

### Step 3: Capture Learnings

1. Ask: "Anything you learned or want to remember?"
2. Accept response (can be empty — not every day has explicit learnings)

### Step 4: Identify Blockers

1. Ask: "Anything blocked or stalled?"
2. If user reports blockers, note which project/domain they relate to

### Step 4.5: Week Progress Check

If active week exists:

1. Calculate task progress: `completed_count / planned_capacity`
2. Calculate time progress: `days_elapsed / 7`
3. Compare progress vs time:
   - Progress > Time + 10%: "ahead"
   - Progress within 10% of Time: "on-track"
   - Progress < Time - 10%: "behind"
4. Present:

```markdown
### Week Progress
- Tasks: [M]/[N] ([X]%)
- Time: [D]/7 days ([Y]%)
- Status: [ahead|on-track|behind]
```

### Step 5: Set Tomorrow's Priority

1. Based on today's blockers and active project state, suggest a top priority for tomorrow
2. Ask user to confirm or override

### Step 6: Write Evening Entry

Append to `Inbox/Plan/DD-MM-YY.md` (create if doesn't exist):

```markdown
## Evening Review

### Accomplished
- [Compiled accomplishments]

### Learned
- [Learnings, if any]

### Blocked
- [Blockers, if any]

### Tomorrow's Priority
- [Priority item]
```

### Step 7: Report Inbox Delta

1. Count current Inbox/ items
2. If morning briefing exists, compare: "Inbox: [morning count] -> [current count]"
3. If inbox grew, note: "X new items captured today"

### Step 8: Complete

Confirm: "Evening review saved. Tomorrow's focus: [priority]. Good night."
