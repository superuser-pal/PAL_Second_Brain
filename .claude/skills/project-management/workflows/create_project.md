# Create Project Workflow

**Purpose:** Create a new project in a domain's `01_PROJECTS/` folder with structured task tracking.

## Prerequisites

- At least one domain must exist in `/domains/`
- Domain must have `01_PROJECTS/` folder

## Workflow Steps

### Step 1: List Available Domains

Scan `/domains/` directory and present available domains to user.

```
Available domains:
1. example-domain
2. client-project
3. internal-tools

Select domain (enter number or name):
```

**Validation:** Domain must exist and have valid INDEX.md

### Step 2: Gather Project Information

Prompt user for project details:

#### 2a. Project Name
```
Project name: [user input]
```
- Convert to UPPER_SNAKE_CASE for filename
- Example: "API Integration" → `PROJECT_API_INTEGRATION.md`

#### 2b. Objective
```
Project objective (brief description):
[user input - 1-2 sentences]
```

#### 2c. Initial Tasks
```
Initial tasks (comma-separated or one per line):
[user input]
```
- Parse into individual task items
- Each task gets `#open` tag

#### 2d. Priority
```
Priority:
1. low
2. medium (default)
3. high

Select priority:
```

#### 2e. Due Date (Optional)
```
Due date (YYYY-MM-DD or skip):
[user input or blank]
```

#### 2f. Owner (Optional)
```
Owner/assignee (or skip):
[user input or blank]
```

### Step 3: Generate Project File

Using `project_template.md`, generate the project file:

```yaml
---
name: PROJECT_API_INTEGRATION
status: planning
priority: high
domain: example-domain
created: 2026-02-11
last_modified: 2026-02-11
due_date: 2026-03-15
owner: null
tags: []
---

# Project: API Integration

## Objective

Integrate third-party payment API into the existing checkout flow.

## Tasks

### Open
- [ ] Research API documentation `#open`
- [ ] Create authentication flow `#open`
- [ ] Implement payment endpoints `#open`

### In Progress

### Done

## Notes

## References

```

### Step 4: Save Project File

Save to: `domains/[domain]/01_PROJECTS/PROJECT_[NAME].md`

**Validation:**
- Check file doesn't already exist
- If exists, prompt: overwrite / rename / cancel

### Step 5: Update Domain INDEX.md

Add entry to the Active Work table in domain's INDEX.md:

```markdown
| Project | Status | Last Updated |
|---------|--------|--------------|
| [PROJECT_API_INTEGRATION](01_PROJECTS/PROJECT_API_INTEGRATION.md) | planning | 2026-02-11 |
```

Also update the `updated:` field in INDEX.md frontmatter.

### Step 6: Report Success

```
Project created successfully!

File: domains/example-domain/01_PROJECTS/PROJECT_API_INTEGRATION.md
Domain: example-domain
Status: planning
Priority: high
Tasks: 3 open
Due: 2026-03-15

Domain INDEX.md updated with project reference.
```

## Error Handling

| Error | Resolution |
|-------|------------|
| No domains exist | Suggest running create-domain workflow first |
| Domain missing 01_PROJECTS/ | Create the folder automatically |
| Project file exists | Offer: overwrite / rename / cancel |
| Invalid date format | Re-prompt with correct format |

## Output

- New project file at `domains/[domain]/01_PROJECTS/PROJECT_[NAME].md`
- Updated domain INDEX.md with project entry
