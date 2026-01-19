---
title: PAL Toolbox System
version: 0.1.0
layer: SYSTEM
purpose: Configuration system and structure for PAL tools, hooks, and CLI utilities
last_updated: 2026-01-18
---

# PAL Toolbox System

**The configuration system for PAL tools, hooks, and CLI utilities.**

---

## THIS IS THE AUTHORITATIVE SOURCE

This document defines the **required structure** for tools in the PAL framework.

**ALL tool creation MUST follow this structure.**

If a tool does not follow this structure, it will not integrate correctly with PAL's hook system and workflows.

---

## What Are Tools?

**Tools** = Executable components that provide deterministic operations for automation, validation, and notifications.

**Location:** `.claude/tools/` and `.claude/skills/[skill-name]/tools/`

**Purpose:** Enable reliable, testable, and reusable operations that integrate with hooks and workflows.

**Key Characteristics:**

- **Deterministic** - Same input always produces same output
- **Hook-integrated** - Tools execute via SessionStart, PreToolUse, and Stop hooks
- **Workflow-callable** - Workflows invoke tools for automation steps
- **Security-validated** - PreToolUse hook validates tool execution before running

---

## Naming Conventions (MANDATORY)

**Tool naming follows PAL's standard file naming conventions for consistency across the system.**

| Category | Convention | Example | Purpose |
| :------- | :--------- | :------ | :------ |
| **Tools directory** | `tools/` | `.claude/tools/` | System-level tools location. |
| **Tool files** | `lower_snake_case.ts` | `validate_base.ts` | TypeScript CLI utilities. |
| **Help files** | `lower_snake_case.help.md` | `validate_base.help.md` | Tool documentation. |
| **Hook files** | `lower-kebab-case.ts` | `session-start.ts` | Hook implementation files. |
| **Config files** | `lower-kebab-case.json` | `settings.json` | Configuration files. |

**Convention Rules:**

- **Tool directories:** Always named `tools/`
- **Tool files:** Use `lower_snake_case` with `.ts` extension
- **Help files:** Match tool name with `.help.md` suffix
- **Hook files:** Use `lower-kebab-case` (matches Claude Code conventions)

---

## Directory Structure

Tools live in two locations:

```
.claude/
├── tools/                          # System-level tools
│   ├── hooks/                      # Hook implementations
│   │   ├── session-start.ts        # SessionStart hook
│   │   ├── pre-tool-use.ts         # PreToolUse hook
│   │   └── stop.ts                 # Stop hook
│   ├── validate_base.ts            # Validation utility
│   └── validate_base.help.md       # Tool documentation
└── skills/[skill-name]/tools/      # Skill-specific tools
    ├── publish.ts                  # Skill tool
    └── publish.help.md             # Tool documentation
```

**System tools:** Live in `.claude/tools/` for cross-cutting concerns (validation, hooks).

**Skill tools:** Live in `.claude/skills/[skill-name]/tools/` for domain-specific operations.

---

## Four Essential Tool Categories

PAL provides four essential tool categories for reliable core operations.

| Tool Category | Purpose | Implementation | Key Capabilities |
| :------------ | :------ | :------------- | :--------------- |
| **Notifications** | Inform user of session completion and important events | Stop hook (`.claude/tools/hooks/stop.ts`) | Desktop notifications, session alerts, configurable preferences |
| **Security Validation** | Validate operations before execution to prevent security issues | PreToolUse hook (`.claude/tools/hooks/pre-tool-use.ts`) | Credential detection, PII scanning, GUARDRAILS enforcement, risk assessment (ALLOW/WARN/BLOCK) |
| **File Validation** | Check file structure, integrity, and format compliance | Utility functions (callable from workflows/hooks) | YAML frontmatter validation, markdown structure checking, file size limits, format compliance |
| **Bun Commands** | Enable deterministic CLI operations and workflow automation | Bun runtime commands via Bash tool | Run TypeScript utilities directly, workflow automation, file processing, data transformation |

**Design Philosophy:**

1. **Prove foundation first** - Master Base + Hooks before adding external integrations
2. **Reduce complexity** - Fewer tools = easier to understand and maintain
3. **User feedback driven** - Add tools based on proven user needs
4. **Reliability focus** - Core tools work perfectly vs many tools working inconsistently

---

## Hook System

### What Are Hooks?

**Hooks** = TypeScript code that executes at specific system lifecycle points.

**Location:** `.claude/tools/hooks/` directory

**Purpose:** Control system behavior deterministically (context loading, security validation, notifications).

### Three Essential Hooks

| Hook | Trigger Point | Purpose | File |
| :--- | :------------ | :------ | :--- |
| **SessionStart** | Session initialization | Load Base context (USER + SYSTEM + SECURITY files) | `session-start.ts` |
| **PreToolUse** | Before tool execution | Validate operation against GUARDRAILS.md | `pre-tool-use.ts` |
| **Stop** | Session end | Send notifications, save transcript, log summary | `stop.ts` |

### Hook Execution Flow

