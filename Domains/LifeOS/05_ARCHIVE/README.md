# Archive Folder

Backups, extracted notes, and deprecated content.

## Structure

```
05_ARCHIVE/
├── backups/           # Timestamped file backups
├── extracted/         # Notes moved after extraction (optional)
└── deprecated/        # Old content no longer active
```

## Backups

Before any file modification, the `update` workflow creates a timestamped backup:
- Format: `filename_YYYY-MM-DD_HH-MM-SS.md`
- Location: `05_ARCHIVE/backups/`

## Extracted Notes

After running the `extract` workflow, processed notes can be moved here to prevent re-extraction.

## Recovery

If you need to restore a previous version:
1. Find the backup in `backups/`
2. Copy content back to the original file
3. Log the restoration in `02_SESSIONS/UPDATES.md`
