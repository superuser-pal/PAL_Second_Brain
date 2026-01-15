# MCP Servers Configuration

This directory contains Model Context Protocol (MCP) server configurations for the PAI project.

## What is MCP?

MCP (Model Context Protocol) allows Claude Code to integrate with external tools and services, extending its capabilities beyond built-in features.

## Configuration

Edit [servers.json](servers.json) to configure MCP servers.

## Available MCP Servers

Common MCP servers you can add:

- **@modelcontextprotocol/server-filesystem** - Enhanced file system access
- **@modelcontextprotocol/server-github** - GitHub API integration
- **@modelcontextprotocol/server-brave-search** - Web search capabilities
- **@modelcontextprotocol/server-postgres** - Database access
- **@modelcontextprotocol/server-sqlite** - SQLite database
- **@modelcontextprotocol/server-puppeteer** - Browser automation
- **@modelcontextprotocol/server-slack** - Slack integration

## Security

- Never commit API keys or credentials to version control
- Use environment variables for sensitive data
- Keep servers.json in .gitignore if it contains secrets
- Consider using a .env file for credentials

## Enabling a Server

1. Open [servers.json](servers.json)
2. Find the server you want to enable
3. Set `"enabled": true`
4. Add required credentials/environment variables
5. Restart Claude Code session

## Creating Custom MCP Servers

You can create custom MCP servers for project-specific integrations. See the [MCP documentation](https://github.com/anthropics/anthropic-quickstarts/tree/main/mcp) for details.

## Troubleshooting

- Ensure npx is available in your PATH
- Check that required dependencies are installed
- Verify API keys and credentials are correct
- Review Claude Code logs for error messages
