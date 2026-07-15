# Dependency and Wave Planning

## Dependency types

| Dependency | Meaning |
|---|---|
| Design dependency | Figma or design decision needed first |
| Content dependency | Copy, IA or media not ready |
| Technical dependency | Theme/plugin architecture or API needed first |
| Review dependency | Needs product/design/client approval |
| Launch dependency | Redirect, analytics, policy or QA blocker |

## Wave model

| Wave | Focus |
|---|---|
| Wave 0 | Discovery, final decisions, missing evidence |
| Wave 1 | Architecture, repo setup, tokens, theme/plugin foundation |
| Wave 2 | Blocks, patterns, templates, editor experience |
| Wave 3 | Page build, content integration, specialist integrations |
| Wave 4 | QA, performance, accessibility, analytics, schema |
| Wave 5 | Launch, monitoring, bug fixes, iteration |

## DAG guidance

When dependencies matter, output a simple dependency map:

```text
Token map -> theme.json -> template styles -> pattern QA -> page QA
Block scaffold -> block variations -> pattern library -> editor QA
Content approval -> page build -> schema validation -> chatbot source approval
```
