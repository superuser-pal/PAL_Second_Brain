---
title: "07 - Data Privacy and Retention"
description: "What data Claude Code sends to Anthropic servers and how to protect sensitive information"
tags: [privacy, security, guide]
series: PAL Second Brain Documentation
order: 7
---

# 07 — Data Privacy and Retention

> Part of the [PAL Second Brain](https://github.com/yourusername/pal-second-brain) documentation series.

> **Critical**: Everything you share with Claude Code is sent to Anthropic servers. This guide explains what data leaves your machine and how to protect sensitive information.

---

## Retention Summary

| Configuration | Retention Period | Training | How to Enable |
|---------------|------------------|----------|---------------|
| **Consumer (default)** | 5 years | Yes | (default state) |
| **Consumer (opt-out)** | 30 days | No | [claude.ai/settings](https://claude.ai/settings/data-privacy-controls) |
| **Team / Enterprise / API** | 30 days | No (default) | Use Team, Enterprise plan, or API keys |
| **ZDR (Zero Data Retention)** | 0 days server-side | No | Appropriately configured API keys |

**Immediate action**: [Disable training data usage](https://claude.ai/settings/data-privacy-controls) to reduce retention from 5 years to 30 days.

---

## Understanding the Data Flow

When you use Claude Code, the following data is sent to Anthropic:

- **Prompts you type** — every message you send
- **Files Claude reads** — including personal notes, domain content, and project files
- **Command outputs** — results from any bash commands
- **Error messages** — stack traces and error details

### What This Means for Second Brain Users

| Scenario | Data Sent to Anthropic |
|----------|------------------------|
| You ask Claude to read a domain INDEX.md | Full file contents |
| You run a braindump and Claude processes it | Your raw thoughts and the processed output |
| Claude reads your ABOUTME.md | Your personal identity and preferences |
| You process inbox notes | All note contents |

**Key concern for second brain users**: Your personal notes, goals, beliefs, and project details are sent to Anthropic when Claude reads them. Consider what you put in your vault with this in mind.

---

## Known Risks

### Risk 1: Personal Context Files

Claude Code reads your ABOUTME.md, DIRECTIVES.md, and CONTACTS.md at every session start. These contain personal information that is sent to Anthropic according to your retention tier.

**Mitigation**: Keep sensitive personal details (financial info, medical data, legal matters) out of context files. Use these files for professional identity and preferences only.

### Risk 2: Domain Content

When you load a domain agent, Claude reads INDEX.md and any files you reference. If your domains contain sensitive client data, research, or confidential projects, that content is transmitted.

**Mitigation**: For sensitive domains, consider what files you reference in conversation. Use Plan Mode to explore without sending excessive content.

### Risk 3: The `/bug` Command

When you run `/bug`, your **full conversation history** (including all file contents) is sent to Anthropic for bug triage. This data is retained for **5 years**, regardless of your training opt-out setting.

**Mitigation**: Disable the command if you work with sensitive content:

```bash
export DISABLE_BUG_COMMAND=1
```

---

## Protective Measures

### Immediate Actions

#### 1. Opt Out of Training

1. Visit https://claude.ai/settings/data-privacy-controls
2. Toggle OFF "Allow model training"
3. Retention reduces from 5 years to 30 days

#### 2. Configure File Exclusions

In `.claude/settings.json`, use `permissions.deny` to block access to sensitive files:

```json
{
  "permissions": {
    "deny": [
      "Read(./.env*)",
      "Edit(./.env*)",
      "Write(./.env*)",
      "Read(./secrets/**)",
      "Read(./**/*.pem)",
      "Read(./**/*.key)"
    ]
  }
}
```

#### 3. Opt Out of Telemetry

```bash
# In ~/.zshrc or ~/.bashrc
export DISABLE_TELEMETRY=1
export DISABLE_ERROR_REPORTING=1
export DISABLE_BUG_COMMAND=1
```

### Best Practices for Second Brain Users

| Practice | Why |
|----------|-----|
| Keep financial/medical data out of the vault | Reduces exposure of sensitive information |
| Use generic names in CONTACTS.md | Minimizes PII sent to servers |
| Review what files agents load | Understand what gets transmitted |
| Opt out of training immediately | Reduces retention from 5 years to 30 days |
| Use Plan Mode for sensitive exploration | Read-only mode still sends data, but generates less |

---

## Enterprise Considerations

### When to Use Enterprise API (ZDR)

- Handling PII (names, emails, addresses)
- Regulated industries (HIPAA, GDPR, PCI-DSS)
- Client data processing
- Government contracts

### Quick Checklist

- [ ] Training opt-out enabled at claude.ai/settings
- [ ] `.env*` files blocked via `permissions.deny`
- [ ] Security hooks installed (PAL provides these by default)
- [ ] Sensitive personal data kept out of context files
- [ ] Team aware of data flow to Anthropic

---

## Governance and Values

### Constitutional AI Framework

Anthropic published Claude's constitution in January 2026 (CC0 license — public domain). The value hierarchy:

1. **Broadly safe** — Never compromise human supervision and control
2. **Broadly ethical** — Honesty, harm avoidance, good conduct
3. **Anthropic compliance** — Internal guidelines and policies
4. **Genuinely helpful** — Real utility for users and society

### What This Means for You

- Claude may be conservative with security-sensitive requests
- Safety takes priority over helpfulness in edge cases
- The constitution is public and reusable (CC0 license)

### Resources

| Resource | URL |
|----------|-----|
| Privacy settings | https://claude.ai/settings/data-privacy-controls |
| Anthropic usage policy | https://www.anthropic.com/policies |
| Constitution full text | https://www.anthropic.com/constitution |

---

## How PAL Uses This

PAL's `pre-tool-use` hook implements several protective measures automatically:

- **Credential blocking:** API keys, passwords, and private keys are blocked from being written to files
- **Path restrictions:** `.env` files, `~/.ssh/`, and system directories are protected
- **PII warnings:** Email addresses and phone numbers trigger warnings (with exceptions for CONTACTS.md)
- **Safe patterns allowed:** Environment variable references (`process.env.API_KEY`) pass through

You don't need to configure these manually — they're active from the first session. See [04 — Requirements and Hooks](./04-requirements-and-hooks.md) for details.

---

**Previous:** [06 — Adoption Approaches](./06-adoption-approaches.md) | **Next:** [08 — Learning with AI](DELETE-08-learning-with-ai.md)
