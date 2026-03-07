Interactive guided setup for PAL's personal context files (ABOUTME.md and DIRECTIVES.md).

Walk the user through a structured interview to populate their personal context. This is designed for first-time setup or when the user wants to refresh their profile.

## Interview Flow

### Phase 1: Identity (-> ABOUTME.md)

Ask these questions one at a time. Wait for each answer before proceeding.

1. **Who are you?** "What's your name, age, and where are you based? What do you do professionally?"
2. **What are you known for?** "What expertise or work are you recognized for? Any projects or accomplishments you want the AI to know about?"
3. **What do you believe in?** "What values drive your decisions? What's your personal mission or long-term goal?"
4. **What are you working on?** "What are your current projects or focus areas? (List 2-4)"
5. **What are you learning?** "Any skills or topics you're actively studying?"
6. **Personal context:** "Anything about your life situation, daily routine, or personal circumstances the AI should know?"
7. **Communication style:** "How do you like information delivered? (e.g., direct, detailed, casual, formal) Any pet peeves?"
8. **What does success look like?** "Short-term goals (this year) and long-term vision?"

### Phase 2: Directives (-> DIRECTIVES.md)

9. **Planning preference:** "When I'm about to make changes, should I always show a plan first, only for complex tasks, or let me decide?"
10. **Error handling:** "When something goes wrong, should I stop and ask, try to fix it, or continue if it's minor?"
11. **Autonomy level:** "Should I activate skills automatically when I detect a match, tell you first, or wait for you to invoke them manually?"
12. **Code standards:** "Any specific coding preferences? (e.g., always use TypeScript, prefer functional style, etc.)"

### Phase 3: Generate Files

After collecting all answers:

1. Read the current `.claude/core/user/ABOUTME.md` to understand the existing structure
2. Read the current `.claude/core/user/DIRECTIVES.md` to understand the existing structure
3. Generate updated versions preserving the file structure but filling in the user's answers
4. Show the user a preview of both files
5. Ask for confirmation before writing
6. Write the files

### Important

- Preserve the existing YAML frontmatter (name, description, version fields)
- Keep the section structure of both files — just fill in the content
- If the user already has content, show what will change and confirm
- Never overwrite without explicit approval
