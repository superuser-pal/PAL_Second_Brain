# Reference Guide

This file demonstrates the `lower_snake_case.md` naming convention required for files in `03_ASSETS/`.

## Purpose

Asset files contain reference materials, documentation, data files, and resources that support domain work.

## What Belongs Here

- External documentation
- API references
- Data files
- Images and diagrams
- Any supporting materials

## Domain Workflows

The create-domain skill includes four workflows:

1. **create_domain** - Creates new domains with canonical structure
2. **validate_domain** - Validates existing domains against conventions
3. **map_domain** - Synchronizes INDEX.md and fixes naming violations
4. **archive_domain** - Archives content with deprecation headers

## Templates

Templates are stored in `.claude/skills/create-domain/templates/`:
- `INDEX.template.md` - Domain source of truth template
- `CONNECTIONS.template.yaml` - External integrations template

## Naming Convention

| Correct | Incorrect |
|---------|-----------|
| `reference_guide.md` | `ReferenceGuide.md` |
| `api_documentation.md` | `API-Documentation.md` |
| `user_manual.md` | `UserManual.md` |
