// ═══════════════════════════════════════════════════════════════════
// POST-TOOL-USE HOOK
// Content schema validation after Write/Edit operations
// Validates YAML frontmatter for notes, INDEX.md, and PROJECT files
// Based on Proposal 1 from Arcontexta competitive analysis
// ═══════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────

interface ToolInput {
  tool_name: string;
  tool_input: {
    file_path?: string;
    content?: string;
    new_string?: string;
    old_string?: string;
    [key: string]: unknown;
  };
}

interface SchemaScope {
  name: string;
  pattern: RegExp;
  requiredFields: string[];
  description?: string;
}

// ─────────────────────────────────────────────────────────────────
// SCHEMA SCOPES
// ─────────────────────────────────────────────────────────────────

const SCHEMA_SCOPES: SchemaScope[] = [
  {
    name: "Inbox Note",
    pattern: /Inbox\/Notes\/.*\.md$/,
    requiredFields: ["origin", "type", "status", "created", "last_updated"],
  },
  {
    name: "Domain Page",
    pattern: /Domains\/[^/]+\/02_PAGES\/.*\.md$/,
    requiredFields: [
      "name",
      "origin",
      "type",
      "status",
      "domain",
      "url",
      "favorite",
      "tags",
      "created",
      "last_updated",
    ],
  },
  {
    name: "Domain INDEX",
    pattern: /Domains\/[^/]+\/INDEX\.md$/,
    requiredFields: ["name", "description", "status", "last_updated"],
  },
  {
    name: "Task List",
    pattern: /Domains\/[^/]+\/01_PROJECTS\/AD_HOC_TASKS\.md$/,
    requiredFields: ["name", "type", "domain", "last_updated"],
    description: "Ad hoc task list",
  },
  {
    name: "Project File",
    pattern: /Domains\/[^/]+\/01_PROJECTS\/PROJECT_.*\.md$/,
    requiredFields: [
      "name",
      "domain",
      "goal",
      "status",
      "priority",
      "target_deadline",
      "task_progress",
      "tags",
      "created",
      "last_updated",
    ],
  },
  // Context File (00_CONTEXT/*.md, not GOAL_*)
  {
    name: "Context File",
    pattern: /Domains\/[^/]+\/00_CONTEXT\/(?!GOAL_)[^/]+\.md$/,
    requiredFields: ["name", "domain", "description", "status", "tags", "last_updated"],
    description: "Context file",
  },
  // Goal File (00_CONTEXT/GOAL_*.md)
  {
    name: "Goal File",
    pattern: /Domains\/[^/]+\/00_CONTEXT\/GOAL_[^/]+\.md$/,
    requiredFields: ["name", "domain", "description", "status", "target_deadline", "projects_related", "last_updated"],
    description: "Goal file",
  },
];

// ─────────────────────────────────────────────────────────────────
// FRONTMATTER PARSING
// ─────────────────────────────────────────────────────────────────

function parseFrontmatter(content: string): Record<string, unknown> | null {
  // Match YAML frontmatter between --- delimiters
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match || !match[1]) return null;

  const yaml = match[1];
  const fields: Record<string, unknown> = {};

  // Simple YAML key extraction (top-level fields only)
  for (const line of yaml.split("\n")) {
    const keyMatch = line.match(/^([a-z_]+)\s*:/);
    if (keyMatch && keyMatch[1]) {
      const key = keyMatch[1];
      const colonIndex = line.indexOf(":");
      const value = colonIndex >= 0 ? line.slice(colonIndex + 1).trim() : "";
      // Treat "null", empty, and missing values as absent
      if (value && value !== "null" && value !== '""' && value !== "''") {
        fields[key] = value;
      }
    }
  }

  return fields;
}

// ─────────────────────────────────────────────────────────────────
// VALIDATION LOGIC
// ─────────────────────────────────────────────────────────────────

function validateSchema(
  filePath: string,
  fileContent: string
): string | null {
  // Find matching scope
  const scope = SCHEMA_SCOPES.find((s) => s.pattern.test(filePath));
  if (!scope) return null; // Not a validated file type

  // Parse frontmatter
  const fields = parseFrontmatter(fileContent);

  if (!fields) {
    return `Schema warning for ${scope.name}: Missing YAML frontmatter. Expected fields: ${scope.requiredFields.join(", ")}`;
  }

  // Check required fields
  const missing = scope.requiredFields.filter((f) => !(f in fields));

  if (missing.length > 0) {
    const fileName = filePath.split("/").pop() || filePath;
    return `Schema warning for ${scope.name} "${fileName}": Missing fields: ${missing.join(", ")}`;
  }

  return null; // All good
}

// ─────────────────────────────────────────────────────────────────
// MAIN EXECUTION
// ─────────────────────────────────────────────────────────────────

async function main() {
  // Read tool input from stdin (Claude Code passes JSON)
  const chunks: Buffer[] = [];
  for await (const chunk of Bun.stdin.stream()) {
    chunks.push(chunk as Buffer);
  }
  const stdinData = Buffer.concat(chunks).toString("utf-8");

  if (!stdinData.trim()) {
    process.exit(0);
  }

  let input: ToolInput;
  try {
    input = JSON.parse(stdinData);
  } catch {
    process.exit(0);
  }

  // Only validate Write and Edit operations
  const { tool_name, tool_input } = input;
  if (tool_name !== "Write" && tool_name !== "Edit") {
    process.exit(0);
  }

  const filePath = tool_input.file_path || "";

  // Only validate .md files
  if (!filePath.endsWith(".md")) {
    process.exit(0);
  }

  // Read file from disk (PostToolUse — file already written)
  let fileContent: string;
  try {
    fileContent = await Bun.file(filePath).text();
  } catch {
    // File not readable, skip silently
    process.exit(0);
  }

  // Validate schema
  const warning = validateSchema(filePath, fileContent);

  if (warning) {
    // Output as additionalContext for Claude to see
    // Uses same pattern as Arcontexta's write-validate.sh
    console.log(JSON.stringify({ additionalContext: warning }));
  }

  process.exit(0);
}

main().catch(() => {
  // Allow on error to avoid blocking legitimate operations
  process.exit(0);
});
