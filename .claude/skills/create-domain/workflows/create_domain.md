# create_domain Workflow

Create a new PAL domain following the canonical structure from DOMAINS_LOGIC.md.

## Step 1: Read the Authoritative Source

**REQUIRED FIRST:**

Read the domain system documentation: `DOMAINS_LOGIC.md`

## Step 2: Gather Requirements

Ask the user:

1. What is the domain name? (will be converted to lower-kebab-case)
2. Brief description of the domain's purpose
3. Who owns this domain? (optional)

## Step 3: Validate Domain Name

Convert user input to `lower-kebab-case`:

| User Input        | Converted Name    |
| ----------------- | ----------------- |
| "Project Alpha"   | `project-alpha`   |
| "My Blog Project" | `my-blog-project` |
| "API_Integration" | `api-integration` |

## Step 4: Create Directory Structure

```bash
mkdir -p domains/[domain-name]/00_CONTEXT
mkdir -p domains/[domain-name]/01_PROJECTS
mkdir -p domains/[domain-name]/02_SESSIONS
mkdir -p domains/[domain-name]/03_ASSETS
mkdir -p domains/[domain-name]/04_OUTPUTS
mkdir -p domains/[domain-name]/05_ARCHIVE
```

## Step 5: Create INDEX.md

Create `domains/[domain-name]/INDEX.md` with this template:

```markdown
---
name: [domain-name]
description: [User's description]
status: active
created: [YYYY-MM-DD]
updated: [YYYY-MM-DD]
owner: [Owner if provided]
---

# [Domain Name Title Case]

[User's description expanded into overview paragraph]

## Current State

[Initial state - typically "Domain created. Ready for planning."]

## Key Facts

- **Created:** [Date]
- **Purpose:** [Brief purpose]
- **Status:** Active

## Active Work

| Project                  | Status | Last Updated |
| ------------------------ | ------ | ------------ |
| _No active projects yet_ | -      | -            |

## Quick Links

- [Context](00_CONTEXT/)
- [Projects](01_PROJECTS/)
- [Sessions](02_SESSIONS/)
- [Assets](03_ASSETS/)
- [Outputs](04_OUTPUTS/)
- [Archive](05_ARCHIVE/)
```

## Step 6: Create CONNECTIONS.yaml

Create `domains/[domain-name]/CONNECTIONS.yaml` with schema template:

```yaml
# External APIs this domain interacts with
apis: []
  # - name: api-name
  #   url: https://api.example.com
  #   docs: https://docs.example.com
  #   auth_type: api_key | oauth | basic | none
  #   notes: Usage notes

# External documentation sources
documentation: []
  # - name: doc-name
  #   url: https://docs.example.com
  #   notes: What this covers

# Data sources
data_sources: []
  # - name: source-name
  #   type: postgresql | redis | etc
  #   notes: Access notes
```

## Step 7: Verify Structure

Run verification:

```bash
ls -la domains/[domain-name]/
```

Expected output:

- `INDEX.md`
- `CONNECTIONS.yaml`
- `00_CONTEXT/`
- `01_PROJECTS/`
- `02_SESSIONS/`
- `03_ASSETS/`
- `04_OUTPUTS/`
- `05_ARCHIVE/`

## Step 8: Final Checklist

### Structure

- [ ] Domain directory uses lower-kebab-case
- [ ] INDEX.md exists at domain root
- [ ] CONNECTIONS.yaml exists at domain root
- [ ] All six core folders exist (00_CONTEXT, 01_PROJECTS, 02_SESSIONS, 03_ASSETS, 04_OUTPUTS, 05_ARCHIVE)

### INDEX.md

- [ ] Contains proper YAML frontmatter (name, description, status, created, updated)
- [ ] Contains template sections (Current State, Key Facts, Active Work, Quick Links)
- [ ] Active Work table references Projects (not Plans)
- [ ] Quick Links reference all six folders

### Naming

- [ ] Core folders use NN_UPPER_CASE format (01_PROJECTS, not projects)

## Done

Domain created following canonical structure. Ready for use with Domain Agents.

**Next Steps:**

1. Configure a Domain Agent to access this domain (see `AGENTS_LOGIC.md`)
2. Add context and reference docs to `00_CONTEXT/`
3. Add project files to `01_PROJECTS/` as needed
4. Log sessions in `02_SESSIONS/`
5. Store reference materials in `03_ASSETS/`
