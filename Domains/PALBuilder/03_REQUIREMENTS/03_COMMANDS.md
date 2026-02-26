# PAL Second Brain - Commands Requirements

**Document Purpose:** Functional requirements for all PAL commands — slash-prefixed instructions that trigger specific behaviors.

**Version:** 1.0.0
**Last Updated:** 2026-02-21

---

## What is a Command?

A **command** is a slash-prefixed instruction that triggers specific behavior in PAL. Commands are markdown files in `.claude/commands/` that define what happens when invoked.

**Key Difference from Skills:**
- **Skills** activate automatically based on intent (via USE WHEN triggers)
- **Commands** require explicit invocation (e.g., `/agents:pal-builder`)

**Command Categories:**
- **Agent Commands** (`agents/`) — Load specialized agent personas
- **Session Commands** (`sessions/`) — Manage development session tracking

---

## 3.0 Command Architecture Requirements

### 3.0.1 Commands are Markdown Files

**Given** a command exists in PAL
**When** its location is verified
**Then** it is a single `.md` file in `.claude/commands/[category]/`

Category: Validation
Verification: Run `ls .claude/commands/*/` and confirm only `.md` files exist
Source: [CLAUDE.md](.claude/CLAUDE.md)

---

### 3.0.2 Commands Organize by Category Subdirectory

**Given** multiple commands exist
**When** they are organized
**Then** they are grouped in subdirectories by function:
- `agents/` — Agent loading commands
- `sessions/` — Session management commands

Category: Validation
Verification: Check `.claude/commands/` subdirectories match expected categories
Source: [CLAUDE.md](.claude/CLAUDE.md)

---

### 3.0.3 Commands Use Slash Prefix Invocation

**Given** a command file exists at `.claude/commands/[category]/[name].md`
**When** user types `/[category]:[name]`
**Then** the command file content is executed as instructions

Category: Functional
Verification: Run `/agents:pal-master` and confirm agent loads
Source: [CLAUDE.md](.claude/CLAUDE.md)

---

### 3.0.4 Commands Accept Arguments via $ARGUMENTS

**Given** a command expects user input
**When** user provides arguments after the command (e.g., `/sessions:session-start my-project`)
**Then** the argument value replaces `$ARGUMENTS` in the command file

Category: Functional
Verification: Run `/sessions:session-start test-session` and confirm "test-session" appears in filename
Source: [session-start.md](.claude/commands/sessions/session-start.md)

---

## 3.1 Agent Commands

Agent commands load specialized personas by reading agent configuration files and executing their activation protocol.

### 3.1.1 Agent Command Loads Agent File

**Given** an agent command exists (e.g., `pal-builder.md`)
**When** user invokes `/agents:[agent-name]`
**Then** the full agent configuration is read from `.claude/agents/[agent-name].md`

Category: Functional
Verification: Run `/agents:pal-builder` and confirm agent persona activates
Source: [pal-builder.md](.claude/commands/agents/pal-builder.md)

---

### 3.1.2 Agent Command Executes Activation Protocol

**Given** an agent command loads an agent file
**When** activation begins
**Then** the 5-step activation protocol executes:
1. Load the agent persona
2. Load PAL Base Configuration (AUTO files loaded, REF files indexed)
3. Extract user name from ABOUTME.md
4. Display greeting and command menu
5. Wait for user input

Category: Functional
Verification: Run `/agents:pal-master` and observe all 5 steps complete
Source: [pal-master.md](.claude/commands/agents/pal-master.md)

---

### 3.1.3 Agent Remains in Character Until Dismissed

**Given** an agent is active via command
**When** user continues interacting
**Then** agent remains in character following all operational rules
**Until** user issues `*dismiss` command

Category: Functional
Verification: Activate agent, interact, confirm persona persists, then `*dismiss` to exit
Source: [pal-master.md](.claude/commands/agents/pal-master.md)

---

### 3.1.4 Available Agent Commands

**Given** the agent commands directory exists
**When** its contents are listed
**Then** the following agent commands are available:

| Command | Agent | Domain |
|---------|-------|--------|
| `/agents:life-coach` | Life Coach | LifeOS |
| `/agents:pal-builder` | PAL Builder | PALBuilder |
| `/agents:pal-master` | PAL Master | (Base only) |
| `/agents:pal-release-manager` | PAL Release Manager | PALOpenSource |
| `/agents:product-manager` | Product Manager | PALProduct |
| `/agents:studio-agent` | Studio Agent | Studio |
| `/agents:substack-manager` | Substack Manager | LaraLou |

Category: Functional
Verification: Run `ls .claude/commands/agents/` and confirm all 7 files exist
Source: [agents/](.claude/commands/agents/)

---

