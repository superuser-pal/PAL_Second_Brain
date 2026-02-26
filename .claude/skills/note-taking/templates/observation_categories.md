# Observation Categories

Reference for valid observation categories in PAL notes. Observations are atomic units of knowledge within a note.

## Syntax

```markdown
- [category] content #tag1 #tag2
```

**Rules:**
- One observation per line (atomic = single subject-verb-object statement)
- Category in square brackets at start
- Content follows category
- Tags are optional, prefixed with `#`
- No conjunctions combining multiple facts in one observation

## Categories

| Category | Purpose | Use For |
|----------|---------|---------|
| `fact` | Objective truth | Verified information, data points, statistics |
| `idea` | Subjective concept | Hypotheses, suggestions, possibilities |
| `decision` | Choice made | Commitments, selections, determinations |
| `technique` | Method or approach | How-to, process steps, tactics |
| `requirement` | Constraint or need | Must-haves, dependencies, prerequisites |
| `question` | Open inquiry | Unknowns, things to investigate |
| `insight` | Realization | Connections, "aha" moments, patterns noticed |
| `problem` | Issue identified | Challenges, blockers, pain points |
| `solution` | Resolution | Fixes, workarounds, answers |
| `action` | Task to do | Action items (triggers task extraction) |

## Category Boundaries

**fact vs insight**
- `fact`: Externally verifiable — "API rate limit is 1000/hour"
- `insight`: Personal realization — "The rate limit explains our timeout issues"

**idea vs decision**
- `idea`: Under consideration — "Could use caching to reduce calls"
- `decision`: Committed — "We will implement Redis caching"

**problem vs requirement**
- `problem`: Issue encountered — "Users report slow load times"
- `requirement`: Constraint defined — "Page must load in under 2 seconds"

**technique vs solution**
- `technique`: General method — "Use lazy loading for images"
- `solution`: Specific fix for problem — "Added lazy loading to fix slow gallery"

## Valid Examples

```markdown
- [fact] API rate limit is 1000 requests/hour #api #limits
- [idea] Could use caching to reduce API calls #performance #architecture
- [decision] Will use Redis for caching #infrastructure #decision
- [technique] Implement exponential backoff for retries #resilience
- [requirement] Must support offline mode for mobile app #mobile #ux
- [question] What is the SLA for the payment gateway? #payments #vendors
- [insight] The caching issue correlates with peak traffic times #performance
- [problem] Users experiencing 5s delays during checkout #ux #critical
- [solution] Added connection pooling to fix database bottleneck #database
- [action] Review the API documentation before Friday #api #tasks
```

## Invalid Examples

```markdown
- [random] some content                    # Invalid category
- fact content without brackets            # Missing brackets
- [] empty category content                # Empty category
- [fact]                                   # No content after category
- [fact] A and B and C happened            # Not atomic (multiple facts)
- [FACT] uppercase category                # Categories are lowercase
```

## Workflow Integration

### process_inbox.md
- Step 4a suggests categories for uncategorized content
- Agent proposes based on content analysis
- User confirms or adjusts

### braindump.md
- Step 3b extracts observations from raw content
- Automatically categorizes during analysis
- User reviews categorizations

### distribute_notes.md
- Step 6d extracts `[action]` observations to PROJECT files
- Format: `- [ ] [content] (from: [[Source Note]])`
