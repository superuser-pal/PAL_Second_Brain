---
title: PAL Memory & Context System
version: 1.0.0
layer: SYSTEM
purpose: Context tracking, history management, and hook system
last_updated: 2026-01-13
---

# PAL Memory & Context System

**Version:** 1.0.0
**Purpose:** How PAL manages context, tracks history, and uses hooks for system lifecycle control
**Layer:** SYSTEM

---

## Section 1: Context Management (PAL v1)

### Philosophy: Context Over Memory

**PAL v1 focuses on CONTEXT, not MEMORY:**

| Aspect          | Memory (PAI approach)                                   | Context (PAL approach)                   |
| --------------- | ------------------------------------------------------- | ---------------------------------------- |
| **Storage**     | Automated logging to TRACE.jsonl files                  | User-maintained Base configuration files |
| **Learning**    | System extracts patterns automatically                  | User updates files based on experience   |
| **Complexity**  | Three-tier architecture (CAPTURE/SYNTHESIS/APPLICATION) | Single-tier Base configuration           |
| **Maintenance** | System manages memory lifecycle                         | User manages configuration updates       |
| **Goal**        | System learns from interactions                         | User provides persistent context         |

### Context Sources in PAL v1

PAL maintains context through four mechanisms:

#### 1. Base Configuration Files

**Location:** `.claude/base/` | **Loaded by:** SessionStart hook | **Persistence:** User-maintained, version controlled

**Structure:** USER (9 files: identity, preferences, tools) + SYSTEM (5 files: operational logic) + SECURITY (2 files: guardrails)

**Benefits:** Always available, version controlled via Git, explicit user control, easily maintainable

## Section 2: Hook System

### What Are Hooks?

**Hooks** = TypeScript code that executes at specific system lifecycle points

**Purpose:** Provide deterministic control over system behavior

**Location:** `.claude/tools/hooks/`

**Language:** TypeScript (compiled to JavaScript)

**Execution:** Automatic at designated trigger points

### PAL Hooks (3 Essential)

PAL v1 includes 3 hooks:

#### 1. SessionStart Hook

**File:** `.claude/tools/hooks/session-start.ts`

**Trigger:** When user starts new session or reloads Claude Code

**Purpose:** Load Base configuration context

**What It Does:** Reads all Base files (USER + SYSTEM + SECURITY) → Loads into PAL Master's context → Session ready with full context

**Implementation:** Loads all three directories automatically, provides loaded files to PAL Master context

**Benefits:** Consistent context every session, automatic Base updates, no manual file specification

**User Action:** None (automatic)

#### 2. PreToolUse Hook

**File:** `.claude/tools/hooks/pre-tool-use.ts`

**Trigger:** Before PAL Master executes any tool (file write, command execution, API call, etc.)

**Purpose:** Validate operation against security rules

**What It Does:** Intercepts tool execution → Reads GUARDRAILS.md and REPOS_RULES.md → Validates operation (security rules, sensitive data, risk level) → Decision: ALLOW (safe) / WARN (risky, user approval) / BLOCK (abort)

**Validation Checks:** Catastrophic operations, credentials, PII, custom guardrail violations

**Benefits:** Automatic security enforcement, catches mistakes proactively, consistent validation, user-configurable rules

**User Action:** None (automatic), except approving warnings

**See:** [Security Validation Pattern](../../docs/patterns/Integrity/security-validation-pattern.md)

#### 3. Stop Hook

**File:** `.claude/tools/hooks/stop.ts`

**Trigger:** When user types `/stop` command or closes session

**Purpose:** Send notifications, save session data, clean up

**What It Does:** Session ends → Execute configured actions: notifications (desktop/email/Slack), save transcript, log summary, cleanup temp files

**Configuration:** Set in `.claude/settings.json` with notification channels and action preferences

**Benefits:** Never lose work (transcripts saved), completion notifications, clean shutdown, user-configurable

**User Action:** Configure in settings.json (optional)

### Hook System Benefits

**Deterministic:** Predictable execution points, consistent behavior, reliable operations across sessions

**User Control:** TypeScript code (not prompts), modifiable for custom behavior, version controlled with Base

**Extensible:** Custom hooks in future versions, grows with user needs, third-party support (PAL v2+)

**Transparent:** Visible/readable code, no hidden behavior, full user understanding

---

## Section 3: Context Best Practices

### For Users

#### 1. Keep Base Configuration Current

Update as preferences evolve, remove outdated entries, review monthly for accuracy

#### 2. Use Git for Base Configuration

Track changes (`git add .claude/Base/`), enable rollback, audit history with descriptive commits

#### 3. Separate General vs Project-Specific Context

**General** (ABOUTME, RESUME, DIRECTIVES): Reusable across projects
**Project-specific** (TERMINOLOGY, TECHSTACK): Reset per project
Use symlinks to share general files across projects

#### 4. Document Learnings Immediately

Capture insights while fresh, add to TERMINOLOGY.md immediately, brief notes better than forgetting

#### 5. Be Explicit in Base Files

Replace vague statements ("clean code", "professional tone") with specific guidelines ("functions < 20 lines, TypeScript strict mode", "conversational yet authoritative, active voice")

### For PAL Master

#### 1. Load Base Context Every Session

SessionStart hook handles automatically, verify successful load at session start

#### 2. Reference Base Context Frequently

