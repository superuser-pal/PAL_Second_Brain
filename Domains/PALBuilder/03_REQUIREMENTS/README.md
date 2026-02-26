# PAL Second Brain - Requirements Documentation

**Version:** 1.5.0
**Last Updated:** 2026-02-25

---

## Overview

This folder contains the functional requirements for the PAL Second Brain framework. The documentation is written for two audiences:

1. **Developers** extending PAL with new skills, agents, or system features
2. **End users** learning how PAL works and what to expect from it

All requirements use the **Given-When-Then** format (also called BDD/Gherkin style), which describes behavior in plain language that both technical and non-technical readers can understand.

---

## Document Index

| Document | ID Range | Purpose |
|----------|----------|---------|
| [00_CORE_SYSTEM.md](00_CORE_SYSTEM.md) | `0.X.Y` | Core architecture, layers, routing, and fundamental behaviors |
| [01_SKILLS.md](01_SKILLS.md) | `1.X.Y` | Requirements for all skills (create-agent, create-domain, create-skill, note-taking, project-management, system-build, life-management, system-cleaner) |
| [02_AGENTS.md](02_AGENTS.md) | `2.X.Y` | Requirements for all agents (PAL Master, PAL Builder, Studio Agent, Substack Manager) |
| [03_COMMANDS.md](03_COMMANDS.md) | `3.X.Y` | Requirements for all commands (agent commands, session commands) |
| [04_TOOLS_AND_HOOKS.md](04_TOOLS_AND_HOOKS.md) | `4.X.Y` | Requirements for tools and hooks (session-start, pre-tool-use, stop) |

---

## Requirement ID System

Each requirement has a unique ID using hierarchical numbering:

```
[DOCUMENT].[SECTION].[REQUIREMENT]
```

### Document Numbers

| Prefix | Document |
|--------|----------|
| `0` | Core System |
| `1` | Skills |
| `2` | Agents |
| `3` | Commands |
| `4` | Tools and Hooks |

### Section Numbers

**Core System (0.X.Y)**
- `0.1` — Core Requirements
- `0.2` — Domain Workspace Requirements
- `0.3` — Naming Convention Requirements
- `0.4` — Session and State Requirements
- `0.5` — Error Handling Requirements

**Skills (1.X.Y)**
- `1.0` — Skill Architecture Requirements
- `1.1` — create-agent
- `1.2` — create-domain
- `1.3` — create-skill
- `1.4` — note-taking
- `1.5` — project-management
- `1.6` — system-build
- `1.7` — life-management
- `1.8` — system-cleaner

**Agents (2.X.Y)**
- `2.0` — Agent Architecture Requirements
- `2.1` — PAL Master
- `2.2` — PAL Builder
- `2.3` — Studio Agent
- `2.4` — Substack Manager
- `2.5` — Common Agent Requirements

**Commands (3.X.Y)**
- `3.0` — Command Architecture Requirements
- `3.1` — Agent Commands
- `3.2` — Session Commands

**Tools and Hooks (4.X.Y)**
- `4.0` — Tools and Hooks Architecture Requirements
- `4.1` — Hooks

### Example IDs

| ID | Meaning |
|----|---------|
| `0.1.3` | Core System → Core Requirements → 3rd requirement |
| `1.2.4` | Skills → create-domain → 4th requirement |
| `2.1.2` | Agents → PAL Master → 2nd requirement |
| `3.2.5` | Commands → Session Commands → 5th requirement |
| `4.1.3` | Tools and Hooks → Hooks → 3rd requirement |

---

## Requirement Format

Each requirement follows this structure:

```markdown
### 1.1.1 Requirement Name

**Given** [a starting condition or context]
**When** [an action or event occurs]
**Then** [the expected outcome]

Category: [Functional | Validation | Security | UI]
Verification: [How to test this requirement]
Source: [Link to the skill, agent, or system file](.claude/path/to/file.md)
```

### Categories

| Category | Description |
|----------|-------------|
| **Functional** | Core behavior the system must perform |
| **Validation** | Checks, verification, error prevention |
| **Security** | Safety, guardrails, access control |
| **UI** | User interface, menus, display formatting |

