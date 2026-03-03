---
title: "10 - Session Observability"
description: "Track Claude Code usage, estimate costs, and identify patterns across sessions"
tags: [observability, guide, performance]
series: PAL Second Brain Documentation
order: 10
---

# 10 — Session Observability

> Part of the [PAL Second Brain](https://github.com/yourusername/pal-second-brain) documentation series.

Track your second brain usage, estimate costs, and identify patterns across sessions.

---

## Why Monitor Sessions

Your second brain usage can accumulate quickly, especially during active organization and processing sessions. Monitoring helps you:

- **Understand costs**: Estimate API spend before invoices arrive
- **Identify patterns**: See which domains you work in most, which files get read repeatedly
- **Optimize workflow**: Find inefficiencies (e.g., repeatedly loading the same large INDEX.md)
- **Track projects**: Compare usage across different domains

---

## Session Search and Resume

After weeks of using Claude Code, finding past conversations becomes challenging.

### Native Commands

| Command | Use Case |
|---------|----------|
| `claude -c` / `claude --continue` | Resume most recent session |
| `claude -r <id>` / `claude --resume <id>` | Resume specific session by ID |
| `claude --resume` | Interactive session picker |

Sessions are stored locally at `~/.claude/projects/<project>/` as JSONL files.

### Recommended: session-search.sh

Zero-dependency bash script optimized for speed with ready-to-use resume commands.

```bash
# Install
mkdir -p ~/.claude/scripts
# Download or create session-search.sh in ~/.claude/scripts/cs
chmod +x ~/.claude/scripts/cs
echo "alias cs='~/.claude/scripts/cs'" >> ~/.zshrc
source ~/.zshrc
```

**Usage:**

```bash
cs                          # List 10 most recent sessions
cs "inbox processing"       # Search for specific sessions
cs -n 20                    # Show 20 results
cs --since 7d               # Sessions from last 7 days
```

**Output:**

```
2026-01-15 08:32 | my-project             | Process inbox notes and...
  claude --resume 84287c0d-8778-4a8d-abf1-eb2807e327a8

2026-01-14 21:13 | other-project          | Review weekly goals...
  claude --resume 1340c42e-eac5-4181-8407-cc76e1a76219
```

Copy-paste the `claude --resume` command to continue any session.

---

## Cost Tracking

### Understanding Costs

The statusline shows current session cost:

```
Claude Code | Ctx(u): 45% | Cost: $0.23 | Session: 1h 23m
```

**Typical session costs:**

| Session Type | Approximate Cost |
|-------------|-----------------|
| Quick task (5-10 min) | $0.05 - $0.10 |
| Extended work (1-2 hours) | $0.20 - $0.50 |
| Deep session (half day) | $1.00 - $2.00 |

### Cost Optimization Tips

1. **Be specific**: "Check @Domains/MyProject/INDEX.md for outdated info" costs less than "review my project"
2. **Use `/compact` proactively**: At 70% context, before quality degrades
3. **Choose the right model**: Haiku for simple tasks, Sonnet for most work, Opus for complex analysis
4. **Limit what gets loaded**: Reference specific files instead of entire directories

### Community Cost Tracker: ccusage

```bash
bunx ccusage daily    # Today's costs
bunx ccusage monthly  # Current month
```

Reads directly from local session files. No data sent externally.

---

## Activity Monitoring

### What Gets Logged

Every tool call Claude Code makes is recorded in session JSONL files. You can audit:

| Tool | What It Shows |
|------|--------------|
| `Read` | Files accessed (which domain files, INDEX.md, notes) |
| `Write` / `Edit` | Files modified (note edits, INDEX.md updates) |
| `Bash` | Commands executed |
| `Glob` / `Grep` | Search patterns and scope |

### Quality Signals from Logs

Three patterns that signal your configuration needs updating:

**Repeated reads of the same file**: If Claude reads the same file 3+ times in one session, the content it needs probably isn't where it expects. Consider moving relevant context into INDEX.md or CLAUDE.md.

**Tool failures on the same command**: A command that fails repeatedly across sessions usually means a skill has an outdated path or workflow step.

**High edit frequency on the same file**: Files edited heavily across sessions often indicate missing context — the file's purpose isn't clear to the agent.

---

## External Monitoring Tools

| Tool | Purpose | Install |
|------|---------|---------|
| **ccusage** | Cost tracking from session files | `bunx ccusage` |
| **ccburn** | Visual token burn-rate charts | `pip install ccburn` |
| **claude-code-viewer** | Browse conversation history | `npx @kimuson/claude-code-viewer` |
| **ccboard** | Unified dashboard (TUI + Web) | `cargo install ccboard` |

### Decision Guide

```
Want cost numbers fast?          → ccusage
Prefer visual burn-rate charts?  → ccburn
Want to browse past sessions?    → claude-code-viewer
Want a persistent dashboard?     → ccboard
```

---

## Patterns and Best Practices

### Weekly Review

Set a reminder to review weekly stats:

```bash
bunx ccusage daily --days 7
```

Look for:
- Unusually high-cost days
- Which domains consume the most context
- Repeated operations on the same files (efficiency signal)

### Per-Domain Tracking

Notice which domains you spend the most time in. If one domain consistently requires more context than others, its INDEX.md might need updating to provide better upfront context.

### Log Rotation

Logs accumulate over time. Clean up periodically:

```bash
find ~/.claude/logs -name "*.jsonl" -mtime +30 -delete
```

---

## Limitations

### What Monitoring Cannot Do

| Limitation | Reason |
|------------|--------|
| **Exact token counts** | CLI doesn't expose API token metrics |
| **Actual API costs** | Token estimates are heuristic, not from billing |
| **Real-time streaming metrics** | Hooks run after tool completes |

### What You Can Trust

- **Tool usage counts**: Exact count of each tool invocation
- **File access patterns**: Which files were touched
- **Relative comparisons**: Day-to-day and domain-to-domain trends
- **Operation timing**: When tools were used

---

## How PAL Uses This

PAL has a built-in session management system via the `/sessions:*` commands:

- `/sessions:session-start [name]` — Creates a timestamped session file with goals and system snapshot
- `/sessions:session-update` — Appends progress and friction flags
- `/sessions:session-end` — Generates a two-part summary (accomplishments + system improvement notes)
- `/sessions:session-review` — Aggregates improvement notes across all sessions, grouped by category

This gives you session observability without external tools. For cost tracking, the community tools described above (ccusage, ccburn) work alongside PAL.

---

**Previous:** [09 — Agent Evaluation](./09-agent-evaluation.md) | **Next:** [11 — Third-Party Tools](./11-third-party-tools.md)
