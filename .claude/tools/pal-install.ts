#!/usr/bin/env bun
/**
 * PAL Framework Installation Wizard
 *
 * Sets up the PAL Framework in any project directory with complete
 * base configuration, hooks, skills, and agents.
 *
 * Usage:
 *   bun run .claude/tools/pal-install.ts              # Interactive wizard
 *   bun run .claude/tools/pal-install.ts --fresh      # Force fresh install
 *   bun run .claude/tools/pal-install.ts --update     # Update existing
 *   bun run .claude/tools/pal-install.ts --validate   # Validation only
 *   bun run .claude/tools/pal-install.ts --help       # Show help
 */

import {
  existsSync,
  mkdirSync,
  cpSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
} from "fs";
import { join, basename } from "path";
import { userInfo } from "os";
import * as readline from "readline";
import { execSync } from "child_process";

// ============================================================================
// ANSI COLORS
// ============================================================================

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  blue: "\x1b[38;2;59;130;246m",
  green: "\x1b[38;2;34;197;94m",
  yellow: "\x1b[38;2;234;179;8m",
  red: "\x1b[38;2;239;68;68m",
  cyan: "\x1b[38;2;6;182;212m",
  gray: "\x1b[38;2;100;116;139m",
};

const c = colors;

// ============================================================================
// PATHS
// ============================================================================

const PROJECT_DIR = process.cwd();
const CLAUDE_DIR = join(PROJECT_DIR, ".claude");
const DOMAINS_DIR = join(PROJECT_DIR, "domains");

// Source paths (where to copy from - this repo)
const SOURCE_DIR = join(import.meta.dir, "..");

// ============================================================================
// TYPES
// ============================================================================

type InstallMode = "fresh" | "update";

interface PalConfig {
  user: {
    name: string;
    timezone: string;
    technicalLevel: "Beginner" | "Intermediate" | "Advanced";
    preferredLanguage: "TypeScript" | "JavaScript" | "Python";
  };
  project: {
    name: string;
    directory: string;
  };
}

interface ValidationResult {
  passed: boolean;
  checks: Array<{
    name: string;
    passed: boolean;
    message: string;
  }>;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function print(msg: string) {
  console.log(msg);
}

function printHeader() {
  print("");
  print(
    `${c.blue}${c.bold}┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓${c.reset}`
  );
  print(
    `${c.blue}${c.bold}┃${c.reset}              ${c.cyan}PAL Framework Installer${c.reset}                        ${c.blue}${c.bold}┃${c.reset}`
  );
  print(
    `${c.blue}${c.bold}┃${c.reset}       ${c.gray}Pattern-based AI Lifecycle v0.1.0${c.reset}                   ${c.blue}${c.bold}┃${c.reset}`
  );
  print(
    `${c.blue}${c.bold}┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛${c.reset}`
  );
  print("");
}

function printStep(num: number, total: number, msg: string) {
  print(`${c.blue}[${num}/${total}]${c.reset} ${c.bold}${msg}${c.reset}`);
}

function printSuccess(msg: string) {
  print(`  ${c.green}✓${c.reset} ${msg}`);
}

function printWarning(msg: string) {
  print(`  ${c.yellow}!${c.reset} ${msg}`);
}

function printError(msg: string) {
  print(`  ${c.red}✗${c.reset} ${msg}`);
}

function printInfo(msg: string) {
  print(`  ${c.gray}→${c.reset} ${msg}`);
}

async function question(prompt: string, defaultValue?: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const displayPrompt = defaultValue
      ? `${c.cyan}?${c.reset} ${prompt} ${c.dim}[${defaultValue}]${c.reset}: `
      : `${c.cyan}?${c.reset} ${prompt}: `;

    rl.question(displayPrompt, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue || "");
    });
  });
}

async function confirm(prompt: string, defaultYes = true): Promise<boolean> {
  const hint = defaultYes ? "[Y/n]" : "[y/N]";
  const answer = await question(`${prompt} ${c.dim}${hint}${c.reset}`);

  if (!answer) return defaultYes;
  return answer.toLowerCase().startsWith("y");
}

