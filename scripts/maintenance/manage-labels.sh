#!/usr/bin/env bash
set -euo pipefail

USAGE="Usage: $0 --token <gh_token> [--org <org>] [--repo <repo>] [--dry-run] [--prune]"
# TODO: document inputs, precedence, and examples.

PRUNE=false
DRY=false
ORG=""
REPO=""
TOKEN=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --token) TOKEN="$2"; shift 2 ;;
    --org) ORG="$2"; shift 2 ;;
    --repo) REPO="$2"; shift 2 ;;
    --dry-run) DRY=true; shift ;;
    --prune) PRUNE=true; shift ;;
    *) echo "Unknown arg: $1"; echo "$USAGE"; exit 1 ;;
  esac
done

# TODO: read canonical labels from .github/automation/labels.yml
# Apply: create/update labels
# If $PRUNE, remove labels not in canonical set (respect deprecations list).
# Honour $DRY to only print planned changes.

echo "[INFO] Manage labels (org=$ORG repo=$REPO dry=$DRY prune=$PRUNE)"