### Source Links

The `Source:` field links to the implementation file where the requirement is defined or enforced. This helps you:
- Navigate directly to the skill, agent, or workflow file
- Understand which system component owns the requirement
- Find related requirements in the same source file

### Compound Requirements

Some behaviors need multiple conditions or outcomes:

```markdown
**Given** [condition A]
**And given** [condition B]
**When** [event]
**Then** [outcome A]
**And then** [outcome B]
```

---

## Quick Reference: Core Concepts

| Concept | What It Means |
|---------|---------------|
| **Agent** | A specialized persona for a specific domain (e.g., PAL Builder for system development) |
| **Skill** | A reusable capability (e.g., note-taking, project-management) |
| **Workflow** | A sequence of steps within a skill |
| **Domain** | A project workspace with standard folder structure |
| **USE WHEN** | Trigger phrase that determines when a skill/agent activates |
| **PAL Master** | The default orchestration agent that routes requests |
| **Context** | Files and information loaded into a session |
| **Guardrails** | Safety rules that prevent dangerous operations |
| **Command** | Slash-prefixed instruction that triggers specific behavior (e.g., `/agents:pal-builder`) |
| **Hook** | TypeScript code that runs automatically at lifecycle points (session-start, pre-tool-use, stop) |

---

## Requirements Summary

| Document | Sections | Requirements |
|----------|----------|--------------|
| Core System | 5 | 20 |
| Skills | 9 | 74 |
| Agents | 6 | 26 |
| Commands | 3 | 29 |
| Tools and Hooks | 2 | 18 |
| **Total** | **25** | **167** |

---

## Adding to These Requirements

When PAL grows with new skills, agents, commands, or hooks:

1. **Add requirements to the appropriate document:**
   - New skill → Add section to `01_SKILLS.md` (use next section number, e.g., `1.9`)
   - New agent → Add section to `02_AGENTS.md` (use next section number, e.g., `2.6`)
   - New command → Add to `03_COMMANDS.md` (section 3.1 for agent, 3.2 for session)
   - New hook → Add to `04_TOOLS_AND_HOOKS.md` (section 4.1)
   - Core behavior change → Add to `00_CORE_SYSTEM.md`

2. **Follow the ID format:**
   - Use the next available section number
   - Number requirements sequentially within the section
   - Include Category and Verification for each requirement

3. **Follow the format:**
   - Clear section heading with "What It Does" and "When It Activates/Activates When"
   - Requirements in Given-When-Then format
   - One behavior per requirement

4. **Keep it readable:**
   - Use plain language
   - Define jargon on first use
   - Include examples where helpful

---

## Excluded from Documentation

The following skills are intentionally excluded from this requirements documentation:

- **prompting** — Meta-prompting system
- **first-principles** — Analysis methodology
- **art** — Visual content generation
- **documentation-gen** — This documentation generator

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-13 | Initial requirements documentation |
| 1.1.0 | 2026-02-13 | Added hierarchical requirement IDs, Category, and Verification fields |
| 1.2.0 | 2026-02-13 | Added Source links to navigate to skill/agent/workflow files |
| 1.3.0 | 2026-02-16 | Added life-management (1.7) and system-cleaner (1.8) skills; extended note-taking and system-build sections |
| 1.4.0 | 2026-02-21 | Added 03_COMMANDS.md (29 requirements) and 04_TOOLS_AND_HOOKS.md (18 requirements) |
| 1.5.0 | 2026-02-25 | Added note-taking semantic features (1.4.9-1.4.26): observation categories, entity types, relation types, dedup, blind mode, action extraction, braindump splitting |

---

## Related Resources

- **System Architecture:** `.claude/base/system/ARCHITECTURE.md`
- **Orchestration Logic:** `.claude/base/system/ORCHESTRATION.md`
- **Skill Logic:** `.claude/base/system/SKILL_LOGIC.md`
- **Agent Logic:** `.claude/base/system/AGENTS_LOGIC.md`
- **Domain Logic:** `.claude/base/system/DOMAINS_LOGIC.md`

---

*Generated using the documentation-gen skill.*
