---
title: "05 - Cheatsheet"
description: "One-page daily essentials for maximum Claude Code productivity"
tags: [cheatsheet, reference]
series: PAL Second Brain Documentation
order: 5
---

# 05 — Cheatsheet

> Part of the [PAL Second Brain](https://github.com/yourusername/pal-second-brain) documentation series.

**1 printable page** — Daily essentials for maximum productivity.

---

## Essential Commands

| Command | Action |
|---------|--------|
| `/help` | Contextual help |
| `/clear` | Reset conversation |
| `/compact` | Free up context |
| `/status` | Session state + context usage |
| `/context` | Detailed token breakdown |
| `/plan` | Enter Plan Mode (no changes) |
| `/execute` | Exit Plan Mode (apply changes) |
| `/model` | Switch model (sonnet/opus/opusplan) |
| `/insights` | Usage analytics + optimization report |
| `/teleport` | Teleport session from web |
| `/tasks` | Monitor background tasks |
| `/fast` | Toggle fast mode (2.5x speed, 6x cost) |
| `/exit` | Quit (or Ctrl+D) |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Shift+Tab` | Cycle permission modes |
| `Esc` x 2 | Rewind (undo) |
| `Ctrl+C` | Interrupt |
| `Ctrl+R` | Search command history |
| `Ctrl+L` | Clear screen (keeps context) |
| `Tab` | Autocomplete |
| `Shift+Enter` | New line |
| `Alt+T` | Toggle thinking |
| `Ctrl+D` | Exit |

---

## File References

```
@Domains/MyProject/INDEX.md    → Reference a file
@agent-name                    → Call an agent
!shell-command                 → Run shell command
```

---

## Permission Modes

| Mode | Editing | Execution |
|------|---------|-----------|
| Default | Asks | Asks |
| acceptEdits | Auto | Asks |
| Plan Mode | No | No |
| dontAsk | Only if in allow rules | Only if in allow rules |
| bypassPermissions | Auto | Auto (CI/CD only) |

**Shift+Tab** to switch modes.

---

## Memory and Settings (2 levels)

| Level | Path | Scope | Git |
|-------|------|-------|-----|
| **Project** | `.claude/` | Team | Yes |
| **Personal** | `~/.claude/` | You (all projects) | No |

**Priority**: Project overrides Personal.

| File | Where | Usage |
|------|-------|-------|
| `CLAUDE.md` | Project root | Team memory (instructions) |
| `settings.json` | `.claude/` | Team settings (hooks) |
| `settings.local.json` | `.claude/` | Your setting overrides |
| `CLAUDE.md` | `~/.claude/` | Personal memory |

---

## .claude/ Folder Structure

```
.claude/
├── CLAUDE.md           # Local memory (gitignored)
├── settings.json       # Hooks (committed)
├── settings.local.json # Permissions (not committed)
├── agents/             # Custom agents
├── commands/           # Slash commands
├── hooks/              # Event scripts
├── rules/              # Auto-loaded rules
└── skills/             # Knowledge modules
```

---

## Typical Workflow

```
1. Start session      → claude
2. Check context      → /status
3. Plan Mode          → Shift+Tab x 2 (for complex tasks)
4. Describe task      → Clear, specific prompt
5. Review changes     → Always read the diff!
6. Accept/Reject      → y/n
7. Verify             → Check results
8. Save               → Commit when task complete
9. /compact           → When context >70%
```

---

## Context Management

### Statusline

```
Model: Sonnet | Ctx: 89.5k | Cost: $2.11 | Ctx(u): 56.0%
```

**Watch `Ctx(u):`** — >70% = `/compact`, >85% = `/clear`

### Context Thresholds

| Context % | Status | Action |
|-----------|--------|--------|
| 0-50% | Green | Work freely |
| 50-70% | Yellow | Be selective |
| 70-90% | Orange | `/compact` now |
| 90%+ | Red | `/clear` required |

### Actions by Symptom

| Sign | Action |
|------|--------|
| Short responses | `/compact` |
| Frequent forgetting | `/clear` |
| >70% context | `/compact` |
| Task complete | `/clear` |

### Context Recovery Commands

| Command | Usage |
|---------|-------|
| `/compact` | Summarize and free context |
| `/clear` | Fresh start |
| `/rewind` | Undo recent changes |
| `claude -c` | Resume last session (CLI flag) |
| `claude -r <id>` | Resume specific session (CLI flag) |

---

## Plan Mode and Thinking

| Feature | Activation | Usage |
|---------|------------|-------|
| **Plan Mode** | `Shift+Tab x 2` or `/plan` | Explore without modifying |
| **OpusPlan** | `/model opusplan` | Opus for planning, Sonnet for execution |

### Quick Model Selection

| Task | Model | Effort |
|------|-------|--------|
| Simple edits, formatting | Haiku | low |
| Most work, organizing, processing | Sonnet | medium-high |
| Complex analysis, architecture | Opus | high-max |

---

## Quick Prompting Formula

```
WHAT: [Concrete deliverable]
WHERE: [File paths]
HOW: [Constraints, approach]
VERIFY: [Success criteria]
```

**Example:**

```
WHAT: Process my inbox notes and distribute them
WHERE: Inbox/Notes/
HOW: Add YAML frontmatter, categorize by domain
VERIFY: Each note has frontmatter and is in the right domain folder
```

---

## CLI Flags Quick Reference

| Flag | Usage |
|------|-------|
| `-p "query"` | Non-interactive mode |
| `-c` / `--continue` | Continue last session |
| `-r` / `--resume <id>` | Resume specific session |
| `--model sonnet` | Change model |
| `--add-dir ../lib` | Allow access outside CWD |
| `--permission-mode plan` | Plan mode |
| `--dangerously-skip-permissions` | Auto-accept (use carefully) |

---

## Anti-patterns

| Don't | Do |
|-------|-----|
| Vague prompts | Specify file + context with @references |
| Accept without reading | Read every proposed change |
| Ignore warnings | Use `/compact` at 70% |
| Skip permissions | Never in production |
| Negative constraints only | Provide alternatives |

---

## Quick Decision Tree

```
Simple task       → Just ask Claude
Complex task      → Tasks API to plan first
Risky change      → Plan Mode first
Repeating task    → Create agent or skill
Context full      → /compact or /clear
Deep analysis     → Use Opus (thinking on by default)
```

---

## Common Issues Quick Fix

| Problem | Solution |
|---------|----------|
| "Command not found" | Check PATH, reinstall npm global |
| Context too high (>70%) | `/compact` immediately |
| Slow responses | `/compact` or `/clear` |
| MCP not working | `claude mcp list`, check config |
| Permission denied | Check `settings.local.json` |
| Hook blocking | Check hook exit code, review logic |

---

## The Golden Rules

1. **Always review changes** before accepting
2. **Use `/compact`** before context gets critical (>70%)
3. **Be specific** in requests (WHAT, WHERE, HOW, VERIFY)
4. **Plan Mode first** for complex/risky tasks
5. **Create CLAUDE.md** for every project
6. **Save frequently** — commit after each completed task

---

## How PAL Uses This

All commands and shortcuts above work inside PAL. Additionally, PAL adds:
- **Agent commands:** `/pal-builder`, `/life-coach`, `/product-manager` to load specialized personas
- **Agent menu commands:** `*menu`, `*context`, `*dismiss` for in-agent navigation
- **Skill activation:** Describe what you want in natural language — PAL routes to the right skill automatically

---

**Previous:** [04 — Requirements and Hooks](./04-requirements-and-hooks.md) | **Next:** [06 — Adoption Approaches](./06-adoption-approaches.md)
