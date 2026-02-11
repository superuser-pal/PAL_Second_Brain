#!/usr/bin/env bun
/**
 * parse_document.ts - Convert documents (PDF, DOCX, TXT) to markdown
 *
 * Usage:
 *   bun .claude/skills/note-taking/tools/parse_document.ts [options]
 *
 * Options:
 *   --input <path>       Input file path (required)
 *   --output <path>      Output path (optional, defaults to stdout)
 *   --format <type>      Output format: markdown | json | text (default: markdown)
 *   --help               Show help
 */

import { parseArgs } from "util";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { extname, basename } from "path";

// Types
interface ParseResult {
  title: string;
  content: string;
  metadata: {
    author?: string;
    createdDate?: string;
    pageCount?: number;
    wordCount: number;
  };
  format: string;
}

interface ParseError {
  error: string;
  file: string;
  details?: string;
}

// Parse command line arguments
const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    input: { type: "string", short: "i" },
    output: { type: "string", short: "o" },
    format: { type: "string", short: "f", default: "markdown" },
    help: { type: "boolean", short: "h" },
  },
  strict: true,
  allowPositionals: false,
});

// Show help
if (values.help) {
  console.log(`
parse_document - Convert documents to markdown

USAGE:
  bun parse_document.ts --input <file> [options]

OPTIONS:
  --input, -i <path>    Input file path (required)
  --output, -o <path>   Output file path (default: stdout)
  --format, -f <type>   Output format: markdown | json | text (default: markdown)
  --help, -h            Show this help

SUPPORTED FORMATS:
  .pdf   - PDF documents (requires pdf-parse)
  .docx  - Word documents (requires mammoth)
  .doc   - Legacy Word documents (requires mammoth)
  .txt   - Plain text files
  .rtf   - Rich text files (basic support)

EXAMPLES:
  bun parse_document.ts --input document.pdf
  bun parse_document.ts --input notes.docx --output notes.md
  bun parse_document.ts --input report.pdf --format json
`);
  process.exit(0);
}

// Validate input
if (!values.input) {
  console.error("Error: --input is required");
  process.exit(1);
}

if (!existsSync(values.input)) {
  console.error(`Error: File not found: ${values.input}`);
  process.exit(1);
}

// Get file extension
const ext = extname(values.input).toLowerCase();
const filename = basename(values.input, ext);

// Parse based on file type
async function parseDocument(filepath: string): Promise<ParseResult | ParseError> {
  const extension = extname(filepath).toLowerCase();

  try {
    switch (extension) {
      case ".pdf":
        return await parsePDF(filepath);
      case ".docx":
      case ".doc":
        return await parseDOCX(filepath);
      case ".txt":
        return parseTXT(filepath);
      case ".rtf":
        return parseRTF(filepath);
      default:
        return {
          error: "Unsupported format",
          file: filepath,
          details: `Extension ${extension} is not supported. Use .pdf, .docx, .txt, or .rtf`,
        };
    }
  } catch (err) {
    return {
      error: "Parse failed",
      file: filepath,
      details: err instanceof Error ? err.message : String(err),
    };
  }
}

// PDF Parser
async function parsePDF(filepath: string): Promise<ParseResult> {
  try {
    const pdfParse = await import("pdf-parse");
    const dataBuffer = readFileSync(filepath);
    const data = await pdfParse.default(dataBuffer);

    return {
      title: data.info?.Title || filename,
      content: data.text,
      metadata: {
        author: data.info?.Author,
        createdDate: data.info?.CreationDate,
        pageCount: data.numpages,
        wordCount: data.text.split(/\s+/).length,
      },
      format: "pdf",
    };
  } catch (err) {
    // If pdf-parse is not installed, provide helpful error
    if (String(err).includes("Cannot find package")) {
      throw new Error(
        "pdf-parse package not installed. Run: bun add pdf-parse"
      );
    }
    throw err;
  }
}

// DOCX Parser
async function parseDOCX(filepath: string): Promise<ParseResult> {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.convertToMarkdown({ path: filepath });

    const content = result.value;
    const wordCount = content.split(/\s+/).length;

    // Extract title from first heading or filename
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : filename;

    return {
      title,
      content,
      metadata: {
        wordCount,
      },
      format: "docx",
    };
  } catch (err) {
    if (String(err).includes("Cannot find package")) {
      throw new Error("mammoth package not installed. Run: bun add mammoth");
    }
    throw err;
  }
}

// TXT Parser
function parseTXT(filepath: string): ParseResult {
  const content = readFileSync(filepath, "utf-8");
  const lines = content.split("\n");

  // Try to detect title from first non-empty line
  const firstLine = lines.find((line) => line.trim().length > 0) || filename;
  const title = firstLine.length > 100 ? filename : firstLine.trim();

  return {
    title,
    content,
    metadata: {
      wordCount: content.split(/\s+/).length,
    },
    format: "txt",
  };
}

// RTF Parser (basic - strips RTF codes)
function parseRTF(filepath: string): ParseResult {
  const rtfContent = readFileSync(filepath, "utf-8");

  // Basic RTF stripping (removes RTF control codes)
  const content = rtfContent
    .replace(/\{\\[^{}]+\}/g, "") // Remove control groups
    .replace(/\\[a-z]+\d*\s?/gi, "") // Remove control words
    .replace(/[{}]/g, "") // Remove remaining braces
    .trim();

  return {
    title: filename,
    content,
    metadata: {
      wordCount: content.split(/\s+/).length,
    },
    format: "rtf",
  };
}

// Format output
function formatOutput(
  result: ParseResult | ParseError,
  format: string
): string {
  if ("error" in result) {
    if (format === "json") {
      return JSON.stringify(result, null, 2);
    }
    return `ERROR: ${result.error}\nFile: ${result.file}\n${result.details || ""}`;
  }

  switch (format) {
    case "json":
      return JSON.stringify(result, null, 2);

    case "text":
      return result.content;

    case "markdown":
    default:
      return `# ${result.title}

## Metadata

| Field | Value |
|-------|-------|
| Format | ${result.format.toUpperCase()} |
| Word Count | ${result.metadata.wordCount} |
${result.metadata.author ? `| Author | ${result.metadata.author} |` : ""}
${result.metadata.pageCount ? `| Pages | ${result.metadata.pageCount} |` : ""}
${result.metadata.createdDate ? `| Created | ${result.metadata.createdDate} |` : ""}

---

## Content

${result.content}
`;
  }
}

// Main execution
async function main() {
  const result = await parseDocument(values.input!);
  const output = formatOutput(result, values.format || "markdown");

  if (values.output) {
    writeFileSync(values.output, output);
    console.log(`Output written to: ${values.output}`);
  } else {
    console.log(output);
  }

  // Exit with error code if parsing failed
  if ("error" in result) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
