# PAL Second Brain - Skills Requirements

**Document Purpose:** Functional requirements for all PAL skills, written for non-technical builders and developers.

**Version:** 1.5.0
**Last Updated:** 2026-03-08

---

## What is a Skill?

A skill is a reusable capability that PAL can use to perform specific tasks. Think of skills as tools in a toolbox — they can be activated when needed and provide specialized functionality.

**Key Concept:** Skills activate automatically when your request matches their "USE WHEN" triggers. You don't need to explicitly call a skill; just describe what you want to do.

---

## 1.0 Skill Architecture Requirements

### 1.0.1 Skills Activate via Intent Matching

**Given** a skill has a USE WHEN trigger in its description
**When** a user's request conceptually matches that trigger
**Then** the skill activates and its workflows become available

Category: Functional
Verification: Say "I want to create a new agent" and confirm create-agent skill activates
Source: [SKILL_LOGIC.md](.claude/core/system/SKILL_LOGIC.md)

---

### 1.0.2 Skill Directory Structure is Flat

**Given** a skill exists in `.claude/skills/`
**When** the skill is structured
**Then** it follows a flat hierarchy with maximum 2 levels:

```
.claude/skills/skill-name/
├── SKILL.md              # Main skill file (always uppercase)
├── context_file.md       # Context files in root (lower_snake_case)
├── workflows/            # Workflow files only
│   └── workflow_name.md
└── tools/                # CLI tools only (always present)
    └── tool_name.ts
```

Category: Validation
Verification: Check any skill directory and confirm no nesting beyond 2 levels
Source: [SKILL_LOGIC.md](.claude/core/system/SKILL_LOGIC.md)

---

### 1.0.3 Context Files Live in Skill Root

**Given** a skill needs additional documentation or reference files
**When** these files are created
**Then** they are placed directly in the skill root directory (NOT in a `context/` or `docs/` subdirectory)

Category: Validation
Verification: Confirm no `context/` or `docs/` subdirectories exist in any skill
Source: [SKILL_LOGIC.md](.claude/core/system/SKILL_LOGIC.md)

---

### 1.0.4 tools/ Directory Always Present

**Given** a skill is created
**When** the skill structure is set up
**Then** a `tools/` directory is created (even if empty)

Category: Validation
Verification: Check any skill directory and confirm `tools/` folder exists
Source: [SKILL_LOGIC.md](.claude/core/system/SKILL_LOGIC.md)

---

## 1.1 Skill: create-agent

**What It Does:** Creates and validates domain agents — the specialized personas that handle specific project areas.

**Activates When:** User mentions "create agent", "new agent", "agent structure", "validate agent", "check agent", "domain agent"

**Source:** [create-agent SKILL.md](.claude/skills/create-agent/SKILL.md)

---

### 1.1.1 Verify Domain Exists Before Agent Creation

**Given** a user requests a new agent
**When** the create-agent skill processes the request
**Then** it checks if the target domain exists in `domains/[domain-name]/`

**If the domain is missing:**
**Then** the skill stops and asks the user to create the domain first

Category: Validation
Verification: Attempt to create agent without domain; confirm system stops and prompts for domain creation
Source: [create-agent SKILL.md](.claude/skills/create-agent/SKILL.md)

---

### 1.1.2 Create Agent with Correct YAML Structure

**Given** a domain exists for the new agent
**When** the agent file is created
**Then** it contains exactly 4 YAML fields:
- `name` (lower-kebab-case, matches filename)
- `description` (brief purpose)
- `version` (semantic version like 1.0.0)
- `domain` (matches existing domain directory)

Category: Validation
Verification: Create an agent and confirm YAML has exactly 4 fields
Source: [create-agent SKILL.md](.claude/skills/create-agent/SKILL.md)

---

### 1.1.3 Agent File is Single Markdown File

**Given** an agent is created
**When** the agent is stored
**Then** it is saved as a single `.md` file in `.claude/agents/` (no subdirectories for agents)

Category: Validation
Verification: Check `.claude/agents/` and confirm only `.md` files exist, no folders
Source: [AGENTS_LOGIC.md](.claude/core/system/AGENTS_LOGIC.md)

---

### 1.1.4 Agent Uses 8-Section Structure

**Given** an agent file is created
**When** the content is written
**Then** it follows the 8-section structure:
1. Identity & Persona
2. Activation Protocol
3. Command Menu
4. How I Work
5. My Capabilities
6. Session State Model
7. Error Handling & Recovery
8. Operational Rules

Category: Validation
Verification: Open any agent file and confirm all 8 sections are present
Source: [agent_template.md](.claude/skills/create-agent/agent_template.md)

---

### 1.1.5 Validate Agent Structure on Request

**Given** a user asks to validate an agent
**When** the validation runs
**Then** it checks:
- YAML has exactly 4 fields
- Domain exists and has INDEX.md
- 8-section structure is present
- Section 5 lists capabilities with `use_when` triggers
- Agent has entry in ROUTING_TABLE.md

Category: Validation
Verification: Run validate-agent on a known-good agent and confirm it passes all checks
Source: [validate_agent.md](.claude/skills/create-agent/workflows/validate_agent.md)

---

## 1.2 Skill: create-domain

**What It Does:** Creates and manages PAL domains (project workspaces) with standardized folder structures.

**Activates When:** User mentions "create domain", "new domain", "domain structure", "validate domain", "map domain", "sync domain", "archive domain", "project workspace", "housekeeping"

**Source:** [create-domain SKILL.md](.claude/skills/create-domain/SKILL.md)

---

### 1.2.1 Create Domain with 6 Core Folders

**Given** a user requests a new domain
**When** the domain is created
**Then** it contains:
- `INDEX.md` (at root - Source of Truth)
- `CONNECTIONS.yaml` (at root - external integrations)
- `00_CONTEXT/` (background and reference docs)
- `01_PROJECTS/` (active project files)
- `04_SESSIONS/` (session logs)
- `02_PAGES/` (reference materials)
- `03_OUTPUT/` (generated deliverables)
- `05_ARCHIVE/` (deprecated content)

Category: Functional
Verification: Create a domain and confirm all folders and files exist
Source: [create-domain SKILL.md](.claude/skills/create-domain/SKILL.md)

---

### 1.2.2 Generate INDEX.md with Standard Template

**Given** a domain is created
**When** INDEX.md is generated
**Then** it includes:
- YAML frontmatter with domain metadata
- Active Work table
- Key Facts section
- Quick Reference section

Category: Functional
Verification: Create a domain and confirm INDEX.md has all required sections
Source: [DOMAINS_LOGIC.md](.claude/core/system/DOMAINS_LOGIC.md)

