# digitalassets.md

**PAL User Layer - Digital Assets**

---

## Purpose

Centralized registry of your digital assets for instant recognition and management. Your AI uses this to understand what you own and how to work with it.

---

## Web Properties

| Site             | URL                 | Local Path           | GitHub Repo      | Stack       | Deployment |
| ---------------- | ------------------- | -------------------- | ---------------- | ----------- | ---------- |
| **Main Site**    | example.com         | `~/Projects/Website` | username/Website | [Framework] | CF Worker  |
| **Project Site** | project.example.com | `~/Projects/Project` | username/Project | [Framework] | CF Worker  |

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

**Important:** Use `bun run deploy` - the package.json script handles deployment correctly.

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
| example.com | [Registrar] | YYYY-MM-DD | Cloudflare   |

---

## Smart Home (Optional)

| System     | Purpose        | Documentation               |
| ---------- | -------------- | --------------------------- |
| Homebridge | HomeKit bridge | See HomeBridgeManagement.md |

---

## Hardware

| Device        | Purpose  | Location |
| ------------- | -------- | -------- |
| [Workstation] | Primary  | Office   |
| [Laptop]      | Mobile   | Mobile   |
| [Server]      | Services | Home     |

---

## API Keys & Credentials

**Note:** Store actual credentials in environment variables or a secure vault, not in this file.

| Service    | Environment Variable | Purpose    |
| ---------- | -------------------- | ---------- |
| Anthropic  | `ANTHROPIC_API_KEY`  | AI API     |
| OpenAI     | `OPENAI_API_KEY`     | AI API     |
| Cloudflare | `CF_API_TOKEN`       | Deployment |

---

**Instructions:** Replace with your actual assets. The AI uses this for deployment tasks, account management, and troubleshooting.
