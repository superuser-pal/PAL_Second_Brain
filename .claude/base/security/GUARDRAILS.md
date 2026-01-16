---
title: PAL Security Guardrails
version: 1.0.0
layer: SECURITY
purpose: Permissive security with catastrophic error blocking
last_updated: 2026-01-13
---

# PAL Security Guardrails

**Version:** 1.0.0
**Purpose:** Define security validation rules enforced by PreToolUse hook
**Layer:** SECURITY

---

## Section 1: Security Philosophy

### PAL's Security Approach

**Permissive by Default, Block Catastrophic Errors**

PAL allows operations by default and only blocks catastrophic errors. This provides minimal friction while preventing dangerous mistakes.

### Three Security Levels

**1. ALLOW (Green)** - Safe operations proceed silently

- Reading files from project directory
- Writing to designated output directories
- Running validated Bun utilities

**2. WARN (Yellow)** - Risky operations require user review

- Writing large files (>5MB)
- Operations affecting multiple files (>10)
- Potential PII in content
- External API calls with user data

**3. BLOCK (Red)** - Catastrophic operations prevented

- Hardcoded credentials
- Destructive operations (rm -rf, DROP TABLE)
- Writing to system directories
- Command injection vulnerabilities

---

## Section 2: Credential Protection

### Credentials: Always BLOCK

**Rule:** NEVER allow hardcoded credentials

**What Counts as Credentials:**
API keys, passwords, auth tokens, secret keys, database credentials, SSH/TLS keys, cloud provider keys

### Detection Patterns

```regex
# API Keys
api[_-]?key[_-]?[:=]\s*['"]?([a-zA-Z0-9_-]{20,})['"]?
AKIA[0-9A-Z]{16}                           # AWS
sk_live_[0-9a-zA-Z]{24}                    # Stripe
ghp_[0-9a-zA-Z]{36}                        # GitHub

# Passwords
password[_-]?[:=]\s*['"]?([^\s'"]{8,})['"]?
(mysql|postgres|mongodb):\/\/[^:]+:[^@]+@

# Private Keys
-----BEGIN (RSA|OPENSSH|DSA|EC|PGP) PRIVATE KEY-----

# JWT
eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+
```

### Allowed Exceptions

**ONLY these contexts are allowed:**

1. Environment variable references: `process.env.API_KEY`
2. `.env.example` template files with placeholders
3. Documentation with clearly fake examples

### Remediation

Use environment variables stored in `.env` (add to .gitignore):

```bash
# .env file
API_KEY=your_api_key_here

# Code references
const API_KEY = process.env.API_KEY;
```

---

## Section 3: Personally Identifiable Information (PII)

### PII: Default WARN

**Rule:** Warn when PII detected, allow user to proceed with awareness

**What Counts as PII:**
Email addresses, phone numbers, SSN, credit cards, physical addresses, passport/license numbers

### Detection Patterns

```regex
# Email
[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}

# Phone (US/International)
(\+1\s?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})

# SSN
[0-9]{3}-[0-9]{2}-[0-9]{4}

# Credit Card
[0-9]{4}[- ]?[0-9]{4}[- ]?[0-9]{4}[- ]?[0-9]{4}
```

### When PII is Acceptable (No Warning)

1. **CONTACTS.md** and **RESUME.md** files
2. Documentation with clearly fake examples (example.com, 555 numbers)
3. Editorial content about public figures

### Configuration

```yaml
pii_detection:
  enabled: true
  mode: warn # warn | block | allow
  exceptions:
    - .claude/Base/User/CONTACTS.md
    - .claude/Base/User/RESUME.md
```

---

## Section 4: Destructive Operations

### Destructive Operations: BLOCK without Confirmation

**Rule:** Block operations that cannot be undone

**File Deletion:**

- BLOCK: `rm -rf directory/`, `rm *.md`, system files
- WARN: Single file deletion
- ALLOW: Temp files, build artifacts (recoverable)

**Database Operations:**

