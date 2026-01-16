---
title: PAL Hook Templates
version: 1.0.0
category: Configuration
layer: DOCS
purpose: Pseudocode templates for implementing PAL hooks
audience: Technical-curious professionals implementing hooks
last_updated: 2026-01-14
---

# PAL Hook Templates

**Version:** 1.0.0
**Purpose:** Pseudocode templates for implementing the three essential PAL hooks
**Layer:** DOCS (Configuration Reference)

---

## Overview

PAL uses three hooks to control system behavior at specific lifecycle points:

| Hook | Trigger | Purpose |
|------|---------|---------|
| **SessionStart** | Session begins | Load Base context into AI |
| **PreToolUse** | Before tool execution | Security validation |
| **Stop** | Session ends | Notifications, cleanup |

This document provides pseudocode templates that you can adapt to your environment.

---

## Hook 1: SessionStart

**Purpose:** Load all PAL_Base files into AI context at session start
**Trigger:** When a new Claude Code session begins
**Location:** `.claude/hooks/session-start.ts`

### Pseudocode Template

```typescript
// ═══════════════════════════════════════════════════════════════════
// SESSION START HOOK
// Loads PAL_Base context at session initialization
// ═══════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────

const BASE_PATH = "PAL_Base";

// Files to load, in priority order
// Lower number = loaded first = higher priority
const BASE_FILES = [
  // USER Layer (Priority 1-9)
  { path: "User/ABOUTME.md",       priority: 1,  layer: "USER" },
  { path: "User/DIRECTIVES.md",    priority: 2,  layer: "USER" },
  { path: "User/TECHSTACK.md",     priority: 3,  layer: "USER" },
  { path: "User/TERMINOLOGY.md",   priority: 4,  layer: "USER" },
  { path: "User/DIGITALASSETS.md", priority: 5,  layer: "USER" },
  { path: "User/CONTACTS.md",      priority: 6,  layer: "USER" },
  { path: "User/ONBOARDING.md",    priority: 7,  layer: "USER" },
  { path: "User/RESUME.md",        priority: 8,  layer: "USER" },
  { path: "User/ART.md",           priority: 9,  layer: "USER" },

  // SYSTEM Layer (Priority 11-15)
  { path: "System/ARCHITECTURE.md",  priority: 11, layer: "SYSTEM" },
  { path: "System/ORCHESTRATION.md", priority: 12, layer: "SYSTEM" },
  { path: "System/WORKFLOWS.md",     priority: 13, layer: "SYSTEM" },
  { path: "System/MEMORY_LOGIC.md",  priority: 14, layer: "SYSTEM" },
  { path: "System/TOOLBOX.md",       priority: 15, layer: "SYSTEM" },

  // SECURITY Layer (Priority 21-22)
  { path: "Security/GUARDRAILS.md",  priority: 21, layer: "SECURITY" },
  { path: "Security/REPOS_RULES.md", priority: 22, layer: "SECURITY" },
];

// ─────────────────────────────────────────────────────────────────
// MAIN EXECUTION
// ─────────────────────────────────────────────────────────────────

async function main() {
  // Sort files by priority
  const sortedFiles = BASE_FILES.sort((a, b) => a.priority - b.priority);

  // Track loaded files for summary
  const loaded = [];
  const failed = [];

  // Output header
  console.log("═══════════════════════════════════════════════════════════");
  console.log("PAL BASE CONTEXT LOADING");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("");

  // Load each file
  for (const file of sortedFiles) {
    const fullPath = `${BASE_PATH}/${file.path}`;

    try {
      // Check if file exists
      const exists = await fileExists(fullPath);

      if (exists) {
        // Read file content
        const content = await readFile(fullPath);

        // Output to AI context
        // Claude Code reads stdout from hooks
        console.log(`─────────────────────────────────────────────────────────`);
        console.log(`[${file.layer}] ${file.path} (Priority: ${file.priority})`);
        console.log(`─────────────────────────────────────────────────────────`);
        console.log(content);
        console.log("");

        loaded.push(file.path);
      } else {
        // File doesn't exist - warn but continue
        console.log(`⚠️  MISSING: ${fullPath}`);
        failed.push(file.path);
      }
    } catch (error) {
      // Error reading file - log and continue
      console.log(`❌ ERROR loading ${fullPath}: ${error.message}`);
      failed.push(file.path);
    }
  }

  // Output summary
  console.log("═══════════════════════════════════════════════════════════");
  console.log("CONTEXT LOADING COMPLETE");
  console.log(`✓ Loaded: ${loaded.length} files`);
  if (failed.length > 0) {
    console.log(`⚠️  Failed: ${failed.length} files`);
  }
  console.log("═══════════════════════════════════════════════════════════");
}

// ─────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS (implement based on your runtime)
// ─────────────────────────────────────────────────────────────────

async function fileExists(path: string): Promise<boolean> {
  // Implementation depends on runtime
  // Bun: await Bun.file(path).exists()
  // Node: fs.existsSync(path)
  // Deno: await Deno.stat(path).catch(() => null)
}

async function readFile(path: string): Promise<string> {
  // Implementation depends on runtime
  // Bun: await Bun.file(path).text()
  // Node: fs.readFileSync(path, 'utf-8')
  // Deno: await Deno.readTextFile(path)
}

// Run main
main().catch(console.error);
```

