"""Validate a report metadata YAML file or frontmatter-like mapping."""

from pathlib import Path
import sys
import yaml

REQUIRED_KEYS = ["client_name", "site_name", "primary_url", "audit_date", "report_type"]
ALLOWED_REPORT_TYPES = {"baseline", "pre_optimization", "post_optimization", "comparison"}


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: python scripts/validate-report-metadata.py <path-to-yaml>")
        return 1

    path = Path(sys.argv[1])
    if not path.exists():
        print(f"Missing file: {path}")
        return 1

    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        print("Report metadata must be a mapping.")
        return 1

    missing = [key for key in REQUIRED_KEYS if key not in data]
    if missing:
        print("Missing required keys:")
        for key in missing:
            print(f"- {key}")
        return 1

    if data.get("report_type") not in ALLOWED_REPORT_TYPES:
        print(f"Invalid report_type: {data.get('report_type')}")
        return 1

    print("Report metadata looks valid.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
