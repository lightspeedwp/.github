# Connector and source alignment prompt

Use this recurring prompt when the agent’s configured apps, evidence-source rules, connector docs, or source-priority guidance may have drifted from the real attached app layer.

## Prompt

Run a focused connector-and-source alignment pass over the current agent scaffold.

Goals:
- verify that configured apps and evidence-source language still match the real attached app layer
- verify that connector docs, source-priority rules, and planning guidance refer to the correct sources and access assumptions
- identify stale app mentions, missing source updates, and misleading evidence-routing rules

Priority checks:
1. verify that the main instructions mention only grounded evidence sources and attached apps that are actually configured for the workflow
2. verify that connector reference docs and source-priority docs match the current attached app layer and intended planning use
3. verify that templates, examples, prompts, and validation notes do not depend on sources that are no longer configured
4. verify that app-specific exclusions or caveats still match the current setup
5. verify that source-handling rules remain clear when multiple evidence systems are attached

Scope guidance:
- review the main instructions first
- review connector docs and source-priority references next
- review prompt-library files, templates, examples, and validation notes where source assumptions matter
- tighten cross-links where connector or source guidance is hard to find

Constraints:
- do not invent new app access
- do not claim a source is available unless it is grounded in the current agent setup
- do not widen scope into unrelated workflow redesign unless a concrete source-alignment issue requires it

Output standard:
- report only high-signal source-alignment findings
- explain where the mismatch appears, why it matters, and the smallest safe fix
- summarize which source layers are trustworthy versus drifted

## When to use it
- after adding, removing, or reconfiguring apps
- after changing evidence-source rules in the instructions
- before source-sensitive validation or promotion work
- whenever connector docs may have drifted from the real setup
