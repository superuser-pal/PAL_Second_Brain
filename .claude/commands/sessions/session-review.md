Review system improvement notes from past sessions:

1. If $ARGUMENTS is a specific session filename, show its Part B (System Improvement Notes) in full
2. If no arguments, scan all session files in `.claude/sessions/` for Part B sections
3. Aggregate and deduplicate the suggestions:
   - Group by category:
     * System prompts
     * Agents
     * Skills/commands
     * File structure
     * Workflows
   - Flag recurring patterns that appear across multiple sessions
   - Highlight any suggestions that were already addressed (check if the
     suggested file, agent, or skill now exists in the project)
4. Present as a prioritized action list:
   - Recurring items ranked higher
   - Mark addressed items as ✓ Done
   - Show which sessions each suggestion came from
5. End with: "Want me to implement any of these now?"

If no Part B sections exist across any sessions, inform the user:
"No system improvement notes found yet. These are generated automatically when you end sessions with `/project:session-end`."
