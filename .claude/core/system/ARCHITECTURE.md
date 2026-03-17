---
title: PAL Architecture System
version: 1.3.0
layer: SYSTEM
purpose: Core structural constraints and Master System Map
last_updated: 2026-03-17
---

# PAL Architecture System

**The definitive mapping of the PAL Second Brain layers and routing structure.** For human narrative and principles, see `PHILOSOPHY.md`.

---

## 1. System Layers

PAL operates across 3 strict layers loaded via the `session-start` hook:

| Layer        | Purpose                                         | Key Files                                                                                               | Access Pattern                                            |
| ------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **USER**     | Personal context, preferences, domain knowledge | ABOUTME, DIRECTIVES, TERMINOLOGY, CONTACTS                                                              | Loaded at SessionStart → Full context to PAL Master       |
| **SYSTEM**   | Operational logic, orchestration, workflows     | ARCHITECTURE, ORCHESTRATION, WORKFLOWS, MEMORY_LOGIC, TOOLBOX, AGENTS_LOGIC, SKILL_LOGIC, DOMAINS_LOGIC | Reference for routing, patterns, and agent/skill schemas  |
| **SECURITY** | Constraints and blocklists                      | GUARDRAILS, REPOS_RULES                                                                                 | Enforced by PreToolUse hook                               |

---

## 2. Master System Map

```text
┌─────────────────────────────────────────────────────────────────────┐
│                          USER INPUT                                 │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                       SESSION START HOOK                            │
│         Loads Base Context (USER + SYSTEM + SECURITY layers)        │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                          PAL MASTER                                 │
│ - Intent Classification       - Routing Decisions                   │
│ - Context Assembly            - Plan Presentation & Oversight       │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
                  [ CONCEPTUAL MATCHING & ROUTING ]
                                  ↓
          ┌───────────────────────┼───────────────────────┐
          ↓                       ↓                       ↓
    ┌───────────┐           ┌───────────┐         ┌───────────┐
    │  SKILLS   │           │  AGENTS   │         │ WORKFLOWS │
    │ Flat Dirs │           │ /[agent]  │         │ Sequences │
    └───────────┘           └───────────┘         └───────────┘
          ↓                       ↓                       ↓
    ┌────────────────────────────────────────────────────────┐
    │                   PRE-TOOL-USE HOOK                    │
    │         (Validates GUARDRAILS & REPOS_RULES)           │
    └────────────────────────────────────────────────────────┘
                                  ↓
                           [ EXECUTION ]
                                  ↓
    ┌────────────────────────────────────────────────────────┐
    │                  POST-TOOL-USE HOOK                    │
    │            (YAML Schema validation on write)           │
    └────────────────────────────────────────────────────────┘
                                  ↓
    ┌────────────────────────────────────────────────────────┐
    │                      STOP HOOK                         │
    │         (Notifications & cleanup on session end)       │
    └────────────────────────────────────────────────────────┘
```

---

## 3. Extension Points

- **Skills (`.claude/skills/`):** Create per `SKILL_LOGIC.md` constraints. Must have `SKILL.md` and `tools/`.
- **Custom Agents (`.claude/agents/`):** Create per `AGENTS_LOGIC.md` constraints. Single file, inherits from `AGENT_BASE.md`. Must bind to a Domain.
- **Domains (`Domains/`):** Create per `DOMAINS_LOGIC.md` constraints. Must have `INDEX.md` as source of truth.
- **Toolbox (`.claude/tools/`):** Extend CLI utilities in TypeScript. Create per `TOOLBOX.md`.

---

**Document Version:** 1.3.0
**Last Updated:** 2026-03-17
**Related Files:** PHILOSOPHY.md, ORCHESTRATION.md, AGENTS_LOGIC.md, SKILL_LOGIC.md, DOMAINS_LOGIC.md, MEMORY_LOGIC.md
