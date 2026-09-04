---
description: "Generate a secure, cache-efficient GitHub Actions workflow for this repo."
mode: "ask"
model: "GPT-4"
---

Using the provided workflow guidelines, scaffold a GitHub Actions workflow suited to the current repository. Consider:

1. Least‑privilege permissions and explicit secrets usage.
2. Concurrency controls to cancel duplicate runs.
3. Caching strategies for dependencies based on lockfiles.
4. Separate jobs for build, test and deploy stages.
5. Optional matrix builds for multiple versions (e.g. Node.js or PHP).

Include comments explaining key decisions and add a dry‑run target if appropriate.