- BLOCK: `DROP TABLE/DATABASE`, `TRUNCATE`, mass deletion without WHERE
- WARN: Deletion with WHERE clause, multi-row updates
- ALLOW: SELECT, INSERT, single-row UPDATE

**Git Operations:**

- BLOCK: `git push --force origin main`, `git reset --hard HEAD~10`, `git clean -fd`
- WARN: `git reset --hard HEAD~1` (if not pushed), `git stash drop`
- ALLOW: Standard git operations (add, commit, push, pull)

---

## Section 5: File System Boundaries

### File System Access: Respect Project Boundaries

**Rule:** Restrict file operations to project and safe directories

**Allowed Paths (ALLOW):**

- Project directory and subdirectories
- Temp directories (`/tmp/`, `~/.cache/`)
- User directories (`~/Documents/`, `~/Downloads/`, `~/Desktop/`)

**Restricted Paths (WARN):**

- System configs (read-only): `/etc/`, `~/.bashrc`
- Other projects outside current workspace

**Blocked Paths (BLOCK):**

- System directories (write): `/etc/`, `/usr/`, `/bin/`, `/System/`
- Sensitive user dirs: `~/.ssh/`, `~/Library/Keychains/`, `~/.gnupg/`
- Application data: `~/Library/Application Support/`, `~/.config/`

### Path Traversal Prevention

Paths must resolve within project directory. Block: `../../../etc/passwd`, `/etc/hosts`

---

## Section 6: Command Execution

### Command Execution: Validate and Sanitize

**Rule:** Prevent command injection, validate all shell commands

**Always BLOCK:**

- `eval`, `exec`, `system` with user input
- Commands with unescaped user input: `rm ${USER_INPUT}`, `curl ${USER_INPUT}`

**WARN before executing:**

- Network operations: `curl`, `wget`
- System modifications: `npm install`, `brew install`
- Privileged operations: `sudo`

**ALLOW without warning:**

- Safe commands: `ls`, `pwd`, `git status`, `npm test`
- Validated Bun utilities in `scripts/` directory

---

## Section 7: External Integrations

### External APIs: Controlled Access

**Rule:** Validate external API calls and data transmission

**ALLOW without warning:**
Public APIs with no user data (weather, docs, search)

**WARN before proceeding:**

- APIs receiving user data (analytics, logging)
- Third-party services (payments, email)
- APIs requiring authentication

**BLOCK:**

- APIs known for malicious behavior
- Sending credentials or PII over HTTP (not HTTPS)

---

## Section 8: Custom Guardrails

### User-Defined Rules

Users can add project-specific guardrails:

```yaml
custom_rules:
  - name: "Block production database access"
    pattern: "postgres://.*@production-db"
    action: BLOCK
    message: "Never connect to production database from development"

  - name: "Warn on large file operations"
    pattern: ".*\\.(mp4|mov|avi)$"
    action: WARN
    message: "Large video files detected. Consider external storage."
```

**Rule Structure:**

```yaml
name: "Descriptive rule name"
pattern: "Regex pattern or exact match"
action: ALLOW | WARN | BLOCK
message: "User-facing message"
scope: files | commands | api_calls | all (optional)
exceptions: ["path/to/exception"] (optional)
```

---

## Section 9: Guardrail Configuration

### Default Configuration

```yaml
version: 1.0.0
security_mode: permissive # permissive | strict | audit

credentials:
  enabled: true
  action: BLOCK

pii:
  enabled: true
  action: WARN
  exceptions:
    - .claude/Base/User/CONTACTS.md
    - .claude/Base/User/RESUME.md

destructive_operations:
  enabled: true
  action: BLOCK
  require_confirmation: true

file_system:
  enabled: true
  allowed_paths: ["${PROJECT_ROOT}", "/tmp", "${HOME}/Documents"]
  blocked_paths: ["/etc", "/usr", "${HOME}/.ssh"]

command_execution:
  enabled: true
  validate_all: true
  bun_scripts_path: "scripts/"

external_apis:
  enabled: true
  warn_on_user_data: true
  block_insecure: true

custom_rules: []
```

### Security Modes

