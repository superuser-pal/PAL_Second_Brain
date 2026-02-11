# ingest_longform Workflow

Convert long-form documents (PDF, DOCX, TXT) from ports/In/ to structured markdown notes.

## Step 1: Scan Input Port

```bash
ls ports/In/ 2>/dev/null || echo "No files found"
```

Identify files by extension:
- `.pdf` - PDF documents
- `.docx` / `.doc` - Word documents
- `.txt` - Plain text files
- `.rtf` - Rich text files

## Step 2: Process Each Document

For each supported document, use the parse_document tool:

```bash
bun .claude/skills/note-taking/tools/parse_document.ts \
  --input "ports/In/[filename]" \
  --format markdown
```

### Document Parsing Strategy

**PDF Files:**
- Extract text using pdf-parse library
- Preserve headings, paragraphs, lists where detectable
- Extract metadata (title, author, creation date)

**DOCX Files:**
- Convert using mammoth library
- Preserve formatting, headings, lists, tables

**TXT Files:**
- Read directly
- Detect structure from formatting patterns

## Step 3: Generate AI Summary and Key Ideas

Using the extracted content, generate:

1. **Summary:** 2-3 sentence overview of the document
2. **Key Ideas:** 5 main points or takeaways

Prompt for AI:
```
Based on the following document content, provide:
1. A 2-3 sentence summary
2. 5 key ideas or main points

Document content:
[extracted text]
```

## Step 4: Build Structured Markdown

Create the output note with this structure:

```markdown
---
status: unprocessed
domain: null
project: null
category: reference
created: [YYYY-MM-DD]
last_modified: [YYYY-MM-DD]
source_type: [pdf|docx|txt]
source_file: [original filename]
source_url: null
tags: []
---

# [Document Title or Filename]

## Summary

[AI-generated 2-3 sentence summary]

## Key Ideas

- [Key idea 1]
- [Key idea 2]
- [Key idea 3]
- [Key idea 4]
- [Key idea 5]

## Source Information

| Field | Value |
|-------|-------|
| Original File | [filename] |
| File Type | [PDF/DOCX/TXT] |
| Author | [if available] |
| Publication Date | [if available] |
| Ingested | [YYYY-MM-DD] |

---

## Full Content

[Converted markdown content from the document]
```

## Step 5: Interactive Review (Optional)

If running interactively, prompt user:
1. Is the summary accurate? (Edit if needed)
2. Add or modify key ideas?
3. Source URL or publication info to add?
4. Pre-assign to a domain? (speeds up distribution)
5. Set category? (research, reference, notes)

## Step 6: Convert Filename and Save

Convert original filename to `lower_snake_case`:
- `Research Paper.pdf` → `research_paper.md`
- `Meeting Notes 2026.docx` → `meeting_notes_2026.md`

Save to inbox/notes/:
```bash
# Write structured markdown to inbox/notes/[converted_filename].md
```

## Step 7: Move Original to Transit

Move processed original to ports/transit/ for review:

```bash
mv "ports/In/[original_file]" "ports/transit/[original_file]"
```

User can delete from transit after verifying ingestion.

## Step 8: Report Summary

```markdown
## Ingestion Complete

### Documents Processed
| Original File | Type | Output | Summary |
|---------------|------|--------|---------|
| research_paper.pdf | PDF | research_paper.md | Generated |
| meeting_notes.docx | DOCX | meeting_notes.md | Generated |

### Documents Skipped (unsupported format)
- image.png
- spreadsheet.xlsx

### Errors
- corrupt_file.pdf: Failed to parse

### Originals Moved to Transit
- ports/transit/research_paper.pdf
- ports/transit/meeting_notes.docx

**Total:** X ingested, Y skipped, Z errors
```

## Error Handling

- **Unsupported format:** Skip with warning, list supported formats
- **Parse failure:** Report error details, leave file in ports/In/
- **Empty document:** Create minimal note with empty content warning
- **Large document (>50 pages):** Warn about processing time, offer to truncate

## Next Steps

After ingestion:
1. Run `process_inbox` to assign domains and projects
2. Review generated summaries for accuracy
3. Run `distribute_notes` to move to domains
4. Clean up ports/transit/ when verified
