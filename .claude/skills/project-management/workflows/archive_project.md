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
  1. API_INTEGRATION_PROJECT    [in-progress] high
  2. DOCUMENTATION_PROJECT      [planning]    medium
  3. TESTING_PROJECT            [completed]   low    ← Ready to archive

client-project:
  4. WEBSITE_REDESIGN_PROJECT   [in-progress] high
  5. MOBILE_APP_PROJECT         [completed]   medium ← Ready to archive

Select project to archive (enter number):
```

**Visual indicators:**

- `← Ready to archive` for projects with status `completed`
- Other statuses shown but require confirmation

### Step 2: Confirm Selection

If project status is NOT `completed`:

```
Warning: API_INTEGRATION_PROJECT has status "in-progress"

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
Archiving: TESTING_PROJECT (example-domain)
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
name: TESTING_PROJECT
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
name: TESTING_PROJECT
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
domains/example-domain/01_PROJECTS/TESTING_PROJECT.md
```

To:

```
domains/example-domain/05_ARCHIVE/TESTING_PROJECT.md
```

**If file exists in archive:**

```
File already exists in archive: TESTING_PROJECT.md

Options:
1. Overwrite existing archived file
2. Rename new file (TESTING_PROJECT_2.md)
3. Cancel archive operation

Select option:
```

### Step 6: Update Domain INDEX.md

Remove project from Active Work table:

**Before:**

```markdown
| Project                                                           | Status      | Last Updated |
| ----------------------------------------------------------------- | ----------- | ------------ |
| [API_INTEGRATION_PROJECT](01_PROJECTS/API_INTEGRATION_PROJECT.md) | in-progress | 2026-02-11   |
| [TESTING_PROJECT](01_PROJECTS/TESTING_PROJECT.md)                 | completed   | 2026-02-10   |
```

**After:**

```markdown
| Project                                                           | Status      | Last Updated |
| ----------------------------------------------------------------- | ----------- | ------------ |
| [API_INTEGRATION_PROJECT](01_PROJECTS/API_INTEGRATION_PROJECT.md) | in-progress | 2026-02-11   |
```

Also update `updated:` timestamp in INDEX.md frontmatter.

### Step 7: Update TASKS.md (if exists)

If `Inbox/Dashboards/TASKS.md` exists and contains tasks from archived project:

- Remove the project section from TASKS.md
- Update task counts in frontmatter

### Step 8: Report Success

```
Project archived successfully!

Project: TESTING_PROJECT
Domain: example-domain
Reason: Project completed

Archived to: domains/example-domain/05_ARCHIVE/TESTING_PROJECT.md

Updates applied:
  ✓ Deprecation header added
  ✓ File moved to 05_ARCHIVE/
  ✓ Removed from domain INDEX.md Active Work table
  ✓ Removed from Inbox/Dashboards/TASKS.md

To restore this project, move it back to 01_PROJECTS/ and remove the deprecation header.
```

## Deprecation Header Schema

```yaml
---
deprecated: YYYY-MM-DD # Date of archival
reason: [reason text] # Why it was archived
original_location: 01_PROJECTS/ # Where it came from
archived_by: [user/auto] # Who/what archived it
superseded_by: [file] # Optional: replacement project
---
```

**Reason Options:**

- `Project completed`
- `Project cancelled`
- `Superseded by [NAME]_PROJECT`
- `No longer relevant`
- Custom text

## Error Handling

| Error                     | Resolution                              |
| ------------------------- | --------------------------------------- |
| No projects found         | Display "No active projects to archive" |
| 05_ARCHIVE/ doesn't exist | Create the folder automatically         |
| Permission denied         | Report error with path                  |
| INDEX.md parse error      | Warn user, skip INDEX.md update         |

## Batch Archive

For archiving multiple completed projects at once:

```
Found 3 completed projects:
  1. TESTING_PROJECT (example-domain)
  2. MOBILE_APP_PROJECT (client-project)
  3. OLD_API_PROJECT (internal-domain)

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
- TASKS.md updated (if exists)
