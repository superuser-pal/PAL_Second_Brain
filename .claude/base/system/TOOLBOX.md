---
title: PAL Toolbox
version: 1.0.0
layer: SYSTEM
purpose: Essential tools, notifications, and integrations
last_updated: 2026-01-13
---

# PAL Toolbox

**Version:** 1.0.0
**Purpose:** Essential tools, CLI utilities, and integrations available in PAL
**Layer:** SYSTEM

---

## Section 1: Essential Tools

### Tool Philosophy

| Aspect             | Comprehensive Toolbox (PAI)                   | Essential Toolbox (PAL)        |
| ------------------ | --------------------------------------------- | ------------------------------ |
| **Scope**          | 20+ tools and integrations                    | 4 essential tool categories    |
| **Complexity**     | External integrations (Make.com, Zapier, n8n) | Core operations only           |
| **Maintenance**    | Requires integration upkeep                   | Minimal maintenance            |
| **Learning Curve** | Steep (many tools to learn)                   | Gentle (focus on fundamentals) |
| **Goal**           | Maximum automation                            | Reliable core operations       |

**Why Essential Over Comprehensive:**

1. **Prove foundation first** - Master Base + Hooks before adding external integrations
2. **Reduce complexity** - Fewer tools = easier to understand and maintain
3. **User feedback driven** - Add tools based on proven user needs
4. **Reliability focus** - Core tools work perfectly vs many tools working inconsistently

### Four Essential Tool Categories

| Tool Category           | Purpose                                                         | Implementation                                    | Key Capabilities                                                                                                             | Reference                                                                                                                                 |
| ----------------------- | --------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Notifications**       | Inform user of session completion and important events          | Stop hook (`.claude/hooks/stop.ts`)               | Desktop notifications, session alerts, configurable preferences                                                              | [MEMORY_LOGIC.md](MEMORY_LOGIC.md) Section 3                                                                                              |
| **Security Validation** | Validate operations before execution to prevent security issues | PreToolUse hook (`.claude/hooks/pre-tool-use.ts`) | Credential detection, PII scanning, GUARDRAILS enforcement, risk assessment (ALLOW/WARN/BLOCK)                               | [MEMORY_LOGIC.md](MEMORY_LOGIC.md) Section 2, [Security Validation Pattern](../../docs/patterns/Integrity/security-validation-pattern.md) |
| **File Validation**     | Check file structure, integrity, and format compliance          | Utility functions (callable from workflows/hooks) | YAML frontmatter validation, markdown structure checking, file size limits, format compliance, link validation               | [File Validation Pattern](../../docs/patterns/Integrity/file-validation-pattern.md)                                                       |
| **Bun Commands**        | Enable deterministic CLI operations and workflow automation     | Bun runtime commands via Bash tool                | Run TypeScript/JavaScript utilities directly, workflow automation, file processing, data transformation, custom CLI commands | Section 2 below                                                                                                                           |

---

## Section 2: Bun Commands

### What is Bun?

**Bun** = Fast all-in-one JavaScript runtime (alternative to Node.js)

**Key Features:**

- Runs TypeScript natively (no compilation step)
- Fast execution (3x faster than Node.js in many cases)
- Built-in package manager
- Built-in test runner
- Excellent for CLI utilities

**Why Bun for PAL:**

1. **TypeScript support** - Run `.ts` files directly
2. **Speed** - Fast execution for CLI utilities
3. **Single runtime** - Hooks (TypeScript) and utilities (TypeScript) use same runtime
4. **Modern** - Active development, growing ecosystem

### Bun Command Structure

**Basic Bun Command:**

```bash
bun run <file.ts> [args]
```

**Example:**

```bash
# Run TypeScript utility directly
bun run scripts/validate-base.ts

# Pass arguments
bun run scripts/generate-diagram.ts --type=architecture --output=docs/diagrams/
```

### Integration with Workflows

**Workflows can call Bun commands for deterministic operations:**

