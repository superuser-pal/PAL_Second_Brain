---
title: PAL Settings Template
version: 1.0.0
category: Configuration
layer: DOCS
purpose: Template for .claude/settings.json configuration
audience: Technical-curious professionals setting up PAL
last_updated: 2026-01-14
---

# PAL Settings Template

**Version:** 1.0.0
**Purpose:** Template for configuring `.claude/settings.json` in your production project
**Layer:** DOCS (Configuration Reference)

---

## Overview

The `.claude/settings.json` file configures Claude Code's behavior in your project. This template provides the PAL-specific configuration needed to enable the three-layer architecture, hook system, and skill routing.

---

## Complete Settings Template

Copy this template to `.claude/settings.json` in your production project:

```json
{
  // ═══════════════════════════════════════════════════════════════════
  // PAL SYSTEM CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────────
  // HOOK CONFIGURATION
  // Hooks execute at specific lifecycle points
  // ─────────────────────────────────────────────────────────────────

  "hooks": {

    // SessionStart: Loads Base context at session initialization
    // Triggers: When a new Claude Code session begins
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bun run .claude/hooks/session-start.ts"
          }
        ]
      }
    ],

    // PreToolUse: Security validation before tool execution
    // Triggers: Before any tool (file write, bash command, etc.) executes
    "PreToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "bun run .claude/hooks/pre-tool-use.ts"
          }
        ]
      }
    ],

    // Stop: Cleanup and notifications on session end
    // Triggers: When session ends (user types /stop or exits)
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bun run .claude/hooks/stop.ts"
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // SKILL PATHS
  // Where PAL looks for domain-specific skills
  // ─────────────────────────────────────────────────────────────────

  "skills": {
    "paths": [
      ".claude/skills"
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // MODEL PREFERENCES
  // Default model and behavior settings
  // ─────────────────────────────────────────────────────────────────

  "model": {
    "default": "claude-sonnet-4-20250514",
    "allowedModels": [
      "claude-sonnet-4-20250514",
      "claude-opus-4-20250514"
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // PERMISSIONS
  // What operations are allowed without confirmation
  // ─────────────────────────────────────────────────────────────────

  "permissions": {
    "allowedTools": [
      "Read",
      "Glob",
      "Grep",
      "WebFetch",
      "WebSearch"
    ],
    "requireConfirmation": [
      "Write",
      "Edit",
      "Bash",
      "NotebookEdit"
    ]
  }
}
```

---

## Configuration Sections Explained

### Hook Configuration

| Hook | Purpose | When It Runs |
|------|---------|--------------|
| **SessionStart** | Load PAL_Base context | New session begins |
| **PreToolUse** | Security validation | Before any tool executes |
| **Stop** | Notifications, cleanup | Session ends |

**Matcher Options for PreToolUse:**
- `"*"` - Match all tools
- `"Write"` - Match only Write tool
- `"Bash"` - Match only Bash tool
- Can use array: `["Write", "Edit", "Bash"]`

### Skill Paths

PAL looks for skills in the configured paths. Each skill directory should contain:
- `SKILL.md` - Skill definition with USE WHEN clauses
- `workflows/` - Workflow definitions (optional)
- `templates/` - Reusable templates (optional)

### Model Preferences

Configure which models PAL can use:
- `default` - Model used for normal operations
- `allowedModels` - Models available for switching

### Permissions

Control which tools require user confirmation:
- `allowedTools` - Execute without confirmation (read-only operations)
- `requireConfirmation` - Prompt user before execution (write operations)

---

## Minimal Configuration

If you want to start with a minimal setup, use this:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bun run .claude/hooks/session-start.ts"
          }
        ]
      }
    ]
  }
}
```

This loads Base context at session start. Add other hooks as needed.

---

## Advanced Configuration

### Custom Hook Matchers

Target specific tools with PreToolUse:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bun run .claude/hooks/validate-write.ts"
          }
        ]
      },
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bun run .claude/hooks/validate-bash.ts"
          }
        ]
      }
    ]
  }
}
```

### Environment-Specific Settings

For different environments, create separate settings files:
- `.claude/settings.json` - Default/development
- `.claude/settings.production.json` - Production overrides

---

## Validation

After configuring settings.json, validate with:

1. **Start new session** - Check SessionStart hook fires
2. **Run `/context`** - Verify Base files are loaded
3. **Attempt write operation** - Check PreToolUse validation
4. **End session** - Verify Stop hook notifications

---

## Troubleshooting

### Hook Not Firing

**Symptoms:** Base context not loaded, no security validation
**Check:**
- File exists at `.claude/settings.json`
- JSON syntax is valid (no trailing commas)
- Hook scripts exist at specified paths
- Bun is installed and accessible

### Permission Errors

**Symptoms:** "Permission denied" when running hooks
**Check:**
- Hook scripts have execute permission: `chmod +x .claude/hooks/*.ts`
- Bun can access the script directory

### Settings Not Applied

**Symptoms:** Default behavior instead of configured
**Check:**
- Restart Claude Code session (settings load at start)
- Verify settings.json is in project root's `.claude/` directory
- Check for JSON parsing errors

---

## Related Files

- [HOOK_TEMPLATES.md](HOOK_TEMPLATES.md) - Hook implementation templates
- [MIGRATION_CHECKLIST.md](MIGRATION_CHECKLIST.md) - Complete setup guide
- [ARCHITECTURE.md](../System/ARCHITECTURE.md) - System design reference

---

## Migration & Integration

> **AI INSTRUCTIONS**: When this file is placed in a new project, follow these integration steps.

### Layer Classification
- **Layer**: DOCS (Configuration Reference)
- **Priority**: N/A (reference document, not loaded by hooks)
- **Dependencies**: None

### Target Location
```
[PROJECT_ROOT]/PAL_Base/Docs/SETTINGS_TEMPLATE.md
```

### Integration Steps

1. **Place File**
   - Copy to `PAL_Base/Docs/SETTINGS_TEMPLATE.md`
   - This is a reference document, not loaded at runtime

2. **Create Actual Settings**
   - Copy the template JSON to `.claude/settings.json`
   - Adjust paths if your structure differs

3. **Verify Hook Paths**
   - Ensure hook scripts exist at paths specified in settings
   - Create hooks using HOOK_TEMPLATES.md as reference

### How This File Is Used

| User/System | Usage |
|-------------|-------|
| **User** | Reference when setting up new project |
| **AI** | Reference when troubleshooting configuration |
| **Hooks** | Not used directly - template only |

### Customization Required

When creating `.claude/settings.json` from this template:

- [ ] Adjust hook script paths if using different directory structure
- [ ] Configure model preferences for your needs
- [ ] Set appropriate permission levels
- [ ] Add skill paths if using custom skills

### First-Use Checklist
- [ ] Template file in `PAL_Base/Docs/`
- [ ] Actual settings.json created in `.claude/`
- [ ] Hook scripts exist at configured paths
- [ ] New session validates hooks fire correctly

---

**Document Version:** 1.0.0
**Last Updated:** 2026-01-14
**Related Files:** HOOK_TEMPLATES.md, MIGRATION_CHECKLIST.md
