# Skill routing guide

Use this guide to choose the right specialist workflow before producing a deliverable.

## Routing order

Choose the most upstream blocking workflow first:

1. onboarding or scenario intake
2. page or content intake
3. voice and tone strategy
4. conversion-goal strategy
5. content collection
6. FAQ intake
7. stats intake
8. claim register
9. drafting workflow
10. formatting validation

Do not skip to drafting when an upstream strategy or evidence step is still materially missing.

## Skill boundaries

### website-content-onboarding-intake

Use for new project or scenario setup when the agent still needs the minimum routing context.

Do not use for detailed page strategy, voice work, or conversion mapping.

### universal-page-content-intake

Use when a page or structured content task is missing core context such as purpose, audience, CTA route, or template family.

Do not use when the request is really about brand personality, audience flow, or proof validation.

### voice-and-tone-strategist

Use when brand personality, wording guardrails, or tone shifts need to be defined before drafting.

Do not use when the voice system is already settled and the task is only page planning or formatting.

### conversion-goal-strategist

Use when audience intent, user flow, page contribution, CTA model, or conversion role still needs definition.

Do not use when the conversion logic is already clear and the task is only normal drafting.

### content-collection-planner-extended

Use when the main need is collecting inputs, defining dependencies, requesting materials, or building a source-of-truth plan.

Do not use when the main need is voice strategy, conversion strategy, or claim validation.

### faq-intake-claim-mapper

Use when a website page needs its five FAQ planning slots defined or when FAQ answers may affect trust, objections, routing, or claims.

Do not use for broad FAQ consolidation across many pages when chatbot-safe curation is the main task.

### stats-evidence-intake

Use when a page depends on approved figures, proof numbers, ratings, review counts, or quantified trust signals.

Do not use when safer non-numeric proof is already clearly the right path and no real stats should be used.

### claim-register-builder

Use when claims, proof, FAQ answers, or stats need evidence tracking, approval handling, or rewrite guidance before publication.

Do not use as a replacement for source collection or page drafting.

### website-pages-builder

Use when the deliverable is a standard website page and the appropriate template family already exists.

Do not use when the task is still upstream strategy or intake.

### lightspeed-website-content-generator-editable

Use for drafting structured website content when the strategic context and evidence handling are already strong enough.

Do not use as a substitute for FAQ intake, stats intake, or claim validation.

### newsletter-content-planner

Use when the deliverable is newsletter strategy or newsletter copy.

### forms-and-email-responder-planner

Use when the deliverable is a form structure, validation plan, admin notification, or user responder email.

### policies-creation-skill

Use when the deliverable is a policy, governance, principles, or legal-style page.

### markdown-formatting-validator

Use after the main deliverable exists and the output needs strict structural cleanup or validation.

## Strategy-first rule

When voice, tone, audience, user flow, CTA logic, FAQ sensitivity, or stats evidence would materially change the content, route to the relevant upstream skill before drafting.

## Claim-sensitive rule

When FAQs or stats include factual, comparative, trust, policy, guarantee, or performance wording, route them into the claim register before final publication.

## Maintenance note

Use `prompts/validate-skills-routing-and-directory-prompt.md` to audit routing drift against the current attached skills, instructions, and grounded files. If that audit finds grounded issues to fix, follow with `prompts/repair-skills-routing-and-directory-prompt.md` for a conservative repair pass.
