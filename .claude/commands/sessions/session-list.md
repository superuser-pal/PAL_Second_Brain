List all development sessions by:

1. Check if `.claude/sessions/` directory exists
2. List all `.md` files (excluding hidden files and `.current-session`)
3. For each session file:
   - Show the filename
   - Extract and show the session title
   - Show the date/time
   - Show first few lines of the overview if available
   - Check if Part B (System Improvement Notes) exists and show a count
     like "3 system suggestions" next to the entry
4. If `.claude/sessions/.current-session` exists, highlight which session is currently active
5. Sort by most recent first
6. At the bottom, show a summary: "X sessions have unaddressed system improvement notes. Run `/project:session-review` to see them."
   Only show this line if at least one session has Part B content.

Present in a clean, readable format.
