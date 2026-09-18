#!/usr/bin/env python3
"""Deterministic sanity checker for bundled Gravity Forms config JSON.

This script performs local structural checks only. It does not contact WordPress,
Gravity Forms, payment gateways, or MCP tools.
"""
import json
import sys
from pathlib import Path

REQUIRED_TOP_LEVEL = [
    "form_name", "purpose", "audience", "source_template", "fields",
    "field_settings", "conditional_logic", "confirmations", "notifications",
    "feeds", "spam_settings", "accessibility_settings", "embedding_target",
    "data_retention_notes", "test_data", "required_addons", "risks",
    "approval_status",
]
REQUIRED_FIELD_KEYS = ["label", "type", "required"]
HIGH_RISK_FIELD_TYPES = {"fileupload", "file upload", "product", "creditcard", "stripe", "paypal", "password"}
APPROVAL_STATES = {"draft", "needs approval", "approved", "applied"}
HIGH_RISK_TERMS = {
    "payment", "stripe", "paypal", "square", "mollie", "user registration",
    "user", "password", "role", "fileupload", "file upload", "webhook",
    "partial entries", "retention", "delete", "analytics", "tracking", "utm", "ga4", "gtm", "donation", "refund", "recurring", "subscription", "receipt",
}


def fail(msg: str) -> int:
    print(f"ERROR: {msg}", file=sys.stderr)
    return 1


def iter_paths(args):
    for arg in args:
        p = Path(arg)
        if p.is_dir():
            yield from sorted(p.rglob("*.json"))
        else:
            yield p


def validate(path: Path) -> int:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        return fail(f"{path}: invalid JSON: {exc}")

    missing = [key for key in REQUIRED_TOP_LEVEL if key not in data]
    if missing:
        return fail(f"{path}: missing top-level keys: {', '.join(missing)}")

    fields = data.get("fields")
    if not isinstance(fields, list) or not fields:
        return fail(f"{path}: fields must be a non-empty list")

    seen_labels = set()
    seen_ids = set()
    high_risk_fields = []
    consent_fields = []

    for idx, field in enumerate(fields, start=1):
        if not isinstance(field, dict):
            return fail(f"{path}: field {idx} must be an object")
        missing_field = [key for key in REQUIRED_FIELD_KEYS if key not in field]
        if missing_field:
            return fail(f"{path}: field {idx} missing keys: {', '.join(missing_field)}")
        if not isinstance(field.get("required"), bool):
            return fail(f"{path}: field {idx} required must be boolean")
        label = str(field.get("label", "")).strip()
        if not label:
            return fail(f"{path}: field {idx} label must not be empty")
        label_key = label.lower()
        if label_key in seen_labels:
            return fail(f"{path}: duplicate field label: {label}")
        seen_labels.add(label_key)
        if "id" in field:
            fid = str(field["id"])
            if fid in seen_ids:
                return fail(f"{path}: duplicate field id: {fid}")
            seen_ids.add(fid)
        ftype = str(field.get("type", "")).lower()
        if any(term in ftype or term in label_key for term in HIGH_RISK_FIELD_TYPES):
            high_risk_fields.append(label)
        if "consent" in ftype or "consent" in label_key or "toestemming" in label_key:
            consent_fields.append(label)

    if high_risk_fields and data.get("approval_status") == "applied":
        return fail(f"{path}: applied high-risk config must not be bundled as an already-applied example: {', '.join(high_risk_fields)}")

    if consent_fields and "consent" not in json.dumps(data.get("data_retention_notes", "")).lower():
        return fail(f"{path}: consent fields require consent notes in data_retention_notes")

    if data.get("approval_status") not in APPROVAL_STATES:
        return fail(f"{path}: invalid approval_status: {data.get('approval_status')}")

    for key in ["confirmations", "notifications", "feeds", "required_addons", "risks"]:
        if not isinstance(data.get(key), list):
            return fail(f"{path}: {key} must be a list")

    text = json.dumps(data).lower()
    if any(term in text for term in HIGH_RISK_TERMS) and not data.get("risks"):
        return fail(f"{path}: high-risk config needs explicit risks")

    if data.get("spam_settings") in ({}, None):
        return fail(f"{path}: spam_settings must document a spam stance")
    if data.get("accessibility_settings") in ({}, None):
        return fail(f"{path}: accessibility_settings must document accessibility stance")

    accessibility = json.dumps(data.get("accessibility_settings", {})).lower()
    if "label" not in accessibility:
        return fail(f"{path}: accessibility_settings must mention labels")

    print(f"OK: {path}")
    return 0


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        return fail("usage: validate_form_config.py <config.json|directory> [...]")
    status = 0
    for path in iter_paths(argv[1:]):
        status |= validate(path)
    return status


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
