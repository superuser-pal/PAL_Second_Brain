---
description: Update life context files with guided conversation and automatic backups
---

# Update Workflow

Update life-os domain files with automatic backups and change logging.

## Trigger Phrases

- "update my beliefs"
- "add a goal"
- "update my mission"
- "add a lesson"
- "update projects"
- "add to frames"
- "update models"
- Any phrase indicating updating life context

## Valid Files

| File | Location | Purpose |
|------|----------|---------|
| mission.md | 00_CONTEXT/ | Life mission statement |
| beliefs.md | 00_CONTEXT/ | Core beliefs and worldview |
| frames.md | 00_CONTEXT/ | Mental frames and perspectives |
| models.md | 00_CONTEXT/ | Mental models for decisions |
| learned.md | 00_CONTEXT/ | Lessons learned |
| goals.md | 01_PROJECTS/ | Life goals (short/long term) |
| projects.md | 01_PROJECTS/ | Active projects |

## Domain Paths

- **Domain Root:** `domains/life-os/`
- **Backups:** `domains/life-os/05_ARCHIVE/backups/`
- **Updates Log:** `domains/life-os/02_SESSIONS/UPDATES.md`

## Execution Workflow

### Step 1: Parse the Request

Determine:
- **What is being added?** (a goal, a belief, a lesson, etc.)
- **Which file should it go in?** (goals.md, beliefs.md, learned.md, etc.)
- **What's the context?** (why is this important?)

### Step 2: Confirm with User

Before updating, confirm:
- The content to add
- The target file
- How it should be formatted

### Step 3: Ensure Backup Directory Exists

Before creating any backup:

1. Check if `domains/life-os/05_ARCHIVE/backups/` exists
2. If not, create the directory
3. Proceed to backup creation

### Step 4: Create Backup

Before modifying any file:

1. Read current file content
2. Create timestamped backup:
   ```
   domains/life-os/05_ARCHIVE/backups/[filename]_YYYY-MM-DD_HH-MM-SS.md
   ```

### Step 5: Apply Update

1. Read the target file
2. Append or modify content as appropriate
3. Update the "Last Updated" timestamp in the file

### Step 6: Log the Change

Append to `domains/life-os/02_SESSIONS/UPDATES.md`:

```markdown
## YYYY-MM-DD

### [Update Title]
- **Action:** [What was done]
- **Files:** [Files modified]
- **Notes:** [Additional context]
```

### Step 7: Confirm Success

Report to user:
- What was added
- Where it was added
- That backup was created
- Ask if there's anything else to update

## Content Formatting Guidelines

**Mission/Beliefs:**
```markdown
## [Statement Title]

[Explanation or context]
```

**Goals:**
```markdown
## [Goal Title]

- **Timeline:** [Short/Medium/Long term]
- **Status:** [Planning/In Progress/Achieved]
- **Details:** [Description]
```

**Projects:**
```markdown
## [Project Name]

- **Status:** [Planning/In Progress/On Hold/Completed]
- **Started:** [Date]
- **Description:** [Details]
```

**Frames/Models:**
```markdown
## [Frame/Model Name]

**Purpose:** [When to use this]

[Description of the frame or model]
```

**Lessons:**
```markdown
## [Lesson Title]

**Context:** [How this was learned]

[The lesson itself]
```

## Error Handling

### Invalid File
- Report valid file options
- Ask user to clarify which file to update

### Backup Failed
- STOP immediately
- Report the error
- Do NOT proceed with update until backup succeeds

### File Not Found
- Check if domain structure exists
- Create file from template if missing
- Report action taken

## Critical Rules

1. **Always create backup before modifying**
2. **Always log changes to UPDATES.md**
3. **Confirm with user for significant changes**
4. **Preserve existing content** - append, don't overwrite
5. **Update timestamps** in modified files
