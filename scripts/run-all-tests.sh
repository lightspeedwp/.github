#!/usr/bin/env bash
# run-all-tests.sh - Run all Bats and Jest tests for LightSpeed WP automation
# Usage: ./run-all-tests.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Run Bats tests (utility)
echo "Running Bats tests in tests/utility..."
bats tests/utility || { echo "Bats tests failed"; exit 1; }

# Run Jest tests
echo "Running Jest tests..."
npx jest --passWithNoTests || { echo "Jest tests failed"; exit 1; }

echo "All tests completed successfully."
