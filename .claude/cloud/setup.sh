#!/bin/bash
# LightSpeed cloud environment — setup script
#
# Canonical copy of the script pasted into the "Setup script" field of the
# LightSpeed cloud environment at claude.ai/code. See docs/CLAUDE_CLOUD_ENVIRONMENT.md.
#
# How it runs (https://code.claude.com/docs/en/cloud-environments#setup-scripts):
#   - As root on Ubuntu 24.04, BEFORE Claude Code launches.
#   - Only when the environment cache is (re)built: first session, after the
#     script or allowed hosts change, or roughly every 7 days. The filesystem is
#     then snapshotted, so later sessions skip this script entirely.
#   - Must exit 0 and finish in under ~5 minutes.
#
# Because it does not run on every session and may run before the repository is
# cloned, it only provisions the VM (tools + global git defaults). Per-session
# work — branch naming, npm install — lives in the repo's SessionStart hook
# (.claude/hooks/session-start.sh), which runs on every session.

set -uo pipefail

log() { printf '==> [setup] %s\n' "$*"; }

NODE_VERSION="${LS_NODE_VERSION:-24.20.0}" # keep in step with .nvmrc

# ── 1. Node.js matching .nvmrc ───────────────────────────────────────────────
# The image ships Node 22 on PATH via /opt/node22/bin. /root/.local/bin comes
# earlier on PATH, so symlinking Node there makes it the default.
install_node() {
  local dir="/opt/node${NODE_VERSION%%.*}"
  local tarball="node-v${NODE_VERSION}-linux-x64.tar.xz"
  # The directory is keyed by major version, so also check the exact version:
  # a bump within the same major must replace the cached binary.
  if [ ! -x "${dir}/bin/node" ] || [ "$("${dir}/bin/node" -v 2>/dev/null)" != "v${NODE_VERSION}" ]; then
    log "Installing Node ${NODE_VERSION}"
    rm -rf "${dir}"
    if ! { curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/${tarball}" -o "/tmp/${tarball}" &&
      mkdir -p "${dir}" &&
      tar -xJf "/tmp/${tarball}" -C "${dir}" --strip-components=1; }; then
      log "Node ${NODE_VERSION} install failed; keeping image default"
      return 0
    fi
    rm -f "/tmp/${tarball}"
  fi
  mkdir -p /root/.local/bin
  for bin in node npm npx corepack; do
    ln -sf "${dir}/bin/${bin}" "/root/.local/bin/${bin}"
  done
  log "Node $("${dir}/bin/node" -v) is the default"
}

# ── 2. Linters used by CI but not pre-installed ──────────────────────────────
install_linters() {
  log "Installing shellcheck"
  { apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq shellcheck; } >/dev/null 2>&1 ||
    log "shellcheck install failed (non-fatal)"

  # actionlint via the Go module proxy (GitHub release assets from repos not
  # attached to the session return 403 through the GitHub proxy).
  log "Installing actionlint"
  GOBIN=/usr/local/bin go install github.com/rhysd/actionlint/cmd/actionlint@latest >/dev/null 2>&1 ||
    log "actionlint install failed (non-fatal)"
}

install_node &
install_linters &
wait

# ── 3. Global git defaults for the branching strategy ────────────────────────
# System-level so they survive the per-session ~/.gitconfig the platform writes.
log "Configuring git defaults"
git config --system init.defaultBranch develop
git config --system push.autoSetupRemote true
git config --system fetch.prune true
git config --system pull.rebase false
git config --system merge.conflictstyle zdiff3

log "Done"
exit 0
