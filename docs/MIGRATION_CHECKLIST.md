---
title: PAL Migration Checklist
version: 1.1.0
category: Configuration
layer: DOCS
purpose: Step-by-step guide for migrating PAL to a new project
audience: Technical-curious professionals setting up PAL
last_updated: 2026-01-15
---

# PAL Migration Checklist

**Version:** 1.1.0
**Purpose:** Complete step-by-step guide for migrating PAL to a new project
**Layer:** DOCS (Configuration Reference)

---

## Overview

This checklist guides you through migrating PAL to a new project. Follow these steps in order to ensure all components are properly configured.

**Estimated Time:** 30-60 minutes for basic setup

---

## Pre-Migration Requirements

Before starting, ensure you have:

- [x] **Bun installed** - Required for hooks (`curl -fsSL https://bun.sh/install | bash`)
- [x] **Claude Code installed** - The CLI tool PAL runs within
- [x] **Git repository** - For version control of your configuration
- [x] **Private repository** - USER layer contains personal data

---

## Phase 1: Directory Structure

Create the PAL directory structure in your project:

### Step 1.1: Create Core Directories

```bash
# Create base knowledge structure
mkdir -p .claude/base/user
mkdir -p .claude/base/system
mkdir -p .claude/base/security

# Create tools structure
mkdir -p .claude/tools/hooks
mkdir -p .claude/tools/scripts
mkdir -p .claude/tools/maintenance

# Create placeholder directories (for future use)
mkdir -p .claude/agents
mkdir -p .claude/skills
mkdir -p .claude/commands
mkdir -p .claude/mcp

# Create docs at project root
mkdir -p docs/changelog
mkdir -p docs/how-to
mkdir -p docs/patterns

# Verify structure
tree .claude docs
```

**Expected Output:**
```
.claude
├── agents/
├── base/
│   ├── security/
│   ├── system/
│   └── user/
├── commands/
├── mcp/
├── skills/
└── tools/
    ├── hooks/
    ├── maintenance/
    └── scripts/
docs
├── changelog/
├── how-to/
└── patterns/
```

### Step 1.2: Verification

- [x] `.claude/base/user/` directory exists
- [x] `.claude/base/system/` directory exists
- [x] `.claude/base/security/` directory exists
- [x] `.claude/tools/hooks/` directory exists
- [x] `docs/` directory exists at project root

---

## Phase 2: Copy Base Files

Copy files from source to your project, following the priority order.

### Step 2.1: USER Layer (Priority 1-9)

Copy to `.claude/base/user/`:

| Priority | File | Target |
|----------|------|--------|
| 1 | ABOUTME.md | .claude/base/user/ABOUTME.md |
| 2 | DIRECTIVES.md | .claude/base/user/DIRECTIVES.md |
| 3 | TECHSTACK.md | .claude/base/user/TECHSTACK.md |
| 4 | TERMINOLOGY.md | .claude/base/user/TERMINOLOGY.md |
| 5 | DIGITALASSETS.md | .claude/base/user/DIGITALASSETS.md |
| 6 | CONTACTS.md | .claude/base/user/CONTACTS.md |
| 7 | ONBOARDING.md | .claude/base/user/ONBOARDING.md |
| 8 | RESUME.md | .claude/base/user/RESUME.md |
| 9 | ART.md | .claude/base/user/ART.md |

**Verification:**
- [x] All 9 USER files copied to `.claude/base/user/`
- [x] Files are UPPERCASE.md format
- [x] No files in wrong directory

### Step 2.2: SYSTEM Layer (Priority 11-15)

Copy to `.claude/base/system/`:

| Priority | File | Target |
|----------|------|--------|
| 11 | ARCHITECTURE.md | .claude/base/system/ARCHITECTURE.md |
| 12 | ORCHESTRATION.md | .claude/base/system/ORCHESTRATION.md |
| 13 | WORKFLOWS.md | .claude/base/system/WORKFLOWS.md |
| 14 | MEMORY_LOGIC.md | .claude/base/system/MEMORY_LOGIC.md |
| 15 | TOOLBOX.md | .claude/base/system/TOOLBOX.md |

**Verification:**
- [x] All 5 SYSTEM files copied to `.claude/base/system/`
- [x] Files are UPPERCASE.md format

