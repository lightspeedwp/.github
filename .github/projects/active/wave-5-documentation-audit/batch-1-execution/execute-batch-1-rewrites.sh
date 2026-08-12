#!/bin/bash

# Wave 5 Batch 1 GitHub Issue Rewrite Script
# Updates 5 critical issues (#904, #916-920) with Phase 3-aligned content
#
# Location: .github/projects/active/wave-5-documentation-audit/batch-1-execution/
# Usage: bash execute-batch-1-rewrites.sh [--dry-run|--execute]
#
# This script updates:
# - #904: Documentation Consolidation (parent)
# - #916: Issue Creation Docs Consolidation
# - #917: PR Creation Docs Consolidation
# - #918: Labeling Docs Consolidation
# - #920: Documentation Index

set -e

# Change to script directory to ensure relative paths work
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

REPO="lightspeedwp/.github"
DRY_RUN=${1:-"--dry-run"}

echo "=== Wave 5 Batch 1 GitHub Issue Rewrite Script ==="
echo "Repository: $REPO"
echo "Mode: $DRY_RUN"
echo ""

# Function to update issue
update_issue() {
    local issue_num=$1
    local body_file=$2
    local title=$3

    if [ "$DRY_RUN" == "--dry-run" ]; then
        echo "📋 [DRY RUN] Would update issue #$issue_num"
        echo "   Title: $title"
        echo "   Body file: $body_file"
        echo "   File size: $(wc -l < "$body_file") lines"
        echo ""
    else
        echo "🔄 Updating issue #$issue_num..."
        gh issue edit $issue_num \
            --title "$title" \
            --body "$(cat "$body_file")" \
            --repo "$REPO"
        echo "✅ Issue #$issue_num updated"
        echo ""
    fi
}

# Issue #904: Documentation Consolidation
update_issue 904 \
    "batch-1-issue-904-new-body.md" \
    "[Phase 3B] Documentation Consolidation - Reduce Duplication Across Docs"

# Issue #916: Issue Creation Docs Consolidation
update_issue 916 \
    "batch-1-issue-916-new-body.md" \
    "[Phase 3B Task 1] Issue Creation Docs - Consolidate Overlapping Files"

# Issue #917: PR Creation Docs Consolidation
update_issue 917 \
    "batch-1-issue-917-new-body.md" \
    "[Phase 3B Task 2] PR Creation Docs - Consolidate Overlapping Files"

# Issue #918: Labeling Docs Consolidation
update_issue 918 \
    "batch-1-issue-918-new-body.md" \
    "[Phase 3B Task 3] Labeling Docs - Consolidate Overlapping Files"

# Issue #920: Documentation Index
update_issue 920 \
    "batch-1-issue-920-new-body.md" \
    "[Phase 3D] Documentation Index (docs/index.md) - Complete & Current"

echo ""
if [ "$DRY_RUN" == "--dry-run" ]; then
    echo "=== DRY RUN COMPLETE ==="
    echo "To apply these changes, run:"
    echo "  bash execute-batch-1-rewrites.sh --execute"
else
    echo "=== BATCH 1 REWRITE COMPLETE ==="
    echo "✅ All 5 issues updated successfully"
fi
