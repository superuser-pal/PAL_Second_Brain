---
name: user-layer-index
description: PAL User Layer - Comprehensive directory overview, file loading priorities, and documentation for the user layer
version: 1.1.0
---

# PAL User Layer

**Version:** 1.1.0
**Purpose:** Your personal knowledge base for PAL
**Location:** `.claude/base/user/`

---

## Overview

The USER layer contains your personal context - who you are, what you do, and how you work. This is the foundation of PAL's personalization.

**Note:** USER layer files are available for PAL Master and domain agents to reference. Base context loading is configured in the SessionStart hook.

---

## File Loading Order

USER layer files in priority order:

| Priority | File                 | Purpose                     | Customization |
| -------- | -------------------- | --------------------------- | ------------- |
| 1        | **ABOUTME.md**       | Personal background         | Required      |
| 2        | **DIRECTIVES.md**    | System behavioral rules     | Required      |
| 4        | **TERMINOLOGY.md**   | Vocabulary and reminders    | Recommended   |
| 5        | **DIGITALASSETS.md** | Web properties and accounts | As needed     |
| 6        | **CONTACTS.md**      | Contact directory           | As needed     |

---

## File Descriptions

### ABOUTME.md (Priority 1)

**Purpose:** Personal background and philosophy

Your identity foundation. PAL uses this to:

- Understand who you are
- Represent you authentically
- Personalize all interactions

**Key Sections:** Background, Core Beliefs, Current Focus, How to Represent Me

---

### DIRECTIVES.md (Priority 2)

**Purpose:** System behavioral rules

How PAL should operate. Controls:

- Plan-First execution settings
- Error handling behavior
- Skill activation preferences
- Git operations behavior
- Restricted operations

**Key Sections:** Plan-First, Task Execution, Error Handling, Security & Boundaries

---

### TERMINOLOGY.md (Priority 4)

**Purpose:** Vocabulary and reminders

Your source of truth. Contains:

- PAL system terminology
- Custom definitions and acronyms
- Recurring reminders
- Project dependencies

**Key Sections:** PAL Terminology, Custom Definitions, Reminders, Dependencies

---

### DIGITALASSETS.md (Priority 5)

**Purpose:** Web properties and accounts

Your digital footprint. Lists:

- Websites and their local paths
- Natural language routing rules
- Cloud accounts
- Domains and API references

**Key Sections:** Web Properties, Cloud Accounts, Domains, API Keys

---

### CONTACTS.md (Priority 6)

**Purpose:** Contact directory

Your professional network. Includes:

- Essential contacts
- Extended network
- Service providers
- Clients/customers

**Key Sections:** Essential Contacts, Extended Contacts, Financial, Service Providers

---

## How PAL Uses This Layer

### At Session Start

```
SessionStart Hook → Loads configured BASE files
↓
PAL Master references USER layer files as needed
```

**Note:** Current SessionStart hook configuration loads SYSTEM files (ARCHITECTURE.md, ORCHESTRATION.md) by default. USER files are available for reference during execution.

### During Work

| User Request                  | Files Referenced        |
| ----------------------------- | ----------------------- |
| "Deploy my site"              | DIGITALASSETS.md        |
| "Who's my contact at X?"      | CONTACTS.md             |
| "What do you know about me?"  | ABOUTME.md              |
| "What's the PAL terminology?" | TERMINOLOGY.md          |
| "Follow my directives"        | DIRECTIVES.md           |

### For Output

| Output Type    | Files Applied      |
| -------------- | ------------------ |
| Personalization| ABOUTME.md         |
| Behavior rules | DIRECTIVES.md      |
| Terminology    | TERMINOLOGY.md     |
| Contacts       | CONTACTS.md        |
| Digital assets | DIGITALASSETS.md   |

---

## Getting Started

### Minimum Setup (2 files)

1. **ABOUTME.md** - Your identity (Priority 1)
2. **DIRECTIVES.md** - Operating rules (Priority 2)

These two files provide the foundation for PAL personalization.

### Recommended Setup (4 files)

Add to minimum:

3. **TERMINOLOGY.md** - Custom vocabulary (Priority 4)
4. **CONTACTS.md** - Professional network (Priority 6)

### Full Setup (5 files)

Complete all files for maximum PAL capability:

5. **DIGITALASSETS.md** - Digital properties (Priority 5)

---

## Privacy & Security

This layer contains **sensitive personal information**:

- **Keep in private repository** - Never make public
- **No actual credentials** - Use environment variable references
- **Review before commits** - Check for sensitive data
- **Reference REPOS_RULES.md** - Follow data handling policies

### What NOT to Include

- API keys or passwords (use `$ENV_VAR` references)
- Credit card numbers
- Social security numbers
- Private keys

---

## Maintenance Schedule

| Frequency     | Task                                            |
| ------------- | ----------------------------------------------- |
| **Weekly**    | Review TERMINOLOGY.md for new terms/reminders   |
| **Monthly**   | Update DIGITALASSETS.md with new sites/accounts |
| **As Needed** | Update DIRECTIVES.md when preferences change    |
| **As Needed** | Update CONTACTS.md when network changes         |
| **Quarterly** | Review all files for accuracy                   |

---

## Usage Examples

### Ask PAL About Your Context

```

"What do you know about me?"
→ References ABOUTME.md

"What package manager should I use?"
→ References TECHSTACK.md

"Deploy my main site"
→ References DIGITALASSETS.md + TECHSTACK.md

"Who's my financial advisor?"
→ References CONTACTS.md

"Write a speaker bio for me"
→ References RESUME.md + ABOUTME.md

```

---
