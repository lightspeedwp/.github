import textwrap
from pathlib import Path

from PIL import Image

from presentation_artifact_tool import (
    AutoLayoutAlign,
    AutoLayoutDirection,
    AutoLayoutFrame,
    AutoLayoutOptions,
    Blob,
    BoundingBoxRect,
    HyperlinkInput,
    Presentation,
    PresentationFile,
    PresetShapeGeometryConfig,
    Shape,
    Slide,
    Text,
    TextStyle,
    warn_about_overlaps,
)


def create_presentation() -> Presentation:
    presentation = Presentation.create()

    # Start by defining slide layouts, so that we can reference them later.
    # Changing the layout will automatically update all slides that use it.
    # This is a good way to ensure that slides have a consistent layout, and to
    # avoid duplicating layout code across slides.
    _add_layouts(presentation)

    # Now add the slides.
    _add_text_slide(presentation)
    _add_tables_slide(presentation)
    _add_lists_slide(presentation)
    _add_charts_slide(presentation)
    _add_diagrams_slide(presentation)
    _add_overlap_detection_slide(presentation)
    _add_styling_slide(presentation)
    _add_images_slide(presentation)
    _add_auto_layout_slide(presentation)

    return presentation


def _add_layouts(presentation: Presentation) -> None:
    # Documentation: ../layout.spec.md
    title_layout = presentation.layouts.add("Title")
    title = title_layout.placeholders.add(
        {"name": "Title", "type": "title", "index": 1, "text": "Title"}
    )
    title.position = BoundingBoxRect(left=36, top=36, width=800, height=60)
    title.text.default_text_style = TextStyle()
    title.text.default_text_style.font_size = 48
    title.text.bold = True
    title.text.vertical_alignment = "middle"


def _add_text_slide(presentation: Presentation) -> None:
    slide = presentation.slides.add({"layout": "Title"})
    slide.placeholders.get_item("Title").text = "Text"

    def _add_text_box(position: BoundingBoxRect) -> Shape:
        text_box = slide.shapes.add(PresetShapeGeometryConfig(geometry="rect"))
        text_box.fill = "#eeeeee"
        text_box.line.width = 1
        text_box.line.fill = "#606060"
        text_box.position = position

        text_box.text.default_text_style = TextStyle()
        text_box.text.default_text_style.font_size = 24

        return text_box

    full_text = textwrap.dedent("""\
On the day the ocean stopped moving, the world held its breath. Waves froze in mid-crash, \
ships hung tilted in the air, and the tide line burned like a scar across the shore.

Lina walked into the still water, hearing her own footsteps \
echo as if the sea were hollow. At its center stood a single door, upright \
and rusted, humming with a sound like grief. She opened it and remembered what \
everyone else had chosen to forget—that the ocean had been promised a life in \
exchange for its silence.

When the door closed behind her, the waves fell at once, roaring back into motion. The sea \
was alive again, and somewhere deep below, it finally stopped waiting.

Other stories""")
    short_snippet = textwrap.dedent("""\
On the day the ocean stopped moving, the world held its breath. Waves froze in mid-crash, \
ships hung tilted in the air, and the tide line burned like a scar across the shore.""")

    box_width = 536
    box_height = 80
    gap = 64
    total_w = box_width * 2 + gap
    left_x = int((slide.frame.width - total_w) / 2)

    ################################################################################
    ## Text wrapping and overflow
    # Documentation: ../rich-text.spec.md
    ################################################################################

    # By default, text in a shape is wrapped to the width of the shape. However, the text
    # might overflow in the vertical direction out of the bottom of the shape.
    text_box = _add_text_box(
        BoundingBoxRect(left=left_x, top=128, width=box_width, height=box_height)
    )
    text_box.text = short_snippet

    # With auto_fit="shrinkText", the font size will be reduced until the text also fits in the
    # in the vertical direction inside the shape.
    text_box = _add_text_box(
        BoundingBoxRect(left=left_x, top=256, width=box_width, height=box_height)
    )
    text_box.text = short_snippet
    text_box.text.auto_fit = "shrinkText"

    # With auto_fit="resizeShapeToFitText", the font size will be kept the same, and instead the
    # shape will be extended downwards to fit the text.
    text_box = _add_text_box(
        BoundingBoxRect(left=left_x, top=384, width=box_width, height=box_height)
    )
    text_box.text = short_snippet
    text_box.text.auto_fit = "resizeShapeToFitText"

    # With wrap="none", the text will not be wrapped to the width of the shape. Instead, it will
    # appear on a single line and overflow horizontally out of the shape.
    text_box = _add_text_box(
        BoundingBoxRect(left=left_x, top=560, width=box_width, height=box_height)
    )
    text_box.text = short_snippet
    text_box.text.wrap = "none"

    ################################################################################
    ## Text formatting
    # Documentation: ../rich-text.spec.md
    ################################################################################

    right_x = left_x + box_width + gap
    text_box = _add_text_box(
        BoundingBoxRect(left=right_x, top=128, width=box_width, height=box_height),
    )

    # The default text style can be set for the entire text box.
    text_box.text.default_text_style = TextStyle()
    text_box.text.default_text_style.font_size = 18

    text_box.text = full_text
    text_box.text.auto_fit = "resizeShapeToFitText"

    # Smaller text ranges can be formatted in different ways.
    paragraph_1 = text_box.text.get(
        "On the day the ocean stopped moving, the world held its breath. Waves froze in mid-crash, ships hung tilted in the air, and the tide line burned like a scar across the shore."
    )
    paragraph_1.font_size = 24

    lina_sentence = text_box.text.get(
        "Lina walked into the still water, hearing her own footsteps echo as if the sea were hollow."
    )
    lina_sentence.bold = True

    door_sentence = text_box.text.get(
        "At its center stood a single door, upright and rusted, humming with a sound like grief."
    )
    door_sentence.italic = True

    explanation_phrase = text_box.text.get(
        "that the ocean had been promised a life in exchange for its silence."
    )
    explanation_phrase.color = "#4444ff"

    last_paragraph = text_box.text.get(
        "When the door closed behind her, the waves fell at once, roaring back into motion. The sea was alive again, and somewhere deep below, it finally stopped waiting."
    )
    last_paragraph.alignment = "center"

    other_stories_link = text_box.text.get("Other stories")
    other_stories_link.link = HyperlinkInput(
        uri="https://www.chatgpt.com/prompt=the+ocean+stopped+moving",
        is_external=True,
    )
    other_stories_link.color = "#0000ff"

    _add_speaker_notes_to_slide(slide)


def _add_speaker_notes_to_slide(slide: Slide) -> None:
    ################################################################################
    ## Speaker notes
    # Documentation: ../speaker-notes.spec.md
    ################################################################################

    # Speaker notes live off the slide and are not visible in the rendered content.
    notes = slide.speaker_notes
    notes.set_text("Use set_text when you want to replace the entire notes body in one shot.")
    notes.append(
        [
            "Use append to add one or more new paragraphs after existing notes.",
            "Like this.",
        ]
    )
    notes.text_frame.paragraphs.add().add_run(
        "Use text_frame for fine-grained paragraph/run edits."
    )


