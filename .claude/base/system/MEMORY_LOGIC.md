---
title: PAL Memory System
version: 1.1.0
layer: SYSTEM
purpose: Configuration system for context management, hook system, and session lifecycle
last_updated: 2026-01-18
---

# PAL Memory System

**The configuration system for PAL context management, hooks, and session lifecycle.**

---

## THIS IS THE AUTHORITATIVE SOURCE

This document defines the **required structure** for context management and hooks in the PAL framework.

**ALL hook implementations MUST follow this structure.**

If a hook does not follow this structure, it will not execute correctly within the PAL system.

---

## What Is Context Management?

**Context** = User-maintained configuration files that provide persistent, version-controlled information to PAL.

**Location:** `.claude/base/` (Base configuration files)

**Purpose:** Provide consistent, explicit context every session without automated memory systems.

**Key Characteristics:**

- **User-maintained** - Users update files based on experience
- **Version controlled** - Tracked via Git for history and rollback
- **Explicit** - No hidden learning or automated extraction
- **Persistent** - Available every session via SessionStart hook
- **Three-layer structure** - USER, SYSTEM, SECURITY

---

## Naming Conventions (MANDATORY)

**Hook and context file naming follows PAL's standard conventions.**

| Category | Convention | Example | Purpose |
| :------- | :--------- | :------ | :------ |
| **Hooks directory** | `hooks/` | `.claude/tools/hooks/` | Hook implementations location. |
| **Hook files** | `lower-kebab-case.ts` | `session-start.ts` | TypeScript hook implementations. |
| **Base directories** | `lower-case` | `user/`, `system/`, `security/` | Layer organization. |
| **Base files** | `UPPER_SNAKE_CASE.md` | `ABOUTME.md` | Configuration files. |
| **Settings files** | `lower-kebab-case.json` | `settings.json` | Configuration. |

**Convention Rules:**

- **Hooks:** Use `lower-kebab-case` with `.ts` extension (matches Claude Code conventions)
- **Base files:** Use `UPPER_SNAKE_CASE` with `.md` extension
- **Settings:** Use `lower-kebab-case` with `.json` extension

---

## Directory Structure

Context and hooks live in specific locations:

```
.claude/
├── base/                           # Base configuration files
│   ├── user/                       # USER layer (8 files)
│   │   ├── ABOUTME.md
│   │   ├── DIRECTIVES.md
│   │   ├── TECHSTACK.md
│   │   ├── TERMINOLOGY.md
│   │   ├── DIGITALASSETS.md
│   │   ├── CONTACTS.md
│   │   ├── RESUME.md
│   │   └── ART.md
│   ├── system/                     # SYSTEM layer (8 files)
│   │   ├── ARCHITECTURE.md
│   │   ├── ORCHESTRATION.md
│   │   ├── WORKFLOWS.md
│   │   ├── MEMORY_LOGIC.md
│   │   ├── TOOLBOX.md
│   │   ├── AGENTS_LOGIC.md
│   │   ├── SKILL_LOGIC.md
│   │   └── DOMAINS_LOGIC.md
│   └── security/                   # SECURITY layer (2 files)
│       ├── GUARDRAILS.md
│       └── REPOS_RULES.md
├── tools/
│   └── hooks/                      # Hook implementations
│       ├── session-start.ts
│       ├── pre-tool-use.ts
│       └── stop.ts
└── settings.json                   # Hook configuration
```

**Three-Layer Base Structure:**

| Layer | Files | Purpose |
| :---- | :---- | :------ |
| **USER** | 8 files | Identity, preferences, personal context |
| **SYSTEM** | 8 files | System logic and operations |
| **SECURITY** | 2 files | Safety validation and policies |

---

## Hook System

### What Are Hooks?

**Hooks** = TypeScript code that executes at specific system lifecycle points.

**Location:** `.claude/tools/hooks/` directory

**Purpose:** Control system behavior deterministically (context loading, security validation, notifications).

### Three Essential Hooks

| Hook | Trigger | Purpose | File |
| :--- | :------ | :------ | :--- |
| **SessionStart** | Session initialization | Load Base context (USER + SYSTEM + SECURITY) | `session-start.ts` |
| **PreToolUse** | Before tool execution | Validate operation against GUARDRAILS.md | `pre-tool-use.ts` |
| **Stop** | Session end | Send notifications, save transcript, cleanup | `stop.ts` |

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

---

## Hook Specifications

### 1. SessionStart Hook

**File:** `.claude/tools/hooks/session-start.ts`

**Trigger:** When user starts new session or reloads Claude Code

**Purpose:** Load Base configuration context

**Actions:**
- Read all Base files (USER + SYSTEM + SECURITY)
- Load into PAL Master's context
- Session ready with full context

**User Action:** None (automatic)

### 2. PreToolUse Hook

**File:** `.claude/tools/hooks/pre-tool-use.ts`

**Trigger:** Before PAL Master executes any tool

**Purpose:** Validate operation against security rules

**Actions:**
- Intercept tool execution
- Read GUARDRAILS.md and REPOS_RULES.md
- Validate operation (security rules, sensitive data, risk level)
- Decision: ALLOW / WARN / BLOCK

