---
name: user-terminology
description: PAL User Layer - Terminology & System Logic for definitions, reminders, and project dependencies
version: 1.0.0
---

## Purpose

Your canonical definitions and system logic. Your AI uses this to understand your terminology, remember key concepts, and track important reminders.

---

## PAL Framework Terminology

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
