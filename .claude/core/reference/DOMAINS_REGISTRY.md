---
title: Domains Registry
version: 1.0.0
layer: SYSTEM
purpose: Single source of truth for all domain definitions, routing signals, and detection patterns
last_updated: 2026-03-16
---

# Domains Registry

> **This is the single source of truth for domain definitions.** When a domain is created, add an entry here. All other files that reference domains (CLAUDE.md routing table, note-taking skill, frontmatter schema) derive from this registry — do not duplicate domain data elsewhere.

---

## Registry Schema

Each domain entry contains:

- `name`: PascalCase folder name
- `scope`: What this domain covers (one sentence)
- `path`: Relative path from repo root
- `agent`: Bound domain agent (lower-kebab-case), or `null`
- `primary_signals`: High-confidence routing keywords (used in CLAUDE.md routing + domain detection)
- `secondary_signals`: Supporting keywords (used in domain detection scoring)
- `exclude_patterns`: Patterns that reduce detection score for this domain
- `lifeos_categories`: Only for LifeOS — sub-routing to specific context files

---

## Domains

### LifeOS

| Field | Value |
|-------|-------|
| **Name** | `LifeOS` |
| **Path** | `Domains/LifeOS/` |
| **Agent** | `life-coach` |
| **Scope** | Personal life — beliefs, goals, mission, mental models, lessons |

**Primary Signals:** `"I believe"`, `"my mission"`, `"I learned"`, `"my goal"`, `"I realized"`, `"my values"`

**Secondary Signals:** `"values"`, `"principles"`, `"worldview"`, `"aspiration"`, `"mental model"`, `"framework for life"`, `"personal philosophy"`

**Exclude Patterns:** _(none — LifeOS is the default personal domain)_

**LifeOS Sub-Categories:**

| Category | File | Signals |
|----------|------|---------|
| beliefs | `00_CONTEXT/beliefs.md` | worldview, "I believe", principles, values |
| mission | `00_CONTEXT/mission.md` | life purpose, calling, "why I exist" |
| frames | `00_CONTEXT/frames.md` | mental frames, perspectives, lenses |
| models | `00_CONTEXT/models.md` | mental models, decision frameworks |
| learned | `00_CONTEXT/learned.md` | lessons, realizations, "I learned" |
| goals | `00_CONTEXT/GOAL_*.md` | aspirations, objectives, targets |
| projects | `01_PROJECTS/projects.md` | active work, initiatives |

---

### PALBuilder

| Field | Value |
|-------|-------|
| **Name** | `PALBuilder` |
| **Path** | `Domains/PALBuilder/` |
| **Agent** | `pal-builder` |
| **Scope** | PAL system development — specs, architecture, workflows |

**Primary Signals:** `"pal system"`, `"pal architecture"`, `"pal framework"`, `"system-build"`, `"specification"`, `"claude code"`, `"second brain"`

**Secondary Signals:** `"workflow"`, `"agent"`, `"skill"`, `"template"`, `"frontmatter"`, `"domain structure"`, `"hook"`, `"routing"`

**Exclude Patterns:** `"I believe"`, `"my goal"`, `"I learned"` _(LifeOS signals)_

---

### PALProduct

| Field | Value |
|-------|-------|
| **Name** | `PALProduct` |
| **Path** | `Domains/PALProduct/` |
| **Agent** | `product-manager` |
| **Scope** | Product strategy, roadmap, user research, competitive analysis for PAL Open Source |

**Primary Signals:** `"product strategy"`, `"roadmap"`, `"PRD"`, `"user research"`, `"feature request"`, `"product strategy"`

**Secondary Signals:** `"persona"`, `"hypothesis"`, `"metrics"`, `"user value"`, `"competitive"`, `"market"`, `"pricing"`, `"positioning"`

**Exclude Patterns:** `"code"`, `"implementation"`, `"architecture"` _(PALBuilder signals)_

---

### PALGrowth

| Field | Value |
|-------|-------|
| **Name** | `PALGrowth` |
| **Path** | `Domains/PALGrowth/` |
| **Agent** | `null` |
| **Scope** | PAL growth strategy, marketing, metrics tracking, community building |

**Primary Signals:** `"growth"`, `"marketing"`, `"distribution"`, `"community"`, `"metrics"`, `"github stars"`, `"product hunt"`, `"content strategy"`

**Secondary Signals:** `"audience"`, `"engagement"`, `"newsletter"`, `"social"`, `"funnel"`, `"conversion"`, `"retention"`

**Exclude Patterns:** _(none)_

---

### LaraLou

| Field | Value |
|-------|-------|
| **Name** | `LaraLou` |
| **Path** | `Domains/LaraLou/` |
| **Agent** | `substack-manager` |
| **Scope** | Substack essays and content strategy for LaraLou |

