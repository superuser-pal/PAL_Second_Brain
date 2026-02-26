End the current development session by:

1. Check `.claude/sessions/.current-session` for the active session
2. If no active session, inform user there's nothing to end
3. If session exists, re-read the full session file from disk (`.claude/sessions/[active-session].md`) to catch friction flags and patterns from earlier in the session that may no longer be in context. Then append a comprehensive summary with TWO parts:

## PART A — Development Session Summary

- Session duration
- Git summary:
  * Total files changed (added/modified/deleted)
  * List all changed files with change type
  * Number of commits made (if any)
  * Final git status
- Todo summary:
  * Total tasks completed/remaining
  * List completed tasks
  * List incomplete tasks with status
- Key accomplishments and features implemented
- Problems encountered and how they were resolved
- Breaking changes or important findings
- Dependencies added/removed
- Configuration changes
- What wasn't completed and suggested next steps

The development summary should be thorough enough that another developer (or AI) can pick up where this session left off without reading the full session.

## PART B — System Improvement Notes

Review the full session (including ⚠ Friction flags from updates) for patterns that reveal friction, wasted tokens, or missed opportunities in how the second-brain system (agents, system prompts, skills, commands, file structure) is currently set up.

Only include this section if you actually observed issues. Skip it entirely for clean sessions.

For each issue found, use this format:
- **Pattern observed**: What happened (1–2 sentences, paraphrased from the session)
- **Root cause**: Which part of the system allowed it — a missing skill, an unclear agent prompt, a poorly named file, repeated context that should live in a reference file, etc.
- **Suggested fix**: A concrete change to a specific file, agent definition, skill, or workflow (not generic advice like "be more clear" — name the file or artifact to create/edit and what it should contain)
- **Impact**: Whether this saves tokens, reduces friction, or improves reliability

Prioritize by impact. Flag at most 5 issues per session. If nothing stands out, just write "No system issues observed this session."

Categories to watch for:
- System prompts that are missing context or are overloaded
- Agents that are mis-scoped or lack clear boundaries
- Skills/commands that should exist but don't
- Repeated context that should be a reference file
- File naming or structure that made things hard to find
- Workflow gaps (e.g., no handoff between agents, no checkpoint habit)

## PART C — Token Efficiency Recommendations

Analyze the session for specific opportunities to reduce token consumption. Focus on concrete, actionable changes that make the system leaner for AI models.

For each recommendation, use this format:
- **Location**: The specific file(s) or context source
- **Issue**: What's consuming unnecessary tokens (redundancy, verbosity, duplicate definitions, etc.)
- **Recommendation**: Exact change to reduce token usage
- **Estimated savings**: Rough token reduction (e.g., "~500 tokens per session" or "removes 30% of file")

Areas to audit:
- **Redundant context**: Same information defined in multiple files that gets loaded together
- **Verbose instructions**: Explanations that could be condensed without losing clarity
- **Unused sections**: Parts of system files that are rarely referenced but always loaded
- **Duplicate definitions**: Terminology, rules, or patterns repeated across files
- **Over-documentation**: Internal documentation that doesn't need to be in AI context
- **Inefficient file structure**: Files that force loading more context than needed for typical tasks

Only include this section if you identified concrete optimization opportunities. Skip entirely if no inefficiencies were observed.

## PART D — CLAUDE.md Recommendations

Review the session for insights that should be codified in the main `.claude/CLAUDE.md` file — the primary system prompt that shapes all interactions.

For each recommendation, use this format:
- **What to add**: The directive, pattern, or instruction
- **Why**: What happened in this session that revealed the need
- **Suggested placement**: Which section of CLAUDE.md it belongs in (Directives, Stack, Architecture, Response Format, or new section)

Categories to consider:
- **Missing directives**: Behaviors that should be default but aren't specified
- **Stack clarifications**: Tools or preferences that needed explicit instruction
- **Workflow patterns**: Successful approaches that should become standard
- **Anti-patterns**: Things to explicitly avoid that caused friction
- **Response format adjustments**: Output structure improvements

Only include this section if you have specific additions to recommend. Skip entirely if the current CLAUDE.md adequately covered the session's needs.

4. Empty the `.claude/sessions/.current-session` file (don't remove it, just clear its contents)
5. Inform user the session has been documented
6. If Parts B, C, or D have actionable suggestions, remind: "Run `/sessions:session-review` anytime to see accumulated system improvement notes across sessions."
