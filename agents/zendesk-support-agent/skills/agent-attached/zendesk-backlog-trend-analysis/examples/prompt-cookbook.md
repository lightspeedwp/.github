# Prompt Cookbook

Use these examples to test or demonstrate the skill in a shared support agent.

## Backlog health

```txt
Give me the current open Zendesk backlog health for the support queue. Include ageing risk, ownership gaps, repeated themes, and 3 priority actions.
```

## Weekly report

```txt
Create a weekly support report for the last 7 days compared with the previous 7 days. Keep it concise and support-operational.
```

## Trend comparison

```txt
Are checkout-related support tickets increasing compared with the previous 7 days? Use Zendesk evidence only and mark SLA unavailable if you cannot see it.
```

## Daily digest

```txt
Give me today's support digest: what needs attention, what is ageing, what looks repeated, and what action should the support lead take next?
```

## Repeated-theme review

```txt
Review the last 7 days of open and newly created Zendesk tickets for repeated customer pain. Classify each pattern as likely duplicate, related but distinct, repeated support pain, possible incident signal, or inconclusive.
```

## Permission-limited session

```txt
Try to produce a backlog health report. If the active agent cannot see counts, metadata, SLA, or ticket details, explain the limitation without inventing data.
```

## Shared-agent capability profile prompt

Use this when installing the skill into a new shared agent or when reports are inconsistent across teammates:

```text
Check whether this shared support agent has enough Zendesk access for backlog trend reports. Use the workspace capability profile pattern, list confirmed read capabilities, optional data visibility, missing evidence, and any report types that should be considered permission-limited. Do not use personal views or hardcoded IDs.
```

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
