# Projects

Ongoing projects with multiple attributes and tasks. Each project is tracked in INDEX.md Active Work table.

## Purpose

This folder contains active project files that track ongoing work within the domain. Projects have defined objectives, tasks, and status tracking.

## File Naming

Files must use `PROJECT_UPPER_SNAKE_CASE.md` format.

**Examples:**
- `PROJECT_FEATURE_X.md`
- `PROJECT_MIGRATION.md`
- `PROJECT_Q1_GOALS.md`
- `PROJECT_API_REFACTOR.md`

## Usage

- One file per project
- Track status in YAML frontmatter:
  ```yaml
  ---
  status: planning | in-progress | review | completed
  ---
  ```
- Run `map-domain` to sync the Active Work table in INDEX.md
- Move completed projects to `05_ARCHIVE/` when done

## What to Include

- Project objectives and scope
- Tasks and subtasks
- Status updates
- Decisions and blockers
- Links to related assets
