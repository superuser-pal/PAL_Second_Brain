Show the current session status by:

1. Check if `.claude/sessions/.current-session` exists
2. If no active session, inform user and suggest starting one
3. If active session exists:
   - Show session name and filename
   - Calculate and show duration since start
   - Show last few updates
   - Show current goals/tasks
   - If any updates contain ⚠ Friction flags, list them under a
     "Friction so far" heading so user can address them mid-session
   - Remind user of available commands

Keep the output concise and informative.
