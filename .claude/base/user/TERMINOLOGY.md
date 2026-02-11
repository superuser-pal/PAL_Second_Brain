---
name: user-terminology
description: PAL User Layer - Terminology & System Logic for definitions, reminders, and project dependencies
version: 1.0.0
---

## Purpose

Your canonical definitions and system logic. Your AI uses this to understand your terminology, remember key concepts, and track important reminders.

---

## PAL Second Brain Terminology

### Base

Your personal configuration layer. Contains ABOUTME.md, DIRECTIVES.md, DIGITALASSETS.md, CONTACTS.md, TECHSTACK.md, and this file (TERMINOLOGY.md).

### PAL Master

The AI that orchestrates your entire system. It's your guide, teacher, and assistant rolled into one.

### Pattern Library

A collection of reusable templates for common tasks. Patterns compose to build complex workflows from simple building blocks.

### Hook

An automatic action that runs when a specific event occurs. Think of it like "if this happens, then do that" rules.

**Example hooks:**

- SessionStart - Loads your Base configuration
- PreToolUse - Validates operations before execution
- Stop - Runs cleanup when session ends

### Agent

A specialized AI subprocess with specific capabilities (Explore, Plan, Bash, general-purpose). Agents handle complex multi-step tasks autonomously.

### Skill

A modular capability with workflows and tools. Lives in `.claude/skills/[SkillName]/`.

**Example skills:**

- CORE - Your identity and system configuration
- Art - Visual content generation
- Prompting - Meta-prompting system

---

## Data Folders

### Domains

Project workspaces for organizing project-specific work, documentation, and context. Each domain is a siloed environment containing its own INDEX.md (source of truth), projects, sessions, and assets.

**Location:** `domains/[domain-name]/`

**Standard Structure:**
- `INDEX.md` - Source of Truth (domain overview, current state, key facts)
- `CONNECTIONS.yaml` - External sources and inheritance rules
- `00_CONTEXT/` - Domain-specific background and reference docs
- `01_PROJECTS/` - Active project files (PROJECT_*.md format)
- `02_SESSIONS/` - Chronological interaction logs
- `03_ASSETS/` - Reference materials and processed notes
- `04_OUTPUTS/` - Generated deliverables
- `05_ARCHIVE/` - Deprecated content

### Inbox

Temporary holding area for unprocessed notes. Notes here are raw captures waiting to be organized with frontmatter and distributed to domains.

**Location:** `inbox/notes/`

**Note Lifecycle:**
1. Note created in `inbox/notes/` (status: unprocessed)
2. Run `process_inbox` to add YAML frontmatter (status: ready)
3. Run `distribute_notes` to move to domain (status: processed)

### Ports

Input/output interface for external documents. Acts as a staging area for file ingestion and export.

**Structure:**
- `ports/In/` - Drop zone for documents to ingest (PDF, DOCX, TXT)
- `ports/transit/` - Temporary holding for processed originals (review before deletion)

**Workflow:** Drop files in `ports/In/` → Run `ingest_longform` → Converted notes appear in `inbox/notes/` → Originals moved to `ports/transit/`

### Tasks

Centralized task management folder for aggregated task lists across all domains.

**Location:** `/tasks/`

**Key File:**
- `MASTER.md` - Aggregated task list pulled from all PROJECT_*.md files across domains

**Task Sync:**
- `pull_tasks` - Scans all projects, aggregates open/in-progress tasks to MASTER.md
- `update_plan` - Pushes changes from MASTER.md back to source project files

---

## Note Management Concepts

### Frontmatter

YAML metadata block at the top of markdown files. Used to track status, domain assignment, category, and source information.

**Status Values:**
- `unprocessed` - Needs domain/project assignment
- `ready` - Ready for distribution to domain
- `processed` - Distributed to domain 03_ASSETS/
- `archived` - Moved to 05_ARCHIVE/

**Categories:**
- `research` - Research notes, findings, analysis
- `meeting` - Meeting notes, action items
- `idea` - Ideas, brainstorming, concepts
- `reference` - Reference materials, documentation
- `notes` - General notes (default)

### Task Tags

Status markers for tasks in project files. Used for filtering and aggregation.

- `#open` - Task not started
- `#in-progress` - Task actively being worked on
- `#done` - Task completed

---

## System Concepts

### Context Engineering

The practice of curating and maintaining the optimal set of information during AI interactions. Goal: smallest possible set of high-signal information.

### Progressive Disclosure

Layered information architecture - load only what's needed, when it's needed:

1. Base files (always loaded)
2. Skills (loaded on demand)
3. Workflows (loaded when needed)
4. Tools (executed when required)

### Event Automation

Using hooks to automate system behavior without manual intervention. SessionStart loads context, PreToolUse validates security, Stop logs activity.

---
