---
title: Plugin Adoption Roadmap
description: Phased rollout strategy for AI code assistant plugins across the LightSpeedWP team
created: 2026-07-26
updated: 2026-07-26
type: guide
---

# Plugin Adoption Roadmap

A three-phase rollout plan for adopting AI-powered development tools across LightSpeedWP, with timelines, success criteria, and support infrastructure.

---

## Timeline Overview

Phased adoption of Claude Code and GitHub Copilot across three tiers of team members, rolling out from August 2026 through October 2026.

```
August 2026:   Tier 1 (2–3 core maintainers)
September 2026: Tier 2 (4–5 all contributors)
October 2026+: Tier 3 (8–9 WordPress project teams)
```

---

## Tier 1: Core Maintainers & Lead Contributors

### Timeline: August 2026

**Duration:** Full month (Aug 1–Aug 31)

### Team Members

- Ash Shaw (Project Lead)
- 1–2 additional core maintainers
- **Total: 2–3 people**

### Plugins to Install

**Mandatory:**

- ✅ Claude Code (Anthropic)
- ✅ GitHub Copilot (GitHub)

**Optional:**

- ⚠️ Copilot Chat (recommended)
- ⚠️ Codex (for evaluation)

### Setup Activities

| Week | Activity | Owner | Duration |
|------|----------|-------|----------|
| 1 | Install both plugins, verify auth | Core team | 1 hour |
| 1 | Read setup guides and review comparisons | Core team | 2 hours |
| 2 | Use in real work, document first impressions | Core team | Ongoing |
| 2–3 | Identify best use cases and workflows | Core team | 4 hours |
| 3 | Create team guidelines and best practices | Claude Code | 2 hours |
| 4 | Final evaluation and feedback collection | Core team | 1 hour |

**Total time commitment:** ~10 hours per person

### Success Criteria

✅ **Installation:** Both plugins working on 100% of core team machines (3/3)

✅ **Usage:** Minimum 10 hours of actual development time with both tools combined

✅ **Documentation:** Team guidelines document completed and reviewed

✅ **Proficiency:** Core team comfortable with both tools' main features

✅ **Feedback:** Initial feedback documented in GitHub issue

### Expected Outcomes

- Core team trained and comfortable with both tools
- Best practices documented for broader team
- Issues and limitations identified early
- Ready to roll out to Tier 2

### Support Plan

- **Help Channel:** GitHub issues with label `[plugin-help]`
- **Escalation:** Contact Ash Shaw
- **Resources:** Setup guides, comparison doc, troubleshooting guide
- **Grace Period:** Full month for questions and adjustments

---

## Tier 2: All Contributors

### Timeline: September 2026

**Duration:** Full month (Sep 1–Sep 30)

### Team Members

- All 4–5 active contributors
- 2–3 core maintainers (from Tier 1)
- **Total: 6–8 people**

### Plugins to Install

**Mandatory:**

- ✅ Claude Code (Anthropic)
- ✅ GitHub Copilot (GitHub)

**Recommended:**

- ⚠️ GitHub Copilot Chat (for complex requests)

**Optional:**

- ⚠️ Codex (power users only)
- ⚠️ Gemini (evaluation phase)

### Setup Activities

| Week | Activity | Owner | Duration |
|------|----------|-------|----------|
| 1 | Core team presents setup guides and best practices | Core team | 30 min |
| 1 | Contributors install plugins and verify setup | Contributors | 1 hour |
| 1 | Q&A session and troubleshooting | Core team | 1 hour |
| 2–3 | Contributors integrate into daily workflow | Contributors | Ongoing |
| 3 | Feedback collection and common issues logged | All | 1 hour |
| 4 | Final assessment and Phase 3 preparation | Core team | 1 hour |

**Total time commitment:** ~4–5 hours per person

### Success Criteria

✅ **Installation:** Both plugins working on 100% of contributor machines (5/5)

✅ **Adoption:** >80% of team actively using at least one tool within 2 weeks

✅ **Support:** <5 unresolved issues with `[plugin-help]` label at end of month

✅ **Feedback:** Positive feedback from >60% of team on usefulness

✅ **Proficiency:** Contributors able to use basic features independently

### Expected Outcomes

- Full contributor team equipped with modern development tools
- Common issues documented and resolved
- Team guidelines validated and refined
- Ready for Tier 3 rollout and WordPress project teams

### Support Plan

- **Help Channel:** GitHub issues with label `[plugin-help]`
- **Escalation:** Contact Ash Shaw
- **Resources:** Tier 1 documentation + new troubleshooting additions
- **Mentorship:** Core team available for pair programming
- **Grace Period:** 3 weeks for problems, 1 week for optimization

---

## Tier 3: WordPress Project Consumers

### Timeline: October 2026 onwards

**Duration:** Ongoing (Oct 1+)

### Team Members

