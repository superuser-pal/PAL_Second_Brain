---
title: "11 - Third-Party Tools"
description: "Community tools for token tracking, session management, and alternative UIs"
tags: [reference, integration, tools]
series: PAL Second Brain Documentation
order: 11
---

# 11 — Third-Party Tools

> Part of the [PAL Second Brain](https://github.com/yourusername/pal-second-brain) documentation series.

Community tools for token tracking, session management, configuration, and alternative UIs. Last verified February 2026.

---

## For Second Brain Users

Not all tools in this list are equally relevant if you're using PAL as a second brain (rather than for software development). Here's what matters most:

| Your Need | Recommended Tool | Why |
|-----------|-----------------|-----|
| Track how much you're spending | **ccusage** | Simple cost reports from local data |
| Reduce token usage on commands | **RTK** | Filters output before it hits context |
| Browse past session conversations | **claude-code-viewer** | Visual UI for session history |
| Run multiple agents in parallel | **multiclaude** | Multiple PAL agents on git worktrees |

Everything else below is useful reference — browse as needed.

---

## Token and Cost Tracking

### ccusage

The most mature cost tracking tool. Parses local session data for cost reports.

| Attribute | Details |
|-----------|---------|
| **Install** | `bunx ccusage` (fastest) or `npx ccusage` |
| **Source** | [npm: ccusage](https://www.npmjs.com/package/ccusage) |

**Key features**: Daily/monthly/session reports, per-model cost split, JSON output, macOS widget, MCP server integration.

### ccburn

Visual token burn-rate tracking in the terminal.

| Attribute | Details |
|-----------|---------|
| **Install** | `pip install ccburn` |
| **Source** | [GitHub: JuanjoFuchs/ccburn](https://github.com/JuanjoFuchs/ccburn) |

**Key features**: Terminal charts, burn-rate indicators, visual budget tracking.

### RTK (Rust Token Killer)

Filters command outputs **before** they reach Claude's context. Saves 60-90% on common commands.

| Attribute | Details |
|-----------|---------|
| **Install** | `brew install rtk-ai/tap/rtk` or `cargo install rtk` |
| **Source** | [GitHub: rtk-ai/rtk](https://github.com/rtk-ai/rtk) |

**When to use**: RTK **reduces** consumption (preprocessing). ccusage/ccburn **monitor** it (postprocessing). Use both together.

---

## Session Management

### claude-code-viewer

Web-based UI for browsing Claude Code conversation history.

| Attribute | Details |
|-----------|---------|
| **Install** | `npx @kimuson/claude-code-viewer` |
| **Source** | [GitHub: d-kimuson/claude-code-viewer](https://github.com/d-kimuson/claude-code-viewer) |

**Key features**: Project browser, conversation display with syntax highlighting, real-time updates.

### Entire CLI

Agent-native platform with rewindable checkpoints and governance.

| Attribute | Details |
|-----------|---------|
| **Install** | See [GitHub: entireio/cli](https://github.com/entireio/cli) |
| **Status** | Early access (launched Feb 2026) |

**Key features**: Session capture, rewindable checkpoints, governance layer, agent handoffs.

**Use when**: You need session replay, enterprise compliance, or multi-agent workflows.

---

## Configuration Management

### claude-code-config

TUI for managing Claude Code configuration, focused on MCP server management.

| Attribute | Details |
|-----------|---------|
| **Install** | `pip install claude-code-config` |

### AIBlueprint

Scaffolds pre-configured Claude Code setups with hooks and commands.

| Attribute | Details |
|-----------|---------|
| **Install** | `npx aiblueprint-cli` |

---

## Alternative UIs

### Claude Chic

Styled terminal UI with color-coded messages and collapsible tool blocks.

| Attribute | Details |
|-----------|---------|
| **Install** | `uvx claudechic` |
| **Status** | Alpha |

### Toad

Universal terminal frontend supporting Claude Code alongside 12+ other AI agents.

| Attribute | Details |
|-----------|---------|
| **Install** | `curl -fsSL batrachian.ai/install \| sh` |
| **Author** | Will McGugan (creator of Rich and Textual) |

### Conductor

macOS desktop app for orchestrating multiple Claude Code instances in parallel.

| Attribute | Details |
|-----------|---------|
| **Install** | [conductor.build](https://docs.conductor.build) |
| **Platform** | macOS only |

---

## Multi-Agent Orchestration

Tools for running multiple Claude Code instances in parallel:

| Tool | Type | Key Feature |
|------|------|-------------|
| [Gas Town](https://github.com/steveyegge/gastown) | Multi-agent workspace | Agent-first workspace manager |
| [multiclaude](https://github.com/dlorenc/multiclaude) | Multi-agent spawner | tmux + git worktrees |
| [agent-chat](https://github.com/justinabrahms/agent-chat) | Monitoring UI | Real-time monitoring |
| [Conductor](#conductor) | Desktop app | macOS parallel agents |

---

## Known Gaps

As of February 2026:

| Gap | Description |
|-----|-------------|
| **Visual skills editor** | No GUI for creating/editing skills — must edit manually |
| **Visual hooks editor** | No GUI for managing hooks — requires JSON editing |
| **Unified admin panel** | No single dashboard combining config, sessions, cost, and MCP |
| **Cross-platform config sync** | No tool syncs Claude Code config across machines |

---

## How PAL Uses This

PAL works alongside these community tools. Recommended combinations:

| Your Need | Recommended Tool | Why |
|-----------|-----------------|-----|
| Track API costs | ccusage | `bunx ccusage daily` — works out of the box |
| Reduce token usage | RTK | Filters command output before it hits context |
| Browse session history | claude-code-viewer | Visual UI for JSONL session files |
| Parallel agents | multiclaude | Run multiple PAL agents on git worktrees |

PAL's built-in session commands (`/sessions:*`) cover basic session management. Use the tools above when you need deeper analytics or cost tracking.

---

**Previous:** [10 — Observability](./10-observability.md) | **Next:** [12 — AI Ecosystem](DELETE-12-ai-ecosystem.md)
