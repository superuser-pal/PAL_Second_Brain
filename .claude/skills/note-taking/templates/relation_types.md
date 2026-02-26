# Relation Types

Reference for valid relation types in PAL notes. Relations create typed, directional links between notes using Obsidian wikilink syntax.

## Syntax

```markdown
## Relations

- relation_type [[Target Note]]
- relation_type [[Another Note]]
```

**Rules:**
- Max 5 relations per note (enforced during creation)
- Relations are directional (A supports B ≠ B supports A)
- Forward references allowed (link to notes that don't exist yet)
- Uses Obsidian `[[wikilink]]` syntax for graph view compatibility

## Relation Types

| Type | Meaning | Direction | Use For |
|------|---------|-----------|---------|
| `part_of` | Component relationship | Child → Parent | "This note is part of a larger concept" |
| `supports` | Evidence/backing | Supporter → Claim | "This provides evidence for that" |
| `contradicts` | Opposing view | Challenger → Challenged | "This conflicts with that" |
| `evolved_from` | Iteration/version | New → Old | "This is a refinement of that" |
| `informs` | Input/influence | Source → Target | "This shaped thinking on that" |
| `blocks` | Dependency/blocker | Blocker → Blocked | "This must be resolved before that" |
| `inspired_by` | Creative origin | Created → Inspiration | "This idea came from that" |
| `relates_to` | General association | Either → Either | "These are connected (loosely)" |
| `originated_with` | Split origin | Split → Sibling | "These were created from same braindump" |
| `follows` | Sequence/order | Successor → Predecessor | "This comes after that" |

## Semantic Boundaries

**supports vs relates_to**
- `supports`: Direct evidence — "Study results support the hypothesis"
- `relates_to`: Loose connection — "Both discuss API design"

**evolved_from vs inspired_by**
- `evolved_from`: Direct iteration — "V2 spec evolved from V1 spec"
- `inspired_by`: Indirect influence — "This approach was inspired by that article"

**part_of vs relates_to**
- `part_of`: Hierarchical containment — "This chapter is part of that book"
- `relates_to`: Peer association — "Both chapters discuss similar topics"

**informs vs supports**
- `informs`: Shaped thinking — "The research informed our approach"
- `supports`: Provides evidence — "The data supports our conclusion"

## Examples

```markdown
## Relations

- supports [[API Rate Limiting Decision]]
- evolved_from [[Initial Architecture Draft]]
- part_of [[System Design Concept]]
- blocks [[Feature Launch]]
- relates_to [[Performance Optimization]]
```

## Max Relations Enforcement

When adding relations during workflow execution:

1. Count existing relations in note
2. If count >= 5, display warning:
   ```
   This note already has 5 relations (maximum).

   Current relations:
   1. supports [[Note A]]
   2. evolved_from [[Note B]]
   3. part_of [[Note C]]
   4. relates_to [[Note D]]
   5. informs [[Note E]]

   Options:
   1. Replace an existing relation
   2. Skip adding new relation
   3. Cancel
   ```
3. User must choose to replace or skip

**On cancel:** Skip adding the relation, log "user skipped relation addition"

## Forward Reference Handling

Notes can link to targets that don't exist yet:

```markdown
- supports [[Future Design Doc]]
```

**Behavior:**
- Link is created immediately
- Obsidian displays as unresolved link
- When target note is created, link becomes active
- No validation error for missing targets

## Workflow Integration

### process_inbox.md (Step 4b - when agent loaded)
- Agent scans domain context for existing notes
- Proposes relations based on content similarity
- User confirms/adjusts/skips each relation
- Enforces max 5 relations

### braindump.md (Step 5b)
- User can manually add relations
- Agent suggests relations if loaded
- Enforces max 5 relations

### distribute_notes.md (Step 6c)
- Validates that relation targets exist in domain
- Warns (but allows) if target not found
- Does not block distribution for missing targets
