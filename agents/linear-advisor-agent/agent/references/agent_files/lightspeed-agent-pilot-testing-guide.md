# LightSpeed Agent Pilot Testing Guide

## Purpose

Use this guide when onboarding teammates to test a LightSpeed-built agent before wider rollout.

## 3-bullet summary

- Value: Teammates can test the agent with realistic LightSpeed workflows instead of vague prompts.
- Risk: The agent may overstate readiness if testers do not provide enough context or evidence.
- Next step: Give each tester 2 to 4 scenarios from the TSV and ask them to record pass/fail results.

## How team members should test the agent

1. Open the agent in ChatGPT.
2. Choose one test case from the shared Google Sheet.
3. Paste the suggested prompt into the agent.
4. Add the recommended input, such as a project brief, launch note, ticket link, source doc, pasted text, or screenshot summary.
5. Review the output against the pass criteria.
6. Record the result in the testing sheet.
7. Add clear notes about what worked, what failed, and what would make the answer more useful.

## What to provide when prompting

Good test prompts usually include:

- The project or client name.
- The task you want the agent to complete.
- Links or pasted context where possible.
- The intended audience for the output.
- Any known constraints, deadlines, or approval requirements.
- Whether the agent should only advise or also prepare a draft output.

## What good output looks like

A good agent response should:

- Start with a clear summary.
- Separate facts, assumptions, risks, and open questions.
- Use provided evidence rather than guessing.
- Explain blockers without being dramatic.
- Give practical next actions.
- Avoid taking write actions unless explicitly approved.
- Be useful to a LightSpeed teammate without needing Ash to translate it.

## What to avoid during the pilot

Do not ask the agent to:

- Send emails or Slack messages without approval.
- Publish website content without review.
- Update client records, tickets, issues, or project tools without approval.
- Make legal, compliance, privacy, security, or pricing claims without approved source material.
- Use confidential or sensitive client information unless the agent is approved for that workflow.

## Feedback scoring

Use this simple scoring model:

- 5: Excellent. Accurate, clear, useful, and safe.
- 4: Good. Minor edits needed.
- 3: Usable. Needs clearer instructions or better structure.
- 2: Weak. Missed important context, risk, or expected output.
- 1: Failed. Unsafe, inaccurate, unusable, or ignored the task.

## Pilot decision rule

Move from pilot to wider rollout only when:

- Most test cases score 4 or 5.
- No critical safety or permission failures remain open.
- Teammates understand how to prompt the agent.
- The agent handles missing or conflicting evidence safely.
- Ash is comfortable with the default permission and approval model.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
