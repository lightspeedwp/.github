#!/usr/bin/env python3
"""Validate the Tour Operator Website skill payload.

Run from the skill root or pass the skill root path as the first argument.
This script checks the bundled structure and JSON payloads; it does not replace
the platform skill validator.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REQUIRED_FILES = [
    "SKILL.md",
    "agents/openai.yaml",
    "references/README.md",
    "references/content-model/core/post-types.json",
    "references/content-model/core/taxonomies.json",
    "references/content-model/core/relationships.json",
    "references/content-model/core/source-map.md",
    "references/content-model/core/field-usage-rules.md",
    "references/content-model/core/facetwp-indexing-notes.md",
    "references/content-model/extensions/to-reviews.json",
    "references/content-model/extensions/to-team.json",
    "references/content-model/extensions/to-specials.json",
    "references/content-model/integrations/wetu-importer.json",
    "references/schema/jsonld-yoast-schema-map.json",
    "references/outputs/output-contracts.md",
    "references/outputs/client-safe-language.md",
    "references/outputs/finding-register.schema.json",
    "references/evidence/evidence-model.md",
    "references/evidence/source-links.md",
    "references/workflows/audit-workflows.md",
    "references/workflows/live-site-inspection.md",
    "references/workflows/implementation-workflows.md",
    "references/workflows/content-model-maintenance.md",
    "references/workflows/repository-evidence-review.md",
    "references/workflows/gravity-forms-tour-operator-workflows.md",
    "references/workflows/jsonld-yoast-workflow.md",
    "references/workflows/block-theme-tour-operator-patterns.md",
    "references/validation/anti-drift-tests.md",
    "references/validation/content-model-consistency.md",
    "references/workflows/acceptance-test-planning.md",
    "references/workflows/issue-handoff-workflow.md",
    "references/outputs/acceptance-criteria-library.md",
    "references/outputs/issue-draft-templates.md",
    "references/validation/output-contract-lint.md",
    "references/validation/prepackage-checklist.md",
    "scripts/validate_output_contracts.py",
    "scripts/validate_content_model.py",
    "scripts/validate_payload.py",
]

FORBIDDEN_DIR_NAMES = {"__pycache__", ".git", ".pytest_cache", "node_modules"}


def fail(message: str) -> None:
    print(f"ERROR: {message}")
    sys.exit(1)


def main() -> None:
    root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd().resolve()
    if not root.exists():
        fail(f"skill root does not exist: {root}")

    skill_files = list(root.rglob("SKILL.md"))
    if len(skill_files) != 1:
        fail(f"expected exactly one SKILL.md, found {len(skill_files)}")

    frontmatter = skill_files[0].read_text(encoding="utf-8").split("---", 2)
    if len(frontmatter) < 3 or frontmatter[0].strip():
        fail("SKILL.md must start with YAML frontmatter")
    keys = []
    for line in frontmatter[1].splitlines():
        match = re.match(r"^([A-Za-z0-9_-]+):", line)
        if match:
            keys.append(match.group(1))
    if set(keys) != {"name", "description"}:
        fail(f"SKILL.md frontmatter must contain only name and description, found {keys}")

    for rel in REQUIRED_FILES:
        if not (root / rel).exists():
            fail(f"missing required file: {rel}")

    flattened = list((root / "references").glob("*.json"))
    if flattened:
        fail("JSON files must not be flattened directly under references/: " + ", ".join(p.name for p in flattened))

    for path in root.rglob("*"):
        if path.is_dir() and path.name in FORBIDDEN_DIR_NAMES:
            fail(f"forbidden generated directory included: {path.relative_to(root)}")
        if path.is_file() and path.stat().st_size > 2_000_000:
            fail(f"unexpected bulky file over 2 MB: {path.relative_to(root)}")

    json_files = sorted(root.rglob("*.json"))
    for path in json_files:
        try:
            json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            fail(f"invalid JSON in {path.relative_to(root)}: {exc}")

    print(f"OK: validated {root.name}; {len(json_files)} JSON files parsed; {len(REQUIRED_FILES)} required files present.")


if __name__ == "__main__":
    main()
