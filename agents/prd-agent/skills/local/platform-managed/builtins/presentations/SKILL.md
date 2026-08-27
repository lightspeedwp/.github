---
name: Presentations
description: Create or edit PowerPoint or Google Slides decks
---

# Slides Skill

Use this skill as reference material when creating or editing presentation slide decks.

## Important Instructions

- [HARD REQUIREMENT] Content quality and storytelling: before planning the deck, read and follow [Content Quality and Narrative Rules](references/content-rules.md). Ensure the deck covers everything the user requested and forms a coherent, audience-appropriate narrative rather than a collection of disconnected facts.
- [HARD REQUIREMENT] Audience-facing copy: visible slide content must be written for the intended audience, not for the person or model producing the deck. Do not expose planning notes, timing scaffolds, talk tracks, content-selection commentary, or other internal process language unless the user explicitly requests it.
- [HARD REQUIREMENT] Successful edit handoff: cite every changed slide in the final response. The set of changed slide numbers and cited slide numbers must match exactly; a file link or uncited list of slide numbers is not sufficient.
- Info density: avoid cramming low-value details onto a single slide. Prefer lower-density slides with high-value content.
  - Title slide: keep the title slide minimal and simple. Avoid cramming in too much information.
- Layout: keep things clean and simple. Avoid low-quality visuals, but also avoid excessive white space. By default, use equal left and right margins on each slide.
- [HARD REQUIREMENT] Overlap: always pay attention to programmatic overlap warnings. Do not assume that overlapping elements in diagrams are intentional, and do not ignore overlap warnings without inspecting them. You MUST fix all unintended overlap errors before delivering the slides. This is critical.
- [HARD REQUIREMENT] Font size: when a template is provided, match its font sizes. When no template or style guidance is given, you MUST use at least 50pt for deck titles, 35pt for slide titles, 24pt for mid-level text such as subheadings, callout headers, and text-box titles, and 16pt for body text.
- Text layout: when there is too much text, shorten it before shrinking the font size. Inspect visually for unexpected text wrapping. NEVER allow a title/banner text box intended for one line to wrap to two lines.
- Narrative copy must fit the chosen layout: shorten it or change layouts rather than adding density or shrinking type.
- Visual assets:
  - [HARD REQUIREMENT] DO NOT use Python to draw images; DO NOT use programmatic vector shapes for visuals; DO NOT use programmatic drawings of any sort. Use image search or image_gen tool instead!
  - [HARD REQUIREMENT] Minimize the use of diagrams. Add them only when requested or when a single diagram materially improves the clarity of complex concepts. Diagram implementation rules: use native PowerPoint shapes for simple diagrams; use Graphviz for complex relational/topological/network-like diagrams; use image_gen for highly aesthetic, illustrative, or scientific infographic diagrams (e.g. chemical structures, circuit diagrams, etc.). When using native PowerPoint shapes with connectors, create connectors (arrows/edges) before creating entity nodes, so edges appear behind nodes and never cross through node shapes or labels. If this ordering is awkward during early iteration, you may create nodes first in the initial draft, then switch to connectors-first in the revised code.
  - Before sourcing or generating visuals, be mindful of the desired aspect ratio, placement, and cropping options on the slide. For example, if you intend to place text to the left of the image containing a person, you should ask image_gen to put the person on the right side of the image.
  - By default, DO NOT reuse the same image more than once (unless it's a background).
  - Prepare visuals for both the main concept and decorative support.
- Default styling: use one composition instead of a collection of UI panels. UI-like styling typically includes card grids, pills, badges, button-like text boxes, tab or navigation patterns, repeated modular panels, dense dashboard-style layouts, and other component-library aesthetics that imply interactivity. Use stylized text boxes sparingly, favoring a flat structure on the canvas.

## Skill Folder Contents

Contents of the `slides/` skill folder:

- `container_tools/`: Standalone python scripts for slides and relevant asset manipulation.
- `references/`: Additional workflow references for specialized presentation tasks.
- `template_following_scripts/`: Helper scripts for exact source-deck/template following.
- `artifact_tool/`: API documentation and coding examples for the artifact tool library.
- `builtin_templates_support/`: Checked-in guidance, manifests, prompts, and reusable scripts for built-in templates. Each template owns its `ARTIFACT.md`; shared runners live once under `builtin_templates_support/scripts/`.
- `assets/builtin_templates/codex-grid-layout-library/`: Blob-managed static assets for the built-in Codex Grid template, including 26 rendered previews, a model-facing registry, structured content tokens, and 26 exact plain-JavaScript artifact-tool Compose reconstructions with no JSX. This directory contains no Markdown, prompts, or reusable runners.

## Container Tools

The following helper scripts are located in the `container_tools/` directory:

- `ensure_raster_image.py`: Ensure images are rasterized; convert to PNG if needed; quick usage `--input_files <img_path1> ...`.
- `render_slides.py`: Render a PowerPoint file into a folder of PNG slides using default sizing; quick usage: `<input.pptx>`. Output files are named `slide-1.png`, `slide-2.png`, ... in a directory with the same name as the input file.
- `create_montage.py`: Build a tiled montage from images in a directory (for viewing multiple image assets or rendered slides at once); quick usage: `--input_dir <imgs_dir> --output_file <montage.png>`. It supports most image formats with auto conversion under the hood.
- `slides_test.py`: Detect content overflowing the original slide canvas; usage: `<input.pptx>`.

## Codex Grid Artifact-Tool Compose Layout Reference

This skill variant does not include the Office template file. Use the distilled layout library as initial design and composition guidance when the user has not supplied a stronger template or brand system.

Before planning slides:

1. Read `builtin_templates_support/codex-grid-layout-library/ARTIFACT.md`, `assets/builtin_templates/codex-grid-layout-library/design_tokens.json`, and `assets/builtin_templates/codex-grid-layout-library/artifact-tool-compose/template-registry.json`.
2. Inspect `assets/builtin_templates/codex-grid-layout-library/assets/previews/layout-library.png`, then shortlist layouts by `templateUse`, `layoutFamily`, `slots`, `densityBudget`, and `typographyBudget`. Do not open all 26 implementation modules by default.
3. For each selected layout, inspect its generated preview and exact `assets/builtin_templates/codex-grid-layout-library/artifact-tool-compose/slide-XX.mjs` reconstruction.
4. Use the selected module's `layers(...)`, `text(...)`, `shape(...)`, `image(...)`, and `table(...)` helper calls as the implementation reference. Keep the output as plain `.mjs` and use `slide.compose(...)`; do not introduce JSX or a transpilation step.
5. Preserve the selected layout's content ownership, spacing, hierarchy, and media frames while replacing instructional sample text with the user's content. Vary silhouettes across the deck instead of repeating one pattern.

The shared `builtin_templates_support/scripts/create-presentation.mjs` runner can materialize any compatible built-in template for validation when passed that template's static asset root. It is not a request to emit every layout in the user's deck. User-provided templates, explicit brand guidance, and exact source evidence always override this default template.

## Workspace

Use the chat mode supplied by Codex. If the chat is not projectless, use the
project-backed layout.

Set:

- `SKILL_DIR=<absolute path to this skill>`
- `THREAD_ID=${CODEX_THREAD_ID:-manual-<timestamp-or-short-random-suffix>}`
- `TASK_SLUG=<sanitized task/deck slug>`
- `TOPIC_SLUG=<sanitized final deck filename slug>`

Select the remaining paths:

| Chat | Scratch workspace | Final PPTX |
| --- | --- | --- |
| Projectless | `$PWD/work/presentations/$TASK_SLUG` | User-requested path, otherwise `$PWD/outputs/$TOPIC_SLUG.pptx` |
| Project-backed | `$SCRATCH_ROOT/codex-presentations/$THREAD_ID/$TASK_SLUG` | User-requested path, repository convention, or `<project-root>/outputs/$TOPIC_SLUG.pptx` |

For project-backed chats, use an external scratch directory supplied by the
host. If none is supplied, compute `SCRATCH_ROOT` with
`node -p "require('node:os').tmpdir()"`; do not hardcode a platform-specific
temp path. Project-backed scratch must remain outside the repository.

An explicit user destination always wins. Set `OUTPUT_DIR` to the directory
containing `FINAL_PPTX`. If a projectless final is outside `outputs/`, an
optional copy under `outputs/` may be created for app surfacing, but the
requested path remains the primary result. Do not modify Git ignore settings
to conceal scratch files.

### Common workspace layout

After selecting `WORKSPACE`, set:

- `TMP_DIR=$WORKSPACE/tmp`
- `SLIDES_DIR=$TMP_DIR/slides`
- `PREVIEW_DIR=$TMP_DIR/preview`
- `LAYOUT_DIR=$TMP_DIR/layout`
- `ASSET_DIR=$TMP_DIR/assets`
- `QA_DIR=$TMP_DIR/qa`

Use absolute paths in scripts and handoffs. Put every generated file under
`$TMP_DIR` except `FINAL_PPTX` and any additional deliverables explicitly
requested by the user. Retain `$WORKSPACE` after delivery so follow-up turns
can inspect and reuse the prior work.

Use `.txt` for every generated intermediate prose artifact in `$TMP_DIR`,
including plans, source notes, prompt records, design notes, QA ledgers, and
fallback reasons. Reserve `.md` for installed skill/reference files such as
`SKILL.md`, `references/*.md`, and templates shipped with the skill. Do not
create generated planning files such as `slide-plan.md`.

## Route the Request Before Authoring

Choose the output path first:

1. **Existing native Google Slides deck**: use the Google Drive plugin's Google
   Slides skill. Do not round-trip it through a local PPTX unless the user asks.
2. **Net-new native Google Slides deck**: build and verify a local PPTX with
   this skill, then import it as described in Google Slides-Targeted Output.
3. **PowerPoint or local deck**: build or edit the PPTX with this skill.

For every deck built with this skill, choose exactly one visual route. The first
matching route wins:

1. **User reference or template skill**: if the user supplies a reference deck,
   asks to follow an existing deck, or invokes a template skill, use only that
   file as the visual source. An existing PPTX being edited also counts as the
   reference. Do not mix in Codex Grid or another template.
2. **Explicit custom formatting**: if there is no reference and the user asks
   for a theme, brand treatment, visual style, mood, or custom formatting,
   create the deck from scratch. Do not use Codex Grid.
3. **No visual direction**: use the bundled Codex Grid Artifact.md layout
   library as the composition reference. Select and adapt layouts using the
   Codex Grid instructions above; do not run PPTX template-following mode.

User-provided references and explicit visual direction always take precedence
over Codex Grid.

## Google Slides-Targeted Output

For a net-new native Google Slides request, create and verify a local `.pptx`
with this skill first. The native Google Slides deliverable must then be
produced by the Google Drive plugin's presentation import action,
`mcp__codex_apps__google_drive_import_presentation`, with
`upload_mode: "native_google_slides"`.

Do not use Computer Use, Browser Use, blank-Google-Slides creation plus Google
Slides write APIs, or another direct-to-Slides construction path for net-new
Google Slides unless the user explicitly asks for that alternate workflow. If
the Google Drive plugin is unavailable, ask the user to install
`google-drive@openai-curated`. If the plugin is available but presentation
import is missing, ask the user to reinstall or refresh the Google Drive plugin
before continuing with the native Google Slides deliverable.

The local `.pptx` creation and native import workflow above applies only to
net-new Google Slides deliverables.

## Implementation

You MUST use `@oai/artifact-tool` from JavaScript ES modules to implement the slide deck.

Read the local docs before coding:

- `artifact_tool/API_QUICK_START.md`
- `artifact_tool/api/API_DOCS.md`

Before running any generated presentation module, initialize its workspace so
Node.js can resolve the bundled `@oai/artifact-tool` package:

```bash
node "$SKILL_DIR/container_tools/setup_artifact_tool_workspace.mjs" \
  --workspace "$TMP_DIR"
```

Create the ES module source file (`.mjs`) under `$TMP_DIR` and export the final
PowerPoint deck (`.pptx`) to `$FINAL_PPTX`. The generated source must be plain
JavaScript that runs directly with `node`; do not require a transpiler or build
step.

You MUST NOT use `python-pptx` or the old Python `artifact_tool` API.

## Template Following

Use template-following mode only when a user-provided source PPTX supplies the
layout, style, or template. Read `references/template-following.md`, use
`$TMP_DIR` from the Workspace section, and set
`TEMPLATE_PPTX="<absolute path to the user-provided PPTX>"`.

Preserve the source deck's typography, palette, spacing, layout, placeholders,
footers, page markers, and brand chrome unless the user explicitly asks to
restyle. Do not use template-following mode for a deck created from scratch.

Create:

- `$TMP_DIR/template-audit.txt`
- `$TMP_DIR/template-frame-map.json`
- `$TMP_DIR/deviation-log.txt`
- `$TMP_DIR/template-starter.pptx`

Keep `$TMP_DIR/source-notes.txt` for content and asset provenance.

Inspect the complete source deck:

```bash
node "$SKILL_DIR/template_following_scripts/inspect_template_deck.mjs" \
  --workspace "$TMP_DIR" \
  --pptx "$TEMPLATE_PPTX"
```

Map each output slide to an inherited source slide and identify element-level
`editTargets`. Then validate the map and build the starter deck:

```bash
node "$SKILL_DIR/template_following_scripts/validate_template_plan.mjs" \
  --workspace "$TMP_DIR" \
  --map "$TMP_DIR/template-frame-map.json"

node "$SKILL_DIR/template_following_scripts/prepare_template_starter_deck.mjs" \
  --workspace "$TMP_DIR" \
  --pptx "$TEMPLATE_PPTX" \
  --map "$TMP_DIR/template-frame-map.json" \
  --out "$TMP_DIR/template-starter.pptx" \
  --preview-dir "$TMP_DIR/template-starter-preview" \
  --layout-dir "$TMP_DIR/template-starter-layout" \
  --contact-sheet "$TMP_DIR/template-starter-contact-sheet.png"
```

Import `template-starter.pptx` with artifact-tool and edit only inherited
slides/objects unless the validated frame map explicitly allows an insertion.
If no source slide can support requested content without a parallel rebuild,
report the blocker and the closest viable source-slide options.

## QA Reminder

Before delivery, render every final slide and inspect each slide individually
at full size. Use a contact sheet only to review deck-level flow and consistency,
not as a substitute for full-size layout QA. Fix unintended overlap, clipping,
wrapping, broken connectors, unresolved placeholders, inconsistent footers/page
markers, and chart/data
mismatches before exporting. Verify that researched claims and sourced assets
are traceable, and cite sources if research was used.

## Final Response

Return the final `.pptx` path and a link to it. Mention the sources cited or
used if research informed the deck. Do not attach scratch plans, previews,
layout JSON, or temporary assets unless the user asks for them.

## Codex App final response citations

Use the inline form `:codex-file-citation{...}` and place each citation immediately after the claim it supports.

For read-only Q&A, cite the source deck. For a successful edit or creation, cite the final delivered deck. For a no-op edit, cite the inspected source deck.

For read-only Q&A, inspect the complete relevant slide, including callouts, the exact question or prompt, chart or table titles, displayed totals or sample sizes, and source or methodology footers. State the direct answer first and cite each distinct evidence-bearing object when exact IDs are available.

Unless the user requests an in-place edit, preserve the input PPTX and export a distinct edited copy. Cite every changed slide in the final response. If no requested content is found and no output is modified, cite the inspected source deck with a plain file citation.

For a newly created deck, cite the slide containing each explicitly requested section.

Use slide citations when slide numbers come from the latest rendered or inspected cited deck:

```text
:codex-file-citation{path="/abs/path/deck.pptx" artifact_kind="presentation" slide_number="3"}
```

Include `slide_id` only when artifact-tool inspection provides the exact stable `sl/...` ID and stable navigation matters:

```text
:codex-file-citation{path="/abs/path/deck.pptx" artifact_kind="presentation" slide_number="1" slide_id="sl/gs5z1kshq0xv"}
```

For a concrete chart, table, image, diagram, or callout, include `object_id` only when inspection provides the exact ID and you can add a useful label:

```text
:codex-file-citation{path="/abs/path/deck.pptx" artifact_kind="presentation" slide_number="1" slide_id="sl/gs5z1kshq0xv" object_id="ch/pz9t1r3ka8vn" label="ARR by segment chart"}
```

Do not cite internal previews, contact sheets, layout JSON, source notes, scratch files, builders, manifests, or QA outputs unless asked. If slide or object IDs are not reliable, cite the slide without object detail rather than guessing.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
