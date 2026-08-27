---
name: website-security-discovery-reviewer
description: Run website security discovery assessments for LightSpeed website projects. Use when the user wants to organize security findings, identify likely risks, distinguish observed issues from unverified concerns, summarize exposure areas, or define what needs specialist validation before remediation or launch decisions.
---

# Website Security Discovery Reviewer

## Overview

Use this skill for security discovery and triage work. The aim is to create a clear internal assessment from available evidence without overstating certainty or pretending to perform a formal penetration test.

## Request Shapes

Use `$website-security-discovery-reviewer` for requests like:

- "Assess the website security concerns from these notes or findings."
- "Turn these security observations into a structured internal review."
- "What risks, gaps, and validation steps should we highlight before launch or remediation planning?"

## Workflow

1. Identify the security evidence available such as audit notes, tool findings, screenshots, plugin or hosting context, incident notes, exposed configuration details, or stakeholder concerns.
2. Establish the evidence boundary. Separate:
   - observed security findings
   - plausible risk indicators
   - unsupported suspicions
   - missing validation coverage
3. Group the assessment into practical categories such as:
   - access and authentication concerns
   - update, dependency, or plugin exposure
   - hosting or infrastructure-related risk
   - configuration or hardening issues
   - data handling and privacy concerns
   - monitoring, backup, or recovery gaps
4. Distinguish risk signals from confirmed vulnerabilities. If specialist verification is required, say so plainly.
5. Highlight business impact, launch risk, and operational follow-up needs without presenting legal or formal security certification language.
6. Produce a structured internal security assessment with findings, assumptions, open questions, and next-step validation recommendations.

## Output Contract

The default output should include:

- current security situation from available evidence
- major observed findings or risk signals
- evidence gaps and unverified concerns
- likely follow-up investigations or specialist review needs
- practical next actions or blockers

## Quality Bar

- Do not present inferred risk as a confirmed vulnerability.
- Do not imply a formal security audit happened unless the evidence clearly supports that.
- Keep technical observations, operational gaps, and business risk separate.
- Make validation limits explicit.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
