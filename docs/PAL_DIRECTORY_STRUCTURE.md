# PAL Framework Architecture

Personal AI Infrastructure built on Claude Code.

## Directory Structure

```
pal-framework/
├── .claude/                    # Core system
│   ├── CLAUDE.md              # Master config (auto-loads)
│   ├── settings.json          # Permissions & tools
│   │
│   ├── base/                  # Knowledge base
│   │   ├── user/              # Your configuration
│   │   ├── system/            # System operations
│   │   └── security/          # Security guardrails
│   │
│   ├── agents/                # AI subprocesses
│   ├── skills/                # Domain capabilities
│   ├── commands/              # Slash commands
│   ├── tools/                 # Automation
│   │   ├── hooks/
│   │   ├── scripts/
│   │   └── maintenance/
│   └── mcp/                   # MCP server configs
│
└── docs/                      # Documentation
    ├── changelog/
    ├── how-to/
    └── patterns/
```
