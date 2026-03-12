# Evening Review Workflow

## Purpose

Close the day with a structured reflection — capture what happened, what was learned, and what to prioritize tomorrow.

## Steps

### Step 1: Read Today's Context

1. Check if `Inbox/Daily/DD-MM-YY.md` exists (today's date)
2. If exists, read the morning intentions
3. Scan `Inbox/Notes/` and `Inbox/Tasks/` for files created or modified with today's date to understand today's captured information and activity.

### Step 2: Gather Accomplishments

1. Ask the user to verify completion of today's focused project tasks. If completed, automatically mark them as `[x]` (Done) and trigger `update_plan`.
2. Ask: "What did you accomplish today? (Quick bullets are fine)"
3. Supplement with key actions and insights derived from today's notes and tasks.
4. Compile a combined list

### Step 3: Capture Learnings

1. Ask: "Anything you learned or want to remember?"
2. Accept response (can be empty — not every day has explicit learnings)

### Step 4: Identify Blockers

1. Ask: "Anything blocked or stalled?"
2. If user reports blockers, note which project/domain they relate to

### Step 5: Set Tomorrow's Priority

1. Based on today's blockers and active project state, suggest a top priority for tomorrow
2. Ask user to confirm or override

### Step 6: Write Evening Entry

Append to `Inbox/Daily/DD-MM-YY.md` (create if doesn't exist):

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