---

### 1.2.3 Enforce Nesting Limit

**Given** files are added to a domain
**When** the folder structure grows
**Then** it does not exceed three vertical levels below the domain root

Category: Validation
Verification: Attempt to create deeply nested folders and confirm system prevents or warns
Source: [DOMAINS_LOGIC.md](.claude/core/system/DOMAINS_LOGIC.md)

---

### 1.2.4 Map Domain Detects Naming Violations

**Given** a user runs the map_domain workflow
**When** the system scans domain folders
**Then** it detects files that violate naming conventions
**And then** offers to auto-fix with user confirmation

Category: Validation
Verification: Add a misnamed file to a domain, run map_domain, confirm it's detected
Source: [map_domain.md](.claude/skills/create-domain/workflows/map_domain.md)

---

### 1.2.5 Archive Domain Moves to 05_ARCHIVE

**Given** a user wants to archive old content
**When** the archive_domain workflow runs
**Then** the file is moved to `05_ARCHIVE/` with a deprecation header
**And then** INDEX.md is updated to remove it from Active Work

Category: Functional
Verification: Archive a project file and confirm it moves to 05_ARCHIVE with header
Source: [archive_domain.md](.claude/skills/create-domain/workflows/archive_domain.md)

---

## 1.3 Skill: create-skill

**What It Does:** Creates and validates PAL skills with proper structure, naming, and USE WHEN triggers.

**Activates When:** User mentions "create skill", "new skill", "skill structure", "canonicalize", "validate skill", "check skill"

**Source:** [create-skill SKILL.md](.claude/skills/create-skill/SKILL.md)

---

### 1.3.1 Create Skill with Correct Directory Structure

**Given** a user requests a new skill
**When** the skill is created
**Then** it includes:
- `SKILL.md` (uppercase, main skill file)
- `workflows/` directory
- `tools/` directory (even if empty)

Category: Functional
Verification: Create a skill and confirm all three components exist
Source: [create-skill SKILL.md](.claude/skills/create-skill/SKILL.md)

---

### 1.3.2 SKILL.md Includes USE WHEN Trigger

**Given** a skill is created
**When** SKILL.md is written
**Then** the description field includes a USE WHEN clause that describes activation triggers

Category: Validation
Verification: Check any SKILL.md and confirm USE WHEN is present in description
Source: [SKILL_LOGIC.md](.claude/core/system/SKILL_LOGIC.md)

---

### 1.3.3 Skill Name Uses Kebab Case

**Given** a skill is created
**When** the directory and YAML name are set
**Then** they use `lower-kebab-case` (e.g., `create-skill`, `note-taking`)

Category: Validation
Verification: Create a skill and confirm directory name uses kebab-case
Source: [SKILL_LOGIC.md](.claude/core/system/SKILL_LOGIC.md)

---

### 1.3.4 Workflow Files Use Snake Case

**Given** workflows are added to a skill
**When** workflow files are named
**Then** they use `lower_snake_case` (e.g., `create_skill.md`, `validate_skill.md`)

Category: Validation
Verification: Check workflows/ folder and confirm files use snake_case
Source: [SKILL_LOGIC.md](.claude/core/system/SKILL_LOGIC.md)

---

### 1.3.5 Validate Skill Reports Issues with Fixes

**Given** a user validates a skill
**When** issues are found
**Then** the system reports each issue with a specific fix recommendation

Category: Functional
Verification: Validate a skill with known issues and confirm fixes are suggested
Source: [validate_skill.md](.claude/skills/create-skill/workflows/validate_skill.md)

---

### 1.3.6 Canonicalize Fixes Non-Standard Naming

**Given** a skill has files with incorrect naming
**When** the canonicalize workflow runs
**Then** it renames files to match conventions
**And then** updates routing tables to match

Category: Functional
Verification: Create misnamed files, run canonicalize, confirm they're renamed
Source: [canonicalize_skill.md](.claude/skills/create-skill/workflows/canonicalize_skill.md)

---

## 1.4 Skill: note-taking

**What It Does:** Manages notes with semantic structure and knowledge graph capabilities — from inbox through processing to distribution across domains. Supports observation categories, entity types, relation types, dedup detection, and braindump splitting.

**Activates When:** User mentions "process notes", "organize notes", "add frontmatter", "distribute notes", "ingest PDF", "ingest document", "convert document", "inbox notes", "note management", "scan inbox", "move notes to domain", "braindump", "brain dump", "capture thoughts", "dump thoughts", "url dump", "save link", "bookmark url", "capture url", "save for later", "categorize observations", "add relations", "link notes", "knowledge graph", "export life summary", "life report", "generate life summary"

**Note:** As of v1.5.0, this skill absorbs life-management functionality. Life context updates flow through braindump → distribute workflows.

**Source:** [note-taking SKILL.md](.claude/skills/note-taking/SKILL.md)

---

### 1.4.1 Process Inbox Adds Frontmatter

**Given** raw notes exist in `inbox/notes/` without YAML frontmatter
**When** the process_inbox workflow runs
**Then** it prompts for domain, project, and category
**And then** adds standardized YAML frontmatter to each note

Category: Functional
Verification: Add a note without frontmatter, run process_inbox, confirm frontmatter added
Source: [process_inbox.md](.claude/skills/note-taking/workflows/process_inbox.md)

---

### 1.4.2 Distribute Notes Moves to Domain Assets

**Given** processed notes have `status: ready` in frontmatter
**When** the distribute_notes workflow runs
**Then** notes are moved to `domains/[domain]/02_PAGES/`
**And then** if a project field is set, a reference link is added to the corresponding PROJECT_*.md

Category: Functional
Verification: Process a note with project field, distribute, confirm it moves and link is added
Source: [distribute_notes.md](.claude/skills/note-taking/workflows/distribute_notes.md)

---

### 1.4.3 Ingest Longform Converts Documents to Markdown

**Given** PDF, DOCX, or TXT files exist in `ports/In/`
**When** the ingest_longform workflow runs
**Then** the content is converted to structured markdown
**And then** AI generates a summary and key ideas
**And then** YAML frontmatter is added with source metadata
**And then** output goes to `inbox/notes/` for processing

Category: Functional
Verification: Place a PDF in ports/In/, run ingest, confirm markdown with summary appears
Source: [ingest_longform.md](.claude/skills/note-taking/workflows/ingest_longform.md)

---

### 1.4.4 Leave Unprocessed Notes in Place

**Given** notes without frontmatter exist in inbox
**When** the distribute_notes workflow runs
**Then** it leaves those notes in the inbox (only moves ready notes)

