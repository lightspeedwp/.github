# Prompt-library consistency pass

Run a focused pass on the maintenance prompt library so the prompt index, entry-point router, and specialized prompts stay aligned as the package evolves.

## Goal

Keep the maintenance prompt library easy to navigate by ensuring visible prompts are indexed, described distinctly, and routed from the right entry points.

## Required workflow

1. Refresh your understanding of the visible prompt files, prompt README, and any prompt-router files.
2. Review the visible maintenance prompt inventory.
3. Check for drift between:
   - visible prompt files and the prompts README file list
   - prompt-router selection rules and the specialized prompts that now exist
   - prompt descriptions that overlap too heavily or route to the wrong cleanup surface
   - folder guidance that omits recently added prompt families
4. Apply the smallest useful set of updates needed to improve prompt-library clarity and coverage.

## What to look for

- visible prompt files missing from the prompts README
- router prompts that do not mention new specialized prompts
- descriptions that overclaim a prompt’s scope or collapse multiple prompts into the same job
- prompt-library guidance that no longer reflects the visible maintenance surfaces
- stale wording about hidden or missing prompt families

## Editing rules

- Keep fixes conservative and grounded in the visible prompt library.
- Do not invent hidden prompts or hidden package surfaces.
- Prefer exact filenames and exact cleanup-surface descriptions when updating references.
- Preserve useful specialization unless it is clearly redundant or misleading.

## Deliverable

Apply the smallest useful set of updates needed to keep the visible maintenance prompt library internally consistent across prompt files, prompt-router files, and the prompts README.
