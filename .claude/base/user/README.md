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
| **ABOUTME.md**       | Personal background and philosophy                 |
| **DIRECTIVES.md**    | System behavioral rules and execution preferences  |
| **DIGITALASSETS.md** | Web properties, domains, cloud accounts, hardware  |
| **CONTACTS.md**      | Personal and professional contact directory        |
| **TECHSTACK.md**     | Technology preferences and deployment workflows    |
| **TERMINOLOGY.md**   | Canonical definitions, reminders, and dependencies |
| **ONBOARDING.md**    | Technical concepts guide (Git, hooks, deployment)  |
| **RESUME.md**        | Professional background for bios and introductions |
| **ART.md**           | Visual style guidelines and branding               |

---

## How Your AI Uses These Files

**Session Start:**

- Loads all USER files via SessionStart hook
- Establishes identity, preferences, and operating rules
- Initializes with your terminology and reminders

**During Work:**

- Routes requests based on DIGITALASSETS.md (recognizes "my site")
- Follows DIRECTIVES.md for execution behavior
- References TECHSTACK.md for technology choices
- Uses CONTACTS.md for communication tasks
- Checks TERMINOLOGY.md for custom definitions

**Professional Output:**

- Uses RESUME.md for bios and introductions
- Applies ART.md for visual content
- Follows ABOUTME.md for authentic representation

---

## Getting Started

**Minimum Setup (Required):**

1. **ABOUTME.md** - Who you are and what matters to you
2. **DIRECTIVES.md** - How you want your AI to operate
3. **TECHSTACK.md** - Your technology preferences

**Expand As Needed:** 4. **DIGITALASSETS.md** - Add when working with websites/deployments 5. **CONTACTS.md** - Add when managing professional relationships 6. **TERMINOLOGY.md** - Add custom terms and reminders 7. **RESUME.md** - Add for professional communications 8. **ART.md** - Add for visual content creation 9. **ONBOARDING.md** - Reference for technical learning

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
- DIGITALASSETS.md lists environment variables but NOT the actual values

---

## Maintenance

**Regular Updates:**

- Update DIGITALASSETS.md when adding new sites/accounts
- Update CONTACTS.md as your network changes
- Update TERMINOLOGY.md with new terms and reminders
- Update TECHSTACK.md when adopting new tools

**Periodic Review:**

- ABOUTME.md - When your focus or goals change
- DIRECTIVES.md - When AI behavior needs adjustment
- RESUME.md - When professional background updates

---

**Instructions:** This is your AI's knowledge base about you. Keep it current for best results.
