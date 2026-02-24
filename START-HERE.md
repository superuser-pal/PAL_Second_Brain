# PAL Second Brain - Onboarding Guide

> Everything you need to get started with PAL Second brain

**Version:** 0.1.0-alpha
**Last Updated:** 2026-02-16

---

## PAL Introduction

PAL (Patterned Agentic Logic) is an AI-powered second brain that helps you:

- **Organize your thoughts** — Capture ideas, process notes, track projects
- **Manage your projects** — Structured domains with tasks and session logs
- **Merge them with AI** — Through a structured context that remembers who you are

**Instead of starting every conversation from scratch, PAL remembers your identity, preferences, and current work.**

### The 8 Core Principles

1. **Context > Prompts** — Organized context beats clever prompts
2. **Plan-First Execution** — Review plans before execution
3. **Pattern-Based System** — Composable, reusable patterns
4. **Domain-Driven Documentation** — Siloed project workspaces
5. **Self Update System** — Modular evolution without rebuilds
6. **PAL Master with Sub-Agents** — Primary orchestrator with domain specialists
7. **Inbox-First Capture** — Friction-free entry point for all raw data
8. **Spec-Driven Development** — System evolution governed by persistent requirements

### What You'll Learn

- How to set up Obsidian for the best experience
- How to run your first PAL session
- Core concepts: skills, agents, domains, hooks included in the Alpha version
- Technical foundations for working with PAL

---

## Prerequisites

Before you begin, ensure you have:

| Requirement     | Purpose                                     |
| --------------- | ------------------------------------------- |
| **macOS**       | PAL's primary tested platform               |
| **Git**         | Version control                             |
| **Bun**         | Package manager and runtime                 |
| **Claude Code** | AI interaction layer                        |
| **Obsidian**    | Reading and navigation (highly recommended) |

See [Docs/SETUP.md](Docs/SETUP.md) for installation instructions.

---

## Part 1: Setting Up Obsidian (Recommended)

### Why Obsidian?

PAL is designed as a "second brain" — Obsidian provides the best reading experience:

- **Beautiful rendering** — Markdown files display with proper formatting, links, and diagrams
- **Graph view** — Visualize connections between domains, skills, and projects
- **Quick navigation** — Jump to any file instantly with Cmd+O
- **Better than any IDE** — Obsidian is built for knowledge management, not code editing

**PAL + Obsidian = Your AI-powered second brain with a easy to read interface and amazing plug-ins**

### Installing Obsidian

