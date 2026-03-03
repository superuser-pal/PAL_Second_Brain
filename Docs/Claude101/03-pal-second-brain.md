---
title: "03 - PAL Second Brain: How It Works"
description: "Domains, agents, skills, and the inbox — how PAL organizes your AI workspace"
tags: [guide, pal, domains, agents, skills]
series: PAL Second Brain Documentation
order: 3
---

# 03 — PAL Second Brain: How It Works

> Part of the [PAL Second Brain](https://github.com/yourusername/pal-second-brain) documentation series.

PAL Second Brain is a framework built on top of Claude Code. It uses CLAUDE.md, agents, skills, hooks, and commands to create a persistent, organized AI assistant that remembers who you are, what you're working on, and how you like things done.

---

## Domains: Your Project Workspaces

A **domain** is a project workspace — a folder with a standard structure that holds everything related to one area of your work.

```
Domains/MyProject/
├── INDEX.md              # Source of truth — what this domain is about
├── CONNECTIONS.yaml      # External links and integrations
├── 00_CONTEXT/           # Background info, reference docs
├── 01_PROJECTS/          # Active project files and plans
├── 02_SESSIONS/          # Logs of past work sessions
├── 03_PAGES/             # Notes, research, reference materials
├── 04_WORKSPACE/         # Drafts, generated outputs, staging area
└── 05_ARCHIVE/           # Completed or deprecated work
```

**Why this matters:**

- Every domain is **siloed** — context from one project doesn't bleed into another
- `INDEX.md` is always loaded first when you enter a domain, so the AI immediately knows the current state
- The folder structure is consistent across all domains, so navigation becomes muscle memory

**Example domains:**
- `Domains/PALBuilder/` — System development and specifications
- `Domains/LifeOS/` — Personal goals, beliefs, routines
- `Domains/MyStartup/` — Product work for a side project

---

## Agents: Specialized Personas for Deep Work

An **agent** is a specialized AI persona that loads specific context and stays in character for an extended work session. Agents are single `.md` files in `.claude/agents/`.

**How agents differ from PAL Master:**

| Aspect | PAL Master | Domain Agent |
|--------|-----------|--------------|
| **Role** | Generalist orchestrator | Domain specialist |
| **Context** | Full system (all layers) | Base + one domain |
| **Duration** | Quick tasks, routing | Extended sessions |
| **Activation** | Default at session start | Manual: `/agent-name` |

### The Context Loading Flow

When you load an agent, context loads in two groups:

**Group 1 — Base Context (always the same):**
- `ABOUTME.md` — Who you are
- `DIRECTIVES.md` — How the AI should behave
- `GUARDRAILS.md` — What the AI must never do

**Group 2 — Domain Context (specific to the agent):**
- `INDEX.md` — Loaded automatically (source of truth)
- All domain folders — Indexed but loaded on demand

```
You type: /pal-builder
           ↓
Step 1: Load agent persona (pal-builder.md)
Step 2: Load Base Context (ABOUTME, DIRECTIVES, GUARDRAILS)
Step 3: Load Domain Context (INDEX.md auto-loaded, folders indexed)
Step 4: Extract your name from ABOUTME.md
Step 5: Display greeting + command menu
Step 6: STOP — wait for your input
```

**Key rule:** Agents only load what they need. Files are indexed (the agent knows they exist) but not read until required. This keeps token usage low.

### Working with Agents

```bash
# Load an agent
/pal-builder              # System development agent
/life-coach               # Personal context agent
/product-manager          # Product strategy agent

# Inside an agent session
*menu                     # Show available commands
*context                  # See what's loaded
*dismiss                  # Return to PAL Master
```

Each agent has a **command menu** with numbered options. You can type the number, the `*command`, or just describe what you want in natural language.

---

## Skills: Reusable Capabilities

A **skill** is a packaged capability — a set of knowledge, workflows, and tools that the AI can use to perform specific tasks.

```
.claude/skills/note-taking/
├── SKILL.md              # Definition: what it does, when it activates
├── workflows/            # Step-by-step processes
│   ├── braindump.md      # Stream-of-consciousness capture
│   ├── process_inbox.md  # Add structure to raw notes
│   └── distribute_notes.md  # Route notes to domains
└── tools/                # CLI utilities (if any)
```

**Skills activate automatically.** Each skill has a `USE WHEN` trigger in its description. When your request conceptually matches, the skill activates without you needing to call it by name.

```yaml
# Example: note-taking SKILL.md
---
name: note-taking
description: Manage notes with semantic structure. USE WHEN process notes
  OR organize notes OR distribute notes OR braindump OR capture thoughts.
---
```

Say "I want to capture some thoughts" and the note-taking skill activates. No commands to memorize.

---

## The Inbox: Friction-Free Capture

PAL uses an **inbox-first** approach. All raw input flows into a single location before being processed and distributed:

```
You have a thought
    ↓
Drop it in Inbox/ (notes, tasks, URLs, documents)
    ↓
Processing skills add structure (frontmatter, categories)
    ↓
Distribution moves it to the right domain
    ↓
Domain context is enriched for future sessions
```

This means you never need to decide *where* something goes when you capture it. Capture first, organize later.

---

## How PAL Uses This

This is the foundation of the entire PAL system. Every other guide builds on these four concepts:

- **Domains** give your work structure and isolation
- **Agents** give you specialized help with focused context
- **Skills** automate recurring tasks like note processing
- **The Inbox** eliminates friction when capturing ideas

---

**Previous:** [02 — Core Concepts](./02-core-concepts.md) | **Next:** [04 — Requirements and Hooks](./04-requirements-and-hooks.md)
