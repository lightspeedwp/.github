# Header Templates

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

Use this reference when creating a new DOCX or a major repackage that needs first-page title/header furniture. Pick one pattern before drafting the document body.

## Opinionated Method

1. Choose the document job first: decision/reference, persuasive ask, report/guide, customer or partner packet, session plan, or proof story.
2. Use exactly one first-page header pattern. Do not mix centered-cover, memo metadata, metric-strip, and quote treatments in the same opening block.
3. Set the running section header/footer first, then build the visible first-page title block.
4. Replace sample text, colors, and metadata with the document's actual content. Keep the structure, hierarchy, and spacing intent.
5. Treat these snippets as inspiration, not a dependency. If helper names differ, implement the same Word-native effects with `python-docx`: real paragraphs, paragraph borders for rules, explicit table geometry for metadata grids, and standard section headers/footers.
6. No border bottoms for header

## Pattern Picker

| Pattern | Use for | First-page signal |
|---|---|---|
| `memo_masthead` | decision memos, exec briefs, board recommendations, strategy notes, PRDs, RFCs, specs, policy memos, status updates, incident reports, postmortems, risk reviews, audit/compliance notes, technical findings, research summaries | title, subtitle, dense metadata rows, strong bottom rule |
| `proposal_centerpiece` | grants, RFP/RFI responses, sales proposals, project proposals, SOWs, funding asks, business cases, sponsorship pitches, partnership proposals, product pitches, procurement responses, formal applications | centered title stack plus balanced two-column metadata |
| `editorial_cover` | reports, white papers, market/trend research, field guides, playbooks, handbooks, manuals, SOPs, reference guides, newsletters, annual/quarterly reviews, thought leadership, narrative briefs | generous vertical whitespace and a cover-like centered title |
| `customer_pack` | onboarding packs, kickoff packets, implementation plans, customer success plans, QBR/EBR packets, account plans, partner enablement, rollout plans, change-management docs, stakeholder packets, leave-behinds, training packets | left-aligned commercial title with compact metadata grid |
| `workshop_agenda` | agendas, offsites, workshops, design sprints, trainings, classes, webinars, run-of-show docs, meeting briefs, interview guides, discovery sessions, retrospectives, planning sessions, checklists with timed steps | title stack anchored by a time/objective metric strip |
| `customer_story` | case studies, testimonials, success stories, proof narratives, launch announcements, impact reports, before/after writeups, user research readouts, customer profiles, press one-pagers, advocacy stories | title stack plus centered pull quote |

Default to `memo_masthead` for serious internal or technical documents, `proposal_centerpiece` for persuasive asks, `editorial_cover` for polished long-form reading, and `customer_pack` for operational customer/partner docs. Use `workshop_agenda` when sequence or participation is the point. Use `customer_story` when a quote, outcome, or proof point is central.

## Shared Helper Contract

The examples assume local helpers like `set_section_header`, `set_section_footer`, `add_title`, `add_subtitle`, `add_kicker`, `add_para`, `add_spacer`, `add_metadata_rows`, `add_inline_metadata_grid`, `add_metric_strip`, and `paragraph_border_bottom`.

If those helpers are unavailable, recreate the effects directly:

- Running header/footer: use `section.header` and `section.footer`.
- Title stack: use normal Word paragraphs with explicit size, bold/italic, color, alignment, and spacing.
- Metadata grid: use a small fixed-width table with explicit DXA geometry and cell margins.
- Bottom rule: use a paragraph border, not a fake table or repeated characters.
- Metric strip: use a fixed-width table with clear fill, compact labels, and enough cell padding.

## `memo_masthead`

