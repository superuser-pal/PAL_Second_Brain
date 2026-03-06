# PAL Second Brain

> The AI-assisted second brain that connects your notes, ideas, and tasks into persistent context for agentic workflows.

[![Version](https://img.shields.io/badge/version-0.1.0--beta-blue.svg)](Docs/CHANGELOG.md)
[![Claude Code](https://img.shields.io/badge/powered%20by-Claude%20Code-orange.svg)]()
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## The Problem

Every time you open an AI chat, it feels like you start from zero or with outdated context. You re-explain your instructions, the latest key details of what you're working on, what you've already tried, and how you want things done. Your projects live in scattered notes, random folders, and half-remembered conversations that need constant updates with the latest details.

**PAL fixes this.**

PAL (Patterned Agentic Logic) is an open-source second brain that gives your AI **a spotless framework to handle context**, **organize knowledge**, and **process the information into systems** — so your AI operates with the same goals, history, and strategic intent as you do.

### Before PAL vs After PAL

| Without PAL                                                                                     | With PAL                                                                                     |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| "I'm working on the following project, where these are the latest tasks open. I want you to..." | "Present to me the latest ideas and open tasks from my project"                              |
| Notes scattered across apps, folders, and bookmarks                                             | One knowledge pipeline: Inbox → Process → Domain → Context                                   |
| Every session starts cold — no memory of past decisions                                         | Session hooks load your identity, preferences, and context automatically                     |
| "Here are my ideas related to this project, and here are my ideas to my other project..."       | Executes Braindump workflow, AI automatically sorts the details to the corresponding project |
| Generic AI responses with no understanding of the key moving details of your goals and project  | AI that knows your very last intent, progress on goals, and patterns of your ideas           |

---

## Quick Start

1. **Clone the repository**:

   ```bash
   git clone https://github.com/superuser-pal/PAL_Second_Brain
   cd PAL_Second_Brain
   ```

2. **Open in Obsidian**:
   Download [Obsidian](https://obsidian.md) and open the `PAL_Second_Brain` folder as a vault. This is your primary interface for reading and navigating your second brain.

3. **Install dependencies**:

   ```bash
   bun install
   ```

4. **Start Claude Code & Setup**:
   ```bash
   claude
   /setup-context
   ```

> **Note:** PAL runs on [Claude Code](https://claude.ai/download), which requires an active Anthropic subscription.

👉 **[START-HERE.md](START-HERE.md)** — Full onboarding guide for more details.

---

## Folder Structure

PAL's workspace is organized to keep focus sharp and context contained:

- **Domains/**: Your high-level workspaces (e.g., `Work`, `Personal`, `SideProjects`). Each domain is a siloed environment for its specific projects and notes.
- **Docs/**: The central hub for all guides, tutorials, and resources.
- **.claude/**: The **configuration layer** with PAL SB Core where you will find three layers:
  - `USER/`: Your details and preferences.
  - `SYSTEM/`: Files that dictate and explain the logic of the system.
  - `SECURITY/`: The guardrails that keep your data and interactions with AI safe.
- **Inbox/**: Your action-taking space. Drop raw thoughts, clipped articles, or quick tasks here to be processed later.

---

## Why PAL?

### 1. Context Engineering, Not Prompt Engineering

The best AI results don't come from clever prompts — they come from **organized context**. PAL structures your identity, projects, and preferences so the AI has everything it needs before you type a single word.

### 2. Built for Non-Technical Professionals

PAL pairs **Obsidian** (for reading and navigating your knowledge) with **Claude Code** (for AI-powered execution). No IDE experience required. If you can use a notes app, you can use PAL.

### 3. Your Data, Your Files, Your Control

Everything is local markdown files on your machine. No vendor lock-in, no cloud dependency, no proprietary formats. Fork it, customize it and ultimately migrate it if desired.

### 4. Modular by Design

Start with what you need, extend when friction appears. Every component — skills, agents, domains, hooks — is a standalone file you can add, edit, or remove without breaking anything else.

---

## Features at a Glance

> PAL v0.1 — Beta release. Core features are stable; some workflows and documentation are still being refined.

| Component     | Count | What They Do                                             |
| ------------- | ----- | -------------------------------------------------------- |
| **Skills**    | 8     | Reusable capabilities that activate by intent            |
| **Workflows** | 40    | Step-by-step processes within skills                     |
| **Agents**    | 3     | Specialized AI personas for focused work                 |
| **Domains**   | 2     | Siloed project workspaces                                |
| **Hooks**     | 3     | Automated lifecycle actions (security, context, logging) |

### Skills

| Skill                  | Purpose                                | Workflows |
| ---------------------- | -------------------------------------- | --------- |
| **note-taking**        | Capture, process, and distribute notes | 5         |
| **project-management** | Tasks, projects, and dashboards        | 5         |
| **life-management**    | Personal goals, beliefs, and mission   | 3         |
| **system-build**       | Spec-driven PAL development            | 11        |
| **create-domain**      | Create and manage project workspaces   | 4         |
| **create-skill**       | Build new reusable capabilities        | 4         |
| **create-agent**       | Create specialized AI personas         | 3         |
| **system-cleaner**     | Auditing and housekeeping              | 5         |

See [Docs/FEATURES.md](Docs/FEATURES.md) for the complete catalog with examples and triggers.

---

### The Knowledge Pipeline

Capture raw information and transform it into structured knowledge automatically.

| Stage          | Activity                       | Result                              |
| :------------- | :----------------------------- | :---------------------------------- |
| **Ingest**     | Drop notes/tasks into `/Inbox` | frictionless capture                |
| **Process**    | AI applies `note-taking` skill | categorized and structured markdown |
| **Distribute** | Move to correct `/Domain`      | contextually relevant persistence   |

All information flows through a unified pipeline:

```
Inbox (capture) → Skills (process) → Domains (contextualize)
```

Capture first, organize later. Every idea, note, and resource enriches your persistent context.

### The 8 PAL Design Principles

1. **Context beats prompts** — Organized context produces better AI results than clever prompts.
2. **Cost-conscious by design** — Every component is weighed against token cost, so the system stays efficient as it grows.
3. **Reusable patterns** — Skills and workflows are modular blocks you apply across projects, not one-off solutions.
4. **Built for non-technical users** — Obsidian replaces the terminal as your primary interface. If you can use a notes app, you can use PAL.
5. **Self-updating** — Skills and workflows can be added or modified without rebuilding anything else.
6. **Orchestrated, not monolithic** — PAL Master routes your requests to the right specialist agent, so context stays focused and relevant.
7. **Capture first** — The Inbox is frictionless by design. Drop anything in; organize it later.
8. **Spec-driven growth** — New features follow a formal spec process, so the system evolves without accumulating chaos.

---

## Hooks

| Hook             | When It Runs         | What It Does                                                           |
| ---------------- | -------------------- | ---------------------------------------------------------------------- |
| **SessionStart** | Session begins       | Loads your identity, preferences, and security rules automatically     |
| **PreToolUse**   | Before any tool runs | Validates every action against your guardrails — blocks risky ones     |
| **Stop**         | Session ends         | Sends a notification, saves the transcript, and logs a session summary |

---

## Agents

| Agent           | Role                                                        | Load Command   |
| --------------- | ----------------------------------------------------------- | -------------- |
| **PAL Master**  | Primary orchestrator — routes requests to skills and agents | _(default)_    |
| **PAL Builder** | System architect for PAL development                        | `/pal-builder` |
| **Life Coach**  | Personal life management (goals, beliefs, mission)          | `/life-coach`  |

---

## Documentation

| Document                                               | Description                                                     |
| ------------------------------------------------------ | --------------------------------------------------------------- |
| **[START-HERE.md](START-HERE.md)**                     | Onboarding guide — Obsidian setup, first session, core concepts |
| **[Docs/PAL101/](Domains/PALOpenSource/Docs/PAL101/)** | 14-part guide to mastering Claude Code and PAL                  |
| **[Docs/FEATURES.md](Docs/FEATURES.md)**               | Complete feature catalog with all skills, agents, and workflows |
| **[Docs/CHANGELOG.md](Docs/CHANGELOG.md)**             | Version history                                                 |
| **[Docs/CONTRIBUTING.md](Docs/CONTRIBUTING.md)**       | How to contribute                                               |

---

## Contributing

PAL is open source and welcomes contributions. Whether it's a new skill, a bug fix, documentation improvement, or a domain template — check [Docs/CONTRIBUTING.md](Docs/CONTRIBUTING.md) to get started.

---

## License

MIT License — See [LICENSE](LICENSE) for details.

---

**Version:** 0.1.0-beta
**Last Updated:** 2026-03-02
