#!/usr/bin/env bun
/**
 * sync_tasks.ts - Bidirectional task synchronization tool
 *
 * Syncs tasks between project files in domains and the master task list.
 * Supports pull (aggregate tasks) and push (update projects) operations.
 *
 * Usage:
 *   bun .claude/skills/project-management/tools/sync_tasks.ts pull
 *   bun .claude/skills/project-management/tools/sync_tasks.ts push [--force]
 *   bun .claude/skills/project-management/tools/sync_tasks.ts status
 */

import { parseArgs } from "util";
import * as fs from "fs";
import * as path from "path";

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

// Configuration
const PROJECT_ROOT = process.cwd();
const DOMAINS_DIR = path.join(PROJECT_ROOT, "domains");
const TASKS_DIR = path.join(PROJECT_ROOT, "tasks");
const MASTER_FILE = path.join(TASKS_DIR, "MASTER.md");

// Types
interface Task {
  text: string;
  status: "todo" | "in-progress" | "blocked" | "paused" | "backlog" | "not-doing" | "done";
  checked: boolean;
}

interface Project {
  name: string;
  domain: string;
  path: string;
  status: string;
  priority: string;
  tasks: {
    active: Task[];      // todo + in-progress
    inactive: Task[];    // blocked + paused + backlog + not-doing
    done: Task[];
  };
  lastModified: string;
}

interface MasterData {
  lastPulled: string;
  domainsScanned: string[];
  projects: Project[];
}

// Parse command line arguments
const { values, positionals } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    help: { type: "boolean", short: "h" },
    force: { type: "boolean", short: "f" },
    quiet: { type: "boolean", short: "q" },
    output: { type: "string", short: "o" },
  },
  allowPositionals: true,
});

// Help text
function showHelp(): void {
  console.log(`
${colors.bold}sync_tasks${colors.reset} - Bidirectional task synchronization

${colors.bold}USAGE:${colors.reset}
  bun sync_tasks.ts <command> [options]

${colors.bold}COMMANDS:${colors.reset}
  pull      Aggregate tasks from all projects into MASTER.md
  push      Push task changes from MASTER.md back to projects
  status    Show sync status without making changes

${colors.bold}OPTIONS:${colors.reset}
  -h, --help     Show this help message
  -f, --force    Force push without conflict checking
  -q, --quiet    Minimal output
  -o, --output   Output file path (default: tasks/MASTER.md)

${colors.bold}EXAMPLES:${colors.reset}
  # Pull all tasks into master list
  bun sync_tasks.ts pull

  # Push changes back to projects
  bun sync_tasks.ts push

  # Force push (overwrites conflicts)
  bun sync_tasks.ts push --force

  # Check sync status
  bun sync_tasks.ts status
`);
}

// Parse YAML frontmatter from markdown
function parseFrontmatter(content: string): Record<string, any> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const yaml = match[1];
  const result: Record<string, any> = {};

  yaml.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Handle arrays
      if (value.startsWith("[") && value.endsWith("]")) {
        value = value.slice(1, -1).split(",").map((s) => s.trim());
      }
      // Handle null
      else if (value === "null") {
        value = null;
      }

      result[key] = value;
    }
  });

  return result;
}