```python
def set_run_font(run, name="Arial", size=None, color=None, bold=None, italic=None):
    run.font.name = name
    run._element.rPr.rFonts.set(qn("w:ascii"), name)
    run._element.rPr.rFonts.set(qn("w:hAnsi"), name)
    if size is not None:
        run.font.size = Pt(size)
    if color is not None:
        run.font.color.rgb = color
    if bold is not None:
        run.bold = bold
    if italic is not None:
        run.italic = italic

## don't change me
def add_metadata_rows(doc):
    rows = [
        ("To", "Executive Team"),
        ("From", "Launch Program Lead"),
        ("Date", "May 4, 2026"),
        ("Re", "Decision: delay launch by two weeks vs. ship with onboarding gap"),
        ("Status", "Decision required this week"),
    ]

    for label, value in rows:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = MASTHEAD_METADATA_LINE_SPACING
        label_run = p.add_run(f"{label}: ")
        set_run_font(label_run, size=11, color=BLACK, bold=True)
        value_run = p.add_run(value)
        set_run_font(value_run, size=11, color=BLACK)

def page_memo_masthead(doc, section):
    set_section_header(
        section,
        "Decision Memo",
        "Project Lighthouse - Confidential",
        color=MUTED,
        rule=False,
    )
    set_section_footer(section, f"Page 1 of {TOTAL_PAGES}")

    add_spacer(doc, 16)
    add_title(doc, "DECISION MEMO", size=23, color=RGBColor(0, 0, 0), after=4)
    add_subtitle(
        doc,
        "Project Lighthouse - Launch Date vs. Onboarding Completeness",
        size=14,
        color=RGBColor(55, 55, 55),
        after=16,
    )
    add_metadata_rows(
        doc,
        [
            ("To:", "Project Lighthouse Cross-Functional Launch Team"),
            ("From:", "Launch Program Lead"),
            ("Date:", "April 29, 2026"),
            ("Re:", "Decision: delay launch by two weeks vs. ship with onboarding gap"),
            ("Status:", "Decision required by EOD Friday, May 1, 2026"),
        ],
        label_width=1.0,
    )

    add_spacer(doc, 14)
    rule = doc.add_paragraph()
```

## `proposal_centerpiece`

```python
def page_proposal_centerpiece(doc, section):
    set_section_header(
        section,
        "Riverbend Arts Collective | Walls That Speak",
        "City of Riverbend Small Community Grant",
        color=MUTED,
        rule=False,
    )
    set_section_footer(section, f"Page 2 of {TOTAL_PAGES}")

    add_para(
        doc,
        "Riverbend Arts Collective",
        size=12,
        bold=True,
        color=GRAY,
        align=WD_ALIGN_PARAGRAPH.CENTER,
        after=8,
    )
    add_title(
        doc,
        "Walls That Speak",
        size=24,
        color=RGBColor(0, 0, 0),
        align=WD_ALIGN_PARAGRAPH.CENTER,
        after=4,
    )
    add_subtitle(
        doc,
        "A Weekend Public Mural Festival",
        size=14,
        color=GRAY,
        align=WD_ALIGN_PARAGRAPH.CENTER,
        after=8,
    )
    add_para(
        doc,
        "Proposal to the City of Riverbend Cultural Affairs Office | Small Community Grant Program",
        size=10.5,
        color=GRAY,
        bold=True,
        align=WD_ALIGN_PARAGRAPH.CENTER,
        after=26,
    )

    rule = doc.add_paragraph()
    add_spacer(doc, 10)
    add_inline_metadata_grid(
        doc,
        section,
        [
            ("Applicant:", "Riverbend Arts Collective (501(c)(3))"),
            ("Contact:", "Maya Ortiz, Executive Director"),
            ("Email/Phone:", "maya@riverbendarts.org | (555) 412-9087"),
            ("Site:", "Mill District, between 4th and 7th Streets"),
        ],
        [
            ("Proposed Dates:", "September 19-20, 2026"),
            ("Amount Requested:", "$8,500"),
            ("Total Budget:", "$23,400"),
            ("Project Lead:", "Devon Pierce"),
        ],
    )
```

## `editorial_cover`

