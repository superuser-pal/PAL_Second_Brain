# sync_tasks Tool

Bidirectional task synchronization between project files and the master task list.

## Overview

This CLI tool automates task aggregation and synchronization across all PAL domains. It scans project files in `domains/*/01_PROJECTS/` and maintains a centralized task list in `/tasks/MASTER.md`.

## Installation

The tool uses Bun runtime (no additional dependencies required).

## Usage

```bash
bun .claude/skills/project-management/tools/sync_tasks.ts <command> [options]
```

## Commands

### pull

Aggregate tasks from all projects into MASTER.md.

```bash
bun sync_tasks.ts pull
```

**What it does:**
1. Scans all `domains/*/01_PROJECTS/PROJECT_*.md` files
2. Parses YAML frontmatter and task sections
3. Extracts `#open` and `#in-progress` tasks
4. Generates `/tasks/MASTER.md` with grouped tasks

**Output:**
```
Tasks pulled successfully!

Scan Summary:
  Domains scanned: 3
  Projects found: 7

Task Breakdown:
  Open tasks: 12
  In-progress tasks: 4
  Total active: 16

Output: /tasks/MASTER.md
```

### push

Push task changes from MASTER.md back to source projects.

```bash
bun sync_tasks.ts push
bun sync_tasks.ts push --force
```

**Options:**
- `--force, -f` - Skip conflict detection, overwrite source files

**Note:** The push command provides basic functionality. For guided task updates with conflict resolution, use the `update_plan` workflow instead.

### status

Show sync status without making changes.

```bash
bun sync_tasks.ts status
```

**Output:**
```
Projects: 7 across 3 domains
Tasks: 12 open, 4 in-progress, 18 done

MASTER.md:
  Last pulled: 2026-02-11 14:30
  File modified: 2026-02-11 15:45
```

## Options

| Option | Short | Description |
|--------|-------|-------------|
| `--help` | `-h` | Show help message |
| `--force` | `-f` | Force push without conflict checking |
| `--quiet` | `-q` | Minimal output |
| `--output` | `-o` | Custom output file path |

## Task Format

The tool recognizes tasks in this format:

```markdown
### Open
- [ ] Task description `#open`

### In Progress
- [ ] Task description `#in-progress`

### Done
- [x] Task description `#done`
```

**Requirements:**
- Checkbox syntax: `- [ ]` or `- [x]`
- Status tag: `#open`, `#in-progress`, or `#done`
- Tasks grouped under `### Open`, `### In Progress`, `### Done` headers

## MASTER.md Format

Generated MASTER.md includes:

```yaml
---
last_pulled: 2026-02-11 14:30
domains_scanned:
  - example-domain
  - client-project
total_projects: 5
total_tasks: 16
open_tasks: 12
in_progress_tasks: 4
---
```

Each project section includes source reference:
```markdown
### PROJECT_NAME
> Source: domains/domain-name/01_PROJECTS/PROJECT_NAME.md
> Priority: high | Status: in-progress
```

## Examples

### Daily workflow

```bash
# Morning: Pull latest tasks
bun sync_tasks.ts pull

# Work on tasks in MASTER.md...

# End of day: Check status
bun sync_tasks.ts status

# Push changes back
bun sync_tasks.ts push
```

### Custom output location

```bash
bun sync_tasks.ts pull --output ./my-tasks.md
```

### Quiet mode for scripts

```bash
bun sync_tasks.ts pull --quiet && echo "Done"
```

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| "domains/ directory not found" | No domains exist | Create a domain first |
| "MASTER.md not found" | Never pulled | Run `pull` command |
| "Parse error" | Invalid frontmatter | Check project file YAML |

## Integration with Workflows

This tool supports the project-management skill workflows:

- **pull_tasks workflow** → Uses `pull` command
- **update_plan workflow** → Uses `push` command (or manual updates)
- **project_dashboard workflow** → Uses `status` command data

## File Locations

| File | Purpose |
|------|---------|
| `domains/*/01_PROJECTS/PROJECT_*.md` | Source project files |
| `/tasks/MASTER.md` | Aggregated task list |
| `/tasks/DASHBOARD.md` | Optional dashboard output |