def _add_tables_slide(presentation: Presentation) -> None:
    slide = presentation.slides.add({"layout": "Title"})
    slide.placeholders.get_item("Title").text = "Tables"

    ################################################################################
    ## Table creation, styling, and cell edits
    # Documentation: ../tables.spec.md
    ################################################################################

    # Tables can be created from a primitive matrix.
    summary_table = slide.tables.add(
        [
            ["Region", "Bookings", "Change"],
            ["North", 120, "+12%"],
            ["EMEA", 94, "+8%"],
            ["APAC", 76, "+15%"],
        ]
    )
    summary_table.position = BoundingBoxRect(left=56, top=140, width=392, height=220)
    # summary_table.style = "TableStyleMedium9"
    summary_table.set_column_widths([172, 135, 110])

    # Use get_cell or the cells helper to edit values, fills, and text formatting.
    for column in range(3):
        header_cell = summary_table.cells.get(0, column)
        header_cell.fill = "#1f4e79"
        header_cell.text.bold = True
        header_cell.text.color = "#ffffff"
        header_cell.text.alignment = "center"
        header_cell.text.vertical_alignment = "middle"

    summary_table.get_cell(2, 2).value = "+10%"
    summary_table.cells.set(1, 1, Text.create("120"))

    ################################################################################
    ## Rich text values + merges
    # Documentation: ../tables.spec.md
    ################################################################################

    detail_table = slide.tables.add(
        {
            "rows": 4,
            "columns": 3,
            "left": 496,
            "top": 140,
            "width": 396,
            "height": 260,
            "values": [
                [
                    [{"run": "Q2 Release Plan", "text_style": {"bold": True}}],
                    "",
                    "",
                ],
                ["Milestone", "Owner", "Status"],
                [
                    [{"run": "API surface", "text_style": {"bold": True}}],
                    "Platform",
                    [{"run": "On track", "text_style": {"color": "#2e7d32"}}],
                ],
                [
                    "UI polish",
                    [
                        [{"run": "Line 1", "text_style": {"italic": True}}],
                        [{"run": "Line 2"}],
                    ],
                    [{"run": "Needs review", "text_style": {"italic": True}}],
                ],
            ],
        }
    )

    # Merge the header row across all columns to create a title row.
    detail_table.merge({"start_row": 0, "end_row": 0, "start_column": 0, "end_column": 2})

    # Use cell.text to refine rich text styling after values are set.
    title_cell = detail_table.get_cell(0, 0)
    title_cell.text.alignment = "center"
    title_cell.text.vertical_alignment = "middle"

    status_cell = detail_table.get_cell(3, 2)
    status_emphasis = status_cell.text.get("Needs review")
    status_emphasis.bold = True

    ################################################################################
    ## Table metadata, borders, and right-to-left layout
    # Documentation: ../tables.spec.md
    ################################################################################

    rtl_table = slide.tables.add(
        [
            ["Region", "Bookings", "Change"],
            ["North", 120, "+12%"],
            ["EMEA", 94, "+8%"],
        ]
    )
    rtl_table.position = BoundingBoxRect(left=56, top=392, width=392, height=188)
    # Table style names include TableStyleLight1-21, TableStyleMedium1-28, TableStyleDark1-11.
    rtl_table.style = "TableStyleMedium2"
    rtl_table.style_options = {"header_row": True, "banded_rows": True, "first_column": True}
    rtl_table.right_to_left = True

    # Table metadata helpers are available for layout logic.
    # Column widths default to table width / column count when a frame exists,
    # so 120 here is an explicit width override.
    column_widths = [120] * int(rtl_table.column_count)
    column_widths[0] = 152
    rtl_table.set_column_widths(column_widths)
    last_row = int(rtl_table.row_count) - 1
    rtl_table.set_cell_value(last_row, 2, "+90%")

    # Borders can be applied to the entire table.
    rtl_table.borders = {
        "outside": {"width": 1, "fill": "#5e35b1"},
        "inside": {"width": 0.75, "fill": "#8d6e63"},
    }

    # Borders can also be applied to individual cells, rows, or columns.
    accent_cell = detail_table.get_cell(2, 2)
    accent_cell.borders = {
        "top": {"width": 1.5, "fill": "#1b5e20"},
        "bottom": {"width": 1.5, "fill": "#1565c0"},
        "left": {"width": 1.5, "fill": "#6a1b9a"},
        "right": {"width": 1.5, "fill": "#ef6c00"},
    }

    header_row = detail_table.cells.block(
        {"row": 1, "column": 0, "row_count": 1, "column_count": 3}
    )
    header_row.borders = {"bottom": {"width": 1, "fill": "#00897b"}}

    owner_column = detail_table.cells.block(
        {"row": 1, "column": 1, "row_count": 3, "column_count": 1}
    )
    owner_column.borders = {"right": {"width": 1, "fill": "#c62828"}}


def _add_lists_slide(presentation: Presentation) -> None:
    # Documentation: ../rich-text.spec.md
    slide = presentation.slides.add({"layout": "Title"})
    slide.placeholders.get_item("Title").text = "Lists"

    def _add_list_card(title: str, position: BoundingBoxRect) -> Shape:
        card = slide.shapes.add(PresetShapeGeometryConfig(geometry="rect"))
        card.name = f"Lists card: {title}"
        card.position = position
        card.fill = "#f7f7f7"
        card.line.width = 1
        card.line.fill = "#606060"

        default_style = TextStyle()
        default_style.font_size = 20
        default_style.typeface = "Aptos"
        card.text.default_text_style = default_style
        return card

    left_card = _add_list_card(
        "Bulleted list via style preset",
        BoundingBoxRect(left=60, top=140, width=420, height=440),
    )
    right_card = _add_list_card(
        "Numbered list via range selection",
        BoundingBoxRect(left=500, top=140, width=420, height=440),
    )

    ################################################################################
    ## Bulleted lists
    # Documentation: ../rich-text.spec.md
    ################################################################################

    # Add paragraphs first, then apply the list style to just the bullet items.
    left_card.text = [
        "Release checklist",
        "Confirm success metrics and owners",
        "Run smoke tests in staging",
        "Schedule the rollout window",
        "Post launch notes in #shiproom",
    ]

    # Use a range selection to convert only the list items into bullets.
    bullet_items = left_card.text.get(
        "\n".join(
            [
                "Confirm success metrics and owners",
                "Run smoke tests in staging",
                "Schedule the rollout window",
                "Post launch notes in #shiproom",
            ]
        )
    )
    bullet_items.style = "list"

    # You can format specific bullet items after applying the list preset.
    staging_item = left_card.text.get("Run smoke tests in staging")
    staging_item.bold = True
    staging_item.color = "accent1"

    shiproom_item = left_card.text.get("#shiproom")
    shiproom_item.link = HyperlinkInput(uri="https://chatgpt.com", is_external=True)

    ################################################################################
    ## Numbered lists
    # Documentation: ../rich-text.spec.md
    ################################################################################

    right_card.text = [
        "Incident response",
        "Acknowledge the page within 5 minutes",
        "Create a shared incident doc",
        "Assign a single incident commander",
        "Publish updates every 15 minutes",
    ]

    # The numberedList preset applies numbering without manually tuning bullets/levels.
    numbered_steps = right_card.text.get(
        "\n".join(
            [
                "Acknowledge the page within 5 minutes",
                "Create a shared incident doc",
                "Assign a single incident commander",
                "Publish updates every 15 minutes",
            ]
        )
    )
    numbered_steps.style = "numberedList"

    # Range operations compose: treat the numbered list like normal rich text.
    cadence = right_card.text.get("every 15 minutes")
    cadence.italic = True
    cadence.color = "accent6"


