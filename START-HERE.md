# Get Started with PAL

> By the end of this guide, you'll have a working second brain — an AI that can organize your notes, remember your projects, and pick up exactly where you left off.

**Version:** 0.1.0-beta
**Last Updated:** 2026-03-02

---

## The Plan

Here's what we're doing:

1. **Set up Obsidian** as your main navigation and input layer
2. **Run your first PAL session** with Claude Code
3. **Understand the core concepts** — skills, agents, domains, hooks
4. **Customize PAL** with your identity and preferences
5. **Create Domains and Projects** home of your notes and tasks
6. **Know where to go next** for deeper learning

Expect to spend about 30 minutes on the basic setup. If you want to explore every corner, give it an hour.

---

## What you'll need

| Requirement     | Purpose                                     | Install                                    |
| --------------- | ------------------------------------------- | ------------------------------------------ |
| **Bun**         | Package manager and runtime                 | [bun.sh](https://bun.sh)                   |
| **Claude Code** | AI interaction layer                        | `npm install -g @anthropic-ai/claude-code` |
| **Obsidian**    | Reading and navigation (highly recommended) | [obsidian.md](https://obsidian.md)         |

> **Claude Code requires an Anthropic subscription** — this is the AI engine that powers PAL. See [claude.com/pricing](https://claude.com/pricing) for plans. Most users find the Pro plan ($20/mo) sufficient for daily use.

---

## Part 1: Setting Up Obsidian

### Why Obsidian?

PAL is a "second brain," and Obsidian is the best way to interact with it.

I prefer Obsidian over a code editor for this because it's built for note taking, not syntax. You get a clean sidebar, a graph view to see how your projects connect, and a fast search (`Cmd+O`) that actually finds what you need.

### Setup

1. Download [Obsidian](https://obsidian.md).
2. Click **Open folder as vault**.
3. Navigate to your `pal-second-brain` folder and hit **Open**.
4. Trust the author when prompted.

Your PAL system is now live in the sidebar.

### Optional: Terminal + Claude inside Obsidian

If you want to talk to Claude without switching apps, install the community plug-in [Terminal](https://github.com/polyipseity/obsidian-terminal)by polyipseity:

### Recommended Settings (`Cmd+,`)

- **Files & Links:** Turn on **Detect all file extensions**, set new note location to `Inbox/Notes/`, and enable **Wikilinks**.
- **Editor:** Turn on **Line numbers** and **Fold heading**. Use **Source mode** for the best experience.

---

## Part 2: Your First PAL Session

Open your terminal and run:

```bash
cd ~/path/to/pal-second-brain
claude
```

### Step 2: Setup Your Context

Run the following command inside Claude Code to personalize your second brain:

```
/setup-context
```

_PAL will walk you through a series of questions to populate your identity and preferences. Once complete, your context will load automatically in the background._

### Step 3: Explore

Try these commands to see what's available:

| Command      | What It Does                               |
| ------------ | ------------------------------------------ |
| `*menu`      | Display all available commands             |
| `*skills`    | List all 8 skills                          |
| `*workflows` | List available workflows                   |
| `*agents`    | Show domain agents                         |
| `*context`   | Display what's currently loaded in context |
| `*help`      | Show help documentation                    |

### Step 4: Create Domains and Projects

Now that you're set up, it's time to build your structure. PAL uses **Domains** as high-level workspaces (e.g., `Work`, `Personal`) and **Projects** for specific initiatives within those domains.

To create them, use the built-in skills:

1.  **Create a Domain**:
    Say: `Create a domain for [Domain Name]`
    _PAL will use the `create-domain` skill to scaffold the 6-folder structure and `INDEX.md`._

2.  **Create a Project**:
    Say: `Create a project for [Project Name]`
    _PAL will use the `project-management` skill to prompt you for details and initialize the project file._

### Step 5: Try a Braindump within your Inbox/Notes

Say something like:

> "Braindump: I've been thinking about a new project for the Domain I have created. Maybe I need to add my client information, key details about the project and all the relevant articles I can find (continues rambling about all the different ideas and tasks related)...

PAL will:

1. Capture your raw thoughts
2. Create individual tasks and relate them to the project and domain.
3. Extract questions, decisions, and action items
4. Suggest relevant categories, types, and actions

### Step 6: Load a Specialized Agent

For focused work in a specific area:

```
/pal-builder       # System development
/life-coach        # Personal life management

*dismiss           # Return to PAL Master
```

Each agent loads its own domain context and provides a specialized command menu.

---

## Part 3: How it's built

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

## Part 4: Personalize PAL

This is where PAL stops being a template and becomes _your_ second brain. These four files load at the start of every session — the more accurately they reflect you, the better PAL performs.

| File               | What to Add                                               |
| ------------------ | --------------------------------------------------------- |
| **ABOUTME.md**     | Your name, role, background, communication preferences    |
| **DIRECTIVES.md**  | How you want PAL to behave — tone, formatting, priorities |
| **CONTACTS.md**    | People you work with — names, roles, context              |
| **TERMINOLOGY.md** | Terms specific to your work or industry                   |

### Next Steps

Start by capturing your thoughts in the inbox or creating your first project as shown in Part 2.

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
| [08 — Learning with AI](DELETE-08-learning-with-ai.md)           | The UVAL protocol — use AI without losing your edge |
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
