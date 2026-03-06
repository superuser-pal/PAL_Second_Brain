---
title: "01 - Welcome to PAL"
description: "What PAL is, the PADA method, how it's built, and getting started"
tags: [guide, getting-started, pal]
series: PAL Second Brain Guide
order: 1
---

# 01 — Welcome to PAL

> Your AI-powered second brain — organized, persistent, and built to make your interactions with AI actually stick.

---

## What is PAL?

PAL (Patterned Agentic Logic) is basically how I handle context. I got tired of repeating myself to Claude every single session—re-explaining my stack, my preferences, and what I was working on ten minutes ago.

So I built PAL on top of Claude Code and Obsidian. It’s a framework that ensures the AI **remembers who you are**, **knows your projects**, and **picks up exactly where you left off**. No more starting from scratch every morning.

When you start a session, PAL automatically loads your identity and project goals. You just say what you need, and PAL handles the rest.

---

## The PADA Method: Domains First

PAL uses the **PADA method** to keep things sane. The core idea is simple:

> **Start with a Domain.**

A **Domain** is just a workspace for one specific part of your life. It's a folder with its own context and, if you want, its own specialized AI agent.

```
Examples:
  Work/         → Client work, meetings, codebases
  LifeOS/       → Personal goals, routines, "lessons learned"
  SideProject/  → That app idea you're hacking on
  Learning/     → Courses, research, reading notes
```

**Why do this?** AI works best when it isn't drowning in irrelevant data. Keeping your "Work" context away from your "Personal Goals" means less noise and better results.

Inside a domain, you can add:

- **Projects**: Specific initiatives with their own deadlines or tasks.
- **Agents**: Specialized AI personas (like a "Technical Architect" or "Life Coach") that live in that domain.

We'll set these up together in the [next guide](./02-domains-and-projects.md).

---

## How PAL works (under the hood)

Everything lives inside `.claude/` and is split into three layers:

1. **USER**: Your identity. This is where `ABOUTME.md` and `DIRECTIVES.md` live. It's the "who you are" part.
2. **SYSTEM**: The logic. Skills, agents, and the orchestration that makes PAL move.
3. **SECURITY**: The "never do this" list. `GUARDRAILS.md` keeps things safe.

### The Building Blocks

- **Skills**: These are automatic. If you say "take a note," PAL knows to use the note-taking skill. You don't have to memorize commands.
- **Agents**: These are for deep work. You can switch to a specialized persona (like `/life-coach`) when you need a specific expertise.
- **Domains**: The 6-folder structure that keeps your files organized. Every domain has an `INDEX.md`—that's the first thing PAL reads when you step inside.

---

## Getting Started

### 1. Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

> Requires an Anthropic subscription. See [claude.com/pricing](https://claude.com/pricing).

### 2. Open Obsidian

1. Download [Obsidian](https://obsidian.md)
2. Open folder as vault → select your `pal-second-brain` folder
3. Trust the author when prompted

### 3. Run Your First Session

```bash
cd ~/path/to/pal-second-brain
claude
```

Then run the setup command:

```
/setup-context
```

PAL will walk you through questions to populate your identity and preferences. Once complete, your context loads automatically every session.

### 4. Explore

| Command    | What It Does                 |
| ---------- | ---------------------------- |
| `*menu`    | Display available commands   |
| `*skills`  | List all skills              |
| `*agents`  | Show domain agents           |
| `*context` | See what's loaded in context |

---

**Next:** [02 — Domains & Projects](./02-domains-and-projects.md)
