#!/usr/bin/env bash
set -euo pipefail

# One-run issue creation for Wave 5 documentation audit.
# Usage:
#   bash create-wave5-issues.sh
# Optional env vars:
#   DRY_RUN=true
#   MILESTONE="Documentation Audit Sprint"
#   REPO="lightspeedwp/.github"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BODIES_DIR="$SCRIPT_DIR/bodies"
REPO="${REPO:-lightspeedwp/.github}"
DRY_RUN="${DRY_RUN:-false}"
MILESTONE="${MILESTONE:-}"

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: gh CLI not found in PATH." >&2
  exit 1
fi

if [[ ! -d "$BODIES_DIR/parents" || ! -d "$BODIES_DIR/children" ]]; then
  echo "Error: bodies directory is missing expected structure." >&2
  exit 1
fi

PARENT_01_NUM=""
PARENT_02_NUM=""
PARENT_03_NUM=""
PARENT_04_NUM=""
PARENT_05_NUM=""

CREATED_ISSUES_FILE=""
LABEL_ARGS=()

labels_to_args() {
  local labels_csv="$1"
  IFS=',' read -r -a labels <<<"$labels_csv"
  LABEL_ARGS=()
  for label in "${labels[@]}"; do
    LABEL_ARGS+=("--label" "$label")
  done
}

set_parent_number() {
  local key="$1"
  local number="$2"
  case "$key" in
    PARENT_01) PARENT_01_NUM="$number" ;;
    PARENT_02) PARENT_02_NUM="$number" ;;
    PARENT_03) PARENT_03_NUM="$number" ;;
    PARENT_04) PARENT_04_NUM="$number" ;;
    PARENT_05) PARENT_05_NUM="$number" ;;
    *) echo "Error: unknown parent key $key" >&2; exit 1 ;;
  esac
}

get_parent_number() {
  local key="$1"
  case "$key" in
    PARENT_01) echo "$PARENT_01_NUM" ;;
    PARENT_02) echo "$PARENT_02_NUM" ;;
    PARENT_03) echo "$PARENT_03_NUM" ;;
    PARENT_04) echo "$PARENT_04_NUM" ;;
    PARENT_05) echo "$PARENT_05_NUM" ;;
    *) echo "" ;;
  esac
}

create_issue() {
  local key="$1"
  local title="$2"
  local labels_csv="$3"
  local body_file="$4"

  labels_to_args "$labels_csv"

  local -a cmd=(gh issue create --repo "$REPO" --title "$title" --body-file "$body_file" "${LABEL_ARGS[@]}")
  if [[ -n "$MILESTONE" ]]; then
    cmd+=(--milestone "$MILESTONE")
  fi

  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[DRY_RUN] ${cmd[*]}"
    if [[ "$key" == PARENT_* ]]; then
      case "$key" in
        PARENT_01) set_parent_number "$key" "9001" ;;
        PARENT_02) set_parent_number "$key" "9002" ;;
        PARENT_03) set_parent_number "$key" "9003" ;;
        PARENT_04) set_parent_number "$key" "9004" ;;
        PARENT_05) set_parent_number "$key" "9005" ;;
      esac
    fi
    return 0
  fi

  local url
  url="$("${cmd[@]}")"
  local number="${url##*/}"

  echo "Created #$number - $title"
  if [[ -n "$CREATED_ISSUES_FILE" ]]; then
    printf "%s\t%s\t%s\n" "$number" "$title" "$url" >>"$CREATED_ISSUES_FILE"
  fi

  if [[ "$key" == PARENT_* ]]; then
    set_parent_number "$key" "$number"
  fi
}

render_child_body() {
  local src="$1"
  local parent_key="$2"
  local parent_number
  parent_number="$(get_parent_number "$parent_key")"

  if [[ -z "$parent_number" ]]; then
    echo "Error: parent key $parent_key not created yet." >&2
    exit 1
  fi

  local tmp_file
  tmp_file="$(mktemp "${TMPDIR:-/tmp}/wave5-child-body.XXXXXX.md")"
  sed "s/{{${parent_key}}}/#${parent_number}/g" "$src" >"$tmp_file"
  echo "$tmp_file"
}

