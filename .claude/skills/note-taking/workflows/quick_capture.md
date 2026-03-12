# quick_capture Workflow

Capture a single, lightweight thought or task quickly and append it directly to today's Daily note, bypassing AI analysis and categorization.

## Trigger Phrases

- "quick add"
- "add task"
- "capture this"
- "quick note"

## Step 1: Gather Input

Prompt the user:

> "What do you want to capture?"

User provides their input:
```
[user input] e.g., "Buy milk" or "Call John about the contract"
```

Ask the user:
> "Is this a (T)ask or a (N)ote?"

## Step 2: Format the Capture

Based on the type selected:
- **Task (T)**: Prefix with a checkbox: `- [ ] [user input]`
- **Note (N)**: Prefix with a bullet: `- [user input]`

## Step 3: Append to Today's Daily Note

1. Determine today's date in `DD-MM-YY` format.
2. Check if `Inbox/Daily/DD-MM-YY.md` exists.
   - If it doesn't exist, create it with the standard daily format (see `morning_checkin.md`).
3. Find or create the `## Quick Capture` section within the Daily note.
4. Append the formatted capture under that section.

### Example Output in Daily Note

```markdown
## Quick Capture
- [ ] Buy milk
- Idea for new blog post on architecture patterns
```

## Step 4: Report Success

Report back to the user:
> "Saved to today's daily note! (`Inbox/Daily/DD-MM-YY.md`)"
