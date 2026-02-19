# audit_references Workflow

Verify that all agents, skills, and workflows on disk are registered in ROUTING_TABLE.md and SYSTEM_INDEX.md — and that all entries in those files point to files that actually exist. Also sync agent Section 5 capabilities against SYSTEM_INDEX.

## Step 1: Scan Disk for Actual Assets

### 1a. Agents on disk

```bash
ls .claude/agents/*.md
```

Record each agent filename (e.g., `pal-master.md` → agent name `pal-master`).

### 1b. Skills on disk

```bash
find .claude/skills/ -name "SKILL.md" -not -path "*.archive*"
```

Record each skill directory name (e.g., `.claude/skills/create-agent/SKILL.md` → skill name `create-agent`).

### 1c. Workflows on disk

```bash
find .claude/skills/*/workflows/ -name "*.md" -not -path "*.archive*"
```

Record each workflow file with its parent skill (e.g., `create-agent/workflows/create_agent.md` → workflow `create_agent` from skill `create-agent`).

## Step 2: Parse ROUTING_TABLE.md

Read `.claude/base/reference/ROUTING_TABLE.md`.

For each YAML entry, extract:

- `name` — agent name
- `domain` — domain binding
- `location` — file path
- `routes_to` — description

Store as `routing_entries[]`.

## Step 3: Parse SYSTEM_INDEX.md

Read `.claude/base/reference/SYSTEM_INDEX.md`.

Extract three tables:

- **Agents table** → `index_agents[]` (Agent, Domain, Location)
- **Skills table** → `index_skills[]` (Skill, Agent, Location, Use When)
- **Workflows table** → `index_workflows[]` (Workflow, Agent, Source, Location)
- **Prompts table** → `index_prompts[]` (Prompt, Agent, Location, Use When)

## Step 4: Forward Check — Disk → References

### 4a. Agents

For each agent on disk:

- [ ] Has a matching entry in `routing_entries[]` (by name)
- [ ] Has a matching row in `index_agents[]` (by Agent column)

**If missing:** Flag as `UNREGISTERED AGENT`.

### 4b. Skills

For each skill on disk:

- [ ] Has a matching row in `index_skills[]` (by Skill column)

**If missing:** Flag as `UNREGISTERED SKILL`.

### 4c. Workflows

For each workflow on disk:

- [ ] Has a matching row in `index_workflows[]` (by Workflow + Source columns)

**If missing:** Flag as `UNREGISTERED WORKFLOW`.

## Step 5: Reverse Check — References → Disk

### 5a. ROUTING_TABLE entries

For each entry in `routing_entries[]`:

- [ ] File exists at the `location` path

**If file missing:** Flag as `DEAD REFERENCE in ROUTING_TABLE`.

### 5b. SYSTEM_INDEX Agents

For each row in `index_agents[]`:

- [ ] File exists at the `Location` path

**If file missing:** Flag as `DEAD REFERENCE in SYSTEM_INDEX (Agents)`.

### 5c. SYSTEM_INDEX Skills

For each row in `index_skills[]`:

- [ ] SKILL.md exists at the `Location` path

**If file missing:** Flag as `DEAD REFERENCE in SYSTEM_INDEX (Skills)`.

### 5d. SYSTEM_INDEX Workflows

For each row in `index_workflows[]`:

- [ ] Workflow file exists at the `Location` path

**If file missing:** Flag as `DEAD REFERENCE in SYSTEM_INDEX (Workflows)`.

### 5e. SYSTEM_INDEX Prompts

For each row in `index_prompts[]`:

- [ ] Prompt file exists at the `Location` path

**If file missing:** Flag as `DEAD REFERENCE in SYSTEM_INDEX (Prompts)`.

## Step 6: Capability Sync — Agent Section 5 ↔ SYSTEM_INDEX

For each agent on disk:

1. Read the agent file
2. Find **Section 5: My Capabilities**
3. Extract skills, workflows, and prompts declared in Section 5
4. Compare against SYSTEM_INDEX entries for this agent:
   - [ ] Every skill in Section 5 has a matching SYSTEM_INDEX row for this agent
   - [ ] Every workflow in Section 5 has a matching SYSTEM_INDEX row for this agent
   - [ ] Every SYSTEM_INDEX entry for this agent has a matching Section 5 declaration

**If mismatch found:** Flag as `CAPABILITY MISMATCH` with direction (agent-only or index-only).

## Step 7: Generate Report

```markdown
## Reference Audit Report — [DATE]

### Summary

- Agents on disk: [N] | In ROUTING_TABLE: [N] | In SYSTEM_INDEX: [N]
- Skills on disk: [N] | In SYSTEM_INDEX: [N]
- Workflows on disk: [N] | In SYSTEM_INDEX: [N]

### Unregistered Items (on disk but not in references)

| Type     | Name   | Location | Action Needed                         |
| -------- | ------ | -------- | ------------------------------------- |
| Agent    | [name] | [path]   | Add to ROUTING_TABLE and SYSTEM_INDEX |
| Skill    | [name] | [path]   | Add to SYSTEM_INDEX                   |
| Workflow | [name] | [path]   | Add to SYSTEM_INDEX                   |

### Dead References (in references but not on disk)

| Source        | Type  | Name   | Listed Location | Action Needed               |
| ------------- | ----- | ------ | --------------- | --------------------------- |
| ROUTING_TABLE | Agent | [name] | [path]          | Remove entry or create file |
| SYSTEM_INDEX  | Skill | [name] | [path]          | Remove entry or create file |

### Capability Mismatches (Agent Section 5 ↔ SYSTEM_INDEX)

| Agent   | Item             | In Section 5 | In SYSTEM_INDEX | Action Needed                             |
| ------- | ---------------- | ------------ | --------------- | ----------------------------------------- |
| [agent] | [skill/workflow] | ✅/❌        | ✅/❌           | Sync Section 5 or regenerate SYSTEM_INDEX |

### Result

[ALL CLEAR | X issues found]
```

## Step 8: Offer Fixes

If issues found, offer:

1. **Unregistered agents** → Add to ROUTING_TABLE.md
2. **Dead references** → Remove from ROUTING_TABLE / SYSTEM_INDEX
3. **Capability mismatches** → Suggest running `map-domain` to regenerate SYSTEM_INDEX
4. **All issues** → Ask user which to fix now

## Done

Reference audit complete. Report generated with all integrity issues and suggested fixes.
