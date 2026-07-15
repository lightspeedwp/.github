# README refresh prompt

Use this recurring prompt when the scaffold has changed and you want every folder README to accurately reflect the latest file and folder structure.

## Prompt

Audit this agent's README.md files, then update all folder README files that no longer match the current scaffold.

Goals:

- verify folder purpose statements
- verify current file inventory accuracy
- verify naming conventions are still correct
- verify important distinctions are still documented clearly

Priority checks:

- templates vs examples
- examples vs fixtures
- memory/defaults vs memory/schemas
- references vs docs vs rollout
- prompts library inventory

Folders to review first:

- templates/
- examples/
- examples/templates/
- examples/memory/
- fixtures/
- memory/
- memory/defaults/
- memory/schemas/
- references/
- docs/
- rollout/
- prompts/

Constraints:

- do not rewrite README files for style only
- focus on inventory drift, purpose drift, and distinction drift
- keep file names exact and auditable

Output:

- list README files reviewed
- list README files updated
- list any folders whose file inventory still needs manual follow-up
