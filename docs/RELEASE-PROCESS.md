# Release Process (develop → main)

1. Work on `develop`.
2. Run **Release Agent** (optionally with `--scope` for partial releases).
3. Open Release PR → **lint gate must pass** (`lint.yml` required check).
4. On green, merge to `main`. Tag is created/pushed by the agent.
5. Post-merge: confirm `VERSION` & docs have no drift (`--verify`).

_This document is authoritative for gates and branch flow._
