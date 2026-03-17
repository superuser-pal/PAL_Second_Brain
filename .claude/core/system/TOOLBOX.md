---
title: PAL Toolbox System
version: 1.2.0
layer: SYSTEM
purpose: Strict constraints for Tool creation and execution
last_updated: 2026-03-17
---

# PAL Toolbox System

**The strict specification for creating and managing PAL utilities.**
See `PHILOSOPHY.md` for narrative.

---

## 1. Tool Categorization

All tools live in either:
- **Global:** `.claude/tools/` (Hooks, global schema validators, CLI utilities).
- **Skill-Specific:** `.claude/skills/[skill]/tools/` (Actions scoped strictly to a single skill).

---

## 2. Global Core Tools

PAL ships with 4 essential global tool types that MUST NOT be removed:
1. **Notifications:** Trigger system alerts (`mac-notification.ts`).
2. **Security Validation:** `GuardRails` pre-execution logic.
3. **Schema Validation:** YAML frontmatter validators.
4. **File Validation:** Checks path constraints and link integrity.

---

## 3. Tool Creation Requirements (Bun)

All custom operational tools MUST be written using **Bun** (TypeScript) and follow this spec:

1. **Shebang:** MUST start with `#!/usr/bin/env bun`
2. **Executable:** MUST be `chmod +x`
3. **CLI Options:** MUST implement argument parsing (e.g., `parseArgs` from `util`).
4. **Help Page:** MUST generate and react to `--help` or `-h`.
5. **Exit Codes:** MUST return `0` on success, `>0` on error with `stderr` output.
6. **No Prompts:** Tools MUST run non-interactively. Pass data via arguments or STDIN.

**Example Minimal Tool:**
```typescript
#!/usr/bin/env bun
import { parseArgs } from "util";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    target: { type: 'string' },
    help: { type: 'boolean', short: 'h' },
  },
  strict: true,
  allowPositionals: true,
});

if (values.help) {
  console.log("Usage: tool.ts --target PATH");
  process.exit(0);
}

if (!values.target) {
  console.error("Error: --target is required");
  process.exit(1);
}

console.log(`Success targeting ${values.target}`);
process.exit(0);
```

---
**Version:** 1.2.0
**Last Updated:** 2026-03-17
**Related Files:** MEMORY_LOGIC.md, SKILL_LOGIC.md