## 3.2 Session Commands

Session commands manage development session tracking — creating session files, logging updates, and generating summaries.

### 3.2.1 session-start Creates Session File

**Given** user wants to start a development session
**When** `/sessions:session-start [name]` is invoked
**Then** a new session file is created at `.claude/sessions/YYYY-MM-DD-HHMM-[name].md`

**And then** the file contains:
- Session name and timestamp as title
- Session overview section with start time
- Goals section (asks user if not clear)
- Empty progress section
- System context snapshot (agents, skills, directory structure)

Category: Functional
Verification: Run `/sessions:session-start test` and confirm file created with correct structure
Source: [session-start.md](.claude/commands/sessions/session-start.md)

---

### 3.2.2 session-start Tracks Active Session

**Given** a session is started
**When** the session file is created
**Then** `.claude/sessions/.current-session` is created/updated with the session filename

Category: Functional
Verification: After session-start, check `.current-session` contains the session filename
Source: [session-start.md](.claude/commands/sessions/session-start.md)

---

### 3.2.3 session-start Shows Available Commands

**Given** a session is started
**When** the creation completes
**Then** user is reminded of available follow-up commands:
- `/sessions:session-update` — Add notes
- `/sessions:session-end` — End session
- `/sessions:session-current` — Check status
- `/sessions:session-review` — Review past insights

Category: UI
Verification: Run session-start and confirm command reminder is displayed
Source: [session-start.md](.claude/commands/sessions/session-start.md)

---

### 3.2.4 session-update Requires Active Session

**Given** no active session exists (`.current-session` empty or missing)
**When** `/sessions:session-update` is invoked
**Then** user is informed to start a session first with `/sessions:session-start`

Category: Validation
Verification: Clear `.current-session`, run session-update, confirm error message
Source: [session-update.md](.claude/commands/sessions/session-update.md)

---

### 3.2.5 session-update Appends Timestamped Entry

**Given** an active session exists
**When** `/sessions:session-update [notes]` is invoked
**Then** the session file is appended with:
- Current timestamp
- User's notes (or automatic summary if no arguments)
- Git status summary (files added/modified/deleted, branch, last commit)
- Todo list status (completed/in-progress/pending counts)
- Issues encountered and solutions implemented

Category: Functional
Verification: Run session-update, check session file for new timestamped entry with all fields
Source: [session-update.md](.claude/commands/sessions/session-update.md)

---

### 3.2.6 session-update Supports Friction Flags

**Given** an update is being recorded
**When** user experienced friction (repeated context, missing skill, workaround needed)
**Then** the update can include `⚠ Friction: [description]` notation

Category: Functional
Verification: Add update with friction flag, confirm it appears in session file
Source: [session-update.md](.claude/commands/sessions/session-update.md)

---

### 3.2.7 session-current Shows Session Status

**Given** an active session exists
**When** `/sessions:session-current` is invoked
**Then** the following is displayed:
- Session name and filename
- Duration since start
- Last few updates
- Current goals/tasks
- Any friction flags from earlier updates
- Available commands reminder

Category: UI
Verification: Run session-current during active session, confirm all fields shown
Source: [session-current.md](.claude/commands/sessions/session-current.md)

---

### 3.2.8 session-current Handles No Active Session

**Given** no active session exists
**When** `/sessions:session-current` is invoked
**Then** user is informed no session is active and suggested to start one

Category: Validation
Verification: Clear `.current-session`, run session-current, confirm helpful message
Source: [session-current.md](.claude/commands/sessions/session-current.md)

---

### 3.2.9 session-end Generates Two-Part Summary

**Given** an active session exists
**When** `/sessions:session-end` is invoked
**Then** the session file is appended with two parts:

**Part A — Development Session Summary:**
- Session duration
- Git summary (files changed, commits, final status)
- Todo summary (completed/remaining tasks)
- Key accomplishments
- Problems and solutions
- Breaking changes and findings
- Dependencies and configuration changes
- Next steps

**Part B — System Improvement Notes (only if friction observed):**
- Pattern observed
- Root cause
- Suggested fix (specific file/artifact)
- Impact

Category: Functional
Verification: End session with friction flags, confirm both Part A and Part B appear
Source: [session-end.md](.claude/commands/sessions/session-end.md)

---

### 3.2.10 session-end Re-reads Session File

**Given** session-end is invoked
**When** generating the summary
**Then** the full session file is re-read from disk to capture friction flags and patterns from earlier in the session that may no longer be in context

Category: Functional
Verification: Add friction flag early in session, end session, confirm flag appears in Part B
Source: [session-end.md](.claude/commands/sessions/session-end.md)

---

### 3.2.11 session-end Clears Active Session Tracker

