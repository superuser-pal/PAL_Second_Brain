---
title: "04 - Requirements and Hooks"
description: "How PAL enforces behavior through documented specs and lifecycle hooks"
tags: [guide, pal, requirements, hooks, security]
series: PAL Second Brain Documentation
order: 4
---

# 04 — Requirements and Hooks

> Part of the [PAL Second Brain](https://github.com/yourusername/pal-second-brain) documentation series.

PAL uses two systems to ensure consistent behavior: **requirements** (what the system should do) and **hooks** (how it enforces behavior automatically).

---

## Requirements: The System Specification

PAL has **167 documented requirements** across 5 areas, all written in plain-language Given-When-Then format:

| Document | What It Covers | Example |
|----------|---------------|---------|
| **Core System** | Architecture, naming, sessions, errors | "Given a user starts a session, When it initializes, Then base context loads" |
| **Skills** | All 9 skills and their behaviors | "Given a braindump command, When user provides text, Then it's saved with frontmatter" |
| **Agents** | All agents and common behaviors | "Given an agent completes activation, Then it STOPS and waits for input" |
| **Commands** | Agent loading, session management | "Given a session ends, When summary generates, Then friction points are flagged" |
| **Tools and Hooks** | Lifecycle automation and security | "Given content contains API keys, When written to file, Then operation is BLOCKED" |

**Why requirements matter for you:**
- Every PAL behavior is traceable to a documented spec
- You can read the requirements to understand what PAL should do
- If something doesn't match the spec, it's a bug

Requirements live in `Domains/PALBuilder/03_REQUIREMENTS/` and use hierarchical IDs (e.g., `1.4.3` = Skills > note-taking > 3rd requirement).

---

## Hooks: Automated Lifecycle Behavior

**Hooks** are TypeScript scripts that run automatically at specific points in the session lifecycle. PAL uses three hooks:

### session-start: Context Loading

**Runs when:** A Claude Code session begins

**What it does:**
1. Reads all base context files from `.claude/core/`
2. Loads them in priority order (USER files first, then SYSTEM, then SECURITY)
3. Displays a summary banner showing what was loaded

```
═══════════════════════════════════════════════
PAL CORE CONTEXT LOADING
═══════════════════════════════════════════════
[USER] ABOUTME.md (Priority: 1)
[USER] DIRECTIVES.md (Priority: 2)
[SYSTEM] ARCHITECTURE.md (Priority: 11)
[SYSTEM] ORCHESTRATION.md (Priority: 12)
[SECURITY] GUARDRAILS.md (Priority: 21)
───────────────────────────────────────────────
Loaded: 14 files
═══════════════════════════════════════════════
```

**This is why PAL "remembers" you.** Before you type anything, the AI already knows your name, preferences, and system rules.

### pre-tool-use: Security Validation

**Runs when:** Before every tool call (Read, Write, Edit, Bash)

**What it does:** Checks each operation against security rules and decides: allow, warn, or block.

| Check | Action | Example |
|-------|--------|---------|
| **Credentials in content** | BLOCK | API keys, passwords, private keys |
| **Restricted file paths** | BLOCK | `/etc/`, `~/.ssh/`, `.env` files |
| **Dangerous commands** | BLOCK | `rm -rf /`, `chmod 777`, `DROP TABLE` |
| **PII detected** | WARN | Email addresses, phone numbers |
| **Destructive git ops** | WARN | `git reset --hard`, `git stash drop` |

**Safe patterns are allowed:** Environment variable references (`process.env.API_KEY`) pass through because they don't expose the actual secret.

### stop: Session End

**Runs when:** A session ends

**What it does:**
- Sends a macOS notification ("PAL SESSION COMPLETE")
- Prints a summary banner with timestamp

---

## How Context Flows Through the System

Putting it all together — here's what happens from the moment you start a session to when you're working inside a domain:

```
1. You start Claude Code
        ↓
2. session-start hook fires
   → Loads USER files (ABOUTME, DIRECTIVES, TERMINOLOGY, CONTACTS)
   → Loads SYSTEM files (ARCHITECTURE, ORCHESTRATION, etc.)
   → Loads SECURITY files (GUARDRAILS, REPOS_RULES)
        ↓
3. PAL Master is active (generalist, full context)
   → You can ask questions, run skills, route tasks
        ↓
4. You load a domain agent: /product-manager
   → Agent persona loads
   → Base Context loads (ABOUTME, DIRECTIVES, GUARDRAILS)
   → Domain Context loads (INDEX.md auto, folders indexed)
   → Greeting displays, agent waits for input
        ↓
5. You work inside the domain
   → Every tool call passes through pre-tool-use hook
   → Security rules enforced automatically
   → Agent stays in character until *dismiss
        ↓
6. You end the session
   → stop hook fires (notification + summary)
```

**The result:** You never explain who you are. You never manually load project context. You never worry about accidentally writing credentials to a file. The hooks handle it all.

---

## How PAL Uses This

This entire guide describes PAL's core infrastructure. The three hooks (session-start, pre-tool-use, stop) are the automated backbone that makes PAL work without manual setup. The 167 documented requirements serve as the system's specification — if something doesn't match the spec, it's a bug you can trace and fix.

---

**Previous:** [03 — PAL Second Brain](./03-pal-second-brain.md) | **Next:** [05 — Cheatsheet](./05-cheatsheet.md)
