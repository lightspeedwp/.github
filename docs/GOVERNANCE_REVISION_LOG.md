---
file_type: documentation
title: Governance Revision Log
description: Lightweight change-tracking log for governance and process documentation updates.
version: '1.0'
last_updated: '2026-11-24'
owners:
  - LightSpeed Team
tags:
  - governance
  - revision-log
  - process
  - documentation
---

## 4 November 2026 — specification allocation lifecycle candidate

- Tracks [GIT-2676](https://linear.app/lightspeedwp/issue/GIT-2676) and
  [GitHub issue 3891](https://github.com/lightspeedwp/.github/issues/3891).
- The 28 October decision approves lifecycle direction and bootstrap dispositions only.
  Seven design choices were separately approved; exact implementation and execution remain gated.
- The candidate coordinates the closed version-1 ledger, shared offline CJS helper,
  auditor, generator, focused tests, trigger-only workflow additions and numbering amendments.
- Preserve 020 portable agents as pending, 021/022 as retired with separate histories,
  and 023/024 as materialised. No renumbering, placeholders, number reuse or automatic expiry.
- Missing ledgers retain strict contiguity; no baseline means snapshot consistency only.
  Provenance is traceability, not authenticated approval or a claim of passing checks.
- Generated local drafts do not update the ledger or become merge-valid automatically.
  The 020 PR's non-Markdown transition requires a separate approved scope exception.
- This entry does not record executed tests, workflow results, current-head approval,
  integration, publication, deployment or a merge decision.


---

*Maintained by the 🤖 LightSpeedWP Automation Team*

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
