#!/usr/bin/env bash
# Minimal agent stub (Shell)
# last_updated: 2025-10-17

set -euo pipefail
MODEL="${AGENT_MODEL:-auto}"
INSTR="${AGENT_INSTRUCTIONS:-./AGENTS.md}"

if [[ "${1:-}" == "--dry-run" ]]; then
  echo "[agent] dry-run model=$MODEL instructions=$INSTR"
  exit 0
fi

echo "[agent] TODO implement task runner"
