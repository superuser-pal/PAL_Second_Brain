Show help for the session management system:

## Session Management Commands

The session system helps document development work and surface system improvements for your second-brain setup.

### Available Commands:

- `/project:session-start [name]` - Start a new session with optional name
- `/project:session-update [notes]` - Add notes to current session
- `/project:session-end` - End session with dev summary + system improvement notes
- `/project:session-list` - List all session files (with system suggestion counts)
- `/project:session-current` - Show current session status and any friction flags
- `/project:session-review [filename]` - Review system improvement notes across sessions
- `/project:session-help` - Show this help

### How It Works:

1. Sessions are markdown files in `.claude/sessions/`
2. Files use `YYYY-MM-DD-HHMM-name.md` format
3. Only one session can be active at a time
4. Sessions track progress, issues, solutions, and system-level friction
5. Session-end produces two outputs:
   - **Part A**: Development summary (git, todos, accomplishments, next steps)
   - **Part B**: System improvement notes (only when friction was observed)
6. Session-review aggregates Part B insights across all sessions

### Best Practices:

- Start a session when beginning significant work
- Update regularly with important changes or findings
- Flag friction moments with ⚠ in updates when something feels harder than it should
- End with thorough summary for future reference
- Run `/project:session-review` periodically to act on accumulated system suggestions
- Review past sessions before starting similar work

### Example Workflow:

```
/project:session-start refactor-auth
/project:session-update Added Google OAuth restriction
/project:session-update Fixed Next.js 15 params Promise issue
/project:session-current
/project:session-end
/project:session-review
```
