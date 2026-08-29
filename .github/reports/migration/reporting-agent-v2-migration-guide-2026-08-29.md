---
file_type: "report"
title: "Reporting Agent v2 Migration Guide"
description: "How to migrate from Reporting Agent v1 to v2, covering multi-repo support, session caching, and pluggable storage."
category: "migration"
created_date: "2026-08-29"
last_updated: "2026-08-29"
author: "automation"
tags: ["reporting-agent", "v2", "migration", "multi-repo", "caching", "storage"]
---

# Reporting Agent v2 — Migration Guide

## Overview

Reporting Agent v2 (`scripts/agents/reporting.agent.js` v2.0.0) adds three major
capabilities on top of the original v1 API while preserving **full backwards
compatibility**:

| Feature | v1 | v2 |
|---------|----|----|
| Single-repo report generation | ✅ | ✅ |
| Multi-repo aggregate reports | ❌ | ✅ |
| Session cache | ❌ | ✅ |
| Pluggable storage backend | ❌ | ✅ |
| `AGENT_VERSION` export | ❌ | ✅ |

---

## Backwards Compatibility

All v1 exports continue to work without modification:

```js
import {
  runAgent,
  generateReport,
  generateSpecFile,
  generateFrontmatter,
  determineCategory,
  getReportPath,
  sanitiseFilename,
  saveReport,
  validateReport,
  archiveReport,
  CATEGORIES,
} from "./scripts/agents/reporting.agent.js";
```

The `runAgent` default action now returns a `version` field alongside the
existing `categories` and `message` fields. All existing `action` values
(`generate`, `spec`, `validate`, `archive`, `save`) behave identically.

---

## New v2 Exports

```js
import {
  // multi-repo
  generateMultiRepoReport,
  parseRepoRef,
  buildRepoCacheKey,
  // session cache
  cacheGet,
  cacheSet,
  cacheClear,
  cacheSize,
  // pluggable storage
  setStorage,
  resetStorage,
  createMemoryStorage,
  // version
  AGENT_VERSION,
} from "./scripts/agents/reporting.agent.js";
```

---

## Multi-Repository Reports

Generate a single Markdown report that aggregates data across multiple
repositories:

```js
import { generateMultiRepoReport } from "./scripts/agents/reporting.agent.js";

const report = generateMultiRepoReport({
  title: "Cross-Repo Coverage Summary",
  description: "Coverage across all LightSpeed repositories",
  category: "coverage",
  repos: [
    "lightspeedwp/.github",
    "lightspeedwp/lsx",
    { owner: "lightspeedwp", repo: "lsx-blocks" },
  ],
  metrics: [
    { metric: "Total tests", value: "1,240", status: "✅" },
    { metric: "Coverage", value: "87%", status: "✅" },
  ],
  summary: "All repositories are above the 80% coverage threshold.",
});
```

`repos` entries can be either `"owner/repo"` strings or
`{ owner, repo }` objects — both are normalised via `parseRepoRef()`.

Via `runAgent`:

```js
runAgent({
  action: "generate:multi-repo",
  options: {
    title: "Cross-Repo Summary",
    description: "...",
    category: "agents",
    repos: ["lightspeedwp/.github", "lightspeedwp/lsx"],
  },
});
```

---

## Session Cache

The session cache lives in memory for the lifetime of the current Node process.
It is useful for avoiding repeated computation within a single agent run.

```js
import { cacheSet, cacheGet, cacheClear, cacheSize } from "./scripts/agents/reporting.agent.js";

// Store a value (default TTL: 15 minutes)
cacheSet("coverage:lightspeedwp/.github", { pct: 87 });

// Retrieve it
const data = cacheGet("coverage:lightspeedwp/.github"); // { pct: 87 }

// Custom TTL (milliseconds)
cacheSet("short-lived", "value", 30_000); // 30 s

// Inspect size
console.log(cacheSize()); // 2

// Clear all
cacheClear();
```

`buildRepoCacheKey(parsed, category)` produces a standardised key:

```js
buildRepoCacheKey({ owner: "lightspeedwp", repo: ".github" }, "coverage");
// → "repo:lightspeedwp/.github:coverage"
```

Via `runAgent`:

```js
runAgent({ action: "cache:set", options: { key: "k", value: 42 } });
runAgent({ action: "cache:get", options: { key: "k" } });
// → { ok: true, value: 42, hit: true }
runAgent({ action: "cache:size", options: {} });
runAgent({ action: "cache:clear", options: {} });
```

---

## Pluggable Storage Backend

Replace the default filesystem backend with an in-memory backend (e.g. for
testing) or any custom implementation:

```js
import {
  createMemoryStorage,
  setStorage,
  resetStorage,
  saveReport,
} from "./scripts/agents/reporting.agent.js";

// Swap in memory storage
const mem = createMemoryStorage();
setStorage(mem);

saveReport(reportContent, "my-report.md", "agents");

// Inspect stored files
console.log([...mem.store.keys()]);

// Restore filesystem backend
resetStorage();
```

A custom storage backend must implement:

```ts
interface StorageBackend {
  write(filePath: string, content: string): void;
  exists(filePath: string): boolean;
  mkdirp(dir: string): void;
}
```

---

## Checklist for Consumers

- [x] No changes needed for existing v1 callers.
- [x] Adopt `generateMultiRepoReport` for cross-repo aggregation.
- [x] Use `cacheSet` / `cacheGet` to memoize expensive computations within a run.
- [x] Inject `createMemoryStorage()` in unit tests to avoid touching the filesystem.
- [x] Use `AGENT_VERSION` for audit logs and report frontmatter.

---

## Related

- `agents/reporting.agent.md` — Agent specification
- `.github/projects/active/reporting-agent-v2-multirepository-2026-08-12/PLANNING.md` — Phase 2 plan
- `scripts/agents/__tests__/reporting.agent.test.js` — Regression test suite (49 tests)
