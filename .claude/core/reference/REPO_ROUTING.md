---
title: Repository Routing Manifest
version: 1.0.0
layer: SYSTEM
purpose: Complete inventory of .claude/ contents with personal vs open-source classification
last_updated: 2026-02-27
---

# Repository Routing

## Destination Paths

| Destination     | Base Path                | GitHub Remote                 |
| --------------- | ------------------------ | ----------------------------- |
| **Personal**    | `/` (root)               | private repo                  |
| **Open Source** | `Domains/PALOpenSource/` | `superuser-pal/PAL_Framework` |

---

## Complete .claude/ Inventory

### agents/

| Name                   | Destination | Notes                    |
| ---------------------- | ----------- | ------------------------ |
| pal-master.md          | open-source | Core orchestrator        |
| pal-builder.md         | open-source | System development       |
| life-coach.md          | open-source | Life management template |
| studio-agent.md        | personal    | Video/presentation work  |
| substack-manager.md    | personal    | LaraLou blog management  |
| pal-release-manager.md | personal    | Release workflow         |
| product-manager.md     | personal    | PAL product strategy     |

### skills/

| Name                      | Destination | Notes                                   |
| ------------------------- | ----------- | --------------------------------------- |
| art/                      | open-source | Visual content                          |
| create-skill/             | open-source | Skill creation                          |
| create-agent/             | open-source | Agent creation                          |
| create-domain/            | open-source | Domain creation                         |
| first-principles/         | open-source | Analysis framework                      |
| life-management/          | open-source | Life context                            |
| note-taking/              | open-source | Note workflows                          |
| project-management/       | open-source | Task/project tracking                   |
| system-build/             | personal    | PAL development (has personal features) |
| system-cleaner/           | personal    | Personal housekeeping                   |
| prompting/                | personal    | Meta-prompting                          |
| prd-development/          | personal    | PRD workflows                           |
| product-strategy-session/ | personal    | Strategy facilitation                   |
| roadmap-planning/         | personal    | Roadmap workflows                       |
| release-management/       | personal    | Release workflows                       |

### commands/

| Directory | Name                | Destination | Notes                   |
| --------- | ------------------- | ----------- | ----------------------- |
| action/   | braindump.md        | open-source | Note capture            |
| action/   | create-project.md   | open-source | Project creation        |
| action/   | distribute-notes.md | open-source | Note distribution       |
| action/   | ingest-longform.md  | open-source | Document ingestion      |
| action/   | process-inbox.md    | open-source | Inbox processing        |
| action/   | update-plan.md      | open-source | Plan updates            |
| action/   | url-dump.md         | open-source | URL capture             |
| agent/    | \*.md               | varies      | Match agent destination |
| sessions/ | \*.md               | open-source | Session management      |

### base/

| Directory  | Content                           | Destination | Notes             |
| ---------- | --------------------------------- | ----------- | ----------------- |
| user/      | ABOUTME, DIRECTIVES, etc.         | personal    | Always personal   |
| system/    | ARCHITECTURE, ORCHESTRATION, etc. | open-source | Framework logic   |
| security/  | GUARDRAILS, REPOS_RULES           | open-source | Security policies |
| reference/ | ROUTING_TABLE, SYSTEM_INDEX       | open-source | System maps       |
| reference/ | REPO_ROUTING.md                   | personal    | This file (meta)  |

### tools/

| Directory    | Content            | Destination | Notes                  |
| ------------ | ------------------ | ----------- | ---------------------- |
| hooks/       | session-start.ts   | open-source | Core hook              |
| hooks/       | pre-tool-use.ts    | open-source | Security hook          |
| hooks/       | post-tool-use.ts   | open-source | Schema validation hook |
| hooks/       | stop.ts            | open-source | Session end            |
| maintanance/ | claude-code-proxy/ | personal    | Dev tooling            |

### Other .claude/ Files

| File                | Destination | Notes                         |
| ------------------- | ----------- | ----------------------------- |
| CLAUDE.md           | open-source | Entry point (generic version) |
| settings.json       | open-source | Default settings              |
| settings.local.json | personal    | Local overrides               |
| mcp/servers.json    | personal    | MCP config                    |
| sessions/\*.md      | personal    | Session logs                  |

---

## Domains/ Routing

| Domain      | Destination | Notes                    |
| ----------- | ----------- | ------------------------ |
| PALBuilder/ | open-source | System dev template      |
| LifeOS/     | open-source | Life management template |
| LaraLou/    | personal    | Blog project             |
| PALProduct/ | personal    | Product strategy         |
| Studio/     | personal    | Media production         |

---

## Routing Decision Guide

When creating new artifacts:

| Question               | → Personal | → Open Source |
| ---------------------- | ---------- | ------------- |
| Contains private data? | Yes        | No            |
| Project-specific?      | Yes        | No            |
| Reusable by others?    | No         | Yes           |
| Framework improvement? | No         | Yes           |
| Experimental/WIP?      | Yes        | No            |
