#!/usr/bin/env python3
"""Validate the Yoast source register markdown table and required primary scan set markers."""
from pathlib import Path
import sys

REQUIRED_COLUMNS = [
    "Page title", "URL", "Source type", "Product or feature area", "Key facts",
    "Configuration relevance", "Developer relevance", "Limitations/version notes",
    "Duplicate status", "Verification status", "Accessed date"
]
REQUIRED_URLS = [
    "https://yoast.com/",
    "https://yoast.com/product/yoast-seo-wordpress/",
    "https://yoast.com/product/yoast-seo-premium-wordpress/",
    "https://yoast.com/product/yoast-woocommerce-seo/",
    "https://yoast.com/product/yoast-seo-ai-plus/",
    "https://developer.yoast.com/features/schema/api/",
    "https://developer.yoast.com/features/xml-sitemaps/api/",
    "https://developer.yoast.com/features/schema/pieces/howto/",
    "https://developer.yoast.com/features/http-headers/functional-specification/",
]
REQUIRED_PHRASES = [
    "research target",
    "needs live verification",
    "Duplicate preserved",
    "Secondary authoritative sources",
]
DEFAULT_SOURCE_REGISTER = Path("references/source-register.md")


def resolve_source_register_path(path="references/source-register.md"):
    """Accept either a direct source-register file path or a skill/references directory."""
    p = Path(path)
    if p.is_dir():
        skill_root_candidate = p / DEFAULT_SOURCE_REGISTER
        if skill_root_candidate.exists():
            return skill_root_candidate
        references_dir_candidate = p / "source-register.md"
        if references_dir_candidate.exists():
            return references_dir_candidate
        return skill_root_candidate
    return p


def main(path="references/source-register.md"):
    p = resolve_source_register_path(path)
    if not p.exists():
        print(f"missing source register: {p}")
        return 1
    text = p.read_text(encoding="utf-8")
    missing_cols = [c for c in REQUIRED_COLUMNS if c not in text]
    missing_urls = [u for u in REQUIRED_URLS if u not in text]
    missing_phrases = [s for s in REQUIRED_PHRASES if s not in text]
    if missing_cols or missing_urls or missing_phrases:
        print({"missing_columns": missing_cols, "missing_urls": missing_urls, "missing_phrases": missing_phrases})
        return 1
    if text.count("https://developer.yoast.com/features/schema/pieces/howto/") < 2:
        print("expected duplicate HowTo URL to be preserved")
        return 1
    if text.count("https://developer.yoast.com/features/http-headers/functional-specification/") < 2:
        print("expected duplicate HTTP headers URL to be preserved")
        return 1
    print(f"source register validation passed: {p}")
    return 0


if __name__ == "__main__":
    sys.exit(main(*(sys.argv[1:] or [])))