async function selectOption(
  prompt: string,
  options: string[],
  defaultIndex = 0
): Promise<number> {
  print(`${c.cyan}?${c.reset} ${prompt}`);
  for (let i = 0; i < options.length; i++) {
    const marker = i === defaultIndex ? `${c.cyan}>${c.reset}` : " ";
    print(`  ${marker} ${i + 1}. ${options[i]}`);
  }
  const answer = await question(`Enter number`, String(defaultIndex + 1));
  const idx = parseInt(answer) - 1;
  return idx >= 0 && idx < options.length ? idx : defaultIndex;
}

function showHelp() {
  print(`
${c.bold}PAL Framework Installer${c.reset}

${c.cyan}Usage:${c.reset}
  bun run .claude/tools/pal-install.ts [options]

${c.cyan}Options:${c.reset}
  --fresh      Force fresh installation (overwrites existing)
  --update     Update existing installation (preserves user files)
  --validate   Validate installation without making changes
  --help       Show this help message

${c.cyan}Examples:${c.reset}
  bun run .claude/tools/pal-install.ts              # Interactive wizard
  bun run .claude/tools/pal-install.ts --fresh      # Force fresh install
  bun run .claude/tools/pal-install.ts --validate   # Check installation

${c.cyan}Documentation:${c.reset}
  See .claude/tools/pal-install.help.md for detailed instructions.
`);
}

// ============================================================================
// PERMISSIONS & OWNERSHIP
// ============================================================================

function getCurrentUser(): { uid: number; gid: number; username: string } {
  const info = userInfo();
  return {
    uid: info.uid,
    gid: info.gid,
    username: info.username,
  };
}

function fixPermissions(targetDir: string): void {
  const user = getCurrentUser();

  try {
    // Use chown -R for recursive ownership change
    execSync(`chown -R ${user.uid}:${user.gid} "${targetDir}"`, {
      stdio: "pipe",
    });
    printSuccess(`Set ownership to ${user.username}`);

    // Set directory permissions (755) and make .ts files executable
    execSync(`chmod -R 755 "${targetDir}"`, { stdio: "pipe" });
    printSuccess("Set directory permissions (755)");

    // Make TypeScript files executable
    try {
      execSync(`find "${targetDir}" -name "*.ts" -exec chmod 755 {} \\;`, {
        stdio: "pipe",
      });
      printSuccess("Set executable permissions on .ts files");
    } catch {
      // Pattern might not match any files
    }
  } catch (err: any) {
    printWarning(`Permission fix may have failed: ${err.message}`);
    printInfo(`You may need to run: sudo chown -R $(whoami) ${targetDir}`);
  }
}

// ============================================================================
// DETECTION FUNCTIONS
// ============================================================================

function detectExistingInstallation(): boolean {
  return existsSync(join(CLAUDE_DIR, "base"));
}

function determineMode(args: string[]): InstallMode {
  if (args.includes("--fresh")) return "fresh";
  if (args.includes("--update")) return "update";

  // Auto-detect
  if (detectExistingInstallation()) return "update";
  return "fresh";
}

// ============================================================================
// CONFIGURATION GATHERING
// ============================================================================

async function gatherConfig(): Promise<PalConfig> {
  print("");
  print(`${c.bold}Configuration${c.reset}`);
  print(`${c.gray}─────────────────────────────────────────────────${c.reset}`);
  print("");

  const config: PalConfig = {
    user: {
      name: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      technicalLevel: "Intermediate",
      preferredLanguage: "TypeScript",
    },
    project: {
      name: basename(PROJECT_DIR),
      directory: PROJECT_DIR,
    },
  };

  // User name
  config.user.name = await question("What is your name?");

  // Timezone (auto-detected)
  config.user.timezone = await question("Your timezone", config.user.timezone);

  // Technical level
  const techLevels = ["Beginner", "Intermediate", "Advanced"];
  const techIndex = await selectOption(
    "What is your technical level?",
    techLevels,
    1
  );
  config.user.technicalLevel = techLevels[techIndex] as PalConfig["user"]["technicalLevel"];

  // Preferred language
  const languages = ["TypeScript (Recommended)", "JavaScript", "Python"];
  const langIndex = await selectOption(
    "Preferred programming language?",
    languages,
    0
  );
  const langMap = ["TypeScript", "JavaScript", "Python"] as const;
  config.user.preferredLanguage = langMap[langIndex];

  return config;
}

