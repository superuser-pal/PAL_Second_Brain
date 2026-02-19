# url_dump Workflow

Capture URLs with automatic content extraction, insight generation, and categorization into the PAL note-taking system.

## Trigger Phrases

- "url dump"
- "save link"
- "save this link"
- "bookmark url"
- "capture url"
- "save for later"

## Output Location

- **Path:** `inbox/notes/url_[slug]_YYYY-MM-DD_HHMM.md`
- **Status:** `ready` (for distribution to domains)

---

## Step 1: Get Timestamp

```bash
date '+%Y-%m-%d %H:%M'
```

Store this value for ALL timestamp fields in frontmatter and filename.

## Step 2: Collect URL Input

Prompt the user:

> "What URL(s) would you like to save? (You can paste one or more URLs, optionally with a note about why you're saving it)"

Accept any format:
- Single URL: `https://example.com/article`
- Multiple URLs (newline or comma separated)
- Markdown links: `[title](url)`
- URL with note: `https://example.com - interesting article about X`

**Parse each URL and any accompanying user notes.**

## Step 3: Process Each URL

For each URL, execute Steps 3a-3g. If batch processing, track results for summary report.

### Step 3a: Validate URL

- Check URL format is valid
- If invalid, report error and continue to next URL

### Step 3b: Fetch Content

Use WebFetch to retrieve page content:

```
WebFetch URL with prompt: "Extract the following:
- Page title
- Meta description (if available)
- Author (if detected)
- Published date (if detected)
- Main content text
- Key headings (H1/H2s)
- Word count estimate
- Is this a tool/software product page? (yes/no)"
```

**If fetch fails:**
- Note limitation in output
- Continue with available metadata (URL, domain)

### Step 3c: Detect Content Type

**Tool Detection Signals:**
- URL patterns: `github.com`, `gitlab.com`, `npmjs.com`, `pypi.org`, product pages, SaaS domains
- Content signals: pricing sections, feature lists, "sign up" / "get started" CTAs, API documentation
- Page structure: product screenshots, comparison tables, testimonials

**Content Types:**
| Type | Description |
|------|-------------|
| `article` | Blog posts, tutorials, opinion pieces, news |
| `tool` | Software, utilities, services, APIs, libraries |
| `video` | YouTube, podcasts, multimedia content |
| `reference` | Documentation, specs, standards |
| `research` | Papers, studies, academic content |

### Step 3d: Generate Insights

**For ALL content types, extract:**

- **Executive Summary:** 2-3 sentences
- **Key Insights:** 3-5 main takeaways with context
- **Notable Quotes:** If any stand out
- **Action Items:** Practical takeaways (if applicable)

**For Tools, additionally extract:**

- **What It Does:** 1-2 sentence description
- **Key Features:** Top 3-5 features
- **Use Cases:** How user might apply this
- **Pricing:** Free/Freemium/Paid/Enterprise (if detected)

### Step 3e: Auto-Detect Category

Map content to PAL categories:

| Content Signals | PAL Category |
|-----------------|--------------|
| Long-form analysis, tutorials, studies, papers | `research` |
| Software, utilities, APIs, libraries, tools | `reference` |
| Documentation, specs, standards | `reference` |
| Creative references, design inspiration | `idea` |
| News, updates, temporal content | `notes` |
| General articles, unclear | `notes` |

**If unclear, default to `notes` and let user adjust during distribution.**

### Step 3f: Build Frontmatter

Generate YAML frontmatter using PAL schema:

**For Articles/General Content:**

```yaml
---
status: "ready"
domain: null
project: null
category: "[detected-category]"
subsection: null
created: "YYYY-MM-DD"
last_modified: "YYYY-MM-DD"
source_type: "url-article"
source_file: null
source_url: "[original-url]"
tags: ["url-capture", "topic1", "topic2"]
url_domain: "[source-domain.com]"
url_author: "[author-if-available]"
url_published: "[publish-date-if-available]"
url_read_time: "[X minutes]"
content_type: "[article|video|reference|research]"
relevance: "[high|medium|low]"
---
```