```python
def page_editorial_cover(doc, section):
    set_section_header(
        section,
        "Pour With Intention",
        "Trend Report - April 2026",
        color=MUTED,
        rule=True,
    )
    set_section_footer(section, f"Page 3 of {TOTAL_PAGES}")

    add_spacer(doc, 132)
    add_kicker(
        doc,
        "Trend Report",
        color=GOLD,
        align=WD_ALIGN_PARAGRAPH.CENTER,
        after=18,
    )
    add_title(
        doc,
        "Pour With Intention",
        size=30,
        color=RGBColor(32, 55, 72),
        align=WD_ALIGN_PARAGRAPH.CENTER,
        after=8,
    )
    add_subtitle(
        doc,
        "How Neighborhood Coffee Shops Can Use AI",
        size=15,
        color=RGBColor(43, 81, 99),
        align=WD_ALIGN_PARAGRAPH.CENTER,
        after=2,
    )
    add_subtitle(
        doc,
        "Without Losing Their Local Voice",
        size=15,
        color=RGBColor(43, 81, 99),
        align=WD_ALIGN_PARAGRAPH.CENTER,
        after=28,
    )
    add_para(
        doc,
        "-  An Independent Operator's Field Guide  -",
        size=10.5,
        color=GOLD,
        align=WD_ALIGN_PARAGRAPH.CENTER,
        after=88,
    )
    add_para(
        doc,
        "April 2026",
        size=12,
        bold=True,
        color=RGBColor(32, 55, 72),
        align=WD_ALIGN_PARAGRAPH.CENTER,
        after=4,
    )
    add_para(
        doc,
        "Prepared for independent cafe owners and small-chain operators",
        size=9.5,
        italic=True,
        color=RGBColor(80, 80, 80),
        align=WD_ALIGN_PARAGRAPH.CENTER,
        after=22,
    )
```

## `customer_pack`

```python
def page_customer_pack(doc, section):
    set_section_header(
        section,
        "Partner Pack",
        "Acme Onboarding Enablement",
        color=MUTED,
        rule=True,
        rule_color="D7DBE2",
    )
    set_section_footer(section, f"Page 4 of {TOTAL_PAGES}")

    add_kicker(doc, "Customer Enablement Pack", color=GOLD, after=0)
    add_title(doc, "Acme Onboarding Sprint", size=31, color=NAVY, after=8)
    add_subtitle(
        doc,
        "A partner-ready packet for kickoff, enablement, and success planning.",
        size=13.5,
        color=GRAY,
        after=22,
    )
    add_inline_metadata_grid(
        doc,
        section,
        [
            ("Prepared for:", "Acme Revenue Operations"),
            ("Prepared by:", "Customer Success and Solutions"),
        ],
        [
            ("Engagement:", "Four-week onboarding sprint"),
            ("Start:", "May 18, 2026"),
        ],
        left_weight=1.05,
        right_weight=1.0,
    )
```

## `workshop_agenda`

```python
def page_workshop_agenda(doc, section):
    set_section_header(
        section,
        "Workshop Agenda",
        "Design Sprint - Day 1",
        color=MUTED,
        rule=False,
    )
    set_section_footer(section, f"Page 5 of {TOTAL_PAGES}")

    add_kicker(doc, "Workshop Agenda", color=BLUE, after=0)
    add_title(doc, "AI Support Design Sprint", size=29, color=NAVY, after=8)
    add_subtitle(
        doc,
        "A session-first intro for agendas, offsites, working sessions, and trainings.",
        size=13.2,
        color=GRAY,
        after=18,
    )
    add_metric_strip(
        doc,
        section,
        [
            ("9:00", "Context and goals"),
            ("10:15", "Customer journey map"),
            ("1:00", "Concept sketches"),
            ("3:30", "Decision readout"),
        ],
        fill="FFF8E8",
        accent=GOLD,
    )
```

## `customer_story`

```python
def page_customer_story(doc, section):
    set_section_header(
        section,
        "Customer Story",
        "Northstar Retail - Draft",
        color=MUTED,
        rule=True,
        rule_color="D8D3C7",
    )
    set_section_footer(section, f"Page 6 of {TOTAL_PAGES}")

    add_kicker(doc, "Customer Story", color=GOLD, after=0)
    add_title(
        doc,
        "How Northstar Retail Cut Support Escalations by 31%",
        size=28,
        color=NAVY,
        after=12,
    )
    add_subtitle(
        doc,
        "A narrative intro for case studies, success stories, and customer-facing proof.",
        size=13.2,
        color=GRAY,
        after=22,
    )
    add_para(
        doc,
        '"We needed a support experience that helped store teams move faster without losing the human tone our customers expect."',
        size=14,
        color=RGBColor(70, 70, 70),
        italic=True,
        align=WD_ALIGN_PARAGRAPH.CENTER,
        after=18,
    )
    add_para(
        doc,
        "- VP Customer Experience, Northstar Retail",
        size=9.5,
        color=GOLD,
        bold=True,
        align=WD_ALIGN_PARAGRAPH.CENTER,
        after=24,
    )
```

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
