# Tasks to Issues Workflow

Convert tasks.md into GitHub issues.

## Prerequisites

- tasks.md exists in feature folder
- Project hosted on GitHub
- spec.md status is `implemented` or `documented`

## Steps

1. **Verify GitHub remote**
   - Run `git config --get remote.origin.url`
   - ONLY proceed if remote is a GitHub URL
   - NEVER create issues in non-matching repositories

2. **Load tasks**
   - Read `domains/{domain}/01_PROJECTS/FEAT_NNN_name/tasks.md`
   - Extract task ID, description, phase, file paths, markers

3. **Create issues** (for each task)
   - **Title**: Task description (without checkbox/ID)
   - **Body**: Task ID, file path, phase, dependencies, user story label
   - **Labels**: `setup`, `foundational`, `user-story-N`, `polish`, `parallel`

4. **Update status**
   - Update spec.md frontmatter:
     ```yaml
     status: exported
     next_step: archive
     phase_history:
       - ... existing entries
       - { phase: exported, date: {today}, by: tasks_to_issues }
     ```

5. **Report completion**
   - Total issues created
   - Issues by phase/label
   - Link to GitHub issues page

## Safety

- Verify GitHub URL before creating any issues
- Never create issues in wrong repository
- Offer dry-run confirmation if requested

## Output

- GitHub issues created
- Status: `exported`
- Next: archive feature folder