Category: Functional
Verification: Have mixed notes (with/without frontmatter), distribute, confirm only ready ones move
Source: [distribute_notes.md](.claude/skills/note-taking/workflows/distribute_notes.md)

---

### 1.4.5 Braindump Captures Stream-of-Consciousness Thoughts

**Given** user triggers "braindump" or "brain dump"
**When** the braindump workflow runs
**Then** it captures raw input without filtering
**And then** analyzes content for themes, energy level, and emotional tone
**And then** extracts questions, decisions, and action items

Category: Functional
Verification: Run "braindump", provide thoughts, confirm analysis with themes and action items
Source: [braindump.md](.claude/skills/note-taking/workflows/braindump.md)

---

### 1.4.6 Braindump Auto-Detects Life Categories

**Given** braindump content contains life-context patterns
**When** analysis completes
**Then** it detects category (beliefs, mission, frames, models, learned, goals, projects) with confidence level
**And then** presents detection to user for confirmation before categorizing

Category: Functional
Verification: Input "I believe X" and confirm beliefs.md category detected with Strong confidence
Source: [braindump.md](.claude/skills/note-taking/workflows/braindump.md)

---

### 1.4.7 URL Dump Captures Links with Content Extraction

**Given** user triggers "url dump" or "save link"
**When** the url_dump workflow runs
**Then** it fetches page content via WebFetch
**And then** generates executive summary and key insights
**And then** creates structured note with frontmatter in inbox/notes/

Category: Functional
Verification: Run "url dump" with a URL, confirm content extracted with summary and insights
Source: [url_dump.md](.claude/skills/note-taking/workflows/url_dump.md)

---

### 1.4.8 URL Dump Detects Content Type

**Given** url_dump processes a URL
**When** content analysis runs
**Then** it detects content type (article, tool, video, reference, research)
**And then** applies appropriate template (Tool template includes pricing, features, evaluation checklist)

Category: Functional
Verification: Process a GitHub repo URL and confirm it's detected as "tool" with tool template applied
Source: [url_dump.md](.claude/skills/note-taking/workflows/url_dump.md)

---

### 1.4.9 Observation Categories Supported in Notes

**Given** a user writes a note with observation syntax
**When** the syntax `- [category] content #tag1 #tag2` is used
**Then** the observation is preserved with category and tags intact
**And then** only valid categories are accepted: fact, idea, decision, technique, requirement, question, insight, problem, solution, action

Category: Functional
Verification: Add `- [fact] API rate limit is 1000/hour #api` to a note, confirm syntax preserved
Source: [observation_categories.md](.claude/skills/note-taking/templates/observation_categories.md)

---

### 1.4.10 Process Inbox Suggests Observation Categories

**Given** raw notes contain uncategorized content
**When** process_inbox workflow runs
**Then** the agent suggests appropriate observation categories for each distinct statement
**And then** presents extractions to user for confirmation/adjustment

Category: Functional
Verification: Process a note with uncategorized statements, confirm category suggestions appear
Source: [process_inbox.md](.claude/skills/note-taking/workflows/process_inbox.md)

---

### 1.4.11 Invalid Observation Categories Flagged

**Given** a note contains an invalid observation category (e.g., `- [random] content`)
**When** the note is processed
**Then** the agent flags it and suggests a valid category from the standard list

Category: Validation
Verification: Add `- [invalid] content` to a note, process, confirm warning with valid category suggestion
Source: [observation_categories.md](.claude/skills/note-taking/templates/observation_categories.md)

---

### 1.4.12 Entity Types in Frontmatter

**Given** a note is processed via process_inbox
**When** the agent analyzes content
**Then** it suggests an appropriate entity type from: concept, decision, reference, meeting, braindump, idea
**And then** sets the `type` field in frontmatter based on user confirmation

Category: Functional
Verification: Process a meeting note, confirm `type: meeting` suggested and applied
Source: [entity_types.md](.claude/skills/note-taking/templates/entity_types.md)

---

### 1.4.13 Entity Type Determines Template Sections

**Given** a note has a `type` field set (e.g., `type: decision`)
**When** viewing the note structure
**Then** it includes type-specific sections (decision includes Context, Options, Decision, Rationale, Consequences)

Category: Functional
Verification: Create note with `type: decision`, confirm type-specific sections present
Source: [entity_types.md](.claude/skills/note-taking/templates/entity_types.md)

---

### 1.4.14 Default Entity Type for Untyped Notes

**Given** a note has no explicit `type` field
**When** processing completes
**Then** it defaults to `type: note` with generic template (title, content, tags only)

Category: Functional
Verification: Process a note without specifying type, confirm `type: note` applied
Source: [entity_types.md](.claude/skills/note-taking/templates/entity_types.md)

---

### 1.4.15 Relation Types Between Notes

**Given** a user edits a note
**When** they add `- relation_type [[Target Note]]` in a Relations section
**Then** the relation is preserved and the wikilink is clickable in Obsidian
**And then** only valid types accepted: part_of, supports, contradicts, evolved_from, informs, blocks, inspired_by, relates_to, originated_with, follows

Category: Functional
Verification: Add `- supports [[Another Note]]` to Relations section, confirm wikilink works in Obsidian
Source: [relation_types.md](.claude/skills/note-taking/templates/relation_types.md)

---

### 1.4.16 Forward References Allowed in Relations

**Given** a note references a target note that doesn't exist yet
**When** viewing in Obsidian
**Then** the forward reference is displayed as an unresolved link
**And then** it resolves automatically when the target note is created

Category: Functional
Verification: Add relation to non-existent note, confirm unresolved link displays, create target, confirm link resolves
Source: [relation_types.md](.claude/skills/note-taking/templates/relation_types.md)

---

### 1.4.17 Maximum 5 Relations Per Note

**Given** a note being created or edited
**When** the relation count reaches 5
**Then** the system stops accepting additional relations
**And then** presents option to replace existing or skip

Category: Validation
Verification: Attempt to add 6th relation, confirm system enforces limit with replacement option
Source: [relation_types.md](.claude/skills/note-taking/templates/relation_types.md)

---

### 1.4.18 Agent-Aware Relation Suggestions

**Given** an agent is loaded with domain context
**When** process_inbox runs
**Then** the agent scans loaded context for existing notes that relate to the current note
**And then** proposes relations based on tag matches, topic similarity, and referenced concepts

Category: Functional
Verification: Load agent, process note with shared tags, confirm relation suggestions to existing notes
Source: [process_inbox.md](.claude/skills/note-taking/workflows/process_inbox.md)

---

### 1.4.19 Relation Suggestions Require User Confirmation

