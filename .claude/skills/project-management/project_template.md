# Project Template

This template defines the structure for all project files created by the `create_project` workflow.

## YAML Frontmatter Schema

```yaml
---
name: NAME_PROJECT # UPPER_SNAKE_CASE (matches filename)
status: planning # planning | in-progress | review | completed
priority: medium # low | medium | high
domain: DomainName # PascalCase domain name
created: YYYY-MM-DD # Creation date
last_modified: YYYY-MM-DD # Last modification date
due_date: null # Optional: YYYY-MM-DD
owner: null # Optional: assignee name
tags: [] # Optional: categorization tags
---
```

### Field Definitions

| Field           | Required | Type   | Description                      |
| --------------- | -------- | ------ | -------------------------------- |
| `name`          | Yes      | string | Project name in UPPER_SNAKE_CASE |
| `status`        | Yes      | enum   | Current project status           |
| `priority`      | Yes      | enum   | Priority level (low/medium/high) |
| `domain`        | Yes      | string | Parent domain name               |
| `created`       | Yes      | date   | Date project was created         |
| `last_modified` | Yes      | date   | Date of last modification        |
| `due_date`      | No       | date   | Target completion date           |
| `owner`         | No       | string | Person responsible               |
| `tags`          | No       | array  | Categorization tags              |

### Status Lifecycle

```
planning → in-progress → review → completed → (archived)
```

- **planning** - Project defined but work not started
- **in-progress** - Active work underway
- **review** - Work complete, awaiting review/approval
- **completed** - Project finished (ready for archive)

## Template Content

```markdown
---
name: { { NAME_PROJECT } }
status: planning
priority: { { PRIORITY } }
domain: { { DOMAIN } }
created: { { DATE } }
last_modified: { { DATE } }
due_date: { { DUE_DATE } }
owner: { { OWNER } }
tags: []
---

# Project: {{HUMAN_READABLE_NAME}}

## Objective

{{OBJECTIVE}}

## Tasks

### Active
{{#each TASKS}}
- [ ] {{this}}
{{/each}}

### Inactive

### Done

## Notes

## References
```

## Task Format Rules

Tasks use **checkbox symbols** to indicate status. No hashtags needed.

### Checkbox Symbol Reference

- `[ ]` To Do - Task not started, ready to work on
- `[/]` In Progress - Task actively being worked on
- `[!]` Blocked - Cannot proceed (dependency, external blocker)
- `[?]` Paused - Intentionally paused or temporarily deprioritized
- `[I]` Backlog - Moved to backlog (not doing now, might do later)
- `[-]` Not Doing - Decided not to do this task
- `[x]` Done - Task completed

### Section Grouping

- `### Active` - Contains `[ ]` (todo) and `[/]` (in-progress) tasks
- `### Inactive` - Contains `[!]` (blocked), `[?]` (paused), `[I]` (backlog), `[-]` (not-doing) tasks
- `### Done` - Contains `[x]` (done) tasks

### Moving Tasks

When status changes, update the checkbox symbol AND move task to appropriate section.

### Example Tasks

```markdown
### Active
- [ ] Research API documentation
- [/] Implement user authentication

### Inactive
- [!] Deploy to production (waiting for security review)
- [?] Add advanced analytics (paused until Q2)
- [I] Internationalization support
- [-] Add GraphQL support (decided against)

### Done
- [x] Set up project repository
- [x] Create initial documentation
```

## Filename Convention

Project files follow the naming pattern:

```
UPPER_SNAKE_CASE_PROJECT.md
```

**Examples:**

- `API_INTEGRATION_PROJECT.md`
- `SECURITY_AUDIT_PROJECT.md`
- `Q1_PLANNING_PROJECT.md`

**Conversion rules:**

- Replace spaces with underscores
- Convert to UPPERCASE
- Suffix with `_PROJECT`
- Add `.md` extension
