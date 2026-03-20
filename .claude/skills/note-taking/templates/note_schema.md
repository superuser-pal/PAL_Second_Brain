# Note Schema

This document defines the consolidated semantic structure for all notes managed by the note-taking skill. It merges frontmatter, entity types, observation categories, and relation types into a single concise reference.

## 1. Frontmatter Schema

```yaml
---
name: null                 # Note title in lower_snake_case
origin: manual             # braindump | ai-output | manual
type: note                 # See Entity Types section
status: unprocessed        # unprocessed | ready | processed | insubstantial | consolidated | tasks_extracted
description: null          # 1-2 sentence AI-generated summary
domain: null               # PascalCase Target domain (see DOMAINS_REGISTRY.md)
project: null              # Linked PROJECT_*.md file
origin_agent: null         # Required if origin: ai-output
url: null                  # External source URL
favorite: false
destination: null          # pages | context | projects | all — limits scan pool during distribution (null = all)
tags: []                   # lowercase, hyphenated array
created: YYYY-MM-DD
last_updated: YYYY-MM-DD

# Substantiality tracking (optional, auto-calculated)
substantiality_score: null # high | medium | low | insubstantial
word_count: null           # Auto-calculated during distribution
observation_count: null    # Auto-calculated during distribution

# Consolidation tracking (optional, set during distribution)
consolidated_with: null    # [[target_page]] if merged
---
```

**URL Capture specific fields (when origin: manual and capturing URL):**
- `url_domain` (string), `url_author` (string|null), `url_published` (date|null), `url_read_time` (string|null)
- `content_type`: article | tool | video | reference | research
- `relevance`: high | medium | low
- *Tool-only fields*: `pricing` (free|freemium|paid|enterprise), `eval_status` (to-evaluate|evaluated|in-use|passed)

---

## 2. Entity Types (`type` field)

Determines note structure and purpose. Default is `note`. 

| Type | Purpose | Key Sections Required |
|---|---|---|
| `concept` | Knowledge artifact | Definition, Context, Key Points, Examples, Related Concepts, Observations |
| `decision` | Recorded choice | Context, Options Considered, Decision, Rationale, Consequences, Observations |
| `reference` | External resource | Source, Summary, Key Quotes, Relevance, Observations |
| `meeting` | Interaction record | Meeting Info, Discussion, Decisions Made, Action Items, Observations |
| `braindump`| Stream of thought | Raw Thoughts, Observations, Strategic Intelligence, Relations |
| `idea` | Early-stage concept | Core Idea, Inspiration, Potential, Questions, Observations |
| `note` | Generic note | Content, Tags |
| *LifeOS* | See `DOMAINS_REGISTRY.md` | `belief`, `frame`, `lesson`, `model`, `goal`, `plan` |

---

## 3. Observation Categories

Observations are atomic units of knowledge. Syntax: `- [category] content #tag1 #tag2`

| Category | Description | Examples |
|---|---|---|
| `fact` | Objective truth | API rate limit is 1000 requests/hour |
| `idea` | Subjective concept | Could use Redis for caching |
| `decision` | Choice made | Will use Redis |
| `technique` | Method/approach | Implement exponential backoff |
| `requirement` | Constraint/need | Must load in under 2 seconds |
| `question` | Open inquiry | What is the SLA? |
| `insight` | Realization/pattern | Bottleneck correlates with peak traffic |
| `problem` | Issue/blocker | 5s delays during checkout |
| `solution` | Resolution | Added connection pooling |
| `action` | Task (extracted) | Review API docs |

---

## 4. Relation Types

Relations create typed directional links using Obsidian wikilinks. Syntax: `- relation_type [[Target Note]]` (Max 5 per note).

| Type | Meaning & Direction | Example |
|---|---|---|
| `part_of` | Child → Parent | Part of larger concept |
| `supports` | Supporter → Claim | Evidence for decision |
| `contradicts`| Challenger → Challenged | Conflicts with past choice |
| `evolved_from`| New → Old | V2 evolved from V1 |
| `informs` | Source → Target | Shaped thinking on topic |
| `blocks` | Blocker → Blocked | Must be resolved first |
| `inspired_by` | Created → Inspiration | Sparked this idea |
| `relates_to` | Either → Either | Loose association |
| `originated_with`| Split → Sibling | From same braindump |
| `follows` | Successor → Predecessor | Sequence order |

---

## 5. Domain Detection Algorithm (For Braindump)

Target domain and theme detection relies on signals from `.claude/core/reference/DOMAINS_REGISTRY.md`:

1. **Score against raw content:** Primary keywords (+40%, max 1), Secondary keywords (+25%, max 2), Exclusions (-30%).
2. **Confidence handling:**
   - High (>=80%) auto-suggests as primary.
   - Medium (60-79%) suggests with confirmation.
   - Low (<60%) prompts user menu.
3. If multiple domains score >=70%, ask user to choose primary destination.

---

## 6. Protected User Notes

All workflow-generated notes append this section at the bottom. It is never modified, parsed, or exported by automation:

```markdown
## Notes

<!-- User notes below this line are preserved during distribution -->
[User's personal annotations go here]
```
