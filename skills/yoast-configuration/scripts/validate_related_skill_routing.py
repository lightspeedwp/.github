#!/usr/bin/env python3
"""Validate related-skill routing between yoast-configuration and yoast-auditor."""
from pathlib import Path
import sys

REQUIRED_FILES = [
    "references/related-skills-routing.md",
    "tests/related-skills-routing-scenario-tests.md",
]

REQUIRED_TOKENS = [
    "yoast-auditor",
    "Related skill routing",
    "Live WordPress Yoast audits",
    "references/related-skills-routing.md",
    "templates/wordpress-admin-change-plan.md",
    "templates/yoast-remediation-backlog.md",
    "templates/metadata-bulk-edit-plan.md",
    "route implementation to `yoast-auditor`",
]

REFERENCE_TOKENS = [
    "yoast-configuration` owns",
    "yoast-auditor` owns",
    "Handoff format",
    "Do not route when",
    "Site/client",
    "Environment",
    "Access level",
    "Requested live action",
    "Approval state",
    "Post-change QA",
]


def main(root='.'):
    root = Path(root)
    missing = [p for p in REQUIRED_FILES if not (root / p).exists()]
    if missing:
        print({"missing_related_skill_files": missing})
        return 1

    skill_text = (root / "SKILL.md").read_text(encoding="utf-8")
    routing_index = (root / "references/file-routing-index.md").read_text(encoding="utf-8")
    related_text = (root / "references/related-skills-routing.md").read_text(encoding="utf-8")
    tests_text = (root / "tests/related-skills-routing-scenario-tests.md").read_text(encoding="utf-8")
    corpus = "\n".join([skill_text, routing_index, related_text, tests_text])

    missing_tokens = [token for token in REQUIRED_TOKENS if token not in corpus]
    if missing_tokens:
        print({"missing_related_skill_tokens": missing_tokens})
        return 1

    missing_reference_tokens = [token for token in REFERENCE_TOKENS if token not in related_text]
    if missing_reference_tokens:
        print({"missing_reference_tokens": missing_reference_tokens})
        return 1

    print("related skill routing validation passed")
    return 0


if __name__ == "__main__":
    sys.exit(main(*(sys.argv[1:] or [])))
