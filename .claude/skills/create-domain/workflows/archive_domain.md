# archive_domain Workflow

Archive content within a PAL domain or archive the entire domain using the Deprecation Pattern from DOMAINS_LOGIC.md.

## Step 1: Read the Authoritative Source

**REQUIRED FIRST:**

Read the domain system documentation: `DOMAINS_LOGIC.md` (Section: Deprecation Pattern)

## Step 2: Identify Target Domain

Ask the user which domain contains content to archive.

```bash
ls domains/
```

## Step 3: Determine Archive Scope

| Scope              | User Says                                         | Action                             |
| ------------------ | ------------------------------------------------- | ---------------------------------- |
| **Single File**    | "archive this project", "archive the old feature" | Move one file to 05_ARCHIVE/       |
| **Multiple Files** | "archive all completed projects"                  | Move multiple files to 05_ARCHIVE/ |
| **Entire Domain**  | "archive this domain", "deprecate domain"         | Mark domain as archived            |

---

## Archive Type: Single File

### Step A1: Identify File to Archive

Ask user which file, or list candidates from the most common archive sources:

**Projects ready to archive:**

```bash
ls domains/[domain-name]/01_PROJECTS/
```

**Old sessions (older than 90 days):**

```bash
ls domains/[domain-name]/02_SESSIONS/
```

**Completed outputs:**

```bash
ls domains/[domain-name]/04_OUTPUTS/
```

**Outdated context:**

```bash
ls domains/[domain-name]/00_CONTEXT/
```

### Step A2: Add Deprecation Header

Before moving, prepend deprecation metadata to the file:

```markdown
---
deprecated: [YYYY-MM-DD]
reason:
  [
    Project completed | Superseded by PROJECT_NEW.md | No longer relevant | Cancelled,
  ]
original_location:
  [00_CONTEXT/ | 01_PROJECTS/ | 02_SESSIONS/ | 03_ASSETS/ | 04_OUTPUTS/]
---

[Original file content below]
```

### Step A3: Move to Archive

```bash
mv domains/[domain-name]/[original-folder]/[file.md] domains/[domain-name]/05_ARCHIVE/[file.md]
```

### Step A4: Update INDEX.md

If archiving a project:

1. Remove from Active Work table
2. Optionally note in Current State that project was archived

---

## Archive Type: Multiple Files

### Step B1: Identify Files to Archive

List candidates based on criteria:

- Completed projects (status: completed)
- Old sessions (date older than threshold)
- Superseded assets
- Delivered outputs no longer actively referenced

### Step B2: Confirm Selection

Present list to user for approval before archiving.

### Step B3: Archive Each File

For each file:

1. Add deprecation header
2. Move to 05_ARCHIVE/
3. Update INDEX.md as needed

### Step B4: Summary

Report how many files were archived and from which folders.

---

## Archive Type: Entire Domain

### Step C1: Confirm Domain Archive

**Warning:** This marks the entire domain as archived. All work is considered complete or abandoned.

Confirm with user:

- Reason for archiving
- Whether to keep in `domains/` or move elsewhere

### Step C2: Update Domain Status

Update `domains/[domain-name]/INDEX.md`:

```yaml
---
name: [domain-name]
description: [description]
status: archived # Changed from active
created: [original date]
updated: [today]
archived: [YYYY-MM-DD] # Add this field
archive_reason: [User's reason]
owner: [owner]
---
```

### Step C3: Update Current State

Add archive notice to Current State section:

```markdown
## Current State

**ARCHIVED:** This domain was archived on [YYYY-MM-DD].

**Reason:** [User's reason]

[Previous current state content]
```

### Step C4: Optional - Move Active Content

If any projects were in progress:

1. Offer to move to a different domain
2. Or mark them as cancelled in 05_ARCHIVE/

---

## Step 4: Verify Archive

Confirm archive was successful:

```bash
ls -la domains/[domain-name]/05_ARCHIVE/
```

For domain archive, verify INDEX.md status:

```bash
head -10 domains/[domain-name]/INDEX.md
```

## Deprecation Header Template

Always use this header when archiving:

```markdown
---
deprecated: YYYY-MM-DD
reason: [One of: Project completed | Superseded by [NEW_FILE] | No longer relevant | Cancelled | Domain archived]
original_location: [Original folder path]
---
```

## Done

Content archived following the Deprecation Pattern. INDEX.md updated as needed.

**Note:** Archived content remains accessible in 05_ARCHIVE/ for reference. Delete only if explicitly requested by user.
