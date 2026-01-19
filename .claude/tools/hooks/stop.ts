// ═══════════════════════════════════════════════════════════════════
// STOP HOOK
// Notifications and cleanup on session end
// Type: stop 
// ═══════════════════════════════════════════════════════════════════

import { $ } from "bun";

// ─────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────

const CONFIG = {
  notifications: {
    enabled: true,
    method: "osascript" as const, // macOS native notifications
  },
  summary: {
    enabled: true,
  },
};

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────

interface StopInput {
  session_id?: string;
  stop_hook_active?: boolean;
  transcript_path?: string;
}

// ─────────────────────────────────────────────────────────────────
// NOTIFICATION FUNCTION
// ─────────────────────────────────────────────────────────────────

async function sendNotification(title: string, message: string): Promise<void> {
  if (!CONFIG.notifications.enabled) return;

  try {
    // macOS native notification via osascript
    const script = `display notification "${message}" with title "${title}"`;
    await $`osascript -e ${script}`.quiet();
  } catch {
    // Notification failed silently - non-critical
  }
}

// ─────────────────────────────────────────────────────────────────
// SUMMARY FUNCTION
// ─────────────────────────────────────────────────────────────────

function printSummary(): void {
  if (!CONFIG.summary.enabled) return;

  const timestamp = new Date().toLocaleString();

  console.log("");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("PAL SESSION COMPLETE");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`Ended: ${timestamp}`);
  console.log("═══════════════════════════════════════════════════════════");
}

// ─────────────────────────────────────────────────────────────────
// MAIN EXECUTION
// ─────────────────────────────────────────────────────────────────

async function main() {
  // Read input from stdin (if provided)
  const chunks: Buffer[] = [];
  const timeout = setTimeout(() => {
    // If stdin takes too long, proceed without it
  }, 100);

  try {
    for await (const chunk of Bun.stdin.stream()) {
      chunks.push(chunk as Buffer);
    }
  } catch {
    // Stdin read failed, proceed anyway
  }
  clearTimeout(timeout);

  // Parse input if available
  let input: StopInput = {};
  const stdinData = Buffer.concat(chunks).toString("utf-8");
  if (stdinData.trim()) {
    try {
      input = JSON.parse(stdinData);
    } catch {
      // Invalid JSON, proceed with empty input
    }
  }

  // Print summary to terminal
  printSummary();

  // Send notification
  await sendNotification("PAL", "Session complete");
}

main().catch((error) => {
  console.error("Stop hook error:", error);
  process.exit(0); // Exit cleanly even on error
});
