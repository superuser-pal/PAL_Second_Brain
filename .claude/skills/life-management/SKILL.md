---
name: life-management
description: Manage personal life context - mission, beliefs, goals, projects, mental models, lessons. USE WHEN update beliefs, add goal, life mission, add lesson, update projects, mental models, frames, extract notes, process ideas, export life summary, life report.
---

# Life Management Skill

Manage personal life context within the life-os domain.

## Domain

This skill operates on the `life-os` domain at `domains/life-os/`.

## File Categories

| File | Location | Purpose |
|------|----------|---------|
| mission.md | 00_CONTEXT/ | Life mission statement |
| beliefs.md | 00_CONTEXT/ | Core beliefs and worldview |
| frames.md | 00_CONTEXT/ | Mental frames and perspectives |
| models.md | 00_CONTEXT/ | Mental models for decisions |
| learned.md | 00_CONTEXT/ | Lessons learned |
| goals.md | 01_PROJECTS/ | Life goals (short and long term) |
| projects.md | 01_PROJECTS/ | Active projects |

## Workflows

| Workflow | Purpose | Trigger |
|----------|---------|---------|
| update | Add/edit content in life files | "update beliefs", "add goal", "update mission" |
| extract | Process notes from 03_ASSETS/ into main files | "extract notes", "process ideas", "extract insights" |
| export | Generate life summary report | "export life summary", "life report", "generate summary" |

## Workflow Routing

```
User Intent → Workflow Selection:

"update my beliefs" → update.md
"add a goal" → update.md
"update mission" → update.md
"add lesson learned" → update.md
"process my notes" → extract.md
"extract insights from ideas" → extract.md
"generate life summary" → export.md
"create life report" → export.md
```

## Timestamp Standard

All timestamps in life-management use ISO 8601 format:

| Context | Format | Example |
|---------|--------|---------|
| Dates | `YYYY-MM-DD` | `2026-02-15` |
| Backups | `YYYY-MM-DD_HH-MM-SS` | `2026-02-15_14-30-00` |
| Reports | `YYYY-MM-DD` | `life_summary_2026-02-15.md` |
| Timezone | Local (system default) | — |

## Usage

Skill activates automatically when user mentions life context management. For extended sessions, load the domain agent:

```
/life-coach
```