- 8–9 WordPress project teams
- Development, design, and quality assurance members
- **Total: 20–30 people**

### Plugins Available

**Tier 1 Tools (Full Suite):**

- ✅ Claude Code (Anthropic)
- ✅ GitHub Copilot (GitHub)

**Emerging Tools (Optional Evaluation):**

- ⚠️ Codex (for power users)
- ⚠️ Gemini (evaluation)

**Legacy Tools (Sunset Timeline):**

- ⚠️ Other AI assistants (to be phased out by Q1 2027)

### Setup Activities

| Phase | Activity | Owner | Duration |
|-------|----------|-------|----------|
| Phase 3a | Optional training sessions for WordPress teams | Core team | 1 hour each |
| Phase 3b | Self-paced setup using documentation | Project teams | 2–3 hours |
| Phase 3c | Feedback and integration into project workflows | Project teams | Ongoing |
| Phase 3d | Vendor evaluation and contract negotiation | Ash Shaw | Ongoing |

**Total time commitment:** 2–3 hours per person (optional)

### Success Criteria

✅ **Availability:** Tools available to all WordPress project teams

✅ **Adoption:** >50% of project teams actively using at least one tool

✅ **Support:** Help channel actively monitored and issues resolved within 24 hours

✅ **Satisfaction:** Net satisfaction score >70% (from surveys)

✅ **ROI:** Documented productivity gains from teams using tools

### Expected Outcomes

- Org-wide plugin adoption infrastructure in place
- All developers equipped with modern AI tools
- Cost optimization through tiered access
- Foundation for future AI tool expansion

### Support Plan

- **Help Channel:** GitHub issues with label `[plugin-help]`
- **Escalation:** Contact Ash Shaw
- **Resources:** Full documentation library + video tutorials
- **Mentorship:** Optional pair programming with core team
- **Grace Period:** 4 weeks for each project team

---

## Grace Period & Support Infrastructure

### Grace Period Timeline

**Duration:** 3 weeks from plugin release in each tier

During grace period:

- ✅ No penalties for not using the tools
- ✅ Extensive support available
- ✅ Training sessions offered
- ✅ Issues resolved quickly
- ✅ Tool configuration can be adjusted

**After grace period:**

- Optional integration encouraged (not required)
- Standard support available
- Community-driven learning

### Support Channels

**Primary:** GitHub Issues

- Label: `[plugin-help]`
- Response time: <24 hours
- Escalation: @ashleyshaw

**Secondary:** Direct Messages

- Owner: Ash Shaw (<ashley@lightspeedwp.agency>)
- Use for: Urgent blockers only
- Response time: <4 hours

**Tertiary:** Documentation

- Setup guides: `/docs/plugin-setup-*.md`
- Troubleshooting: `/docs/vscode-plugin-troubleshooting.md`
- FAQ: This document + GitHub wiki

### Support Resources

- ✅ [Plugin Setup Guides](./plugin-setup-claude-code.md)
- ✅ [Plugin Comparison](./plugin-comparison.md)
- ✅ [Testing Guide](./plugin-testing.md)
- ✅ [Troubleshooting Guide](./vscode-plugin-troubleshooting.md)
- ✅ GitHub wiki with FAQs
- ✅ Video tutorials (coming Sep 2026)

---

## Success Metrics

### Tier 1: Core Maintainers

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Installation Success** | 100% (3/3) | Plugin installed and authenticated |
| **Usage Hours** | 10+ hours/person | Tracked through extension telemetry |
| **Code Generated** | 50+ completions | From Copilot stats |
| **Team Cohesion** | 100% agreement on best practices | Survey after Week 3 |
| **Documentation Quality** | Guidelines document completed | Peer review approval |

### Tier 2: All Contributors

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Installation Success** | 100% (5/5) | Plugin installed and authenticated |
| **Adoption Rate** | >80% within 2 weeks | Users with >5 completions |
| **Issue Resolution** | <5 open issues | GitHub [plugin-help] count |
| **Team Satisfaction** | >60% positive | Anonymous survey |
| **Productivity Gains** | 15% average | Time tracking before/after |

### Tier 3: WordPress Project Teams

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Availability** | 100% of teams can access | Documented in README |
| **Adoption Rate** | >50% of teams | GitHub issue usage |
| **Support Response** | <24 hours | Issue resolution time |
| **Team Satisfaction** | >70% | Quarterly surveys |
| **Vendor Performance** | Meeting SLAs | Uptime and feature tracking |

---

## Contingency Plans

### If Adoption Lags Behind Target

**Problem:** Adoption rate <80% at end of Tier 2

**Response:**

1. **Root cause analysis:** Survey team on barriers
2. **Adjust approach:** Modify tools, training, or expectations
3. **Extend grace period:** Add 2 weeks of additional support
4. **Pivot if needed:** Recommend alternative tool combinations
5. **Document lessons:** Record for future rollouts

