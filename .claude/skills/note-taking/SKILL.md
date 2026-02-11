---
name: note-taking
description: Manage notes from inbox to domains. USE WHEN process notes OR organize notes OR add frontmatter OR distribute notes OR ingest PDF OR ingest document OR convert document OR inbox notes OR note management OR scan inbox OR move notes to domain.
---

# note-taking

Unified note management skill for processing, organizing, and distributing notes across PAL domains.

## Workflow Routing

| Workflow | Trigger | File |
| :--- | :--- | :--- |
| **process_inbox** | "process inbox", "add frontmatter", "scan notes" | `workflows/process_inbox.md` |
| **distribute_notes** | "distribute notes", "move notes to domains", "organize notes" | `workflows/distribute_notes.md` |
| **ingest_longform** | "ingest PDF", "convert document", "ingest document" | `workflows/ingest_longform.md` |

## Examples

**Example 1: Process raw notes in inbox**
```
User: "Process my inbox notes"
-> Invokes process_inbox workflow
-> Scans inbox/notes/ for .md files without YAML frontmatter
-> Prompts user for domain, project, category assignment
-> Adds standardized YAML frontmatter
-> Notes ready for distribution
```

**Example 2: Distribute processed notes to domains**
```
User: "Distribute my notes to their domains"
-> Invokes distribute_notes workflow
-> Scans inbox/notes/ for notes with status: ready
-> Moves each note to domains/[domain]/03_ASSETS/
-> Adds reference link to PROJECT_*.md if project field set
-> Leaves notes without frontmatter in place
```

**Example 3: Ingest a PDF document**
```
User: "Ingest the PDF in my ports folder"
-> Invokes ingest_longform workflow
-> Scans ports/In/ for PDF, DOCX, TXT files
-> Converts content to structured markdown
-> AI generates summary and key ideas
-> Adds YAML frontmatter with source metadata
-> Outputs to inbox/notes/ ready for processing
```

## Quick Reference

**Folder Locations:**
- Raw notes: `inbox/notes/`
- Document input: `ports/In/`
- Processed notes destination: `domains/[domain]/03_ASSETS/`
- Project updates: `domains/[domain]/01_PROJECTS/`

**Full Documentation:**
- Frontmatter Schema: `templates/frontmatter_schema.md`
