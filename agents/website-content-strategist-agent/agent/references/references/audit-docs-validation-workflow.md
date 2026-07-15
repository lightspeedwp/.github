# Audit, docs, and validation workflow

## Purpose

Use this workflow when reviewing instruction drift, attached-file drift, prompt coverage, QA assets, or maintenance gaps in this agent.

Keep the workflow grounded in the files and tools that are actually attached in the current draft.

## Workflow

### 1. Audit the grounded draft

- Review the currently attached files, instructions, skills, apps, and Memory usage.
- Treat the current grounded draft as the source of truth.
- Do not assume older referenced files still exist.

### 2. Identify drift and gaps

- List which files are currently attached.
- List which instructions or workflows reference missing files.
- Separate missing assets into:
  - must restore
  - useful but optional
  - stale references to remove

### 3. Repair conservatively

- Prefer updating instructions or creating a lean replacement file over rebuilding a large missing system.
- Recreate only the smallest useful reference needed for the current maintenance job.
- Avoid restoring duplicate, speculative, or ungrounded assets.

### 4. Confirm the result

- State what is now grounded.
- State what is still missing.
- Explain whether the requested maintenance workflow can now run from the current draft.

## Prompt tracking

When reviewing prompts in a maintenance reference:

- count only prompts that are clearly present in the current grounded file
- mark a prompt as completed only when its requested work has been carried out or clearly recorded as done
- if completion cannot be verified from grounded files or instructions, mark it as not yet confirmed

## Output expectations

For maintenance reviews, provide:

- a short status summary
- grounded files available now
- missing or stale references
- the next safest maintenance step