def _add_styling_slide(presentation: Presentation) -> None:
    slide = presentation.slides.add({"layout": "Title"})
    slide.placeholders.get_item("Title").text = "Styling options"

    def _add_card(position: BoundingBoxRect) -> Shape:
        card = slide.shapes.add(PresetShapeGeometryConfig(geometry="rect"))
        card.fill = "#f5f5f5"
        card.line.width = 1
        card.line.fill = "#606060"
        card.position = position

        default_style = TextStyle()
        default_style.font_size = 18
        card.text.default_text_style = default_style
        return card

    ################################################################################
    ## Text styles and typeface
    # Documentation: ../styles.spec.md
    # Documentation: ../rich-text.spec.md
    ################################################################################

    # Use styles.add when you want a reusable, named text style across slides.
    accent = presentation.styles.add("accentStyle")
    accent.description = "Accent text for highlights"
    accent.color = "accent1"
    accent.bold = True
    accent.font_size = 20
    accent.text_style.typeface = "Aptos"

    # Use names to disambiguate shapes in prompts and simplify tests/inspection for overlaps.
    text_card = _add_card(BoundingBoxRect(left=72, top=128, width=392, height=120))
    text_card.name = "Text styles card: default + named styles"
    text_style = TextStyle()
    text_style.font_size = 18
    text_style.typeface = "Aptos"
    # Use default_text_style to set base font + typeface for a whole shape.
    # MAKE SURE to set the default text style before adding any text, otherwise the text will not be styled.
    text_style = TextStyle()
    # To set font size, use the `font_size` property.
    text_style.font_size = 18
    # To set font family, use the `typeface` property.
    text_style.typeface = "Courier New"
    text_card.text.default_text_style = text_style

    # Now you can add text to the shape, and it will be styled according to the default text style.
    text_card.text = [
        "Default text style",
        "Custom style + typeface",
        "Accent text lives in a named style.",
    ]

    # Use range.style when you want a range of text (such as a paragraph) to adopt a named style (which is
    # different from the default text style).
    title_range = text_card.text.get("Custom style + typeface")
    title_range.style = "heading2"

    accent_range = text_card.text.get("Accent text")
    accent_range.style = "accentStyle"

    ################################################################################
    ## Line spacing (per-line paragraph spacing)
    # Documentation: ../rich-text.spec.md
    ################################################################################

    spacing_card = _add_card(BoundingBoxRect(left=72, top=272, width=392, height=328))
    spacing_card.name = "Line spacing card: spacing before/after"
    spacing_card.text = [
        "Line spacing (space_after = 0). The next paragraph will be placed right after this one.",
        "Line spacing (space_after = 1800 ≈ 18pt). The next paragraph will be placed 18pt below this one.",
        "Spacing uses 1/100 pt (PowerPoint units). Keep this in mind when setting spacing values.",
        "Line spacing (space_before = 1800 ≈ 18pt). This paragraph will be placed 18pt below the previous one.",
    ]

    # Use spacing_after to control paragraph spacing (PowerPoint 1/100 pt units).
    tight_range = spacing_card.text.get(
        "Line spacing (space_after = 0). The next paragraph will be placed right after this one."
    )
    tight_range.spacing_after = 0

    relaxed_range = spacing_card.text.get(
        "Line spacing (space_after = 1800 ≈ 18pt). The next paragraph will be placed 18pt below this one."
    )
    relaxed_range.spacing_after = 1800

    note_range = spacing_card.text.get("Spacing uses 1/100 pt (PowerPoint units).")
    note_range.spacing_after = 0

    # `spacing_before` is also available.
    before_range = spacing_card.text.get(
        "Line spacing (space_before = 1800 ≈ 18pt). This paragraph will be placed 18pt below the previous one."
    )
    before_range.spacing_before = 1800

    ################################################################################
    ## Shape styling + transparency
    # Documentation: ../shapes.spec.md
    # Documentation: ../fill.spec.md
    ################################################################################

    shape_card = _add_card(BoundingBoxRect(left=504, top=128, width=388, height=472))
    shape_card.name = "Shape styling card: fills, lines, alpha"
    shape_card.text = "Shape fills, lines, and alpha"

    # Use solid fills for flat color and line.* for borders.
    solid = slide.shapes.add(PresetShapeGeometryConfig(geometry="roundRect"))
    solid.name = "Solid fill shape: round rect, accent2"
    solid.position = BoundingBoxRect(left=540, top=188, width=140, height=96)
    solid.fill = "accent2"
    solid.line.width = 2
    solid.line.fill = "accent5"

    # Use alpha in hex colors for transparency (e.g., #RRGGBBAA).
    transparent = slide.shapes.add(PresetShapeGeometryConfig(geometry="ellipse"))
    transparent.name = "Transparent fill shape: ellipse with alpha"
    transparent.position = BoundingBoxRect(left=702, top=188, width=140, height=96)
    transparent.fill = "#33669920"
    transparent.line.width = 2
    transparent.line.fill = "#336699"

    # Use gradient fills when you want directional or blended color.
    gradient = slide.shapes.add(PresetShapeGeometryConfig(geometry="rect"))
    gradient.name = "Gradient fill shape: linear 45 deg"
    gradient.position = BoundingBoxRect(left=540, top=312, width=302, height=96)
    gradient.fill = {
        "type": "gradient",
        "gradient_kind": "linear",
        "angle_deg": 45,
        "stops": [{"offset": 0, "color": "accent3"}, {"offset": 100000, "color": "accent6"}],
    }
    gradient.line.width = 1
    gradient.line.style = "dashed"
    gradient.line.fill = "accent5"

    # Use roundRect for rounded corners.
    rounded = slide.shapes.add(PresetShapeGeometryConfig(geometry="roundRect"))
    rounded.name = "Rounded rectangle: default rounding"
    rounded.position = BoundingBoxRect(left=540, top=428, width=100, height=64)
    rounded.fill = "accent1"

    # Use roundRect + adjustment_list to control corner radius. The adjustment value is expressed
    # as a percentage of the shorter side of the shape times 1000.
    # A value of 0 means no rounding.
    squared = slide.shapes.add(
        PresetShapeGeometryConfig(
            geometry="roundRect", adjustment_list=[{"name": "adj", "formula": "val 0"}]
        )
    )
    squared.position = BoundingBoxRect(left=648, top=428, width=100, height=64)
    squared.fill = "accent2"
    squared.name = "Rounded rectangle: zero rounding"

    # A value of 50000 means max rounding (radius = 50% of shorter side → pill).
    pilled = slide.shapes.add(
        PresetShapeGeometryConfig(
            geometry="roundRect", adjustment_list=[{"name": "adj", "formula": "val 50000"}]
        )
    )
    pilled.position = BoundingBoxRect(left=756, top=428, width=100, height=64)
    pilled.fill = "accent3"
    pilled.name = "Rounded rectangle: max rounding"


