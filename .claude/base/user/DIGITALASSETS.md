---
name: user-digital-assets
description: PAL User Layer - Digital Assets registry tracking web properties, cloud accounts, domains, and API references
version: 1.0.0
---

## Purpose

Centralized registry of your digital assets for instant recognition and management. Your AI uses this to understand what you own and how to work with it.

---

## Web Properties

| Site             | URL                 | Local Path           | GitHub Repo      | Stack       | Deployment |
| ---------------- | ------------------- | -------------------- | ---------------- | ----------- | ---------- |
| **Main Site**    | example.com         | `~/Projects/Website` | username/website | [Framework] | [Platform] |
| **Project Site** | project.example.com | `~/Projects/Project` | username/project | [Framework] | [Platform] |

### Routing Rules

- "my site", "main site" → ~/Projects/Website
- "project site" → ~/Projects/Project

---

## Deployment Commands

Each website should have its own deploy script:

```bash
# Standard deployment pattern
cd /path/to/project
bun run deploy
git push
```

**Important:** Customize deployment commands based on your tech stack.

---

## Cloud Accounts

| Service    | Purpose        | Account                |
| ---------- | -------------- | ---------------------- |
| AWS        | Infrastructure | your-email@example.com |
| Cloudflare | DNS/CDN        | your-email@example.com |
| GitHub     | Repositories   | username               |
| Vercel     | Hosting        | your-email@example.com |

---

## Domains

| Domain      | Registrar   | Expiration | DNS Provider |
| ----------- | ----------- | ---------- | ------------ |
| example.com | [Registrar] | YYYY-MM-DD | [Provider]   |

---

## API Keys & Credentials

**Note:** Store actual credentials in environment variables or a secure vault, not in this file.

| Service    | Environment Variable | Purpose    |
| ---------- | -------------------- | ---------- |
| Anthropic  | `ANTHROPIC_API_KEY`  | AI API     |
| OpenAI     | `OPENAI_API_KEY`     | AI API     |
| Cloudflare | `CF_API_TOKEN`       | Deployment |

---
