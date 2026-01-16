# Claude Code Proxy - Setup Instructions

A transparent monitoring proxy that logs all Claude Code API requests and provides a web dashboard for visualization.

---

## Quick Start

### 1. Start the Services

```bash
cd .claude/tools/maintanance/claude-code-proxy
make dev
```

This starts:

- **Proxy Server** on `http://localhost:3001`
- **Web Dashboard** on `http://localhost:5173`

### 2. Configure Claude Code

In a **new terminal**, set the proxy URL before launching Claude Code:

```bash
export ANTHROPIC_BASE_URL=http://localhost:3001
claude
```

All requests will now be logged and visible in the dashboard.

---

## Services Overview

| Service       | Port | URL                   | Purpose                  |
| ------------- | ---- | --------------------- | ------------------------ |
| Proxy Server  | 3001 | http://localhost:3001 | Intercepts API requests  |
| Web Dashboard | 5173 | http://localhost:5173 | Visualizes conversations |

---

## Verification

### Health Check

```bash
curl http://localhost:3001/health
```

Expected response:

```json
{ "status": "healthy", "timestamp": "..." }
```

### Dashboard Access

Open browser to: http://localhost:5173

You should see an empty request list initially. After using Claude Code with the proxy configured, requests will appear here.

---

## Make Proxy Permanent

Add to your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
export ANTHROPIC_BASE_URL=http://localhost:3001
```

Then reload:

```bash
source ~/.zshrc
```

**Note:** Claude Code will fail if the proxy is not running when `ANTHROPIC_BASE_URL` is set. Remove or comment out the export to use Claude Code without the proxy.

---

## Available Commands

| Command         | Description                             |
| --------------- | --------------------------------------- |
| `make dev`      | Start both services in development mode |
| `make build`    | Build proxy binary and web bundle       |
| `make install`  | Install Go and Node dependencies        |
| `make clean`    | Remove build artifacts and database     |
| `make db-reset` | Reset the SQLite database               |

---

## Stopping Services

**Option 1:** Press `Ctrl+C` in the terminal running `make dev`

**Option 2:** Kill processes manually:

```bash
pkill -f "bin/proxy"
pkill -f "remix"
```

---

## Configuration

### config.yaml

Main configuration file for server settings:

```yaml
server:
  port: 3001
  timeouts:
    read: 10m
    write: 10m
    idle: 10m

providers:
  anthropic:
    base_url: "https://api.anthropic.com"
    max_retries: 3

storage:
  db_path: "requests.db"

subagents:
  enable: false # Set to true to enable agent routing
```

### .env

Environment variable overrides:

```bash
PORT=3001
ANTHROPIC_FORWARD_URL=https://api.anthropic.com
DATABASE_PATH=requests.db
```

---

## Data Storage

All requests are stored in `requests.db` (SQLite database) in the proxy directory.

To clear all stored requests:

```bash
make db-reset
```

Or manually delete:

```bash
rm requests.db
```

---

## Troubleshooting

### Proxy not starting

1. Check if port 3001 is in use: `lsof -i :3001`
2. Kill any existing process: `kill -9 <PID>`

### Dashboard not loading

1. Check if port 5173 is in use: `lsof -i :5173`
2. Ensure Node dependencies are installed: `cd web && bun install`

### Claude Code connection refused

1. Verify proxy is running: `curl http://localhost:3001/health`
2. Check `ANTHROPIC_BASE_URL` is set correctly: `echo $ANTHROPIC_BASE_URL`

### Permission errors during install

Run with sandbox disabled or use:

```bash
cd web && bun install
```

---

## File Structure

```
claude-code-proxy/
├── config.yaml          # Server configuration
├── .env                 # Environment variables
├── Makefile             # Build/run commands
├── run.sh               # Startup script
├── requests.db          # SQLite database (created on first run)
├── bin/                 # Compiled binaries
│   └── proxy            # Go proxy server
├── proxy/               # Go source code
│   ├── cmd/proxy/       # Entry point
│   └── internal/        # Core logic
└── web/                 # React/Remix dashboard
    ├── app/             # Source code
    └── build/           # Production build
```

---

## Optional: Subagent Routing

Route specific Claude Code agents to different LLM providers (e.g., route a code-reviewer to GPT-4o).

1. Enable in `config.yaml`:

   ```yaml
   subagents:
     enable: true
     mappings:
       code-reviewer: "gpt-4o"
   ```

2. Set OpenAI API key in `.env`:

   ```bash
   OPENAI_API_KEY=your-key-here
   ```

3. Restart the proxy

---

## Requirements

- **Go** 1.20+ (for proxy server)
- **Node.js** 18+ (for web dashboard)
- **Bun** (recommended) or npm

Check versions:

```bash
go version    # Should be 1.20+
node --version  # Should be 18+
```
