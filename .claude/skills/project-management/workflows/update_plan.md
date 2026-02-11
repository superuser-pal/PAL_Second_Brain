# Update Plan Workflow

**Purpose:** Push task changes from MASTER.md back to source project files, enabling bidirectional synchronization.

## Prerequisites

- `/tasks/MASTER.md` exists (run `pull tasks` first)
- Source project files still exist at referenced paths

## Workflow Steps

### Step 1: Read MASTER.md

Parse `/tasks/MASTER.md`:
- Extract `last_pulled` timestamp from frontmatter
- Parse all task entries with their source references
- Build map of tasks by source file

```
Reading MASTER.md...
Last pulled: 2026-02-11 14:30
Projects referenced: 6
Tasks to sync: 16
```

### Step 2: Compare with Source Files

For each source project file:

1. Read current project file
2. Parse existing tasks
3. Compare with MASTER.md version
4. Identify changes:
   - Status changes (e.g., `#open` → `#in-progress`)
   - Task additions (new tasks in MASTER.md)
   - Task completions (`#open`/`#in-progress` → `#done`)
   - Task modifications (text changes)

```
Comparing tasks...
  PROJECT_API_INTEGRATION: 2 changes detected
  PROJECT_SECURITY_AUDIT: 0 changes
  PROJECT_WEBSITE_REDESIGN: 3 changes detected
```

### Step 3: Detect Conflicts

Check if source file was modified after `last_pulled`:

```
Conflict detected!

PROJECT_API_INTEGRATION was modified after last pull:
  MASTER.md pulled: 2026-02-11 14:30
  Source modified:  2026-02-11 15:45

Options:
1. Force update (overwrite source with MASTER.md changes)
2. Skip this project (preserve source, discard MASTER.md changes)
3. Manual review (show diff and decide per-task)

Select option:
```

### Step 4: Apply Changes

For each project without conflicts (or with user resolution):

#### 4a. Update Task Status

Move tasks between sections based on tag changes:

**Before (in source):**
```markdown
### Open
- [ ] Implement payment endpoints `#open`

### In Progress

### Done
```

**After (applying MASTER.md change):**
```markdown
### Open

### In Progress
- [ ] Implement payment endpoints `#in-progress`

### Done
```

#### 4b. Add New Tasks

If MASTER.md has tasks not in source, add to appropriate section:

```markdown
### Open
- [ ] New task from MASTER.md `#open`
```

#### 4c. Complete Tasks

Move completed tasks (`#done`) to Done section with checkbox:

```markdown
### Done
- [x] Research API documentation `#done`
```

### Step 5: Update Project Metadata

For each modified project file:

1. Update `last_modified` in YAML frontmatter
2. Update `status` if all tasks done (→ `review` or `completed`)

```yaml
---
last_modified: 2026-02-11 16:00
status: in-progress
---
```

### Step 6: Update Domain INDEX.md

For each domain with modified projects:

1. Update project status in Active Work table
2. Update `updated` timestamp in INDEX.md frontmatter

### Step 7: Report Results

```
Update complete!

Projects Updated:
  PROJECT_API_INTEGRATION (example-domain)
    - 1 task: #open → #in-progress
    - 1 task: marked #done
  PROJECT_WEBSITE_REDESIGN (client-project)
    - 2 tasks: #open → #in-progress
    - 1 new task added

Projects Skipped:
  PROJECT_SECURITY_AUDIT - no changes

Conflicts Resolved:
  None (or list resolved conflicts)

Summary:
  Projects modified: 2
  Tasks updated: 5
  Domain indexes updated: 2
```

## Conflict Resolution Options

| Option | Behavior |
|--------|----------|
| Force update | MASTER.md changes overwrite source file |
| Skip project | Source file preserved, MASTER.md changes discarded |
| Manual review | Show task-by-task diff, user decides each |

### Manual Review Mode

```
Task conflict in PROJECT_API_INTEGRATION:

Source (current):
  - [ ] Implement payment endpoints with retry logic `#in-progress`

MASTER.md:
  - [ ] Implement payment endpoints `#in-progress`

Options:
1. Keep source version
2. Use MASTER.md version
3. Edit manually

Select:
```

## Error Handling

| Error | Resolution |
|-------|------------|
| MASTER.md doesn't exist | Prompt to run `pull tasks` first |
| Source file not found | Log warning, remove from MASTER.md |
| Parse error in source | Skip project, report error |
| Permission denied | Report error, suggest checking file permissions |

## Output

- Updated project files in `domains/*/01_PROJECTS/`
- Updated domain INDEX.md files
- Sync report with changes applied
