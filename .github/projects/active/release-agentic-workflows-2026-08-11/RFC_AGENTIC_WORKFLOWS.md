---
file_type: rfc
title: "RFC: GitHub Agentic Workflows for Release Agent"
description: "Request for Comments on augmenting release automation with agentic orchestration"
status: draft
version: "1.0"
date: "2026-08-11"
author: "Ash Shaw"
---

# RFC: GitHub Agentic Workflows for Release Agent

**Status:** OPEN FOR COMMENT (Aug 11-18, 2026)  
**Decision Deadline:** 2026-08-18 (before Phase 5A implementation starts Aug 19)  
**Proposed Implementation:** Aug 19-30, 2026 (Phase 5A)

---

## Problem Statement

**Current State (Phase 4):**

- Release automation works well (shell scripts, deterministic, tested)
- But user experience is technical (CLI flags, git commands)
- No intelligent guidance ("are you sure about this version bump?")
- Error messages are generic ("exit code 1")

**GitHub Agentic Workflows (June 2026):**

- Enables LLM-driven orchestration of GitHub operations
- Can provide intelligent suggestions, error messages, reasoning
- Security-first architecture (integrity filters, safe outputs, threat detection)
- Natural language interface (great UX)

**Opportunity:**
Augment Phase 4 shell scripts with agentic orchestration to improve UX while maintaining safety and determinism. This is **augmentation, not replacement**—shell scripts stay as fallback.

---

## Proposed Solution

### Architecture: AUGMENT (wrap, don't replace)

```
User runs: gh agentic release --scope=patch

Agentic layer (Markdown workflow) does:
├─ Parse input
├─ Pre-flight checks
├─ Invoke AI reasoning ("Is this release safe?")
├─ Call shell scripts (Phase 4, deterministic)
├─ Apply approval gates (scope-based)
└─ Report outcome

Shell scripts (Phase 4, unchanged):
├─ trigger-telemetry.cjs (authorization)
├─ release.agent.js (version + changelog)
├─ create-main-release-pr.cjs (PRs)
└─ [continue to work as-is, always available]
```

**Why augment, not replace?**

| Approach | Pros | Cons | Risk |
|----------|------|------|------|
| **Replace** | Cleaner, unified | Lose fallback, lose Phase 4 | 🔴 HIGH |
| **AUGMENT** | ✅ Keep fallback | More integration points | 🟡 MEDIUM |
| **Parallel** | Learn by doing | Duplicated effort | 🟢 LOW |

**Recommendation: AUGMENT** → Fast, safe, leverages Phase 4

---

## Design Decisions (Open for feedback)

### 1️⃣ Scope: Patch / Minor / Major Support?

**Proposal:** Support FULL scope (patch + minor + major) with tiered approval gates

**Rationale:**

- ✅ Phase 4 already supports all scopes
- ✅ Tiered gates scale approval to risk level
- ✅ Aligns with semantic versioning philosophy

**Tiered Approval Gates:**

```
PATCH (safest)         MINOR (moderate)       MAJOR (highest)
├─ Auto-approve        ├─ Human review        ├─ 2+ approvals
├─ Agentic score ≥80%  ├─ Agentic score ≥80% ├─ Agentic score ≥80%
└─ changelog valid     ├─ 1+ merges to dev    ├─ Breaking changes doc
                       └─ changelog valid     ├─ 3+ days on develop
                                             └─ changelog valid
```

**Question for feedback:** Should major releases require explicit human confirmation before agentic creates PR? (e.g., "I approve major vX.Y.Z release")

### 2️⃣ Repo Scope: Control Plane Only, or Multi-repo?

**Proposal:** Phase 5A targets control plane (`.github`) only

**Rationale:**

- ✅ Control plane releases are interactive (humans trigger)
- ✅ Portable agents (Phase 5) handle multi-repo
- ✅ Keep agentic focused on one use case
- ✅ Simpler MVP scope

**Future:** Phase 5B could extend agentic to plugins/themes with portable agents

**Question for feedback:** Should we plan Phase 5B multi-repo now, or wait to see how Phase 5A works?

### 3️⃣ AI Engine: Single or Multi-engine?

**Proposal:** Multi-engine support (Copilot primary, Claude fallback)

**Rationale:**

- ✅ GitHub Copilot: native agentic support
- ✅ Claude Code: excellent reasoning, flexible
- ✅ Fallback: if Copilot API fails, try Claude
- ✅ Cost: ~$0.02 per release (negligible)

**Options:**

```yaml
--engine=copilot (default, native integration)
--engine=claude (explicit choice)
--engine=auto (try Copilot, fall back to Claude)
--engine=none (skip AI, use deterministic path only)
```

**Question for feedback:** Should agentic default to `--engine=copilot` or `--engine=auto`?

### 4️⃣ Safety Gates: How Many? How Strict?

**Proposal:** 7-layer validation (multiple gates, not just one)

```
Gate 1: Pre-flight (branch, state, files)
Gate 2: Agentic reasoning (AI confidence score)
Gate 3: Changelog validation (schema + entries)
Gate 4: Version validation (semver rules)
Gate 5: Authorization (maintainers team)
Gate 6: Approval gates (scope-based)
Gate 7: Integrity filter (GitHub's safe outputs)
```

**Rationale:**

- ✅ Defense in depth (fail at multiple points)
- ✅ Catches errors from different sources
- ✅ Safe even if agentic makes mistakes

**Question for feedback:** Is 7 gates too many (slow, annoying) or just right? Should we combine any?

### 5️⃣ Fallback Strategy: Always Available?

**Proposal:** Shell scripts always available as fallback

**How:**

