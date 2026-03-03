# PAL Second Brain — Start Here

> By the end of this guide, you'll have a working second brain — an AI that can organize your notes, remember your projects, and pick up exactly where you left off.

**Version:** 0.1.0-beta
**Last Updated:** 2026-03-02

---

## What You'll Accomplish

By following this guide, you will:

1. **Set up Obsidian** as your knowledge navigation layer
2. **Run your first PAL session** with Claude Code
3. **Understand the core concepts** — skills, agents, domains, hooks
4. **Customize PAL** with your identity and preferences
5. **Know where to go next** for deeper learning

**Time to complete:** ~30 minutes for basic setup, ~1 hour to explore everything.

---

## Prerequisites

| Requirement       | Purpose                                     | Install                                    |
| ----------------- | ------------------------------------------- | ------------------------------------------ |
| **macOS/Windows** | PAL's primary tested platform               | —                                          |
| **Git**           | Version control                             | —                                          |
| **Bun**           | Package manager and runtime                 | [bun.sh](https://bun.sh)                   |
| **Claude Code**   | AI interaction layer                        | `npm install -g @anthropic-ai/claude-code` |
| **Obsidian**      | Reading and navigation (highly recommended) | [obsidian.md](https://obsidian.md)         |

> **Claude Code requires an Anthropic subscription** — this is the AI engine that powers PAL. See [claude.com/pricing](https://claude.com/pricing) for plans. Most users find the Pro plan ($20/mo) sufficient for daily use.

---

## Part 1: Setting Up Obsidian

### Why Obsidian?

PAL is a second brain — Obsidian is the best way to read and navigate it:

- **Beautiful rendering** — Markdown displays with proper formatting, links, and diagrams
- **Graph view** — Visualize connections between domains, skills, and projects
- **Quick navigation** — Jump to any file instantly with Cmd+O
- **Built for knowledge** — Obsidian is a knowledge management tool, not a code editor

**PAL + Obsidian = Your AI-powered second brain with a human-friendly interface.**

### Setup Steps

1. Download and install from [obsidian.md](https://obsidian.md)
2. Open Obsidian → Click **Open folder as vault**
3. Navigate to your `pal-personal` directory → Click **Open**
4. When prompted, click **Trust author and enable plugins**

Your entire PAL system is now browsable in the left sidebar.

### Install Claudian (Optional)

[Claudian](https://github.com/YishenTu/claudian) embeds Claude Code directly inside Obsidian:

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/YishenTu/claudian/releases/latest)
2. Create `.obsidian/plugins/claudian/` in your vault
3. Copy the downloaded files into that folder
4. Enable in **Settings → Community plugins → Claudian**

### Recommended Obsidian Settings

Open **Settings** (Cmd+,):

**Files & Links:**

| Setting                        | Value          |
| ------------------------------ | -------------- |
| Detect all file extensions     | ON             |
| Default location for new notes | `Inbox/Notes/` |
| Use \[\[Wikilinks\]\]          | ON             |

**Editor:**

| Setting              | Value       |
| -------------------- | ----------- |
| Show line numbers    | ON          |
| Fold heading         | ON          |
| Default editing mode | Source mode |

### Essential Plugins

Install from **Settings → Community plugins → Browse**:

| Plugin         | Purpose                                                |
| -------------- | ------------------------------------------------------ |
| **Tasks**      | Track tasks across your vault with rendered checkboxes |
| **Dataview**   | Query your domains and projects like a database        |
| **Calendar**   | Navigate session logs by date                          |
| **Excalidraw** | Create and edit visual diagrams                        |

### Navigation Tips

- **Cmd+O** — Quick open any file by name
- **Cmd+G** — Graph view showing how your domains connect
- **Star files** — Click the star icon to bookmark INDEX.md files
- **Pin tabs** — Right-click a tab to keep reference files visible
- **Split panes** — Drag tabs to view multiple files side by side

---

## Part 2: Your First PAL Session

### Step 1: Launch

```bash
cd ~/path/to/pal-second-brain
claude
```

//NEED TO ADD THE SET UP COMMAND

*PAL greets you by name. Your identity, preferences, and project context load automatically in the background.*

### Step 2: Explore

Try these commands to see what's available:

| Command      | What It Does                               |
| ------------ | ------------------------------------------ |
| `*menu`      | Display all available commands             |
| `*skills`    | List all 8 skills                          |
| `*workflows` | List available workflows                   |
| `*agents`    | Show domain agents                         |
| `*context`   | Display what's currently loaded in context |
| `*help`      | Show help documentation                    |

### Step 3: Create Domains

[PLACEHOLDER]

### Step 4: Try a Braindump within your Inbox/Notes

Say something like:

> "Braindump: I've been thinking about reorganizing my project structure. Maybe I should create separate domains for each client. Also, I need to follow up with the design team about the new mockups."

PAL will:

1. Capture your raw thoughts
2. Analyze themes and energy
3. Extract questions, decisions, and action items
4. Suggest relevant categories

### Step 5: Create a Project

Say:

> "Create a project for the website redesign"

PAL will ask for domain selection, project name, objective, initial tasks, and priority — then create the full folder structure, INDEX.md, and project file in one step.

### Step 6: Load a Specialized Agent

For focused work in a specific area:

```
/pal-builder       # System development
/life-coach        # Personal life management

*dismiss           # Return to PAL Master
```

Each agent loads its own domain context and provides a specialized command menu.

---

## Part 3: Core Concepts

### Three-Layer Architecture

Everything in PAL is organized into three layers inside `.claude/`:

| Layer        | Purpose                       | Key Files                                |
| ------------ | ----------------------------- | ---------------------------------------- |
| **USER**     | Your identity and preferences | ABOUTME.md, DIRECTIVES.md, CONTACTS.md   |
| **SYSTEM**   | How PAL processes requests    | Skills, agents, workflows, orchestration |
| **SECURITY** | What PAL will never do        | GUARDRAILS.md, REPOS_RULES.md            |

### Skills, Agents, and Domains

These are the three building blocks of PAL:

**Skills** — Reusable capabilities (like tools in a toolbox)

- Activate automatically based on your request's intent
- Each skill contains workflows — step-by-step processes
- Example: The `note-taking` skill has workflows for braindump, inbox processing, and distribution

**Agents** — Specialized AI personas (like expert assistants)

- Load explicitly with `/agent-name`
- Have deep context about their specific domain
- Example: `/pal-builder` knows everything about PAL's architecture

**Domains** — Project workspaces (like folders for projects)

- Siloed environments — one project's context doesn't bleed into another
- Each has an INDEX.md as source of truth
- Standard 6-folder structure: CONTEXT, PROJECTS, SESSIONS, PAGES, WORKSPACE, ARCHIVE

### The Knowledge Pipeline

All information flows through a unified pipeline:

```
Inbox (capture) → Skills (process) → Domains (contextualize)
```

1. **Capture** — Drop notes, tasks, and resources into the Inbox
2. **Process** — Skills add structure (frontmatter, categories)
3. **Distribute** — Processed content moves to the right Domain
4. **Contextualize** — Information enriches persistent context for future sessions

You never need to decide _where_ something goes when you capture it. Capture first, organize later.

### Hooks

Hooks are automated actions — they run without you doing anything:

| Hook             | When                 | What                                                    |
| ---------------- | -------------------- | ------------------------------------------------------- |
| **SessionStart** | Session begins       | Loads your identity, preferences, and security rules    |
| **PreToolUse**   | Before any tool runs | Validates against guardrails — blocks, warns, or allows |
| **Stop**         | Session ends         | Saves transcript, sends notifications, logs summary     |

### Context Loading

PAL loads only what's needed, when it's needed — nothing extra:

1. Session starts → Hooks load base context (USER + SECURITY)
2. You make a request → PAL Master routes to the relevant skill or agent
3. Task executes → Specific workflows load on demand
4. Done → Results returned, nothing extra consumed

Check what's loaded anytime with `*context`.

---

## Part 4: Make PAL Yours

This is where PAL stops being a template and becomes *your* second brain. These four files load at the start of every session — the more accurately they reflect you, the better PAL performs.

| File               | What to Add                                               |
| ------------------ | --------------------------------------------------------- |
| **ABOUTME.md**     | Your name, role, background, communication preferences    |
| **DIRECTIVES.md**  | How you want PAL to behave — tone, formatting, priorities |
| **CONTACTS.md**    | People you work with — names, roles, context              |
| **TERMINOLOGY.md** | Terms specific to your work or industry                   |

### Create Your First Domain

```
Create a domain for [your project name]
```

PAL will scaffold the standard structure:

```
Domains/YourProject/
├── INDEX.md           # Source of truth
├── CONNECTIONS.yaml   # External links
├── 00_CONTEXT/        # Background info
├── 01_PROJECTS/       # Active project files
├── 02_SESSIONS/       # Session logs
├── 03_ASSETS/         # Reference materials
├── 04_OUTPUTS/        # Generated deliverables
└── 05_ARCHIVE/        # Completed work
```

---

## Part 5: What's Next

### Learn Claude Code in Depth

The **[Claude101 Guide](Docs/Claude101/)** is a 14-part series covering everything from installation to advanced workflows:

| Guide                                                                    | Topic                                               |
| ------------------------------------------------------------------------ | --------------------------------------------------- |
| [01 — Getting Started](Docs/Claude101/01-getting-started.md)             | Installation, first workflow, essential commands    |
| [02 — Core Concepts](Docs/Claude101/02-core-concepts.md)                 | Interaction loop, context management, plan mode     |
| [03 — PAL Second Brain](Docs/Claude101/03-pal-second-brain.md)           | Domains, agents, skills, and the inbox              |
| [04 — Requirements & Hooks](Docs/Claude101/04-requirements-and-hooks.md) | CLAUDE.md, hooks, and configuration                 |
| [05 — Cheatsheet](Docs/Claude101/05-cheatsheet.md)                       | Quick reference for commands and shortcuts          |
| [06 — Adoption Approaches](Docs/Claude101/06-adoption-approaches.md)     | Turnkey vs autonomous learning path                 |
| [07 — Data Privacy](Docs/Claude101/07-data-privacy.md)                   | What data goes where and how to control it          |
| [08 — Learning with AI](Docs/Claude101/08-learning-with-ai.md)           | The UVAL protocol — use AI without losing your edge |
|                                                                          |                                                     |
|                                                                          |                                                     |
|                                                                          |                                                     |
|                                                                          |                                                     |

### Explore All Features

See **[Docs/FEATURES.md](Docs/FEATURES.md)** for the complete catalog:

- All 8 skills with triggers and workflow details
- All 5 agents with capabilities and commands
- All 3 hooks with behavior and configuration
- Domain structure and examples

### Contribute

PAL is open source. See **[Docs/CONTRIBUTING.md](Docs/CONTRIBUTING.md)** to get involved.

---

**Version:** 0.1.0-beta
**Last Updated:** 2026-03-02

**Next:** [Docs/Claude101/01-getting-started.md](Docs/Claude101/01-getting-started.md) — Installation and your first workflow
