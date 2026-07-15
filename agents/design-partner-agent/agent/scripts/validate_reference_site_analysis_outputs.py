#!/usr/bin/env python3
"""Validate reference-site-analysis output hygiene, evidence labeling, and token-mode rules."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(".")
TEMPLATE = ROOT / "templates/reference-site-analysis-template.md"
EXAMPLE = ROOT / "examples/reference-site-analysis-example.md"
QUALITY_CHECK = ROOT / "tests/reference-site-analysis-quality-check.md"
SCHEMA = ROOT / "schemas/reference-site-analysis.schema.json"

REQUIRED_HEADINGS = ["urls analyzed", "supporting technical evidence consulted", "directly verified observations", "not verified or visually unconfirmed details", "per-page observations", "cross-site patterns", "reusable guidance", "risks and assumptions", "recommended spec", "token mode used", "recommended token definitions aligned to the site css", "open questions"]
REQUIRED_PHRASES = ["Verified:", "Likely but unconfirmed", "Assumption:", "Recommendation:", "Extracted CSS tokens", "Recommended token roles"]
FORBIDDEN_SNIPPETS = ["I found and used", "used the attached", "used a workflow", "internal workflow", "validation step", "tool use", "filecite", "{{label:", "```css id=", "```html id=", "```json id="]
LIKELY_EXACT_TOKEN_SNIPPETS = ["--color-", "--font-size-", "--radius-", "--space-", "px;", "#2f"]
OVERLY_STYLISTIC_TOKEN_SNIPPETS = ["earthy", "safari green", "warm gold", "ochre", "elegant serif", "pill-like", "premium travel tone"]
PROOF_OR_COMPONENT_TOKEN_SNIPPETS = ["color.proof", "color_trust", "radius.card", "radius.button", "shadow.card"]
GENERIC_DISCOVERY_OPEN_QUESTION_SNIPPETS = ["what business or client", "what homepage will this reference inform", "what project is this for"]


def extract_headings(text: str) -> set[str]:
    headings: set[str] = set()
    for line in text.splitlines():
        if line.startswith("#"):
            headings.add(line.lstrip("#").strip().lower())
    return headings


def main() -> int:
    issues: list[str] = []
    for path in [TEMPLATE, EXAMPLE, SCHEMA]:
        if not path.exists():
            issues.append(f"missing required file: {path}")
    if issues:
        for issue in issues:
            print(f"[FAIL] {issue}")
        print(f"\nReference-site-analysis validation failed with {len(issues)} issue(s).")
        return 1
    template_text = TEMPLATE.read_text(encoding="utf-8")
    example_text = EXAMPLE.read_text(encoding="utf-8")
    schema_text = SCHEMA.read_text(encoding="utf-8")
    quality_check_text = QUALITY_CHECK.read_text(encoding="utf-8") if QUALITY_CHECK.exists() else ""
    template_headings = extract_headings(template_text)
    example_headings = extract_headings(example_text)
    for heading in REQUIRED_HEADINGS:
        if heading not in template_headings:
            issues.append(f"{TEMPLATE} missing heading '{heading}'")
        if heading not in example_headings:
            issues.append(f"{EXAMPLE} missing heading '{heading}'")
    for phrase in REQUIRED_PHRASES:
        if phrase not in example_text and phrase not in quality_check_text and phrase not in template_text:
            issues.append(f"reference-site-analysis assets missing required phrase '{phrase}'")
    for snippet in FORBIDDEN_SNIPPETS:
        if snippet in template_text:
            issues.append(f"{TEMPLATE} contains forbidden snippet '{snippet}'")
        if snippet in example_text:
            issues.append(f"{EXAMPLE} contains forbidden snippet '{snippet}'")
    if QUALITY_CHECK.exists():
        quality_lower = quality_check_text.lower()
        if "if no supporting technical evidence was needed" not in quality_lower:
            issues.append(f"{QUALITY_CHECK} missing neutral no-technical-evidence rule")
        if "anchored to the analyzed site" not in quality_lower:
            issues.append(f"{QUALITY_CHECK} missing analyzed-site anchoring rule")
        if "global foundational primitives" not in quality_lower:
            issues.append(f"{QUALITY_CHECK} missing foundational token-primitives rule")
        if "open questions focus on unresolved evidence" not in quality_lower:
            issues.append(f"{QUALITY_CHECK} missing open-question quality rule")
        if "uses **recommendation:** labels consistently" not in quality_lower:
            issues.append(f"{QUALITY_CHECK} missing recommendation-label consistency rule")
    else:
        print(f"[WARN] optional quality-check file not staged: {QUALITY_CHECK}")
    try:
        schema = json.loads(schema_text)
    except Exception as exc:
        issues.append(f"{SCHEMA} could not be parsed: {exc}")
        schema = None
    if isinstance(schema, dict):
        properties = schema.get("properties", {})
        for field in ["supporting_technical_evidence_consulted", "token_mode_used", "recommended_token_definitions_aligned_to_the_site_css"]:
            if field not in properties:
                issues.append(f"{SCHEMA} missing {field} property")
    example_lower = example_text.lower()
    if "recommended token roles" in example_lower and "exact css-backed colors" in example_lower:
        for snippet in LIKELY_EXACT_TOKEN_SNIPPETS:
            if snippet in example_text:
                issues.append(f"{EXAMPLE} appears to include exact token-like values while saying exact CSS token values were not verified")
                break
    token_section = example_lower.split("## recommended token definitions aligned to the site css", 1)[-1]
    for snippet in OVERLY_STYLISTIC_TOKEN_SNIPPETS:
        if snippet in token_section:
            issues.append(f"{EXAMPLE} uses overly stylistic token-role wording: '{snippet}'")
            break
    for snippet in PROOF_OR_COMPONENT_TOKEN_SNIPPETS:
        if snippet in token_section:
            issues.append(f"{EXAMPLE} uses proof-specific or component-adjacent token naming: '{snippet}'")
            break
    if "## homepage design brief" in example_lower:
        brief_section = example_lower.split("## homepage design brief", 1)[-1].split("## token mode used", 1)[0]
        if "recommendation:" not in brief_section:
            issues.append(f"{EXAMPLE} homepage design brief is missing explicit Recommendation labels")
    open_questions_section = example_lower.split("## open questions", 1)[-1]
    for snippet in GENERIC_DISCOVERY_OPEN_QUESTION_SNIPPETS:
        if snippet in open_questions_section:
            issues.append(f"{EXAMPLE} includes an overly generic discovery-reset open question: '{snippet}'")
            break
    if issues:
        for issue in issues:
            print(f"[FAIL] {issue}")
        print(f"\nReference-site-analysis validation failed with {len(issues)} issue(s).")
        return 1
    print("Reference-site-analysis output validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
