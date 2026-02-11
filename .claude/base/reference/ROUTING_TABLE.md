---
title: PAL Routing Table
version: 1.0.0
layer: SYSTEM
purpose: Agent routing for PAL Master — loaded only on *agents command
last_updated: 2026-02-07
---

# Routing Table

```yaml
- name: pal-master
  domain: none
  location: .claude/agents/pal-master.md
  routes_to: "system operations, orchestration, domain/agent creation, pattern documentation"

- name: blog-agent
  domain: blog-content
  location: .claude/agents/blog-agent.md
  routes_to: "blog posts, content creation, editing, SEO optimization"

- name: finance-agent
  domain: finance
  location: .claude/agents/finance-agent.md
  routes_to: "budgets, expenses, income tracking, financial reports"

- name: security-agent
  domain: security-audits
  location: .claude/agents/security-agent.md
  routes_to: "security, audit, vulnerability, penetration test"

- name: devops-agent
  domain: devops
  location: .claude/agents/devops-agent.md
  routes_to: "deployments, staging, production, CI/CD, infrastructure"
```
