"""Validate data/client-sites.yaml against lightweight structural expectations."""

from pathlib import Path
import sys
import yaml

DATA_PATH = Path("data/client-sites.yaml")
REQUIRED_TOP = ["schema_version", "clients"]
REQUIRED_CLIENT_KEYS = ["client_name", "primary_site", "business_priorities"]


def main() -> int:
    if not DATA_PATH.exists():
        print(f"Missing file: {DATA_PATH}")
        return 1

    data = yaml.safe_load(DATA_PATH.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        print("client-sites.yaml must be a mapping.")
        return 1

    missing_top = [key for key in REQUIRED_TOP if key not in data]
    if missing_top:
        print("Missing top-level keys:")
        for key in missing_top:
            print(f"- {key}")
        return 1

    clients = data.get("clients")
    if not isinstance(clients, list) or not clients:
        print("clients must be a non-empty list.")
        return 1

    errors = []
    for idx, client in enumerate(clients, start=1):
        if not isinstance(client, dict):
            errors.append(f"client #{idx} must be a mapping")
            continue
        for key in REQUIRED_CLIENT_KEYS:
            if key not in client:
                errors.append(f"client #{idx} missing '{key}'")

    if errors:
        print("client-sites.yaml validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print("client-sites.yaml looks valid.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