// ============================================================================
// DIRECTORY STRUCTURE CREATION
// ============================================================================

function createDirectoryStructure(): void {
  const dirs = [
    ".claude/base/user",
    ".claude/base/system",
    ".claude/base/security",
    ".claude/skills",
    ".claude/agents",
    ".claude/tools/hooks",
    ".claude/commands/actions",
    ".claude/commands/agents",
    ".claude/config",
    ".claude/mcp",
    "domains",
  ];

  for (const dir of dirs) {
    const fullPath = join(PROJECT_DIR, dir);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
    }
  }
}

// ============================================================================
// FILE COPYING FUNCTIONS
// ============================================================================

function copySystemFiles(): void {
  // Copy system layer files
  const systemSource = join(SOURCE_DIR, "base/system");
  const systemDest = join(CLAUDE_DIR, "base/system");

  if (existsSync(systemSource)) {
    const files = readdirSync(systemSource).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      cpSync(join(systemSource, file), join(systemDest, file));
    }
    printSuccess(`Copied ${files.length} system layer files`);
  } else {
    printWarning("System layer source not found");
  }

  // Copy security layer files
  const securitySource = join(SOURCE_DIR, "base/security");
  const securityDest = join(CLAUDE_DIR, "base/security");

  if (existsSync(securitySource)) {
    const files = readdirSync(securitySource).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      cpSync(join(securitySource, file), join(securityDest, file));
    }
    printSuccess(`Copied ${files.length} security layer files`);
  } else {
    printWarning("Security layer source not found");
  }
}

function copyHooks(): void {
  const hooksSource = join(SOURCE_DIR, "tools/hooks");
  const hooksDest = join(CLAUDE_DIR, "tools/hooks");

  if (existsSync(hooksSource)) {
    const files = readdirSync(hooksSource).filter((f) => f.endsWith(".ts"));
    for (const file of files) {
      cpSync(join(hooksSource, file), join(hooksDest, file));
    }
    printSuccess(`Copied ${files.length} hook files`);
  } else {
    printWarning("Hooks source not found");
  }
}

function copyAgents(): void {
  const agentsSource = join(SOURCE_DIR, "agents");
  const agentsDest = join(CLAUDE_DIR, "agents");

  if (existsSync(agentsSource)) {
    const files = readdirSync(agentsSource).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      cpSync(join(agentsSource, file), join(agentsDest, file));
    }
    printSuccess(`Copied ${files.length} agent files`);
  } else {
    printWarning("Agents source not found");
  }
}

function copySkills(): void {
  const skillsSource = join(SOURCE_DIR, "skills");
  const skillsDest = join(CLAUDE_DIR, "skills");

  if (existsSync(skillsSource)) {
    const skills = readdirSync(skillsSource).filter((s) => {
      const stat = statSync(join(skillsSource, s));
      return stat.isDirectory();
    });

    for (const skill of skills) {
      cpSync(join(skillsSource, skill), join(skillsDest, skill), {
        recursive: true,
      });
    }
    printSuccess(`Copied ${skills.length} skill directories`);
  } else {
    printWarning("Skills source not found");
  }
}

// ============================================================================
// FILE GENERATION FUNCTIONS
// ============================================================================

