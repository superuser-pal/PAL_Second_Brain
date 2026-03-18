---
title: PAL Security Guardrails
version: 1.1.0
layer: SECURITY
purpose: Strict execution constraints and catastrophic error blocking schema
last_updated: 2026-03-18
---

# Security Guardrails

PAL operates on a Permissive-by-Default model: ALLOW (Green) for safe ops, WARN (Yellow) for risky ops, BLOCK (Red) for catastrophic errors.

## 1. Credentials [ALWAYS BLOCK]
**Rule:** NEVER allow hardcoded credentials. Only allow environment variable references (e.g., `process.env.API_KEY`), `.env.example` placeholders, or explicitly fake examples in documentation.

**Detection Regex:**
```regex
api[_-]?key[_-]?[:=]\s*['"]?([a-zA-Z0-9_-]{20,})['"]?
AKIA[0-9A-Z]{16}
sk_live_[0-9a-zA-Z]{24}
ghp_[0-9a-zA-Z]{36}
password[_-]?[:=]\s*['"]?([^\s'"]{8,})['"]?
(mysql|postgres|mongodb):\/\/[^:]+:[^@]+@
-----BEGIN (RSA|OPENSSH|DSA|EC|PGP) PRIVATE KEY-----
eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+
```

## 2. PII (Personally Identifiable Information) [WARN]
**Rule:** Warn on detection. Allowed only in `CONTACTS.md`, `RESUME.md`, fake examples, or public figures metadata.

**Detection Regex:**
```regex
[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}
(\+1\s?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})
[0-9]{3}-[0-9]{2}-[0-9]{4}
[0-9]{4}[- ]?[0-9]{4}[- ]?[0-9]{4}[- ]?[0-9]{4}
```

## 3. Destructive Operations [BLOCK]
**Rule:** Block irreversible operations across File System, Database, and Git.
- **FS:** BLOCK `rm -rf directory/`, `rm *.md`, system file targets. WARN on single file deletion. ALLOW temp files `/tmp/`.
- **DB:** BLOCK `DROP TABLE/DATABASE`, `TRUNCATE`, mass updates without WHERE. WARN on multi-row WHERE. ALLOW single-row/SELECT/INSERT.
- **Git:** BLOCK `git push --force`, `git reset --hard HEAD~10`, `git clean -fd`. WARN on local `git reset --hard`.

## 4. Path Boundaries
- **ALLOW:** Project root (`${PROJECT_ROOT}`), `/tmp/`, `~/.cache/`, `~/Documents/`, `~/Downloads/`, `~/Desktop/`.
- **WARN:** Outside workspace, read-only system (`/etc/`, `~/.bashrc`).
- **BLOCK:** Write to system (`/usr/`, `/bin/`), sensitive (`~/.ssh/`, `~/Library/Keychains/`), app support (`~/Library/Application Support/`). Prevents path traversal (`../../../`).

## 5. Command & API Constraints
**CLI Execution:**
- **BLOCK:** `eval`, `exec`, `system` with user input. Unescaped input (`rm ${USER_INPUT}`). 
- **WARN:** `curl`, `wget`, `npm install`, `brew install`, `sudo`.
- **ALLOW:** Safe read-only (`ls`, `pwd`, `git status`) and validated `scripts/` Bun utilities.

**External Integrations:**
- **BLOCK:** Known malicious endpoints. PII/credentials sent over HTTP (non-HTTPS).
- **WARN:** APIs receiving user data, third-party auth services (Stripe, email).
- **ALLOW:** Public no-auth APIs (search, weather).

## 6. Base Security Config
```yaml
version: 1.0.0
security_mode: permissive # permissive | strict | audit
credentials: { enabled: true, action: BLOCK }
pii: 
  enabled: true
  action: WARN
  exceptions: [".claude/Base/User/CONTACTS.md", ".claude/Base/User/RESUME.md"]
destructive_operations: { enabled: true, action: BLOCK, require_confirmation: true }
file_system:
  allowed_paths: ["${PROJECT_ROOT}", "/tmp", "${HOME}/Documents"]
  blocked_paths: ["/etc", "/usr", "${HOME}/.ssh"]
command_execution: { validate_all: true, bun_scripts_path: "scripts/" }
external_apis: { warn_on_user_data: true, block_insecure: true }
custom_rules: []
```
*(Custom rules follow `name, pattern, action, message, scope` schema).*