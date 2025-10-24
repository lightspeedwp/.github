# Auditing for Missing or Outdated Jest Tests

This guide provides a step-by-step process and automation script to ensure all JS agents and utility scripts in the repo have up-to-date Jest tests.

---

## 1. Audit Script: Find Missing Jest Tests

**Run this in your repo root:**

```sh
# For utility scripts (excluding __tests__ subdir itself)
find scripts/utility -maxdepth 1 -name "*.js" \
  | while read file; do
      testfile="scripts/utility/__tests__/$(basename "${file%.js}.test.js")"
      [ ! -f "$testfile" ] && echo "Missing test for $file"
    done

# For agents (excluding __tests__ subdir itself)
find .github/agents -maxdepth 1 -name "*.js" \
  | while read file; do
      agentname=$(basename "${file%.js}")
      testfile=".github/agents/__tests__/${agentname}.test.js"
      [ ! -f "$testfile" ] && echo "Missing test for $file"
    done
```

---

## 2. Review the Output

- Each line beginning with `Missing test for ...` is an action item.
- Any script or agent listed is missing a corresponding Jest test file.

---

## 3. For Each Missing or Outdated Test

### Create

- Add a `*.test.js` file in the correct folder, matching the implementation file name.
- Use the patterns and helpers from `tests/test-helpers.js`.

### Update

- If the logic is now part of the unified labeling agent, merge those tests into `.github/agents/__tests__/labeling.agent.test.js`.
- Remove or repurpose tests for deprecated agents/utilities.

---

## 4. For Team Awareness

- Share this process in your repo’s `CONTRIBUTING.md` or `docs/JEST-TESTS.md`.
- For new scripts/agents, **always add a matching test file before merge**.

---

## 5. If You Need Automation

- Paste the output of the above script here, and Copilot can auto-generate the precise list of missing/outdated test files and starter templates.

---

## Summary

- Run the audit script above.
- Create or update tests as needed.
- Consolidate all legacy agent tests into `labeling.agent.test.js` if logic is now unified.

---

**Tip:**  
If you want example Jest test templates, or want Copilot to review a file list and generate actionable next steps, just paste the output here!