**Given** the agent proposes relations
**When** presenting suggestions
**Then** user can [C]onfirm, [A]djust, or [S]kip each proposed relation
**And then** only confirmed relations are added to the note

Category: Functional
Verification: Receive relation suggestions, skip one, confirm it's not added to note
Source: [process_inbox.md](.claude/skills/note-taking/workflows/process_inbox.md)

---

### 1.4.20 Dedup Check Before Note Creation

**Given** process_inbox runs with an agent loaded
**When** a similar note exists in the target domain (score >= 60%)
**Then** the agent asks: append to existing OR create separate with relation
**And then** applies user's choice

**Scoring algorithm:**
- Exact title match: 100%
- Same domain + 2+ tags: 40%
- Content Jaccard > 0.5: 30%
- 1 shared tag: 20%
- Threshold: >= 60% triggers prompt

Category: Functional
Verification: Process note similar to existing one, confirm dedup prompt with merge/relate options
Source: [process_inbox.md](.claude/skills/note-taking/workflows/process_inbox.md)

---

### 1.4.21 Action Observations Dual-Written to PROJECT Files

**Given** a note contains `- [action] content` observations
**And given** an agent has project context loaded
**When** distribute_notes runs
**Then** each action is created as a task in the relevant PROJECT file: `- [ ] content (from: [[Source Note]])`

Category: Functional
Verification: Add `[action]` observation, distribute with agent, confirm task appears in PROJECT file with backlink
Source: [distribute_notes.md](.claude/skills/note-taking/workflows/distribute_notes.md)

---

### 1.4.22 Blind Mode Without Agent

**Given** no agent is loaded
**When** process_inbox runs
**Then** it offers choice: proceed with partial processing OR load agent first
**And then** if user proceeds, sets `domain: _unassigned`, `project: _unassigned`, `status: draft`

Category: Functional
Verification: Run process_inbox without agent, choose proceed, confirm draft status and _unassigned fields
Source: [process_inbox.md](.claude/skills/note-taking/workflows/process_inbox.md)

---

### 1.4.23 Draft Notes Skipped by Distribute

**Given** notes have `status: draft` or `domain: _unassigned`
**When** distribute_notes runs
**Then** those notes are skipped and remain in inbox

Category: Functional
Verification: Create draft note, run distribute, confirm it stays in inbox
Source: [distribute_notes.md](.claude/skills/note-taking/workflows/distribute_notes.md)

---

### 1.4.24 Braindump Multi-Theme Detection

**Given** braindump workflow processes content with multiple distinct themes
**When** analysis completes
**Then** it detects themes with confidence scores
**And then** presents split decision when: 2+ themes at 70%+ confidence with different categories OR domains

Category: Functional
Verification: Braindump with career goals AND recipe idea, confirm split prompt appears
Source: [braindump.md](.claude/skills/note-taking/workflows/braindump.md)

---

### 1.4.25 Braindump Split Creates Linked Notes

**Given** user chooses to split a multi-theme braindump
**When** processing completes
**Then** each theme becomes its own file with individual frontmatter
**And then** split notes contain `- originated_with [[Sibling Note]]` relations

Category: Functional
Verification: Split braindump, confirm two files with originated_with cross-references
Source: [braindump.md](.claude/skills/note-taking/workflows/braindump.md)

---

### 1.4.26 Cancel Handling Preserves State

**Given** user cancels/escapes at any workflow prompt
**When** the cancel is processed
**Then** the system preserves current state and logs "user skipped [action]"
**And then** continues to next step or gracefully exits workflow

**Cancel behaviors:**
- Dedup prompt cancel: Create as new note (no relation)
- Relation prompt cancel: Skip proposed relation
- Split prompt cancel: Keep as single note

Category: Functional
Verification: Cancel at dedup prompt, confirm note created without relation
Source: [process_inbox.md](.claude/skills/note-taking/workflows/process_inbox.md)

---

### 1.4.27 Braindump Domain Detection with Confidence Scoring

**Given** braindump content is analyzed
**When** domain detection runs (Step 4a)
**Then** it scores each domain using pattern matching:
- Primary keyword match: +40% (max 1)
- Secondary keyword match: +25% each (max 2)
- Exclusion pattern: -30% each
**And then** determines outcome:
- Top domain >= 80%: Auto-assign (high confidence)
- Top domain 60-79%: Suggest for confirmation (medium confidence)
- Multiple domains >= 70%: Show overlap menu
- No domain >= 60%: Show manual selection menu

Category: Functional
Verification: Braindump with PAL-specific content, confirm PALBuilder domain detected with score
Source: [braindump.md](.claude/skills/note-taking/workflows/braindump.md)

---

### 1.4.28 Braindump Subsection Detection Within Categories

**Given** LifeOS category is detected for braindump
**When** subsection detection runs (Step 4b)
**Then** it identifies which subsection within the category file (e.g., "Worldview" in beliefs.md)
**And then** sets `subsection: [detected]` in frontmatter
**And then** if unclear, sets `subsection: null` to append at end of file

Category: Functional
Verification: Braindump "I believe in X", confirm `subsection: Worldview` detected for beliefs.md
Source: [braindump.md](.claude/skills/note-taking/workflows/braindump.md)

---

### 1.4.29 URL Dump Tool Template for SaaS Products

**Given** url_dump processes a URL detected as "tool" type
**When** content extraction completes
**Then** it applies tool template including:
- Pricing information
- Key features list
- Evaluation checklist
**And then** saves with tool-specific structure

Category: Functional
Verification: Process a SaaS product URL, confirm tool template with pricing and evaluation sections
Source: [url_dump.md](.claude/skills/note-taking/workflows/url_dump.md)

---

### 1.4.30 Process Inbox Auto-Generates Descriptions When Skipped

**Given** user processes a note and skips description field
**When** frontmatter is added
**Then** AI generates a concise 1-2 sentence description from note content
**And then** description follows format: "[What note is about]. [Key insight or value]."

Category: Functional
Verification: Process note and skip description, confirm AI-generated description appears in frontmatter
Source: [process_inbox.md](.claude/skills/note-taking/workflows/process_inbox.md)

---

### 1.4.31 Process Inbox Ensures Protected Notes Section

**Given** a note is processed with frontmatter
**When** the workflow completes
**Then** it checks for `## Notes` section at end of file
**And then** if missing, appends protected Notes section with preservation comment
**And then** content below `## Notes` is NEVER modified by any workflow

Category: Validation
Verification: Process note without Notes section, confirm section added with preservation comment
Source: [process_inbox.md](.claude/skills/note-taking/workflows/process_inbox.md)

---

### 1.4.32 Braindump Multi-Domain Overlap Handling