Check DIRECTIVES.md (communication), TECHSTACK.md (technical choices), TERMINOLOGY.md (vocabulary), GUARDRAILS.md (risky operations)

#### 3. Suggest Base Updates When Appropriate

When user expresses new preference, offer to update relevant Base file to persist for future sessions

#### 4. Explain Context-Based Decisions

When Base context influences decisions, explain the reasoning to help users understand, catch outdated config, and learn system behavior

---

## Section 4: Troubleshooting Context Issues

| Issue                          | Symptoms                                             | Causes                                                                  | Solutions                                                                                                                                                                       |
| ------------------------------ | ---------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AI Behavior Misalignment**   | PAL Master choices don't match preferences           | Outdated Base config, hook load failure, ambiguous directives           | Verify Base loaded (`/context`), update outdated files, make directives explicit, check conflicts, restart session                                                              |
| **SessionStart Hook Failure**  | PAL Master lacks Base context                        | Hook file missing, wrong Base location, execution error                 | Verify `.claude/tools/hooks/session-start.ts` exists, check Base directory structure (USER/9, SYSTEM/5, SECURITY/2), review error messages, manually reference Base as fallback |
| **Security Validation Issues** | PreToolUse blocks legitimate ops OR allows risky ops | GUARDRAILS.md rules too strict/loose, validation logic needs adjustment | Review/update GUARDRAILS.md rules, test specific operations, add exceptions for edge cases, adjust hook logic carefully                                                         |
| **TERMINOLOGY.md Ignored**     | PAL Master doesn't use project vocabulary            | File not loaded, terms not explicit, conflicting standard vocab         | Verify load via `/context`, make terms explicit with "ALWAYS/NEVER" rules, emphasize in conversation, clarify conflicting terms                                                 |

---

## Conclusion

PAL's memory and context system provides **persistent, user-controlled context** through:

1. **Four Context Sources**

   - Base Configuration Files (persistent user context)
   - Session Transcripts (current conversation)
   - Git History (change tracking)
   - User-Maintained TERMINOLOGY.md (project learnings)

2. **Three Essential Hooks**

   - SessionStart (load Base context)
   - PreToolUse (security validation)
   - Stop (notifications and cleanup)

3. **User-Driven Learning Loop**

   - Users capture learnings manually
   - Base files updated based on experience
   - No automated memory system in v1

4. **Future Enhancement Path**
   - Three-tier memory system (PAL v2+)
   - Automated learning extraction (PAL v2+)
   - Historical context archive (PAL v2+)

**For Users:**

- Maintain Base configuration files
- Update TERMINOLOGY.md with learnings
- Use Git to track configuration evolution
- Review and refine context regularly

**For PAL Master:**

- Load Base context every session (SessionStart hook)
- Reference Base context when making decisions
- Validate operations with PreToolUse hook
- Suggest Base updates when appropriate

---

**Document Version:** 1.0.0
**Last Updated:** 2026-01-14
**Related Files:** ARCHITECTURE.md, ORCHESTRATION.md, WORKFLOWS.md, TOOLBOX.md, GUARDRAILS.md

---

## Migration & Integration

> **AI INSTRUCTIONS**: When this file is placed in a new project, follow these integration steps.

### Layer Classification

- **Layer**: SYSTEM
- **Priority**: 14 (after WORKFLOWS - context and hooks)
- **Dependencies**: ARCHITECTURE.md (hook system defined in architecture)

### Target Location

```
[PROJECT_ROOT]/PAL_Base/System/MEMORY_LOGIC.md
```

### Integration Steps

1. **Verify Directory Structure**

   ```bash
   mkdir -p PAL_Base/System
   ```

2. **Place File**

   - Copy this file to `PAL_Base/System/MEMORY_LOGIC.md`
   - Preserve UPPERCASE filename

3. **Register in SessionStart Hook**

   ```typescript
   // In .claude/hooks/session-start.ts
   const systemFiles = [
     "PAL_Base/System/ARCHITECTURE.md", // Priority: 11
     "PAL_Base/System/ORCHESTRATION.md", // Priority: 12
     "PAL_Base/System/WORKFLOWS.md", // Priority: 13
     "PAL_Base/System/MEMORY_LOGIC.md", // Priority: 14
     "PAL_Base/System/TOOLBOX.md", // Priority: 15
   ];
   ```

4. **Validate Integration**
   - Start new Claude Code session
   - Verify SessionStart hook loads context
   - Test that context persists through session

### How This File Is Used

| System Component       | Usage                                                      |
| ---------------------- | ---------------------------------------------------------- |
| **Hook System**        | Defines 3 essential hooks (SessionStart, PreToolUse, Stop) |
| **Context Management** | Explains 4 context sources                                 |
| **PAL Master**         | References for context loading and refresh                 |
| **User Learning**      | Explains user-driven context maintenance                   |

### Customization Required

This file is **reference documentation** - typically NOT customized:

- [ ] **Review** - Understand 4 context sources
- [ ] **Validate** - Ensure hook implementations match specifications
- [ ] **Optional** - Add notes about custom context handling

### First-Use Checklist

- [ ] File placed in `PAL_Base/System/`
- [ ] SessionStart hook loads file at priority 14
- [ ] 3-hook system understood
- [ ] Context sources identified
- [ ] Hooks implemented correctly