```
Session Start
    ↓
SessionStart hook loads Base (USER + SYSTEM + SECURITY files)
    ↓
PAL Master initialized with full context
    ↓
During Execution:
    - Before tool use → PreToolUse hook validates against GUARDRAILS.md
    - Decision: Block (catastrophic) / Warn (risky) / Allow (safe)
    ↓
Session End
    ↓
Stop hook executes: notifications, save transcript, log summary
```

**See:** [MEMORY_LOGIC.md](MEMORY_LOGIC.md) for detailed hook implementation guidance.

---

## Bun Commands

### What is Bun?

**Bun** = Fast all-in-one JavaScript runtime (alternative to Node.js).

**Key Features:**

- Runs TypeScript natively (no compilation step)
- Fast execution (3x faster than Node.js in many cases)
- Built-in package manager
- Built-in test runner
- Excellent for CLI utilities

**Why Bun for PAL:**

1. **TypeScript support** - Run `.ts` files directly
2. **Speed** - Fast execution for CLI utilities
3. **Single runtime** - Hooks and utilities use same runtime
4. **Modern** - Active development, growing ecosystem

### Bun Command Structure

**Basic Command:**

```bash
bun run <file.ts> [args]
```

**Examples:**

```bash
# Run TypeScript utility directly
bun run .claude/tools/validate_base.ts

# Pass arguments
bun run .claude/skills/art/tools/generate_diagram.ts --type=architecture --output=docs/diagrams/
```

### Integration with Workflows

Workflows call Bun commands for deterministic operations:

```markdown
### Step 3: Generate Metadata
**Purpose:** Extract metadata for blog index
**Actions:**
- Run Bun utility: `bun run scripts/extract_metadata.ts blog/ai-ethics.md`
- Utility reads blog post, extracts title, date, tags, summary
- Outputs JSON metadata file

**Expected Output:** blog/ai-ethics.meta.json
```

**Benefits:**

- **Deterministic** - Same input = same output
- **Testable** - Utilities can be unit tested independently
- **Reusable** - Utilities usable outside workflows
- **Version controlled** - Scripts tracked in Git

### Common Use Cases

| Use Case | Scenario | Command Example |
| :------- | :------- | :-------------- |
| **File Validation** | Validate Base configuration files have correct structure | `bun run .claude/tools/validate_base.ts` |
| **Data Transformation** | Convert blog posts to different formats | `bun run scripts/convert_blog.ts --input=blog/post.md --format=html` |
| **Diagram Generation** | Generate diagrams from data files | `bun run scripts/generate_diagrams.ts --data=docs/api-spec.json` |
| **Security Scanning** | Scan files for sensitive data before committing | `bun run scripts/scan_secrets.ts --path=. --exclude=node_modules` |

### Security Considerations

Bun commands require security awareness:

| Security Risk | Prevention Strategy | Safe Practice |
| :------------ | :------------------ | :------------ |
| **Input Validation** | Always validate command arguments | Check input exists and matches expected pattern before processing |
| **Path Traversal** | Prevent directory traversal attacks | Use `resolve()` and `join()` to validate paths stay within base directory |
| **Command Injection** | Never execute user input as shell commands | Use Node.js APIs directly instead of `exec()` with user input |
| **Sensitive Data** | Never log or expose sensitive data | Mask credentials in logs |
| **File System Permissions** | Respect file system boundaries | Allow: `.claude/`, `blog/`, `docs/` | Block: `.env`, `.git/`, system directories |

---

## Tool Configuration

### Settings Structure

**Location:** `.claude/settings.json`

**Purpose:** Configure PAL tools and hooks.

```json
{
  "hooks": {
    "sessionStart": {
      "enabled": true,
      "loadBase": true,
      "validateBase": false
    },
    "preToolUse": {
      "enabled": true,
      "strictMode": false,
      "blockCredentials": true,
      "warnPII": true
    },
    "stop": {
      "enabled": true,
      "notifications": {
        "desktop": true,
        "email": false,
        "slack": false
      },
      "actions": ["save-transcript", "log-session-summary"]
    }
  },
  "tools": {
    "fileValidation": {
      "enabled": true,
      "validateFrontmatter": true,
      "checkBrokenLinks": true,
      "maxFileSize": 5242880
    },
    "bun": {
      "enabled": true,
      "scriptsPath": "scripts/",
      "allowedPaths": [".claude/", "blog/", "docs/", "scripts/"]
    }
  }
}
```

### Hook Configuration

**SessionStart Hook:**

```json
{
  "hooks": {
    "sessionStart": {
      "enabled": true,
      "loadBase": true,
      "validateBase": false
    }
  }
}
```

**PreToolUse Hook:**

```json
{
  "hooks": {
    "preToolUse": {
      "enabled": true,
      "strictMode": false,
      "blockCredentials": true,
      "warnPII": true
    }
  }
}
```

**Stop Hook:**

```json
{
  "hooks": {
    "stop": {
      "enabled": true,
      "notifications": {
        "desktop": true,
        "email": false,
        "slack": false
      },
      "actions": ["save-transcript", "log-session-summary"]
    }
  }
}
```

