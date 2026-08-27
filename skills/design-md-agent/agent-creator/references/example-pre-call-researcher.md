# Example Pattern: Pre-Call Researcher

This example shows the level of specificity expected in an agent requirements document.

## Agent mission

The agent prepares a short call-prep brief before a customer meeting. It gathers approved internal and external context, checks important facts, highlights gaps or sensitive claims, and gives the account owner a review-ready one-page brief.

## Scope and boundaries

1. Identify the relevant upcoming customer meeting.
2. Gather meeting, account, support, and approved research context.
3. Synthesize the most important account signals.
4. Draft the call-prep brief.
5. Prepare a team update for review if requested.

Out of scope: sending messages, making customer commitments, changing CRM records, or using unsupported claims without approval.

## Inputs and trusted context

- Calendar invite
- Account or opportunity record
- Prior call notes
- Recent support themes
- Account plan or ICP
- Approved value narrative
- Product or policy context
- Examples of strong call-prep briefs

## Tools and permissions

| Tool/source | Access | Purpose | Approval gate |
|---|---|---|---|
| Calendar | Read-only | Find meeting and attendees | No |
| CRM/account records | Read-only | Account context | No |
| Support themes | Read-only | Recent customer issues | No |
| Approved messaging | Read-only | Safe value narrative | No |
| Document or ChatGPT output | Draft/write | Create prep brief | Review before external use |
| Team channel | Draft only by default | Prepare update | Approval before sending |

## Output requirements

Produce a one-page brief with:

- Account snapshot
- Meeting goal
- Attendee context
- Recent account or support signals
- Likely customer priorities
- Relevant approved value narrative
- Open questions
- Risks
- Recommended talk tracks
- Next-best preparation steps

## Quality checklist

- Concise enough to review before a call
- Source-grounded
- Separates facts from assumptions
- Uses approved messaging
- Highlights the highest-priority risks
- Names important sources
- Includes confidence level and review checklist
