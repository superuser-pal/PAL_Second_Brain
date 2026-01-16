---
name: user-layer-index
description: PAL User Layer - Comprehensive directory overview, file loading priorities, and documentation for the user layer
version: 1.0.0
---

# PAL User Layer

**Version:** 1.0.0
**Purpose:** Your personal knowledge base for PAL
**Location:** `PAL_Base/User/`

---

## Overview

The USER layer contains your personal context - who you are, what you do, and how you work. This is the foundation of PAL's personalization. All files are loaded at session start via the SessionStart hook.

---

## File Loading Order

USER layer files load in priority order (1-9):

| Priority | File                 | Purpose                            | Customization |
| -------- | -------------------- | ---------------------------------- | ------------- |
| 1        | **ABOUTME.md**       | Personal background and philosophy | Required      |
| 2        | **DIRECTIVES.md**    | System behavioral rules            | Required      |
| 3        | **TECHSTACK.md**     | Technology preferences             | Required      |
| 4        | **TERMINOLOGY.md**   | Vocabulary and reminders           | Recommended   |
| 5        | **DIGITALASSETS.md** | Web properties and accounts        | As needed     |
| 6        | **CONTACTS.md**      | Contact directory                  | As needed     |
| 7        | **ONBOARDING.md**    | Technical concepts guide           | Reference     |
| 8        | **RESUME.md**        | Professional background            | As needed     |
| 9        | **ART.md**           | Visual style guidelines            | As needed     |

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

### TECHSTACK.md (Priority 3)

**Purpose:** Technology preferences

Your technical environment. Defines:

- Primary programming language
- Package manager preferences
- Deployment workflows
- Infrastructure setup

**Key Sections:** Languages, Package Managers, Infrastructure, Deployment Commands

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

### ONBOARDING.md (Priority 7)

**Purpose:** Technical concepts guide

Educational reference. Covers:

- File system basics
- Package management
- Git and version control
- Hooks and automation

**Key Sections:** Foundations, Package Management, Git, Hooks, Troubleshooting

---

### RESUME.md (Priority 8)

**Purpose:** Professional background

Your career context. Contains:

- Professional summary
- Work experience
- Education and skills
- Publications and speaking

**Key Sections:** Professional Summary, Experience, Education, Skills

---

### ART.md (Priority 9)

**Purpose:** Visual style guidelines

Your visual identity. Defines:

- Brand colors
- Typography
- Diagram style
- Image generation preferences

**Key Sections:** Brand Colors, Typography, Visual Style, Diagram Style

---

## How PAL Uses This Layer

### At Session Start

```

SessionStart Hook → Load USER Layer (Priority 1-9)
↓
PAL Master has full personal context

```

### During Work

| User Request                  | Files Referenced               |
| ----------------------------- | ------------------------------ |
| "Deploy my site"              | DIGITALASSETS.md, TECHSTACK.md |
| "Who's my contact at X?"      | CONTACTS.md                    |
| "Write a bio for me"          | RESUME.md, ABOUTME.md          |
| "Create a diagram"            | ART.md, TECHSTACK.md           |
| "What's the PAL terminology?" | TERMINOLOGY.md                 |

### For Output

| Output Type    | Files Applied               |
| -------------- | --------------------------- |
| Technical work | TECHSTACK.md, DIRECTIVES.md |
| Communications | ABOUTME.md, RESUME.md       |
| Visual content | ART.md                      |
| Explanations   | ONBOARDING.md               |

---

## Getting Started

### Minimum Setup (3 files)

1. **ABOUTME.md** - Your identity (Priority 1)
2. **DIRECTIVES.md** - Operating rules (Priority 2)
3. **TECHSTACK.md** - Technical preferences (Priority 3)

These three files provide enough context for basic PAL functionality.

### Recommended Setup (6 files)

Add to minimum: 4. **TERMINOLOGY.md** - Custom vocabulary (Priority 4) 5. **DIGITALASSETS.md** - Your digital properties (Priority 5) 6. **CONTACTS.md** - Professional network (Priority 6)

### Full Setup (9 files)

Complete all files for maximum PAL capability.

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
