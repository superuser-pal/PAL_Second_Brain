---
name: life-os
description: Personal life operating system - mission, beliefs, goals, projects, mental models, and lessons learned
status: active
created: 2026-02-15
updated: 2026-02-15
domain-agent: life-coach
---

# Life OS Domain

**Purpose:** Central repository for personal life context and philosophy

## Overview

Life OS is the personal life management domain within PAL Second Brain. It stores and organizes:

- **Mission & Beliefs** - Core life philosophy and worldview
- **Goals & Projects** - Active pursuits and objectives
- **Mental Models** - Frames, models, and decision-making frameworks
- **Lessons Learned** - Accumulated wisdom and insights

## Domain Structure

| Folder | Purpose |
|--------|---------|
| `00_CONTEXT/` | Core philosophy - mission, beliefs, frames, models, learned |
| `01_PROJECTS/` | Active work - goals, projects |
| `02_PAGES/` | Raw notes, ideas, inbox items for extraction |
| `03_OUTPUT/` | Generated reports and life summaries |
| `04_SESSIONS/` | Update logs and session history |
| `05_ARCHIVE/` | Archived content and backups |

## Core Files

### Philosophy (00_CONTEXT/)
- `mission.md` - Life mission statement
- `beliefs.md` - Core beliefs and worldview
- `frames.md` - Mental frames and perspectives
- `models.md` - Mental models for decisions
- `learned.md` - Lessons learned

### Active Work (01_PROJECTS/)
- `goals.md` - Life goals (short and long term)
- `projects.md` - Active projects

## Workflows

Access via the `life-management` skill:
- **Update** - Add or edit content in life files
- **Extract** - Process notes from 02_PAGES/ into main files
- **Export** - Generate life summary reports

## Agent

Load the domain agent for extended sessions:
```
/life-coach
```

---

**Last Updated:** 2026-02-15
