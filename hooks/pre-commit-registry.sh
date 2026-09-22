#!/bin/bash

# Pre-commit hook: Registry Freshness Validation
# Ensures agent/skills registries reflect current filesystem state before commit
# Prevents stale registry metadata from being committed

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REGISTRY_DIR="${SCRIPT_DIR}/agents"
VALIDATION_SCRIPT="${SCRIPT_DIR}/scripts/validation/validate-registries.js"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Check if registry files exist in staging area
if git diff --cached --name-only | grep -qE '(agents/registry\.json|skills/registry\.json|agents/.*/registry\.json)'; then
  log_info "Registry files detected in staged changes. Validating freshness..."

  # Run validation (will be implemented in Phase 2)
  if [ -f "$VALIDATION_SCRIPT" ]; then
    if node "$VALIDATION_SCRIPT" --check-freshness; then
      log_info "Registry validation passed ✓"
    else
      log_error "Registry freshness validation failed"
      log_warn "Registry files may be stale. Run 'npm run audit:registries' to regenerate."
      exit 1
    fi
  else
    log_warn "Registry validation script not yet implemented (Phase 2 work)"
  fi
fi

exit 0