function generateUserTemplates(config: PalConfig): void {
  const userDir = join(CLAUDE_DIR, "base/user");

  // ABOUTME.md
  const aboutMe = `# ABOUTME.md

**PAL User Layer - Identity Configuration**

---

## Purpose

Personal background and philosophy. Your AI uses this to understand who you are, what you care about, and how to represent you authentically.

---

## Background

### Who I Am

Name: ${config.user.name}
Timezone: ${config.user.timezone}
Technical Level: ${config.user.technicalLevel}

[Add your personal background - 2-3 paragraphs about who you are, what you do, and what matters to you]

### What I'm Known For

[Professional recognition, expertise areas, notable work]

---

## Core Beliefs

### Philosophy

[Your worldview, key beliefs, philosophical stance]

### Values

What I value most:

- [Value 1]
- [Value 2]
- [Value 3]

---

## Current Focus

### What I'm Working On

[Current projects, goals, priorities]

---

**Document Version:** 0.1.0
**Last Updated:** ${new Date().toISOString().split("T")[0]}
`;
  writeFileSync(join(userDir, "ABOUTME.md"), aboutMe);

  // DIRECTIVES.md
  const directives = `# DIRECTIVES.md

**PAL User Layer - System Behavioral Directives**

---

## Purpose

Defines how PAL operates and behaves at system level.

---

## Plan-First Execution

**When to show plans:** Only for complex tasks (2+ steps)

**Plan detail level:** Detailed with rationale

---

## Task Execution Rules

### Pre-Execution Checks

Before starting any work, PAL must:
- Confirm understanding of the goal
- Check TECHSTACK.md for relevant constraints
- Validate against GUARDRAILS.md

### During Execution

**Progress reporting:** Updates only for long tasks

### Post-Execution

After completing work, PAL must:
- Summarize what was done
- Report any deviations from plan
- Suggest next steps (if applicable)

---

## Error Handling Protocol

**Error response procedure:**
1. Stop immediately
2. Explain error in plain language
3. Suggest 2-3 fix options

**Uncertainty indicator:** "I'm not certain, but..."

---

**Document Version:** 0.1.0
**Last Updated:** ${new Date().toISOString().split("T")[0]}
`;
  writeFileSync(join(userDir, "DIRECTIVES.md"), directives);

  // TECHSTACK.md
  const techStack = `# TECHSTACK.md

**PAL User Layer - Technical Stack & Deployment**

---

## Purpose

Your technology stack preferences. Your AI uses this to make consistent technology choices.

---

## Languages

### Primary Language

**Language:** ${config.user.preferredLanguage}
**Technical Level:** ${config.user.technicalLevel}

---

## Package Managers

### JavaScript/TypeScript

**Use:** bun (NEVER npm/yarn/pnpm)

\`\`\`bash
# Install dependencies
bun install

# Add package
bun add <package>

# Run scripts
bun run <script>
\`\`\`

---

## Terminal & Browser

### Terminal

**Preference:** Default system terminal

---

## File Naming Conventions

**Dates in filenames:** YYYY-MM-DD
**File naming:** kebab-case

---

## Git Practices

**Commit Messages:**
- Start with verb: "Add", "Update", "Fix", "Remove"
- Be specific about what changed

---

**Document Version:** 0.1.0
**Last Updated:** ${new Date().toISOString().split("T")[0]}
`;
  writeFileSync(join(userDir, "TECHSTACK.md"), techStack);

  // TERMINOLOGY.md
  const terminology = `# TERMINOLOGY.md

**PAL User Layer - Terminology & System Logic**

---

## Purpose

Canonical definitions and system logic for consistent vocabulary.

---

## PAL Terminology

### Base

Your personal configuration layer. Contains ABOUTME.md, DIRECTIVES.md, TECHSTACK.md, and this file.

### PAL Master

The AI that orchestrates your entire system. It's your guide, teacher, and assistant.

### Skill

A modular capability with workflows and tools. Lives in \`.claude/skills/[SkillName]/\`.

### Hook

An automatic action that runs when a specific event occurs.

**Example hooks:**
- SessionStart - Loads your Base configuration
- PreToolUse - Validates operations before execution
- Stop - Runs cleanup when session ends

### Agent

A specialized AI subprocess with specific capabilities.

### Domain

A project workspace in \`domains/\` containing project-specific context.

---

## Custom Definitions

Add your own terms below:

### [Term]

**Definition:** [Your definition]
**Context:** [When/how this term is used]

---

**Document Version:** 0.1.0
**Last Updated:** ${new Date().toISOString().split("T")[0]}
`;
  writeFileSync(join(userDir, "TERMINOLOGY.md"), terminology);

  // CONTACTS.md
  const contacts = `# CONTACTS.md

**PAL User Layer - Contact Registry**

---

## Purpose

Your personal and professional contacts for communication tasks.

---

## Essential Contacts

- **[Name]** [Relationship] - email@example.com

---

## Extended Contacts

- **[Name]** [Relationship] - email@example.com

---

**Document Version:** 0.1.0
**Last Updated:** ${new Date().toISOString().split("T")[0]}
`;
  writeFileSync(join(userDir, "CONTACTS.md"), contacts);

  printSuccess("Generated 5 user layer templates");
}

