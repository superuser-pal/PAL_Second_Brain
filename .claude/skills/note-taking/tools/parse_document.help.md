# parse_document Tool

Convert documents (PDF, DOCX, TXT) to markdown format.

## Usage

```bash
bun .claude/skills/note-taking/tools/parse_document.ts [options]
```

## Options

| Option | Short | Description | Required |
|--------|-------|-------------|----------|
| `--input` | `-i` | Input file path | Yes |
| `--output` | `-o` | Output file path (default: stdout) | No |
| `--format` | `-f` | Output format: markdown, json, text | No |
| `--help` | `-h` | Show help message | No |

## Supported Formats

| Extension | Library | Notes |
|-----------|---------|-------|
| `.pdf` | pdf-parse | Extracts text, preserves structure |
| `.docx` | mammoth | Converts to clean markdown |
| `.doc` | mammoth | Legacy Word format |
| `.txt` | Native | Direct read |
| `.rtf` | Native | Basic RTF stripping |

## Examples

**Parse PDF to stdout:**
```bash
bun parse_document.ts --input document.pdf
```

**Parse DOCX to file:**
```bash
bun parse_document.ts --input notes.docx --output notes.md
```

**Get JSON metadata:**
```bash
bun parse_document.ts --input report.pdf --format json
```

## Output Formats

**markdown (default):**
- Title heading
- Metadata table
- Full content

**json:**
- Structured object with title, content, metadata

**text:**
- Raw extracted text only

## Dependencies

Requires these packages in `.claude/package.json`:
- `pdf-parse` - For PDF parsing
- `mammoth` - For DOCX conversion

Install with:
```bash
cd .claude && bun add pdf-parse mammoth
```

## Error Handling

- Returns exit code 1 on failure
- Provides helpful error messages for missing dependencies
- Skips unsupported file formats with warning
