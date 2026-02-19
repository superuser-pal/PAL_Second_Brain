#!/usr/bin/env bun
/**
 * add_frontmatter.ts - Add or update YAML frontmatter in markdown files
 *
 * Usage:
 *   bun .claude/skills/note-taking/tools/add_frontmatter.ts [options]
 *
 * Options:
 *   --file <path>        Target markdown file (required)
 *   --domain <name>      Domain name
 *   --project <name>     Project name
 *   --category <cat>     Category: research | meeting | idea | reference | notes
 *   --status <status>    Status: unprocessed | ready | processed | archived
 *   --tags <tags>        Comma-separated tags
 *   --source-type <type> Source type: manual | pdf | docx | txt | web
 *   --source-file <name> Original source filename
 *   --source-url <url>   Source URL
 *   --update             Update existing frontmatter (merge)
 *   --force              Overwrite existing frontmatter completely
 *   --help               Show help
 */

import { parseArgs } from "util";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

// Types
interface Frontmatter {
  status: string;
  domain: string | null;
  project: string | null;
  category: string;
  created: string;
  last_modified: string;
  source_type: string;
  source_file: string | null;
  source_url: string | null;
  tags: string[];
}

// Parse command line arguments
const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    file: { type: "string", short: "f" },
    domain: { type: "string", short: "d" },
    project: { type: "string", short: "p" },
    category: { type: "string", short: "c" },
    status: { type: "string", short: "s" },
    tags: { type: "string", short: "t" },
    "source-type": { type: "string" },
    "source-file": { type: "string" },
    "source-url": { type: "string" },
    update: { type: "boolean", short: "u" },
    force: { type: "boolean" },
    help: { type: "boolean", short: "h" },
  },
  strict: true,
  allowPositionals: false,
});

// Show help
if (values.help) {
  console.log(`
add_frontmatter - Add or update YAML frontmatter in markdown files

USAGE:
  bun add_frontmatter.ts --file <path> [options]

OPTIONS:
  --file, -f <path>       Target markdown file (required)
  --domain, -d <name>     Domain name (PascalCase)
  --project, -p <name>    Project file name (PROJECT_*.md)
  --category, -c <cat>    Category: research | meeting | idea | reference | notes
  --status, -s <status>   Status: unprocessed | ready | processed | archived
  --tags, -t <tags>       Comma-separated tags
  --source-type <type>    Source: manual | pdf | docx | txt | web
  --source-file <name>    Original source filename
  --source-url <url>      Source URL
  --update, -u            Update existing frontmatter (merge values)
  --force                 Overwrite existing frontmatter completely
  --help, -h              Show this help

EXAMPLES:
  # Add frontmatter to a new note
  bun add_frontmatter.ts --file note.md --domain my-project --status ready

  # Update existing frontmatter
  bun add_frontmatter.ts --file note.md --update --status processed

  # Add with tags
  bun add_frontmatter.ts --file note.md --domain blog --tags "api,backend"

  # Add source information
  bun add_frontmatter.ts --file note.md --source-type pdf --source-file "doc.pdf"
`);
  process.exit(0);
}

// Validate input
if (!values.file) {
  console.error("Error: --file is required");
  process.exit(1);
}

if (!existsSync(values.file)) {
  console.error(`Error: File not found: ${values.file}`);
  process.exit(1);
}

// Valid values
const VALID_STATUS = ["unprocessed", "ready", "processed", "archived"];
const VALID_CATEGORY = ["research", "meeting", "idea", "reference", "notes"];
const VALID_SOURCE_TYPE = ["manual", "pdf", "docx", "txt", "web"];

// Validate status
if (values.status && !VALID_STATUS.includes(values.status)) {
  console.error(`Error: Invalid status '${values.status}'`);
  console.error(`Valid values: ${VALID_STATUS.join(", ")}`);
  process.exit(1);
}

// Validate category
if (values.category && !VALID_CATEGORY.includes(values.category)) {
  console.error(`Error: Invalid category '${values.category}'`);
  console.error(`Valid values: ${VALID_CATEGORY.join(", ")}`);
  process.exit(1);
}

// Validate source-type
if (values["source-type"] && !VALID_SOURCE_TYPE.includes(values["source-type"])) {
  console.error(`Error: Invalid source-type '${values["source-type"]}'`);
  console.error(`Valid values: ${VALID_SOURCE_TYPE.join(", ")}`);
  process.exit(1);
}

// Validate domain exists (if provided)
if (values.domain) {
  const domainPath = `domains/${values.domain}/INDEX.md`;
  if (!existsSync(domainPath)) {
    console.error(`Error: Domain '${values.domain}' not found`);
    console.error(`Expected: ${domainPath}`);

    // List available domains
    const domainsDir = "domains";
    if (existsSync(domainsDir)) {
      const { readdirSync, statSync } = await import("fs");
      const domains = readdirSync(domainsDir).filter((d) =>
        statSync(`${domainsDir}/${d}`).isDirectory()
      );
      if (domains.length > 0) {
        console.error(`Available domains: ${domains.join(", ")}`);
      }
    }
    process.exit(1);
  }
}

// Get today's date
function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

// Parse existing frontmatter from file
function parseExistingFrontmatter(content: string): {
  frontmatter: Partial<Frontmatter> | null;
  body: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (match) {
    try {
      const frontmatter = parseYaml(match[1]) as Partial<Frontmatter>;
      return { frontmatter, body: match[2] };
    } catch {
      return { frontmatter: null, body: content };
    }
  }
  return { frontmatter: null, body: content };
}

// Build frontmatter object
function buildFrontmatter(
  existing: Partial<Frontmatter> | null,
  options: typeof values
): Frontmatter {
  const today = getToday();

  // Parse tags
  const tags = options.tags
    ? options.tags.split(",").map((t) => t.trim().toLowerCase())
    : existing?.tags || [];

  // Merge or create
  return {
    status: options.status || existing?.status || "unprocessed",
    domain: options.domain || existing?.domain || null,
    project: options.project || existing?.project || null,
    category: options.category || existing?.category || "notes",
    created: existing?.created || today,
    last_modified: today,
    source_type: options["source-type"] || existing?.source_type || "manual",
    source_file: options["source-file"] || existing?.source_file || null,
    source_url: options["source-url"] || existing?.source_url || null,
    tags,
  };
}

// Main execution
function main() {
  const content = readFileSync(values.file!, "utf-8");
  const { frontmatter: existing, body } = parseExistingFrontmatter(content);

  // Check if frontmatter exists and handle accordingly
  if (existing && !values.update && !values.force) {
    console.error("Error: File already has frontmatter");
    console.error("Use --update to merge or --force to overwrite");
    process.exit(1);
  }

  // Build new frontmatter
  const baseFrontmatter = values.force ? null : existing;
  const newFrontmatter = buildFrontmatter(baseFrontmatter, values);

  // Generate YAML
  const yamlContent = stringifyYaml(newFrontmatter, {
    nullStr: "null",
    lineWidth: 0,
  });

  // Build new file content
  const newContent = `---\n${yamlContent}---\n${body}`;

  // Write file
  writeFileSync(values.file!, newContent);

  console.log(`Frontmatter ${existing ? "updated" : "added"}: ${values.file}`);
  console.log(`  status: ${newFrontmatter.status}`);
  console.log(`  domain: ${newFrontmatter.domain || "(none)"}`);
  console.log(`  project: ${newFrontmatter.project || "(none)"}`);
  console.log(`  category: ${newFrontmatter.category}`);
}

main();
