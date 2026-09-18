#!/usr/bin/env python3
"""Generate a compact Yoast QA checklist for supported site profiles."""
from __future__ import annotations

import argparse

BASE_CHECKS = [
    "rendered title and meta output",
    "canonical tags",
    "robots directives",
    "XML sitemaps",
    "schema output",
    "breadcrumbs",
    "redirect samples where relevant",
]

TOUR_CHECKS = [
    "destination page sample",
    "tour page sample",
    "accommodation page sample where present",
    "travel-style archive sample where present",
    "guide or FAQ page sample",
    "enquiry page sample",
    "translated page sample where relevant",
]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--profile", default="tour-operator", choices=["tour-operator", "general"])
    args = parser.parse_args()
    checks = BASE_CHECKS + (TOUR_CHECKS if args.profile == "tour-operator" else [])
    print("# Yoast QA Checklist")
    for item in checks:
        print(f"- [ ] {item}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
