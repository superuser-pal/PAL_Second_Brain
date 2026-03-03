---
title: "02 - Core Concepts"
description: "The interaction loop, context management, plan mode, and mental model"
tags: [guide, concepts, context, reference]
series: PAL Second Brain Documentation
order: 2
---

# 02 — Core Concepts

> Part of the [PAL Second Brain](https://github.com/yourusername/pal-second-brain) documentation series.

---

## Table of Contents

1. [The Interaction Loop](#the-interaction-loop)
2. [Context Management](#context-management)
3. [Plan Mode](#plan-mode)
4. [Memory Systems](#memory-systems)
5. [Mental Model](#mental-model)

---

## The Interaction Loop

Every Claude Code interaction follows this pattern:

```
1. DESCRIBE  →  You explain what you need
      ↓
2. ANALYZE   →  Claude explores your files and context
      ↓
3. PROPOSE   →  Claude suggests changes
      ↓
4. REVIEW    →  You read and evaluate
      ↓
5. DECIDE    →  Accept / Reject / Modify
      ↓
6. VERIFY    →  Check the results
```

The loop is designed so that **you remain in control**. Claude proposes, you decide.

### Example: Processing Inbox Notes

```
You: Process the notes in my inbox and add frontmatter to each one.

Claude: [Reads Inbox/Notes/, analyzes each file]
        [Proposes frontmatter additions with categories]

You: [Review the proposed frontmatter — accept or adjust]

You: Now distribute them to the correct domains.

Claude: [Reads domain INDEX.md files for context]
        [Proposes moving each note to the matching domain]
```

---

## Context Management

This is the most important concept in Claude Code.

### What is Context?

Context is Claude's "working memory" for your conversation. It includes all messages, files read, command outputs, and tool results. Think of it like RAM — when it fills up, quality degrades.

### Reading the Statusline

```
Claude Code | Ctx(u): 45% | Cost: $0.23 | Session: 1h 23m
```

Watch `Ctx(u):` — this is your context usage percentage.

### Context Zones

| Zone | Usage | Action |
|------|-------|--------|
| Green | 0-50% | Work freely |
| Yellow | 50-75% | Be selective about what you load |
| Red | 75-90% | Use `/compact` now |
| Critical | 90%+ | `/clear` required |

### Recovery Strategies

**`/compact`** — Summarizes the conversation, preserves key context, reduces usage by ~50%. Use when you want to keep working on the same topic.

**`/clear`** — Starts completely fresh, loses all context. Use when switching to a different topic.

**Targeted approach** — Be specific in queries. Instead of "read my whole project," ask about specific files or folders.

### What Consumes Context?

| Action | Context Cost |
|--------|-------------|
| Reading a small file | Low (~500 tokens) |
| Reading a large file | High (~5K+ tokens) |
| Running commands | Medium (~1K tokens) |
| Long conversations | Accumulates over time |

### Context Depletion Symptoms

| Symptom | Action |
|---------|--------|
| Shorter responses than usual | Continue with caution |
| Forgetting earlier instructions | Prepare to `/compact` |
| Inconsistencies with earlier conversation | New session needed |
| Errors on files already discussed | New session immediately |

### Pre-Compact Checklist

Before running `/compact`:

1. Note your current task explicitly ("We're organizing inbox notes")
2. Save any important decisions to a file
3. Commit pending changes to git (creates a restore point)
4. Run `/compact`

---

## Plan Mode

Plan Mode lets Claude read and analyze without making any changes. This is your safe exploration mode.

### When to Use Plan Mode

- Understanding an unfamiliar domain before making changes
- Exploring different approaches to a task
- Reviewing project structure and content
- Any time you want to look before you leap

### How to Use It

```
/plan                    → Enter Plan Mode (read-only)
/execute                 → Exit Plan Mode (changes allowed)
Shift+Tab                → Cycle between permission modes
```

### Example

```
/plan
You: What's the current state of my PALBuilder domain? What projects are active?

Claude: [Reads INDEX.md, scans 01_PROJECTS/, summarizes state]
        [No files modified — safe exploration]

/execute
You: Update the INDEX.md with the current project status you just described.

Claude: [Now makes the edit]
```

---

## Memory Systems

Claude Code has two distinct memory systems:

| Aspect | Session Memory | Persistent Memory |
|--------|---------------|-------------------|
| **Scope** | Current conversation only | Across all sessions |
| **Managed by** | `/compact`, `/clear` | CLAUDE.md files, memory directory |
| **Lost when** | Session ends or `/clear` | Explicitly deleted |
| **Use for** | Immediate working context | Long-term decisions and patterns |

### Session Memory

Everything in your current conversation — files read, decisions made, commands run. Managed with `/compact` (compress) and `/clear` (reset). Disappears when you close Claude Code.

### Persistent Memory

Information that survives across sessions:

- **CLAUDE.md** — Project conventions and instructions, loaded every session
- **Auto-memories** — Claude automatically captures patterns in `~/.claude/` memory directory
- **Domain INDEX.md files** — Each domain's source of truth, loaded when the domain agent activates

### Pattern: End-of-Session Save

```
Before ending a productive session:

"Save our decision about the project structure:
- Chose to split the product domain into two sub-domains
- Customer research goes in PALProduct
- Technical specs stay in PALBuilder"

Claude writes this to the appropriate INDEX.md or memory file.
```

---

## Mental Model

Think of Claude Code as an **expert assistant** with access to your filing system:

- It can read any file you point it to
- It can organize, edit, and create files
- It remembers everything within a session but starts fresh next time (unless you use persistent memory)
- It works best with clear, specific instructions
- It follows the patterns and rules you define in CLAUDE.md

**Claude is not**:
- A search engine (it works with your local files, not the web)
- Omniscient (it only knows what it reads in the current session)
- Infallible (always review changes before accepting)

### The Key Insight

The better your context is organized (domains, INDEX.md files, structured folders), the better Claude performs. PAL's entire architecture exists to give Claude — and you — well-organized, relevant context.

---

## How PAL Uses This

Everything in this section maps directly to PAL:

- **Interaction loop**: PAL's skills and workflows follow the describe-analyze-propose-review cycle
- **Context management**: PAL's `session-start` hook loads only relevant context to keep token usage efficient
- **Plan mode**: PAL's spec-driven development encourages planning before execution
- **Persistent memory**: PAL uses domain INDEX.md files, ABOUTME.md, and DIRECTIVES.md as persistent context that loads automatically

---

**Previous:** [01 — Getting Started](./01-getting-started.md) | **Next:** [03 — PAL Second Brain](./03-pal-second-brain.md)
