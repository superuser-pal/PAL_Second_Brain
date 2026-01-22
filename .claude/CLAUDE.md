---
name: PAL Framework
description: PAL Framework entry point. Loads core directives and delegates to pal-master.
---

# PAL Framework

> "PAL is a pattern-based modular system that empowers non-technical professionals to architect AI systems through organized context engineering, reusable modular blocks, and guided documentation on best practices for ingestion, output and interface visualization.

**PAL IS:** Transparent framework, tutorial-driven documentation, modular growth platform

**Architecture Highlights:**

- **Three-layer structure**: USER → SYSTEM → SECURITY
- **10 core principles** guiding design decisions
- **Modular composition** through skills, workflows, agents and prompt templates (patterns)

For full architecture details, see: `PAL_Base/System/ARCHITECTURE.md`

---

## First-Person Voice (CRITICAL)

Your AI should speak as itself, not about itself in third person. This first-person voice constraint applies to ALL agents within the PAL Framework.

**Correct:**

- "for my system" / "in my architecture"
- "I can help" / "my delegation patterns"
- "we built this together"

**Wrong:**

- "for [Agent Name]" / "for the system"
- "the system can" (when meaning "I can")

---

## Technical Stack Preferences

**Technical Level:** Intermediate
**Programmer:** Learning

**Platform:**

- OS: macOS
- Runtime: bun
- Package Manager: bun

**Languages (in order of preference):**

1. TypeScript

**Infrastructure:**

- Cloudflare: Yes
- Backend: Cloudflare Workers
- Database: PostgreSQL

---

## Stack Rules

Based on your preferences, always follow these rules:

- **Package Manager:** Use bun (NEVER npm/yarn/pnpm)
- **Runtime:** Use bun as the default JavaScript runtime
- **Deployment:** Default to Cloudflare Workers for serverless functions
- **Backend:** Prefer Cloudflare Workers for backend infrastructure
- **Database:** Default to PostgreSQL for data storage
- **Markdown:** Use markdown for all documentation. NEVER use HTML for basic content.

---

## Domain Workspace Structure

All project-specific work must reside within the `/Domains/` directory. Each domain must follow this standardized tree to ensure predictable context loading.

**Root Folder:** `/Domains/[domain-name]/`
**Nesting Limit:** Do not exceed three vertical levels below the domain root. Flatten deeper structures using semantic naming.

**Core Folders:**

- `00_CONTEXT/`: Contains `INDEX.md` (Source of Truth) and `CONNECTIONS.yaml` (Inheritance rules).
- `01_PLANS/`: All active `PLAN_XXX.md` files for the Planning Pattern.
- `02_SESSIONS/`: Chronological interaction logs and decision summaries.
- `03_ASSETS/`: Raw documentation, data, and reference materials.
- `05_ARCHIVE/`: Stale plans or old logs moved here via the Deprecation Pattern.

---

## File Naming Conventions

Strict naming allows the AI to distinguish between system logic, active work, and historical logs without opening files.

| Category             | Convention            | Example              | Purpose                            |
| :------------------- | :-------------------- | :------------------- | :--------------------------------- |
| **System Protocols** | `UPPER_SNAKE_CASE.md` | `DIRECTIVES.md`      | Core rules in `.claude/base/`.     |
| **Folders**          | `lower-kebab-case`    | `project-alpha/`     | Standard IDE navigation.           |
| **Logs & Sessions**  | `YYYY-MM-DD_title.md` | `2026-01-15_Sync.md` | Chronological sorting and recency. |
| **Active Work**      | `lower_snake_case.md` | `research_notes.md`  | Standard domain-level files.       |

---

---

## Context Management (CRITICAL)

**Strictly limit context loading.** Do NOT load any files, logs, or context unless explicitly:

1. Requested by the User.
2. Defined in the Agent's specific requirements.
3. Directed by the PAL Master.

**Goal:** Zero unnecessary token usage. Assume a "Zero Trust" approach to context—verify relevance before reading.

---

## Response Format

**IMPORTANT:** Use this format for all task-based responses unless otherwise specified in each agent configuration.

```
📋 SUMMARY: [One sentence]
🔍 ANALYSIS: [Key findings]
⚡ ACTIONS: [Steps taken]
✅ RESULTS: [Outcomes]
➡️ NEXT: [Recommended next steps]

```

---

**Document Version:** 1.1.0
**Last Updated:** 2026-01-15
