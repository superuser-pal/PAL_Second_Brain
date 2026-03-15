# PAL Second Brain - Tools and Hooks Requirements

**Document Purpose:** Functional requirements for PAL hooks and tools — TypeScript code that extends Claude Code's behavior at specific lifecycle points.

**Version:** 1.0.0
**Last Updated:** 2026-02-21

---

## What is a Hook?

A **hook** is TypeScript code that runs automatically at specific points in the PAL session lifecycle. Hooks extend Claude Code's native behavior without user intervention.

**Key Difference from Commands:**

- **Commands** require explicit invocation (e.g., `/agents:pal-builder`)
- **Hooks** run automatically at lifecycle triggers (session start, before tool use, session end)

**Hook Types:**

- `session-start` — Runs when a Claude Code session begins
- `pre-tool-use` — Runs before each tool invocation (Read, Write, Edit, Bash, etc.)
- `post-tool-use` — Runs after each tool invocation (scoped to Write/Edit for schema validation)
- `stop` — Runs when a session ends

**Hook Location:** `.claude/tools/hooks/`

---

## 4.0 Tools and Hooks Architecture Requirements

### 4.0.1 Hooks are TypeScript Files

**Given** a hook exists in PAL
**When** its location is verified
**Then** it is a `.ts` file in `.claude/tools/hooks/`

Category: Validation
Verification: Run `ls .claude/tools/hooks/` and confirm only `.ts` files exist
Source: [hooks/](.claude/tools/hooks/)

---

### 4.0.2 Hooks Execute at Lifecycle Points

**Given** hooks are configured in PAL
**When** their lifecycle trigger occurs
**Then** they execute automatically:

- `session-start.ts` — When session begins
- `pre-tool-use.ts` — Before each tool invocation
- `post-tool-use.ts` — After Write/Edit tool invocations
- `stop.ts` — When session ends

Category: Functional
Verification: Start/use tools/end session and confirm hooks execute
Source: [ARCHITECTURE.md](.claude/core/system/ARCHITECTURE.md)

---

### 4.0.3 Hooks Receive Input via stdin JSON

**Given** a hook is triggered
**When** it receives input
**Then** the input is JSON passed via stdin

**And then** the hook parses the JSON to extract relevant data

Category: Functional
Verification: Check hook source for stdin JSON parsing
Source: [pre-tool-use.ts](.claude/tools/hooks/pre-tool-use.ts)

---

### 4.0.4 Hooks Exit Cleanly on Error

**Given** a hook encounters an error
**When** the error is caught
**Then** the hook exits with code 0 to avoid blocking legitimate operations

**And then** errors are logged but do not prevent the session from continuing

Category: Functional
Verification: Introduce error in hook, confirm session continues
Source: [stop.ts](.claude/tools/hooks/stop.ts)

---

## 4.1 Hooks

### 4.1.1 session-start Hook Loads Base Context

**Given** a Claude Code session begins
**When** the session-start hook executes
**Then** PAL base context files are loaded from `.claude/core/` in priority order

Category: Functional
Verification: Start session, confirm context loading banner appears
Source: [session-start.ts](.claude/tools/hooks/session-start.ts)

---

### 4.1.2 session-start Hook Uses Priority-Based Loading

**Given** multiple base files exist
**When** files are loaded
**Then** they are loaded in priority order (lower number = higher priority):

- USER layer: Priority 1-9
- SYSTEM layer: Priority 11-15
- SECURITY layer: Priority 21-22

Category: Functional
Verification: Check session output for priority labels on loaded files
Source: [session-start.ts](.claude/tools/hooks/session-start.ts)

---

### 4.1.3 session-start Hook Reports Loading Summary

**Given** context loading completes
**When** the hook finishes
**Then** a summary is displayed showing:

- Total files loaded
- Any failed loads

Category: UI
Verification: Start session, confirm "Loaded: X files" summary appears
Source: [session-start.ts](.claude/tools/hooks/session-start.ts)

---

### 4.1.4 pre-tool-use Hook Validates Before Execution

**Given** a tool (Read, Write, Edit, Bash) is about to execute
**When** pre-tool-use hook runs
**Then** the tool input is validated against security rules

**And then** the result is one of:

- `allow` — Tool executes normally
- `warn` — Warning displayed, tool executes
- `block` — Error displayed, tool blocked

Category: Security
Verification: Attempt blocked operation, confirm block message and prevention
Source: [pre-tool-use.ts](.claude/tools/hooks/pre-tool-use.ts)

---

### 4.1.5 pre-tool-use Hook Blocks Credentials

