# Minimal agent stub (Python)
# last_updated: 2025-10-17

import os, json, sys

def run_agent(dry_run=True):
    config = {
        "model": os.environ.get("AGENT_MODEL", "auto"),
        "instructionsPath": os.environ.get("AGENT_INSTRUCTIONS", "./AGENTS.md"),
        "connectors": []  # TODO: register MCP connectors
    }
    if dry_run:
        print("[agent] dry-run", json.dumps(config, indent=2))
        return
    print("[agent] TODO implement task runner")

if __name__ == "__main__":
    run_agent(dry_run=("--dry-run" in sys.argv))