### Step 2.3: SECURITY Layer (Priority 21-22)

Copy to `.claude/base/security/`:

| Priority | File | Target |
|----------|------|--------|
| 21 | GUARDRAILS.md | .claude/base/security/GUARDRAILS.md |
| 22 | REPOS_RULES.md | .claude/base/security/REPOS_RULES.md |

**Verification:**
- [x] Both SECURITY files copied to `.claude/base/security/`
- [x] Files are UPPERCASE.md format

### Step 2.4: DOCS Layer (Reference)

Copy configuration templates to `docs/`:

| File | Target |
|------|--------|
| SETTINGS_TEMPLATE.md | docs/how-to/SETTINGS_TEMPLATE.md |
| HOOK_TEMPLATES.md | docs/how-to/HOOK_TEMPLATES.md |
| MIGRATION_CHECKLIST.md | docs/how-to/MIGRATION_CHECKLIST.md |
| PAL_DIRECTORY_STRUCTURE.md | docs/patterns/PAL_DIRECTORY_STRUCTURE.md |

**Verification:**
- [x] All 4 DOCS files copied to `docs/`

---

## Phase 3: Customize USER Layer

The USER layer files contain placeholders that must be customized.

### Step 3.1: ABOUTME.md (Required)

Open `.claude/base/user/ABOUTME.md` and fill in:

- [ ] **Who I Am** - Your background
- [ ] **What I Do** - Your work/focus
- [ ] **Philosophy** - Your beliefs/values
- [ ] **Current Focus** - Active projects/goals
- [ ] **How to Represent Me** - Tone and style

### Step 3.2: DIRECTIVES.md (Required)

Open `.claude/base/user/DIRECTIVES.md` and configure:

- [ ] **Plan-First Settings** - When to show plans
- [ ] **Error Handling** - How to handle failures
- [ ] **Output Format** - Preferred response style
- [ ] **Git Operations** - Commit/push preferences

### Step 3.3: TECHSTACK.md (Required)

Open `.claude/base/user/TECHSTACK.md` and set:

- [ ] **Primary Language** - Your main programming language
- [ ] **Package Manager** - npm, bun, yarn, etc.
- [ ] **Framework Preferences** - React, Vue, etc.
- [ ] **Deployment Workflow** - How you deploy

### Step 3.4: Remaining USER Files (As Needed)

Complete these as relevant to your work:

- [ ] **TERMINOLOGY.md** - Add project-specific terms
- [ ] **DIGITALASSETS.md** - List your websites/accounts
- [ ] **CONTACTS.md** - Add key contacts
- [ ] **ONBOARDING.md** - Review technical concepts
- [ ] **RESUME.md** - Add professional background
- [ ] **ART.md** - Define visual style (if applicable)

---

## Phase 4: Configure Hooks

Implement the three essential hooks in `.claude/tools/hooks/`.

### Step 4.1: Create settings.json

Create `.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bun run .claude/tools/hooks/session-start.ts"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "bun run .claude/tools/hooks/pre-tool-use.ts"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bun run .claude/tools/hooks/stop.ts"
          }
        ]
      }
    ]
  }
}
```

**Verification:**
- [x] settings.json created in `.claude/`
- [x] JSON syntax is valid
- [x] Paths point to `.claude/tools/hooks/`

### Step 4.2: Implement SessionStart Hook

Create `.claude/tools/hooks/session-start.ts`:
- Reference `docs/how-to/HOOK_TEMPLATES.md` for template
- Adapt to your runtime (Bun recommended)
- Set `BASE_PATH = ".claude/base"`

**Important:** Update the BASE_FILES array to use new paths:
```typescript
const BASE_PATH = ".claude/base";

const BASE_FILES = [
  // USER Layer (Priority 1-9)
  { path: "user/ABOUTME.md",       priority: 1,  layer: "USER" },
  { path: "user/DIRECTIVES.md",    priority: 2,  layer: "USER" },
  // ... etc
];
```

**Verification:**
- [x] Hook file created in `.claude/tools/hooks/`
- [x] BASE_PATH set to `.claude/base`
- [x] BASE_FILES array uses lowercase directories (user/, system/, security/)
- [x] Priority order is correct

