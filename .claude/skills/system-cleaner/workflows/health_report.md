# health_report Workflow

Meta workflow that runs all four system-cleaner audits and produces a single consolidated health dashboard.

## Step 1: Announce Audit Start

```
Starting PAL System Health Report...
Running 4 audits: References, Domains, Naming, Orphans.
```

## Step 2: Run audit_references

Execute all steps from `workflows/audit_references.md`.

Collect results:

- `ref_unregistered[]` — items on disk but not in references
- `ref_dead[]` — entries in references but not on disk
- `ref_mismatches[]` — Section 5 ↔ SYSTEM_INDEX mismatches
- `ref_status` — ALL CLEAR | ISSUES FOUND
- `ref_issue_count` — total number of issues

## Step 3: Run audit_domains

Execute all steps from `workflows/audit_domains.md`.

Collect results:

- `dom_structure_issues[]` — missing folders/files
- `dom_index_issues[]` — INDEX.md problems
- `dom_sync_issues[]` — Active Work ↔ 01_PROJECTS/ mismatches
- `dom_binding_issues[]` — agent ↔ domain binding problems
- `dom_status` — ALL CLEAR | ISSUES FOUND
- `dom_issue_count` — total number of issues

## Step 4: Run audit_naming

Execute all steps from `workflows/audit_naming.md`.

Collect results:

- `name_violations[]` — naming convention violations
- `name_frontmatter[]` — YAML frontmatter issues
- `name_status` — ALL CLEAR | ISSUES FOUND
- `name_issue_count` — total number of issues

## Step 5: Run audit_orphans

Execute all steps from `workflows/audit_orphans.md`.

Collect results:

- `orphan_skills[]` — unclaimed skills
- `orphan_files[]` — unreferenced domain files
- `orphan_stale[]` — stale session logs
- `orphan_empty[]` — empty folders
- `orphan_status` — ALL CLEAR | ISSUES FOUND
- `orphan_issue_count` — total number of issues

## Step 6: Calculate Overall Health

```
total_issues = ref_issue_count + dom_issue_count + name_issue_count + orphan_issue_count

if total_issues == 0:
    overall = "✅ HEALTHY"
elif total_issues <= 5:
    overall = "⚠️ MINOR ISSUES"
else:
    overall = "❌ NEEDS ATTENTION"
```

## Step 7: Generate Consolidated Dashboard

```markdown
## 🏥 PAL System Health Report — [DATE]

### Dashboard

| Category            | Status   | Issues | Details |
| ------------------- | -------- | ------ | ------- |
| Reference Integrity | ✅/⚠️/❌ | [N]    | [brief] |
| Domain Consistency  | ✅/⚠️/❌ | [N]    | [brief] |
| Naming Conventions  | ✅/⚠️/❌ | [N]    | [brief] |
| Orphans & Hygiene   | ✅/⚠️/❌ | [N]    | [brief] |

**Overall: [HEALTHY / MINOR ISSUES / NEEDS ATTENTION] — [N] total issues**

---

### System Stats

| Metric                    | Count |
| ------------------------- | ----- |
| Agents on disk            | [N]   |
| Agents registered         | [N]   |
| Skills on disk            | [N]   |
| Skills claimed by agents  | [N]   |
| Workflows on disk         | [N]   |
| Domains                   | [N]   |
| Domains with bound agents | [N]   |

---

### 🔗 Reference Integrity

[If ALL CLEAR: "✅ All agents, skills, and workflows are properly registered."]

[If ISSUES: summary table from audit_references report]

---

### 📁 Domain Consistency

[If ALL CLEAR: "✅ All domains have valid structure and consistent INDEX files."]

[If ISSUES: summary table from audit_domains report]

---

### 📛 Naming Conventions

[If ALL CLEAR: "✅ All files and folders follow PAL naming conventions."]

[If ISSUES: summary table from audit_naming report]

---

### 🧹 Orphans & Hygiene

[If ALL CLEAR: "✅ No orphaned files, stale sessions, or empty folders found."]

[If ISSUES: summary table from audit_orphans report]

---

### Recommended Actions

[Prioritized list of suggested fixes, most impactful first]

1. [High priority fix]
2. [Medium priority fix]
3. [Low priority fix]

---

**Generated:** [TIMESTAMP]
**Audits run:** 4 (references, domains, naming, orphans)
**Next recommended run:** [suggest weekly or after major changes]
```

## Step 8: Offer Batched Fixes

After presenting the dashboard, offer:

1. **Fix all** → Attempt to resolve all issues (with confirmations for destructive actions)
2. **Fix by category** → Let user pick which category to fix
3. **Fix nothing** → Just report, user will handle manually
4. **Run individual audit** → Re-run a specific audit with fixes

## Done

System health report complete. Dashboard generated with all findings and prioritized fix suggestions.