**Given** session-end completes successfully
**When** the summary is written
**Then** `.claude/sessions/.current-session` is emptied (file kept, contents cleared)

Category: Functional
Verification: End session, check `.current-session` exists but is empty
Source: [session-end.md](.claude/commands/sessions/session-end.md)

---

### 3.2.12 session-end Limits Part B to Five Issues

**Given** multiple friction points were observed
**When** Part B is generated
**Then** at most 5 issues are included, prioritized by impact

Category: Functional
Verification: Record 7+ friction points, end session, confirm Part B has max 5
Source: [session-end.md](.claude/commands/sessions/session-end.md)

---

### 3.2.13 session-list Shows All Sessions

**Given** session files exist in `.claude/sessions/`
**When** `/sessions:session-list` is invoked
**Then** all `.md` files are listed (excluding hidden files and `.current-session`) with:
- Filename
- Session title
- Date/time
- Overview excerpt
- System suggestion count (if Part B exists)

**And then** results are sorted most recent first

Category: UI
Verification: Run session-list with multiple sessions, confirm all shown sorted by date
Source: [session-list.md](.claude/commands/sessions/session-list.md)

---

### 3.2.14 session-list Highlights Active Session

**Given** a session is currently active
**When** session-list displays results
**Then** the active session is visually highlighted

Category: UI
Verification: Start session, run session-list, confirm active session is marked
Source: [session-list.md](.claude/commands/sessions/session-list.md)

---

### 3.2.15 session-list Shows Unaddressed Suggestions Summary

**Given** sessions have Part B content
**When** session-list completes
**Then** a summary is shown: "X sessions have unaddressed system improvement notes. Run `/sessions:session-review` to see them."

Category: UI
Verification: Create sessions with Part B, run session-list, confirm summary appears
Source: [session-list.md](.claude/commands/sessions/session-list.md)

---

### 3.2.16 session-review Aggregates System Improvement Notes

**Given** multiple sessions have Part B content
**When** `/sessions:session-review` is invoked (no arguments)
**Then** all Part B sections are aggregated and deduplicated, grouped by category:
- System prompts
- Agents
- Skills/commands
- File structure
- Workflows

Category: Functional
Verification: Create sessions with Part B in different categories, run session-review, confirm grouping
Source: [session-review.md](.claude/commands/sessions/session-review.md)

---

### 3.2.17 session-review Prioritizes Recurring Patterns

**Given** suggestions are aggregated
**When** results are displayed
**Then** recurring items (appearing across multiple sessions) are ranked higher

Category: Functional
Verification: Add same friction to multiple sessions, run review, confirm it appears first
Source: [session-review.md](.claude/commands/sessions/session-review.md)

---

### 3.2.18 session-review Marks Addressed Items

**Given** a suggested fix has been implemented
**When** the suggestion is displayed
**Then** it is marked as `✓ Done` (by checking if suggested file/skill/agent now exists)

Category: Functional
Verification: Implement a suggested fix, run session-review, confirm ✓ Done marker
Source: [session-review.md](.claude/commands/sessions/session-review.md)

---

### 3.2.19 session-review Supports Single Session Review

**Given** user wants to review a specific session
**When** `/sessions:session-review [filename]` is invoked with a session filename
**Then** only that session's Part B is shown in full

Category: Functional
Verification: Run session-review with specific filename, confirm only that session shown
Source: [session-review.md](.claude/commands/sessions/session-review.md)

---

### 3.2.20 session-review Handles No Improvement Notes

**Given** no sessions have Part B content
**When** `/sessions:session-review` is invoked
**Then** user is informed: "No system improvement notes found yet. These are generated automatically when you end sessions with `/sessions:session-end`."

Category: UI
Verification: Remove all Part B content, run session-review, confirm helpful message
Source: [session-review.md](.claude/commands/sessions/session-review.md)

---

### 3.2.21 session-help Displays Command Reference

**Given** user needs help with session commands
**When** `/sessions:session-help` is invoked
**Then** a comprehensive help document is displayed including:
- All available session commands with descriptions
- How the session system works
- Best practices
- Example workflow

Category: UI
Verification: Run session-help, confirm all sections present
Source: [session-help.md](.claude/commands/sessions/session-help.md)

---

## Adding New Commands

When creating new commands:

1. **Place in appropriate category subdirectory:**
   - `agents/` for agent loading commands
   - `sessions/` for session management commands
   - Create new subdirectory for new category

2. **Use lower-kebab-case filename** (e.g., `my-command.md`)

3. **Include clear step-by-step instructions** in the file

4. **Reference any files to load** (agents, skills, etc.)

5. **Document the command** in this requirements file following the Given-When-Then format

---

*Generated using the system-build documentation workflow.*