**Given** braindump content scores >= 70% on multiple domains
**When** overlap is detected (Step 4e)
**Then** it presents all matched domains with scores and patterns
**And then** user selects primary destination
**And then** non-selected matches can be added as relations

Category: Functional
Verification: Braindump with content matching both Studio and LaraLou, confirm overlap menu appears
Source: [braindump.md](.claude/skills/note-taking/workflows/braindump.md)

---

### 1.4.33 Braindump Observation Extraction with Tag Suggestions

**Given** raw braindump content is analyzed
**When** observation extraction runs (Step 3b)
**Then** it identifies distinct statements
**And then** categorizes each with appropriate observation type
**And then** suggests 2-3 relevant tags per observation
**And then** presents extractions to user for confirmation/adjustment

Category: Functional
Verification: Braindump with mixed content, confirm observations extracted with category and tag suggestions
Source: [braindump.md](.claude/skills/note-taking/workflows/braindump.md)

---

### 1.4.34 Distribute Creates Backup Before LifeOS Writes

**Given** a note has a LifeOS category (beliefs.md, frames.md, learned.md, mission.md, models.md, goals.md, projects.md)
**When** distribute_notes appends content to a LifeOS file
**Then** it creates a timestamped backup at `domains/LifeOS/05_ARCHIVE/backups/[category]_YYYY-MM-DD_HH-MM-SS.md`
**And then** proceeds with the append only after backup succeeds

**If backup fails:**
**Then** STOP immediately and do NOT modify the LifeOS file

Category: Validation
Verification: Distribute a LifeOS-categorized note, confirm backup exists in 05_ARCHIVE/backups/
Source: [distribute_notes.md](.claude/skills/note-taking/workflows/distribute_notes.md)

---

### 1.4.35 Distribute Logs LifeOS Changes to UPDATES.md

**Given** distribute_notes appends content to a LifeOS file
**When** the append completes successfully
**Then** it appends an entry to `domains/LifeOS/04_SESSIONS/UPDATES.md` with:
- Timestamp
- Action performed (Appended to [category])
- Source filename
- Subsection (or "end of file")
- Backup filename

Category: Functional
Verification: Distribute a LifeOS-categorized note, confirm log entry in UPDATES.md
Source: [distribute_notes.md](.claude/skills/note-taking/workflows/distribute_notes.md)

---

### 1.4.36 Export Life Summary Generates Comprehensive Report

**Given** user triggers "export life summary" or "life report"
**When** the export_life_summary workflow runs
**Then** it reads all 7 LifeOS files (mission, beliefs, frames, models, learned, goals, projects)
**And then** generates a structured markdown summary report
**And then** saves to `domains/LifeOS/03_OUTPUT/life_summary_[YYYY-MM-DD].md`
**And then** logs the export action to UPDATES.md

Category: Functional
Verification: Run "export life summary" and confirm report created in 03_OUTPUT/
Source: [export_life_summary.md](.claude/skills/note-taking/workflows/export_life_summary.md)

---

### 1.4.37 Export Life Summary Supports Filtering

**Given** user wants a filtered life report
**When** export is invoked with filter options
**Then** it supports:
- Category export: Only specified categories (e.g., "export just goals and projects")
- Timeline export: Focus on recent changes (e.g., "export updates from last month")

Category: Functional
Verification: Run "export just goals" and confirm only goals section appears in report
Source: [export_life_summary.md](.claude/skills/note-taking/workflows/export_life_summary.md)

---

### 1.4.38 Quick Capture Fast-Path to Daily Note

**Given** user triggers "quick add", "add task", or "capture this"
**When** the quick_capture workflow runs
**Then** it prompts for the thought or task
**And then** asks if it is a task or a note
**And then** appends it directly to today's Daily Note (`Inbox/Daily/DD-MM-YY.md`) under a `## Quick Capture` section without AI analysis

Category: Functional
Verification: Run "quick add Buy milk", select Task, confirm it appears in today's daily note
Source: [quick_capture.md](.claude/skills/note-taking/workflows/quick_capture.md)

---

### 1.4.39 Distribute Extracts Standalone Tasks to Ad-Hoc Projects

**Given** a note contains actionable tasks (`- [action]` or `- [ ]`) but NO `project:` field assigned
**When** distribute_notes runs
**Then** it moves the standalone tasks to the domain's `01_PROJECTS/AD_HOC_TASKS.md`
**And then** leaves a backlink to the domain's deployed asset

Category: Functional
Verification: Distribute a note with tasks but no project, confirm tasks appear in AD_HOC_TASKS.md with source links
Source: [distribute_notes.md](.claude/skills/note-taking/workflows/distribute_notes.md)

### 1.4.40 Distribute Scans All Three Domain Pools for Matching Targets

**Given** a note with `status: ready` and no `destination` field is in the inbox
**When** distribute_notes runs
**Then** it scans `02_PAGES/`, `00_CONTEXT/`, and `01_PROJECTS/` of the note's domain for candidate files
**And then** scores each candidate using Jaccard similarity against the note's content and tags
**And then** presents all candidates scoring >= 60% as a numbered list before writing anything

Category: Functional
Verification: Distribute a ready note with no destination field, confirm candidates appear from all three pools
Source: [distribute_notes.md](.claude/skills/note-taking/workflows/distribute_notes.md)

---

### 1.4.41 Distribute Destination Field Limits Scan Pool

**Given** a note has a `destination` field set to `pages`, `context`, or `projects`
**When** distribute_notes runs
**Then** it scans only the folder matching that value
**And then** still presents a confirmation list before writing — the destination field does not bypass confirmation

Category: Functional
Verification: Set `destination: context` on a note, run distribute, confirm only 00_CONTEXT/ candidates appear
Source: [distribute_notes.md](.claude/skills/note-taking/workflows/distribute_notes.md)

---

### 1.4.42 Distribute Requires User Confirmation Before Any Write

**Given** distribute_notes has scored candidates for a note
**When** the confirmation list is presented
**Then** no file is written until the user explicitly selects targets by number
**And then** only the confirmed targets are written to

Category: Validation
Verification: Run distribute, observe the numbered list, select "none", confirm zero files are written
Source: [distribute_notes.md](.claude/skills/note-taking/workflows/distribute_notes.md)

---

### 1.4.43 Distribute Uses Agent Context as Enriched Candidate Pool

**Given** a domain agent is loaded and `.claude/sessions/.current-session` contains loaded file paths
**And given** the note's domain matches the active agent's domain
**When** distribute_notes runs
**Then** agent-loaded files appear as candidates without requiring a cold frontmatter scan
**And then** agent-context candidates are listed first in the confirmation list under an `[agent context]` header

