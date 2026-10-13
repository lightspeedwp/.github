"""Run one Qodo PR-Agent tool against a PR without publishing, and keep its result.

PR-Agent 0.46.0's CLI accepts --output and --json-output only in plain-diff mode,
and with config.publish_output=false it prints nothing. The tools that support a
non-publishing run (review, describe, improve) store their Markdown result in
get_settings().data["artifact"] instead, so this adapter calls the agent directly
and writes that artifact to a file. A tool that stores no artifact (ask, for
example) leaves the file absent, and the runner reports no-output.

Usage (inside the pinned image): python pr_mode_adapter.py <out.md> <pr_url> <tool> [args...]
"""

import asyncio
import os
import sys

# Run as a script, Python puts this file's directory on sys.path; `-m pr_agent.cli`
# would put the image's working directory there instead. Match that, so pr_agent
# imports whether the image installs it or serves it from its working directory.
sys.path.insert(0, os.getcwd())

from pr_agent.agent.pr_agent import PRAgent
from pr_agent.config_loader import get_settings


def main() -> int:
    """Run the request, write any stored artifact, and return the process exit code."""
    # Usage is checked before unpacking, so a short command line prints the
    # documented line instead of raising "not enough values to unpack". 64 is
    # EX_USAGE and matches the sibling runner's convention for a usage error.
    if len(sys.argv) < 4:
        print(
            "Usage: python pr_mode_adapter.py <out.md> <pr_url> <tool> [args...]",
            file=sys.stderr,
        )
        return 64
    out_md, pr_url, *request = sys.argv[1:]
    get_settings().set("CONFIG.CLI_MODE", True)
    # This adapter must never publish. `publish_output=false` is not enough on its
    # own: PR-Agent 0.46.0 loads repository settings before the request's own
    # overrides are applied, and its configuration-error handler calls
    # `publish_persistent_comment` without consulting `publish_output`
    # (pr_agent/git_providers/utils.py). A malformed `.pr_agent.toml` on the
    # repository would therefore still post a comment from a non-publishing run.
    # Turning off repository settings loading removes that path: the error
    # handler is reached from the repo-config loader, which no longer runs.
    get_settings().set("CONFIG.USE_REPO_SETTINGS_FILE", False)
    result = asyncio.run(PRAgent().handle_request(pr_url, request))

    data = get_settings().get("data") or {}
    artifact = data.get("artifact") if isinstance(data, dict) else None
    if isinstance(artifact, str) and artifact.strip():
        with open(out_md, "w", encoding="utf-8") as handle:
            handle.write(artifact)

    return 1 if result is False else 0


if __name__ == "__main__":
    sys.exit(main())
