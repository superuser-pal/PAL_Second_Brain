# Domain Detection Patterns

Reference for domain detection in braindump and process_inbox workflows. Used to route content to the appropriate domain workspace.

## Schema

Each domain has:

- `name`: PascalCase domain folder name
- `primary_keywords`: High-confidence indicators (40% weight, max 1 match)
- `secondary_keywords`: Supporting indicators (25% weight each, max 2 matches)
- `exclude_patterns`: Patterns that reduce score (-30% each)

## Detection Algorithm

```
function detect_domain(content):
    scores = {}
    content_lower = content.lower()

    for domain in DOMAINS:
        score = 0

        # Primary keywords (40%, max 1)
        for kw in domain.primary:
            if kw.lower() in content_lower:
                score += 40
                break

        # Secondary keywords (25% each, max 2)
        matched = 0
        for kw in domain.secondary:
            if kw.lower() in content_lower and matched < 2:
                score += 25
                matched += 1

        # Exclusions (-30% each)
        for ex in domain.exclude:
            if ex.lower() in content_lower:
                score -= 30

        scores[domain.name] = max(0, min(100, score))

    return sorted(scores.items(), key=lambda x: -x[1])
```

## Thresholds

| Confidence | Range  | Action                    |
| ---------- | ------ | ------------------------- |
| High       | >= 80% | Auto-suggest as primary   |
| Medium     | 60-79% | Suggest with confirmation |
| Low        | < 60%  | No match, show menu       |

## Domains

### PALBuilder

**Scope:** PAL framework development, specifications, architecture decisions, system building

| Type      | Patterns                                                                                                          |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| Primary   | "pal system", "pal architecture", "pal framework", "system-build", "specification", "claude code", "second brain" |
| Secondary | "workflow", "agent", "skill", "template", "frontmatter", "domain structure", "hook", "routing"                    |
| Exclude   | "I believe", "my goal", "I learned" (LifeOS signals)                                                              |

### LifeOS

**Scope:** Personal life context - beliefs, goals, projects, mission, mental models, lessons learned

| Type      | Patterns                                                                                                       |
| --------- | -------------------------------------------------------------------------------------------------------------- |
| Primary   | "I believe", "my mission", "I learned", "my goal", "life purpose", "I realized", "my values"                   |
| Secondary | "values", "principles", "worldview", "aspiration", "mental model", "framework for life", "personal philosophy" |
| Exclude   | (none - LifeOS is the default personal domain)                                                                 |

**Note:** LifeOS has additional category detection. See braindump.md Step 4b.

## Overlap Handling

When multiple domains score >= 70%, present choice to user:

```
This content could belong to multiple destinations:

1. [Domain1] (X%) - [matched pattern]
2. [Domain2] (Y%) - [matched pattern]

Where should this go?
```

User selects primary. Non-selected can be added as relation.

## Adding New Domains

When a new domain is created:

1. Add entry to this file following the schema
2. Define primary keywords (unique identifiers)
3. Define secondary keywords (supporting signals)
4. Define exclusions (patterns that indicate OTHER domains)
5. Test with sample content before deployment

## Workflow Integration

### braindump.md

- Step 4a: Domain detection runs before category detection
- If LifeOS detected, proceeds to category detection (Step 4b)
- If other domain detected, skips category detection

### process_inbox.md

- Step 3: Can use domain patterns for suggestions
- User confirms or selects from menu

### distribute_notes.md

- Step 3: Validates domain exists before distribution
- Routes to `domains/[domain]/03_ASSETS/`
