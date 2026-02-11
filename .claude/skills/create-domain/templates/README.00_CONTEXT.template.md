# Context

Documents the agent loads for domain-specific context. These files provide background knowledge about the domain.

## Purpose

This folder contains reference documentation that helps the agent understand the domain's background, rules, and constraints. Files here are loaded on-demand when the agent needs domain-specific knowledge.

## File Naming

Files must use `lower_snake_case.md` format.

**Examples:**
- `background_info.md`
- `domain_rules.md`
- `technical_constraints.md`
- `stakeholder_notes.md`

## Usage

- Files here are loaded on-demand via `[REF]` markers
- Add context the agent needs to understand the domain
- Keep files focused and modular (one topic per file)
- Update files as domain knowledge evolves

## What to Include

- Domain background and history
- Key constraints and rules
- Stakeholder information
- Technical requirements
- Reference documentation
