---
title: PAL System Philosophy & Core Concepts
version: 1.0.0
layer: SYSTEM
purpose: Narrative overview, principles, and philosophy of the PAL Second Brain
last_updated: 2026-03-17
---

## PAL's Core Statement

> "PAL Second Brain is a pattern-based system that gives non-technical professionals the base and blocks to build AI automations and workflows through organized context engineering and modular design."

---

## The 8 Core Principles

PAL's second brain architecture is built on 8 foundational principles:

### 1. Context > Prompts
**Principle:** Context engineering beats prompt engineering.
**What This Means:**
- Base configuration files provide a persistent context for the system behaviour.
- Organizing context in an editable and navigable way provides more control over system responses.
- Skills and agents inherit context from specific knowledge domains.

### 2. Token & Cost Efficiency
**Principle:** Strategic resource management is a core constraint of system design.
**What This Means:**
- The system seeks to be optimized for Token Efficiency to remain cost-effective.
- Context efficiency optimization ensures minimum waste in operations.
- Every function addition is weighed against the cost of the underlying services.

### 3. Pattern-Based JTBD
**Principle:** Patterns are the "How" that achieve the "Job-to-be-Done".
**What This Means:**
- Patterns are modular structures (chunks of code, workflows, or skills) that define operation best practices.
- JTBD is the framework how functions are structured and presented.
- Patterns dictate best practices for the ingestion, management, and execution of operations.

### 4. Domain-Driven Documentation
**Principle:** Accessibility via a non-technical UI over traditional IDEs.
**What This Means:**
- Obsidian serves as the primary action interface for the Second Brain, replacing the complexity of terminals.
- This enables non-technical users to build and manage their own agentic systems.
- The UI focuses on navigable knowledge domains where data is structured and relevant.

### 5. Self Update System
**Principle:** The system can evolve and improve itself.
**What This Means:**
- Updates are modular and self-contained to specific areas of the system.
- Skills can be added or modified without a system rebuild.
- Pattern Library expands with new operation templates.

### 6. PAL Master with Specialized Sub-Agents
**Principle:** Primary orchestrator with domain-specific agents for focused work.
**What This Means:**
- **PAL Master:** Primary agent, handles routing and orchestration.
- **Domain Agents:** Specialized agents loaded via `/[agent]` commands. They inherit Base context + domain skills + workflows.

### 7. Inbox-First Capture
**Principle:** The Inbox is the primary friction-free entry point for all raw data.
**What This Means:**
- Notes, resources, and tasks are initially funneled into a single central location.
- Rapid capture is prioritized over immediate organization to maintain creative flow.
- Items are periodically distributed from the Inbox to their specific Domains.

### 8. Spec-Driven Development
**Principle:** System evolution is governed by persistent, accessible requirements.
**What This Means:**
- Requirements and logic for the Second Brain are always available for reference.
- New features follow a formal specification process.
- Self-referencing requirements ensure a structured order for all future changes.

---

## Intent-Based Routing (Not Keyword Matching)

PAL Master uses **conceptual matching**, not keyword search, to route user intent.

### How Conceptual Matching Works
1. User intent → PAL Master analyzes semantic meaning
2. Compares to capability descriptions (`USE WHEN` clauses)
3. Finds best conceptual match and routes to capability

**Example:**
*User: "I want to create an architecture diagram for my system"*
- **Keyword matching:** Might search for "architecture" or "diagram" and fail to find a skill named "Art".
- **Conceptual matching:** Analyzes intent (visual representation), matches Art skill's `USE WHEN` ("User wants visualizations"), and routes to the Art skill.

---

## When to Use Agents vs Skills

| Aspect         | Skill Activation (via PAL Master) | Agent Loading (`/[agent]`)                   |
| -------------- | --------------------------------- | -------------------------------------------- |
| **Duration**   | One-off task                      | Extended session (multiple tasks)            |
| **Invocation** | Automatic (intent-based)          | Manual (user command: `/[agent]`)       |
| **Context**    | PAL Master + skill                | Two groups (Base + Domain)                   |
| **Focus**      | General orchestration             | Domain-specific specialization               |

---

## Plan-Before-Execute Principle

Presents execution plans for user approval before complex operations.

- **ALWAYS:** Multi-file changes (3+), destructive ops, security-sensitive, architectural changes.
- **SOMETIMES:** Significant single-file changes, external systems, complex logic, user preference.
- **NEVER:** Trivial ops (typos, formatting), read-only ops.

---

## Agent Delegation Protocol

The `*delegate` command allows the current active agent to suspend its session, spin up a sub-agent to handle a specific request, and automatically resume once the sub-agent is finished. This enforces domain boundaries without losing flow.

1. Agent acknowledges delegation.
2. Context is written to `.claude/sessions/.handoff_context.md`.
3. User loads target agent.
4. Target agent checks handoff file, executes task, deletes handoff file.
5. Target agent suggests `*dismiss` to return.
