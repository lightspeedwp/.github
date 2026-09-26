---
name: linear-review-attribution
description: 'Emit a Linear-attributed comment on a pull request from this repository. Use whenever an AI agent posts, updates, or summarises a comment on a pull request, and the comment should carry the agent name and model in Linear. Covers PR comments, Linear attribution, on-behalf-of blocks, agent name/model reporting, and Linear-synced reviews. Applies to Claude Code, opencode, Codex, and any other agent that touches a pull request in this repository.'
---

# Linear Review Attribution

Linear's Review Platform shows an agent's name and avatar next to a pull request
comment when the comment carries a `linear:extension` block with the
`onBehalfOf` plugin. This skill is how any agent in this repository gets that
attribution right, and gets the same risk score as every other tool.

## When to Use

Use this skill when you are about to:

- post a comment on a pull request, or update one you previously posted
- summarise a review, report a risk assessment, or hand work back on a pull request
- push a new commit to a pull request and want the new revision scored

Do not use it for ordinary commits, local reviews, or anything outside a pull
request.

## Emitting the block

Never hand-write the `linear:extension` block: the emitter validates the
contract (integer `level` 1-4, 40-character `sha`, at most 8 explanations of at
most 200 characters, model at most 200 characters) and fails loudly when
something is wrong. A block that is invalid is not rejected by Linear — it is
silently ignored, with no feedback.

```bash
PR_FILES=$(gh pr diff --name-only | paste -sd,)
PR_SHA=$(gh pr view --json headRefOid -q .headRefOid)

node scripts/automation/linear-review-extension.cjs \
  --files "$PR_FILES" \
  --agent claude \
  --model "Opus 4.5" \
  --sha "$PR_SHA" \
  --visible
```

### Preferred: prepend it to the comment you already post

Most review runs end with a comment anyway. Put the block at the **top** of that
comment and post it once:

```bash
node scripts/automation/linear-review-extension.cjs \
  --files "$PR_FILES" --agent claude --model "Opus 4.5" --sha "$PR_SHA" \
  > /tmp/linear-extension.md

# then compose your review, with the block above it, and post that one comment
```

This is the default because it leaves exactly one comment carrying the
attribution, and editing it on a later push updates the attribution in place.
Linear reads the block from a pull request comment, a review, or a review
comment, so it does not need to live in a comment of its own.

### Alternative: post it as its own comment

```bash
node scripts/automation/linear-review-extension.cjs \
  --files "$PR_FILES" --agent claude --model "Opus 4.5" --sha "$PR_SHA" \
  | gh pr comment --body-file -
```

`gh pr comment` **only ever creates a new comment.** It has no update mode, so
this form is **create-only**: run it once per pull request, not once per push,
or it leaves a trail of near-identical comments. If you need a standalone
comment to track new commits, delete the previous one first:

```bash
gh api "repos/{owner}/{repo}/issues/{pr}/comments" --paginate \
  --jq '.[] | select(.body | contains("lightspeed-linear-review")) | .id' \
  | xargs -r -I{} gh api --method DELETE "repos/{owner}/{repo}/issues/comments/{}"
```

Note this filters on the marker alone, without the bot-author check the workflow
uses, because your own comment is authored by you, not by a bot.

## Choosing the Agent

| You are              | `--agent`  |
| -------------------- | ---------- |
| Claude Code          | `claude`   |
| opencode             | `opencode` |
| Codex                | `codex`    |
| A Linear-hosted tool | `linear`   |
| Pi                   | `pi`       |

`--model` is free text and is shown next to the agent, for example `Opus 4.5`
or `gpt-5`. An unrecognised `--agent` value is still emitted, but Linear renders
it as a generic agent with no name or avatar.

Pass **your own** name. If you are Codex, pass `codex` — do not attribute a
comment to Claude Code or opencode because that is the usual tool in this
repository. Linear shows this attribution to reviewers as the author of the
comment, so a wrong value is a false claim about who did the work. If you cannot
identify which agent you are, omit `--agent` and `--model` and publish the risk
score alone.

## Getting the Pull Request and Commit

```bash
# Current branch's pull request number
gh pr view --json number
gh pr list --head "$(git branch --show-current)"

# Head commit SHA to score; this is what Linear ties the risk level to
gh pr view --json headRefOid
```

Use `gh pr list --head "$(git branch --show-current)"` when `gh pr view` fails
because the branch has no pull request yet. Create the pull request first.

## The Risk Score Is Not Yours

The emitter computes the risk level from the changed paths, the labels, and the
diff size. **Do not** ask an LLM to produce a level, an explanation, or a block
by hand, and do not edit an emitted level after the fact. The score is derived,
deterministic, and identical for every tool in this repository for the same
change. Add context in prose instead.

## Hard Rules

- Never hand-write or hand-edit a `linear:extension` block. Always go through
  `scripts/automation/linear-review-extension.cjs`.
- Never pass a `level` or a `sha` that the emitter did not produce.
- Never pass another tool's `--agent` or `--model` to make the comment look like
  it came from a different agent.
- Re-run the emitter whenever the head commit changes; the score is tied to
  `headRefOid`. Reuse your existing comment rather than adding another one.
- Keep the `<!-- lightspeed-linear-review -->` marker. The workflow finds its own
  comment by that marker, and it is how you find and replace your previous block
  when you update.

## Not an Escape Hatch

This skill covers attribution only. It does not satisfy the repository's
`FEEDBACK_RESPONSE.md` tracking requirement: the `ai-feedback-validation` workflow
still expects a `FEEDBACK_RESPONSE.md` on the branch with a status per review
item, and the pull request description still needs `Resolves #123` or
`Closes #123`. An attributed comment is not a tracked response.

## Reference

- `docs/LINEAR_INTEGRATION.md` — the full integration contract and setup
- `.github/workflows/linear-review-platform.yml` — the automated publisher
- <https://linear.app/docs/diffs> — Linear's own documentation