**Permissive (Default):** Allow by default, warn on risky operations, block catastrophic errors. Use for development.

**Strict:** Block by default, require explicit confirmation. Use for production, sensitive data, team projects.

**Audit:** Allow everything, log all operations for review. Use for understanding system behavior.

---

## Section 10: Troubleshooting

**Legitimate operation blocked:** Add exception to GUARDRAILS.md or adjust rule pattern to be more specific

**Security validation too slow:** Disable expensive checks, optimize patterns, or add file size limits

**False positives:** Use more specific patterns, add context awareness, or whitelist specific terms

---

## Conclusion

PAL's security guardrails provide balanced protection through a permissive philosophy that allows operations by default while blocking catastrophic errors. The three-tier system (ALLOW/WARN/BLOCK) ensures minimal friction with maximum protection.

**Core Rules:**

- Credentials: Always BLOCK
- PII: Default WARN (configurable)
- Destructive operations: BLOCK without confirmation
- File system: Respect project boundaries
- Command execution: Prevent injection
- External APIs: Controlled access

**Customization:**
Add custom rules, configure security modes (permissive/strict/audit), and define exceptions for your project needs.

**Related Files:** [REPOS_RULES.md](REPOS_RULES.md), [MEMORY_LOGIC.md](../System/MEMORY_LOGIC.md)

---

**Version:** 1.0.0 | **Last Updated:** 2026-01-14

---

## Migration & Integration

> **AI INSTRUCTIONS**: When this file is placed in a new project, follow these integration steps.

### Layer Classification

- **Layer**: SECURITY
- **Priority**: 21 (first SECURITY file - security rules)
- **Dependencies**: None (standalone security configuration)

### Target Location

```
[PROJECT_ROOT]/PAL_Base/Security/GUARDRAILS.md
```

### Integration Steps

1. **Verify Directory Structure**

   ```bash
   mkdir -p PAL_Base/Security
   ```

2. **Place File**

   - Copy this file to `PAL_Base/Security/GUARDRAILS.md`
   - Preserve UPPERCASE filename

3. **Register in SessionStart Hook**

   ```typescript
   // In .claude/hooks/session-start.ts
   const securityFiles = [
     "PAL_Base/Security/GUARDRAILS.md", // Priority: 21
     "PAL_Base/Security/REPOS_RULES.md", // Priority: 22
   ];
   ```

4. **Implement PreToolUse Hook**

   - Create `.claude/hooks/pre-tool-use.ts`
   - Reference HOOK_TEMPLATES.md for implementation
   - Hook MUST enforce rules from this file

5. **Validate Integration**
   - Start new Claude Code session
   - Attempt blocked operation (e.g., write with credentials)
   - Verify operation is blocked with appropriate message

### How This File Is Used

| System Component      | Usage                                              |
| --------------------- | -------------------------------------------------- |
| **PreToolUse Hook**   | Enforces security rules before tool execution      |
| **PAL Master**        | References security levels for operation decisions |
| **Custom Guardrails** | User adds project-specific rules                   |
| **Security Modes**    | Configures permissive/strict/audit behavior        |

### Customization Required

This file is **security configuration** - review and customize:

- [ ] **Review** - Understand 3 security levels (ALLOW/WARN/BLOCK)
- [ ] **Credential Patterns** - Verify patterns match your credential formats
- [ ] **Blocked Paths** - Add project-specific restricted paths
- [ ] **Security Mode** - Choose permissive, strict, or audit mode
- [ ] **Custom Guardrails** - Add project-specific rules

### Security Implementation Checklist

- [ ] PreToolUse hook created and configured
- [ ] Hook reads and enforces rules from this file
- [ ] BLOCK operations exit with code 1
- [ ] WARN operations log warning, exit with code 0
- [ ] ALLOW operations proceed silently

### First-Use Checklist

- [ ] File placed in `PAL_Base/Security/`
- [ ] SessionStart hook loads file at priority 21
- [ ] PreToolUse hook implemented
- [ ] Security levels tested (BLOCK/WARN/ALLOW)
- [ ] Custom guardrails added as needed