### Key Implementation Notes

1. **Priority Order:** Files load in priority order (1 first, 22 last)
2. **Layer Grouping:** USER → SYSTEM → SECURITY
3. **Graceful Failures:** Missing files warn but don't crash
4. **Stdout Output:** Claude Code reads hook stdout as context

---

## Hook 2: PreToolUse

**Purpose:** Validate operations against security rules before execution
**Trigger:** Before any tool (Write, Edit, Bash, etc.) executes
**Location:** `.claude/hooks/pre-tool-use.ts`

### Pseudocode Template

```typescript
// ═══════════════════════════════════════════════════════════════════
// PRE-TOOL-USE HOOK
// Security validation before tool execution
// ═══════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────
// HOOK INPUT
// Claude Code passes tool information via environment or stdin
// ─────────────────────────────────────────────────────────────────

interface ToolUseInput {
  tool: string;           // Tool name: "Write", "Edit", "Bash", etc.
  parameters: {
    file_path?: string;   // For file operations
    command?: string;     // For Bash operations
    content?: string;     // For Write operations
    // ... other tool-specific parameters
  };
}

// ─────────────────────────────────────────────────────────────────
// SECURITY RULES
// Based on PAL_Base/Security/GUARDRAILS.md
// ─────────────────────────────────────────────────────────────────

const SECURITY_RULES = {
  // BLOCK: Always prevent these (catastrophic)
  blocked: {
    patterns: {
      credentials: [
        /password\s*[:=]\s*["'][^"']+["']/gi,
        /api[_-]?key\s*[:=]\s*["'][^"']+["']/gi,
        /secret\s*[:=]\s*["'][^"']+["']/gi,
        /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/gi,
      ],
      paths: [
        /^\/etc\//,
        /^\/usr\//,
        /^\/var\//,
        /^~\/\.(ssh|aws|gnupg)/,
        /\.env$/,
        /credentials\.json$/,
      ],
      commands: [
        /rm\s+-rf\s+[\/~]/,
        /chmod\s+777/,
        />\s*\/dev\/sd/,
        /mkfs\./,
        /dd\s+if=/,
      ],
    },
  },

  // WARN: Alert user but allow (risky)
  warned: {
    patterns: {
      pii: [
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,  // Email
        /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/,                          // Phone
      ],
      destructive: [
        /git\s+push\s+.*--force/,
        /git\s+reset\s+--hard/,
        /DROP\s+TABLE/i,
        /DELETE\s+FROM.*WHERE\s+1\s*=\s*1/i,
      ],
    },
  },
};

// ─────────────────────────────────────────────────────────────────
// VALIDATION LOGIC
// ─────────────────────────────────────────────────────────────────

type ValidationResult =
  | { status: "allow" }
  | { status: "warn"; message: string }
  | { status: "block"; message: string };

function validateToolUse(input: ToolUseInput): ValidationResult {
  const { tool, parameters } = input;

  // Check content for credentials (BLOCK)
  if (parameters.content) {
    for (const pattern of SECURITY_RULES.blocked.patterns.credentials) {
      if (pattern.test(parameters.content)) {
        return {
          status: "block",
          message: `BLOCKED: Potential credential detected in content. Remove sensitive data before proceeding.`,
        };
      }
    }
  }

  // Check file paths (BLOCK)
  if (parameters.file_path) {
    for (const pattern of SECURITY_RULES.blocked.patterns.paths) {
      if (pattern.test(parameters.file_path)) {
        return {
          status: "block",
          message: `BLOCKED: Operation on restricted path: ${parameters.file_path}`,
        };
      }
    }
  }

  // Check commands (BLOCK)
  if (tool === "Bash" && parameters.command) {
    for (const pattern of SECURITY_RULES.blocked.patterns.commands) {
      if (pattern.test(parameters.command)) {
        return {
          status: "block",
          message: `BLOCKED: Dangerous command pattern detected: ${parameters.command}`,
        };
      }
    }
  }

  // Check for PII (WARN)
  if (parameters.content) {
    for (const pattern of SECURITY_RULES.warned.patterns.pii) {
      if (pattern.test(parameters.content)) {
        return {
          status: "warn",
          message: `WARNING: Potential PII detected. Verify this should be included.`,
        };
      }
    }
  }

  // Check destructive operations (WARN)
  if (parameters.command) {
    for (const pattern of SECURITY_RULES.warned.patterns.destructive) {
      if (pattern.test(parameters.command)) {
        return {
          status: "warn",
          message: `WARNING: Destructive operation detected. Confirm this is intentional.`,
        };
      }
    }
  }

  // Default: Allow
  return { status: "allow" };
}

// ─────────────────────────────────────────────────────────────────
// MAIN EXECUTION
// ─────────────────────────────────────────────────────────────────

async function main() {
  // Get tool use input (implementation varies by hook interface)
  const input = await getToolUseInput();

  // Validate
  const result = validateToolUse(input);

  // Handle result
  switch (result.status) {
    case "block":
      // Exit with error - prevents tool execution
      console.error(result.message);
      process.exit(1);
      break;

    case "warn":
      // Output warning but allow
      console.warn(result.message);
      process.exit(0);
      break;

    case "allow":
      // Silent success
      process.exit(0);
      break;
  }
}

// ─────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────

async function getToolUseInput(): Promise<ToolUseInput> {
  // Implementation depends on Claude Code hook interface
  // Options:
  // 1. Environment variables: process.env.CLAUDE_TOOL_NAME, etc.
  // 2. Stdin: JSON passed via stdin
  // 3. Arguments: process.argv

  // Example: Reading from environment
  return {
    tool: process.env.CLAUDE_TOOL_NAME || "",
    parameters: JSON.parse(process.env.CLAUDE_TOOL_PARAMS || "{}"),
  };
}

main().catch(console.error);
```