### Step 4.3: Implement PreToolUse Hook

Create `.claude/tools/hooks/pre-tool-use.ts`:
- Reference `docs/how-to/HOOK_TEMPLATES.md` for template
- Customize security patterns as needed

**Verification:**
- [x] Hook file created in `.claude/tools/hooks/`
- [x] Security patterns match GUARDRAILS.md
- [x] Exit codes correct (1 = block, 0 = allow)

### Step 4.4: Implement Stop Hook

Create `.claude/tools/hooks/stop.ts`:
- Reference `docs/how-to/HOOK_TEMPLATES.md` for template
- Configure notification method for your OS

**Verification:**
- [x] Hook file created in `.claude/tools/hooks/`
- [x] Notification method works (osascript for macOS)
- [x] Transcript saving configured (optional)

---

## Phase 5: Configure Git

Set up version control for your PAL configuration.

### Step 5.1: Create .gitignore

Add these entries to your `.gitignore`:

```gitignore
# PAL Security - Never commit
.env
.env.*
*.pem
*.key
credentials.json

# Transcripts (optional - may contain sensitive data)
transcripts/

# OS files
.DS_Store
Thumbs.db
```

**Verification:**
- [ ] .gitignore includes security entries
- [ ] .env files are ignored
- [ ] Credentials are ignored

### Step 5.2: Initial Commit

```bash
git add .claude/
git add docs/
git add .gitignore
git commit -m "feat: Initialize PAL configuration"
```

**Verification:**
- [ ] All PAL files tracked
- [ ] No sensitive files committed
- [ ] Commit successful

---

## Phase 6: Validation

Test that PAL is working correctly.

### Step 6.1: Test SessionStart Hook

1. Start new Claude Code session in your project
2. Check console output for Base file loading
3. Verify all 16 files appear in output

**Expected:**
```
═══════════════════════════════════════════════════════════
PAL BASE CONTEXT LOADING
═══════════════════════════════════════════════════════════

[USER] user/ABOUTME.md (Priority: 1)
─────────────────────────────────────────────────────────
[File content appears here]

... (all 16 files) ...

CONTEXT LOADING COMPLETE
✓ Loaded: 16 files
═══════════════════════════════════════════════════════════
```

**Verification:**
- [x] Hook fires at session start
- [x] All 16 files load
- [x] No errors in output

### Step 6.2: Test PreToolUse Hook

1. Ask Claude to write a file with "password=secret123" in content
2. Should be BLOCKED

**Expected:**
```
BLOCKED: Potential credential detected in content. Use environment variables instead (process.env.YOUR_KEY).
```

3. Ask Claude to write a normal file
4. Should succeed

**Verification:**
- [x] Credential detection works (BLOCK)
- [x] Normal operations allowed
- [x] Warning messages display correctly

### Step 6.3: Test Stop Hook

1. End session with `/stop` or by exiting
2. Check for notification
3. Verify transcript saved (if enabled)

**Verification:**
- [x] Stop hook fires
- [x] Notification received (macOS notification via osascript)
- [x] Summary displays in terminal

### Step 6.4: Test Context Access

Ask Claude: "What are my technology preferences?"

**Expected:** Claude responds with information from TECHSTACK.md

**Verification:**
- [x] Claude can access USER layer content
- [x] Responses reflect your configuration
- [x] Context persists through session

---

## Phase 7: Final Verification

Complete final checks before using PAL.

### Step 7.1: File Count Verification

```bash
# Count files
ls -la .claude/base/user/ | grep -c ".md"     # Should be 9
ls -la .claude/base/system/ | grep -c ".md"   # Should be 5
ls -la .claude/base/security/ | grep -c ".md" # Should be 2
ls -la docs/ | find docs -name "*.md" | wc -l # Should be 4
```

**Verification:**
- [ ] USER: 9 files in `.claude/base/user/`
- [ ] SYSTEM: 5 files in `.claude/base/system/`
- [ ] SECURITY: 2 files in `.claude/base/security/`
- [ ] DOCS: 4 files in `docs/`
- [ ] **Total: 20 files**

### Step 7.2: Hook Verification

```bash
# Check hooks exist
ls -la .claude/tools/hooks/
```

