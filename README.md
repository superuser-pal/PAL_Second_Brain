# PAL Second Brain

> **Patterned Agentic Logic** - A modular system that empowers professionals to architect AI systems through organized context engineering, reusable modular blocks, and guided documentation.

[![Version](https://img.shields.io/badge/version-0.1.0--alpha-blue.svg)](https://github.com/superuser-pal/PAL_Second_Brain)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Bun](https://img.shields.io/badge/runtime-bun-orange.svg)](https://bun.sh)

---

## What is PAL?

PAL (Patterned Agentic Logic) is a second brain for Claude Code that provides:

- **Three-layer architecture** - USER (identity) → SYSTEM (logic) → SECURITY (guardrails)
- **Modular skill system** - Reusable capabilities with workflows and tools
- **Lifecycle hooks** - Automated context loading, security validation, and session management
- **Domain workspaces** - Project-specific context containers

PAL transforms Claude Code from a general assistant into a personalized, context-aware system that understands your preferences, follows your rules, and maintains consistent behavior across sessions.

---

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) runtime installed
- [Claude Code](https://claude.ai/code) CLI

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/superuser-pal/PAL_Second_Brain.git
   cd PAL_Second_Brain
   ```

2. **Run the installer:**
   ```bash
   bun run .claude/tools/pal-install.ts
   ```

3. **Follow the interactive wizard** to configure your:
   - Name and timezone
   - Technical level
   - Preferred programming language

4. **Start a new Claude Code session** - PAL will automatically load your configuration.

### Validate Installation

```bash
bun run .claude/tools/pal-install.ts --validate
```

---

## Architecture

PAL uses a three-layer Base configuration:

```
.claude/base/
├── user/       # Your identity, preferences, contacts
├── system/     # Architecture, workflows, routing logic
└── security/   # Guardrails, repository policies
```

### Core Components

| Component | Purpose | Location |
|:----------|:--------|:---------|
| **Base** | Persistent context loaded every session | `.claude/base/` |
| **Skills** | Modular capabilities with workflows | `.claude/skills/` |
| **Agents** | Specialized AI configurations | `.claude/agents/` |
| **Hooks** | Lifecycle automation | `.claude/tools/hooks/` |
| **Domains** | Project workspaces | `domains/` |

### Included Skills

- **create-skill** - Create and validate new skills
- **create-agent** - Create specialized agents
- **create-domain** - Set up project workspaces

---

## Documentation

| Document | Description |
|:---------|:------------|
| [Migration Checklist](docs/MIGRATION_CHECKLIST.md) | Step-by-step setup guide |
| [Directory Structure](docs/PAL_DIRECTORY_STRUCTURE.md) | Complete architecture overview |
| [Settings Template](docs/SETTINGS_TEMPLATE.md) | Configuration options |
| [Hook Templates](docs/HOOK_TEMPLATES.md) | Lifecycle hook implementation |
| [Onboarding Guide](docs/ONBOARDING.md) | Technical onboarding |

### System Documentation (in `.claude/base/system/`)

- `ARCHITECTURE.md` - Core principles and philosophy
- `ORCHESTRATION.md` - Routing and delegation logic
- `WORKFLOWS.md` - Workflow patterns and composition
- `SKILL_LOGIC.md` - Skill system configuration
- `AGENTS_LOGIC.md` - Agent system design
- `DOMAINS_LOGIC.md` - Domain workspace structure

---

## Hooks

PAL provides three lifecycle hooks:

| Hook | Trigger | Purpose |
|:-----|:--------|:--------|
| **SessionStart** | Session begins | Load Base context automatically |
| **PreToolUse** | Before tool execution | Validate against security guardrails |
| **Stop** | Session ends | Cleanup and notifications |

Hooks are configured in `.claude/settings.json` and implemented in `.claude/tools/hooks/`.

---

## Customization

### User Configuration

Edit files in `.claude/base/user/`:

- `ABOUTME.md` - Your background and identity
- `DIRECTIVES.md` - Behavioral preferences
- `TECHSTACK.md` - Technology preferences
- `TERMINOLOGY.md` - Custom vocabulary
- `CONTACTS.md` - Contact registry

### Security Rules

Configure in `.claude/base/security/`:

- `GUARDRAILS.md` - Operation validation rules
- `REPOS_RULES.md` - Repository data policies

---

## Installer Options

```bash
# Interactive wizard (default)
bun run .claude/tools/pal-install.ts

# Force fresh installation
bun run .claude/tools/pal-install.ts --fresh

# Update existing installation
bun run .claude/tools/pal-install.ts --update

# Validate installation
bun run .claude/tools/pal-install.ts --validate

# Show help
bun run .claude/tools/pal-install.ts --help
```

---

## Project Structure

```
pal-second-brain/
├── .claude/
│   ├── CLAUDE.md              # Master configuration
│   ├── settings.json          # Hooks and permissions
│   ├── base/                  # Three-layer context
│   ├── agents/                # Agent definitions
│   ├── skills/                # Modular skills
│   ├── tools/                 # Automation scripts
│   └── mcp/                   # MCP configuration
├── docs/                      # Documentation
├── domains/                   # Project workspaces (user-created)
└── README.md
```

---

## Contributing

This is an Alpha release. Contributions, issues, and feedback are welcome.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Version

**Alpha 0.1.0** - Initial public release

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## Acknowledgments

