# Tasks to Issues Workflow

Convert feature tasks into GitHub issues.

## Prerequisites

- Feature file exists (FEATURE.md or tasks.md)
- Project hosted on GitHub
- Feature status is `implemented` or `documented`

## Steps

1. **Format detection**
   - Check for `FEATURE.md` (v2 format) or `tasks.md` (v1 format)
   - Read frontmatter from appropriate file:
     - v2: `FEATURE.md` frontmatter
     - v1: `spec.md` frontmatter

2. **Verify GitHub remote**
   - Run `git config --get remote.origin.url`
   - ONLY proceed if remote is a GitHub URL
   - NEVER create issues in non-matching repositories

3. **Verify Repository Target (Routing Check)**
   - Read routing from frontmatter (`routing: personal | open-source`)
   - If `routing: open-source`:
     - Verify working directory is within `Domains/PALOpenSource/` OR
     - Explicitly target the submodule repo: `superuser-pal/PAL_Framework`
     - Use `gh issue create --repo superuser-pal/PAL_Framework` for issue creation
   - If `routing: personal`:
     - Target main repo's GitHub remote
   - **WARN** if routing field doesn't match current repository context
   - **STOP** if mismatch detected and ask user to confirm correct target

4. **Load tasks**
   - v2 format (FEATURE.md):
     - Read from `## Tasks` section in `domains/{domain}/01_PROJECTS/FEAT_NNN_name/FEATURE.md`
     - Extract task ID, description, phase, file paths, markers
   - v1 format (tasks.md):
     - Read from `domains/{domain}/01_PROJECTS/FEAT_NNN_name/tasks.md`
     - Extract task ID, description, phase, file paths, markers

5. **Create issues** (for each task)
   - **Title**: Task description (without checkbox/ID)
   - **Body**: Task ID, file path, phase, dependencies, user story label
   - **Labels**: `setup`, `foundational`, `user-story-N`, `polish`, `parallel`

6. **Update status**
   - v2 format (FEATURE.md):
     - Update FEATURE.md frontmatter:
       ```yaml
       status: exported
       current_phase: completed
       phase_history:
         - ... existing entries
         - { phase: exported, date: {today}, by: tasks_to_issues }
       ```
   - v1 format (spec.md):
     - Update spec.md frontmatter as above

7. **Report completion**
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
- Current Phase: `completed`
- Next: archive feature folder

## Format Detection Note

- New format (v2): Tasks in `FEATURE.md` under `## Tasks` section
- Old format (v1): Tasks in `tasks.md` file
- Both formats coexist - workflow detects and handles appropriately
