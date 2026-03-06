---
title: "06 - Choosing Your Adoption Approach"
description: "Starting points for adopting Claude Code and PAL based on your context and needs"
tags: [guide, config, workflows]
series: PAL Second Brain Documentation
order: 6
---

# 06 — Choosing Your Adoption Approach

> Part of the [PAL Second Brain](https://github.com/yourusername/pal-second-brain) documentation series.

---

## What We Do Know

Some patterns have emerged from practitioner experience:

| Finding | Implication |
|---------|-------------|
| **Scope matters most** | Start small, expand gradually |
| **CLAUDE.md sweet spot is 4-8KB** | Concise instructions beat comprehensive ones |
| **Sessions degrade after 15-25 turns** | Reset for new tasks |
| **Exploration before action** | Ask for alternatives first |

---

## Starting Points

| Your Context | Approach |
|--------------|----------|
| Limited setup time | **Turnkey** — minimal config, iterate based on friction |
| Solo user | **Autonomous** — learn concepts first, configure when needed |
| Small team | **Hybrid** — shared basics + room for personal preferences |

---

## Decision Tree

```
Starting with PAL?
│
├─ Need to be productive today?
│   └─ YES → Turnkey Quickstart
│   └─ NO ↓
│
├─ Want to understand before configuring?
│   └─ YES → Autonomous Learning Path
│   └─ NO → Turnkey, adjust as you go
```

---

## Turnkey Quickstart

### Step 1: Run Setup

```bash
cd your-pal-project
claude
```

Then run:

```
/setup-context
```

This walks you through creating your ABOUTME.md and DIRECTIVES.md — the personal context that PAL loads every session.

### Step 2: Verify Setup

Ask Claude:

```
What's my name and what are my preferences?
```

**Pass**: Returns your configured identity and preferences.
**Fail**: Context not loaded — check that `.claude/core/user/ABOUTME.md` exists.

### Step 3: First Real Task

```
I want to capture some thoughts about my new project idea.
```

PAL should activate the note-taking skill and guide you through a braindump workflow.

**Done.** Add more config only when you hit friction.

---

## Autonomous Learning Path

If you prefer understanding before configuring:

### Phase 1: Mental Model

**Goal**: Understand how Claude Code operates before adding config.

1. Read [02 — Core Concepts](./02-core-concepts.md)
2. Core concept: Claude works in a loop — describe > analyze > propose > review
3. **Try it**: Complete a few real tasks with zero config. Notice where friction appears.

### Phase 2: Context Management

**Goal**: Understand the main constraint of the tool.

1. Read [Context Management](./02-core-concepts.md#context-management)
2. Watch `Ctx(u):` in the statusline. `/compact` when it gets high.
3. **Try it**: Check `/status` periodically. See how your usage patterns develop.

### Phase 3: Persistent Context

**Goal**: Give Claude knowledge about you and your projects.

1. Run `/setup-context` to create your personal identity files
2. Create domain INDEX.md files for your main projects
3. **Try it**: Load an agent, see if it knows your context automatically.

### Phase 4: Extensions (when friction appears)

Add complexity only when you hit real problems:

| Friction | Possible Solution |
|----------|-------------------|
| Repeating same task often | Create a skill or workflow |
| Need specialized help | Create a domain agent |
| Security concern | Configure hooks |
| AI repeats same mistake | Add a specific rule to CLAUDE.md |

---

## Sanity Checks

### Basic Setup Works

```bash
claude --version          # Responds with version
```

If this fails: installation issue — try `claude doctor`.

### Config Is Being Read

**Test**: Ask Claude "What's my name?"

If it returns your name from ABOUTME.md, context is loaded. If not, check the session-start hook.

### You're Managing Context

**Signal**: You've noticed when context gets high and acted on it.

This develops naturally with use. If you never think about context, either you're not using Claude intensively, or you're ignoring signals that might matter.

---

## Common Situations

### "Claude keeps making the same mistake"

**Tempting**: Add many rules to prevent it.

**Often better**: Add one specific rule, test if it works, iterate.

```markdown
## Note Processing
When distributing notes, always check the domain INDEX.md first
to confirm the note matches the domain's scope.
```

### "When should I add more complexity?"

| Signal | Possible response |
|--------|-------------------|
| Repeating the same prompt often | Create a skill workflow |
| Need deep focus on one domain | Create a domain agent |
| Security concern | Configure a hook |
| Same questions across sessions | Add to CLAUDE.md |

But also: maybe you don't need more complexity. Simple setups work for many people.

---

## How PAL Uses This

PAL is designed for the **Autonomous Learning Path**. The `session-start` hook and CLAUDE.md handle the "Turnkey" setup automatically. When you clone PAL:

1. Run `/setup-context` to configure your identity (ABOUTME.md, DIRECTIVES.md)
2. Your preferences persist across every session from that point on
3. Add complexity only when you hit friction — start with the inbox and note-taking skills

---

**Previous:** [05 — Cheatsheet](./05-cheatsheet.md) | **Next:** [07 — Data Privacy](./07-data-privacy.md)
