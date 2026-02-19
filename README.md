# PAL Second Brain

> A pattern-based modular system created for non-technical and AI curious people to build AI systems through organized context engineering, structured navigation, and simple modular configuration.

[![Version](https://img.shields.io/badge/version-0.1.0--alpha-blue.svg)](CHANGELOG.md)
[![Claude Code](https://img.shields.io/badge/powered%20by-Claude%20Code-orange.svg)]()

---

## What is PAL Second Brain?

PAL Second Brain (Patterned Agentic Logic) is an AI-powered system that helps you organize your thoughts, manage projects, and interact with AI through structured context. Instead of starting every conversation from scratch, the PAL Domain Agent Logic loads the configured context, skills, and workflows to Cluade Code. 

The System Logic of PAL is organized to give the user an easy understanding of its structure, how it can be changed, and, most importantly, how it can be scaled. I want users to thrive in understanding the basic concepts of Agentic Frameworks, with the knowledge needed to truly own the next AI workflow.

I created the system backed by the Agentic Frameworks used today to build software using AI. Highly complex workflows are reduced to their minimal expression for clear understanding of those who are just approaching the "hello world" moment. 

All this is possible with the technology, teachings, and ways from Antropic Colossus, Claude Code. Adoption of Claude would not be possible without the clear direction, research, and papers under your sponsorship. Thank you. 

## Why Obsidian?

**PAL is designed to be used with [Obsidian](https://obsidian.md)** for the best reading and navigation experience, while providing Claude Code as the AI engine behind it.

 Any other IDE, such as Cursor, Anti-Gravity, or Visual Studio, will also work.

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

Caution: This is an Alpha release....

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

### 10 Core Principles

1. **Technical-Literate First** — Learn how it works, not just what it does
2. **Context > Prompts** — Organized context beats clever prompts
3. **Plan-First Execution** — Review plans before execution
4. **Pattern-Based System** — Composable, reusable patterns for scalability
5. **Use of Code Conciussly** — Deterministic code for critical operations only
6. **Domain-Driven Documentation** — Siloed project workspaces
7. **Self Update System** — Modular evolution without rebuilds
8. <mark style="background:#fff88f">Pattern Library Management — Educational documentation</mark>
9. <mark style="background:#fff88f">PAL Master with Sub-Agents — Orchestrator + specialists</mark>
10. <mark style="background:#fff88f">Permission to Fail — Transparent error handling</mark>

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

| Agent           | Role                     | Domain      | Load Command   |
| --------------- | ------------------------ | ----------- | -------------- |
| **PAL Master**  | Primary orchestrator     | System-wide | (default)      |
| **PAL Builder** | System architect         | PALBuilder  | `/pal-builder` |
| **Life Coach**  | Personal life management | LifeOS      | `/life-coach`  |


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
**Last Updated:** 2026-02-16

## To Add

Operation flows
How context is Managed? 
We go from Agent - Domain - Goal - Action 

Two layers 
Configuration (.claude)
Action (Inbox, Ports, Domains)

Scaling the system
Use PAL Builder
Spec-inspired development

What are patterns? 
A modular based approach 



### Three-Layer Architecture

| Layer        | Purpose           | What It Contains                        |
| ------------ | ----------------- | --------------------------------------- |
| **USER**     | Your identity     | Preferences, contacts, personal context |
| **SYSTEM**   | How PAL works     | Workflows, routing logic, orchestration |
| **SECURITY** | What PAL won't do | Safety rules, data policies             |
