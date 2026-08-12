# Redirect Map Decision Model

Use this model to review redirect rows before implementation.

## Decision options

- redirect to direct successor
- redirect to closest parent page
- keep live and update metadata
- noindex but keep accessible
- return not found only when there is no useful replacement and the impact is accepted

## Required checks

- Does the target match user intent?
- Is the target live?
- Is the target indexable where intended?
- Does the target canonical point to itself or another approved URL?
- Is the old URL removed from sitemap sets?
- Are important internal links updated?

## Output rule

Flag unclear rows instead of inventing targets.
