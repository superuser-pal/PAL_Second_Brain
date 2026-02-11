# adapt_agent Workflow

Convert a non-standard agent into a strictly compliant PAL agent following the 8-section structure. Unique logic and details that do not fit the template are moved to the domain context and referenced in the agent's context model.

## Step 1: Identify the Agent

Ask the user which agent needs to be adapted.

**Agent location:** `.claude/agents/[agent-name].md`

## Step 2: Read Authoritative Sources

**REQUIRED FIRST:**

1. Read the agent system documentation: `AGENTS_LOGIC.md`
2. Read the agent template: `agent_template.md` (in this skill's root)
3. Read the existing agent file: `.claude/agents/[agent-name].md`

## Step 3: Analyze Deviations

Identify content in the existing agent that does not fit the standard 8-section structure:

- Extra YAML fields (beyond `name`, `description`, `version`, `domain`)
- Logic sections (e.g., specific algorithms, complex decision trees)
- Long lists of domain-specific facts or rules
- Custom command handlers with high complexity

## Step 4: Externalize Custom Logic

If the agent contains unique logic or excessive detail that violates the single-file/minimalist agent principle:

1. Create a logic/context file for the agent:
   ```bash
   touch domains/[domain-name]/00_CONTEXT/[agent-name]_logic.md
   ```
2. Move the non-standard content into this new file.
3. Ensure the file follows the `lower_snake_case.md` naming convention.

## Step 5: Re-draft the Agent File

Rewrite the agent file using `agent_template.md` as the base.

### 5.1 YAML Frontmatter

Strictly 4 fields: `name`, `description`, `version`, `domain`.

### 5.2 Section 2: Activation Protocol

Add a reference to the newly created logic file:

```markdown
- [REF] `domains/[domain-name]/00_CONTEXT/[agent-name]_logic.md` — Specialized Agent Logic & Detailed Context
```

### 5.3 Section 5: My Capabilities

Ensure all skills and workflows are declared inline. If the "dirty" agent had capabilities in YAML, move them here.

### 5.4 8-Section Completion

Fill in all other sections (Identity, Menu, How I Work, etc.) using only the most essential information. Use the externalized logic file for deep details.

## Step 6: Update Routing Table

Verify or update the entry in `PAL_Base/System/ROUTING_TABLE.md`.

## Step 7: Final Validation

Run the `validate_agent` workflow on the adapted agent to ensure 100% template compliance.

## Done

Agent adapted to strict 8-section structure. Custom logic successfully externalized to domain context.