Category: Functional
Verification: Load a domain agent, distribute a ready note for that domain, confirm agent-loaded files appear first
Source: [distribute_notes.md](.claude/skills/note-taking/workflows/distribute_notes.md)

---

### 1.4.44 Distribute Falls Back to New Page When No Matches Found

**Given** no candidate files score >= 60% similarity threshold
**When** distribute_notes has exhausted the scan pool
**Then** it presents a 3-option fallback: create new page in 02_PAGES/, expand search to all folders, or keep in inbox
**And then** proceeds only with the user's chosen option

Category: Functional
Verification: Distribute a note with unique content unlikely to match anything, confirm fallback menu appears
Source: [distribute_notes.md](.claude/skills/note-taking/workflows/distribute_notes.md)

---

### 1.4.45 Distribute Confirmation List Format Includes Path and Score

**Given** candidates are found above the similarity threshold
**When** the confirmation list is displayed
**Then** each entry shows the folder-relative path and score in the format `{folder}/{filename} (score%)`
**And then** entries from agent context are grouped separately from cold-scan results

Category: UI
Verification: Run distribute with an agent loaded, confirm list format matches `00_CONTEXT/beliefs.md (82%)` pattern
Source: [distribute_notes.md](.claude/skills/note-taking/workflows/distribute_notes.md)

---

## 1.5 Skill: project-management

**What It Does:** Manages projects and tasks across domains with bidirectional sync between project files and a master task list.

**Activates When:** User mentions "create project", "new project", "pull tasks", "sync tasks", "update plan", "project status", "list projects", "task dashboard", "archive project", "project management", "track tasks"

**Source:** [project-management SKILL.md](.claude/skills/project-management/SKILL.md)

---

### 1.5.1 Create Project Generates Standard File

**Given** a user wants to create a new project
**When** the create_project workflow runs
**Then** it asks for:
- Domain selection
- Project name
- Objective
- Initial tasks
- Priority

**And then** generates `PROJECT_[NAME].md` in the selected domain's `01_PROJECTS/`

Category: Functional
Verification: Create a project and confirm file appears in correct location with all fields
Source: [create_project.md](.claude/skills/project-management/workflows/create_project.md)

---

### 1.5.2 Pull Tasks Aggregates from All Domains

**Given** multiple domains have PROJECT_*.md files
**When** the pull_tasks workflow runs
**Then** it scans all domains for project files
**And then** extracts tasks with `#open` and `#in-progress` tags
**And then** generates `/tasks/MASTER.md` with grouped tasks

Category: Functional
Verification: Create tasks across domains, pull, confirm MASTER.md contains all
Source: [pull_tasks.md](.claude/skills/project-management/workflows/pull_tasks.md)

---

### 1.5.3 Project Dashboard Shows Summary

**Given** projects exist across domains
**When** the project_dashboard workflow runs
**Then** it displays:
- Projects grouped by status (Planning, In Progress, Review, Completed)
- High priority projects with task counts
- Overdue items (if any)

Category: UI
Verification: Create projects with different statuses, run dashboard, confirm grouping
Source: [project_dashboard.md](.claude/skills/project-management/workflows/project_dashboard.md)

---

### 1.5.4 Tasks Grouped into Active, Inactive, and Done Sections

**Given** tasks exist in project files
**When** tasks are organized
**Then** they are grouped into three sections:
- `### Active` - Contains `[ ]` (to do) and `[/]` (in-progress) tasks
- `### Inactive` - Contains `[!]` (blocked), `[?]` (paused), `[I]` (backlog), `[-]` (not doing) tasks
- `### Done` - Contains `[x]` (done) tasks

Category: Validation
Verification: Check any PROJECT_*.md and confirm three-section structure
Source: [project_template.md](.claude/skills/project-management/project_template.md)

---

### 1.5.5 Archive Project Moves to Archive Folder

**Given** a user wants to archive a completed project
**When** the archive_project workflow runs
**Then** the project file moves to `05_ARCHIVE/`
**And then** INDEX.md is updated

Category: Functional
Verification: Archive a project and confirm it moves to 05_ARCHIVE
Source: [archive_project.md](.claude/skills/project-management/workflows/archive_project.md)

---

### 1.5.6 Update Tasks Pushes TASKS.md Changes to Projects

**Given** tasks in `Inbox/Dashboards/TASKS.md` have been modified
**When** the update_tasks workflow runs
**Then** it compares TASKS.md tasks with source project files using #ProjectName tags
**And then** applies changes (status updates, task additions, completions) back to project files
**And then** updates domain INDEX.md files

Category: Functional
Verification: Modify tasks in TASKS.md, run update_tasks, confirm changes reflected in project files
Source: [update_tasks.md](.claude/skills/project-management/workflows/update_tasks.md)

---

### 1.5.7 Update Tasks Detects and Resolves Conflicts

**Given** a source project file was modified after last pull
**When** update_tasks detects timestamp conflicts
**Then** it presents options: Force update, Skip project, or Manual review
**And then** user chooses conflict resolution strategy
**And then** applies user's choice

Category: Functional
Verification: Create conflict, run update_tasks, confirm options presented
Source: [update_tasks.md](.claude/skills/project-management/workflows/update_tasks.md)

---

### 1.5.8 Update Plan Preserves Deleted Tasks (Tombstoning)

**Given** a user fully deletes a task line from `MASTER.md`
**When** the update_plan workflow detects the deletion
**Then** it prompts the user instead of silently deleting the task from the source project file
**And** provides options to archive the task, restore it, or permanently delete it.

Category: Operational
Verification: Delete a task from MASTER.md, run upate_plan, verify prompt.
Source: [update_plan.md](.claude/skills/project-management/workflows/update_plan.md)

Category: Functional
Verification: Modify project after pull, modify MASTER.md, run update_plan, confirm conflict prompt
Source: [update_plan.md](.claude/skills/project-management/workflows/update_plan.md)

---

### 1.5.8 Tasks Use Checkbox Symbols for Status

**Given** tasks exist in project files
**When** tasks are formatted
**Then** they use checkbox symbols (not hashtags):
- `[ ]` To Do (in Active section)
- `[/]` In Progress (in Active section)
- `[!]` Blocked (in Inactive section)
- `[?]` Paused (in Inactive section)
- `[I]` Backlog (in Inactive section)
- `[-]` Not Doing (in Inactive section)
- `[x]` Done (in Done section)

Category: Validation
Verification: Check any PROJECT_*.md and confirm checkbox symbol format
Source: [project_template.md](.claude/skills/project-management/project_template.md)

---

### 1.5.9 Update Plan Moves Tasks Between Sections on Status Change