PARENTS=(
  "PARENT_01|[Audit] Issue Templates, Automation, & AI Agent Integration|type:audit,area:automation,area:labels,priority:important,status:needs-triage|$BODIES_DIR/parents/01-issue-templates-automation.md"
  "PARENT_02|[Audit] Canonical Config Files (labels, issue-types, issue-fields)|type:audit,area:labels,area:automation,priority:important,status:needs-triage|$BODIES_DIR/parents/02-canonical-configs.md"
  "PARENT_03|[Audit] Documentation Consolidation - Reduce Duplication Across Docs|type:audit,area:documentation,priority:important,status:needs-triage|$BODIES_DIR/parents/03-documentation-consolidation.md"
  "PARENT_04|[Audit] README Files - Mermaid Diagrams & Accessibility Review|type:audit,area:documentation,area:a11y,priority:normal,status:needs-triage|$BODIES_DIR/parents/04-readme-mermaid-a11y.md"
  "PARENT_05|[Audit] File Organization - Align with CLAUDE.md Repository Boundaries|type:audit,area:core,priority:normal,status:needs-triage|$BODIES_DIR/parents/05-file-organisation-alignment.md"
)

CHILDREN=(
  "CHILD_01_1|[Child] Audit: Issue Template Inventory & Standardization|type:audit,area:documentation,priority:normal,status:needs-triage|$BODIES_DIR/children/01-1-template-inventory.md|PARENT_01"
  "CHILD_01_2|[Child] Audit: Issue Template -> Automation Trigger Mapping|type:audit,area:automation,priority:important,status:needs-triage|$BODIES_DIR/children/01-2-template-automation-mapping.md|PARENT_01"
  "CHILD_01_3|[Child] Audit: Issue Labeling Rules in labeler.yml|type:audit,area:labels,area:automation,priority:important,status:needs-triage|$BODIES_DIR/children/01-3-labeler-rules-audit.md|PARENT_01"
  "CHILD_01_4|[Child] Implement: Clear AI Agent Instructions for Issue Creation|type:task,area:automation,priority:important,status:needs-triage|$BODIES_DIR/children/01-4-ai-instructions.md|PARENT_01"

  "CHILD_02_1|[Child] Audit: labels.yml Colour Consistency & Strategy Alignment|type:audit,area:labels,priority:important,status:needs-triage|$BODIES_DIR/children/02-1-labels-colour-consistency.md|PARENT_02"
  "CHILD_02_2|[Child] Audit: Issue Types Alignment with Templates & Labels|type:audit,area:labels,area:automation,priority:important,status:needs-triage|$BODIES_DIR/children/02-2-issue-types-mapping.md|PARENT_02"
  "CHILD_02_3|[Child] Audit: Issue Fields Configuration vs GitHub API|type:audit,area:automation,priority:normal,status:needs-triage|$BODIES_DIR/children/02-3-issue-fields-config.md|PARENT_02"
  "CHILD_02_4|[Child] Document: Canonical Config File Interdependencies|type:task,area:documentation,area:automation,priority:normal,status:needs-triage|$BODIES_DIR/children/02-4-config-relationships.md|PARENT_02"

  "CHILD_03_1|[Child] Audit: Issue Creation Docs - Consolidate Overlapping Files|type:audit,area:documentation,priority:important,status:needs-triage|$BODIES_DIR/children/03-1-issue-creation-docs.md|PARENT_03"
  "CHILD_03_2|[Child] Audit: PR Creation Docs - Consolidate Overlapping Files|type:audit,area:documentation,priority:important,status:needs-triage|$BODIES_DIR/children/03-2-pr-creation-docs.md|PARENT_03"
  "CHILD_03_3|[Child] Audit: Labeling Docs - Consolidate Overlapping Files|type:audit,area:documentation,area:labels,priority:important,status:needs-triage|$BODIES_DIR/children/03-3-labelling-docs.md|PARENT_03"
  "CHILD_03_4|[Child] Audit: Documentation Folder Structure vs CLAUDE.md Boundaries|type:audit,area:documentation,area:core,priority:normal,status:needs-triage|$BODIES_DIR/children/03-4-file-organisation-alignment-docs.md|PARENT_03"
  "CHILD_03_5|[Child] Update: Documentation Index (docs/index.md) - Complete & Current|type:task,area:documentation,priority:normal,status:needs-triage|$BODIES_DIR/children/03-5-update-docs-index.md|PARENT_03"

  "CHILD_04_1|[Child] Audit: Discover All README.md Files - Inventory|type:audit,area:documentation,priority:normal,status:needs-triage|$BODIES_DIR/children/04-1-discover-readmes.md|PARENT_04"
  "CHILD_04_2|[Child] Audit: Validate Mermaid Syntax in All Diagrams|type:audit,area:documentation,priority:normal,status:needs-triage|$BODIES_DIR/children/04-2-validate-mermaid-syntax.md|PARENT_04"
  "CHILD_04_3|[Child] Audit: Mermaid Diagram Accessibility (WCAG AA, Light/Dark)|type:audit,area:documentation,area:a11y,priority:normal,status:needs-triage|$BODIES_DIR/children/04-3-mermaid-accessibility.md|PARENT_04"
  "CHILD_04_4|[Child] Update: Fix & Refresh README Files with Current Information|type:task,area:documentation,area:a11y,priority:normal,status:needs-triage|$BODIES_DIR/children/04-4-update-readmes.md|PARENT_04"

  "CHILD_05_1|[Child] Audit: Current File Organization vs CLAUDE.md Boundaries|type:audit,area:core,priority:normal,status:needs-triage|$BODIES_DIR/children/05-1-current-vs-planned.md|PARENT_05"
  "CHILD_05_2|[Child] Audit: Agent & Script Files - Migration Status|type:audit,area:core,priority:normal,status:needs-triage|$BODIES_DIR/children/05-2-agent-script-locations.md|PARENT_05"
  "CHILD_05_3|[Child] Plan: File Organization Refactoring - Migration & Validation|type:task,area:core,priority:normal,status:needs-triage|$BODIES_DIR/children/05-3-migration-plan.md|PARENT_05"
)