def _add_charts_slide(presentation: Presentation) -> None:
    slide = presentation.slides.add({"layout": "Title"})
    slide.placeholders.get_item("Title").text = "Charts"

    box_size = 280
    gap = 24
    total_w = box_size * 4 + gap * 3
    start_x = int((slide.frame.width - total_w) / 2)

    top_y = 128
    top_1, top_2, top_3, top_4 = [
        BoundingBoxRect(
            left=start_x + i * (box_size + gap), top=top_y, width=box_size, height=box_size
        )
        for i in range(4)
    ]
    bottom_y = top_y + box_size + gap
    bottom_1, bottom_2, bottom_3, _ = [
        BoundingBoxRect(
            left=start_x + i * (box_size + gap), top=bottom_y, width=box_size, height=box_size
        )
        for i in range(4)
    ]

    ################################################################################
    ## Line + bar charts
    # Documentation: ../charts.spec.md
    ################################################################################

    # Use charts.add for data-driven visuals; position controls where the chart sits on the slide.
    line_chart = slide.charts.add("line")
    line_chart.position = top_1
    line_chart.title = "Usage"
    # Categories define the x-axis labels for category charts.
    line_chart.categories = ["Q1", "Q2", "Q3", "Q4"]
    # Titles can be added to the x-axis and y-axis. It is a best practice to add titles to the x-axis
    # and y-axis to help the reader understand the chart.
    line_chart.x_axis.title = "Quarter"
    line_chart.y_axis.title = "Active users"

    # Use series.add to attach values (& optional styling) to a chart.
    # For category charts, series.categories should match chart.categories.
    wau_series = line_chart.series.add("Weekly Active users")
    wau_series.values = [120, 180, 260, 340]
    wau_series.categories = line_chart.categories
    wau_series.stroke = {"width": 2, "style": "solid", "fill": "accent1"}
    wau_series.marker.symbol = "circle"
    wau_series.marker.size = 6

    # Multiple series can be added to a chart. They all have to share the same categories.
    dau_series = line_chart.series.add("Daily Active users")
    dau_series.values = [23, 54, 70, 89]
    dau_series.categories = line_chart.categories
    dau_series.stroke = {"width": 2, "style": "solid", "fill": "accent2"}
    dau_series.marker.symbol = "diamond"
    dau_series.marker.size = 6

    # A legend can be added to the chart.
    line_chart.has_legend = True
    line_chart.legend.position = "bottom"
    line_chart.legend.text_style.font_size = 12

    # Use bar charts for side-by-side comparisons across categories.
    bar_chart = slide.charts.add("bar")
    bar_chart.position = top_2
    bar_chart.title = "Revenue by region"
    bar_chart.categories = ["NA", "EMEA", "APAC"]
    bar_chart.x_axis.title = "Region"
    bar_chart.y_axis.title = "Revenue (in millions USD)"

    bar_series = bar_chart.series.add("Revenue")
    bar_series.values = [120, 90, 60]
    bar_series.categories = bar_chart.categories
    bar_series.fill = "accent3"

    # Use data labels when you want values visible without hover.
    bar_chart.bar_options.direction = "column"
    bar_chart.data_labels.show_value = True
    bar_chart.data_labels.position = "outEnd"
    bar_chart.data_labels.text_style.font_size = 9

    ################################################################################
    ## Stacked bar
    # Documentation: ../charts.spec.md
    ################################################################################

    # Stacked bars for parts-of-whole comparisons (grouping=stacked).
    stacked_bar = slide.charts.add("bar")
    stacked_bar.position = top_3
    stacked_bar.title = "Customer accounts by type"
    stacked_bar.categories = ["Q1", "Q2", "Q3"]
    stacked_bar.bar_options.grouping = "stacked"
    stacked_bar.bar_options.direction = "column"
    stacked_bar.x_axis.title = "Quarter"
    stacked_bar.y_axis.title = "Customer Accounts"
    new_series = stacked_bar.series.add("New")
    new_series.values = [30, 40, 50]
    new_series.categories = stacked_bar.categories
    new_series.fill = "accent2"
    renew_series = stacked_bar.series.add("Renew")
    renew_series.values = [20, 35, 45]
    renew_series.categories = stacked_bar.categories
    renew_series.fill = "accent3"

    stacked_bar.has_legend = True
    stacked_bar.legend.position = "bottom"

    ################################################################################
    ## Row bar (horizontal)
    # Documentation: ../charts.spec.md
    ################################################################################

    # Row bars for horizontal comparisons (direction=bar).
    row_bar = slide.charts.add("bar")
    row_bar.position = top_4
    row_bar.title = "Revenue by region"
    row_bar.categories = ["NA", "EMEA", "APAC"]
    row_bar.bar_options.direction = "bar"
    row_bar.x_axis.title = "Region"
    row_bar.y_axis.title = "Revenue (in millions USD)"
    revenue_series = row_bar.series.add("Revenue")
    revenue_series.values = [120, 90, 60]
    revenue_series.categories = row_bar.categories
    revenue_series.fill = "accent4"

    ################################################################################
    ## Area chart
    # Documentation: ../charts.spec.md
    ################################################################################

    # Area charts for cumulative trends; useful to show magnitude over time.
    area_chart = slide.charts.add("area")
    area_chart.position = bottom_1
    area_chart.title = "Customer accounts by type"
    area_chart.categories = ["Q1", "Q2", "Q3", "Q4"]
    # Similar to bar charts, area charts can be stacked.
    area_chart.area_options.grouping = "stacked"
    area_chart.x_axis.title = "Quarter"
    area_chart.y_axis.title = "Customer Accounts"
    new_series = area_chart.series.add("New")
    new_series.values = [30, 40, 50, 60]
    new_series.categories = area_chart.categories
    new_series.fill = "accent2"
    renew_series = area_chart.series.add("Renew")
    renew_series.values = [20, 35, 45, 55]
    renew_series.categories = area_chart.categories
    renew_series.fill = "accent3"

    area_chart.has_legend = True
    area_chart.legend.position = "bottom"

    ################################################################################
    ## Pie chart
    # Documentation: ../charts.spec.md
    ################################################################################

    # Pie charts for single-series composition.
    pie_chart = slide.charts.add("pie")
    pie_chart.position = bottom_2
    pie_chart.title = "Product usage by category"
    pie_chart.categories = ["Core", "Enterprise", "Expansion"]
    share_series = pie_chart.series.add("Share")
    share_series.values = [55, 25, 20]
    share_series.categories = pie_chart.categories
    # Explosion can be set to set a distance between each slice of the pie chart. A
    # zero value means the pie chart is circular.
    share_series.explosion = 10

    # Data labels can be added to the pie chart, and can help a lot with understanding the pie chart.
    pie_chart.data_labels.show_value = True
    pie_chart.data_labels.show_category_name = True
    pie_chart.data_labels.show_leader_lines = True
    pie_chart.data_labels.position = "inEnd"
    pie_chart.data_labels.text_style.font_size = 10
    pie_chart.data_labels.text_style.fill = "#ffffff"
    pie_chart.data_labels.text_style.bold = True

    ################################################################################
    ## Scatter plot
    # Documentation: ../charts.spec.md
    ################################################################################

    # Scatter plots for correlation analysis; use x_values + values.
    scatter_chart = slide.charts.add("scatter")
    scatter_chart.position = bottom_3
    scatter_chart.title = "Severity vs. Time to resolve"
    scatter_chart.x_axis.title = "Severity"
    scatter_chart.y_axis.title = "Time to resolve"
    scatter_series = scatter_chart.series.add("Engagement")
    scatter_series.x_values = [1.2, 1.8, 2.4, 3.1, 3.8]
    scatter_series.values = [20, 35, 28, 50, 42]
    # scatter_chart.scatter_options.style = "lineWithMarkers"