### Key Implementation Notes

1. **Exit Codes:** Exit 1 = block, Exit 0 = allow
2. **Pattern Matching:** Uses regex for flexible rule matching
3. **Layered Validation:** BLOCK checks run before WARN checks
4. **Graceful Output:** Messages help user understand why blocked

---

## Hook 3: Stop

**Purpose:** Send notifications and perform cleanup when session ends
**Trigger:** When user ends session (/stop, exit, or session timeout)
**Location:** `.claude/hooks/stop.ts`

### Pseudocode Template

```typescript
// ═══════════════════════════════════════════════════════════════════
// STOP HOOK
// Notifications and cleanup on session end
// ═══════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────

const CONFIG = {
  // Notification settings
  notifications: {
    enabled: true,
    method: "terminal-notifier", // Options: terminal-notifier, osascript, ntfy
  },

  // Transcript settings
  transcript: {
    save: true,
    directory: "transcripts",
    format: "markdown", // Options: markdown, json, txt
  },

  // Summary settings
  summary: {
    generate: true,
    includeStats: true,
  },
};

// ─────────────────────────────────────────────────────────────────
// NOTIFICATION FUNCTIONS
// ─────────────────────────────────────────────────────────────────

async function sendNotification(title: string, message: string): Promise<void> {
  if (!CONFIG.notifications.enabled) return;

  switch (CONFIG.notifications.method) {
    case "terminal-notifier":
      // macOS: brew install terminal-notifier
      await runCommand(`terminal-notifier -title "${title}" -message "${message}"`);
      break;

    case "osascript":
      // macOS native
      await runCommand(`osascript -e 'display notification "${message}" with title "${title}"'`);
      break;

    case "ntfy":
      // Cross-platform: ntfy.sh
      await fetch("https://ntfy.sh/your-topic", {
        method: "POST",
        body: message,
        headers: { "Title": title },
      });
      break;
  }
}

// ─────────────────────────────────────────────────────────────────
// TRANSCRIPT FUNCTIONS
// ─────────────────────────────────────────────────────────────────

async function saveTranscript(sessionData: SessionData): Promise<string | null> {
  if (!CONFIG.transcript.save) return null;

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `session-${timestamp}.${CONFIG.transcript.format}`;
  const filepath = `${CONFIG.transcript.directory}/${filename}`;

  // Ensure directory exists
  await ensureDirectory(CONFIG.transcript.directory);

  // Format content based on format
  let content: string;
  switch (CONFIG.transcript.format) {
    case "markdown":
      content = formatTranscriptMarkdown(sessionData);
      break;
    case "json":
      content = JSON.stringify(sessionData, null, 2);
      break;
    default:
      content = formatTranscriptPlaintext(sessionData);
  }

  // Write file
  await writeFile(filepath, content);

  return filepath;
}

function formatTranscriptMarkdown(data: SessionData): string {
  return `# Session Transcript