// Parse tasks from project file content
function parseTasks(content: string): Project["tasks"] {
  const tasks: Project["tasks"] = { active: [], inactive: [], done: [] };

  // Find task sections
  const activeMatch = content.match(/### Active\n([\s\S]*?)(?=###|## |$)/);
  const inactiveMatch = content.match(/### Inactive\n([\s\S]*?)(?=###|## |$)/);
  const doneMatch = content.match(/### Done\n([\s\S]*?)(?=###|## |$)/);

  const parseTaskSection = (section: string | undefined): Task[] => {
    if (!section) return [];
    const taskLines = section.match(/- \[[ x\/!?I\-]\] .+/g) || [];
    return taskLines.map((line) => {
      // Parse checkbox symbol
      const checkboxMatch = line.match(/- \[(.)\]/);
      const symbol = checkboxMatch?.[1] || ' ';

      // Parse hashtag (if present)
      const hashtagMatch = line.match(/#(open|in-progress|blocked|paused|backlog|not-doing|done)/);
      const hashtag = hashtagMatch?.[1];

      let status: Task["status"];
      let checked = false;

      // Checkbox symbols take precedence over hashtags
      if (symbol !== ' ' && symbol !== 'x') {
        // Custom checkbox symbol - use it
        switch (symbol) {
          case '/': status = 'in-progress'; break;
          case '!': status = 'blocked'; break;
          case '?': status = 'paused'; break;
          case 'I': status = 'backlog'; break;
          case '-': status = 'not-doing'; break;
          default: status = 'todo'; break;
        }
      } else if (hashtag) {
        // No custom symbol, use hashtag
        status = hashtag === 'open' ? 'todo' : hashtag as Task["status"];
      } else {
        // Default based on checkbox
        status = symbol === 'x' ? 'done' : 'todo';
      }

      checked = (symbol === 'x' || status === 'done');
      const text = line.replace(/- \[.\] /, '').replace(/`#[a-z-]+`/, '').trim();
      return { text, status, checked };
    });
  };

  // Parse all sections
  const activeTasks = parseTaskSection(activeMatch?.[1]);
  const inactiveTasks = parseTaskSection(inactiveMatch?.[1]);
  const doneTasks = parseTaskSection(doneMatch?.[1]);

  // Group tasks by status (for backward compatibility and validation)
  tasks.active = activeTasks.filter(t => t.status === 'todo' || t.status === 'in-progress');
  tasks.inactive = inactiveTasks.filter(t => ['blocked', 'paused', 'backlog', 'not-doing'].includes(t.status));
  tasks.done = doneTasks.filter(t => t.status === 'done');

  return tasks;
}

// Scan all domains for projects
function scanProjects(): Project[] {
  const projects: Project[] = [];

  if (!fs.existsSync(DOMAINS_DIR)) {
    console.log(`${colors.yellow}Warning: domains/ directory not found${colors.reset}`);
    return projects;
  }

  const domains = fs.readdirSync(DOMAINS_DIR).filter((d) => {
    const stat = fs.statSync(path.join(DOMAINS_DIR, d));
    return stat.isDirectory() && !d.startsWith(".");
  });

  for (const domain of domains) {
    const projectsDir = path.join(DOMAINS_DIR, domain, "01_PROJECTS");

    if (!fs.existsSync(projectsDir)) continue;

    const projectFiles = fs.readdirSync(projectsDir).filter((f) =>
      f.startsWith("PROJECT_") && f.endsWith(".md")
    );

    for (const file of projectFiles) {
      const filePath = path.join(projectsDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const frontmatter = parseFrontmatter(content);
      const tasks = parseTasks(content);
      const stat = fs.statSync(filePath);

      projects.push({
        name: frontmatter.name || file.replace(".md", ""),
        domain,
        path: filePath,
        status: frontmatter.status || "planning",
        priority: frontmatter.priority || "medium",
        tasks,
        lastModified: stat.mtime.toISOString(),
      });
    }
  }

  return projects;
}

// Map status to checkbox symbol
function getCheckboxSymbol(status: Task["status"]): string {
  switch (status) {
    case 'done': return 'x';
    case 'in-progress': return '/';
    case 'blocked': return '!';
    case 'paused': return '?';
    case 'backlog': return 'I';
    case 'not-doing': return '-';
    default: return ' '; // todo
  }
}

// Map status to hashtag
function getHashtag(status: Task["status"]): string {
  const hashtagMap: Record<Task["status"], string> = {
    'todo': 'open',
    'in-progress': 'in-progress',
    'blocked': 'blocked',
    'paused': 'paused',
    'backlog': 'backlog',
    'not-doing': 'not-doing',
    'done': 'done',
  };
  return hashtagMap[status];
}

// Generate MASTER.md content
function generateMasterContent(projects: Project[]): string {
  const now = new Date().toISOString().slice(0, 16).replace("T", " ");
  const domains = [...new Set(projects.map((p) => p.domain))];

  let totalTasks = 0;
  let activeTasks = 0;
  let inactiveTasks = 0;

  projects.forEach((p) => {
    activeTasks += p.tasks.active.length;
    inactiveTasks += p.tasks.inactive.length;
    totalTasks += p.tasks.active.length + p.tasks.inactive.length;
  });

  let content = `---
last_pulled: ${now}
domains_scanned:
${domains.map((d) => `  - ${d}`).join("\n")}
total_projects: ${projects.length}
total_tasks: ${totalTasks}
active_tasks: ${activeTasks}
inactive_tasks: ${inactiveTasks}
---

# Task Master List

> Last synchronized: ${now}
> Run \`update plan\` to push changes back to projects

**Checkbox Symbol Reference:**
- \`[ ]\` To Do  |  \`[/]\` In Progress  |  \`[!]\` Blocked  |  \`[?]\` Paused  |  \`[I]\` Backlog  |  \`[-]\` Not Doing  |  \`[x]\` Done

`;

  // Group by domain
  const projectsByDomain = new Map<string, Project[]>();
  for (const project of projects) {
    const domainProjects = projectsByDomain.get(project.domain) || [];
    domainProjects.push(project);
    projectsByDomain.set(project.domain, domainProjects);
  }

  for (const [domain, domainProjects] of projectsByDomain) {
    content += `---\n\n## ${domain}\n\n`;

    for (const project of domainProjects) {
      const hasActiveTasks = project.tasks.active.length > 0 || project.tasks.inactive.length > 0;

      if (!hasActiveTasks) continue;

      const relativePath = path.relative(PROJECT_ROOT, project.path);
      content += `### ${project.name}\n`;
      content += `> Source: ${relativePath}\n`;
      content += `> Priority: ${project.priority} | Status: ${project.status}\n\n`;

      if (project.tasks.active.length > 0) {
        content += `#### Active (${project.tasks.active.length} tasks)\n`;
        for (const task of project.tasks.active) {
          const symbol = getCheckboxSymbol(task.status);
          const hashtag = getHashtag(task.status);
          content += `- [${symbol}] ${task.text} \`#${hashtag}\`\n`;
        }
        content += `\n`;
      }

      if (project.tasks.inactive.length > 0) {
        content += `#### Inactive (${project.tasks.inactive.length} tasks)\n`;
        for (const task of project.tasks.inactive) {
          const symbol = getCheckboxSymbol(task.status);
          const hashtag = getHashtag(task.status);
          content += `- [${symbol}] ${task.text} \`#${hashtag}\`\n`;
        }
        content += `\n`;
      }
    }
  }

  return content;
}

// Pull command - aggregate tasks from projects
async function pullTasks(): Promise<void> {
  console.log(`${colors.cyan}Scanning projects...${colors.reset}`);

  const projects = scanProjects();

  if (projects.length === 0) {
    console.log(`${colors.yellow}No projects found in domains/${colors.reset}`);
    return;
  }

  // Ensure tasks directory exists
  if (!fs.existsSync(TASKS_DIR)) {
    fs.mkdirSync(TASKS_DIR, { recursive: true });
  }

  const content = generateMasterContent(projects);
  const outputPath = values.output || MASTER_FILE;

  fs.writeFileSync(outputPath, content);

  // Summary
  const domains = [...new Set(projects.map((p) => p.domain))];
  let activeCount = 0;
  let inactiveCount = 0;

  // Count by specific status
  let todoCount = 0;
  let inProgressCount = 0;
  let blockedCount = 0;
  let pausedCount = 0;
  let backlogCount = 0;
  let notDoingCount = 0;

  projects.forEach((p) => {
    activeCount += p.tasks.active.length;
    inactiveCount += p.tasks.inactive.length;

    p.tasks.active.forEach(t => {
      if (t.status === 'todo') todoCount++;
      if (t.status === 'in-progress') inProgressCount++;
    });

    p.tasks.inactive.forEach(t => {
      if (t.status === 'blocked') blockedCount++;
      if (t.status === 'paused') pausedCount++;
      if (t.status === 'backlog') backlogCount++;
      if (t.status === 'not-doing') notDoingCount++;
    });
  });

  console.log(`
${colors.green}${colors.bold}Tasks pulled successfully!${colors.reset}

${colors.bold}Scan Summary:${colors.reset}
  Domains scanned: ${domains.length}
  Projects found: ${projects.length}

${colors.bold}Task Breakdown:${colors.reset}
  Active tasks: ${activeCount}
    - [ ] To Do: ${todoCount}
    - [/] In Progress: ${inProgressCount}
  Inactive tasks: ${inactiveCount}
    - [!] Blocked: ${blockedCount}
    - [?] Paused: ${pausedCount}
    - [I] Backlog: ${backlogCount}
    - [-] Not Doing: ${notDoingCount}

${colors.bold}Output:${colors.reset} ${outputPath}

To push changes back to projects, run: ${colors.cyan}bun sync_tasks.ts push${colors.reset}
`);
}

// Push command - update projects from MASTER.md
async function pushTasks(): Promise<void> {
  if (!fs.existsSync(MASTER_FILE)) {
    console.log(`${colors.red}Error: MASTER.md not found. Run 'pull' first.${colors.reset}`);
    process.exit(1);
  }

  console.log(`${colors.cyan}Reading MASTER.md...${colors.reset}`);

  const masterContent = fs.readFileSync(MASTER_FILE, "utf-8");
  const masterFrontmatter = parseFrontmatter(masterContent);

  console.log(`${colors.gray}Last pulled: ${masterFrontmatter.last_pulled}${colors.reset}`);
  console.log(`${colors.yellow}Push functionality requires manual implementation of task comparison logic.${colors.reset}`);
  console.log(`${colors.gray}For now, use the update_plan workflow for guided task updates.${colors.reset}`);
}

// Status command - show sync status
async function showStatus(): Promise<void> {
  console.log(`${colors.cyan}Checking sync status...${colors.reset}\n`);

  const projects = scanProjects();
  const domains = [...new Set(projects.map((p) => p.domain))];

  let activeCount = 0;
  let inactiveCount = 0;
  let doneCount = 0;

  projects.forEach((p) => {
    activeCount += p.tasks.active.length;
    inactiveCount += p.tasks.inactive.length;
    doneCount += p.tasks.done.length;
  });

  console.log(`${colors.bold}Projects:${colors.reset} ${projects.length} across ${domains.length} domains`);
  console.log(`${colors.bold}Tasks:${colors.reset} ${activeCount} active, ${inactiveCount} inactive, ${doneCount} done`);

  if (fs.existsSync(MASTER_FILE)) {
    const stat = fs.statSync(MASTER_FILE);
    const frontmatter = parseFrontmatter(fs.readFileSync(MASTER_FILE, "utf-8"));
    console.log(`\n${colors.bold}MASTER.md:${colors.reset}`);
    console.log(`  Last pulled: ${frontmatter.last_pulled}`);
    console.log(`  File modified: ${stat.mtime.toISOString().slice(0, 16).replace("T", " ")}`);
  } else {
    console.log(`\n${colors.yellow}MASTER.md not found. Run 'pull' to create.${colors.reset}`);
  }
}

// Main
async function main(): Promise<void> {
  if (values.help || positionals.length === 0) {
    showHelp();
    process.exit(0);
  }

  const command = positionals[0];

  switch (command) {
    case "pull":
      await pullTasks();
      break;
    case "push":
      await pushTasks();
      break;
    case "status":
      await showStatus();
      break;
    default:
      console.log(`${colors.red}Unknown command: ${command}${colors.reset}`);
      showHelp();
      process.exit(1);
  }
}

main().catch((error) => {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
});