def _add_diagrams_slide(presentation: Presentation) -> None:
    slide = presentation.slides.add({"layout": "Title"})
    slide.placeholders.get_item("Title").text = "Diagrams"

    ################################################################################
    ## Shapes
    # Documentation: ../shapes.spec.md
    ################################################################################

    # A large number of preset shapes are available. Here are some examples.
    # Each shape's position is specified by a BoundingBoxRect which can be changed to
    # stretch / shrink the shape in different directions.

    shape_size = 100
    horizontal_gap = 36
    vertical_gap = 72
    num_shapes = 8
    total_w = shape_size * num_shapes + horizontal_gap * (num_shapes - 1)
    start_x = int((slide.frame.width - total_w) / 2)

    top_y = 156
    top_positions = [
        dict(
            left=start_x + i * (shape_size + horizontal_gap),
            top=top_y,
            width=shape_size,
            height=shape_size,
        )
        for i in range(num_shapes)
    ]

    rect = slide.shapes.add(PresetShapeGeometryConfig(geometry="rect", position=top_positions[0]))
    rect.fill = "#f0f0f0"
    rect.line.width = 1
    rect.line.fill = "#606060"

    rounded_rect = slide.shapes.add(
        PresetShapeGeometryConfig(geometry="roundRect", position=top_positions[1])
    )
    rounded_rect.fill = "#f0f0f0"
    rounded_rect.line.width = 1
    rounded_rect.line.fill = "#606060"

    # Ellipse can be used to create an oval. When width and height are equal, it becomes a circle.
    ellipse = slide.shapes.add(
        PresetShapeGeometryConfig(geometry="ellipse", position=top_positions[2])
    )
    ellipse.fill = "#f0f0f0"
    ellipse.line.width = 1
    ellipse.line.fill = "#606060"

    diamond = slide.shapes.add(
        PresetShapeGeometryConfig(geometry="diamond", position=top_positions[3])
    )
    diamond.fill = "#f0f0f0"
    diamond.line.width = 1
    diamond.line.fill = "#606060"

    triangle = slide.shapes.add(
        PresetShapeGeometryConfig(geometry="triangle", position=top_positions[4])
    )
    triangle.fill = "#f0f0f0"
    triangle.line.width = 1
    triangle.line.fill = "#606060"

    # Use pentagon to create a pentagon shape. Use hexagon, octagon, decagon, etc. for other regular polygons.
    pentagon = slide.shapes.add(
        PresetShapeGeometryConfig(geometry="pentagon", position=top_positions[5])
    )
    pentagon.fill = "#f0f0f0"
    pentagon.line.width = 1
    pentagon.line.fill = "#606060"

    # Star can be used to create a star shape. Use star5 for a 5-pointed star, star6 for a 6-pointed star, etc.
    star = slide.shapes.add(PresetShapeGeometryConfig(geometry="star5", position=top_positions[6]))
    star.fill = "#f0f0f0"
    star.line.width = 1
    star.line.fill = "#606060"

    cloud = slide.shapes.add(PresetShapeGeometryConfig(geometry="cloud", position=top_positions[7]))
    cloud.fill = "#f0f0f0"
    cloud.line.width = 1
    cloud.line.fill = "#606060"

    middle_y = top_y + shape_size + vertical_gap
    middle_positions = [
        dict(
            left=start_x + i * (shape_size + horizontal_gap),
            top=middle_y,
            width=shape_size,
            height=shape_size,
        )
        for i in range(num_shapes)
    ]

    line = slide.shapes.add(
        PresetShapeGeometryConfig(geometry="line", position=middle_positions[0])
    )
    line.line.width = 1
    line.line.fill = "#606060"

    left_arrow = slide.shapes.add(
        PresetShapeGeometryConfig(geometry="leftArrow", position=middle_positions[1])
    )
    left_arrow.fill = "#f0f0f0"
    left_arrow.line.width = 1
    left_arrow.line.fill = "#606060"

    right_arrow = slide.shapes.add(
        PresetShapeGeometryConfig(geometry="rightArrow", position=middle_positions[2])
    )
    right_arrow.fill = "#f0f0f0"
    right_arrow.line.width = 1
    right_arrow.line.fill = "#606060"

    up_arrow = slide.shapes.add(
        PresetShapeGeometryConfig(geometry="upArrow", position=middle_positions[3])
    )
    up_arrow.fill = "#f0f0f0"
    up_arrow.line.width = 1
    up_arrow.line.fill = "#606060"

    down_arrow = slide.shapes.add(
        PresetShapeGeometryConfig(geometry="downArrow", position=middle_positions[4])
    )
    down_arrow.fill = "#f0f0f0"
    down_arrow.line.width = 1
    down_arrow.line.fill = "#606060"

    plus = slide.shapes.add(
        PresetShapeGeometryConfig(geometry="plus", position=middle_positions[5])
    )
    plus.fill = "#f0f0f0"
    plus.line.width = 1
    plus.line.fill = "#606060"

    minus = slide.shapes.add(
        PresetShapeGeometryConfig(geometry="mathMinus", position=middle_positions[6])
    )
    minus.fill = "#f0f0f0"
    minus.line.width = 1
    minus.line.fill = "#606060"

    heart = slide.shapes.add(
        PresetShapeGeometryConfig(geometry="heart", position=middle_positions[7])
    )
    heart.fill = "#f0f0f0"
    heart.line.width = 1
    heart.line.fill = "#606060"

    ################################################################################
    ## Diagram nodes + connectors
    # Documentation: ../shapes.spec.md
    ################################################################################

    bottom_y = middle_y + shape_size + vertical_gap
    horizontal_gap = 96
    node_width = 200
    node_height = 120
    total_w = node_width * 3 + horizontal_gap * 2
    start_x = int((slide.frame.width - total_w) / 2)
    bottom_left, bottom_center, bottom_right = [
        BoundingBoxRect(
            left=start_x + i * (node_width + horizontal_gap),
            top=bottom_y,
            width=node_width,
            height=node_height,
        )
        for i in range(3)
    ]

    def _add_node(text: str, position: BoundingBoxRect) -> Shape:
        node = slide.shapes.add(PresetShapeGeometryConfig(geometry="roundRect"))
        node.position = position
        node.fill = "#f0f0f0"
        node.line.width = 1
        node.line.fill = "#606060"
        node.text = text
        node.text.default_text_style = TextStyle()
        node.text.default_text_style.font_size = 18
        node.text.alignment = "center"
        node.text.vertical_alignment = "middle"
        return node

    # Use shapes as nodes. They alsoconnector anchors for the flow.
    data_node = _add_node("Data", bottom_left)
    model_node = _add_node("Model", bottom_center)
    launch_node = _add_node("Launch", bottom_right)

    # Use connectors for real PPTX connections that stay attached when shapes move.
    # fromIdx/toIdx map to connection points defined in ECMA-376 for each shape
    # (e.g., 3=right edge, 1=left edge).
    # Each connector has three main components:
    # - line: the line making up the connector. Must be provided.
    #   - valid "style"values are: "solid", "dashed", "dotted", "dashDot", "dashDotDot"
    # - head: the shape at the beginning of the connector (the "from" side)
    #   - can be set to {"type": "none"} if not needed
    #   - valid "type" values are: "none" | "triangle" | "stealth" | "diamond" | "oval" | "arrow"
    #   - width and length can be set to "sm", "med", "lg"
    # - tail: the shape at the end of the connector (the "to" side)
    #   - can be set to {"type": "none"} if not needed
    #   - valid "type" values are: "none" | "triangle" | "stealth" | "diamond" | "oval" | "arrow"
    #   - width and length can be set to "sm", "med", "lg"
    # In addition, "kind" can be set to "straight", "curved", "elbow"

    # Connector: Data -> Model (first hop in the flow).
    # solid line, no head, arrow tail
    slide.shapes.add(
        {
            "geometry": "connector",
            "kind": "straight",
            "from": data_node,
            "fromIdx": 3,  # right edge
            "to": model_node,
            "toIdx": 1,  # left edge
            "line": {"style": "solid", "fill": "#606060", "width": 2},
            "head": {"type": "none"},
            "tail": {"type": "arrow", "width": "med", "length": "med"},
        }
    )

    # Connector: Model -> Launch (second hop in the flow).
    slide.shapes.add(
        {
            "geometry": "connector",
            "kind": "straight",
            "from": model_node,
            "fromIdx": 3,  # right edge
            "to": launch_node,
            "toIdx": 1,  # left edge
            "line": {"style": "solid", "fill": "#606060", "width": 2},
            "head": {"type": "triangle", "width": "lg", "length": "lg"},
            "tail": {"type": "diamond", "width": "lg", "length": "lg"},
        }
    )


