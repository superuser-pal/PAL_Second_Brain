---
title: PAL Memory System
version: 1.0.0
layer: SYSTEM
purpose: Strict constraints for Context Lifecycle and State Management
last_updated: 2026-03-17
---

## 1. Context Lifecycle (Hooks)

PAL uses four strict hooks to manage memory and interactions.

| Hook | Execution Event | Required Actions |
| :--- | :--- | :--- |
| **SessionStart** | `session-start.ts` | 1. Load USER constraints `ABOUTME, DIRECTIVES, TERMINOLOGY, CONTACTS`.<br>2. Load SYSTEM constraints (`.claude/core/system/`).<br>3. Block on SECURITY (`GUARDRAILS`, `REPOS_RULES`). |
| **PreToolUse** | `pre-tool-use.ts` | **SECURITY BLOCK**: Must validate against blocklists *before* any tool execution. Halt on failure. |
| **PostToolUse** | `post-tool-use.ts` | Validate YAML schemas on newly created/modified files. Format terminal outputs cleanly. |
| **Stop** | `stop-hook.ts` | Triggers notification sound (`play -q`). Saves final state. |

---

## 2. Configuration Settings (`settings.json`)

Context behaviors are controlled globally via `.claude/settings.json`.

```json
{
  "context": {
    "autoLoadPatterns": ["**/*.md", "**/*.ts"],
    "maxTokens": 100000 
  },
  "hooks": {
    "enabled": true,
    "strictMode": true 
  }
}
```

---

## 3. Session State & Memory Transfer

1. **Short-Term Memory:** Active transcript stored in memory. Maximize efficiency by NOT keeping huge files in active context unless actively reading them.
2. **Long-Term Memory:** 
   - Global memory → Files in `Layers/USER/`.
   - Domain memory → Files in `Domains/[Domain]/00_CONTEXT/`.
3. **Handoff (The Handoff Memory File):** 
   - `*delegate` writes tasks to `.claude/sessions/.handoff_context.md`.
   - The newly invoked agent reads and deletes this file.

---