**Primary Signals:** `"substack"`, `"newsletter"`, `"essay"`, `"blog post"`, `"subscriber"`, `"LaraLou"`

**Secondary Signals:** `"writing"`, `"growth"`, `"publish"`, `"Lara"`, `"audience"`, `"engagement"`, `"content calendar"`

**Exclude Patterns:** _(none)_

---

### Studio

| Field | Value |
|-------|-------|
| **Name** | `Studio` |
| **Path** | `Domains/Studio/` |
| **Agent** | `studio-agent` |
| **Scope** | Video production and presentation-ready visual architecture |

**Primary Signals:** `"video"`, `"Scaledraw"`, `"presentation"`, `"production"`, `"whiteboard"`, `"visual content"`

**Secondary Signals:** `"recording"`, `"editing"`, `"visual"`, `"media"`, `"demo"`, `"animation"`, `"graphics"`, `"thumbnail"`

**Exclude Patterns:** _(none)_

---

### PALOpenSource

| Field | Value |
|-------|-------|
| **Name** | `PALOpenSource` |
| **Path** | `Domains/PALOpenSource/` |
| **Agent** | `pal-release-manager` |
| **Scope** | Release management, changelog, public distribution, open source packaging |

**Primary Signals:** `"release"`, `"changelog"`, `"version"`, `"open source"`, `"public repo"`, `"distribution"`

**Secondary Signals:** `"sync"`, `"publish"`, `"MIT license"`, `"github release"`, `"tag"`, `"semantic versioning"`

**Exclude Patterns:** _(none)_

---

### EvToyota

| Field | Value |
|-------|-------|
| **Name** | `EvToyota` |
| **Path** | `Domains/EvToyota/` |
| **Agent** | `professional-assistant` |
| **Scope** | Toyota product management — EV features, mobile app, roadmap, and stakeholder work |

**Primary Signals:** `"toyota"`, `"EV feature"`, `"ebtoyota"`, `"toyota app"`, `"toyota roadmap"`, `"toyota stakeholder"`

**Secondary Signals:** `"electric vehicle"`, `"mobile app"`, `"feature spec"`, `"sprint"`, `"release plan"`, `"toyota PM"`

**Exclude Patterns:** `"PAL"`, `"open source"`, `"github"` _(PAL domain signals)_

---

### PALSecondBrain

| Field | Value |
|-------|-------|
| **Name** | `PALSecondBrain` |
| **Path** | `Domains/PALSecondBrain/` |
| **Agent** | `null` |
| **Scope** | PAL Open Source second brain project on GitHub — strategic direction, documentation, and project tracking |

**Primary Signals:** `"pal second brain"`, `"second brain github"`, `"open source second brain"`, `"pal github"`

**Secondary Signals:** `"github repo"`, `"contributors"`, `"open source"`, `"pal project"`, `"documentation"`

**Exclude Patterns:** `"toyota"`, `"laralou"`, `"I believe"`, `"my goal"` _(signals for other domains)_

---

## Detection Algorithm

Used by the `note-taking` skill for domain routing during braindump and process_inbox:

```
function detect_domain(content):
    scores = {}
    content_lower = content.lower()

    for domain in DOMAINS_REGISTRY:
        score = 0

        # Primary signals (40%, max 1 match)
        for kw in domain.primary_signals:
            if kw.lower() in content_lower:
                score += 40
                break

        # Secondary signals (25% each, max 2 matches)
        matched = 0
        for kw in domain.secondary_signals:
            if kw.lower() in content_lower and matched < 2:
                score += 25
                matched += 1

        # Exclusions (-30% each)
        for ex in domain.exclude_patterns:
            if ex.lower() in content_lower:
                score -= 30

        scores[domain.name] = max(0, min(100, score))

    return sorted(scores.items(), key=lambda x: -x[1])
```

**Thresholds:**

| Confidence | Range | Action |
|------------|-------|--------|
| High | >= 80% | Auto-suggest as primary |
| Medium | 60–79% | Suggest with confirmation |
| Low | < 60% | No match, show menu |

**Overlap handling:** When multiple domains score >= 70%, present choice to user. Non-selected can be added as a relation.

---

## Adding a New Domain

When a new domain is created via the `create-domain` skill:

1. Add a new entry to this file following the schema above
2. Define primary signals (unique, high-confidence identifiers)
3. Define secondary signals (supporting signals)
4. Define exclusion patterns (patterns that indicate OTHER domains)
5. Update `CLAUDE.md` Active Domains table to reference this entry

**Do NOT duplicate domain data in:** `domain_patterns.md`, `frontmatter_schema.md`, or any skill template. Those files reference this registry.

---

**Version:** 1.0.0
**Last Updated:** 2026-03-16