def _add_overlap_detection_slide(presentation: Presentation) -> None:
    slide = presentation.slides.add({"layout": "Title"})
    slide.placeholders.get_item("Title").text = "Overlap detection"

    ################################################################################
    ## Detect and visualize overlap
    # Documentation: ../shapes.spec.md
    ################################################################################

    # Use bounding boxes to detect overlaps.
    first = BoundingBoxRect(left=120.0, top=180.0, width=320.0, height=180.0)
    second = BoundingBoxRect(left=280.0, top=240.0, width=320.0, height=180.0)

    # Use names to disambiguate shapes in prompts and correlate warnings in tests/inspection for overlaps.
    # First box.
    first_box = slide.shapes.add(PresetShapeGeometryConfig(geometry="rect"))
    first_box.name = "Overlap base rectangle: blue"
    first_box.position = first
    first_box.fill = "#88bdf2"
    first_box.line.width = 1
    first_box.line.fill = "#3b6ea5"

    # Second box for overlap detection.
    second_box = slide.shapes.add(PresetShapeGeometryConfig(geometry="rect"))
    second_box.name = "Overlap base rectangle: coral"
    second_box.position = second
    second_box.fill = "#f2a188"
    second_box.line.width = 1
    second_box.line.fill = "#a55b3b"

    # Flag overlapping shapes.
    slide_number = None
    slide_id = slide.id
    for index, candidate in enumerate(presentation.slides.items):
        if candidate.id == slide_id:
            slide_number = index + 1
            break
    overlaps = warn_about_overlaps(slide, slide_number=slide_number, emit=False)
    for overlap in overlaps:
        overlap_box = slide.shapes.add(PresetShapeGeometryConfig(geometry="rect"))
        overlap_box.name = "Overlap highlight: intersection region"
        overlap_box.position = overlap.intersection
        overlap_box.fill = "#ffcc00" if overlap.severity == "warning" else "#ff0000"
        overlap_box.line.width = 1
        overlap_box.line.fill = "#8a6d00" if overlap.severity == "warning" else "#ff0000"
        overlap_box.text.default_text_style = TextStyle()
        overlap_box.text.default_text_style.font_size = 16
        overlap_box.text.alignment = "center"
        overlap_box.text.vertical_alignment = "middle"


