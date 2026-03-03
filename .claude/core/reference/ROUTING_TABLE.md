---
title: PAL Routing Table
version: 1.0.0
layer: SYSTEM
purpose: Agent routing for PAL Master — loaded only on *agents command
last_updated: 2026-02-20
---

# Routing Table

```yaml
- name: pal-master
  domain: none
  location: .claude/agents/pal-master.md
  routes_to: "system operations, orchestration, domain/agent creation, pattern documentation"

- name: pal-builder
  domain: pal-builder
  location: .claude/agents/pal-builder.md
  routes_to: "PAL system building, specification-driven development, feature implementation"

- name: life-coach
  domain: life-os
  location: .claude/agents/life-coach.md
  routes_to: "personal life management, mission, beliefs, goals, projects, mental models, lessons"

- name: studio-agent
  domain: studio
  location: .claude/agents/studio-agent.md
  routes_to: "video production, presentations, Scaledraw files, production media"

- name: substack-manager
  domain: laralou
  location: .claude/agents/substack-manager.md
  routes_to: "Substack content, newsletter management, growth strategy"

- name: pal-release-manager
  domain: PALOpenSource
  location: .claude/agents/pal-release-manager.md
  routes_to: "open-source release management, version control, sync private to public, changelog updates, release validation"

- name: product-manager
  domain: PALProduct
  location: .claude/agents/product-manager.md
  routes_to: "product strategy, roadmap planning, user research, feature prioritization, user value documentation, competitive analysis, PRD creation"
```
