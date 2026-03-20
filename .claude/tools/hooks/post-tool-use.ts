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
}

// ─────────────────────────────────────────────────────────────────
// SCHEMA SCOPES
// ─────────────────────────────────────────────────────────────────

const VALID_DESTINATION_VALUES = ["pages", "context", "projects", "all"];

const SCHEMA_SCOPES: SchemaScope[] = [
  {
    name: "Inbox Note",
    pattern: /Inbox\/Notes\/.*\.md$/,
    requiredFields: ["origin", "type", "status", "created", "last_updated"],
  },
  {
    name: "Domain Page",
    pattern: /Domains\/[^/]+\/02_PAGES\/.*\.md$/,
    requiredFields: ["name", "origin", "type", "status", "domain", "url", "favorite", "tags", "created", "last_updated"],
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
  },
  {
    name: "Project File",
    pattern: /Domains\/[^/]+\/01_PROJECTS\/PROJECT_.*\.md$/,
    requiredFields: ["name", "domain", "goal", "status", "priority", "target_deadline", "task_progress", "tags", "created", "last_updated"],
  },
  {
    name: "Context File",
    pattern: /Domains\/[^/]+\/00_CONTEXT\/(?!GOAL_)[^/]+\.md$/,
    requiredFields: ["name", "domain", "description", "status", "tags", "last_updated"],
  },
  {
    name: "Goal File",
    pattern: /Domains\/[^/]+\/00_CONTEXT\/GOAL_[^/]+\.md$/,
    requiredFields: ["name", "domain", "description", "status", "target_deadline", "projects_related", "last_updated"],
  },
  {
    name: "Current Session",
    pattern: /\.claude\/sessions\/\.current-session$/,
    requiredFields: ["agent", "domain", "loaded_paths", "loaded_at"],
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
// VALIDATION & AUTO-HEALING LOGIC
// ─────────────────────────────────────────────────────────────────

async function validateAndHealSchema(
  filePath: string,
  fileContent: string
): Promise<string | null> {
  // Find matching scope
  const scope = SCHEMA_SCOPES.find((s) => s.pattern.test(filePath));
  if (!scope) return null; // Not a validated file type

  // Parse frontmatter
  const fields = parseFrontmatter(fileContent);

  if (!fields) {
    return `Schema warning for ${scope.name}: Missing YAML frontmatter block entirely. Manual fix required. Expected fields: ${scope.requiredFields.join(", ")}`;
  }

  // Validate destination field for Inbox Notes (optional field, but value must be valid if present)
  if (scope.name === "Inbox Note" && "destination" in fields) {
    const dest = fields["destination"] as string;
    if (dest && dest !== "null" && !VALID_DESTINATION_VALUES.includes(dest)) {
      return `Schema warning for Inbox Note "${filePath.split("/").pop()}": Invalid destination value "${dest}". Allowed: pages, context, projects, all, null`;
    }
  }

  // Check required fields
  const missing = scope.requiredFields.filter((f) => !(f in fields));

  if (missing.length === 0) {
    return null; // All good
  }

  // Try to auto-heal missing fields
  const healedFields: Record<string, string> = {};
  const now = new Date().toISOString();

  for (const field of missing) {
    if (field === "created" || field === "last_updated" || field === "updated") {
      healedFields[field] = now;
    } else if (field === "status" && (scope.name === "Inbox Note" || scope.name === "Domain Page" || scope.name === "Domain INDEX" || scope.name === "Project File")) {
      healedFields[field] = scope.name === "Inbox Note" ? "unprocessed" : "draft";
    } else if (field === "origin") {
      healedFields[field] = "manual";
    } else if (field === "type") {
      healedFields[field] = "note";
    }
  }

  const successfullyHealed = Object.keys(healedFields);
  const stillMissing = missing.filter((f) => !successfullyHealed.includes(f));
  
  // If we healed anything, rewrite the file
  if (successfullyHealed.length > 0) {
    let newContent = fileContent;
    
    // Simple top-level injection right after the first `---`
    // This assumes the file has a valid YAML block format as checked by parseFrontmatter
    const match = fileContent.match(/^---\n([\s\S]*?)\n---/);
    if (match) {
      const injectionString = successfullyHealed.map(k => `${k}: ${healedFields[k]}`).join("\n") + "\n";
      newContent = newContent.replace(/^---\n/, `---\n${injectionString}`);
      
      try {
        await Bun.write(filePath, newContent);
        
        let message = `Auto-healed frontmatter in ${scope.name} "${filePath.split("/").pop()}": injected [${successfullyHealed.join(", ")}].`;
        if (stillMissing.length > 0) {
          message += ` Still missing (could not auto-heal): [${stillMissing.join(", ")}].`;
        }
        return message;
      } catch (e) {
        return `Schema warning for ${scope.name}: Missing fields: [${missing.join(", ")}]. Auto-heal failed: write error.`;
      }
    }
  }

  if (stillMissing.length > 0) {
    const fileName = filePath.split("/").pop() || filePath;
    return `Schema warning for ${scope.name} "${fileName}": Missing fields: ${stillMissing.join(", ")}`;
  }

  return null;
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

  // Only validate .md files and .current-session
  const isCurrentSession = filePath.endsWith(".current-session");
  if (!filePath.endsWith(".md") && !isCurrentSession) {
    process.exit(0);
  }

  // Skip validation for empty .current-session (cleared on *dismiss)
  if (isCurrentSession) {
    const raw = await Bun.file(filePath).text().catch(() => "");
    if (!raw.trim()) process.exit(0);
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
  const warning = await validateAndHealSchema(filePath, fileContent);

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
