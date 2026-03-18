---
title: PAL Repository Rules
version: 1.1.0
layer: SECURITY
purpose: Strict private/public classification and data sanitization schema
last_updated: 2026-03-18
---

# Repository Rules

Strict classification schema handling public distribution vs private storage logic via `PreToolUse` hook enforcement. Target resolved via `.claude/settings.json` `repository.type`.

## 1. Classification & Allowance Matrix

| Level / Data Type | Private Repo (`repository.type: "private"`) | Public Repo (`repository.type: "public"`) |
|-------------------|---------------------------------------------|-------------------------------------------|
| **1 Green (Public Data)** | ALLOW (Generic code, patterns) | ALLOW |
| **2 Yellow (Project Arch)** | ALLOW (Custom workflows, stack) | WARN (Review for sensitivity before push) |
| **3 Orange (Personal Base)**| ALLOW (DIRECTIVES, TECHSTACK) | **SANITIZE** (Must use templates/placeholders) |
| **4 Red (PII / Credentials)**| ALLOW PII in `CONTACTS`/`RESUME`. **BLOCK** Credentials. | **BLOCK & STRIP ALL** |

## 2. Sanitization Requirements (Public)
Before pushing to a public environment:
1. Strip all names, emails, phones, addresses, SSNs, Client Names.
2. Remove any accidentally committed API keys/secrets.
3. Replace `.claude/Base/User/*.md` files with generic `.template.md` equivalents.

## 3. Gitignore Constraints
**All Repositories MUST exclude:**
```gitignore
# Secrets
.env
.env.*
*.pem
*.key
*.cert
private/
secrets/

# Build & Logs
.claude/transcripts/
transcripts/
dist/
build/
node_modules/
.vscode/
.idea/
.DS_Store
```
**Public Repositories MUST also exclude:**
```gitignore
.claude/Base/User/*.md
!.claude/Base/User/*.template.md
```

## 4. Sanitization Toolchain
- **Base Sanitization:** `bun run scripts/sanitize-base.ts --input=.claude/Base/User/ --output=.claude/Base/User-Public/`
- **Data Scanning:** `bun run scripts/detect-sensitive-data.ts --path=. --report=sensitive-data-report.json`
- **Pre-commit Scan:** `bun run scripts/detect-sensitive-data.ts --files="$STAGED_FILES" --mode=commit` -> Must bind to `.git/hooks/pre-commit`.

## 5. Security Settings Schema (`.claude/settings.json`)
```json
{
  "repository": {
    "type": "private", 
    "auto_detect": true,
    "sanitization": {
      "enabled": true,
      "strict_mode": false,
      "pre_commit_hook": true,
      "patterns": {
        "email": true,
        "phone": true,
        "ssn": true,
        "credit_card": true,
        "api_keys": true
      }
    },
    "allowed_personal_files": [
      ".claude/Base/User/CONTACTS.md",
      ".claude/Base/User/RESUME.md",
      ".claude/Base/User/ABOUTME.md"
    ]
  }
}
```
