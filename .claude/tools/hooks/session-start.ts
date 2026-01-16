// ═══════════════════════════════════════════════════════════════════
// SESSION START HOOK
// Loads PAL Base context at session initialization
// ═══════════════════════════════════════════════════════════════════

const BASE_PATH = ".claude/base";

// Files to load, in priority order
// Lower number = loaded first = higher priority
const BASE_FILES = [
  // USER Layer (Priority 1-9)
  { path: "user/ABOUTME.md", priority: 1, layer: "USER" },
  { path: "user/DIRECTIVES.md", priority: 2, layer: "USER" },
  { path: "user/TERMINOLOGY.md", priority: 4, layer: "USER" },

  // SYSTEM Layer (Priority 11-15)
  { path: "system/ARCHITECTURE.md", priority: 11, layer: "SYSTEM" },
  { path: "system/ORCHESTRATION.md", priority: 12, layer: "SYSTEM" },

  // SECURITY Layer (Priority 21-22)
  { path: "security/GUARDRAILS.md", priority: 21, layer: "SECURITY" },
];

// ─────────────────────────────────────────────────────────────────
// MAIN EXECUTION
// ─────────────────────────────────────────────────────────────────

async function main() {
  // Sort files by priority
  const sortedFiles = BASE_FILES.sort((a, b) => a.priority - b.priority);

  // Track loaded files for summary
  const loaded: string[] = [];
  const failed: string[] = [];

  // Output header
  console.log("═══════════════════════════════════════════════════════════");
  console.log("PAL BASE CONTEXT LOADING");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("");

  // Load each file
  for (const file of sortedFiles) {
    const fullPath = `${BASE_PATH}/${file.path}`;

    try {
      const bunFile = Bun.file(fullPath);
      const exists = await bunFile.exists();

      if (exists) {
        const content = await bunFile.text();

        // Output to AI context
        console.log(`─────────────────────────────────────────────────────────`);
        console.log(`[${file.layer}] ${file.path} (Priority: ${file.priority})`);
        console.log(`─────────────────────────────────────────────────────────`);
        console.log(content);
        console.log("");

        loaded.push(file.path);
      } else {
        console.log(`  MISSING: ${fullPath}`);
        failed.push(file.path);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`  ERROR loading ${fullPath}: ${errorMessage}`);
      failed.push(file.path);
    }
  }

  // Output summary
  console.log("═══════════════════════════════════════════════════════════");
  console.log("CONTEXT LOADING COMPLETE");
  console.log(`Loaded: ${loaded.length} files`);
  if (failed.length > 0) {
    console.log(`Failed: ${failed.length} files`);
  }
  console.log("═══════════════════════════════════════════════════════════");
}

main().catch(console.error);
