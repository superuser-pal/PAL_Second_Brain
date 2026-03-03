# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0-beta] - 2026-02-16

### Added

#### Skills (8 total, 40 workflows)

**System Building:**

- **create-agent** (3 workflows) — Create, validate, and adapt domain agents
- **create-domain** (4 workflows) — Create, validate, map, and archive project workspaces
- **create-skill** (4 workflows) — Create, validate, update, and canonicalize PAL skills

**Knowledge Management:**

- **life-management** (3 workflows) — Update, extract, and export personal life context (mission, beliefs, goals, lessons)
- **note-taking** (5 workflows) — Braindump, process inbox, distribute notes, ingest longform, URL dump
- **project-management** (5 workflows) — Create projects, pull tasks, update plans, dashboard, archive

**Development:**

- **system-build** (11 workflows) — Specification-driven development: specify, plan, tasks, implement, checklist, clarify, analyze, constitution, document, document_skill, tasks_to_issues
- **system-cleaner** (5 workflows) — System auditing: audit_references, audit_domains, audit_naming, audit_orphans, health_report

#### Agents (3 total)

- **PAL Master** — Primary orchestration agent for intent classification, routing, and execution oversight
- **PAL Builder** — System architect for PAL development (domain: PALBuilder)
- **Life Coach** — Personal life management agent (domain: LifeOS)

#### Domains (2 total)

- **PALBuilder** — PAL system development workspace
- **LifeOS** — Personal life management (mission, beliefs, goals, projects, mental models, lessons)

#### Hooks (3 total)

- **SessionStart** — Loads base context (USER + SYSTEM + SECURITY files) at session initialization
- **PreToolUse** — Validates operations against GUARDRAILS.md before execution (block/warn/allow)
- **Stop** — Sends notifications, saves transcript, logs summary at session end

#### Architecture

- **Three-layer structure** — USER (identity) → SYSTEM (operations) → SECURITY (guardrails)
- **8 core principles** — Context over prompts, token & cost efficiency, domain-driven documentation, and more
- **Zero Trust context loading** — Only necessary context loaded to prevent token waste
- **Domain-driven documentation** — Siloed project workspaces with standard folder structure

### Documentation

- **README.md** — Project overview with quick start and feature summary
- **CHANGELOG.md** — Version history (this file)
- **ONBOARDING.md** — Getting started guide with Obsidian setup
- **Docs/SETUP.md** — Detailed installation and configuration instructions
- **Docs/FEATURES.md** — Complete feature catalog with all skills, agents, hooks, and domains

### Notes

This is an **Beta release**. APIs, file structures, and conventions may change in future versions.

**Known Limitations:**

- Only tested with macOS
- Session logs are not being registered correctly
- Bun as a sole dependency (runtime toolkit)

---

## Future Releases

Planned for future versions:

- Stable improvements over core journeys
- Enhanced hook capabilities
- Cross-domain workflow coordination
- Additional AI models support