**Validation Checks:**
- Catastrophic operations (destructive commands)
- Credentials (API keys, passwords)
- PII (personal information)
- Custom guardrail violations

**User Action:** None (automatic), except approving warnings

**See:** [GUARDRAILS.md](../security/GUARDRAILS.md)

### 3. Stop Hook

**File:** `.claude/tools/hooks/stop.ts`

**Trigger:** When user types `/stop` command or closes session

**Purpose:** Send notifications, save session data, cleanup

**Actions:**
- Execute configured notifications (desktop/email/Slack)
- Save transcript
- Log session summary
- Cleanup temp files

**User Action:** Configure in settings.json (optional)

---

## Hook Configuration

### Settings Structure

**Location:** `.claude/settings.json`

**Purpose:** Configure hook behavior.

```json
{
  "hooks": {
    "sessionStart": {
      "enabled": true,
      "loadBase": true
    },
    "preToolUse": {
      "enabled": true,
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
  }
}
```

---

## Context Best Practices

### For Users

| Practice | Description |
| :------- | :---------- |
| **Keep Base current** | Update as preferences evolve, remove outdated entries, review monthly |
| **Use Git** | Track changes (`git add .claude/base/`), enable rollback, audit history |
| **Separate contexts** | General (ABOUTME, RESUME): reusable; Project-specific (TERMINOLOGY, TECHSTACK): reset per project |
| **Document immediately** | Capture insights while fresh, add to TERMINOLOGY.md immediately |
| **Be explicit** | Replace vague statements with specific guidelines |

### For PAL Master

| Practice | Description |
| :------- | :---------- |
| **Load Base every session** | SessionStart hook handles automatically |
| **Reference Base frequently** | Check DIRECTIVES, TECHSTACK, TERMINOLOGY, GUARDRAILS |
| **Suggest updates** | When user expresses new preference, offer to update Base |
| **Explain decisions** | When Base context influences decisions, explain reasoning |

---

## Troubleshooting

| Issue | Symptoms | Solutions |
| :---- | :------- | :-------- |
| **Behavior misalignment** | PAL Master choices don't match preferences | Verify Base loaded (`/context`), update outdated files, make directives explicit |
| **SessionStart failure** | PAL Master lacks Base context | Verify hook file exists, check Base directory structure, review error messages |
| **Security issues** | PreToolUse blocks legitimate ops OR allows risky ops | Review GUARDRAILS.md rules, add exceptions for edge cases |
| **TERMINOLOGY ignored** | PAL Master doesn't use project vocabulary | Verify load via `/context`, make terms explicit with ALWAYS/NEVER rules |

---

## Complete Checklist

Before context management is complete:

### Directory Structure

- [ ] `.claude/base/` exists with three subdirectories
- [ ] `user/` contains 8 files (ABOUTME, DIRECTIVES, TECHSTACK, TERMINOLOGY, DIGITALASSETS, CONTACTS, RESUME, ART)
- [ ] `system/` contains 8 files (ARCHITECTURE, ORCHESTRATION, WORKFLOWS, MEMORY_LOGIC, TOOLBOX, AGENTS_LOGIC, SKILL_LOGIC, DOMAINS_LOGIC)
- [ ] `security/` contains 2 files (GUARDRAILS, REPOS_RULES)

### Hooks

- [ ] `.claude/tools/hooks/` directory exists
- [ ] `session-start.ts` exists and loads Base files
- [ ] `pre-tool-use.ts` exists and validates against GUARDRAILS.md
- [ ] `stop.ts` exists and handles notifications/cleanup

### Configuration

- [ ] `.claude/settings.json` exists
- [ ] Hook configuration specifies enabled/disabled state
- [ ] Notification preferences configured (if using Stop hook)

### Naming

- [ ] Hook files use `lower-kebab-case.ts`
- [ ] Base files use `UPPER_SNAKE_CASE.md`
- [ ] Settings files use `lower-kebab-case.json`

---

## Summary

| Component | Purpose | Location |
| :-------- | :------ | :------- |
| **Base configuration** | User-maintained persistent context | `.claude/base/` |
| **USER layer** | Identity, preferences (8 files) | `.claude/base/user/` |
| **SYSTEM layer** | System logic (8 files) | `.claude/base/system/` |
| **SECURITY layer** | Safety policies (2 files) | `.claude/base/security/` |
| **SessionStart hook** | Load Base context | `.claude/tools/hooks/session-start.ts` |
| **PreToolUse hook** | Security validation | `.claude/tools/hooks/pre-tool-use.ts` |
| **Stop hook** | Notifications and cleanup | `.claude/tools/hooks/stop.ts` |

This system ensures:

1. Context is user-maintained and version controlled
2. Hooks provide deterministic lifecycle automation
3. Security validation occurs before tool execution
4. **All naming follows PAL's standard conventions**

---

**Document Version:** 1.1.0
**Last Updated:** 2026-01-18
**Related Files:** ARCHITECTURE.md, ORCHESTRATION.md, WORKFLOWS.md, TOOLBOX.md, AGENTS_LOGIC.md, SKILL_LOGIC.md, DOMAINS_LOGIC.md, GUARDRAILS.md

---
