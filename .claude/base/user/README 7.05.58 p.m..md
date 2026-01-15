// Make sure that I reference the correct .md files here

# README.md

**PAL User Layer - Directory Overview**

---

## Purpose

Overview of the USER directory structure and contents. This directory contains your personal knowledge base that enables your AI to understand your life, work, preferences, and goals.

---

## File Structure

| File                 | Purpose                                            |
| -------------------- | -------------------------------------------------- |
| **aboutme.md**       | Personal background and philosophy                 |
| **directives.md**    | System behavioral rules and execution preferences  |
| **digitalassets.md** | Web properties, domains, cloud accounts, hardware  |
| **contacts.md**      | Personal and professional contact directory        |
| **techstack.md**     | Technology preferences and deployment workflows    |
| **terminology.md**   | Canonical definitions, reminders, and dependencies |
| **onboarding.md**    | Technical concepts guide (Git, hooks, deployment)  |
| **resume.md**        | Professional background for bios and introductions |
| **art.md**           | Visual style guidelines and branding               |

---

## How Your AI Uses These Files

**Session Start:**

- Loads all USER files via SessionStart hook
- Establishes identity, preferences, and operating rules
- Initializes with your terminology and reminders

**During Work:**

- Routes requests based on digitalassets.md (recognizes "my site")
- Follows directives.md for execution behavior
- References techstack.md for technology choices
- Uses contacts.md for communication tasks
- Checks terminology.md for custom definitions

**Professional Output:**

- Uses resume.md for bios and introductions
- Applies art.md for visual content
- Follows aboutme.md for authentic representation

---

## Getting Started

**Minimum Setup (Required):**

1. **aboutme.md** - Who you are and what matters to you
2. **directives.md** - How you want your AI to operate
3. **techstack.md** - Your technology preferences

**Expand As Needed:** 4. **digitalassets.md** - Add when working with websites/deployments 5. **contacts.md** - Add when managing professional relationships 6. **terminology.md** - Add custom terms and reminders 7. **resume.md** - Add for professional communications 8. **art.md** - Add for visual content creation 9. **onboarding.md** - Reference for technical learning

---

## Usage Examples

Your AI can answer questions like:

**Digital Assets:**

- "Deploy my main site"
- "What's the repo for my project?"
- "Show me my cloud accounts"

**Contacts:**

- "Who's my contact at [company]?"
- "Email my financial advisor"

**Technology:**

- "What package manager do I use?"
- "How do I deploy this?"
- "What's my Git commit format?"

**Professional:**

- "Write a speaker bio for me"
- "Generate a header image in my style"

---

## Privacy & Security

This directory contains sensitive personal information:

- Keep in your private repository (never public)
- Secrets go in `.env` files, not in these documents
- Reference `PAL_Base/Security/GUARDRAILS.md` for security rules
- digitalassets.md lists environment variables but NOT the actual values

---

## Maintenance

**Regular Updates:**

- Update digitalassets.md when adding new sites/accounts
- Update contacts.md as your network changes
- Update terminology.md with new terms and reminders
- Update techstack.md when adopting new tools

**Periodic Review:**

- aboutme.md - When your focus or goals change
- directives.md - When AI behavior needs adjustment
- resume.md - When professional background updates

---

**Instructions:** This is your AI's knowledge base about you. Keep it current for best results.