**Date:** ${data.timestamp}
**Duration:** ${data.duration}
**Messages:** ${data.messageCount}

## Summary

${data.summary || "No summary generated."}

## Statistics

- Tools used: ${data.toolsUsed.join(", ")}
- Files modified: ${data.filesModified.length}
- Commands run: ${data.commandsRun}

## Messages

${data.messages.map(m => `### ${m.role}\n\n${m.content}\n`).join("\n")}
`;
}

// ─────────────────────────────────────────────────────────────────
// SUMMARY FUNCTIONS
// ─────────────────────────────────────────────────────────────────

function generateSummary(sessionData: SessionData): string {
  if (!CONFIG.summary.generate) return "";

  const lines = [
    "═══════════════════════════════════════════════════════════",
    "SESSION COMPLETE",
    "═══════════════════════════════════════════════════════════",
    "",
  ];

  if (CONFIG.summary.includeStats) {
    lines.push(`Duration: ${sessionData.duration}`);
    lines.push(`Messages: ${sessionData.messageCount}`);
    lines.push(`Tools Used: ${sessionData.toolsUsed.join(", ") || "None"}`);
    lines.push(`Files Modified: ${sessionData.filesModified.length}`);
    lines.push("");
  }

  lines.push("═══════════════════════════════════════════════════════════");

  return lines.join("\n");
}

// ─────────────────────────────────────────────────────────────────
// MAIN EXECUTION
// ─────────────────────────────────────────────────────────────────

interface SessionData {
  timestamp: string;
  duration: string;
  messageCount: number;
  toolsUsed: string[];
  filesModified: string[];
  commandsRun: number;
  messages: Array<{ role: string; content: string }>;
  summary?: string;
}

async function main() {
  // Get session data (implementation varies)
  const sessionData = await getSessionData();

  // Generate and output summary
  const summary = generateSummary(sessionData);
  console.log(summary);

  // Save transcript if enabled
  const transcriptPath = await saveTranscript(sessionData);
  if (transcriptPath) {
    console.log(`Transcript saved: ${transcriptPath}`);
  }

  // Send notification
  await sendNotification(
    "PAL Session Complete",
    `Session ended. ${sessionData.filesModified.length} files modified.`
  );
}

// ─────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────

async function getSessionData(): Promise<SessionData> {
  // Implementation depends on Claude Code session interface
  // May read from environment, session file, or stdin

  // Placeholder implementation
  return {
    timestamp: new Date().toISOString(),
    duration: "unknown",
    messageCount: 0,
    toolsUsed: [],
    filesModified: [],
    commandsRun: 0,
    messages: [],
  };
}

async function runCommand(cmd: string): Promise<void> {
  // Implementation depends on runtime
  // Bun: Bun.spawn(cmd.split(" "))
  // Node: child_process.execSync(cmd)
}

async function ensureDirectory(path: string): Promise<void> {
  // Create directory if it doesn't exist
}

async function writeFile(path: string, content: string): Promise<void> {
  // Write content to file
}

main().catch(console.error);
```

