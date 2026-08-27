# DESIGN.md CLI and Portability

Use this reference to keep `DESIGN.md` outputs portable across GitHub, local repositories, editors and Figma-linked workflows.

## Core Principle

`DESIGN.md` is an open plain-text contract, not a Stitch-only artefact. The file should remain useful when:

- viewed in GitHub;
- versioned in a repository;
- validated in a local terminal;
- compared in pull requests;
- used as source material alongside Figma variables or WordPress theme files.

## Preferred CLI Invocation

Prefer this order:

1. `designmd`
2. `design.md`
3. `npx @google/design.md`
4. a checked-out local repo CLI, for example `bun run src/index.ts`

Prefer `designmd` when available because the official package exposes both `design.md` and `designmd`, and the dot-free alias is friendlier in Windows shells.

## Command Matrix

### Inspect the current spec

```bash
designmd spec
designmd spec --rules
designmd spec --rules --format json
```

Use this when the skill needs the latest active rule list or when the spec may have changed.

### Lint a file

```bash
designmd lint DESIGN.md --format json
designmd lint DESIGN.md --format text
```

Treat JSON output as the preferred machine-readable form for reports.

### Compare revisions

```bash
designmd diff DESIGN-before.md DESIGN-after.md --format json
```

Use this to verify that an update reduced regressions and did not silently increase error or warning counts.

### Export tokens

```bash
designmd export DESIGN.md --format dtcg
designmd export DESIGN.md --format json-tailwind
designmd export DESIGN.md --format css-tailwind
```

`tailwind` is an alias for `json-tailwind`, but prefer the explicit name in instructions and reports.

## Canonical Sections

The canonical section order is:

1. `Overview` or `Brand & Style`
2. `Colors`
3. `Typography`
4. `Layout` or `Layout & Spacing`
5. `Elevation & Depth` or `Elevation`
6. `Shapes`
7. `Components`
8. `Do's and Don'ts`

When creating `DESIGN.md`, preserve these literal headings or aliases even if the surrounding report uses UK English.

## Portability Checklist

Before finalising, check:

- the file is named `DESIGN.md`;
- the document is valid plain text with optional YAML front matter and Markdown body;
- canonical sections are used in the expected order;
- token references are internal and self-contained;
- the file does not rely on Stitch UI concepts to make sense;
- validation can be reproduced through the official CLI or a checked-out repo;
- Figma and GitHub are treated as evidence sources, not required runtime hosts.

## GitHub and Figma Use

For GitHub:

- keep `DESIGN.md` diff-friendly and reviewable in pull requests;
- include source maps or validation reports when the change is substantial;
- use CLI output to justify corrections rather than subjective taste alone.

For Figma:

- treat variables, modes, components and Dev Mode context as evidence inputs;
- map Figma systems into `DESIGN.md`, but do not assume Stitch is the only consumer;
- preserve enough rationale that another agent or human can use the file without opening Figma.