**Given** a task's checkbox symbol changes in MASTER.md
**When** update_plan syncs changes
**Then** it moves the task to the appropriate section:
- `[ ]` or `[/]` → Active section
- `[!]`, `[?]`, `[I]`, `[-]` → Inactive section
- `[x]` → Done section

Category: Functional
Verification: Change task from `[ ]` to `[!]` in MASTER.md, run update_plan, confirm task moved to Inactive
Source: [update_plan.md](.claude/skills/project-management/workflows/update_plan.md)

---

### 1.5.10 Pull Tasks Includes Active and Inactive Separation

**Given** projects contain tasks with different checkbox symbols
**When** pull_tasks aggregates tasks
**Then** MASTER.md separates tasks into Active and Inactive sections per project
**And then** displays task counts by status in summary

Category: Functional
Verification: Create tasks with mixed statuses, pull tasks, confirm MASTER.md shows Active/Inactive sections
Source: [pull_tasks.md](.claude/skills/project-management/workflows/pull_tasks.md)

---

## 1.6 Skill: system-build

**What It Does:** Provides specification-driven development toolkit for building and extending PAL itself.

**Activates When:** User mentions "create spec", "specification", "feature spec", "implementation plan", "generate tasks", "task breakdown", "checklist", "clarify requirements", "analyze consistency", "constitution", "system build", "build system", "develop PAL"

**Source:** [system-build SKILL.md](.claude/skills/system-build/SKILL.md)

---

### 1.6.1 Specify Creates Feature Specification

**Given** a user wants to document a new feature
**When** the specify workflow runs
**Then** it generates:
- Feature branch name
- Feature directory
- `spec.md` using the spec template

**And then** validates spec quality

Category: Functional
Verification: Run specify workflow and confirm spec.md is created with correct structure
Source: [specify.md](.claude/skills/system-build/workflows/specify.md)

---

### 1.6.2 Plan Creates Implementation Artifacts

**Given** a spec exists for a feature
**When** the plan workflow runs
**Then** it loads the spec and constitution
**And then** creates:
- `plan.md` (technical implementation plan)
- `research.md` (background research)
- `data-model.md` (data structure definitions)

Category: Functional
Verification: Run plan workflow after spec and confirm all artifacts are created
Source: [plan.md](.claude/skills/system-build/workflows/plan.md)

---

### 1.6.3 Tasks Breaks Plan into Actionable Items

**Given** a spec and plan exist
**When** the tasks workflow runs
**Then** it creates `tasks.md` with:
- Numbered tasks
- Dependencies between tasks
- Phase groupings

Category: Functional
Verification: Run tasks workflow and confirm tasks.md has numbered, phased tasks
Source: [tasks.md](.claude/skills/system-build/workflows/tasks.md)

---

### 1.6.4 Analyze Checks Cross-Artifact Consistency

**Given** spec, plan, and tasks files exist
**When** the analyze workflow runs
**Then** it performs semantic analysis
**And then** reports findings with severity levels:
- High: Must fix before proceeding
- Medium: Should address
- Low: Consider addressing

Category: Validation
Verification: Run analyze with intentional inconsistencies and confirm they're detected
Source: [analyze.md](.claude/skills/system-build/workflows/analyze.md)

---

### 1.6.5 Workflow Sequence is Enforced

**Given** system-build is used for a new feature
**When** workflows are executed
**Then** they follow this sequence:
1. specify → Create specification
2. clarify → Resolve ambiguities (optional)
3. plan → Generate implementation plan
4. tasks → Break into actionable items
5. checklist → Create quality checks
6. analyze → Verify consistency
7. implement → Execute tasks
8. tasks_to_issues → Export to GitHub (optional)

Category: Functional
Verification: Attempt to run plan before specify and confirm guidance to run specify first
Source: [system-build SKILL.md](.claude/skills/system-build/SKILL.md)

---

### 1.6.6 document_skill Extracts Requirements from Skills

**Given** a skill exists with SKILL.md and workflows
**When** the document_skill workflow runs
**Then** it extracts requirements from:
- USE WHEN triggers → activation requirements
- Workflow routing table → capability requirements
- Prerequisites → precondition requirements
- Steps → functional requirements
- Outputs → success criteria
- Error handling → exception requirements

**And then** formats each requirement in Given-When-Then style with Category, Verification, and Source

Category: Functional
Verification: Run "document skill system-cleaner" and confirm requirements generated in correct format
Source: [document_skill.md](.claude/skills/system-build/workflows/document_skill.md)

---

### 1.6.7 document_skill Updates Requirements Documentation

**Given** document_skill generates requirements for a skill
**When** the workflow completes
**Then** it adds a new section to `01_SKILLS.md` with sequential section ID
**And then** updates `README.md` summary table with new counts

Category: Functional
Verification: Check 01_SKILLS.md for new section and README.md for updated totals
Source: [document_skill.md](.claude/skills/system-build/workflows/document_skill.md)

---

## 1.7 Skill: life-management (DEPRECATED)

> **Deprecated as of v1.5.0:** This skill has been merged into **note-taking**. Life context management now flows through the unified capture → distribute workflow.

**Migration:**
- `update` workflow → Use `braindump` to capture thoughts, then `distribute_notes` routes to LifeOS files
- `extract` workflow → Handled by `distribute_notes` with LifeOS category detection
- `export` workflow → Now `export_life_summary` in note-taking skill

**Key changes:**
- Backup and logging preserved (see requirements 1.4.34, 1.4.35)
- Export functionality preserved (see requirements 1.4.36, 1.4.37)
- No more direct updates to life files; everything flows through braindump → process → distribute

**See:** Section 1.4 (note-taking) for current requirements.

---

## 1.8 Skill: system-cleaner

**What It Does:** System-wide housekeeping for auditing PAL integrity, naming conventions, and hygiene.

**Activates When:** User mentions "audit system", "check references", "validate naming", "find orphans", "health report", "system health", "clean system"

**Source:** [system-cleaner SKILL.md](.claude/skills/system-cleaner/SKILL.md)

---

### 1.8.1 audit_references Detects Unregistered Items

**Given** agents, skills, or workflows exist on disk
**When** the audit_references workflow runs
**Then** it compares disk files against ROUTING_TABLE.md and SYSTEM_INDEX.md
**And then** flags items on disk but not in references as UNREGISTERED

Category: Validation
Verification: Add an unregistered agent file, run audit_references, confirm it's flagged
Source: [audit_references.md](.claude/skills/system-cleaner/workflows/audit_references.md)

---

### 1.8.2 audit_references Detects Dead References

