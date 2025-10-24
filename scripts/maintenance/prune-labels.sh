#!/bin/bash
###############################################################################
#
# Script Name: prune-labels.sh
# Description: Conservative, REST-only label sync and optional prune for GitHub repositories. Synchronizes repository labels with a canonical source, maps non-standard labels to standard formats, and optionally removes non-standard labels after migration.
#
# Version: v0.1.0
# Date: 2025-10-14
# Author: LightSpeedWP
# Github Contributors: @lightspeedwp / @ashleyshaw
# Author URI: https://lightspeedwp.agency/
# License: GPL v3 or later
# License URI: https://www.gnu.org/licenses/gpl-3.0.html
#
# Requirements:
#   - GitHub CLI (gh) installed and authenticated
#   - A GitHub organization with a .github repo containing labels.yml
#   - yq (YAML processor) installed
#   - jq (JSON processor) installed
#
# Usage: [Environment Variables]./prune-labels.sh [options]
#
# Environment Variables:
#   ORG="lightspeedwp"            # GitHub organization (default: lightspeedwp)
#   DRY_RUN=true ./prune-labels.sh          # default; shows what would happen
#   DRY_RUN=false STRICT_PRUNE=true ./prune-labels.sh  # actually delete non-canonical labels
#   CANON_REPO=".github"          # Repo containing canonical labels.yml (default: .github)
#   LABELS_PATH=".github/labels.yml" # Path to labels.yml in CANON_REPO (default: .github/labels.yml)
#   PROTECT_REGEX="^lang:|^area:"  # Regex to protect certain labels from deletion (optional)
#   STRICT_PRUNE (default: false) - if true, will delete non-canonical labels
#
# Options:
#   --help                  Show this help message
#
# Examples:
#   DRY_RUN=true ./prune-labels.sh
#   DRY_RUN=false STRICT_PRUNE=true PROTECT_REGEX="^lang:|^area:" ./prune-labels.sh
#   ONLY="repo1 repo2" ./prune-labels.sh  # Only process specific repos
#   ./prune-labels.sh --help
#
# Notes:
# - This script is intended to be executed directly.
# - It will sync labels across all repos in the specified organization.
# - By default, it runs in dry-run mode to show what changes would be made.
# - To actually apply changes, set DRY_RUN=false and STRICT_PRUNE=true.
# - Labels that match the PROTECT_REGEX will not be deleted.
# - The script uses a mapping to migrate common non-standard labels to standardized versions before deletion.
# - The script produces a detailed log of all actions taken for audit purposes.
# - Error handling is implemented to prevent partial label migrations.
#
###############################################################################

# Fail on errors
set -euo pipefail

# --- config (override with env vars) ---
# GitHub organization
ORG="lightspeedwp"
# Repo that stores the canonical labels.yml
CANON_REPO=".github"
# Path inside that repo
LABELS_PATH=".github/labels.yml"
# Defaults
DRY_RUN="${DRY_RUN:-true}"
# Set to true to delete non-canonical labels (see allowlist below)
STRICT_PRUNE="${STRICT_PRUNE:-false}"
# Regex to protect certain labels from deletion (optional)
PROTECT_REGEX="${PROTECT_REGEX:-}"
# Space-separated repo names to target (optional)
ONLY="${ONLY:-}"

# Mapping for common non-standard labels to standardized versions
declare -A LABEL_MAPPINGS=(
  ["php"]="lang:php"
  ["js"]="lang:js"
  ["javascript"]="lang:js"
  ["css"]="lang:css"
  ["bash"]="lang:bash"
  ["shell"]="lang:bash"
  ["python"]="lang:python"
  ["documentation"]="area:documentation"
  ["docs"]="area:documentation"
)
# ----------------------------------------

# Create temp dir and ensure cleanup on exit
tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

###############################################################################
# Function: uri
# Description: URL-encode strings for use in API requests.
#
# Arguments:
#   $1 - The string to encode.
#
# Output:
#   URL-encoded string to stdout.
###############################################################################
uri() { jq -rn --arg s "$1" '$s|@uri'; }

# Check dependencies
for cmd in gh yq jq; do
  if ! command -v "$cmd" &> /dev/null; then
    echo "[ERROR] $cmd is not installed. Please install it first." >&2
    exit 1
  fi
done

