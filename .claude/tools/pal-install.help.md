# PAL Framework Installer

## Overview

The PAL installer sets up the PAL Framework in any project directory, creating the complete `.claude/` structure with base configuration, hooks, skills, and agents.

## Prerequisites

- **Bun runtime** - Install via `curl -fsSL https://bun.sh/install | bash`
- **macOS/Linux** - Windows not currently supported

## Installation

### Quick Install (New Project)

```bash
# Navigate to your project directory
cd /path/to/your/project

# Run the installer
bun run .claude/tools/pal-install.ts
```

### Command Line Options

| Flag | Description |
|------|-------------|
| `--fresh` | Force fresh installation (overwrites existing) |
| `--update` | Update existing installation (preserves user files) |
| `--validate` | Validate installation without making changes |
| `--help` | Show help message |

### Examples

```bash
# Interactive wizard (recommended for first-time setup)
bun run .claude/tools/pal-install.ts

# Force fresh install
bun run .claude/tools/pal-install.ts --fresh

# Update existing installation
bun run .claude/tools/pal-install.ts --update

# Check if installation is valid
bun run .claude/tools/pal-install.ts --validate
```

## What Gets Installed

The installer creates the following structure:

```
your-project/
├── .claude/
│   ├── CLAUDE.md                 # Project instructions
│   ├── settings.json             # Configuration & hooks
│   ├── base/
│   │   ├── user/                 # Your identity & preferences
│   │   │   ├── ABOUTME.md
│   │   │   ├── DIRECTIVES.md
│   │   │   ├── TECHSTACK.md
│   │   │   ├── TERMINOLOGY.md
│   │   │   └── CONTACTS.md
│   │   ├── system/               # Framework logic (8 files)
│   │   │   ├── ARCHITECTURE.md
│   │   │   ├── ORCHESTRATION.md
│   │   │   ├── WORKFLOWS.md
│   │   │   ├── MEMORY_LOGIC.md
│   │   │   ├── TOOLBOX.md
│   │   │   ├── AGENTS_LOGIC.md
│   │   │   ├── SKILL_LOGIC.md
│   │   │   └── DOMAINS_LOGIC.md
│   │   └── security/             # Security rules (2 files)
│   │       ├── GUARDRAILS.md
│   │       └── REPOS_RULES.md
│   ├── agents/
│   │   └── pal-master.md         # Primary orchestration agent
│   ├── skills/
│   │   ├── create-skill/         # Skill creation framework
│   │   ├── create-agent/         # Agent creation framework
│   │   └── create-domain/        # Domain creation framework
│   └── tools/
│       ├── pal-install.ts        # This installer
│       ├── pal-install.help.md   # This documentation
│       └── hooks/
│           ├── session-start.ts  # Context loading
│           ├── pre-tool-use.ts   # Security validation
│           └── stop.ts           # Session cleanup
└── domains/                      # Project workspaces (empty)
```

## Configuration Collected

During installation, the wizard collects:

1. **User name** - Used in ABOUTME.md for personalization
2. **Timezone** - Auto-detected, can be confirmed/changed
3. **Technical level** - Beginner/Intermediate/Advanced
4. **Preferred language** - TypeScript (default), JavaScript, or Python

## Post-Installation

### 1. Start a New Claude Code Session

The hooks activate automatically when you start a new session. You should see:

```
═══════════════════════════════════════════════════════════
PAL BASE CONTEXT LOADING
═══════════════════════════════════════════════════════════
```

### 2. Customize Your User Files

Edit files in `.claude/base/user/` to personalize your experience:

- **ABOUTME.md** - Your background, values, and communication preferences
- **DIRECTIVES.md** - How you want PAL to behave
- **TECHSTACK.md** - Your technology preferences
- **TERMINOLOGY.md** - Custom vocabulary and definitions
- **CONTACTS.md** - Key contacts for reference

### 3. Verify Installation

```bash
bun run .claude/tools/pal-install.ts --validate
```

This checks that all required files and directories exist.

## Installation Modes

### Fresh Install

Creates everything from scratch. Use when:
- Setting up PAL for the first time
- Want to reset to default configuration

```bash
bun run .claude/tools/pal-install.ts --fresh
```

### Update Install

Preserves your user files while updating framework files. Use when:
- Updating to a newer PAL version
- Fixing corrupted framework files

```bash
bun run .claude/tools/pal-install.ts --update
```

## Troubleshooting

### Permission Errors

If you see permission errors:

```bash
# Fix permissions manually
chmod -R 755 .claude/
```

Or run the installer with sudo (not recommended):

```bash
sudo bun run .claude/tools/pal-install.ts
```

### Hooks Not Running

1. Ensure `bun` is in your PATH:
   ```bash
   which bun
   ```

2. Check `.claude/settings.json` has correct hook paths:
   ```json
   {
     "hooks": {
       "SessionStart": [...]
     }
   }
   ```

3. Restart your Claude Code session

### Missing Files

Re-run the installer in update mode:

```bash
bun run .claude/tools/pal-install.ts --update
```

### Validation Failures

Run validation to see what's missing:

```bash
bun run .claude/tools/pal-install.ts --validate
```

Common issues:
- Missing base layer files → Re-run installer
- Invalid settings.json → Delete and re-run installer
- Missing hooks → Check source directory has hooks

## Hooks Explained

### session-start.ts

Runs when a Claude Code session starts. Loads all base configuration files into context.

**What it does:**
- Reads USER layer files (ABOUTME, DIRECTIVES, etc.)
- Reads SYSTEM layer files (ARCHITECTURE, WORKFLOWS, etc.)
- Reads SECURITY layer files (GUARDRAILS, REPOS_RULES)
- Outputs loaded context summary

### pre-tool-use.ts

Runs before any tool execution. Validates operations against security rules.

**What it checks:**
- Hardcoded credentials (BLOCKS)
- Sensitive file paths (BLOCKS)
- Dangerous commands (BLOCKS)
- PII in content (WARNS)
- Network operations (WARNS)

### stop.ts

Runs when a session ends. Handles cleanup and notifications.

**What it does:**
- Sends desktop notification (macOS)
- Prints session summary

## Security

The installer creates security rules in `.claude/base/security/`:

### GUARDRAILS.md

Three-tier security system:
- **BLOCK** - Catastrophic operations (credentials, destructive commands)
- **WARN** - Risky operations (PII, network access)
- **ALLOW** - Safe operations

### REPOS_RULES.md

Repository policies for:
- Private vs public data handling
- Git operation safety
- Sensitive file detection

## Version

PAL Framework v0.1.0

## Support

For issues or questions:
- Check this documentation first
- Review `.claude/base/system/` for architecture details
- Open an issue on the PAL Framework repository