**Given** ROUTING_TABLE.md or SYSTEM_INDEX.md contain entries
**When** the audit_references workflow runs
**Then** it verifies each entry points to an existing file
**And then** flags entries pointing to non-existent files as DEAD REFERENCE

Category: Validation
Verification: Add a reference to non-existent file, run audit_references, confirm dead reference flagged
Source: [audit_references.md](.claude/skills/system-cleaner/workflows/audit_references.md)

---

### 1.8.3 audit_references Compares Agent Capabilities

**Given** agents have capabilities listed in Section 5
**When** the audit_references workflow runs
**Then** it compares agent Section 5 capabilities against SYSTEM_INDEX entries
**And then** flags mismatches as CAPABILITY MISMATCH with direction (agent-only or index-only)

Category: Validation
Verification: Add capability to agent Section 5 without updating SYSTEM_INDEX, run audit, confirm mismatch flagged
Source: [audit_references.md](.claude/skills/system-cleaner/workflows/audit_references.md)

---

### 1.8.4 audit_domains Validates Folder Structure

**Given** domains exist in Domains/ directory
**When** the audit_domains workflow runs
**Then** it validates each domain has:
- INDEX.md and CONNECTIONS.yaml at root
- 6 required folders: 00_CONTEXT/, 01_PROJECTS/, 04_SESSIONS/, 02_PAGES/, 03_OUTPUT/, 05_ARCHIVE/

**And then** flags missing components as MISSING STRUCTURE

Category: Validation
Verification: Remove a required folder from a domain, run audit_domains, confirm it's flagged
Source: [audit_domains.md](.claude/skills/system-cleaner/workflows/audit_domains.md)

---

### 1.8.5 audit_domains Syncs Active Work Table

**Given** a domain's INDEX.md has an Active Work table
**When** the audit_domains workflow runs
**Then** it compares table entries against actual files in 01_PROJECTS/
**And then** flags stale entries (in table but not on disk) and unlisted projects (on disk but not in table)

Category: Validation
Verification: Add a project file without updating Active Work table, run audit, confirm unlisted project flagged
Source: [audit_domains.md](.claude/skills/system-cleaner/workflows/audit_domains.md)

---

### 1.8.6 audit_domains Checks Nesting Depth

**Given** folders exist within a domain
**When** the audit_domains workflow runs
**Then** it verifies nesting does not exceed 3 levels below domain root
**And then** flags violations as NESTING TOO DEEP with path

Category: Validation
Verification: Create deeply nested folder (4+ levels), run audit_domains, confirm it's flagged
Source: [audit_domains.md](.claude/skills/system-cleaner/workflows/audit_domains.md)

---

### 1.8.7 audit_naming Validates 8 Naming Convention Categories

**Given** files and folders exist across the PAL system
**When** the audit_naming workflow runs
**Then** it validates against 8 naming categories:
- System protocols: UPPER_SNAKE_CASE.md
- Domain folders: PascalCase
- Skill/system folders: lower-kebab-case
- Agent files: lower-kebab-case.md
- Context files: lower_snake_case.md
- Project files: PROJECT_NAME.md or PLAN_NAME.md
- Session files: YYYY-MM-DD_title.md
- Asset files: lower_snake_case

**And then** flags violations with current name, expected pattern, and suggested fix

Category: Validation
Verification: Create a misnamed file, run audit_naming, confirm violation flagged with fix suggestion
Source: [audit_naming.md](.claude/skills/system-cleaner/workflows/audit_naming.md)

---

### 1.8.8 audit_naming Validates YAML Frontmatter

**Given** agents, skills, and domain INDEX files exist
**When** the audit_naming workflow runs
**Then** it validates YAML frontmatter:
- Agents: name, description, version, domain fields
- Skills: name, description fields with USE WHEN
- INDEX.md: Required sections present

**And then** flags missing or incorrect fields with suggested fixes

Category: Validation
Verification: Remove version field from agent, run audit_naming, confirm frontmatter issue flagged
Source: [audit_naming.md](.claude/skills/system-cleaner/workflows/audit_naming.md)

---

### 1.8.9 audit_orphans Finds Unclaimed Skills

**Given** skills exist in .claude/skills/
**When** the audit_orphans workflow runs
**Then** it checks each skill against all agents' Section 5 capabilities
**And then** flags skills not claimed by any agent as ORPHAN SKILL

Category: Validation
Verification: Create a skill not referenced in any agent, run audit_orphans, confirm it's flagged
Source: [audit_orphans.md](.claude/skills/system-cleaner/workflows/audit_orphans.md)

---

### 1.8.10 audit_orphans Detects Stale Sessions

**Given** session files exist in 04_SESSIONS/ folders across domains
**When** the audit_orphans workflow runs
**Then** it flags files older than configurable threshold (default 30 days) as STALE SESSION
**And then** suggests archiving to 05_ARCHIVE/

Category: Validation
Verification: Check for session files >30 days old, run audit_orphans, confirm they're flagged
Source: [audit_orphans.md](.claude/skills/system-cleaner/workflows/audit_orphans.md)

---

### 1.8.11 health_report Runs All Audits and Calculates Health Score

**Given** user triggers "health report" or "system health"
**When** the health_report workflow runs
**Then** it executes all 4 audit workflows sequentially:
1. audit_references
2. audit_domains
3. audit_naming
4. audit_orphans

**And then** calculates health status:
- 0 issues: HEALTHY
- 1-5 issues: MINOR ISSUES
- 6+ issues: NEEDS ATTENTION

**And then** generates consolidated dashboard with per-category status

Category: Functional
Verification: Run "health report" and confirm consolidated dashboard with all 4 audit results
Source: [health_report.md](.claude/skills/system-cleaner/workflows/health_report.md)

---

### 1.8.12 All Audits Offer Fixes with User Confirmation

**Given** any audit workflow finds issues
**When** the audit completes
**Then** it presents findings and offers fixes
**And then** requires user confirmation before applying any changes

**Safety rule:** Never auto-delete or auto-modify; always present findings first

Category: Validation
Verification: Run any audit with issues, confirm fix options presented with confirmation prompt
Source: [system-cleaner SKILL.md](.claude/skills/system-cleaner/SKILL.md)

---

## Adding New Skills

When extending PAL with new skills, ensure:

1. Skill directory uses `lower-kebab-case`
2. SKILL.md includes a USE WHEN trigger
3. Flat structure (max 2 levels)
4. `tools/` directory present (even if empty)
5. Context files in skill root (not subdirectories)
6. Workflows in `workflows/` with `lower_snake_case` naming

---

**Next:** See [02_AGENTS.md](02_AGENTS.md) for agent-specific requirements.
