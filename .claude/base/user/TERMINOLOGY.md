# TERMINOLOGY.md

**PAL User Layer - Terminology & System Logic**

---

## Purpose

Your canonical definitions and system logic. Your AI uses this to understand your terminology, remember key concepts, and track important reminders.

---

## PAL Terminology

### Base

Your personal configuration layer. Contains ABOUTME.md, DIRECTIVES.md, DIGITALASSETS.md, CONTACTS.md, TECHSTACK.md, and this file (TERMINOLOGY.md).

### Framework Master

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

## Custom Definitions

Add your own terms, acronyms, or concepts that need consistent definition:

### [Term]

**Definition:** `[Your definition]`

**Context:** `[When/how this term is used]`

### [Acronym]

**Full Name:** `[Expansion]`

**Meaning:** `[What it means in your context]`

---

## Recurring Reminders

### Active

Date-based reminders your AI checks at session start:

#### YYYY-MM-DD - [Reminder Title]

**Context:** `[Describe the reminder context]`

**Next:** `[Next action needed]`

### Completed

Move finished reminders here with resolution:

#### [Completed YYYY-MM-DD] [Title]

**Resolution:** `[What was done]`

---

## Project Dependencies

### Current Blockers

| Project   | Blocked By           | Status   | Notes     |
| --------- | -------------------- | -------- | --------- |
| [Project] | [What's blocking it] | [Status] | [Details] |

### Waiting On

| Item   | Waiting For | Since      | Follow-up Date |
| ------ | ----------- | ---------- | -------------- |
| [Item] | [Who/what]  | YYYY-MM-DD | YYYY-MM-DD     |

---

## Operating Rules

### Date Awareness

**Current Date:** Your AI knows today's date and can check if reminders are due.

### Permission to Fail

Your AI has explicit permission to say "I don't know" when information isn't available. Honesty over fabrication.

### Core Principles

Add your key operating principles:

- `[Principle 1]`
- `[Principle 2]`
- `[Principle 3]`

---

**Instructions:** Fill in with your terminology, reminders, and dependencies. Your AI uses this as the "source of truth" for your system's logic.
