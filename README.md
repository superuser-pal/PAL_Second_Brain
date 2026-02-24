# PAL Second Brain

> A pattern-based modular system that gives non-technical professionals the base and blocks to build AI automations and workflows through organized context engineering and modular design.

[![Version](https://img.shields.io/badge/version-0.1.0--alpha-blue.svg)](CHANGELOG.md)
[![Claude Code](https://img.shields.io/badge/powered%20by-Claude%20Code-orange.svg)]()

---

## What is PAL Second Brain?

PAL Second Brain (Patterned Agentic Logic) solves three fundamental problems in AI interaction: **context loss**, **knowledge fragmentation**, and **configuration complexity**.

Instead of starting every conversation from scratch—re-explaining who you are, what you're working on, and how you want responses—PAL maintains your persistent context, organized knowledge, and reusable workflows.

### Dual-Interface Architecture

PAL uses a **dual-interface architecture** that combines the best of both worlds:

- **[Obsidian](https://obsidian.md)** — Human-friendly reading, note-taking, and navigation
- **Claude Code** — AI-powered execution, automation, and context engineering

This pairing makes AI context engineering accessible to non-technical professionals who find developer IDEs intimidating, while providing the full power of programmatic AI workflows.

### Centralized Second Brain

At its core, PAL functions as a **knowledge management hub** where all information flows through a unified pipeline:

```
Inbox (capture) → Skills (process) → Domains (contextualize)
```

Every captured idea, note, or resource becomes part of the persistent context available to AI interactions.

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/pal-personal.git
cd pal-personal

# 2. Install dependencies
bun install

# 3. Start Claude Code in the directory
claude
```

**Recommended:** Open the folder in [Obsidian](https://obsidian.md) to have a more casual reading experience. Cursor, Antigravity and any other IDEs work perfect if you plan to enhance the experience with mutliple AI models. 

See [Docs/SETUP.md](Docs/SETUP.md) for detailed installation instructions.

---

## Features at a Glance

> Note: This is an Alpha release.

PAL v0.1 includes **8 skills** with **40 workflows**:

| Skill | Purpose | Workflows |
|-------|---------|-----------|
| **create-agent** | Create and validate domain agents | 3 |
| **create-domain** | Create project workspaces | 4 |
| **create-skill** | Build new PAL skills | 4 |
| **life-management** | Personal context (mission, beliefs, goals) | 3 |
| **note-taking** | Note pipeline from inbox to domains | 5 |
| **project-management** | Task and project tracking | 5 |
| **system-build** | Spec-driven PAL development | 11 |
| **system-cleaner** | System auditing and housekeeping | 5 |

See [Docs/FEATURES.md](Docs/FEATURES.md) for the complete feature catalog.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      USER LAYER                          │
│   ABOUTME.md • DIRECTIVES.md • CONTACTS.md              │
│   Your identity, preferences, and personal context       │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                     SYSTEM LAYER                         │
│   Skills • Agents • Workflows • Orchestration            │
│   How PAL processes your requests                        │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                    SECURITY LAYER                        │
│   GUARDRAILS.md • REPOS_RULES.md                        │
│   What PAL will never do                                 │
└─────────────────────────────────────────────────────────┘
```

### 8 Core Principles

1. **Context > Prompts** — Organized context beats clever prompts
2. **Plan-First Execution** — Review plans before execution
3. **Pattern-Based System** — Composable, reusable patterns for scalability
4. **Domain-Driven Documentation** — Siloed project workspaces
5. **Self Update System** — Modular evolution without rebuilds
6. **PAL Master with Sub-Agents** — Primary orchestrator with domain specialists
7. **Inbox-First Capture** — Friction-free entry point for all raw data
8. **Spec-Driven Development** — System evolution governed by persistent requirements

---

## Hooks

PAL uses three hooks to manage session lifecycle and security:

| Hook | When It Runs | What It Does |
|------|--------------|--------------|
| **SessionStart** | Session begins | Loads your context (USER + SYSTEM + SECURITY files) |
| **PreToolUse** | Before any tool runs | Validates against GUARDRAILS.md — blocks, warns, or allows |
| **Stop** | Session ends | Sends notifications, saves transcript, logs summary |

---

## Agents

Load specialized agents for focused work in specific domains:

| Agent | Role | Domain | Load Command |
|-------|------|--------|--------------|
| **PAL Master** | Primary orchestrator | System-wide | (default) |
| **PAL Builder** | System architect | PALBuilder | `/pal-builder` |
| **Life Coach** | Personal life management | LifeOS | `/life-coach` |


---

## Documentation

| Document | Description |
|----------|-------------|
| [ONBOARDING.md](START-HERE.md) | Getting started guide with Obsidian setup |
| [Docs/SETUP.md](Docs/SETUP.md) | Detailed installation instructions |
| [Docs/FEATURES.md](Docs/FEATURES.md) | Complete feature catalog |
| [CHANGELOG.md](CHANGELOG.md) | Version history |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute |

---

## License

MIT License - See [LICENSE](LICENSE) for details.

---

**Version:** 0.1.0-alpha
**Last Updated:** 2026-02-23