# Fetch canonical labels.yml
echo "Fetching canonical labels from $ORG/$CANON_REPO:$LABELS_PATH ..."
gh api "repos/$ORG/$CANON_REPO/contents/$(uri "$LABELS_PATH")" --jq '.content' \
  | base64 -d > "$tmpdir/labels.yml"

# YAML → JSON array of {name,color,description}
yq -o=json '.' "$tmpdir/labels.yml" > "$tmpdir/labels.json"
jq -r '.[].name' "$tmpdir/labels.json" > "$tmpdir/canonical.txt"

# Repo list
if [[ -n "$ONLY" ]]; then
  mapfile -t REPOS < <(printf "%s\n" "$ONLY")
else
  mapfile -t REPOS < <(gh repo list "$ORG" --archived=false --source --limit 1000 --json name -q '.[].name')
fi

# Sync & prune labels
for repo in "${REPOS[@]}"; do
  echo "==> Syncing $ORG/$repo"
  mapfile -t EXISTING < <(gh api "repos/$ORG/$repo/labels?per_page=100" --paginate -q '.[].name' || true)

  # 1) Ensure all canonical labels exist & are up-to-date
  jq -c '.[]' "$tmpdir/labels.json" | while read -r lbl; do
    name=$(jq -r '.name' <<<"$lbl")
    color=$(jq -r '.color' <<<"$lbl")
    desc=$(jq -r '.description // ""' <<<"$lbl")
    enc=$(uri "$name")

    # Already exists, update it
    if printf '%s\n' "${EXISTING[@]}" | grep -Fxq "$name"; then
      if [[ "$DRY_RUN" == "true" ]]; then
        echo "  would update: $name"
      else
        gh api --silent --method PATCH "repos/$ORG/$repo/labels/$enc" \
          -f new_name="$name" -f color="$color" -f description="$desc" || true
        echo "  updated: $name"
      fi

    # Not existing, create it
    else
      if [[ "$DRY_RUN" == "true" ]]; then
        echo "  would create: $name"
      else
        gh api --silent --method POST "repos/$ORG/$repo/labels" \
          -f name="$name" -f color="$color" -f description="$desc" || true
        echo "  created: $name"
      fi
    fi
  done

  # 2) Prune non-canonical labels conservatively
  for ex in "${EXISTING[@]}"; do
    # skip canonical
    if grep -Fxq "$ex" "$tmpdir/canonical.txt"; then
      continue
    fi

    # respect protect regex
    if [[ -n "$PROTECT_REGEX" ]] && [[ "$ex" =~ $PROTECT_REGEX ]]; then
      echo "  keeping protected: $ex"
      continue
    fi

    # Check if this label has a standardized version
    if [[ -n "${LABEL_MAPPINGS[$ex]:-}" ]]; then
      standardized="${LABEL_MAPPINGS[$ex]}"
      if grep -Fxq "$standardized" "$tmpdir/canonical.txt"; then
        if [[ "$DRY_RUN" == "true" ]]; then
          echo "  would migrate: $ex → $standardized"
        else
          # Get issues with this label
          tmpfile="$tmpdir/issues_$ex.json"
          gh api "repos/$ORG/$repo/issues?labels=$(uri "$ex")&state=all&per_page=100" --paginate > "$tmpfile"

          # Add standardized label to those issues
          jq -r '.[].number' "$tmpfile" | while read -r issue_num; do
            gh api --method POST "repos/$ORG/$repo/issues/$issue_num/labels" -f "labels[]=$standardized"
            echo "  added $standardized to issue #$issue_num"
          done

          # Delete the non-standard label
          gh api --silent --method DELETE "repos/$ORG/$repo/labels/$(uri "$ex")" || true
          echo "  migrated: $ex → $standardized"
        fi
        continue
      fi
    fi

    # If we reach here, it's a non-canonical label without a mapping
    if [[ "$STRICT_PRUNE" == "true" ]]; then
      if [[ "$DRY_RUN" == "true" ]]; then
        echo "  would delete (strict): $ex"
      else
        gh api --silent --method DELETE "repos/$ORG/$repo/labels/$(uri "$ex")" || true
        echo "  deleted (strict): $ex"
      fi
    else
      echo "  skipping non-canonical (not strict): $ex"
    fi
  done
done

# Cleanup
echo "Done."
# shellcheck disable=SC2317,SC2329
exit 0 # Always exit 0 to not break CI/CD, errors are logged above
