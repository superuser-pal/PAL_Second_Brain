---
title: PAL System Index
version: 3.1.0
layer: SYSTEM
purpose: Writable registry of all agents and their skill assignments
last_updated: 2026-03-12
---

# System Index

> **This file is the writable capability registry.** To assign a skill to an agent, add a row to the Skills Registry table. To remove, delete the row. Skills can appear on multiple rows (one per agent assignment).

> **Source of truth:** This file is the authoritative record of which skills belong to which agents. Skill definitions (USE WHEN, workflows) live in each skill's `SKILL.md`.

## Agents

| Agent               | Domain         | Location                              |
| ------------------- | -------------- | ------------------------------------- |
| pal-master          | none           | .claude/agents/pal-master.md          |
| pal-builder         | PALBuilder     | .claude/agents/pal-builder.md         |
| product-manager     | PALProduct     | .claude/agents/product-manager.md     |
| life-coach          | LifeOS         | .claude/agents/life-coach.md          |
| studio-agent        | Studio         | .claude/agents/studio-agent.md        |
| substack-manager    | LaraLou        | .claude/agents/substack-manager.md    |
| pal-release-manager | PALOpenSource  | .claude/agents/pal-release-manager.md |

## Skills Registry

| Skill                    | Agent               | Routes To                                                                                           | Location                                           |
| ------------------------ | ------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| create-agent             | pal-master          | create agent, new agent, agent structure, validate agent, check agent                               | .claude/skills/create-agent/SKILL.md               |
| create-domain            | pal-master          | create domain, new domain, domain structure, validate domain, project workspace                     | .claude/skills/create-domain/SKILL.md              |
| system-cleaner           | pal-master          | audit system, check references, validate naming, find orphans, system health                        | .claude/skills/system-cleaner/SKILL.md             |
| note-taking              | pal-master          | process notes, organize notes, distribute notes, braindump, capture thoughts, url dump, save link   | .claude/skills/note-taking/SKILL.md                |
| project-management       | pal-master          | create project, sync tasks, update plan, project status, task dashboard                             | .claude/skills/project-management/SKILL.md         |
| system-build             | pal-builder         | create spec, specification, implementation plan, generate tasks, task breakdown, system build        | .claude/skills/system-build/SKILL.md               |
| create-skill             | pal-builder         | create skill, new skill, skill structure, canonicalize                                              | .claude/skills/create-skill/SKILL.md               |
| create-agent             | pal-builder         | create agent, new agent, agent structure, validate agent                                            | .claude/skills/create-agent/SKILL.md               |
| create-domain            | pal-builder         | create domain, new domain, domain structure, validate domain                                        | .claude/skills/create-domain/SKILL.md              |
| prompting                | pal-builder         | meta-prompting, template generation, prompt optimization, programmatic prompt composition            | .claude/skills/prompting/SKILL.md                  |
| note-taking              | pal-builder         | process notes, braindump, technical notes, build logs, component documentation                      | .claude/skills/note-taking/SKILL.md                |
| project-management       | pal-builder         | create project, sync tasks, update plan, project status, task dashboard                             | .claude/skills/project-management/SKILL.md         |
| project-management       | product-manager     | create project, sync tasks, update plan, project status, task dashboard                             | .claude/skills/project-management/SKILL.md         |
| note-taking              | product-manager     | process notes, braindump, capture feedback, user research notes                                     | .claude/skills/note-taking/SKILL.md                |
| first-principles         | product-manager     | first principles, fundamental analysis, root cause, decompose                                       | .claude/skills/first-principles/SKILL.md           |
| prd-development          | product-manager     | PRD, product requirements document, product spec, feature spec, write PRD                           | .claude/skills/prd-development/SKILL.md            |
| product-strategy-session | product-manager     | product strategy, strategy session, positioning workshop, competitive analysis                       | .claude/skills/product-strategy-session/SKILL.md   |
| roadmap-planning         | product-manager     | roadmap, roadmap planning, quarterly planning, initiative prioritization, RICE scoring               | .claude/skills/roadmap-planning/SKILL.md           |
| project-management       | life-coach          | life projects, goal alignment, habit tracking, routine management                                   | .claude/skills/project-management/SKILL.md         |
| note-taking              | life-coach          | update beliefs, add goal, life mission, add lesson, mental models, export life summary              | .claude/skills/note-taking/SKILL.md                |
| first-principles         | life-coach          | first principles, fundamental analysis, root cause, decompose                                       | .claude/skills/first-principles/SKILL.md           |
| art                      | studio-agent        | diagrams, visualizations, comics, editorial illustrations, Excalidraw                               | .claude/skills/art/SKILL.md                        |
| note-taking              | studio-agent        | visual notes, design feedback, asset metadata, creative sparks                                      | .claude/skills/note-taking/SKILL.md                |
| project-management       | studio-agent        | gallery management, asset pipeline, creative projects, production schedule                          | .claude/skills/project-management/SKILL.md         |
| note-taking              | substack-manager    | newsletter drafts, subscriber feedback, content ideas, editorial notes                              | .claude/skills/note-taking/SKILL.md                |
| project-management       | substack-manager    | editorial calendar, publication schedule, growth initiatives, campaign management                   | .claude/skills/project-management/SKILL.md         |
| release-management       | pal-release-manager | prepare release, sync changes, update changelog, create version, validate release, diff repos       | .claude/skills/release-management/SKILL.md         |
| note-taking              | pal-release-manager | release notes, changelog draft, validation logs, audit notes                                        | .claude/skills/note-taking/SKILL.md                |
| project-management       | pal-release-manager | release cycle, milestone tracking, version roadmap, sync schedule                                   | .claude/skills/project-management/SKILL.md         |
| system-cleaner           | pal-release-manager | audit system, check references, validate naming, pre-release audit                                  | .claude/skills/system-cleaner/SKILL.md             |

---

## Reference Files

| File | Purpose |
|------|---------|
| `DOMAINS_REGISTRY.md` | Single source of truth for all domain definitions, routing signals, and detection patterns |
| `ROUTING_TABLE.md` | Agent routing decisions |
| `REPO_ROUTING.md` | Personal vs open source routing rules |

---

**Version:** 3.1.0
**Last Updated:** 2026-03-16
**Total:** 7 agents · 31 skill assignments (14 unique skills)
