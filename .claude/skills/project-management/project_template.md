# Project Template

This template defines the structure for all project files created by the `create_project` workflow.

## YAML Frontmatter Schema

```yaml
---
name: PROJECT_NAME                    # UPPER_SNAKE_CASE (matches filename)
status: planning                      # planning | in-progress | review | completed
priority: medium                      # low | medium | high
domain: domain-name                   # lower-kebab-case domain name
created: YYYY-MM-DD                   # Creation date
last_modified: YYYY-MM-DD             # Last modification date
due_date: null                        # Optional: YYYY-MM-DD
owner: null                           # Optional: assignee name
tags: []                              # Optional: categorization tags
---
```

### Field Definitions

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `name` | Yes | string | Project name in UPPER_SNAKE_CASE |
| `status` | Yes | enum | Current project status |
| `priority` | Yes | enum | Priority level (low/medium/high) |
| `domain` | Yes | string | Parent domain name |
| `created` | Yes | date | Date project was created |
| `last_modified` | Yes | date | Date of last modification |
| `due_date` | No | date | Target completion date |
| `owner` | No | string | Person responsible |
| `tags` | No | array | Categorization tags |

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
name: {{PROJECT_NAME}}
status: planning
priority: {{PRIORITY}}
domain: {{DOMAIN}}
created: {{DATE}}
last_modified: {{DATE}}
due_date: {{DUE_DATE}}
owner: {{OWNER}}
tags: []
---

# Project: {{HUMAN_READABLE_NAME}}

## Objective

{{OBJECTIVE}}

## Tasks

### Open
{{#each TASKS}}
- [ ] {{this}} `#open`
{{/each}}

### In Progress

### Done

## Notes

## References

```

## Task Format Rules

1. **Checkbox syntax**: Use `- [ ]` for open/in-progress, `- [x]` for done
2. **Status tags**: Every task MUST end with a status tag:
   - `#open` - Task not started
   - `#in-progress` - Task being worked on
   - `#done` - Task completed
3. **Section headers**: Tasks grouped under `### Open`, `### In Progress`, `### Done`
4. **Moving tasks**: When status changes, move task to appropriate section AND update tag

### Example Tasks

```markdown
### Open
- [ ] Research API documentation `#open`
- [ ] Design database schema `#open`

### In Progress
- [ ] Implement user authentication `#in-progress`

### Done
- [x] Set up project repository `#done`
- [x] Create initial documentation `#done`
```

## Filename Convention

Project files follow the naming pattern:
```
PROJECT_UPPER_SNAKE_CASE.md
```

**Examples:**
- `PROJECT_API_INTEGRATION.md`
- `PROJECT_SECURITY_AUDIT.md`
- `PROJECT_Q1_PLANNING.md`

**Conversion rules:**
- Replace spaces with underscores
- Convert to UPPERCASE
- Prefix with `PROJECT_`
- Add `.md` extension
