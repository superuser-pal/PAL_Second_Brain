# Archive

Deprecated content not loaded in context. Files here are excluded from domain operations but kept for future reference.

## Purpose

This folder stores completed, cancelled, or superseded content that should be retained but not actively loaded. Files here are excluded from active domain context.

## File Naming

Preserve original filenames. Do not rename archived files.

## Usage

- Move completed projects here via `archive-domain` workflow
- Files should have a deprecation header added before archiving
- Content remains accessible for reference but excluded from active workflows
- Use when content is no longer relevant but may be needed later

## Deprecation Header

Files moved here should include this header:

```yaml
---
deprecated: YYYY-MM-DD
reason: [Project completed | Superseded by FILE | No longer relevant | Cancelled]
original_location: [Original folder path]
---
```

## What Gets Archived

- Completed projects (from `01_PROJECTS/`)
- Old session logs (from `02_SESSIONS/`)
- Outdated assets (from `03_ASSETS/`)
- Superseded outputs (from `04_OUTPUTS/`)
- Any content no longer actively used
