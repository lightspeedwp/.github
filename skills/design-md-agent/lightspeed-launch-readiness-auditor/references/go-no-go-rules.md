# Go/No-Go Rules

## Go

Use `Go` only when:

- no launch blockers remain
- critical pages pass QA
- redirects are tested or not required
- forms and conversion routes work
- analytics and tracking are tested
- privacy/policy pages are present
- accessibility testing found no critical blockers
- indexing controls are correct
- rollback plan exists

## Conditional Go

Use `Conditional Go` when:

- no blockers remain
- high-risk issues are non-critical or accepted
- each issue has an owner and target date
- post-launch monitoring is agreed

## No-Go

Use `No-Go` when any of these apply:

- unresolved redirect blocker
- key forms do not work
- checkout/payment fails
- staging noindex blocks production indexing
- privacy/policy pages are missing for tracking or data collection
- critical accessibility blockers remain
- major broken navigation exists
- analytics/conversion tracking is untested and measurement is business-critical
- launch-critical evidence is missing
