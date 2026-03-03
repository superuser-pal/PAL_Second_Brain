---
title: "09 - Agent Evaluation"
description: "Metrics, patterns, and tools for measuring custom agent effectiveness"
tags: [agents, testing, guide]
series: PAL Second Brain Documentation
order: 9
---

# 09 — Agent Evaluation

> Part of the [PAL Second Brain](https://github.com/yourusername/pal-second-brain) documentation series.

---

## Why Evaluate Agents

When you create custom agents in `.claude/agents/`, you're encoding specialized expertise into reusable personas. But how do you know if your agents are actually helping you stay organized and productive?

**Without evaluation**, you're building blind:
- No way to measure if agent responses are improving or degrading over time
- Can't compare different agent configurations objectively
- Difficult to identify which aspects of agent context need refinement

**With evaluation**, you iterate with confidence:
- Quantify agent quality through metrics (task completion, accuracy, relevance)
- A/B test different agent configurations with measurable outcomes
- Build feedback loops for continuous improvement

**Core principle**: Agents are configurations. Like all configurations, they need testing and iteration.

---

## Metrics to Track

### 1. Task Completion and Relevance

**What to measure:**
- Did the agent accomplish what you asked?
- Were the responses relevant to your domain?
- Did the agent stay within its defined scope?

**Example — life-coach agent:**
- Asked to review weekly goals: Did it actually reference your goals in `Domains/LifeOS/01_PROJECTS/`?
- Did it suggest actionable next steps, or give generic advice?
- Did it maintain its persona throughout the session?

### 2. Context Efficiency

**What to measure:**
- How much context did the agent consume to complete the task?
- Did it load unnecessary files?
- Could it have been more targeted in its file reads?

**Why it matters for second brain users:** Agents that load too many files burn through your context budget, leading to earlier `/compact` cycles and degraded session quality.

### 3. User Satisfaction

**Simple feedback approach:**

After an agent completes a task, ask yourself:
- Did the agent save me time compared to doing this manually?
- Would I use this agent again for similar tasks?
- What was confusing or unhelpful?

Log your answers in the domain's `02_SESSIONS/` folder for future review.

### 4. Tool Usage Efficiency

**What to measure:**
- How many file reads did the agent perform?
- Did it choose the right files to read?
- Were there unnecessary tool calls?

---

## Implementation Patterns

### Pattern 1: Session Review Log

After each agent session, log a brief evaluation:

```markdown
## Agent Session Review: 2026-02-10

**Agent:** product-manager
**Task:** Review quarterly roadmap priorities
**Duration:** 15 minutes
**Context used:** ~35%

### Assessment
- **Task completed:** Yes — produced prioritized list with rationale
- **Relevance:** High — referenced INDEX.md and active projects correctly
- **Missed context:** Did not check 02_SESSIONS/ for previous decisions
- **Rating:** 4/5

### Improvements
- Add instruction to check recent session logs before making recommendations
```

### Pattern 2: A/B Testing Configurations

Compare two versions of an agent:

```yaml
# .claude/agents/life-coach.md (version A)
# Focus: Structured check-ins with numbered priorities

# .claude/agents/life-coach-v2.md (version B)
# Focus: Open-ended reflection with guided questions
```

Run the same task with both versions. Compare:
- Which produced more actionable output?
- Which consumed less context?
- Which felt more useful in practice?

### Pattern 3: Feedback Loop Integration

Build evaluation into your workflow:

1. **Weekly**: Review session logs in `02_SESSIONS/` — identify patterns in what worked and what didn't
2. **Monthly**: Update agent instructions based on aggregated feedback
3. **Quarterly**: Major agent refinement if needed

---

## Example: Evaluating a PAL Agent

### The product-manager Agent

**What it should do:**
- Load PALProduct domain context
- Understand current product roadmap and priorities
- Help with strategic decisions, competitive analysis, and feature planning

**Evaluation criteria:**

| Metric | Good | Needs Work |
|--------|------|------------|
| **Loads correct domain** | Reads PALProduct/INDEX.md first | Reads unrelated domains |
| **References active projects** | Checks 01_PROJECTS/ for current work | Makes recommendations without checking state |
| **Stays in scope** | Product strategy focus | Drifts into unrelated topics |
| **Uses session history** | References 02_SESSIONS/ for past decisions | Ignores previous context |
| **Context efficiency** | Completes task at <50% context | Burns through 70%+ on simple tasks |

### Running the Evaluation

```
1. Load the agent: /product-manager
2. Give it a standard task: "Review our current priorities and suggest what to focus on next"
3. Observe: Does it check INDEX.md? Active projects? Past sessions?
4. Rate the output: Was it actionable? Relevant? Efficient?
5. Log the result in 02_SESSIONS/
```

---

## Best Practices

### Start Simple

**Week 1**: Just note whether the agent was helpful (yes/no) after each session.
**Week 2**: Add a 1-5 rating and one line of feedback.
**Week 3**: Build a template for structured evaluation.
**Week 4**: Review all feedback and update agent instructions.

### Focus on Actionable Metrics

Don't track metrics you won't act on. Prioritize:
1. **Task completion rate** — Refine agent instructions
2. **Context efficiency** — Optimize what the agent loads
3. **Your satisfaction** — The ultimate measure

### Build Feedback Loops

Metrics are useless without action:
- Weekly: Review session notes, identify patterns
- Monthly: Update agent instructions based on data
- Quarterly: Major agent refactoring if needed

---

## How PAL Uses This

PAL agents are built with evaluation in mind:

- **8-section structure:** Every agent has a defined persona, capabilities, and error handling — making it easy to assess whether the agent performed within scope
- **Session commands:** Use `/sessions:session-end` to generate Part B (System Improvement Notes) that capture friction and suggest fixes — this is a built-in feedback loop
- **Requirements traceability:** Each agent behavior maps to a documented requirement (see [04 — Requirements and Hooks](./04-requirements-and-hooks.md)), so you can verify whether the agent met its spec

To evaluate your own PAL agents, start by reviewing session logs in `02_SESSIONS/` and tracking which `*commands` you use most frequently.

---

**Previous:** [08 — Learning with AI](./08-learning-with-ai.md) | **Next:** [10 — Observability](./10-observability.md)