**Expected:**
```
session-start.ts
pre-tool-use.ts
stop.ts
```

**Verification:**
- [x] All 3 hooks present in `.claude/tools/hooks/`
- [x] Files are executable

### Step 7.3: Settings Verification

```bash
# Verify settings.json
cat .claude/settings.json | jq .
```

**Verification:**
- [x] Valid JSON
- [x] All hooks configured
- [x] Paths point to `.claude/tools/hooks/`

---

## Troubleshooting

### Hook Not Firing

**Symptoms:** Base context not loaded, no security validation

**Solutions:**
1. Check `.claude/settings.json` exists
2. Verify JSON syntax is valid
3. Ensure hook scripts exist at specified paths
4. Check Bun is installed: `bun --version`
5. Restart Claude Code session

### Permission Errors

**Symptoms:** "Permission denied" when running hooks

**Solutions:**
1. Make hooks executable: `chmod +x .claude/tools/hooks/*.ts`
2. Check file ownership
3. Verify Bun has access to directory

### Files Not Loading

**Symptoms:** Some files missing from context

**Solutions:**
1. Check file paths in session-start.ts match actual paths
2. Verify all files exist in `.claude/base/`
3. Check for typos in filenames (must be UPPERCASE.md)
4. Ensure BASE_PATH is set to `.claude/base`
5. Review hook output for error messages

### Security Blocking Everything

**Symptoms:** All operations blocked by PreToolUse

**Solutions:**
1. Review security patterns in pre-tool-use.ts
2. Check patterns aren't too broad
3. Verify GUARDRAILS.md matches implementation
4. Test with simpler patterns first

---

## Post-Migration Maintenance

### Regular Tasks

- [ ] **Weekly:** Review TERMINOLOGY.md for new terms/reminders
- [ ] **Monthly:** Update DIGITALASSETS.md with new sites/accounts
- [ ] **As Needed:** Update DIRECTIVES.md when preferences change
- [ ] **Quarterly:** Review all USER files for accuracy

### Updating PAL

When PAL updates are available:
1. Review changelog for breaking changes
2. Backup current configuration
3. Merge updates carefully
4. Re-run validation tests

---

## Migration Complete Checklist

Final verification that PAL is fully operational:

- [x] **Directory Structure:** All directories created in `.claude/` and `docs/`
- [ ] **USER Layer:** 9 files in `.claude/base/user/` and customized (Phase 3 skipped)
- [x] **SYSTEM Layer:** 5 files in `.claude/base/system/`
- [x] **SECURITY Layer:** 2 files in `.claude/base/security/`
- [x] **DOCS Layer:** 4 files in `docs/`
- [x] **Hooks:** All 3 hooks in `.claude/tools/hooks/`
- [x] **Settings:** .claude/settings.json configured with correct paths
- [ ] **Git:** Version control set up (Phase 5 pending)
- [x] **Validation:** All tests pass

**Migration Status:** [ ] COMPLETE (Phase 3 & 5 remaining)

---

## Migration & Integration

> **AI INSTRUCTIONS**: When this file is placed in a new project, follow these integration steps.

### Layer Classification
- **Layer**: DOCS (Configuration Reference)
- **Priority**: N/A (reference document, not loaded by hooks)
- **Dependencies**: None

### Target Location
```
[PROJECT_ROOT]/docs/how-to/MIGRATION_CHECKLIST.md
```

### Integration Steps

1. **Place File**
   - Copy to `docs/how-to/MIGRATION_CHECKLIST.md`
   - This is a reference document for the user

2. **Guide User Through Migration**
   - When user asks about setting up PAL, reference this checklist
   - Walk through phases in order
   - Help troubleshoot issues

### How This File Is Used

| User/System | Usage |
|-------------|-------|
| **User** | Step-by-step migration guide |
| **AI** | Reference when helping user set up PAL |
| **Hooks** | Not used directly - reference only |

### First-Use Checklist
- [ ] Template file in `docs/how-to/`
- [ ] User has read through checklist
- [ ] User understands migration phases

---

**Document Version:** 1.1.0
**Last Updated:** 2026-01-15
**Related Files:** SETTINGS_TEMPLATE.md, HOOK_TEMPLATES.md, PAL_DIRECTORY_STRUCTURE.md