### Key Implementation Notes

1. **Notifications:** Multiple methods supported (choose based on OS)
2. **Transcripts:** Optional saving in multiple formats
3. **Summary:** Displayed in terminal on session end
4. **Graceful:** All features are optional and configurable

---

## Hook Directory Structure

After implementing all hooks:

```
.claude/
├── hooks/
│   ├── session-start.ts    # Loads Base context
│   ├── pre-tool-use.ts     # Security validation
│   └── stop.ts             # Notifications/cleanup
└── settings.json           # Hook configuration
```

---

## Testing Hooks

### Test SessionStart
1. Start new Claude Code session
2. Check console output shows Base files loading
3. Run `/context` to verify files are in context

### Test PreToolUse
1. Attempt to write a file with "password=" in content
2. Should be BLOCKED with message
3. Attempt normal file write
4. Should succeed

### Test Stop
1. End session with `/stop`
2. Check for notification
3. Verify transcript saved (if enabled)
4. Check summary displayed in terminal

---

## Migration & Integration

> **AI INSTRUCTIONS**: When this file is placed in a new project, follow these integration steps.

### Layer Classification
- **Layer**: DOCS (Configuration Reference)
- **Priority**: N/A (reference document, not loaded by hooks)
- **Dependencies**: None

### Target Location
```
[PROJECT_ROOT]/PAL_Base/Docs/HOOK_TEMPLATES.md
```

### Integration Steps

1. **Place File**
   - Copy to `PAL_Base/Docs/HOOK_TEMPLATES.md`
   - This is a reference document, not loaded at runtime

2. **Create Hook Directory**
   - Create `.claude/hooks/` directory
   - Implement each hook based on templates above

3. **Configure Settings**
   - Reference SETTINGS_TEMPLATE.md for settings.json
   - Point hooks to your implementations

4. **Test Each Hook**
   - Follow testing steps above
   - Verify each hook fires at correct time

### How This File Is Used

| User/System | Usage |
|-------------|-------|
| **User** | Reference when implementing hooks |
| **AI** | Reference when troubleshooting hooks |
| **Hooks** | Not used directly - template only |

### Customization Required

When implementing hooks from these templates:

- [ ] Choose runtime (Bun recommended)
- [ ] Adapt helper functions to your runtime
- [ ] Configure notification method for your OS
- [ ] Set transcript save preferences
- [ ] Adjust security patterns as needed

### First-Use Checklist
- [ ] Template file in `PAL_Base/Docs/`
- [ ] `.claude/hooks/` directory created
- [ ] All three hooks implemented
- [ ] settings.json configured
- [ ] All hooks tested and working

---

**Document Version:** 1.0.0
**Last Updated:** 2026-01-14
**Related Files:** SETTINGS_TEMPLATE.md, MIGRATION_CHECKLIST.md, GUARDRAILS.md
