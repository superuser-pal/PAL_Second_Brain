# Archive Project Workflow

**Purpose:** Move a completed project to the domain's `05_ARCHIVE/` folder with a deprecation header.

## Prerequisites

- Project file exists in `domains/[domain]/01_PROJECTS/`
- Domain has `05_ARCHIVE/` folder

## Workflow Steps

### Step 1: List Active Projects

Scan all domains and list projects that can be archived:

```
Active Projects:

example-domain:
  1. PROJECT_API_INTEGRATION    [in-progress] high
  2. PROJECT_DOCUMENTATION      [planning]    medium
  3. PROJECT_TESTING            [completed]   low    ← Ready to archive

client-project:
  4. PROJECT_WEBSITE_REDESIGN   [in-progress] high
  5. PROJECT_MOBILE_APP         [completed]   medium ← Ready to archive

Select project to archive (enter number):
```

**Visual indicators:**
- `← Ready to archive` for projects with status `completed`
- Other statuses shown but require confirmation

### Step 2: Confirm Selection

If project status is NOT `completed`:

```
Warning: PROJECT_API_INTEGRATION has status "in-progress"

Archiving an incomplete project will:
- Move it out of active projects
- Add deprecation header
- Remove from domain INDEX.md Active Work table

Are you sure you want to archive this project?
1. Yes, archive anyway
2. No, cancel
3. Change project status to "completed" first, then archive

Select option:
```

If status IS `completed`:

```
Archiving: PROJECT_TESTING (example-domain)
Status: completed
Tasks: 0 open, 0 in-progress, 8 done

Proceed with archive? (yes/no):
```

### Step 3: Select Archive Reason

```
Archive reason:
1. Project completed
2. Project cancelled
3. Superseded by another project
4. No longer relevant
5. Other (enter custom reason)

Select reason:
```

If "Superseded by another project" selected:
```
Enter the superseding project name or file:
[user input]
```

### Step 4: Add Deprecation Header

Prepend deprecation metadata to project file:

**Before:**
```yaml
---
name: PROJECT_TESTING
status: completed
priority: low
domain: example-domain
created: 2026-01-15
last_modified: 2026-02-10
---

# Project: Testing Framework
...
```

**After:**
```yaml
---
deprecated: 2026-02-11
reason: Project completed
original_location: 01_PROJECTS/
archived_by: user
---

---
name: PROJECT_TESTING
status: completed
priority: low
domain: example-domain
created: 2026-01-15
last_modified: 2026-02-10
---

# Project: Testing Framework
...
```

### Step 5: Move to Archive

Move file from:
```
domains/example-domain/01_PROJECTS/PROJECT_TESTING.md
```

To:
```
domains/example-domain/05_ARCHIVE/PROJECT_TESTING.md
```

**If file exists in archive:**
```
File already exists in archive: PROJECT_TESTING.md

Options:
1. Overwrite existing archived file
2. Rename new file (PROJECT_TESTING_2.md)
3. Cancel archive operation

Select option:
```

### Step 6: Update Domain INDEX.md

Remove project from Active Work table:

**Before:**
```markdown
| Project | Status | Last Updated |
|---------|--------|--------------|
| [PROJECT_API_INTEGRATION](01_PROJECTS/PROJECT_API_INTEGRATION.md) | in-progress | 2026-02-11 |
| [PROJECT_TESTING](01_PROJECTS/PROJECT_TESTING.md) | completed | 2026-02-10 |
```

**After:**
```markdown
| Project | Status | Last Updated |
|---------|--------|--------------|
| [PROJECT_API_INTEGRATION](01_PROJECTS/PROJECT_API_INTEGRATION.md) | in-progress | 2026-02-11 |
```

Also update `updated:` timestamp in INDEX.md frontmatter.

### Step 7: Update MASTER.md (if exists)

If `/tasks/MASTER.md` exists and contains tasks from archived project:
- Remove the project section from MASTER.md
- Update task counts in frontmatter

### Step 8: Report Success

```
Project archived successfully!

Project: PROJECT_TESTING
Domain: example-domain
Reason: Project completed

Archived to: domains/example-domain/05_ARCHIVE/PROJECT_TESTING.md

Updates applied:
  ✓ Deprecation header added
  ✓ File moved to 05_ARCHIVE/
  ✓ Removed from domain INDEX.md Active Work table
  ✓ Removed from /tasks/MASTER.md

To restore this project, move it back to 01_PROJECTS/ and remove the deprecation header.
```

## Deprecation Header Schema

```yaml
---
deprecated: YYYY-MM-DD           # Date of archival
reason: [reason text]            # Why it was archived
original_location: 01_PROJECTS/  # Where it came from
archived_by: [user/auto]         # Who/what archived it
superseded_by: [file]            # Optional: replacement project
---
```

**Reason Options:**
- `Project completed`
- `Project cancelled`
- `Superseded by [PROJECT_NAME]`
- `No longer relevant`
- Custom text

## Error Handling

| Error | Resolution |
|-------|------------|
| No projects found | Display "No active projects to archive" |
| 05_ARCHIVE/ doesn't exist | Create the folder automatically |
| Permission denied | Report error with path |
| INDEX.md parse error | Warn user, skip INDEX.md update |

## Batch Archive

For archiving multiple completed projects at once:

```
Found 3 completed projects:
  1. PROJECT_TESTING (example-domain)
  2. PROJECT_MOBILE_APP (client-project)
  3. PROJECT_OLD_API (internal-domain)

Archive all completed projects?
1. Yes, archive all
2. Select individually
3. Cancel

Select option:
```

## Output

- Project file moved to `domains/[domain]/05_ARCHIVE/`
- Deprecation header added to file
- Domain INDEX.md updated
- MASTER.md updated (if exists)