```yaml
# Example: PublishBlogPost workflow step

### Step 3: Generate Metadata
**Purpose:** Extract metadata for blog index
**Actions:**
- Run Bun utility: bun run scripts/extract-metadata.ts blog/ai-ethics.md
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

| Use Case                | Scenario                                                     | Command Example                                                                          | Key Functionality                                                                                                    | Workflow Integration                                                              |
| ----------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **File Validation**     | Validate Base configuration files have correct structure     | `bun run scripts/validate-base.ts`                                                       | Check expected files exist, validate YAML frontmatter, verify required fields                                        | Step 1 in workflows: Validate config → Report errors if fail → Continue if pass   |
| **Data Transformation** | Convert blog posts to different formats (HTML, JSON, etc.)   | `bun run scripts/convert-blog.ts --input=blog/post.md --format=html --output=public/`    | Read markdown + frontmatter, convert to target format, wrap in template, write output file                           | PublishBlogPost workflow: Convert → Generate HTML for website → Output to public/ |
| **Diagram Generation**  | Generate multiple diagrams from data files (API specs, etc.) | `bun run scripts/generate-diagrams.ts --data=docs/api-spec.json --output=docs/diagrams/` | Read specification, generate architecture diagram, create sequence diagrams per endpoint, write Excalidraw files     | CreateAPIDocs workflow: Parse spec → Generate diagrams → Output .excalidraw files |
| **Security Scanning**   | Scan files for sensitive data before committing              | `bun run scripts/scan-secrets.ts --path=. --exclude=node_modules,dist`                   | Recursive directory scan, regex pattern matching (API keys, passwords, JWT, AWS keys, private keys), report findings | Pre-commit workflow: Scan → Block if secrets found → Allow if clean               |

### Security Considerations

**Bun commands require security awareness:**

| Security Risk               | Prevention Strategy                        | Safe Practice                                                                                                             |
| --------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **Input Validation**        | Always validate command arguments          | Check input exists and matches expected pattern before processing (e.g., `if (!input.startsWith("blog/"))`)               |
| **Path Traversal**          | Prevent directory traversal attacks        | Use `resolve()` and `join()` to validate paths stay within base directory: `if (!fullPath.startsWith(basePath)) exit(1)`  |
| **Command Injection**       | Never execute user input as shell commands | Use Node.js APIs directly (e.g., `readdir()`) instead of `exec(\`ls ${userInput}\`)`                                      |
| **Sensitive Data**          | Never log or expose sensitive data         | Mask credentials in logs: `${apiKey?.slice(0,4)}...${apiKey?.slice(-4)}`                                                  |
| **File System Permissions** | Respect file system boundaries             | ✅ Allow: `.claude/Base/`, `blog/`, `docs/`, `scripts/`<br>❌ Block: `.env`, `.git/`, `node_modules/`, system directories |

### Bun Command Best Practices

| Practice                      | Purpose                                | Implementation                                                                                               |
| ----------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Self-Documenting Commands** | Include help text for usability        | Check for `--help` flag → Print usage, options, examples → Exit                                              |
| **Error Handling**            | Handle errors gracefully               | Try-catch with specific error codes (ENOENT, EACCES) → Log descriptive messages → Exit with appropriate code |
| **Exit Codes**                | Use standard exit codes                | SUCCESS=0, FAILURE=1, INVALID_ARGS=2 → Exit with correct code based on result                                |
| **Progress Feedback**         | Provide updates for long operations    | Log `[${i+1}/${total}] Processing...` messages → Display completion status                                   |
| **Configuration Files**       | Use config files for complex utilities | Store templates, paths, settings in JSON → Import and reference in script                                    |

---

## Section 3: Tool Configuration

### Settings.json Structure

**Location:** `.claude/settings.json`

**Purpose:** Configure PAL tools and hooks

**Structure:**

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
  },
  "notifications": {
    "desktop": {
      "enabled": true,
      "sound": true,
      "iconPath": ".claude/icon.png"
    },
    "email": {
      "enabled": false,
      "smtp": {
        "host": "smtp.example.com",
        "port": 587,
        "secure": true,
        "auth": {
          "user": "user@example.com",
          "pass": "${EMAIL_PASSWORD}"
        }
      }
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
      "enabled": true, // Enable/disable hook
      "loadBase": true, // Load Base configuration
      "validateBase": false // Validate Base structure (optional)
    }
  }
}
```

**PreToolUse Hook:**

```json
{
  "hooks": {
    "preToolUse": {
      "enabled": true, // Enable/disable hook
      "strictMode": false, // Block on warnings (not just errors)
      "blockCredentials": true, // Block credential exposure
      "warnPII": true // Warn on PII detection
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
        "desktop": true, // Desktop notification
        "email": false, // Email notification
        "slack": false // Slack notification
      },
      "actions": [
        "save-transcript", // Save session transcript
        "log-session-summary" // Log summary to file
      ]
    }
  }
}
```

### Notification Preferences

**Desktop Notifications:**

```json
{
  "notifications": {
    "desktop": {
      "enabled": true,
      "sound": true, // Play notification sound
      "iconPath": ".claude/icon.png" // Custom icon (optional)
    }
  }
}
```

**Email Notifications:**

```json
{
  "notifications": {
    "email": {
      "enabled": true,
      "smtp": {
        "host": "smtp.gmail.com",
        "port": 587,
        "secure": true,
        "auth": {
          "user": "your-email@gmail.com",
          "pass": "${EMAIL_PASSWORD}" // Environment variable
        }
      },
      "from": "your-email@gmail.com",
      "to": "your-email@gmail.com",
      "subject": "PAL Session Complete"
    }
  }
}
```

**Note:** Store sensitive credentials (email password, API keys) in environment variables, NOT in settings.json

### Bun Command Permissions

**Configure allowed paths for Bun utilities:**

```json
{
  "tools": {
    "bun": {
      "enabled": true,
      "scriptsPath": "scripts/", // Where utility scripts live
      "allowedPaths": [
        // Paths utilities can access
        ".claude/Base/", // Base configuration (read-only recommended)
        "blog/", // Blog content (read/write)
        "docs/", // Documentation (read/write)
        "scripts/", // Utility scripts (read)
        "public/" // Public output (write)
      ],
      "blockedPaths": [
        // Paths utilities CANNOT access
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

**Security Note:** PreToolUse hook should validate Bun command paths against allowedPaths/blockedPaths

---

## Section 4: Creating Custom Tools

### Custom Tool Template

**Creating a new utility tool:**

```typescript
// scripts/my-custom-tool.ts

/**
 * My Custom Tool
 *
 * Description: Brief description of what this tool does
 *
 * Usage:
 *   bun run scripts/my-custom-tool.ts --option1=value1 --option2=value2
 *
 * Example:
 *   bun run scripts/my-custom-tool.ts --input=file.md --output=result.json
 */

import { readFile, writeFile } from "fs/promises";
import { resolve, join } from "path";

// Parse command line arguments
interface Args {
  input?: string;
  output?: string;
  format?: string;
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
Usage: bun run scripts/my-custom-tool.ts [options]

Options:
  --input=<file>    Input file path (required)
  --output=<file>   Output file path (required)
  --format=<fmt>    Output format (optional, default: json)
  --help            Show this help message

Example:
  bun run scripts/my-custom-tool.ts --input=data.md --output=result.json --format=json
  `);
}

// Validate arguments
function validateArgs(args: Args): boolean {
  if (!args.input) {
    console.error("❌ Error: --input is required");
    return false;
  }

  if (!args.output) {
    console.error("❌ Error: --output is required");
    return false;
  }

  return true;
}

// Main tool logic
async function runTool(args: Args) {
  try {
    // Read input file
    console.log(`Reading ${args.input}...`);
    const inputPath = resolve(args.input!);
    const content = await readFile(inputPath, "utf-8");

    // Process content (your custom logic here)
    console.log("Processing...");
    const result = processContent(content, args.format || "json");

    // Write output file
    console.log(`Writing ${args.output}...`);
    const outputPath = resolve(args.output!);
    await writeFile(outputPath, result);

    console.log("✅ Tool completed successfully");
    process.exit(0);
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

function processContent(content: string, format: string): string {
  // Your custom processing logic here

  if (format === "json") {
    return JSON.stringify({ content }, null, 2);
  }

  return content;
}

// Entry point
const args = parseArgs();

if (args.help) {
  showHelp();
  process.exit(0);
}

if (!validateArgs(args)) {
  showHelp();
  process.exit(2);
}

runTool(args);
```

### Integration with Hooks

**Custom tools can be called from hooks:**

```typescript
// .claude/hooks/session-start.ts

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function sessionStart(context: SessionContext) {
  // Load Base configuration (standard)
  const baseFiles = await loadBase();

  // Run custom validation tool
  try {
    const { stdout, stderr } = await execAsync(
      "bun run scripts/validate-base.ts"
    );
    console.log(stdout);

    if (stderr) {
      console.warn("⚠️ Base validation warnings:", stderr);
    }
  } catch (error) {
    console.error("❌ Base validation failed:", error.message);
    // Decide: block session start or just warn?
  }

  return context;
}
```

### Best Practices for Custom Tools

#### 1. Single Responsibility

**Each tool does ONE thing well:**

```typescript
// ✅ Good: Focused tools
scripts/validate-base.ts       // Validates Base configuration
scripts/extract-metadata.ts    // Extracts metadata from files
scripts/generate-diagram.ts    // Generates diagrams

// ❌ Bad: Monolithic tool
scripts/do-everything.ts       // Validates, extracts, generates all in one
```

#### 2. Composability

**Tools should work together:**

```bash
# Extract metadata, then generate diagram from metadata
bun run scripts/extract-metadata.ts --input=blog/post.md --output=temp/meta.json
bun run scripts/generate-diagram.ts --data=temp/meta.json --output=docs/diagrams/
```

#### 3. Idempotency

**Running tool multiple times with same input produces same output:**

```typescript
// ✅ Idempotent
function generateSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-");
}

// ❌ Not idempotent (uses timestamp)
function generateSlug(title: string): string {
  return `${title.toLowerCase()}-${Date.now()}`;
}
```

#### 4. Testing

**Write tests for custom tools:**

```typescript
// scripts/__tests__/my-custom-tool.test.ts

import { expect, test } from "bun:test";
import { processContent } from "../my-custom-tool";

test("processContent converts markdown to JSON", () => {
  const input = "# Title\n\nContent here";
  const result = processContent(input, "json");

  const parsed = JSON.parse(result);
  expect(parsed.content).toContain("Title");
});

test("processContent handles empty input", () => {
  const result = processContent("", "json");
  expect(result).toBe('{"content":""}');
});
```

**Run tests:**

```bash
bun test scripts/__tests__/
```

---

## Conclusion

PAL's toolbox provides **essential, reliable tools** through:

1. **Four Essential Tool Categories**

   - Notifications (Stop hook)
   - Security Validation (PreToolUse hook)
   - File Validation (utility functions)
   - Bun Commands (CLI utilities)

2. **Bun Command System**

   - TypeScript utilities for deterministic operations
   - Integration with workflows
   - Security-aware command execution
   - Common use cases and examples

3. **Configuration System**

   - [settings.json](../../.claude/settings.json) for tool configuration
   - Hook preferences
   - Notification settings
   - Bun command permissions

4. **Custom Tool Creation**
   - Template for building new tools
   - Integration with hooks
   - Best practices (single responsibility, composability, idempotency, testing)

**For Users:**

- Use essential tools (notifications, security validation, file validation)
- Create Bun utilities for custom needs
- Configure tools via [settings.json](../../.claude/settings.json)
- Add external integrations manually if needed (future versions will streamline)

**For Framework Master:**

- Leverage hooks for system operations
- Call Bun utilities from workflows
- Validate operations with PreToolUse hook
- Suggest tool usage when appropriate

**Next Steps:**

- Read [MEMORY_LOGIC.md](MEMORY_LOGIC.md) for hook system details
- Read [WORKFLOWS.md](WORKFLOWS.md) for workflow integration
- Read [GUARDRAILS.md](../Security/GUARDRAILS.md) for security rules
- Create custom Bun utilities in `scripts/` directory

---

**Document Version:** 1.0.0
**Last Updated:** 2026-01-14
**Related Files:** ARCHITECTURE.md, ORCHESTRATION.md, WORKFLOWS.md, MEMORY_LOGIC.md, GUARDRAILS.md

---

## Migration & Integration

> **AI INSTRUCTIONS**: When this file is placed in a new project, follow these integration steps.

### Layer Classification

- **Layer**: SYSTEM
- **Priority**: 15 (last SYSTEM file - tools and integrations)
- **Dependencies**: MEMORY_LOGIC.md (tools integrate with hooks)

### Target Location

```
[PROJECT_ROOT]/PAL_Base/System/TOOLBOX.md
```

### Integration Steps

1. **Verify Directory Structure**

   ```bash
   mkdir -p PAL_Base/System
   ```

2. **Place File**

   - Copy this file to `PAL_Base/System/TOOLBOX.md`
   - Preserve UPPERCASE filename

3. **Register in SessionStart Hook**

   ```typescript
   // In .claude/hooks/session-start.ts
   const systemFiles = [
     "PAL_Base/System/ARCHITECTURE.md", // Priority: 11
     "PAL_Base/System/ORCHESTRATION.md", // Priority: 12
     "PAL_Base/System/WORKFLOWS.md", // Priority: 13
     "PAL_Base/System/MEMORY_LOGIC.md", // Priority: 14
     "PAL_Base/System/TOOLBOX.md", // Priority: 15
   ];
   ```

4. **Validate Integration**
   - Start new Claude Code session
   - Request a task requiring tools
   - Verify PAL uses appropriate tools

### How This File Is Used

| System Component | Usage                           |
| ---------------- | ------------------------------- |
| **PAL Master**   | Reference for available tools   |
| **Bun Commands** | Guides CLI utility usage        |
| **Custom Tools** | Template for creating new tools |
| **Settings**     | Configures tool integration     |

### Customization Required

This file is **reference documentation** - may need customization:

- [ ] **Review** - Understand 4 essential tool categories
- [ ] **Bun Commands** - Add project-specific utilities
- [ ] **Custom Tools** - Use template to create new tools
- [ ] **Settings** - Configure tool preferences

### First-Use Checklist

- [ ] File placed in `PAL_Base/System/`
- [ ] SessionStart hook loads file at priority 15
- [ ] Essential tools understood
- [ ] Bun runtime available
- [ ] Custom tools created as needed
