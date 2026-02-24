# PAL Setup Guide

> Step-by-step installation and configuration instructions

**Version:** 0.1.0-alpha
**Last Updated:** 2026-02-16

---

## Prerequisites

Before setting up PAL, ensure you have:

| Requirement     | Notes                                                    |
| --------------- | -------------------------------------------------------- |
| **macOS**       | Primary TESTED platform                                  |
| **Git**         | For cloning and version control                          |
| **Bun**         | JavaScript runtime and package manager for notifications |
| **Claude Code** | Anthropic's CLI for Claude                               |
| **OPTIONAL**    |                                                          |
| **+AI Models**  | Not directly supported but can be adapted                |
| **IDEs**        | Antigravity, Cursor and VS Code                          |
| **Obsidian**    | Recommended for best experience                          |

---

## Installation

### Step 1: Clone the Repository

```bash
# Clone PAL to your projects directory
git clone https://github.com/yourusername/pal-personal.git

# Navigate to the directory
cd pal-personal
```

### Step 2: Install Dependencies

```bash
# Install dependencies using Bun
bun install
```

### Step 3: Configure Claude Code

If you haven't installed Claude Code yet:

```bash
# Install Claude Code globally
npm install -g @anthropic-ai/claude-code

# Or with Bun
bun install -g @anthropic-ai/claude-code
```

Set up your API key:

```bash
# Set your Anthropic API key
export ANTHROPIC_API_KEY="your-api-key-here"

# Or add to your shell profile (~/.zshrc or ~/.bashrc)
echo 'export ANTHROPIC_API_KEY="your-api-key-here"' >> ~/.zshrc
```

### Step 4: Verify Installation

```bash
# Start Claude Code in the PAL directory
cd pal-personal
claude

# Once in Claude Code, try these commands:
# *skills    - Should list 8 skills
# *agents    - Should list 3 agents
# *context   - Should show loaded context
```

---

## Obsidian Setup (Recommended)

PAL is designed as a "second brain" — Obsidian provides the best reading and navigation **(+ plug-ins for enhanced experience are amazing)**

### Install Obsidian

1. Download from [obsidian.md](https://obsidian.md)
2. Install on macOS
3. Open Obsidian

### Open PAL as a Vault

1. In Obsidian, click **Open folder as vault**
2. Navigate to your `pal-personal` directory
3. Click **Open**
4. When prompted, click **Trust author and enable plugins**

### Install Claudian

[Claudian](https://github.com/YishenTu/claudian) is an Obsidian plugin that embeds Claude Code as an AI collaborator in your vault.

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/YishenTu/claudian/releases/latest).
2. Create a folder called `claudian` in your vault's plugins folder:
   ```text
   /path/to/vault/.obsidian/plugins/claudian/
   ```
3. Copy the downloaded files into the `claudian` folder.
4. Enable the plugin in Obsidian:
   **Settings** → **Community plugins** → Enable **Claudian**.

### Recommended Settings

Open Settings (Cmd+,) and configure:

**Files & Links:**

- Enable **Detect all file extensions**
- Set **Default location for new notes** to `inbox/notes/`
- Enable **Use [[Wikilinks]]**

**Editor:**

- Enable **Show line numbers**
- Enable **Fold heading**

### Essential Plugins

Install these community plugins (Settings → Community plugins → Browse):

| Plugin         | Purpose                                          |
| -------------- | ------------------------------------------------ |
| **Tasks**      | Project management task tracking with checkboxes |
| **Dataview**   | Query your domains and projects dynamically      |
| **Calendar**   | Navigate session logs by date                    |
| **Excalidraw** | Create and edit visual diagrams                  |

**Tips:**

- Star frequently used files (like INDEX.md files)
- Use graph view to explore domain connections
- Pin tabs for files you reference often

---

## Configuration

### Environment Variables

Create a `.env` file in the project root (if needed):

```bash
# .env
ANTHROPIC_API_KEY=your-api-key-here
```

**Note:** `.env` is in `.gitignore` and won't be committed.

### Stack Preferences

PAL uses these defaults (configured in `.claude/CLAUDE.md`):

| Setting             | Value              |
| ------------------- | ------------------ |
| **Package Manager** | Bun                |
| **Runtime**         | Bun                |
| **Backend**         | Cloudflare Workers |
| **Database**        | PostgreSQL         |

---

## Verification Checklist

After setup, verify everything works:

### Claude Code

```bash
# In the pal-personal directory
claude

# Test commands:
*skills     # Lists 8 skills
*agents     # Lists 3 agents
*context    # Shows loaded context files
```

### Obsidian

- [ ] PAL opens as a vault
- [ ] INDEX.md files render correctly
- [ ] Links between files work
- [ ] Graph view shows domain connections

### File Structure

```bash
# Verify key directories exist
ls -la .claude/skills/        # Should show 8 skill directories
ls -la .claude/agents/        # Should show 3 agent files
ls -la Domains/               # Should show domain directories
```

---

## Troubleshooting

### Claude Code Not Recognizing Skills

**Problem:** `*skills` returns empty or error

**Solution:**

1. Ensure you're in the correct directory (`pal-personal`)
2. Check that `.claude/skills/` exists
3. Restart Claude Code: `claude`

### API Key Issues

**Problem:** "Invalid API key" or authentication errors

**Solution:**

```bash
# Verify your API key is set
echo $ANTHROPIC_API_KEY

# If empty, set it again
export ANTHROPIC_API_KEY="your-api-key-here"
```

### Obsidian Not Finding Files

**Problem:** Links show as unresolved

**Solution:**

1. Settings → Files & Links
2. Enable **Detect all file extensions**
3. Restart Obsidian

### Bun Installation Issues

**Problem:** `bun: command not found`

**Solution:**

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Restart your terminal or source your profile
source ~/.zshrc
```

### Hook Errors

**Problem:** SessionStart or PreToolUse hook errors

**Solution:**

1. Check `.claude/tools/hooks/` exists
2. Verify TypeScript files are present
3. Run `bun install` to ensure dependencies

---

## Updating PAL

To update to the latest version:

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
bun install

# Restart Claude Code
claude
```

---

**Document Version:** 0.1.0-alpha
**Last Updated:** 2026-02-23
