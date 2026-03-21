# Update Tasks Workflow

**Purpose:** Push task changes from TASKS.md back to source project files, enabling bidirectional synchronization.

## Prerequisites

- `Inbox/Dashboards/TASKS.md` exists (run `pull tasks` first)
- Source project files still exist at referenced paths

## Workflow Steps

### Step 1: Read TASKS.md

Parse `Inbox/Dashboards/TASKS.md`:

- Extract `last_pulled` timestamp from frontmatter
- Parse all task entries with their source references
- Build map of tasks by source file

```
Reading TASKS.md...
Last pulled: 2026-02-11 14:30
Projects referenced: 6
Tasks to sync: 16
```

### Step 2: Compare with Source Files

For each source project file:

1. Read current project file
2. Parse existing tasks
3. Compare with TASKS.md version
4. Identify changes:
   - Checkbox symbol changes (e.g., `[ ]` → `[/]`, `[!]` → `[ ]`)
   - Section moves (Active → Inactive, Inactive → Active, any → Done)
   - Task additions (new tasks in TASKS.md)
   - Task completions (→ `[x]`)
   - Task modifications (text changes)

```
Comparing tasks...
  API_INTEGRATION_PROJECT: 2 changes detected
  SECURITY_AUDIT_PROJECT: 0 changes
  WEBSITE_REDESIGN_PROJECT: 3 changes detected
```

### Step 3: Detect Conflicts

Check if source file was modified after `last_pulled`:

```
Conflict detected!

API_INTEGRATION_PROJECT was modified after last pull:
  TASKS.md pulled: 2026-02-11 14:30
  Source modified: 2026-02-11 15:45

Options:
1. Force update (overwrite source with TASKS.md changes)
2. Skip this project (preserve source, discard TASKS.md changes)
3. Manual review (show diff and decide per-task)

Select option:
```

### Step 4: Apply Changes

For each project without conflicts (or with user resolution):

#### 4a. Update Task Status and Section

Move tasks between Active/Inactive/Done sections based on checkbox symbol changes:

**Example 1: To Do → In Progress (stay in Active)**

Before: `### Active → - [ ] Implement payment endpoints`
After:  `### Active → - [/] Implement payment endpoints`

**Example 2: In Progress → Blocked (Active → Inactive)**

Before: `### Active   → - [/] Deploy to production`
After:  `### Inactive → - [!] Deploy to production`

**Example 3: Blocked → To Do (Inactive → Active)**

Before: `### Inactive → - [!] Complete security review`
After:  `### Active   → - [ ] Complete security review`

**Example 4: Paused → In Progress (Inactive → Active)**

Before: `### Inactive → - [?] Add advanced analytics`
After:  `### Active   → - [/] Add advanced analytics`

**Example 5: To Do → Not Doing (Active → Inactive)**

Before: `### Active   → - [ ] Add GraphQL support`
After:  `### Inactive → - [-] Add GraphQL support`

**Example 6: Any → Done**

Before: `### Active or Inactive → - [/] Task`
After:  `### Done              → - [x] Task`

#### 4b. Add New Tasks

If TASKS.md has tasks not in source, add to appropriate section:

```markdown
### Open

- [ ] New task from TASKS.md `#open`
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
  API_INTEGRATION_PROJECT (example-domain)
    - 1 task: #open → #in-progress
    - 1 task: marked #done
  WEBSITE_REDESIGN_PROJECT (client-project)
    - 2 tasks: #open → #in-progress
    - 1 new task added

Projects Skipped:
  SECURITY_AUDIT_PROJECT - no changes

Conflicts Resolved:
  None (or list resolved conflicts)

Summary:
  Projects modified: 2
  Tasks updated: 5
  Domain indexes updated: 2
```

## Conflict Resolution Options

| Option        | Behavior                                          |
| ------------- | ------------------------------------------------- |
| Force update  | TASKS.md changes overwrite source file            |
| Skip project  | Source file preserved, TASKS.md changes discarded |
| Manual review | Show task-by-task diff, user decides each          |

### Manual Review Mode

```
Task conflict in API_INTEGRATION_PROJECT:

Source (current):
  - [ ] Implement payment endpoints with retry logic `#in-progress`

TASKS.md:
  - [ ] Implement payment endpoints `#in-progress`

Options:
1. Keep source version
2. Use TASKS.md version
3. Edit manually

Select:
```

## Error Handling

| Error                   | Resolution                                      |
| ----------------------- | ----------------------------------------------- |
| TASKS.md doesn't exist  | Prompt to run `pull tasks` first                |
| Source file not found   | Log warning, remove from TASKS.md               |
| Parse error in source   | Skip project, report error                      |
| Permission denied       | Report error, suggest checking file permissions |

## Output

- Updated project files in `domains/*/01_PROJECTS/`
- Updated domain INDEX.md files
- Sync report with changes applied