def _add_images_slide(presentation: Presentation) -> None:
    slide = presentation.slides.add({"layout": "Title"})
    slide.placeholders.get_item("Title").text = "Images"

    def _add_border_rect(frame: BoundingBoxRect) -> None:
        border = slide.shapes.add(PresetShapeGeometryConfig(geometry="rect"))
        border.position = frame
        border.line.fill = "#606060"
        border.line.width = 2

    def _image_size(path: Path) -> tuple[int, int]:
        with Image.open(path) as img:
            return img.width, img.height

    image_path = Path(__file__).resolve().parent / "tower.jpeg"

    box_size = 240
    gap = 56
    total_w = box_size * 4 + gap * 3
    start_x = int((slide.frame.width - total_w) / 2)

    top_y = 128
    top_1, top_2, top_3, top_4 = [
        BoundingBoxRect(
            left=start_x + i * (box_size + gap), top=top_y, width=box_size, height=box_size
        )
        for i in range(4)
    ]

    ################################################################################
    ## Fit options
    # Documentation: ../images.spec.md
    ################################################################################

    # If no "fit" parameter is provided, the image will be resized to fit the frame.
    # This will NOT preserve the image's aspect ratio.
    slide.images.add({"blob": Blob.load(image_path), "position": top_1})
    _add_border_rect(top_1)

    # With "fit": "contain", the image will be scaled to be fully contained within the frame.
    # This will preserve the image's aspect ratio and avoid cropping. It may leave some space around the image.
    slide.images.add({"blob": Blob.load(image_path), "position": top_2, "fit": "contain"})
    _add_border_rect(top_2)

    # With "fit": "cover", the image will be scaled to fill the frame.
    # This will preserve the image's aspect ratio and may crop the image.
    slide.images.add({"blob": Blob.load(image_path), "position": top_3, "fit": "cover"})
    _add_border_rect(top_3)

    # The fit can also be manually set by cropping the image.
    # In this case, we keep the full width of the image but crop out the top part of the image.
    # We send crop coordinates as fractions of the image dimensions.
    image_w, image_h = _image_size(image_path)
    crop_top = (image_h - image_w) / image_h
    slide.images.add(
        {
            "blob": Blob.load(image_path),
            "position": top_4,
            "crop": {"left": 0, "top": crop_top, "right": 0, "bottom": 0},
        }
    )
    _add_border_rect(top_4)

    bottom_y = top_y + box_size + gap
    bottom_1, bottom_2, _, bottom_4 = [
        BoundingBoxRect(
            left=start_x + i * (box_size + gap), top=bottom_y, width=box_size, height=box_size
        )
        for i in range(4)
    ]

    ################################################################################
    ## Flip options
    # Documentation: ../images.spec.md
    ################################################################################

    # The image can also be flipped horizontally.
    horizontally_flipped_image = slide.images.add(
        {"blob": Blob.load(image_path), "position": bottom_1, "flip_horizontal": True}
    )
    horizontally_flipped_image.flip_horizontal = True
    _add_border_rect(bottom_1)

    # The image can also be flipped vertically.
    vertically_flipped_image = slide.images.add(
        {"blob": Blob.load(image_path), "position": bottom_2, "flip_vertical": True}
    )
    vertically_flipped_image.flip_vertical = True
    _add_border_rect(bottom_2)

    ################################################################################
    ## SVGs
    # Documentation: ../images.spec.md
    ################################################################################

    # In addition to loading images, SVG images can be defined and added directly to the slide.
    triangle_svg = textwrap.dedent("""
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
            <polygon points="32,6 46,56 18,56" fill="#d40b00"/>
        </svg>
    """)
    svg_image = slide.images.add({"blob": Blob(triangle_svg.encode("utf-8"), mime="image/svg+xml")})
    svg_image.frame = bottom_4
    _add_border_rect(bottom_4)