### Bun Command Permissions

Configure allowed paths for Bun utilities:

```json
{
  "tools": {
    "bun": {
      "enabled": true,
      "scriptsPath": "scripts/",
      "allowedPaths": [
        ".claude/base/",
        "blog/",
        "docs/",
        "scripts/",
        "public/"
      ],
      "blockedPaths": [
        ".env",
        ".git/",
        "node_modules/",
        "/etc/",
        "/usr/"
      ]
    }
  }
}
```

**Security Note:** PreToolUse hook validates Bun command paths against allowedPaths/blockedPaths.

---

## Creating Custom Tools

### Tool Template

Every CLI tool must follow this structure:

```typescript
#!/usr/bin/env bun
/**
 * tool_name.ts - Brief description
 *
 * Usage:
 *   bun run .claude/tools/tool_name.ts <command> [options]
 *
 * Commands:
 *   validate    Validate configuration
 *   generate    Generate output
 *
 * Options:
 *   --input     Input file path
 *   --output    Output file path
 *   --help      Show help message
 */

import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";

// Parse command line arguments
interface Args {
  input?: string;
  output?: string;
  help?: boolean;
}

function parseArgs(): Args {
  const args: Args = {};
  for (const arg of process.argv.slice(2)) {
    if (arg === "--help") {
      args.help = true;
    } else if (arg.startsWith("--")) {
      const [key, value] = arg.slice(2).split("=");
      args[key as keyof Args] = value;
    }
  }
  return args;
}

// Show help text
function showHelp() {
  console.log(`
Usage: bun run .claude/tools/tool_name.ts [options]

Options:
  --input=<file>    Input file path (required)
  --output=<file>   Output file path (required)
  --help            Show this help message
  `);
}

// Main tool logic
async function runTool(args: Args) {
  try {
    console.log(`Processing ${args.input}...`);
    // Your tool logic here
    console.log("Tool completed successfully");
    process.exit(0);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Entry point
const args = parseArgs();
if (args.help) {
  showHelp();
  process.exit(0);
}
runTool(args);
```

### Tool Requirements

Every CLI tool must:

1. **Be TypeScript** - Use `#!/usr/bin/env bun` shebang
2. **Use lower_snake_case naming** - `tool_name.ts`, not `tool-name.ts`
3. **Have a help file** - `tool_name.help.md` with full documentation
4. **Support `--help`** - Display usage information
5. **Handle errors gracefully** - Clear error messages, appropriate exit codes
6. **Use standard exit codes** - SUCCESS=0, FAILURE=1, INVALID_ARGS=2

### Best Practices

| Practice | Purpose | Implementation |
| :------- | :------ | :------------- |
| **Single Responsibility** | Each tool does ONE thing well | Separate tools: `validate_base.ts`, `extract_metadata.ts`, `generate_diagram.ts` |
| **Composability** | Tools work together | Chain: `extract_metadata.ts` output → `generate_diagram.ts` input |
| **Idempotency** | Same input = same output | Avoid timestamps or random values in output |
| **Testing** | Write tests for tools | Use `bun:test` for unit tests |
| **Self-Documenting** | Include help text | Check for `--help` flag → Print usage → Exit |

---

## Complete Checklist

Before a tool is complete:

### Structure

- [ ] Tool lives in correct directory (`.claude/tools/` or `.claude/skills/[skill]/tools/`)
- [ ] Tool file uses `lower_snake_case.ts` naming
- [ ] Help file exists with `.help.md` suffix

### Implementation

- [ ] TypeScript with `#!/usr/bin/env bun` shebang
- [ ] Supports `--help` flag
- [ ] Uses standard exit codes (0, 1, 2)
- [ ] Handles errors gracefully with clear messages
- [ ] Validates input arguments before processing

### Security

- [ ] Validates file paths (no traversal attacks)
- [ ] Does not execute user input as shell commands
- [ ] Does not log sensitive data
- [ ] Respects file system boundaries

### Integration

- [ ] Can be called from workflows
- [ ] PreToolUse hook can validate execution
- [ ] Output format is documented

---

## Summary

| Component | Purpose | Location |
| :-------- | :------ | :------- |
| **System tools** | Cross-cutting concerns (validation, hooks) | `.claude/tools/` |
| **Skill tools** | Domain-specific operations | `.claude/skills/[skill-name]/tools/` |
| **Hooks** | Lifecycle automation (start, pre-tool, stop) | `.claude/tools/hooks/` |
| **Configuration** | Tool and hook settings | `.claude/settings.json` |

This system ensures:

1. Tools provide deterministic, testable operations
2. Hooks automate system lifecycle behavior
3. Security validation occurs before tool execution
4. **All naming follows PAL's standard conventions**

---

**Document Version:** 0.1.0
**Last Updated:** 2026-01-18
**Related Files:** ARCHITECTURE.md, ORCHESTRATION.md, WORKFLOWS.md, MEMORY_LOGIC.md, AGENTS_LOGIC.md, SKILL_LOGIC.md, DOMAINS_LOGIC.md, GUARDRAILS.md

---