1. Go to [obsidian.md](https://obsidian.md)
2. Download for macOS
3. Install the application
4. Open Obsidian

### Opening PAL as a Vault

1. In Obsidian, click **Open folder as vault**
2. Navigate to your `pal-personal` directory
3. Click **Open**
4. When prompted, click **Trust author and enable plugins**

Your PAL files are now accessible in Obsidian's file browser on the left.

### Install Claudian

[Claudian](https://github.com/YishenTu/claudian) is an Obsidian plugin that embeds Claude Code as an AI collaborator in your vault.

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/YishenTu/claudian/releases/latest).
2. Create a folder called `claudian` in your vault's plugins folder:
   ```text
   /path/to/vault/.obsidian/plugins/claudian/
   ```
3. Copy the downloaded files into the `claudian` folder.
4. Enable the plugin in Obsidian:
   **Settings** → **Community plugins** → Enable **Claudian**.

### Recommended Settings

Open Settings (Cmd+,) and configure these options:

**Files & Links:**
| Setting | Value |
|---------|-------|
| Detect all file extensions | ON |
| Default location for new notes | `inbox/notes/` |
| Use [[Wikilinks]] | ON |

**Editor:**
| Setting | Value |
|---------|-------|
| Show line numbers | ON |
| Fold heading | ON |
| Default editing mode | Source mode (for editing) |

### Essential Plugins

Install these community plugins for the best experience:

1. Go to **Settings → Community plugins**
2. Click **Browse**
3. Search and install each plugin:

| Plugin | Purpose | Why You Need It |
|--------|---------|-----------------|
| **Tasks** | Task tracking | Renders checkboxes, filters tasks across files |
| **Dataview** | Dynamic queries | Query your domains and projects |
| **Calendar** | Date navigation | Navigate session logs by date |
| **Excalidraw** | Visual diagrams | Create and edit .excalidraw files |


**Tips for Navigation:**

- **Star important files** — Click the star icon to add INDEX.md files to your favorites
- **Use graph view** — Cmd+G shows how your domains connect
- **Pin tabs** — Right-click a tab to pin files you reference often
- **Split panes** — Drag tabs to view multiple files side by side

### Folder Structure View

In the file browser, you'll see:

```
pal-personal/
├── .claude/           # PAL system files
│   ├── agents/        # Domain agents
│   ├── skills/        # All skills
│   └── base/          # System logic
├── Domains/           # Your project workspaces
│   ├── PALBuilder/
│   └── LifeOS/
├── Inbox/             # Work station for Notes and Tasks
├── Docs/              # Documentation
└── README.md          # Start here
```

---

## Part 2: Getting Started with Claude Code

### Your First Session

1. **Open Terminal** in your PAL directory:
   ```bash
   cd ~/path/to/pal-personal
   ```

2. **Start Claude Code:**
   ```bash
   claude
   ```

3. **PAL Master greets you automatically** — The SessionStart hook loads your context

4. **Try these commands:**

   ```
   *skills     # See available skills (8 total)
   *agents     # See domain agents (3 total)
   *context    # See what's loaded in context
   *menu       # Show all available commands
   ```

### Essential Commands

| Command | What It Does |
|---------|--------------|
| `*menu` | Display available commands |
| `*skills` | List all 8 skills |
| `*workflows` | List available workflows |
| `*agents` | Show 3 domain agents |
| `*context` | Display loaded context files |
| `*help` | Show help documentation |
| `*dismiss` | Exit current agent (return to PAL Master) |

### Your First Workflow

**Example 1: Capture a thought with braindump**

Simply say:
> "Braindump: I've been thinking about reorganizing my project structure. Maybe I should create separate domains for each client. Also, I need to follow up with the design team about the new mockups."

PAL will:
1. Capture your raw thoughts
2. Analyze themes and energy
3. Extract questions, decisions, and action items
4. Suggest relevant categories

**Example 2: Create a new project**

Say:
> "Create a project for the website redesign"

PAL will ask for:
- Domain selection
- Project name
- Objective
- Initial tasks
- Priority

### Loading Domain Agents

For focused work in a specific area, load a specialized agent:

```
/pal-builder       # System development
/life-coach        # Personal life management

*dismiss           # Return to PAL Master
```

---

## Part 3: Core Concepts

### Three-Layer Architecture and nested within .claude

PAL organizes everything into three layers:

| Layer | Purpose | Contents |
|-------|---------|----------|
| **USER** | Your identity | ABOUTME.md, DIRECTIVES.md, CONTACTS.md |
| **SYSTEM** | How PAL works | Skills, agents, workflows, orchestration |
| **SECURITY** | What PAL won't do | GUARDRAILS.md, REPOS_RULES.md |

### Skills vs Agents vs Domains

**Skills** — Reusable capabilities (like tools in a toolbox)
- Activate automatically based on your request
- Examples: note-taking, project-management, system-build
- 8 skills with 40 workflows total

**Agents** — Specialized personas (like expert assistants)
- Load explicitly with `/[agent-name]`
- Have deep knowledge of their domain
- Examples: PAL Builder, Life Coach

**Domains** — Project workspaces (like folders for projects)
- Siloed environments with standard structure
- Each has INDEX.md as source of truth
- Examples: PALBuilder, LifeOS

### The Knowledge Pipeline

PAL uses a centralized intake system for all information:

```
Inbox (capture) → Skills (process) → Domains (contextualize)
```

1. **Capture** — Notes, tasks, resources flow into the Inbox
2. **Process** — Skills like note-taking analyze and organize content
3. **Distribute** — Processed content moves to appropriate Domains
4. **Contextualize** — Information enriches the persistent context for AI interactions

### Hooks

Hooks are automatic actions that run at specific moments:

| Hook             | When It Runs         | What It Does                          |
| ---------------- | -------------------- | ------------------------------------- |
| **SessionStart** | Session begins       | Loads your context (USER + SECURITY)  |
| **PreToolUse**   | Before any tool runs | Validates against GUARDRAILS.md       |
| **Stop**         | Session ends         | Saves transcript, sends notifications |

### Context Loading

**Zero Trust Approach** — PAL only loads what's necessary:

1. **Session start** → Hooks load base context
2. **Your request** → PAL Master routes to relevant skill/agent
3. **Task execution** → Loads specific workflows as needed
4. **Completion** → Returns relevant results

**Check what's loaded:**
```
*context    # Shows all loaded files
```

### Workflows

Workflows are multi-step processes within skills:

- **Sequential** — Steps run in order
- **Conditional** — Branches based on conditions
- **Nested** — Workflows call other workflows

**See available workflows:**
```
*workflows    # Lists all available workflows
```

---

## Part 4: Technical Foundations

### What is a File System?

Your computer organizes information into **files** (individual documents) and **folders** (containers).

**Paths** describe where files live:
- Absolute: `/Users/yourname/pal-personal/` (full address)
- Relative: `./Domains/` (relative to current location)
- Home shortcut: `~/pal-personal/` (~ means home directory)

### What is a Terminal?

The **terminal** (command line) is a text interface for your computer:

```bash
ls              # List files in current directory
cd folder/      # Change directory
pwd             # Show current directory path
```

### Git Basics

**Git** tracks changes to your files over time:

- **Commit** — A saved snapshot of changes
- **Branch** — A separate line of development
- **Push** — Send commits to GitHub
- **Pull** — Download changes from GitHub

**Common commands:**
```bash
git status              # Check what's changed
git add .               # Stage all changes
git commit -m "message" # Save with description
git push                # Upload to GitHub
git pull                # Download latest
```

**Good commit messages:**
- Start with a verb: "Add", "Update", "Fix", "Remove"
- Be specific about what changed
- Example: `git commit -m "Add user authentication feature"`

### Package Management

**Bun** is PAL's package manager and runtime:

```bash
bun install           # Install all dependencies
bun add package-name  # Add a new package
bun run script-name   # Run a script from package.json
```

### Environment Variables

Store sensitive information without putting it in code:

```bash
export ANTHROPIC_API_KEY="sk-ant-..."   # Set variable
echo $ANTHROPIC_API_KEY                  # Use variable
```

Add to your shell profile for persistence:
```bash
echo 'export ANTHROPIC_API_KEY="your-key"' >> ~/.zshrc
```

---

## Part 5: Next Steps

### Explore the Feature Catalog

See [Docs/FEATURES.md](Docs/FEATURES.md) for:
- All 8 skills with workflow details
- All 3 agents with capabilities
- All 3 hooks with behavior
- Domain structure and examples

### Configure Your Setup

See [Docs/SETUP.md](Docs/SETUP.md) for:
- Detailed installation instructions
- Troubleshooting guide
- Configuration options

### Customize PAL

Make PAL yours by editing:

| File | Purpose |
|------|---------|
| `ABOUTME.md` | Your identity and background |
| `DIRECTIVES.md` | How you want PAL to behave |
| `CONTACTS.md` | People you work with |
| `TERMINOLOGY.md` | Terms specific to your work |

### Create Your First Domain

```
Create a domain for [your project name]
```

PAL will set up the standard structure:
- INDEX.md (source of truth)
- 00_CONTEXT through 05_ARCHIVE folders

---

**Document Version:** 0.1.0-alpha
**Last Updated:** 2026-02-23

**Next:** [Docs/FEATURES.md](Docs/FEATURES.md) — Complete feature catalog
