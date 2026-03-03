---
title: "01 - Getting Started"
description: "Installation, first workflow, essential commands, and setting up Obsidian"
tags: [guide, getting-started, reference]
series: PAL Second Brain Documentation
order: 1
---

# 01 — Getting Started

> Part of the [PAL Second Brain](https://github.com/yourusername/pal-second-brain) documentation series.

---

## Before You Start

This guide is a community resource, not official Anthropic documentation. Use critically, experiment, and share what works for you.

---

## Table of Contents

1. [Installation](#installation)
2. [Obsidian Setup](#obsidian-setup)
3. [First Workflow](#first-workflow)
4. [Essential Commands](#essential-commands)
5. [Permission Modes](#permission-modes)
6. [Common Mistakes](#common-mistakes)

---

## Installation

### Install Claude Code

```bash
# Universal (requires Node.js)
npm install -g @anthropic-ai/claude-code

# macOS alternatives
brew install claude-code
curl -fsSL https://claude.ai/install.sh | sh
```

### Verify and Update

```bash
claude --version       # Check installation
claude update          # Update to latest
claude doctor          # Verify system health
```

### First Launch

```bash
cd your-project
claude
```

On first launch, you'll authenticate with your Anthropic account and accept terms of service.

> Claude Code requires an active Anthropic subscription. See [claude.com/pricing](https://claude.com/pricing) for plans.

---

## Obsidian Setup

PAL uses **Obsidian** as its primary interface for navigating and managing your second brain. While Claude Code runs in the terminal, Obsidian is where you read, browse, and organize your knowledge.

### Install Obsidian

1. Download from [obsidian.md](https://obsidian.md/)
2. Install and open the app
3. Select **"Open folder as vault"**
4. Navigate to your PAL project root directory

### Recommended Plugins

Install these from **Settings > Community Plugins > Browse**:

| Plugin | Purpose |
|--------|---------|
| **Tasks** | Track and manage tasks across your vault |
| **Dataview** | Query and visualize your notes like a database |
| **Calendar** | Visual calendar for daily notes and sessions |
| **Excalidraw** | Hand-drawn diagrams and visual thinking |
| **Templater** | Template system for consistent note creation |

### Opening PAL as a Vault

Once Obsidian opens your PAL folder, you'll see the full structure:

- **Domains/** — Your project workspaces
- **Inbox/** — Captured notes and tasks
- **.claude/** — System files (agents, skills, hooks)

Navigate domains, read INDEX.md files, and browse session logs — all through Obsidian's sidebar and search.

---

## First Workflow

Let's process some notes together. This demonstrates the core interaction loop.

### Step 1: Describe What You Need

```
You: I have some rough notes in my inbox. Help me organize them into the right domains.
```

### Step 2: Claude Analyzes

Claude will:

- Read the notes in your Inbox folder
- Check your domain INDEX.md files for context
- Suggest where each note belongs
- Propose the moves

### Step 3: Review the Changes

Claude shows you what it plans to do. **Always read the proposed changes before accepting.**

### Step 4: Accept or Reject

- Press `y` to accept
- Press `n` to reject and ask for alternatives

### Step 5: Verify

```
You: Show me what's in my Domains/MyProject/ folder now
```

---

## Essential Commands

### Commands

| Command | Action | When to Use |
|---------|--------|-------------|
| `/help` | Show all commands | When you're lost |
| `/clear` | Clear conversation | Start fresh |
| `/compact` | Summarize context | Running low on context |
| `/status` | Show session info | Check context usage |
| `/exit` or `Ctrl+D` | Exit Claude Code | Done working |
| `/plan` | Enter Plan Mode | Safe exploration |

### Shortcuts

| Shortcut | Action | Example |
|----------|--------|---------|
| `@file` | Reference a specific file | `@Domains/MyProject/INDEX.md` |
| `!command` | Run shell command directly | `!git status` |
| `Ctrl+C` | Cancel current operation | Stop long-running analysis |
| `Esc` | Stop Claude mid-action | Interrupt current operation |

### File References with @

Reference specific files in your prompts for targeted operations:

```
Review @Domains/MyProject/INDEX.md for outdated information

Check @Inbox/Notes/ for unprocessed notes

Look at @.claude/skills/note-taking/SKILL.md for the workflow
```

**Why use @**: Precision (target exact files), speed (skip discovery), and clarity (explicit intent).

---

## Permission Modes

Claude Code has five permission modes that control how much autonomy Claude has:

| Mode | What Happens | Best For |
|------|-------------|----------|
| **Default** | Asks before editing, commands, commits | Learning and careful work |
| **acceptEdits** | Auto-approves file edits, asks for commands | Trusted editing sessions |
| **Plan Mode** (`/plan`) | Read-only, no modifications | Exploring and understanding |
| **dontAsk** | Only runs pre-approved tools | Restrictive workflows |
| **bypassPermissions** | Auto-approves everything | Sandboxed CI/CD only |

Start with **Default** mode. Switch to **Plan Mode** when you want to explore without making changes.

---

## Common Mistakes

### 1. Skipping the Plan

**Mistake**: Jumping straight into a task without context.

**Fix**: Use the WHAT/WHERE/HOW/VERIFY format:

```
WHAT: Process my inbox notes and distribute them
WHERE: Inbox/Notes/
HOW: Add frontmatter, categorize, move to correct domains
VERIFY: Each note has frontmatter and is in the right domain
```

### 2. Ignoring Context Limits

**Mistake**: Working until context hits 95% and responses degrade.

**Fix**: Watch `Ctx(u):` in the status line. `/compact` at 70%, `/clear` at 90%.

### 3. Accepting Changes Blindly

**Mistake**: Hitting "y" without reading what changed.

**Fix**: Always review proposed changes. Use "n" to reject, then explain what's wrong.

### 4. Mixing Unrelated Tasks

**Mistake**: "Organize my inbox AND update my goals AND review my projects"

**Fix**: One focused task per session. `/clear` between different tasks.

### 5. Treating Claude Like a Chatbot

**Mistake**: Typing ad-hoc instructions every session instead of building structured context.

**Fix**: Build context that compounds over time:

- **CLAUDE.md**: Your conventions and preferences — loaded every session
- **Skills**: Reusable workflows for consistent execution
- **Hooks**: Automated guardrails — zero manual effort

---

## How PAL Uses This

PAL Second Brain builds on everything in this guide. When you install Claude Code and run it inside a PAL project, the `session-start` hook automatically loads your identity, preferences, and system rules — so you skip manual setup and go straight to productive work.

To understand how PAL extends Claude Code with domains, agents, and skills, continue to [03 — PAL Second Brain](./03-pal-second-brain.md).

---

**Next:** [02 — Core Concepts](./02-core-concepts.md)
