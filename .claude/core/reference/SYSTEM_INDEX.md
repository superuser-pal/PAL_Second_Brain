---
title: PAL System Index
version: 2.0.0
layer: SYSTEM
purpose: Writable registry of all agents and their skill assignments
last_updated: 2026-03-06
---

# System Index

> **This file is the writable capability registry.** To assign a skill to an agent, add a row to the Skills Registry table. To remove, delete the row. Skills can appear on multiple rows (one per agent assignment).

> **Source of truth:** This file is the authoritative record of which skills belong to which agents. Skill definitions (USE WHEN, workflows) live in each skill's `SKILL.md`.

## Agents

| Agent        | Domain      | Location                      |
| ------------ | ----------- | ----------------------------- |
| pal-master   | none        | .claude/agents/pal-master.md  |
| pal-builder  | pal-builder | .claude/agents/pal-builder.md |
| life-coach   | life-os     | .claude/agents/life-coach.md  |

## Skills Registry

| Skill              | Agent       | Location                                   |
| ------------------ | ----------- | ------------------------------------------ |
| create-agent       | pal-master  | .claude/skills/create-agent/SKILL.md       |
| create-domain      | pal-master  | .claude/skills/create-domain/SKILL.md      |
| system-cleaner     | pal-master  | .claude/skills/system-cleaner/SKILL.md     |
| note-taking        | pal-master  | .claude/skills/note-taking/SKILL.md        |
| project-management | pal-master  | .claude/skills/project-management/SKILL.md |
| system-build       | pal-builder | .claude/skills/system-build/SKILL.md       |
| create-skill       | pal-builder | .claude/skills/create-skill/SKILL.md       |
| create-agent       | pal-builder | .claude/skills/create-agent/SKILL.md       |
| create-domain      | pal-builder | .claude/skills/create-domain/SKILL.md      |
| prompting          | pal-builder | .claude/skills/prompting/SKILL.md          |
| life-management    | life-coach  | .claude/skills/life-management/SKILL.md    |
| first-principles   | life-coach  | .claude/skills/first-principles/SKILL.md   |

---

**Version:** 2.0.0
**Last Updated:** 2026-03-06
**Total:** 3 agents · 12 skill assignments (10 unique skills)
