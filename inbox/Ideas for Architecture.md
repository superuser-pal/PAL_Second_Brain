## Context 

- Opinion: shift from regular Gen AI usage to vibe coding and the development of agentic logic.
	- Entrepreneurs and developers are making the jump to leading tools to achieve more efficient workloads and code output, while others are creating the 1M-dollar idea that will get them out of their 9-to-5. 
	- Claude is making the bet to introduce Claude Code to a wider audience given the benfits it can have for day-to-day digital operations of non-coders (Claude Cowork)

## 1. Why a Framework?

- **Bridge for Professionals:** PAL serves as a gateway for non-technical users to access advanced AI developer tools such as Claude Code.

- **Beyond Chat UI:** It solves the limitations of standard chat interfaces, which lack persistent context, reliable memory, and orchestration.
    
- **Low-Floor, High-Ceiling:** It provides an easy starting point for beginners while allowing for unlimited growth in complex task automation.
    
- **Architect Mental Model:** It shifts the user from "asking for favors" (Autopilot) to "managing a system" of specialized agents (Architect).
    

## 2. Context Engineering vs. Prompt Engineering

- **Context over Prompts:** Prompts are repetitive and temporary; context is a persistent, reliable, and version-controlled logic system.
    
- **Directory Power:** A well-structured local directory is more powerful and deterministic than chasing a "perfect" long prompt.
    
    

## 3. CLAUDE.md (Primary directives and FW index)

- **Primary Layer:** This file is where the framework’s orchestration layer resides.
    
- **PAL Master Identity:** It defines the "PAL Master" agent, the generalist orchestrator users interact with first.
    
- **Core Responsibilities:** The master agent handles intent classification, routing decisions, context assembly, and execution oversight.
    

### 4. Skills Logic

- **Modular Capabilities:** Skills are domain-specific (e.g., blogging, security) and contain their own knowledge and workflows.
    
- **Intent-Based Routing:** Skills activate through **conceptual matching** rather than keywords, triggered by the mandatory `USE WHEN` clause in their configuration.
    
- **Flat Structure:** Every skill must follow a strict, flat directory layout (max 2 levels deep) to ensure discoverability and speed.
    

### 5. Workflow Logic

- **Repeatable Sequences:** Workflows are multi-step actions designed for consistent, observable, and recoverable execution.
    
- **Three Types:**
    
    - **Sequential:** Linear steps (1 → 2 → 3).
        
    - **Conditional:** Branching paths based on results or environment conditions.
        
    - **Nested:** Complex workflows that call other workflows as single steps.
        
- **Skill-Contained:** Workflows live strictly within their parent skill directory.
    

### 6. Agent Logic

- **Specialized Personas:** Agents are domain specialists (e.g., "Art Agent") loaded for extended sessions rather than one-off tasks.
    
- **Four-Layer Context:** Unlike the generalist master, agents load four specific context layers: USER, SYSTEM, SECURITY, and DOMAIN.
    
- **Domain Binding:** Every agent is bound to a project domain, using an `INDEX.md` as its single "Source of Truth".
    

### 7. Documentation Logic (Domains)

- **Precision and Isolation:** Domain-driven documentation organizes project-specific context to prevent "context pollution" and ensure precision.
    
- **Standardized Folders:** Workspaces use numbered prefixes for clear organization: `01_PLANS`, `02_SESSIONS`, `03_ASSETS`, and `05_ARCHIVE`.
    
- **Source of Truth:** The `INDEX.md` file at the root of a domain provides the AI with its current state, key facts, and active work.
    

### 8. Routing Logic

- **Conceptual Matching:** The system analyzes the semantic meaning of a request rather than just searching for keywords.
    
- **Routing Path:** Intent Classification → Skill Match Score → Threshold Decision (Activate, Suggest, or Clarify).
    
- **Execution Choice:** The PAL Master determines if it should use a skill, load a specialist agent, or execute a direct tool command.
    

### 9. Tools and Hooks

- **Hooks (Lifecycle):** TypeScript code that executes at deterministic points: `SessionStart` (loads base context), `PreToolUse` (security check), and `Stop` (notifications/cleanup).
    
- **Tools (Deterministic Logic):** CLI utilities (often written in TypeScript/Bun) that encapsulate complex or repetitive operations to eliminate model hallucinations.
    
- **Security Guardrails:** The `PreToolUse` hook intercepts every tool call and validates it against `GUARDRAILS.md` to block catastrophic risks.