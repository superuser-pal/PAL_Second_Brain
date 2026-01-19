// ═══════════════════════════════════════════════════════════════════
// PRE-TOOL-USE HOOK
// Security validation before tool execution
// Based on .claude/base/security/GUARDRAILS.md
// ═══════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────

interface ToolInput {
  tool_name: string;
  tool_input: {
    file_path?: string;
    command?: string;
    content?: string;
    new_string?: string;
    old_string?: string;
    [key: string]: unknown;
  };
}

type ValidationResult =
  | { status: "allow" }
  | { status: "warn"; message: string }
  | { status: "block"; message: string };

// ─────────────────────────────────────────────────────────────────
// SECURITY RULES
// ─────────────────────────────────────────────────────────────────

const SECURITY_RULES = {
  // BLOCK: Always prevent these (catastrophic)
  blocked: {
    credentials: [
      /api[_-]?key[_-]?[:=]\s*['"]?[a-zA-Z0-9_-]{20,}['"]?/gi,
      /password[_-]?[:=]\s*['"]?[^\s'"]{8,}['"]?/gi,
      /secret[_-]?[:=]\s*['"]?[^\s'"]{8,}['"]?/gi,
      /-----BEGIN\s*(RSA\s+|OPENSSH\s+|DSA\s+|EC\s+|PGP\s+|ENCRYPTED\s+)?PRIVATE\s+KEY-----/gi,
      /AKIA[0-9A-Z]{16}/g, // AWS access key
      /sk_live_[0-9a-zA-Z]{24}/g, // Stripe live key
      /ghp_[0-9a-zA-Z]{36}/g, // GitHub personal token
      /(mysql|postgres|mongodb):\/\/[^:]+:[^@]+@/gi, // DB connection strings with passwords
    ],
    paths: [
      /^\/etc\//,
      /^\/usr\//,
      /^\/bin\//,
      /^\/System\//,
      /^\/var\//,
      /[~\/]\.ssh\//,
      /[~\/]\.aws\//,
      /[~\/]\.gnupg\//,
      /[~\/]Library\/Keychains\//,
      /\.env$/,
      /\.env\.[a-z]+$/i,
      /credentials\.json$/,
    ],
    commands: [
      /rm\s+-rf\s+[\/~]/,
      /rm\s+\*\.md/,
      /chmod\s+777/,
      />\s*\/dev\/sd/,
      /mkfs\./,
      /dd\s+if=/,
      /git\s+push\s+.*--force\s+.*main/,
      /git\s+push\s+.*--force\s+.*master/,
      /git\s+reset\s+--hard\s+HEAD~[0-9]{2,}/,
      /git\s+clean\s+-fd/,
      /DROP\s+(TABLE|DATABASE)/i,
      /TRUNCATE\s+TABLE/i,
      /DELETE\s+FROM\s+\w+\s*$/i, // DELETE without WHERE
    ],
  },

  // WARN: Alert user but allow (risky)
  warned: {
    pii: [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // Phone
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/, // Credit card
    ],
    destructive: [
      /git\s+reset\s+--hard/,
      /git\s+stash\s+drop/,
      /DELETE\s+FROM.*WHERE/i,
    ],
    network: [
      /curl\s+/,
      /wget\s+/,
    ],
    install: [
      /npm\s+install/,
      /bun\s+(install|add)/,
      /brew\s+install/,
    ],
  },

  // PII exceptions - files where PII is expected
  piiExceptions: [
    /CONTACTS\.md$/,
    /RESUME\.md$/,
    /\.env\.example$/,
  ],
};

// ─────────────────────────────────────────────────────────────────
// VALIDATION LOGIC
// ─────────────────────────────────────────────────────────────────

function validateToolUse(input: ToolInput): ValidationResult {
  const { tool_name, tool_input } = input;
  const content = tool_input.content || tool_input.new_string || "";
  const filePath = tool_input.file_path || "";
  const command = tool_input.command || "";

  // Check content for credentials (BLOCK)
  if (content) {
    // Skip credential check for env references
    const isEnvReference = /process\.env\.|Bun\.env\.|import\.meta\.env\./i.test(content);

    if (!isEnvReference) {
      for (const pattern of SECURITY_RULES.blocked.credentials) {
        pattern.lastIndex = 0; // Reset regex state
        if (pattern.test(content)) {
          return {
            status: "block",
            message: `BLOCKED: Potential credential detected in content. Use environment variables instead (process.env.YOUR_KEY).`,
          };
        }
      }
    }
  }

  // Check file paths (BLOCK)
  if (filePath && (tool_name === "Write" || tool_name === "Edit")) {
    for (const pattern of SECURITY_RULES.blocked.paths) {
      if (pattern.test(filePath)) {
        return {
          status: "block",
          message: `BLOCKED: Operation on restricted path: ${filePath}`,
        };
      }
    }
  }

  // Check commands (BLOCK)
  if (tool_name === "Bash" && command) {
    for (const pattern of SECURITY_RULES.blocked.commands) {
      pattern.lastIndex = 0;
      if (pattern.test(command)) {
        return {
          status: "block",
          message: `BLOCKED: Dangerous command pattern detected. Review GUARDRAILS.md for allowed operations.`,
        };
      }
    }
  }

  // Check for PII (WARN) - skip for exception files
  if (content) {
    const isException = SECURITY_RULES.piiExceptions.some((p) => p.test(filePath));

    if (!isException) {
      for (const pattern of SECURITY_RULES.warned.pii) {
        pattern.lastIndex = 0;
        if (pattern.test(content)) {
          return {
            status: "warn",
            message: `WARNING: Potential PII detected. Verify this should be included.`,
          };
        }
      }
    }
  }

  // Check destructive operations (WARN)
  if (command) {
    for (const pattern of SECURITY_RULES.warned.destructive) {
      pattern.lastIndex = 0;
      if (pattern.test(command)) {
        return {
          status: "warn",
          message: `WARNING: Destructive operation detected. Confirm this is intentional.`,
        };
      }
    }
  }

  // Default: Allow
  return { status: "allow" };
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
    // No input, allow by default
    process.exit(0);
  }

  let input: ToolInput;
  try {
    input = JSON.parse(stdinData);
  } catch {
    // Invalid JSON, allow by default
    process.exit(0);
  }

  // Validate
  const result = validateToolUse(input);

  // Handle result
  switch (result.status) {
    case "block":
      console.error(result.message);
      process.exit(1);
      break;

    case "warn":
      console.warn(result.message);
      process.exit(0);
      break;

    case "allow":
      process.exit(0);
      break;
  }
}

main().catch((error) => {
  console.error("Hook error:", error);
  process.exit(0); // Allow on error to avoid blocking legitimate operations
});