```bash
# If agentic unavailable or fails:
npm run release -- --scope=patch --dry-run
# (Phase 4 shell script path, always works)
```

**Rationale:**

- ✅ Zero risk (agentic never blocks release)
- ✅ User can always complete release manually
- ✅ Agentic is helpful, not required

**Question for feedback:** Should we encourage fallback use, or discourage it? (vs. treating agentic as required path)

### 6️⃣ Dry-Run Mode: How Detailed?

**Proposal:** Dry-run generates detailed preview artifacts

```
--dry-run output:
├─ release-dry-run-plan.md (step-by-step)
├─ release-notes-preview.md (compiled notes)
├─ version-bump-preview.txt (old → new)
└─ changelog-rolled.md (how it would look)
```

**Rationale:**

- ✅ User sees exactly what will happen
- ✅ Can adjust before proceeding
- ✅ Builds confidence in agentic decisions

**Question for feedback:** Should dry-run also show which approval gates would pass/fail?

### 7️⃣ Logging & Audit Trail: How Much Transparency?

**Proposal:** Log agentic decisions (reasoning, gates, approvals); redact secrets

```
Logged:
✅ User, timestamp, scope
✅ Agentic score, reasoning summary (not full prompt)
✅ Gate results (all 7)
✅ Approvals (who, when)
✅ Mutations (commits, tags, releases)

Redacted:
❌ Full agentic prompts
❌ API keys, tokens
❌ User email or personal data
```

**Rationale:**

- ✅ Compliance/audit (log mutations)
- ✅ Troubleshooting (why did release fail?)
- ✅ Security (detect unauthorized attempts)
- ⚠️ Privacy (don't expose AI reasoning)

**Question for feedback:** Should logs be stored indefinitely, or rotated after N days?

---

## Trade-offs & Risks

### What Could Go Wrong?

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|-----------|
| AI hallucinates version number | 🔴 CRITICAL | 🟡 Med | Integrity filter + version validation gate |
| AI leaks secrets in logs | 🔴 CRITICAL | 🟢 Low | Redact all sensitive data |
| Agentic unavailable (API down) | 🟡 MAJOR | 🟡 Med | Fallback to shell scripts |
| Duplicate tag conflict | 🟡 MAJOR | 🟢 Low | Check tag exists before creation |
| User bypasses approval gate | 🟡 MAJOR | 🟢 Low | GitHub branch protection enforces gates |

### Mitigation Strategies

✅ **Multiple validation layers** (7 gates, not 1)  
✅ **LLM + deterministic checks** (AI + schema validation)  
✅ **Fallback always available** (shell scripts work standalone)  
✅ **Human-in-loop for risk** (MINOR/MAJOR require approval)  
✅ **Safe outputs guarantee** (GitHub integrity filter blocks unsafe output)  
✅ **Audit trail** (log all decisions for compliance)

---

## Timeline & Phases

### Phase 5A: Agentic Workflows MVP (Aug 12-30, 2026)

**Week 1 (Aug 12-16): Specification**

- [ ] Finalize RFC (this document)
- [ ] Write PHASE_5A_IMPLEMENTATION_PLAN.md
- [ ] Create GitHub issues (CHILD-050 onwards)
- [ ] Create `.github/agentic-workflows/release.md` skeleton

**Week 2 (Aug 19-23): Implementation**

- [ ] Build Markdown workflow (full)
- [ ] Integrate with Phase 4 shell scripts
- [ ] Implement all 7 safety gates
- [ ] Implement tiered approval flows

**Week 3 (Aug 26-30): Testing & Validation**

- [ ] Dry-run tests on develop
- [ ] Live test (patch release)
- [ ] Integration tests
- [ ] Security review
- [ ] Ready for Phase 6+

### Phase 5B: Enhancements (Sep 2026+)

- 🔜 Multi-repo support (plugins, themes)
- 🔜 GitHub Copilot chat integration ("@release-agent patch")
- 🔜 Auto-suggestions for changelog improvements
- 🔜 Metrics + analytics

---

## Questions for Community Feedback

Please comment on GitHub Discussions or in this RFC:

1. **Scope:** Full (patch+minor+major) OK, or start minimal (patch only)?
2. **Approval flow:** Is 2+ maintainers for major too strict, or just right?
3. **AI engine:** Default to Copilot, or auto-fallback?
4. **Safety gates:** 7 layers good, or combine some?
5. **Dry-run output:** Should it show gate results?
6. **Logging:** Indefinite retention, or rotate after 30 days?
7. **Timeline:** Can Phase 5A fit in Aug 19-30 window, or push to Sep?

---

## Related Documents

- [AGENTIC_WORKFLOW_SPEC.md](./AGENTIC_WORKFLOW_SPEC.md) — Design decisions (detailed)
- [PHASE_5A_IMPLEMENTATION_PLAN.md](./PHASE_5A_IMPLEMENTATION_PLAN.md) — Task breakdown (TBD)
- [Release Process Redesign (Phase 4)](../release-process-redesign-2026-08-05/) — Foundation

---

## Decision Template

**Decision:** [State the decision]  
**Rationale:** [Why this choice]  
**Trade-offs:** [What's lost]  
**Risk:** [What could go wrong]  
**Mitigation:** [How to prevent/recover]

---

## Sign-Off

This RFC is **OPEN FOR COMMENT** until **2026-08-18**.

**Approvals needed:**

- [ ] Ash Shaw (Project Owner)
- [ ] @team (Reviewers)

**Comments deadline:** 2026-08-18  
**Implementation start:** 2026-08-19

---

*RFC v1.0 — GitHub Agentic Workflows Release Agent*  
*Built by 🧱 LightSpeedWP with ☕, 🚀, and agentic workflows!*
