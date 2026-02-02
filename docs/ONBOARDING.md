---
name: user-onboarding
description: PAL User Layer - Technical Onboarding Guide explaining core concepts like git, package management, and system architecture
version: 1.0.0
---

## Purpose

Learn the technical concepts you need to deploy, integrate, and manage your PAL system. Jump to the section you need when you need it—Framework Master will guide you.

---

## Foundations

### What is a File System?

Your computer organizes information into **files** (individual documents) and **folders** (containers for files).

**Paths** describe where files live:

- Absolute path: `/Users/yourname/projects/pal/` (full address)
- Relative path: `./pal/` (relative to where you are now)
- Home shortcut: `~/projects/` (~ means your home directory)

### What is a Repository?

A **repository** (or "repo") is a folder that tracks the history of your files using **Git**. Every change you make can be saved as a "commit" so you can go back in time if needed.

**GitHub** is a website that stores copies of your repositories online for backup and collaboration.

### What is a Terminal?

The **terminal** (also called "command line" or "shell") is a text interface for your computer. Instead of clicking, you type commands.

**Basic commands:**

```bash
ls              # List files in current directory
cd folder/      # Change directory
pwd             # Show current directory path
```

### What are Environment Variables?

**Environment variables** are settings your computer stores temporarily. They're useful for storing sensitive information (like API keys) without putting them directly in your code.

**Example:**

```bash
export ANTHROPIC_API_KEY="sk-ant-..."   # Set variable
echo $ANTHROPIC_API_KEY                  # Use variable
```

---

## Package Management

### Understanding Package Managers

**Package managers** install and manage software libraries (called "packages") that your code depends on.

**Why they matter:** Instead of manually downloading files, package managers handle dependencies, versions, and updates automatically.

### bun vs npm

**bun** - Modern, fast JavaScript runtime and package manager (recommended for PAL)
**npm** - Traditional Node.js package manager (widely used, slower)
**Common bun commands:**

```bash
bun install           # Install all dependencies
bun add package-name  # Add a new package
bun run script-name   # Run a script from package.json
```

**Common npm commands:**

```bash
npm install           # Install all dependencies
npm install package   # Add a new package
npm run script-name   # Run a script
```

### Python: uv vs pip

**uv** - Modern, fast Python package installer (recommended for PAL)
**pip** - Traditional Python package installer

**Common uv commands:**

```bash
uv pip install package-name   # Install package
uv venv                       # Create virtual environment
source .venv/bin/activate     # Activate environment
```

---

## Deployment & Integration

### What is Deployment?

**Deployment** means publishing your code so others can use it. This usually involves:

1. Pushing your code to a service (like Cloudflare, Vercel, AWS)
2. Running a build process
3. Making it accessible via a URL

### Common Deployment Patterns

**Static sites:** HTML/CSS/JS files served from a CDN

- Cloudflare Pages, Vercel, Netlify

**Serverless functions:** Code that runs on-demand without managing servers

- Cloudflare Workers, AWS Lambda, Vercel Functions

**Full applications:** Complete backend services

- Traditional hosting, containers, VPS

### Typical Deployment Workflow

```bash
cd /path/to/project          # Navigate to project
bun install                  # Install dependencies (if needed)
bun run build               # Build the project
bun run deploy              # Deploy to hosting service
git push                    # Push code to repository
```

---

## Git & Version Control

### Git Basics

**Git** tracks changes to your files over time. Think of it as "save points" for your project.

**Core concepts:**

- **Commit:** A saved snapshot of your changes
- **Branch:** A separate line of development
- **Push:** Send your commits to a remote repository (like GitHub)
- **Pull:** Download changes from a remote repository

### Common Git Commands

```bash
git status              # Check what's changed
git add filename.txt    # Stage a file for commit
git add .              # Stage all changed files
git commit -m "message" # Save staged changes with a message
git push               # Upload commits to remote
git pull               # Download latest changes
```

### Commit Message Format

**Good commit messages:**

- Start with a verb: "Add", "Update", "Fix", "Remove"
- Be specific about what changed
- Keep it under 50 characters

**Examples:**

```bash
git commit -m "Add user authentication feature"
git commit -m "Fix navigation menu bug on mobile"
git commit -m "Update deployment configuration"
```

---

## Hooks & Automation

### What are Hooks?

**Hooks** are automatic actions that run when specific events occur. Think of them as "if this happens, then do that" rules.

**Common PAL hooks:**

- **SessionStart** - Runs when you start a new AI session (loads your Base configuration)
- **PreToolUse** - Runs before any tool executes (validates security)
- **Stop** - Runs when session ends (cleanup, logging)

### How Hooks Work

Hooks are configured in `.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": "bun run .claude/hooks/session-start.ts",
    "PreToolUse": "bun run .claude/hooks/pre-tool-use.ts"
  }
}
```

When the event occurs, the specified command runs automatically.

---

## System Architecture

### PAL System Structure

```
PAL_Base/
├── User/          # Your personal configuration
│   ├── ABOUTME.md
│   ├── DIRECTIVES.md
│   ├── DIGITALASSETS.md
│   ├── CONTACTS.md
│   ├── TECHSTACK.md
│   └── TERMINOLOGY.md
├── System/        # System operation files
└── Security/      # Security and guardrails
```

### How PAL Loads Context

**Progressive disclosure** - Load only what's needed:

1. **Session Start** → Hooks load Base files (USER layer)
2. **User Request** → Framework Master routes to appropriate skill/agent
3. **Task Execution** → Loads specific workflows/tools as needed
4. **Completion** → Saves important context for future sessions

### Skills vs Agents

**Skills** - Domain capabilities with workflows (Art, Security, Prompting)

- Live in `.claude/skills/[SkillName]/`
- Loaded when relevant to user's request

**Agents** - Specialized AI subprocesses (Explore, Plan, Bash)

- Handle complex multi-step tasks autonomously
- Run in parallel for efficiency

---

## UNIX Philosophy (Optional)

The UNIX philosophy guides PAL's design:

1. **Do one thing well** - Each tool has a single, clear purpose
2. **Make tools composable** - Small tools combine to build complex workflows
3. **Use text interfaces** - Everything uses plain text for maximum compatibility
4. **Automate everything** - If you do it twice, make it a script

**Why it matters:** This philosophy makes PAL modular, testable, and maintainable.

---

## Troubleshooting

### Common Errors

**"Command not found"**

- Solution: Install the missing tool or check your PATH

**"Permission denied"**

- Solution: Check file permissions or use appropriate access rights

**"Cannot find module"**

- Solution: Run `bun install` to install dependencies

**"Port already in use"**

- Solution: Stop the other process or use a different port

### Getting Help

**Ask Framework Master:**

- "Explain how [concept] works"
- "What does this error mean?"
- "How do I [task]?"

**Check your configuration:**

- Review TECHSTACK.md for your preferences
- Check TERMINOLOGY.md for PAL-specific terms
- Reference DIRECTIVES.md for system behavior

---

## Glossary

**API (Application Programming Interface)** - Way for programs to talk to each other

**CLI (Command Line Interface)** - Text-based interface (terminal)

**Environment Variable** - System setting stored as key=value

**Git** - Version control system for tracking changes

**Hook** - Automatic action triggered by an event

**Package Manager** - Tool for installing software dependencies (bun, npm, uv, pip)

**Path** - Location of a file or directory

**Repository (Repo)** - Folder tracked by Git

**Terminal/Shell** - Text interface for running commands

**Virtual Environment** - Isolated Python environment for dependencies

---
