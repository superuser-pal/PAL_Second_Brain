# Git Workflow: Branch, Change, Push to Main

A step-by-step guide for safely making changes and merging to main.

---

## Quick Reference

```bash
git checkout -b feature/my-change   # 1. Create branch
# make your edits...
git add .                           # 2. Stage
git commit -m "Add feature"         # 3. Commit
git push -u origin feature/my-change # 4. Push
# Create PR on GitHub, then merge
```

---

## Step-by-Step Guide

### 1. Check Where You Are

```bash
git status
```

**What it does:** Shows your current branch and any uncommitted changes.

**Example output:**
```
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

---

### 2. Update Main First

```bash
git checkout main
git pull
```

**What it does:** Switches to main and downloads the latest changes.

**Why:** You want your new branch to start from the latest code.

---

### 3. Create a New Branch

```bash
git checkout -b feature/your-feature-name
```

**What it does:** Creates AND switches to a new branch in one command.

**Naming examples:**
- `feature/add-login-page`
- `fix/broken-link`
- `docs/update-readme`

**Example output:**
```
Switched to a new branch 'feature/add-login-page'
```

---

### 4. Make Your Changes

Edit files normally using your editor. When done, check what changed:

```bash
git status
```

**Example output:**
```
On branch feature/add-login-page
Changes not staged for commit:
  modified:   src/app.ts

Untracked files:
  src/login.ts
```

---

### 5. Stage Your Changes

```bash
git add .
```

**What it does:** Prepares ALL changed files for commit.

**Alternative - stage specific files:**
```bash
git add src/login.ts src/app.ts
```

---

### 6. Commit Your Changes

```bash
git commit -m "Add login page with form validation"
```

**What it does:** Saves your staged changes with a message.

**Good commit messages:**
- Start with a verb: Add, Fix, Update, Remove
- Be specific: "Fix broken link in footer" not "Fix bug"

**Example output:**
```
[feature/add-login-page 3a2b1c0] Add login page with form validation
 2 files changed, 45 insertions(+)
 create mode 100644 src/login.ts
```

---

### 7. Push Your Branch

```bash
git push -u origin feature/add-login-page
```

**What it does:** Uploads your branch to GitHub. The `-u` flag sets up tracking.

**Example output:**
```
Total 3 (delta 1), reused 0 (delta 0)
remote: Create a pull request for 'feature/add-login-page' on GitHub by visiting:
remote:   https://github.com/user/repo/pull/new/feature/add-login-page
To github.com:user/repo.git
 * [new branch]      feature/add-login-page -> feature/add-login-page
```

---

### 8. Create Pull Request on GitHub

1. Go to your repository on GitHub
2. You'll see a banner: "feature/add-login-page had recent pushes"
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
git merge feature/add-login-page
git push
git branch -d feature/add-login-page
```

---

### 10. Update Your Local Main

```bash
git checkout main
git pull
```

**What it does:** Gets your merged changes locally.

---

## Common Mistakes & Fixes

### "I committed to main by accident"

```bash
# Undo last commit (keeps your changes)
git reset --soft HEAD~1

# Create branch and move there
git checkout -b feature/my-feature

# Now commit properly
git add .
git commit -m "Your message"
```

### "I forgot to pull before branching"

```bash
# Get latest main
git fetch origin main

# Update your branch with main's changes
git rebase origin/main
```

### "I need to update my branch with main"

```bash
git checkout main
git pull
git checkout feature/my-feature
git merge main
```

---

## Useful Commands

| Command | What it does |
|---------|--------------|
| `git status` | Show current state |
| `git branch` | List all local branches |
| `git branch -a` | List all branches (including remote) |
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
