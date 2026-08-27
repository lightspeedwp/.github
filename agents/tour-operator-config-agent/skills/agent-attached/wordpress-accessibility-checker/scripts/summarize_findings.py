#!/usr/bin/env python3
"""Create a concise markdown summary from normalised accessibility findings JSON."""
from __future__ import annotations

import argparse
import json
from collections import Counter
from pathlib import Path
from typing import Any, Dict, List

ORDER = ["blocker", "serious", "moderate", "minor", "needs review"]


def load_findings(path: Path) -> List[Dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, dict):
        return list(data.get("findings", []))
    if isinstance(data, list):
        return data
    raise SystemExit("Expected a JSON object with findings or a JSON list.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Summarise normalised accessibility findings.")
    parser.add_argument("input", type=Path, help="Normalised findings JSON")
    args = parser.parse_args()
    findings = load_findings(args.input)

    by_severity = Counter(f.get("severity", "needs review") for f in findings)
    by_owner = Counter(f.get("owner", "unknown") for f in findings)
    safe_count = sum(1 for f in findings if f.get("safe_to_fix"))

    print("# Accessibility Findings Summary\n")
    print(f"- Total findings: {len(findings)}")
    print(f"- Potentially safe content fixes: {safe_count}")
    print("- Severity breakdown: " + ", ".join(f"{key}: {by_severity.get(key, 0)}" for key in ORDER))
    print("- Owner breakdown: " + ", ".join(f"{key}: {value}" for key, value in sorted(by_owner.items())))
    print("\n## Highest Priority Items\n")
    ranked = sorted(findings, key=lambda f: ORDER.index(f.get("severity", "needs review")) if f.get("severity", "needs review") in ORDER else 99)
    for finding in ranked[:10]:
        print(f"- **{finding.get('severity', 'needs review')}**: {finding.get('title', '')} - {finding.get('url', '')}")


if __name__ == "__main__":
    main()
