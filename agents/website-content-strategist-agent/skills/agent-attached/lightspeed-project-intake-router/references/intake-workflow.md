# Intake Workflow

Use this workflow to turn messy project context into an actionable LightSpeed kickoff route.

## 1. Capture project identity

Record:

- client or project name;
- primary business goal;
- target users or audience;
- current site URL;
- dev or staging URL;
- Figma design system, prototype, Make prototype or frame URL;
- repository, issue or pull request links;
- project stage;
- desired output;
- deadline or launch milestone;
- known approval owner.

## 2. Classify project and risk

Classify by:

- platform: WordPress, WooCommerce, plugin, design system, AI-readiness, chatbot or mixed;
- build type: block theme, block theme plus plugin, hybrid conversion, content migration, ecommerce, publishing or internal product;
- evidence maturity: confirmed, draft, unreviewed, missing or blocker;
- delivery stage: intake, discovery, PRD, technical brief, task planning, implementation, QA, launch or post-launch;
- specialist risk: content, redirects, claims, governance, measurement, performance, accessibility, design parity, data migration or custom functionality.

## 3. Inventory sources

Separate sources into:

- client brief and commercial context;
- design evidence;
- code evidence;
- website evidence;
- content and IA evidence;
- analytics, SEO and performance evidence;
- accessibility, governance and policy evidence;
- AI, chatbot and source-of-truth evidence;
- launch, QA and approval evidence.

Use the source inventory table when there is more than one source or when source status affects routing.

## 4. Identify missing inputs

Group missing inputs by severity:

- **Blocker:** required before the next route can proceed safely.
- **Important gap:** should be resolved before PRD, technical brief, task planning or estimate confidence.
- **Later-stage gap:** can be tracked but does not block the next route.

## 5. Choose route

Choose one primary route:

- evidence route when sources are incomplete or unreviewed;
- PRD route when scope, goals and outcomes are the immediate need;
- technical route when Figma/WordPress architecture is the immediate need;
- task route when PRD and technical brief are approved;
- QA/launch route when implementation exists and needs validation;
- governance/content/AI route when source-of-truth, claims, policies or chatbot behaviour are the main risk.

Then add secondary routes only for clear dependencies or later-stage handoffs.

## 6. Produce the kickoff pack

Include:

- three-line value, risk and next step;
- snapshot of known context;
- evidence maturity table;
- missing inputs;
- assumptions and risks;
- recommended primary route;
- secondary and later-stage routes;
- approval gates;
- prompt starters for the next skill.

## 7. Stop point

Stop after the intake pack unless the user explicitly asks to continue into a downstream skill. The router may recommend the next route and provide prompts, but it should not quietly write the PRD, technical brief, task plan, GitHub issues or launch QA pack.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
