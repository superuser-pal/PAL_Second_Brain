# PAL Second Brain - Skills Requirements

**Document Purpose:** Functional requirements for all PAL skills, written for non-technical builders and developers.

**Version:** 1.4.0
**Last Updated:** 2026-02-25

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
Source: [SKILL_LOGIC.md](.claude/base/system/SKILL_LOGIC.md)

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
Source: [SKILL_LOGIC.md](.claude/base/system/SKILL_LOGIC.md)

---

### 1.0.3 Context Files Live in Skill Root

**Given** a skill needs additional documentation or reference files
**When** these files are created
**Then** they are placed directly in the skill root directory (NOT in a `context/` or `docs/` subdirectory)

Category: Validation
Verification: Confirm no `context/` or `docs/` subdirectories exist in any skill
Source: [SKILL_LOGIC.md](.claude/base/system/SKILL_LOGIC.md)

---

### 1.0.4 tools/ Directory Always Present

**Given** a skill is created
**When** the skill structure is set up
**Then** a `tools/` directory is created (even if empty)

Category: Validation
Verification: Check any skill directory and confirm `tools/` folder exists
Source: [SKILL_LOGIC.md](.claude/base/system/SKILL_LOGIC.md)

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
Source: [AGENTS_LOGIC.md](.claude/base/system/AGENTS_LOGIC.md)

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
- `02_SESSIONS/` (session logs)
- `03_ASSETS/` (reference materials)
- `04_OUTPUTS/` (generated deliverables)
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
Source: [DOMAINS_LOGIC.md](.claude/base/system/DOMAINS_LOGIC.md)

---

### 1.2.3 Enforce Nesting Limit

**Given** files are added to a domain
**When** the folder structure grows
**Then** it does not exceed three vertical levels below the domain root

Category: Validation
Verification: Attempt to create deeply nested folders and confirm system prevents or warns
Source: [DOMAINS_LOGIC.md](.claude/base/system/DOMAINS_LOGIC.md)

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
Source: [SKILL_LOGIC.md](.claude/base/system/SKILL_LOGIC.md)

---

### 1.3.3 Skill Name Uses Kebab Case

**Given** a skill is created
**When** the directory and YAML name are set
**Then** they use `lower-kebab-case` (e.g., `create-skill`, `note-taking`)

Category: Validation
Verification: Create a skill and confirm directory name uses kebab-case
Source: [SKILL_LOGIC.md](.claude/base/system/SKILL_LOGIC.md)

---

### 1.3.4 Workflow Files Use Snake Case

**Given** workflows are added to a skill
**When** workflow files are named
**Then** they use `lower_snake_case` (e.g., `create_skill.md`, `validate_skill.md`)

Category: Validation
Verification: Check workflows/ folder and confirm files use snake_case
Source: [SKILL_LOGIC.md](.claude/base/system/SKILL_LOGIC.md)

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

**Activates When:** User mentions "process notes", "organize notes", "add frontmatter", "distribute notes", "ingest PDF", "ingest document", "convert document", "inbox notes", "note management", "scan inbox", "move notes to domain", "braindump", "brain dump", "capture thoughts", "dump thoughts", "url dump", "save link", "bookmark url", "capture url", "save for later", "categorize observations", "add relations", "link notes", "knowledge graph"

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
**Then** notes are moved to `domains/[domain]/03_ASSETS/`
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

### 1.5.4 Tasks Use Checkbox Syntax with Status Tags

**Given** tasks are tracked in project files
**When** tasks are formatted
**Then** they use:
- `- [ ] Task description \`#open\`` for not started
- `- [ ] Task description \`#in-progress\`` for active work
- `- [x] Task description \`#done\`` for completed

Category: Validation
Verification: Check any PROJECT_*.md and confirm task format matches
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

## 1.7 Skill: life-management

**What It Does:** Manage personal life context within the life-os domain — mission, beliefs, goals, projects, mental models, and lessons.

**Activates When:** User mentions "update beliefs", "add goal", "life mission", "add lesson", "update projects", "mental models", "frames", "extract notes", "process ideas", "export life summary", "life report"

**Source:** [life-management SKILL.md](.claude/skills/life-management/SKILL.md)