def _add_auto_layout_slide(presentation: Presentation) -> None:
    # Documentation: ../auto-layout.spec.md
    slide = presentation.slides.add({"layout": "Title"})
    slide.placeholders.get_item("Title").text = "Auto Layout"

    def _add_frame(frame: BoundingBoxRect) -> Shape:
        border = slide.shapes.add(PresetShapeGeometryConfig(geometry="rect"))
        border.position = frame
        border.line.width = 1
        border.line.fill = "#606060"
        return border

    def _add_shape(size: float) -> Shape:
        box = slide.shapes.add(PresetShapeGeometryConfig(geometry="rect"))
        box.fill = "#4444ff"
        box.position.width = size * 3
        box.position.height = size
        box.line.width = 2
        return box

    def _add_shapes(sizes: list[float]) -> list[Shape]:
        return [_add_shape(size) for size in sizes]

    vertical_frame_w = 144
    vertical_frame_h = 128
    frame_gap = 36
    top_y = 144
    left_x = 60

    # Shapes can be arranged in a vertical direction using auto layout with AutoLayoutDirection.vertical.
    # The align parameter controls the alignment of the shapes within the frame. Vertical/horizontal padding
    # controls the amount of space between the shapes and the frame edges. Vertical/horizontal gap controls
    # the amount of space between the shapes.
    # Vertical gap _must_ be specified for vertical layout.
    frame = _add_frame(
        BoundingBoxRect(left=left_x, top=top_y, width=vertical_frame_w, height=vertical_frame_h)
    )
    frame.name = "Vertical auto-layout frame: top-left align"
    shapes = _add_shapes([12, 16, 9])
    shapes[0].name = "Vertical layout: top-left (size 12)"
    shapes[1].name = "Vertical layout: top-left (size 16)"
    shapes[2].name = "Vertical layout: top-left (size 9)"
    slide.auto_layout(
        shapes,
        AutoLayoutOptions(
            frame=frame,
            direction=AutoLayoutDirection.vertical,
            align=AutoLayoutAlign.topLeft,
            vertical_padding=10,
            horizontal_padding=10,
            vertical_gap=10,
        ),
    )

    # If the shapes are too large, they may overflow the frame. They will preserve their alignment with
    # respect to the frame.
    frame = _add_frame(
        BoundingBoxRect(
            left=left_x + vertical_frame_w + frame_gap,
            top=top_y,
            width=vertical_frame_w,
            height=vertical_frame_h,
        )
    )
    frame.name = "Vertical auto-layout frame: top-center align"
    shapes = _add_shapes([33, 19, 52])
    shapes[0].name = "Vertical layout: top-center (size 33)"
    shapes[1].name = "Vertical layout: top-center (size 19)"
    shapes[2].name = "Vertical layout: top-center (size 52)"
    slide.auto_layout(
        shapes,
        AutoLayoutOptions(
            frame=frame,
            direction=AutoLayoutDirection.vertical,
            align=AutoLayoutAlign.topCenter,
            vertical_padding=10,
            horizontal_padding=10,
            vertical_gap=10,
        ),
    )

    # The frame being used doesn't need to be a shape. It can be the whole slide, or an arbitrary bounding box.
    frame = AutoLayoutFrame(
        left=left_x + vertical_frame_w * 2 + frame_gap * 2,
        top=top_y,
        width=vertical_frame_w,
        height=vertical_frame_h,
    )
    shapes = _add_shapes([7, 14, 51])
    shapes[0].name = "Vertical layout: top-right (size 7)"
    shapes[1].name = "Vertical layout: top-right (size 14)"
    shapes[2].name = "Vertical layout: top-right (size 51)"
    slide.auto_layout(
        shapes,
        AutoLayoutOptions(
            frame=frame,
            direction=AutoLayoutDirection.vertical,
            align=AutoLayoutAlign.topRight,
            vertical_padding=10,
            horizontal_padding=10,
            vertical_gap=10,
        ),
    )

    # Content may also be aligned to the bottom of the frame.
    frame = _add_frame(
        BoundingBoxRect(
            left=left_x,
            top=top_y + vertical_frame_h + frame_gap,
            width=vertical_frame_w,
            height=vertical_frame_h,
        )
    )
    frame.name = "Vertical auto-layout frame: bottom-left align"
    shapes = _add_shapes([8, 33, 5])
    shapes[0].name = "Vertical layout: bottom-left (size 8)"
    shapes[1].name = "Vertical layout: bottom-left (size 33)"
    shapes[2].name = "Vertical layout: bottom-left (size 5)"
    slide.auto_layout(
        shapes,
        AutoLayoutOptions(
            frame=frame,
            direction=AutoLayoutDirection.vertical,
            align=AutoLayoutAlign.bottomLeft,
            vertical_padding=10,
            horizontal_padding=10,
            vertical_gap=10,
        ),
    )

    frame = _add_frame(
        BoundingBoxRect(
            left=left_x + vertical_frame_w + frame_gap,
            top=top_y + vertical_frame_h + frame_gap,
            width=vertical_frame_w,
            height=vertical_frame_h,
        )
    )
    frame.name = "Vertical auto-layout frame: bottom-center align"
    shapes = _add_shapes([8, 8, 8])
    shapes[0].name = "Vertical layout: bottom-center (first in order, size 8)"
    shapes[1].name = "Vertical layout: bottom-center (second in order, size 8)"
    shapes[2].name = "Vertical layout: bottom-center (third in order, size 8)"
    slide.auto_layout(
        shapes,
        AutoLayoutOptions(
            frame=frame,
            direction=AutoLayoutDirection.vertical,
            align=AutoLayoutAlign.bottomCenter,
            vertical_padding=10,
            horizontal_padding=10,
            vertical_gap=10,
        ),
    )

    # When aligned to bottom, the shapes may overflow from the top of the frame.
    frame = _add_frame(
        BoundingBoxRect(
            left=left_x + vertical_frame_w * 2 + frame_gap * 2,
            top=top_y + vertical_frame_h + frame_gap,
            width=vertical_frame_w,
            height=vertical_frame_h,
        )
    )
    frame.name = "Vertical auto-layout frame: bottom-right align"
    shapes = _add_shapes([50, 20, 40])
    shapes[0].name = "Vertical layout: bottom-right (size 50)"
    shapes[1].name = "Vertical layout: bottom-right (size 20)"
    shapes[2].name = "Vertical layout: bottom-right (size 40)"
    slide.auto_layout(
        shapes,
        AutoLayoutOptions(
            frame=frame,
            direction=AutoLayoutDirection.vertical,
            align=AutoLayoutAlign.bottomRight,
            vertical_padding=10,
            horizontal_padding=10,
            vertical_gap=10,
        ),
    )

    horizontal_frame_h = 128
    horizontal_frame_w = 256
    left_x = 668
    # Shapes can also be arranged in a horizontal direction using auto layout with AutoLayoutDirection.horizontal.
    # Horizontal gap _must_ be specified for horizontal layout.
    frame = _add_frame(
        BoundingBoxRect(
            left=left_x,
            top=top_y,
            width=horizontal_frame_w,
            height=horizontal_frame_h,
        )
    )
    frame.name = "Horizontal auto-layout frame: top-left align"
    shapes = _add_shapes([12, 16, 9])
    shapes[0].name = "Horizontal layout: top-left (size 12)"
    shapes[1].name = "Horizontal layout: top-left (size 16)"
    shapes[2].name = "Horizontal layout: top-left (size 9)"
    slide.auto_layout(
        shapes,
        AutoLayoutOptions(
            frame=frame,
            direction=AutoLayoutDirection.horizontal,
            align=AutoLayoutAlign.topLeft,
            vertical_padding=10,
            horizontal_padding=10,
            horizontal_gap=10,
        ),
    )

    frame = _add_frame(
        BoundingBoxRect(
            left=left_x + horizontal_frame_w + frame_gap,
            top=top_y,
            width=horizontal_frame_w,
            height=horizontal_frame_h,
        )
    )
    frame.name = "Horizontal auto-layout frame: top-right align"
    shapes = _add_shapes([22, 6, 39])
    shapes[0].name = "Horizontal layout: top-right (size 22)"
    shapes[1].name = "Horizontal layout: top-right (size 6)"
    shapes[2].name = "Horizontal layout: top-right (size 39)"
    slide.auto_layout(
        shapes,
        AutoLayoutOptions(
            frame=frame,
            direction=AutoLayoutDirection.horizontal,
            align=AutoLayoutAlign.topRight,
            vertical_padding=10,
            horizontal_padding=10,
            horizontal_gap=10,
        ),
    )

    frame = _add_frame(
        BoundingBoxRect(
            left=left_x,
            top=top_y + horizontal_frame_h + frame_gap,
            width=horizontal_frame_w,
            height=horizontal_frame_h,
        )
    )
    frame.name = "Horizontal auto-layout frame: center align"
    shapes = _add_shapes([19, 8, 34])
    shapes[0].name = "Horizontal layout: center (size 19)"
    shapes[1].name = "Horizontal layout: center (size 8)"
    shapes[2].name = "Horizontal layout: center (size 34)"
    slide.auto_layout(
        shapes,
        AutoLayoutOptions(
            frame=frame,
            direction=AutoLayoutDirection.horizontal,
            align=AutoLayoutAlign.center,
            vertical_padding=10,
            horizontal_padding=10,
            horizontal_gap=10,
        ),
    )

    frame = _add_frame(
        BoundingBoxRect(
            left=left_x,
            top=top_y + horizontal_frame_h * 2 + frame_gap * 2,
            width=horizontal_frame_w,
            height=horizontal_frame_h,
        )
    )
    frame.name = "Horizontal auto-layout frame: bottom-left align"
    shapes = _add_shapes([22, 13, 14])
    shapes[0].name = "Horizontal layout: bottom-left (size 22)"
    shapes[1].name = "Horizontal layout: bottom-left (size 13)"
    shapes[2].name = "Horizontal layout: bottom-left (size 14)"
    slide.auto_layout(
        shapes,
        AutoLayoutOptions(
            frame=frame,
            direction=AutoLayoutDirection.horizontal,
            align=AutoLayoutAlign.bottomLeft,
            vertical_padding=10,
            horizontal_padding=10,
            horizontal_gap=10,
        ),
    )

    frame = _add_frame(
        BoundingBoxRect(
            left=left_x + horizontal_frame_w + frame_gap,
            top=top_y + horizontal_frame_h * 2 + frame_gap * 2,
            width=horizontal_frame_w,
            height=horizontal_frame_h,
        )
    )
    frame.name = "Horizontal auto-layout frame: bottom-right align"
    shapes = _add_shapes([25, 25, 33])
    shapes[0].name = "Horizontal layout: bottom-right (size 25)"
    shapes[1].name = "Horizontal layout: bottom-right (size 25)"
    shapes[2].name = "Horizontal layout: bottom-right (size 33)"
    slide.auto_layout(
        shapes,
        AutoLayoutOptions(
            frame=frame,
            direction=AutoLayoutDirection.horizontal,
            align=AutoLayoutAlign.bottomRight,
            vertical_padding=10,
            horizontal_padding=10,
            horizontal_gap=10,
        ),
    )


if __name__ == "__main__":
    presentation = create_presentation()
    PresentationFile.export_pptx(presentation).save("integrated_example.pptx")