### If Critical Issues Emerge

**Problem:** Plugin causes blocking issues (crashes, data loss, etc.)

**Response:**

1. **Immediate:** File urgent issue with vendor
2. **Workaround:** Provide temporary fix or alternative workflow
3. **Communication:** Notify affected teams within 1 hour
4. **Mitigation:** Disable plugin if necessary to unblock work
5. **Recovery:** Re-enable only after vendor resolves issue
6. **Compensation:** Extend grace period or defer adoption

### If Vendor Changes Pricing

**Problem:** Vendor increases price significantly (>30%)

**Response:**

1. **Evaluate alternatives:** Compare with Codex, Gemini, etc.
2. **Negotiate:** Contact vendor for enterprise discounts
3. **Cost-benefit analysis:** Assess ROI vs. new pricing
4. **Team feedback:** Survey on alternatives
5. **Decision:** Keep, switch, or hybrid approach
6. **Communicate:** Notify team 30 days in advance of any changes

### If Vendor Sunset a Tool

**Problem:** Vendor discontinues Claude Code or Copilot

**Response:**

1. **Immediately switch:** Move to alternative (Codex, Gemini, etc.)
2. **Export data:** Save agents, settings, custom configuration
3. **Retrain:** Offer training on new tool
4. **Support:** Extended help period for transition
5. **Cost:** Absorb additional costs if necessary
6. **Vendor: Hold contract renegotiation clause**

---

## Team Feedback & Iteration

### Feedback Collection

**Tier 1 (Aug):** Post-phase survey

- What worked well?
- What didn't work?
- Recommendations for Tier 2?

**Tier 2 (Sep):** Mid-phase check-in

- Early adopters: How's it going?
- Laggards: What barriers exist?
- Adjustment opportunities

**Tier 2 (Sep):** Post-phase survey

- Overall satisfaction
- Best use cases identified
- Recommended changes for Tier 3

**Tier 3 (Oct+):** Quarterly surveys

- Ongoing satisfaction
- Productivity impact
- Feature requests
- Cost-benefit analysis

### Iteration Points

- **Week 2 of each tier:** Adjust training approach if needed
- **End of each tier:** Update documentation based on feedback
- **Q4 2026:** Comprehensive vendor evaluation
- **Q1 2027:** Contract negotiation and tool selection

---

## Timeline Summary

| Date | Phase | Activity | Success Criteria |
|------|-------|----------|------------------|
| **Aug 1** | Tier 1 begins | Core team installs both plugins | 3/3 installations |
| **Aug 15** | Tier 1 mid-point | Team using both tools actively | 10+ hours per person |
| **Aug 29** | Tier 1 complete | Feedback collected, guidelines finalized | >80% satisfaction |
| **Sep 1** | Tier 2 begins | Contributors install and train | 5/5 installations |
| **Sep 15** | Tier 2 mid-point | Broader team using actively | >80% adoption rate |
| **Sep 29** | Tier 2 complete | All issues resolved, team confident | >60% satisfaction |
| **Oct 1** | Tier 3 begins | WordPress teams enable access | 100% availability |
| **Oct 31** | Tier 3 stabilize | Project teams integrated | >50% adoption |
| **Nov 30** | Q4 Assessment | Vendor evaluation, contract negotiation | ROI measured |
| **Dec 31** | Year 1 Complete | Full team adoption, sustained | Recurring costs approved |

---

## FAQ

### Q: What if I can't install a plugin?

**A:** Contact your VS Code administrator or IT team. Most organizations allow VS Code extensions. If blocked, reach out to Ash Shaw for exception approval.

### Q: Do I have to use both Claude Code and Copilot?

**A:** No. Start with whichever tool interests you. We recommend both for maximum productivity, but one tool is fine.

### Q: Can I opt out of this rollout?

**A:** Yes. These are optional tools. You can skip Tier adoption, but we encourage trying them—they save time and frustration.

### Q: What about privacy and security?

**A:** Both tools respect your privacy. Code is sent for suggestions but not stored. Never send code with secrets. See privacy docs in setup guides.

### Q: Will these tools be available forever?

**A:** We'll evaluate tools quarterly. If a vendor changes (pricing, discontinuation), we'll switch to alternatives. You'll have notice for major changes.

### Q: Who do I contact for help?

**A:** Open a GitHub issue with label `[plugin-help]` or contact Ash Shaw directly.

---

## References

- [Claude Code Setup Guide](./plugin-setup-claude-code.md)
- [GitHub Copilot Setup Guide](./plugin-setup-github-copilot.md)
- [Plugin Comparison](./plugin-comparison.md)
- [Testing Guide](./plugin-testing.md)
- [Troubleshooting Guide](./vscode-plugin-troubleshooting.md)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-26 | Initial adoption roadmap for Tiers 1–3 |

---

*Created as part of Phase 4: Plugin Adoption Strategy*