if [[ "$DRY_RUN" == "false" ]]; then
  CREATED_ISSUES_FILE="$SCRIPT_DIR/created-issues-$(date +%Y%m%d-%H%M%S).tsv"
  printf "number\ttitle\turl\n" >"$CREATED_ISSUES_FILE"
fi

echo "Creating parent issues..."
for row in "${PARENTS[@]}"; do
  IFS='|' read -r key title labels body <<<"$row"
  create_issue "$key" "$title" "$labels" "$body"
done

echo "Creating child issues..."
for row in "${CHILDREN[@]}"; do
  IFS='|' read -r key title labels body parent_key <<<"$row"
  temp_body="$(render_child_body "$body" "$parent_key")"
  create_issue "$key" "$title" "$labels" "$temp_body"
  rm -f "$temp_body"
done

if [[ "$DRY_RUN" == "false" ]]; then
  echo
  echo "Creation complete. Parent issues:"
  echo "  PARENT_01 -> #$PARENT_01_NUM"
  echo "  PARENT_02 -> #$PARENT_02_NUM"
  echo "  PARENT_03 -> #$PARENT_03_NUM"
  echo "  PARENT_04 -> #$PARENT_04_NUM"
  echo "  PARENT_05 -> #$PARENT_05_NUM"
  echo "Saved creation summary: $CREATED_ISSUES_FILE"
else
  echo "DRY_RUN complete. No issues created."
fi