**Given** content is being written or edited
**When** the content contains credential patterns
**Then** the operation is BLOCKED

**Blocked patterns include:**

- API keys (20+ character strings after `api_key=`)
- Passwords (after `password=`)
- Secrets (after `secret=`)
- Private keys (`-----BEGIN PRIVATE KEY-----`)
- AWS access keys (`AKIA...`)
- Stripe live keys (`sk_live_...`)
- GitHub tokens (`ghp_...`)
- Database connection strings with passwords

Category: Security
Verification: Attempt to write API key to file, confirm block
Source: [pre-tool-use.ts](.claude/tools/hooks/pre-tool-use.ts)

---

### 4.1.6 pre-tool-use Hook Allows Environment Variable References

**Given** content references credentials via environment variables
**When** patterns like `process.env.`, `Bun.env.`, `import.meta.env.` are detected
**Then** the credential check is bypassed (this is the safe pattern)

Category: Security
Verification: Write `process.env.API_KEY` to file, confirm allowed
Source: [pre-tool-use.ts](.claude/tools/hooks/pre-tool-use.ts)

---

### 4.1.7 pre-tool-use Hook Blocks Restricted Paths

**Given** a Write or Edit operation targets a file path
**When** the path matches restricted patterns
**Then** the operation is BLOCKED

**Blocked paths include:**

- System directories (`/etc/`, `/usr/`, `/bin/`, `/System/`, `/var/`)
- SSH config (`~/.ssh/`)
- AWS config (`~/.aws/`)
- GPG config (`~/.gnupg/`)
- macOS Keychain (`~/Library/Keychains/`)
- Environment files (`.env`, `.env.production`, etc.)
- Credential files (`credentials.json`)

Category: Security
Verification: Attempt to write to `/etc/hosts`, confirm block
Source: [pre-tool-use.ts](.claude/tools/hooks/pre-tool-use.ts)

---

### 4.1.8 pre-tool-use Hook Blocks Dangerous Commands

**Given** a Bash command is about to execute
**When** the command matches dangerous patterns
**Then** the operation is BLOCKED

**Blocked commands include:**

- Recursive deletion (`rm -rf /` or `~`)
- Mass file deletion (`rm *.md`)
- Overly permissive chmod (`chmod 777`)
- Disk operations (`mkfs.`, `dd if=`, `> /dev/sd`)
- Force push to main/master (`git push --force main`)
- Large git resets (`git reset --hard HEAD~10+`)
- Git clean (`git clean -fd`)
- SQL destruction (`DROP TABLE`, `TRUNCATE`, `DELETE FROM table` without WHERE)

Category: Security
Verification: Attempt `rm -rf /`, confirm block
Source: [pre-tool-use.ts](.claude/tools/hooks/pre-tool-use.ts)

---

### 4.1.9 pre-tool-use Hook Warns on PII

**Given** content contains potential PII
**When** PII patterns are detected
**Then** a WARNING is displayed but operation is ALLOWED

**PII patterns include:**

- Email addresses
- Phone numbers (xxx-xxx-xxxx)
- Social Security Numbers (xxx-xx-xxxx)
- Credit card numbers (16 digits)

Category: Security
Verification: Write email address to file, confirm warning but allowed
Source: [pre-tool-use.ts](.claude/tools/hooks/pre-tool-use.ts)

---

### 4.1.10 pre-tool-use Hook Exempts Expected PII Files

**Given** PII is being written to specific files
**When** the file path matches exception patterns
**Then** the PII warning is suppressed

**Exception files:**

- `CONTACTS.md`
- `RESUME.md`
- `.env.example`

Category: Security
Verification: Write email to CONTACTS.md, confirm no warning
Source: [pre-tool-use.ts](.claude/tools/hooks/pre-tool-use.ts)

---

### 4.1.11 pre-tool-use Hook Warns on Destructive Operations

**Given** a potentially destructive command is about to execute
**When** the command matches warning patterns
**Then** a WARNING is displayed but operation is ALLOWED

**Warning triggers:**

- `git reset --hard`
- `git stash drop`
- `DELETE FROM...WHERE` (with WHERE clause)

Category: Security
Verification: Run `git reset --hard`, confirm warning displayed
Source: [pre-tool-use.ts](.claude/tools/hooks/pre-tool-use.ts)

---

### 4.1.12 stop Hook Sends Notification

**Given** a Claude Code session ends
**When** the stop hook executes
**Then** a macOS native notification is sent with title "PAL" and message "Session complete"