**For Tools:**

```yaml
---
status: "ready"
domain: null
project: null
category: "reference"
subsection: null
created: "YYYY-MM-DD"
last_modified: "YYYY-MM-DD"
source_type: "url-tool"
source_file: null
source_url: "[original-url]"
tags: ["url-capture", "tool", "topic1", "topic2"]
url_domain: "[source-domain.com]"
content_type: "tool"
relevance: "[high|medium|low]"
pricing: "[free|freemium|paid|enterprise]"
eval_status: "to-evaluate"
---
```

### Step 3g: Build Markdown Content

**Article Template:**

```markdown
# [Title]

## Quick Summary
[2-3 sentence summary of the content]

## Key Insights
- **Insight 1:** [description with context]
- **Insight 2:** [description with context]
- **Insight 3:** [description with context]

## Why This Matters
[Connection to potential use cases. What makes this worth saving?]

## User Note
[Original user note if provided, otherwise omit section]

## Content Highlights
[Key excerpts or quotes from the content - 200-400 words max]

## Practical Takeaways
- [ ] [Action item 1 if applicable]
- [ ] [Action item 2 if applicable]

## Source Details
| Field | Value |
|-------|-------|
| Domain | [domain] |
| Author | [author or "Unknown"] |
| Published | [date or "Unknown"] |
| Word Count | [~X words] |
| Read Time | [~X minutes] |

---
*Captured via url_dump workflow*
```

**Tool Template:**

```markdown
# [Tool Name]

## What It Does
[1-2 sentence description]

## Key Features
- Feature 1
- Feature 2
- Feature 3

## Use Cases
- Use case 1
- Use case 2

## Pricing
[Pricing details if available, otherwise "Unknown"]

## Why It's Relevant
[Connection to user's work/interests if detectable]

## Evaluation Checklist
- [ ] Sign up / try demo
- [ ] Test key features
- [ ] Compare with alternatives
- [ ] Decision: [use|pass|revisit]

## Notes
[Space for user's evaluation notes]

## Source Details
| Field | Value |
|-------|-------|
| Domain | [domain] |
| URL | [url] |

---
*Captured via url_dump workflow*
```

## Step 4: Save File

Generate filename from title slug:

```
url_[title-slug]_YYYY-MM-DD_HHMM.md
```

**Title slug rules:**
- Lowercase
- Replace spaces with hyphens
- Remove special characters
- Max 50 characters

Save to `inbox/notes/`

## Step 5: Report Results

### Single URL Result

```markdown
## URL Captured

**Saved:** inbox/notes/url_[slug]_YYYY-MM-DD_HHMM.md
**Title:** [Page Title]
**Type:** [article|tool|etc]
**Category:** [detected category]
**Status:** ready

### Quick Summary
> "[2-sentence summary preview]..."

### Next Steps
Run `distribute notes` to assign domain and move to project
```

### Batch Results

```markdown
## URLs Captured

Processing [X] URLs...

| # | Title | Type | Category | Status |
|---|-------|------|----------|--------|
| 1 | [Title 1] | article | research | saved |
| 2 | [Title 2] | tool | reference | saved |
| 3 | [Title 3] | - | - | failed: [reason] |

**Summary:**
- Articles: [X] saved
- Tools: [Y] saved
- Failed: [Z]
- Total: [N] URLs processed

**Files saved to:** inbox/notes/

### Next Steps
Run `distribute notes` to assign domains and move to projects
```

---

## Error Handling

| Error | Response |
|-------|----------|
| Invalid URL format | "Invalid URL: [url]. Skipping." |
| Fetch failed | Create entry with minimal metadata, note "Content unavailable" |
| Paywalled content | Extract available preview, note "Paywalled - limited extraction" |
| Empty page | "No content extracted from [url]. Skipping." |
| Duplicate URL | "URL already captured: [existing-file]. Skipping." (check inbox/notes/ for matching source_url) |

## Next Workflows

After url_dump, suggest:
- `distribute_notes` - Assign domain and move to project folder
- `process_inbox` - If user wants to refine category assignment first
