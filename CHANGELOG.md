# Changelog

All notable changes to the PAL Framework will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0-alpha] - 2026-01-19

### Added

#### Core Architecture
- **Three-layer Base system** - USER, SYSTEM, and SECURITY layers for organized context management
- **10 core principles** guiding framework design (Technical-Literate First, Context > Prompts, Plan-First Execution, etc.)
- **Master configuration** via `.claude/CLAUDE.md` for project-level settings

#### Base Configuration (16 files)
- **USER layer** (6 files): ABOUTME, DIRECTIVES, TECHSTACK, TERMINOLOGY, CONTACTS, README
- **SYSTEM layer** (8 files): ARCHITECTURE, ORCHESTRATION, WORKFLOWS, MEMORY_LOGIC, TOOLBOX, AGENTS_LOGIC, SKILL_LOGIC, DOMAINS_LOGIC
- **SECURITY layer** (2 files): GUARDRAILS, REPOS_RULES

#### Lifecycle Hooks
- **SessionStart hook** - Automatically loads Base context at session start
- **PreToolUse hook** - Validates operations against security guardrails
- **Stop hook** - Handles session cleanup and notifications

#### Skill System
- **create-skill** - Skill creation and validation with 4 workflows
- **create-agent** - Agent creation with template and 2 workflows
- **create-domain** - Domain workspace creation with 4 workflows

#### Automation
- **Interactive installer** (`pal-install.ts`) - 1,200+ line installation wizard with:
  - Fresh install and update modes
  - Interactive configuration gathering
  - Installation validation
  - Colored CLI output
  - `--fresh`, `--update`, `--validate`, `--help` flags

#### Documentation
- `ONBOARDING.md` - Technical onboarding guide
- `PAL_DIRECTORY_STRUCTURE.md` - Complete architecture overview
- `SETTINGS_TEMPLATE.md` - Configuration options reference
- `HOOK_TEMPLATES.md` - Hook implementation templates
- `MIGRATION_CHECKLIST.md` - Step-by-step setup guide

#### MCP Integration
- MCP server configuration in `.claude/mcp/`
- Entry point via `.mcp.json`

### Architecture Highlights

```
.claude/
├── base/           # Three-layer context (USER, SYSTEM, SECURITY)
├── agents/         # Agent definitions (PAL Master included)
├── skills/         # Modular skills with workflows
├── tools/          # Hooks and automation scripts
└── CLAUDE.md       # Master configuration
```

### Design Principles

1. **Technical-Literate First** - Empowers users through education, not abstraction
2. **Context > Prompts** - Context engineering beats prompt engineering
3. **Plan-First Execution** - Recommended workflow for transparency
4. **Pattern-Based System** - Low-floor, high-ceiling design through composable patterns
5. **Code Before Prompts** - Executable code creates deterministic behavior
6. **Domain-Driven Documentation** - Structure context around specific domains
7. **Self Update System** - System can evolve and improve itself
8. **Pattern Library Management** - System operations documented as educational patterns
9. **PAL Master with Specialized Sub-Agents** - Primary orchestrator with domain-specific agents
10. **Permission to Fail** - Graceful degradation and error transparency

---

## Future Releases

### Planned for 0.2.0
- Additional built-in skills
- Enhanced hook capabilities
- Improved domain workspace features
- Pattern Library documentation

### Planned for 1.0.0
- Stable API
- Complete documentation
- Community skill repository
- Plugin system

---

[0.1.0-alpha]: https://github.com/superuser-pal/PAL_Framework/releases/tag/v0.1.0-alpha
