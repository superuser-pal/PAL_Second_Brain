---
feature: FEAT_NNN_short-name
branch: NNN-short-name
created: YYYY-MM-DD
status: draft
routing: personal | open-source
target_path: [resolved path]
current_phase: specification
phase_history:
  - { phase: specification, date: YYYY-MM-DD, by: specify }
input: "$ARGUMENTS"
---

# FEAT_NNN: [Feature Name]

## Specification

### Overview

[Brief description of what this feature does and its purpose]

### User Stories & Acceptance Criteria

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

#### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently - e.g., "Can be fully tested by [specific action] and delivers [specific value]"]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

#### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

#### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?

### Requirements

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

#### Functional Requirements

- **FR-001**: System MUST [specific capability, e.g., "allow users to create accounts"]
- **FR-002**: System MUST [specific capability, e.g., "validate email addresses"]
- **FR-003**: Users MUST be able to [key interaction, e.g., "reset their password"]
- **FR-004**: System MUST [data requirement, e.g., "persist user preferences"]
- **FR-005**: System MUST [behavior, e.g., "log all security events"]

*Example of marking unclear requirements:*

- **FR-006**: System MUST authenticate users via [NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]

#### Key Entities *(include if feature involves data)*

- **[Entity 1]**: [What it represents, key attributes without implementation]
- **[Entity 2]**: [What it represents, relationships to other entities]

### Success Criteria

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

#### Measurable Outcomes

- **SC-001**: [Measurable metric, e.g., "Users can complete account creation in under 2 minutes"]
- **SC-002**: [Measurable metric, e.g., "System handles 1000 concurrent users without degradation"]
- **SC-003**: [User satisfaction metric, e.g., "90% of users successfully complete primary task on first attempt"]
- **SC-004**: [Business metric, e.g., "Reduce support tickets related to [X] by 50%"]

---

## Implementation Plan

### Summary

[Extract from feature spec: primary requirement + technical approach]

### Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, TypeScript 5.0, or NEEDS CLARIFICATION]
**Primary Dependencies**: [e.g., Bun, React, PostgreSQL or NEEDS CLARIFICATION]
**Storage**: [if applicable, e.g., PostgreSQL, File system, N/A]
**Testing**: [e.g., pytest, vitest, bun test or NEEDS CLARIFICATION]
**Target Platform**: [e.g., CLI, Web, Obsidian plugin or NEEDS CLARIFICATION]
**Project Type**: [single/web/mobile/plugin - determines source structure]
**Performance Goals**: [domain-specific, e.g., <1s response, 60fps, 1000 req/s or NEEDS CLARIFICATION]
**Constraints**: [domain-specific, e.g., <200ms p95, offline-capable or NEEDS CLARIFICATION]
**Scale/Scope**: [domain-specific, e.g., 10k users, 100k notes, 50 screens or NEEDS CLARIFICATION]

### Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file - populated by plan workflow]

### Architecture Approach

[High-level design decisions and architectural patterns]

### File Changes

<!--
  ACTION REQUIRED: List files to create or modify with brief rationale
-->

**Files to Create**:
- `path/to/new/file.ext` - [Purpose]

**Files to Modify**:
- `path/to/existing/file.ext` - [Changes needed]

### Implementation Phases

[Phase overview with milestones - will be detailed in Tasks section]

### Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |

---

## Tasks

<!--
  Tasks are organized by user story to enable independent implementation and testing.
  Format: `[ID] [P?] [Story] Description`
  - [P]: Can run in parallel (different files, no dependencies)
  - [Story]: Which user story this task belongs to (e.g., US1, US2, US3)
  - Include exact file paths in descriptions
-->

### Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize project with dependencies
- [ ] T003 [P] Configure linting and formatting tools

---

### Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 [Foundational task - adjust based on feature]
- [ ] T005 [P] [Another foundational task]

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

### Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

#### Implementation for User Story 1

- [ ] T006 [P] [US1] [Task description with file path]
- [ ] T007 [US1] [Task description]

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

### Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

#### Implementation for User Story 2

- [ ] T008 [P] [US2] [Task description with file path]

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

### Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

#### Implementation for User Story 3

- [ ] T009 [P] [US3] [Task description with file path]

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed]

---

### Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization

---

## Testing Instructions

<!--
  This section is populated by the implement workflow after implementation is complete.
  It provides step-by-step instructions for the user to test the feature.
-->

### How to Test This Feature

[Step-by-step testing instructions generated after implementation]

1. [Test step 1 - specific action to take]
2. [Test step 2 - what to observe]
3. [Expected outcomes - what should happen]

### Acceptance Criteria Checklist

<!--
  Extracted from user stories acceptance scenarios
-->

- [ ] [Acceptance criterion 1 from User Story 1]
- [ ] [Acceptance criterion 2 from User Story 1]
- [ ] [Acceptance criterion 1 from User Story 2]

---

## Implementation Notes

<!--
  Space for discoveries, clarifications, decisions made during implementation.
  Populated by the implement workflow as work progresses.
-->

[Notes about implementation decisions, discoveries, blockers resolved, etc.]

### Testing Feedback

<!--
  User feedback from UAT - what worked, what needs changes
  Populated when user tests the feature and provides feedback
-->

[User testing feedback will be captured here]

---

## Completion Summary

<!--
  Populated by the document workflow after feature is tested and approved
-->

### Requirements Generated

[Links to requirements docs generated from this feature]

### Lessons Learned

[Retrospective insights - what went well, what could be improved]
