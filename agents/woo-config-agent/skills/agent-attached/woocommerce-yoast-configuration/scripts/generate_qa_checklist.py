#!/usr/bin/env python3
"""Generate a small Yoast QA checklist for a site profile.

This script is intentionally simple. It generates checklist boilerplate only; it does not prove Yoast or Google behaviour.
"""
import argparse

BASE = [
    "Confirm active Yoast product mix and evidence confidence.",
    "Check homepage title, description, canonical, robots, social metadata, schema, and sitemap inclusion.",
    "Check representative content type and taxonomy URLs.",
    "Check sitemap/noindex/canonical alignment.",
    "Check robots.txt and llms.txt where relevant.",
    "Check schema graph for duplicate or conflicting entities.",
]

PROFILE_CHECKS = {
    "standard-business": [
        "Check service pages and contact/conversion pages.",
        "Noindex thin utility archives unless intentionally useful.",
    ],
    "local-business": [
        "Verify organisation/location data and local landing pages.",
        "Check map/location schema dependencies before making local claims.",
    ],
    "publisher-blog": [
        "Check author archives, date archives, categories, tags, and Article schema.",
        "Check editorial duplication risks from tags and archives.",
    ],
    "woocommerce": [
        "Check simple and variable products for Product/ProductGroup/Offer schema.",
        "Check product categories, tags, attributes, shop page, and filtered URLs.",
        "Check product sitemap and product taxonomy sitemap output.",
    ],
    "migration": [
        "Check old-to-new redirects, live canonicals, sitemap transition, and staging URL leakage.",
        "Check Search Console follow-up tasks are recorded.",
    ],
    "developer": [
        "Verify official Yoast API/filter docs before implementation.",
        "Run before/after rendered source and regression checks.",
    ],
}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--profile", default="standard-business", choices=sorted(PROFILE_CHECKS))
    args = parser.parse_args()
    print(f"# Yoast QA checklist: {args.profile}\n")
    for item in BASE + PROFILE_CHECKS[args.profile]:
        print(f"- [ ] {item}")

if __name__ == "__main__":
    main()