function generateSettingsJson(config: PalConfig): string {
  const settings = {
    hooks: {
      SessionStart: [
        {
          hooks: [
            {
              type: "command",
              command: "bun run .claude/tools/hooks/session-start.ts",
            },
          ],
        },
      ],
      PreToolUse: [
        {
          matcher: "*",
          hooks: [
            {
              type: "command",
              command: "bun run .claude/tools/hooks/pre-tool-use.ts",
            },
          ],
        },
      ],
      Stop: [
        {
          hooks: [
            {
              type: "command",
              command: "bun run .claude/tools/hooks/stop.ts",
            },
          ],
        },
      ],
    },
    permissions: {
      allow: [
        "Bash",
        "Read",
        "Write",
        "Edit",
        "Glob",
        "Grep",
        "Task",
        "TodoWrite",
        "Skill",
        "WebFetch",
        "WebSearch",
      ],
      deny: [
        "Read(~/.env)",
        "Read(~/.env.*)",
        "Read(~/.aws/**)",
        "Read(~/.ssh/**)",
        "Write(~/**)",
        "Edit(~/**)",
      ],
      ask: ["Bash(git push*)", "Bash(npm publish*)", "Bash(rm -rf*)"],
    },
    env: {
      CLAUDE_PROJECT_DIR: config.project.directory,
      PROJECT_NAME: config.project.name,
    },
    model: "claude-sonnet-4-5-20250929",
    alwaysThinkingEnabled: false,
    sandbox: {
      enabled: true,
      excludedCommands: [],
    },
  };

  return JSON.stringify(settings, null, 2);
}

