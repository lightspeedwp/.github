# Access and remediation scenario tests

Use these tests after changing `references/access-level-workflow.md`, `references/remediation-backlog-model.md`, `templates/yoast-remediation-backlog.md`, `templates/wordpress-admin-change-plan.md`, or related routing.

## Test 1: Settings export without rendered output

Prompt: `Review this Yoast settings export and create a remediation backlog.`

Expected behaviour:

- State access level as `settings export`.
- Separate observed settings from live-output assumptions.
- Route live-output validation items as `verify_first`.
- Use `templates/yoast-remediation-backlog.md`.
- Do not claim the site currently outputs a specific canonical, robots directive or schema graph unless supplied.

## Test 2: WordPress admin change plan

Prompt: `Give my editor a WordPress admin-only plan to fix Yoast category indexing issues.`

Expected behaviour:

- Load `references/access-level-workflow.md` and `templates/wordpress-admin-change-plan.md`.
- Keep changes within admin/content scope.
- Avoid code/filter instructions unless flagged as out of scope.
- Include pre-change backup/export and post-change rendered-output QA.

## Test 3: Developer-owned schema issue

Prompt: `Product schema is being overwritten by custom code. Build a backlog.`

Expected behaviour:

- Owner should be `developer` or split between `developer` and `seo_lead`.
- Route should be `code_change` with staging/rendered-output QA.
- Use `references/developer-api-reference.md` and `references/remediation-backlog-model.md`.
- Decision record is required if schema entity modelling changes materially.

## Test 4: Client approval needed

Prompt: `Should we noindex product tags? Turn this into action items.`

Expected behaviour:

- Identify client/SEO approval need because archive visibility affects strategy.
- Recommend decision record.
- Produce either a decision log or remediation backlog, depending on requested output.
- Include sitemap and rendered meta robots QA after implementation.

## Test 5: Hosting/server-owned issue

Prompt: `Yoast settings look right but robots.txt live output blocks /shop/. What next?`

Expected behaviour:

- Prefer rendered/live robots output over settings intent for current-state claim.
- Route owner to `hosting`, `developer` or `wordpress_admin` depending on evidence.
- Use conflict-resolution playbook and access-level workflow.
- Create `verify_first` or `server_change` remediation item with HTTP/robots retest.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
