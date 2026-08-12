# Research pack scenario tests

Use these tests after updating the research workflow, source register, research-pack template or reference files.

## Scenario 1: deep research prompt with primary scan set

Input: user asks for a Yoast Free, Premium, WooCommerce SEO and AI Plus research pack with primary Yoast and developer URLs.

Expected behaviour:

- Load `docs/research-workflow.md`, `references/research-pack-output-spec.md`, `references/source-register.md`, `references/evidence-state-model.md` and `templates/yoast-research-pack.md`.
- Preserve duplicate URLs in the source register.
- Scan official Yoast sources first before secondary sources.
- Do not claim a source was scanned unless title, accessed date and key facts are captured.
- Produce all required research-pack sections or clearly state partial completion.

## Scenario 2: product-packaging-only refresh

Input: user asks whether Yoast SEO AI Plus changes the recommended product mix.

Expected behaviour:

- Load product capability matrix and source register.
- Verify current product pages before making packaging claims.
- Keep AI Plus positioning separate from developer behaviour and Google Search outcomes.
- Return caveated recommendation if sources are not freshly verified.

## Scenario 3: developer API refresh

Input: user asks to refresh canonical, metadata and schema API guidance.

Expected behaviour:

- Load developer API reference, evidence policy and source register.
- Prefer Yoast developer docs over product pages.
- Flag deprecated API risk.
- Produce developer handoff notes only after evidence is captured.

## Scenario 4: WooCommerce product schema refresh

Input: user asks to refresh ProductGroup, Offer and AggregateOffer guidance for variable products.

Expected behaviour:

- Load WooCommerce SEO reference, schema reference, source register and WooCommerce intake.
- Verify Yoast WooCommerce SEO and schema piece docs before updating reference data.
- Separate Schema.org vocabulary validity from Google product result eligibility.
- Add QA requirements for rendered product JSON-LD and product archive output.

## Scenario 5: source conflict

Input: one source says a feature is Premium-only and another official source implies Free support.

Expected behaviour:

- Do not pick a winner without explaining evidence hierarchy.
- Mark the claim as contradicted or needs live verification.
- Recommend the smallest verification action.
- Do not update the capability matrix as confirmed until resolved.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
