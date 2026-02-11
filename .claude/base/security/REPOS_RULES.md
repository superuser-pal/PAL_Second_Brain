---
title: PAL Repository Rules
version: 1.0.0
layer: SECURITY
purpose: Private vs public data policies and sanitization rules
last_updated: 2026-01-13
---

## Section 1: Repository Classification

### Private vs Public Data

| Aspect                 | Private Repository           | Public Repository           |
| ---------------------- | ---------------------------- | --------------------------- |
| **Data Sensitivity**   | Can contain personal context | Must sanitize personal data |
| **Credential Storage** | Environment variables only   | NEVER store credentials     |
| **PII Handling**       | Allowed in designated files  | Must be sanitized           |
| **Base Configuration** | Full Base with personal data | Sanitized Base templates    |

### Repository Detection

PAL automatically detects repository type based on Git remote URL. Check for public hosting (github.com, gitlab.com, bitbucket.org) and verify repo visibility.

**Configuration Override in `.claude/settings.json`:**

```json
{
  "repository": {
    "type": "private", // private | public
    "auto_detect": false
  }
}
```

---

## Section 2: Data Classification

### Data Sensitivity Levels

**Level 1: Public Data (GREEN)**
Generic code, public docs, open-source libraries, design patterns. Safe for public repos without sanitization.

**Level 2: Project-Specific Data (YELLOW)**
Project architecture, custom workflows, technical stack choices. Private repos: allow as-is. Public repos: review for sensitivity.

**Level 3: Personal Context (ORANGE)**
Communication preferences (DIRECTIVES.md). Private repos: allow. Public repos: must sanitize.

**Level 4: Identifiable Personal Data (RED)**
Email addresses, phone numbers, physical addresses, SSN, API keys, credentials. Private repos: designated files only. Public repos: MUST be removed.

---

## Section 3: Private Repository Rules

### What's Allowed in Private Repositories

**Base Configuration Files - ALLOWED without sanitization:**
All files in `.claude/Base/User/` (ABOUTME.md, DIRECTIVES.md, CONTACTS.md, etc.) can contain personal context since private repos are not publicly accessible.

**Credentials Storage - NEVER allowed:**
No hardcoded API keys, passwords, database credentials, private keys, JWT tokens, or OAuth secrets. Use environment variables in `.env` file (add to .gitignore).

```bash
# .env file
API_KEY=your_api_key_here

# Code references
const apiKey = process.env.API_KEY;
```

**Commit Messages:**
Personal context OK. Credentials NEVER allowed.

---

## Section 4: Public Repository Rules

### Sanitization Requirements

Public repositories MUST sanitize all personal data before pushing.

#### Sanitization Checklist

Before pushing to public repository:

- Replace real names with placeholders
- Remove email addresses (or use example.com)
- Remove phone numbers (or use 555 numbers)
- Remove physical addresses
- Replace company/client names with generic names
- Remove API keys/credentials
- Review commit history for sensitive information

#### Sanitized Base Templates

Public repositories should include templates with placeholders, not personal data. Replace all `[Placeholder Text]` with actual information in private copies.

---

## Section 5: Gitignore Rules

### Essential .gitignore Entries

Every PAL repository MUST include:

```gitignore
# Environment files & secrets (CRITICAL)
.env
.env.*
*.pem
*.key
*.cert
private/
secrets/

# Session transcripts
.claude/transcripts/
transcripts/

# Build outputs
dist/
build/
node_modules/

# IDE files
.vscode/
.idea/

# macOS
.DS_Store
```

### Repository-Specific Rules

**PUBLIC repositories - additional entries:**

```gitignore
# ALL Base User files (use templates)
.claude/Base/User/*.md
!.claude/Base/User/*.template.md
```

**PRIVATE repositories:**
Credentials still blocked. Base User files allowed.

---

## Section 6: Data Sanitization Utilities

### Automated Sanitization

**Sanitize Base Configuration:**

```bash
bun run scripts/sanitize-base.ts --input=.claude/Base/User/ --output=.claude/Base/User-Public/
```

Replaces PII (emails, phones, addresses, SSN, credit cards) with placeholders and adds template headers.

**Detect Sensitive Data:**

```bash
bun run scripts/detect-sensitive-data.ts --path=. --report=sensitive-data-report.json
```

Scans for emails, phones, SSN, API keys, private keys, and personal names. Outputs JSON report with violations.

---

## Section 7: Commit History Sanitization

### Pre-Commit Hooks

Install pre-commit hook (`.git/hooks/pre-commit`) to detect sensitive data before committing:

```bash
bun run scripts/detect-sensitive-data.ts --files="$STAGED_FILES" --mode=commit
```

Make executable: `chmod +x .git/hooks/pre-commit`

### Rewriting Git History

**⚠️ WARNING: Rewrites commit history, requires force push**

```bash
# Remove file from entire history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/sensitive/file" \
  --prune-empty --tag-name-filter cat -- --all

# Force push
git push --force --all
```

After rewriting: All collaborators must delete local clones and re-clone repository.

---

## Section 8: Repository Migration

### Private to Public Migration

**Steps:**

1. **Audit:** Run `bun run scripts/detect-sensitive-data.ts --path=. --report=audit-report.json`
2. **Sanitize:** Run `bun run scripts/sanitize-base.ts` and replace Base files
3. **Update .gitignore:** Add public repository rules
4. **Clean history:** Use `git filter-branch` to remove sensitive files from history
5. **Verify:** Run final scan and manual review
6. **Make public:** GitHub Settings → Change repository visibility

### Public to Private Migration

Easier process - no sanitization concerns. Change visibility to private in GitHub settings, then add personal data and update .gitignore.

---

## Section 9: Repository Configuration

### Settings.json Configuration

**Location:** `.claude/settings.json`

```json
{
  "repository": {
    "type": "private", // private | public
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
      ".claude/Base/User/ABOUTME.md"
    ]
  }
}
```

---

## Section 10: Best Practices

### Private Repositories

**DO:** Use Base with personal data, store credentials in `.env` (add to .gitignore), use descriptive commit messages
**DON'T:** Hardcode credentials, commit `.env` files, store private keys in repo

### Public Repositories

**DO:** Use sanitized templates, run scans before pushing, use pre-commit hooks, review commit history
**DON'T:** Include real PII, commit credentials, use company/client names, assume sanitization is perfect

### All Repositories

**DO:** Use `.gitignore` properly, store credentials in env vars, run security scans regularly
**DON'T:** Commit first think later, ignore warnings, disable security hooks, assume automated tools catch everything

---

## Conclusion

PAL's repository rules provide flexible data policies through repository classification (private vs public), four data sensitivity levels (green/yellow/orange/red), automated sanitization utilities, and configurable security settings.

**Key Features:**

- Auto-detect repository type or configure manually
- Different rules for private (personal context allowed) vs public (sanitized templates)
- Automated utilities for sanitization and detection
- Pre-commit hooks to prevent sensitive data commits
- Migration tools for private↔public transitions

**For Users:**
Configure repository type in settings.json, run sanitization utilities before public release, install pre-commit hooks, review commit history regularly.

**For PreToolUse Hook:**
Check repository type, apply appropriate data policies, block credential commits, warn on PII in public repositories.

**Related Files:** [GUARDRAILS.md](GUARDRAILS.md), [MEMORY_LOGIC.md](../System/MEMORY_LOGIC.md)

---

**Version:** 1.0.0 | **Last Updated:** 2026-01-14

---