function generateClaudeMd(config: PalConfig): string {
  return `# PAL Framework

> "PAL is a pattern-based modular system that empowers non-technical professionals to architect AI systems through organized context engineering, reusable modular blocks, and guided documentation."

**Architecture Highlights:**

- **Three-layer structure**: USER → SYSTEM → SECURITY
- **10 core principles** guiding design decisions
- **Modular composition** through skills, workflows, agents and patterns

For full architecture details, see: \`.claude/base/system/ARCHITECTURE.md\`

---

## First-Person Voice (CRITICAL)

Your AI should speak as itself, not about itself in third person.

**Correct:**
- "for my system" / "in my architecture"
- "I can help" / "my delegation patterns"

**Wrong:**
- "for the system" / "the system can"

---

## Technical Stack Preferences

**Technical Level:** ${config.user.technicalLevel}

**Platform:**
- Runtime: bun
- Package Manager: bun

**Languages (in order of preference):**
1. ${config.user.preferredLanguage}

---

## Stack Rules

- **Package Manager:** Use bun (NEVER npm/yarn/pnpm)
- **Runtime:** Use bun as the default JavaScript runtime
- **Markdown:** Use markdown for all documentation. NEVER use HTML for basic content.

---

## Domain Workspace Structure

All project-specific work must reside within the \`/domains/\` directory.

**Root Folder:** \`/domains/[domain-name]/\`
**Nesting Limit:** Do not exceed three vertical levels below the domain root.

**Core Folders:**
- \`00_CONTEXT/\`: Contains \`INDEX.md\` (Source of Truth) and \`CONNECTIONS.yaml\`
- \`01_PLANS/\`: All active \`PLAN_XXX.md\` files
- \`02_SESSIONS/\`: Chronological interaction logs
- \`03_ASSETS/\`: Raw documentation and reference materials
- \`05_ARCHIVE/\`: Stale plans or old logs

---

## File Naming Conventions

| Category | Convention | Example |
|:---------|:-----------|:--------|
| **System Protocols** | \`UPPER_SNAKE_CASE.md\` | \`DIRECTIVES.md\` |
| **Folders** | \`lower-kebab-case\` | \`project-alpha/\` |
| **Logs & Sessions** | \`YYYY-MM-DD_title.md\` | \`2026-01-15_Sync.md\` |
| **Active Work** | \`lower_snake_case.md\` | \`research_notes.md\` |

---

## Context Management (CRITICAL)

**Strictly limit context loading.** Do NOT load any files unless explicitly:
1. Requested by the User
2. Defined in the Agent's requirements
3. Directed by PAL Master

**Goal:** Zero unnecessary token usage.

---

## Response Format

Use this format for task-based responses:

\`\`\`
📋 SUMMARY: [One sentence]
🔍 ANALYSIS: [Key findings]
⚡ ACTIONS: [Steps taken]
✅ RESULTS: [Outcomes]
➡️ NEXT: [Recommended next steps]
\`\`\`

---

**Document Version:** 0.1.0
**Last Updated:** ${new Date().toISOString().split("T")[0]}
`;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

function validateInstallation(): ValidationResult {
  const result: ValidationResult = {
    passed: true,
    checks: [],
  };

  // Check settings.json exists and is valid
  const settingsPath = join(CLAUDE_DIR, "settings.json");
  if (existsSync(settingsPath)) {
    try {
      const settings = JSON.parse(readFileSync(settingsPath, "utf-8"));
      if (settings.hooks && settings.permissions) {
        result.checks.push({
          name: "settings.json",
          passed: true,
          message: "Valid configuration found",
        });
      } else {
        result.checks.push({
          name: "settings.json",
          passed: false,
          message: "Missing required fields (hooks, permissions)",
        });
        result.passed = false;
      }
    } catch {
      result.checks.push({
        name: "settings.json",
        passed: false,
        message: "Invalid JSON",
      });
      result.passed = false;
    }
  } else {
    result.checks.push({
      name: "settings.json",
      passed: false,
      message: "File not found",
    });
    result.passed = false;
  }

  // Check CLAUDE.md exists
  const claudeMdPath = join(CLAUDE_DIR, "CLAUDE.md");
  if (existsSync(claudeMdPath)) {
    result.checks.push({
      name: "CLAUDE.md",
      passed: true,
      message: "Project instructions found",
    });
  } else {
    result.checks.push({
      name: "CLAUDE.md",
      passed: false,
      message: "File not found",
    });
    result.passed = false;
  }

  // Check base layers
  const layers = [
    { name: "user", minFiles: 5 },
    { name: "system", minFiles: 5 },
    { name: "security", minFiles: 2 },
  ];

  for (const layer of layers) {
    const layerPath = join(CLAUDE_DIR, "base", layer.name);
    if (existsSync(layerPath)) {
      const files = readdirSync(layerPath).filter((f) => f.endsWith(".md"));
      if (files.length >= layer.minFiles) {
        result.checks.push({
          name: `base/${layer.name}`,
          passed: true,
          message: `${files.length} files found`,
        });
      } else {
        result.checks.push({
          name: `base/${layer.name}`,
          passed: false,
          message: `Only ${files.length} files (need ${layer.minFiles}+)`,
        });
        result.passed = false;
      }
    } else {
      result.checks.push({
        name: `base/${layer.name}`,
        passed: false,
        message: "Directory not found",
      });
      result.passed = false;
    }
  }

  // Check hooks
  const hooksPath = join(CLAUDE_DIR, "tools/hooks");
  if (existsSync(hooksPath)) {
    const hooks = readdirSync(hooksPath).filter((f) => f.endsWith(".ts"));
    if (hooks.length >= 3) {
      result.checks.push({
        name: "tools/hooks",
        passed: true,
        message: `${hooks.length} hooks found`,
      });
    } else {
      result.checks.push({
        name: "tools/hooks",
        passed: false,
        message: `Only ${hooks.length} hooks (need 3)`,
      });
      result.passed = false;
    }
  } else {
    result.checks.push({
      name: "tools/hooks",
      passed: false,
      message: "Directory not found",
    });
    result.passed = false;
  }

  // Check domains directory
  if (existsSync(DOMAINS_DIR)) {
    result.checks.push({
      name: "domains/",
      passed: true,
      message: "Directory exists",
    });
  } else {
    result.checks.push({
      name: "domains/",
      passed: false,
      message: "Directory not found",
    });
    result.passed = false;
  }

  return result;
}

function printValidationResults(results: ValidationResult): void {
  print("");
  print(`${c.bold}Validation Results${c.reset}`);
  print(`${c.gray}─────────────────────────────────────────────────${c.reset}`);

  for (const check of results.checks) {
    if (check.passed) {
      printSuccess(`${check.name}: ${check.message}`);
    } else {
      printError(`${check.name}: ${check.message}`);
    }
  }

  print("");
  if (results.passed) {
    print(`${c.green}${c.bold}✓ Installation validated successfully${c.reset}`);
  } else {
    print(`${c.red}${c.bold}✗ Installation validation failed${c.reset}`);
  }
}

// ============================================================================
// MAIN WIZARD
// ============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // Help mode
  if (args.includes("--help") || args.includes("-h")) {
    showHelp();
    process.exit(0);
  }

  printHeader();

  // Validation only mode
  if (args.includes("--validate")) {
    const results = validateInstallation();
    printValidationResults(results);
    process.exit(results.passed ? 0 : 1);
  }

  const TOTAL_STEPS = 8;

  // ================================================================
  // STEP 0: Fix permissions (if .claude exists)
  // ================================================================
  printStep(0, TOTAL_STEPS, "Checking permissions");

  if (existsSync(CLAUDE_DIR)) {
    fixPermissions(CLAUDE_DIR);
  } else {
    printInfo("No existing .claude directory");
  }

  // ================================================================
  // STEP 1: Detect environment
  // ================================================================
  printStep(1, TOTAL_STEPS, "Detecting environment");

  const hasExisting = detectExistingInstallation();
  const mode = determineMode(args);

  if (hasExisting) {
    printInfo("Found existing PAL installation");
    if (mode === "update") {
      printInfo("Running in UPDATE mode (preserving user files)");
    } else {
      printWarning("Running in FRESH mode (will overwrite)");
    }
  } else {
    printInfo("No existing installation detected");
    printInfo("Running fresh installation");
  }

  print("");
  print(`${c.cyan}Installation mode:${c.reset} ${c.bold}${mode.toUpperCase()}${c.reset}`);
  print(`${c.cyan}Target directory:${c.reset} ${PROJECT_DIR}`);

  // ================================================================
  // STEP 2: Gather configuration
  // ================================================================
  printStep(2, TOTAL_STEPS, "Gathering configuration");

  const config = await gatherConfig();

  // ================================================================
  // STEP 3: Confirm installation
  // ================================================================
  printStep(3, TOTAL_STEPS, "Confirming installation");
  print("");
  print(`${c.bold}Installation Summary${c.reset}`);
  print(`${c.gray}─────────────────────────────────────────────────${c.reset}`);
  print(`  Mode:             ${mode}`);
  print(`  Project:          ${config.project.name}`);
  print(`  User:             ${config.user.name}`);
  print(`  Technical Level:  ${config.user.technicalLevel}`);
  print(`  Language:         ${config.user.preferredLanguage}`);
  print(`  Timezone:         ${config.user.timezone}`);
  print("");

  if (!(await confirm("Proceed with installation?"))) {
    print("");
    print(`${c.yellow}Installation cancelled${c.reset}`);
    process.exit(0);
  }

  // ================================================================
  // STEP 4: Create directory structure
  // ================================================================
  printStep(4, TOTAL_STEPS, "Creating directory structure");
  print("");

  createDirectoryStructure();
  printSuccess("Created directory structure");

  // ================================================================
  // STEP 5: Copy system files
  // ================================================================
  printStep(5, TOTAL_STEPS, "Copying framework files");
  print("");

  copySystemFiles();
  copyHooks();
  copyAgents();
  copySkills();

  // ================================================================
  // STEP 6: Generate user files (only in fresh mode or if missing)
  // ================================================================
  printStep(6, TOTAL_STEPS, "Generating configuration files");
  print("");

  const userDirPath = join(CLAUDE_DIR, "base/user");
  const hasUserFiles =
    existsSync(userDirPath) &&
    readdirSync(userDirPath).filter((f) => f.endsWith(".md")).length > 0;

  if (mode === "fresh" || !hasUserFiles) {
    generateUserTemplates(config);
  } else {
    printInfo("Preserving existing user files");
  }

  // Generate settings.json
  const settingsJson = generateSettingsJson(config);
  writeFileSync(join(CLAUDE_DIR, "settings.json"), settingsJson);
  printSuccess("Generated settings.json");

  // Generate CLAUDE.md
  const claudeMd = generateClaudeMd(config);
  writeFileSync(join(CLAUDE_DIR, "CLAUDE.md"), claudeMd);
  printSuccess("Generated CLAUDE.md");

  // ================================================================
  // STEP 7: Fix permissions
  // ================================================================
  printStep(7, TOTAL_STEPS, "Fixing permissions");
  print("");

  fixPermissions(CLAUDE_DIR);

  // ================================================================
  // STEP 8: Validate
  // ================================================================
  printStep(8, TOTAL_STEPS, "Validating installation");

  const results = validateInstallation();
  printValidationResults(results);

  if (results.passed) {
    print("");
    print(
      `${c.blue}${c.bold}┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓${c.reset}`
    );
    print(
      `${c.blue}${c.bold}┃${c.reset}                                                               ${c.blue}${c.bold}┃${c.reset}`
    );
    print(
      `${c.blue}${c.bold}┃${c.reset}   ${c.green}${c.bold}PAL Framework installed successfully!${c.reset}                      ${c.blue}${c.bold}┃${c.reset}`
    );
    print(
      `${c.blue}${c.bold}┃${c.reset}                                                               ${c.blue}${c.bold}┃${c.reset}`
    );
    print(
      `${c.blue}${c.bold}┃${c.reset}   ${c.cyan}Next steps:${c.reset}                                                 ${c.blue}${c.bold}┃${c.reset}`
    );
    print(
      `${c.blue}${c.bold}┃${c.reset}   1. Start a new Claude Code session                          ${c.blue}${c.bold}┃${c.reset}`
    );
    print(
      `${c.blue}${c.bold}┃${c.reset}   2. Customize files in ${c.green}.claude/base/user/${c.reset}                  ${c.blue}${c.bold}┃${c.reset}`
    );
    print(
      `${c.blue}${c.bold}┃${c.reset}   3. Run ${c.green}--validate${c.reset} to verify                               ${c.blue}${c.bold}┃${c.reset}`
    );
    print(
      `${c.blue}${c.bold}┃${c.reset}                                                               ${c.blue}${c.bold}┃${c.reset}`
    );
    print(
      `${c.blue}${c.bold}┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛${c.reset}`
    );
    print("");
  }

  process.exit(results.passed ? 0 : 1);
}

// Run the wizard
main().catch((err) => {
  console.error(`${c.red}Error:${c.reset}`, err.message);
  process.exit(1);
});
