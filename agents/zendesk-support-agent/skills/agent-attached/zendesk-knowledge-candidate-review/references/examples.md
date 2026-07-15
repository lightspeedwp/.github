# Knowledge candidate review examples

Use these anonymised examples when the case is borderline, the recommendation feels subjective, or a shared-agent teammate needs a consistent pattern to follow.

Do not copy customer names, ticket IDs, private URLs, account details, internal diagnostics, or exact sensitive wording into examples. Keep examples generic and reusable.

## Example 1: Create a new public article

### Input pattern

A support team has answered the same setup question in three solved Zendesk tickets. Customers ask, "How do I connect my domain after changing nameservers?" The answer is stable, safe for customers to perform, and Help Centre search finds no article covering this exact task.

### Good recommendation

- Recommendation: `create new article`
- Readiness level: `ready to draft`
- Target: `public Help Centre`

### Why

The question is repeated, the answer is stable, and no existing article owns the customer intent. A public article should reduce repeated setup tickets and improve search findability.

### Next step

Route to `zendesk-create-knowledge` with the confirmed steps, prerequisites, expected wait time, and common customer wording.

## Example 2: Update an existing article

### Input pattern

Customers keep asking about a checkout error. Help Centre search finds an existing checkout troubleshooting article, but it does not mention the exact error wording or the confirmed workaround.

### Good recommendation

- Recommendation: `update existing article`
- Readiness level: `ready to draft`
- Target: `public Help Centre`

### Why

The existing article already owns the customer intent, but it is incomplete. Updating it avoids duplicate documentation and improves discoverability for the exact error wording.

### Next step

Route to `zendesk-create-knowledge` to add a troubleshooting section, exact customer-safe error wording, the confirmed workaround, and any prerequisites.

## Example 3: Keep as internal-only knowledge

### Input pattern

Agents repeatedly use an internal admin screen to verify account configuration before replying to customers. Customers cannot safely perform the check themselves, and the steps include private diagnostic details.

### Good recommendation

- Recommendation: `internal-only`
- Readiness level: `ready to draft`
- Target: `internal troubleshooting guide`

### Why

The guidance is repeatable and useful for support, but it depends on internal tooling and private checks. A public article would expose internal process and create unsafe customer expectations.

### Next step

Route to `zendesk-create-knowledge` for an internal-only note or macro guidance that separates agent checks from customer-facing wording.

## Example 4: Wait because evidence is unstable

### Input pattern

Several customers report a new import failure. The root cause is not confirmed, product behaviour may change, and there is no validated workaround yet.

### Good recommendation

- Recommendation: `wait`
- Readiness level: `not ready`
- Target: `no documentation yet`

### Why

The issue may be worth documenting later, but the answer is unstable. Publishing now could imply certainty or give customers steps that become wrong quickly.

### Next step

Route to `zendesk-evidence-collector` to confirm reliable Zendesk evidence, cause, impact, workaround, and resolution context before documentation is reconsidered. Return to `zendesk-router-skill` instead when the next workflow is broader than evidence collection.

## Example 5: Known issue note with public wording caution

### Input pattern

A confirmed known limitation affects a small group of customers. Support has a safe mitigation, but there is no confirmed fix date. Leadership is comfortable acknowledging the limitation publicly if wording avoids promises.

### Good recommendation

- Recommendation: `create new article` or `update existing article`, depending on Help Centre overlap
- Readiness level: `needs one more check`
- Target: `known issue note`

### Why

The issue is confirmed and reusable, but public wording needs caution. The article should explain the limitation and mitigation without promising timelines or implying all accounts are affected.

### Next step

Route to `zendesk-case-readiness-check` first if the public/internal boundary, audience, stability, workaround, or wording review is uncertain. Route to `zendesk-create-knowledge` only after documentation-worthiness is clear enough to draft.

## Example 6: Low-confidence review with limited connector access

### Input pattern

The user pastes a solved ticket summary and asks whether to document it. The agent has no Zendesk or Help Centre connector access in the shared workspace.

### Good recommendation

- Recommendation: `create new article`, `update existing article`, `internal-only`, or `wait` based only on supplied evidence
- Readiness level: usually `needs one more check`
- Target: mark the likely target, but state the access limitation

### Why

A useful preliminary decision can still be made from supplied evidence, but confidence is limited because ticket status, repeatability, or Help Centre overlap cannot be verified.

### Next step

Name the smallest missing check, such as: "Search Help Centre for the customer phrase and product term before creating a new article." Do not pretend connector evidence was checked.

## Example 7: Not documentation-worthy yet

### Input pattern

A single resolved ticket involved a complex account-specific migration, a one-off configuration, and a tailored workaround that should not be reused.

### Good recommendation

- Recommendation: `wait` or `internal-only`, depending on whether agents need future handling guidance
- Readiness level: `not ready` or `needs one more check`
- Target: `no documentation yet` or `internal support note`

### Why

The case may be resolved, but it is not necessarily reusable. A public article would overfit to one account and may mislead other customers.

### Next step

Capture any reusable agent lesson internally only if it is likely to recur; otherwise do not create documentation.
