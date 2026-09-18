#!/usr/bin/env python3
"""Create a starter WordPress/Figma artefact packet folder.

This helper intentionally uses only the Python standard library so it can run in
local repos, Codex environments, Claude Code sessions, and basic CI containers.
It creates markdown files that should be edited with project-specific context.
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path
from textwrap import dedent


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "artifact-packet"


def write_file(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(dedent(content).strip() + "\n", encoding="utf-8")


def build_packet(project: str, artifact_type: str, target: str, out_dir: Path) -> Path:
    packet_dir = out_dir / slugify(project)
    packet_dir.mkdir(parents=True, exist_ok=True)

    write_file(
        packet_dir / "00-intake.md",
        f"""
        # {project} Intake

        ## Target

        - Artefact type: {artifact_type}
        - Target tool: {target}
        - WordPress target: TODO
        - Figma source: TODO
        - Repository/source files: TODO
        - Routing status: TODO: stay here / route first / route instead / return from specialist skill
        - Related skill source: TODO: upstream or next skill, if relevant

        ## Source Confidence

        | Source | Status | Notes |
        |---|---|---|
        | Figma | missing | Add URL, node ID, screenshot, export, or notes. |
        | WordPress repo | missing | Add repo path or relevant files. |
        | PRD/DESIGN.md | missing | Add planning or design source. |
        | Upstream specialist skill | missing | Add skill name and output used, if relevant. |

        ## Routing Decision

        - Current owner: wp-figma-artifact-builder / routed specialist.
        - Recommended next skill: TODO
        - Reason: TODO
        - Inputs to pass forward: TODO

        ## Open Decisions

        - [ ] Confirm theme/plugin boundary.
        - [ ] Confirm design source of truth.
        - [ ] Confirm acceptance criteria.
        """,
    )

    write_file(
        packet_dir / "01-figma-context-request.md",
        f"""
        # {project} Figma Context Request

        Use this prompt in a Figma MCP-enabled client when design context is available.

        ```markdown
        Extract implementation context from this Figma source for a WordPress build.

        Figma source:
        TODO: paste Figma file, frame, node, or prototype URL.

        Return:
        1. Layout structure and responsive behaviour.
        2. Variables, styles, typography, spacing, colour, radius, and shadow usage.
        3. Components, variants, states, and reusable sections.
        4. Accessibility notes.
        5. Recommended WordPress mapping: core blocks, patterns, template parts, theme.json, custom block, or plugin logic.
        6. Missing states or decisions that require human approval.
        ```
        """,
    )

    write_file(
        packet_dir / "02-wordpress-implementation-plan.md",
        f"""
        # {project} WordPress Implementation Plan

        ## Objective

        TODO: State what needs to be built and why.

        ## Figma-to-WordPress Mapping

        | Figma item | WordPress target | Notes | Confidence |
        |---|---|---|---|
        | TODO | TODO | TODO | missing |

        ## Theme/Plugin Boundary

        - Theme: TODO
        - Plugin: TODO
        - Avoid: TODO

        ## File Manifest

        | File | Action | Purpose |
        |---|---|---|
        | TODO | create/update/read-only | TODO |

        ## Implementation Steps

        1. TODO
        2. TODO
        3. TODO
        """,
    )

    write_file(
        packet_dir / "03-codex-task.md",
        f"""
        # {project} Codex Task

        ```markdown
        Use the WordPress/Figma artefact workflow.

        Objective:
        TODO: one clear objective.

        Source context:
        - Figma: TODO
        - WordPress target: TODO
        - Supporting docs: TODO

        Inspect first:
        - TODO

        Likely edits:
        - TODO

        Boundaries:
        - Do not refactor unrelated files.
        - Do not add custom code where a core block, pattern, block support, or theme.json token is sufficient.
        - Stop and ask for review if the implementation requires scope, design, data, security, privacy, or budget decisions.

        Implementation steps:
        1. TODO
        2. TODO
        3. TODO

        Verification:
        ```bash
        npm run lint
        npm run build
        ```

        Acceptance criteria:
        - [ ] TODO
        - [ ] TODO
        ```
        """,
    )

    write_file(
        packet_dir / "04-claude-task.md",
        f"""
        # {project} Claude Code Task

        ```markdown
        Work as a careful WordPress block theme and Figma implementation assistant.

        Goal:
        TODO

        Read first:
        - TODO

        Constraints:
        - Keep design tokens and presentation rules in the theme.
        - Keep reusable functionality, custom blocks, fields, CPTs, integrations, and business logic in plugins.
        - Avoid broad refactors.
        - Preserve existing repository conventions.

        Deliver:
        - Summary of changes.
        - Files changed.
        - Verification performed.
        - Risks or follow-up work.
        ```
        """,
    )

    write_file(
        packet_dir / "05-vscode-checklist.md",
        f"""
        # {project} VS Code Checklist

        ## Before Coding

        - [ ] Open the target repo/workspace.
        - [ ] Confirm branch name.
        - [ ] Confirm Figma/design source.
        - [ ] Review relevant theme/plugin boundaries.
        - [ ] Review file manifest.

        ## During Coding

        - [ ] Keep changes minimal and scoped.
        - [ ] Reuse tokens, presets, patterns, and block supports.
        - [ ] Avoid unrelated refactors.
        - [ ] Update documentation or comments where useful.

        ## Before Handoff

        - [ ] Run build checks.
        - [ ] Run lint/static checks.
        - [ ] Check editor experience.
        - [ ] Check front-end rendering.
        - [ ] Check responsive behaviour.
        - [ ] Check accessibility basics.
        """,
    )

    write_file(
        packet_dir / "06-qa-checklist.md",
        f"""
        # {project} QA Checklist

        ## Design Parity

        - [ ] Layout hierarchy matches design intent.
        - [ ] Typography, colour, spacing, radius, and shadow use approved tokens where available.
        - [ ] Missing states are documented.
        - [ ] Responsive behaviour is checked.

        ## WordPress

        - [ ] Front end renders correctly.
        - [ ] Editor experience works correctly.
        - [ ] Patterns/templates/template parts are inserted correctly.
        - [ ] Plugin/theme boundary is respected.

        ## Accessibility

        - [ ] Heading order is logical.
        - [ ] Keyboard navigation works.
        - [ ] Focus states are visible.
        - [ ] Colour contrast is acceptable.
        - [ ] Motion is reduced or avoidable where relevant.

        ## Performance

        - [ ] No unnecessary front-end JavaScript.
        - [ ] Assets are enqueued only where needed.
        - [ ] Images are appropriately sized.
        - [ ] Build output is reviewed for unexpected weight.
        """,
    )

    write_file(
        packet_dir / "07-routing-handoff.md",
        f"""
        # {project} Routing Handoff

        ## Current Status

        - Current owner: wp-figma-artifact-builder
        - Artefact type: {artifact_type}
        - Target tool: {target}

        ## Recommended Next Skill

        - Skill: TODO
        - Why: TODO
        - Inputs to pass forward: TODO
        - Expected output before returning here: TODO

        ## Notes for LightSpeed Review

        - [ ] Source confidence is clear.
        - [ ] Specialist ownership is not being duplicated.
        - [ ] The next action is obvious.
        """,
    )

    return packet_dir


def main() -> None:
    parser = argparse.ArgumentParser(description="Create a starter WordPress/Figma artefact packet.")
    parser.add_argument("project", help="Project or artefact packet name")
    parser.add_argument("--type", default="figma-wordpress", help="Artefact type label")
    parser.add_argument("--target", default="mixed", help="Target tool: vscode, claude, codex, chatgpt, figma-mcp, or mixed")
    parser.add_argument("--output", default=".", help="Output directory")
    args = parser.parse_args()

    packet_dir = build_packet(args.project, args.type, args.target, Path(args.output))
    print(f"Created artefact packet: {packet_dir}")


if __name__ == "__main__":
    main()