Category: Functional
Verification: End session on macOS, confirm notification appears
Source: [stop.ts](.claude/tools/hooks/stop.ts)

---

### 4.1.13 stop Hook Prints Summary

**Given** a session ends
**When** the stop hook executes
**Then** a formatted summary is printed to the terminal showing:

- "PAL SESSION COMPLETE" banner
- Timestamp when session ended

Category: UI
Verification: End session, confirm summary banner in terminal
Source: [stop.ts](.claude/tools/hooks/stop.ts)

---

### 4.1.14 stop Hook Fails Silently

**Given** notification sending fails
**When** the error is caught
**Then** the hook continues and exits cleanly (non-critical failure)

Category: Functional
Verification: Disable notifications, end session, confirm no crash
Source: [stop.ts](.claude/tools/hooks/stop.ts)

---

### 4.1.15 post-tool-use Hook Validates and Heals Frontmatter Schema

**Given** a Write or Edit operation completes on a `.md` file
**When** the file path matches a validated scope (Inbox Notes, Domain Pages, Domain INDEX, Project files)
**Then** the hook reads the file from disk and validates YAML frontmatter against the required schema
**And then** attempts to auto-heal missing standard fields (e.g. injecting current timestamp or draft status)
**And then** missing fields that cannot be healed are reported as warnings via `additionalContext` JSON output

Category: Data Quality
Verification: Write a note to `Inbox/Notes/` without frontmatter, confirm schema warning appears
Source: [post-tool-use.ts](.claude/tools/hooks/post-tool-use.ts)

---

### 4.1.16 post-tool-use Hook Validates Inbox Notes

**Given** a file is written to `Inbox/Notes/*.md`
**When** the post-tool-use hook executes
**Then** it validates required fields: `status`, `category`, `created`, `last_modified`

Category: Data Quality
Verification: Write note to Inbox/Notes/ with missing `status`, confirm warning
Source: [post-tool-use.ts](.claude/tools/hooks/post-tool-use.ts)

---

### 4.1.17 post-tool-use Hook Validates Domain Pages

**Given** a file is written to `Domains/*/03_PAGES/*.md`
**When** the post-tool-use hook executes
**Then** it validates required fields: `status`, `domain`, `category`, `type`, `created`, `last_modified`

Category: Data Quality
Verification: Write page to domain 03_PAGES/ with missing `domain`, confirm warning
Source: [post-tool-use.ts](.claude/tools/hooks/post-tool-use.ts)

---

### 4.1.18 post-tool-use Hook Validates Domain INDEX

**Given** a file is written to `Domains/*/INDEX.md`
**When** the post-tool-use hook executes
**Then** it validates required fields: `name`, `description`, `status`, `created`, `updated`

Category: Data Quality
Verification: Write INDEX.md with missing `description`, confirm warning
Source: [post-tool-use.ts](.claude/tools/hooks/post-tool-use.ts)

---

### 4.1.19 post-tool-use Hook Validates Project Files

**Given** a file is written to `Domains/*/01_PROJECTS/PROJECT_*.md`
**When** the post-tool-use hook executes
**Then** it validates required fields: `name`, `status`, `created`

Category: Data Quality
Verification: Write PROJECT file with missing `name`, confirm warning
Source: [post-tool-use.ts](.claude/tools/hooks/post-tool-use.ts)

---

### 4.1.20 post-tool-use Hook Auto-Heals Standard Fields

**Given** a schema validation finds missing fields like `created`, `status`, or `category`
**When** the hook has valid defaults to inject
**Then** the hook silently injects these fields directly into the file's frontmatter
**And then** logs the auto-healing action via `additionalContext` JSON, avoiding blocking operations.

Category: Data Quality
Verification: Write file with missing `status` or `created` date, verify file is quietly updated by the hook
Source: [post-tool-use.ts](.claude/tools/hooks/post-tool-use.ts)

---

## Adding New Hooks

When creating new hooks:

1. **Place in `.claude/tools/hooks/`** as a `.ts` file

2. **Use appropriate hook type:**
   - `session-start` — For initialization tasks
   - `pre-tool-use` — For validation/transformation before tools
   - `post-tool-use` — For validation/enforcement after tools (scoped via matcher)
   - `stop` — For cleanup/notification tasks

3. **Handle errors gracefully** — Exit cleanly on error to avoid blocking

4. **Follow existing TypeScript patterns:**
   - Header comment block with hook type
   - Configuration object for toggleable features
   - Type definitions for input/output
   - Main async execution function

5. **Document the hook** in this requirements file following the Given-When-Then format

---

_Generated using the system-build documentation workflow._
