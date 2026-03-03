---
title: "14 - Git Workflow"
description: "Step-by-step guide for saving, branching, and syncing changes to your second brain"
tags: [guide, git, reference]
series: PAL Second Brain Documentation
order: 14
---

# 14 — Git Workflow

> Part of the [PAL Second Brain](https://github.com/yourusername/pal-second-brain) documentation series.

---

## Quick Reference

```bash
git checkout -b update/my-change   # 1. Create branch
# make your edits...
git add .                          # 2. Stage
git commit -m "Add project notes"  # 3. Commit
git push -u origin update/my-change # 4. Push
# Create PR on GitHub, then merge
```

---

## Step-by-Step Guide

### 1. Check Where You Are

```bash
git status
```

Shows your current branch and any uncommitted changes.

---

### 2. Update Main First

```bash
git checkout main
git pull
```

Switches to main and downloads the latest changes. You want your new branch to start from the latest state.

---

### 3. Create a New Branch

```bash
git checkout -b update/your-change-name
```

Creates AND switches to a new branch in one command.

**Naming examples:**
- `update/add-project-notes`
- `update/reorganize-inbox`
- `update/new-domain-setup`

---

### 4. Make Your Changes

Edit files normally using Obsidian, Claude Code, or your editor. When done, check what changed:

```bash
git status
```

**Example output:**

```
On branch update/add-project-notes
Changes not staged for commit:
  modified:   Domains/MyProject/INDEX.md

Untracked files:
  Domains/MyProject/01_PROJECTS/new_feature.md
```

---

### 5. Stage Your Changes

```bash
git add .
```

Prepares ALL changed files for commit.

**Alternative — stage specific files:**

```bash
git add Domains/MyProject/INDEX.md
git add Domains/MyProject/01_PROJECTS/new_feature.md
```

---

### 6. Commit Your Changes

```bash
git commit -m "Add project notes for new feature"
```

Saves your staged changes with a message.

**Good commit messages:**
- Start with a verb: Add, Update, Remove, Organize, Process
- Be specific: "Update INDEX.md with current project status" not "Changes"

---

### 7. Push Your Branch

```bash
git push -u origin update/add-project-notes
```

Uploads your branch to GitHub. The `-u` flag sets up tracking.

---

### 8. Create Pull Request on GitHub

1. Go to your repository on GitHub
2. You'll see a banner about your recent push
3. Click **"Compare & pull request"**
4. Add a title and description
5. Click **"Create pull request"**

---

### 9. Merge to Main

**Option A: On GitHub (recommended)**
1. Review your changes in the PR
2. Click **"Merge pull request"**
3. Click **"Confirm merge"**
4. Click **"Delete branch"** (cleanup)

**Option B: Using CLI**

```bash
git checkout main
git pull
git merge update/add-project-notes
git push
git branch -d update/add-project-notes
```

---

### 10. Update Your Local Main

```bash
git checkout main
git pull
```

Gets your merged changes locally.

---

## Common Mistakes and Fixes

### "I committed to main by accident"

```bash
# Undo last commit (keeps your changes)
git reset --soft HEAD~1

# Create branch and move there
git checkout -b update/my-change

# Now commit properly
git add .
git commit -m "Your message"
```

### "I forgot to pull before branching"

```bash
git fetch origin main
git rebase origin/main
```

### "I need to update my branch with main"

```bash
git checkout main
git pull
git checkout update/my-change
git merge main
```

---

## Useful Commands

| Command | What it does |
|---------|--------------|
| `git status` | Show current state |
| `git branch` | List all local branches |
| `git log --oneline -5` | Show last 5 commits |
| `git diff` | Show unstaged changes |
| `git stash` | Temporarily save changes |
| `git stash pop` | Restore stashed changes |

---

## The Golden Rule

**Never push directly to main.** Always:
1. Create a branch
2. Make changes
3. Push branch
4. Create PR
5. Merge

This keeps main stable and your history clean.

---

## How PAL Uses This

PAL is a git repository. All your context files, agents, skills, and domain content are version-controlled. This means:

- You can track changes to your second brain over time
- You can roll back mistakes
- You can share your setup (or parts of it) with others via branches and PRs

PAL's open-source distribution uses a **submodule** structure: the reusable framework lives in a public repo, while your personal content stays in a private repo. The git workflow above applies to both.

---

**Previous:** [13 — Claude Cowork](./13-cowork.md)
