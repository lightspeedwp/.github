# Reference refresh protocol

Use this protocol when refreshing Yoast reference data or preparing the skill for proposal, launch or developer use.

## Refresh levels

| Level | Use when | Files touched | Validation |
|---|---|---|---|
| Level 1: targeted verification | One product, feature or API claim needs checking | `references/source-register.md` plus one reference file | Source register validation |
| Level 2: reference refresh | A product area has changed or a deep research batch was run | Source register plus affected reference, profile, QA and template files | Source register, reference data and scenario tests |
| Level 3: package release | Skill routing, folder structure, scripts or schemas changed | `SKILL.md`, docs, tests, scripts, changelog and affected content | All validators and package validation |

## Refresh workflow

1. Define the decision being refreshed: product scope, setting behaviour, feature output, schema, WooCommerce, developer API, QA, or template.
2. Open the highest-priority official source first.
3. Record title, URL, accessed date, source type, key facts, configuration relevance, developer relevance, limitations, duplicate status and confidence in `references/source-register.md`.
4. Update only the reference files directly supported by the scanned source.
5. Mark uncertain outcomes as `needs live verification`, `inference`, or `unclear from available sources`.
6. Update affected scenario tests if the expected answer or routing changes.
7. Run validators and record results in `docs/changelog.md`.

## Required checks before release

```bash
python3 scripts/validate_source_register.py references/source-register.md
python3 scripts/validate_reference_data.py .
python3 scripts/validate_skill_structure.py .
python3 scripts/generate_qa_checklist.py --profile standard-business
python3 scripts/generate_qa_checklist.py --profile woocommerce
```

Then run the Skill Creator packaging validator and confirm `skill.zip` can be opened.

## Refresh boundaries

- Do not perform broad research when a narrow verification will answer the task.
- Do not rewrite reference files from memory when the source register remains unverified.
- Do not add secondary sources until the relevant Yoast, Google, Schema.org, WordPress or WooCommerce official source has been checked or found insufficient.
- Do not add bulky files, screenshots or exports to the skill package; summarise them into text references instead.

---

*🧭 Your compass through the documentation landscape*