---

### 1.7.1 Update Triggers on Life Context Modifications

**Given** user requests to modify life context (beliefs, mission, goals, etc.)
**When** the update workflow processes the request
**Then** it parses the request to determine target file and content
**And then** confirms with user before proceeding

Category: Functional
Verification: Say "add a goal" and confirm workflow identifies goals.md as target
Source: [update.md](.claude/skills/life-management/workflows/update.md)

---

### 1.7.2 Update Creates Timestamped Backup Before Changes

**Given** user approves an update to a life file
**When** the update workflow applies changes
**Then** it creates a timestamped backup at `05_ARCHIVE/backups/[filename]_YYYY-MM-DD_HH-MM-SS.md`
**And then** proceeds with the update only after backup succeeds

**If backup fails:**
**Then** STOP immediately and do NOT modify original file

Category: Validation
Verification: Update a life file and confirm backup exists in 05_ARCHIVE/backups/
Source: [update.md](.claude/skills/life-management/workflows/update.md)

---

### 1.7.3 Update Logs All Changes to UPDATES.md

**Given** an update completes successfully
**When** the file is modified
**Then** the workflow appends an entry to `02_SESSIONS/UPDATES.md` with:
- Timestamp
- Action performed
- Files modified
- Notes

Category: Functional
Verification: Update a life file and confirm log entry appears in UPDATES.md
Source: [update.md](.claude/skills/life-management/workflows/update.md)

---

### 1.7.4 Extract Scans 03_ASSETS and Classifies into 7 Categories

**Given** raw notes exist in `domains/life-os/03_ASSETS/`
**When** the extract workflow runs
**Then** it scans all text-based files (.md, .txt)
**And then** classifies content into 7 categories: mission, beliefs, frames, models, learned, goals, projects

Category: Functional
Verification: Add notes to 03_ASSETS/, run extract, confirm classification into categories
Source: [extract.md](.claude/skills/life-management/workflows/extract.md)

---

### 1.7.5 Extract Deduplicates with 4-Tier Rule System

**Given** extract workflow consolidates content from multiple notes
**When** duplicate content is detected
**Then** it applies 4-tier deduplication:
1. Exact match → Keep first, note all sources
2. High similarity (>80%) → Ask user to merge or keep separate
3. Semantic match → Present for user decision
4. Unsure → Keep both

Category: Validation
Verification: Include duplicate content in notes, run extract, confirm deduplication prompt appears
Source: [extract.md](.claude/skills/life-management/workflows/extract.md)

---

### 1.7.6 Extract Requires User Approval Before Applying

**Given** extract workflow completes analysis
**When** extraction preview is presented
**Then** user must approve (Y/N/Edit) before any files are modified
**And then** backups are created before applying approved changes

Category: Validation
Verification: Run extract and confirm preview with approval prompt before any file changes
Source: [extract.md](.claude/skills/life-management/workflows/extract.md)

---

### 1.7.7 Export Generates Life Summary Report

**Given** user triggers "export life summary" or "life report"
**When** the export workflow runs
**Then** it reads all 7 life files and generates a comprehensive markdown report
**And then** saves to `04_OUTPUTS/life_summary_[YYYY-MM-DD].md`
**And then** logs the export action to UPDATES.md

Category: Functional
Verification: Run "export life summary" and confirm report created in 04_OUTPUTS/
Source: [export.md](.claude/skills/life-management/workflows/export.md)

---

### 1.7.8 Export Supports Category and Timeline Filtering

**Given** user wants a filtered life report
**When** export is invoked with filter options
**Then** it supports:
- Category export: Only specified categories (e.g., "export just goals and projects")
- Timeline export: Focus on recent changes (e.g., "export updates from last month")

Category: Functional
Verification: Run "export just goals" and confirm only goals section appears in report
Source: [export.md](.claude/skills/life-management/workflows/export.md)

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
- 6 required folders: 00_CONTEXT/, 01_PROJECTS/, 02_SESSIONS/, 03_ASSETS/, 04_OUTPUTS/, 05_ARCHIVE/

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

**Given** session files exist in 02_SESSIONS/ folders across domains
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
