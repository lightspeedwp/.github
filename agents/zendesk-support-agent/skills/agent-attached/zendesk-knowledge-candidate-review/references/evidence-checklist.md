# Evidence checklist

Use this checklist when the supplied case evidence is messy, partial, permission-limited, or when the documentation recommendation may be disputed. Do not turn the checklist into a long intake process. Use it to identify the smallest evidence gap that changes the documentation path.

## Minimum useful evidence

Try to confirm these items from Zendesk, Help Centre search, or user-supplied evidence:

- Source ticket, thread, or issue summary.
- Customer-facing question, symptom, task, error message, limitation, workaround, or known issue wording.
- Current status: unresolved, waiting, solved, reopened, incident-linked, or unknown.
- Confirmed answer, resolution, workaround, limitation, or expected behaviour.
- Stability signal: confirmed, caveated, temporary, actively changing, or unknown.
- Repeatability signal: multiple tickets, repeated customer wording, macro reuse, repeated agent workaround, high-effort single case, high-risk single case, or no repeat signal.
- Help Centre or internal knowledge overlap: none found, likely overlap, exact existing article, stale article, missing section, or not checked.
- Audience fit: public Help Centre, internal support note, internal troubleshooting guide, macro guidance, known issue note, or no documentation yet.
- Sensitivity check: account-specific, private tooling, billing, security, legal, privacy, unpublished behaviour, commercial policy, or safe to publish.

## Decision-impact checks

Use these checks to avoid over-documenting or publishing too early:

- If the answer or workaround is unconfirmed, prefer `wait` or `internal-only`.
- If the same customer intent already has an article, prefer `update existing article`.
- If guidance depends on private tools, account checks, or agent judgement, prefer `internal-only`.
- If the issue is an active incident or changing product behaviour, prefer `wait` unless an approved known-issue note exists.
- If the issue is low-volume but high-risk, high-effort, or likely to recur, it can still be documentation-worthy.
- If Help Centre overlap has not been checked, use `needs one more check` unless the supplied evidence clearly supports an internal-only or wait recommendation.

## Smallest missing evidence prompts

When confidence is low, name one concrete missing check, such as:

- Check Zendesk for solved tickets using the customer's error wording.
- Search Help Centre for the setup task and the exact error message.
- Confirm whether the workaround is approved and still current.
- Confirm whether the behaviour is expected, a bug, or an active incident.
- Confirm whether the guidance contains private tooling or account-specific steps.
- Confirm whether an existing article already owns this customer intent.

## Evidence confidence labels

Use these labels internally when forming the review:

- High confidence: Zendesk evidence, stability, repeatability, and Help Centre overlap are all clear.
- Medium confidence: core issue and likely path are clear, but one evidence area is missing or permission-limited.
- Low confidence: supplied evidence is incomplete, unresolved, contradictory, or lacks both stability and overlap checks.
