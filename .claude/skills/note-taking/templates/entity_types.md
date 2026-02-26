# Entity Types

Reference for valid entity types in PAL notes. The `type` field in frontmatter determines which template sections are included in a note.

## Schema

```yaml
---
type: concept  # One of: concept, decision, reference, meeting, braindump, idea, note
---
```

## Entity Types

| Type | Purpose | When to Use |
|------|---------|-------------|
| `concept` | Knowledge artifact | Explaining an idea, term, or domain concept |
| `decision` | Recorded choice | Documenting a decision with context and rationale |
| `reference` | External resource | Capturing information from URLs, docs, papers |
| `meeting` | Interaction record | Meeting notes with attendees and action items |
| `braindump` | Stream of thought | Unstructured thought capture from braindump workflow |
| `idea` | Early-stage concept | Raw ideas not yet developed into full concepts |
| `note` | Generic note | Default type for notes without specific classification |

## Type-Specific Template Sections

### concept

```markdown
# [Title]

## Definition
Clear, concise definition of the concept.

## Context
When and where this concept applies.

## Key Points
- Point 1
- Point 2

## Examples
Real-world examples demonstrating the concept.

## Related Concepts
- [[Related Concept 1]]
- [[Related Concept 2]]

## Observations
- [fact] ...
- [insight] ...
```

### decision

```markdown
# [Title]

## Context
Background and circumstances leading to this decision.

## Options Considered
1. **Option A**: Description, pros/cons
2. **Option B**: Description, pros/cons

## Decision
The choice that was made.

## Rationale
Why this option was selected.

## Consequences
Expected outcomes and implications.

## Observations
- [decision] ...
- [requirement] ...
```

### reference

```markdown
# [Title]

## Source
- URL: [source_url]
- Author: [if available]
- Date: [publication date]

## Summary
Key points from the reference.

## Key Quotes
> Notable excerpts

## Relevance
How this reference applies to current work.

## Observations
- [fact] ...
- [technique] ...
```

### meeting

```markdown
# [Title]

## Meeting Info
- **Date**: YYYY-MM-DD
- **Attendees**: Person A, Person B
- **Purpose**: Why the meeting was held

## Discussion
Summary of topics discussed.

## Decisions Made
- Decision 1
- Decision 2

## Action Items
- [ ] Task for Person A
- [ ] Task for Person B

## Observations
- [action] ...
- [decision] ...
```

### braindump

```markdown
# [Title]

## Raw Thoughts
[Original content exactly as captured]

## Analysis

### Main Themes
1. Theme 1
2. Theme 2

### Questions Raised
- Question 1

## Observations
- [insight] ...
- [idea] ...
- [action] ...

## Relations
- relates_to [[Related Note]]
```

### idea

```markdown
# [Title]

## Core Idea
The central concept or proposal.

## Inspiration
What sparked this idea.

## Potential
How this could develop or be applied.

## Questions
- Open questions about viability
- Things to explore

## Observations
- [idea] ...
- [question] ...
```

### note (default)

```markdown
# [Title]

## Content
[Main content]

## Tags
[Relevant tags]
```

## Default Behavior

Notes without an explicit `type` field receive:
- `type: note` as default
- Generic template (title, content, tags only)
- No type-specific sections

## Type Inference

During `process_inbox`, the agent may infer type from content patterns:

| Content Pattern | Suggested Type |
|----------------|----------------|
| Contains "decided", "chose", options | `decision` |
| Contains attendees, action items | `meeting` |
| URL or external reference | `reference` |
| Contains "[idea]" observations | `idea` |
| Stream-of-consciousness | `braindump` |
| Explaining/defining term | `concept` |

## Workflow Integration

### process_inbox.md
- Step 4a: Type selection prompt after category
- Agent suggests type based on content analysis
- User confirms or adjusts

### braindump.md
- Automatically sets `type: braindump`
- Uses braindump template structure
