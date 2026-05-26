from presentation_artifact_tool import (
    AutoLayoutAlign,
    AutoLayoutDirection,
    AutoLayoutOptions,
    Presentation,
    PresentationFile,
    PresetShapeGeometryConfig,
    ShapePositionConfig,
)


def header_footer_layout() -> Presentation:
    deck = Presentation.create()
    slide = deck.slides.add()

    title = slide.shapes.add(
        PresetShapeGeometryConfig(
            geometry="rect", position=ShapePositionConfig(width=600, height=60)
        )
    )
    subtitle = slide.shapes.add(
        PresetShapeGeometryConfig(
            geometry="rect", position=ShapePositionConfig(width=600, height=40)
        )
    )
    footer = slide.shapes.add(
        PresetShapeGeometryConfig(
            geometry="rect", position=ShapePositionConfig(width=600, height=32)
        )
    )

    title.text = "Weekly Business Review"
    subtitle.text = "Key initiatives and scorecard"
    footer.text = "Confidential • Internal Use Only"

    padding_x = 40
    padding_y = 32
    gap_between_title_and_subtitle = 8

    slide.auto_layout(
        [title, subtitle],
        AutoLayoutOptions(
            direction=AutoLayoutDirection.vertical,
            frame="slide",
            align=AutoLayoutAlign.topLeft,
            horizontal_padding=padding_x,
            vertical_padding=padding_y,
            vertical_gap=gap_between_title_and_subtitle,
        ),
    )

    slide.auto_layout(
        [footer],
        AutoLayoutOptions(
            frame="slide",
            align=AutoLayoutAlign.bottomLeft,
            horizontal_padding=padding_x,
            vertical_padding=padding_y,
        ),
    )

    return deck


if __name__ == "__main__":
    presentation = header_footer_layout()
    PresentationFile.export_pptx(presentation).save("header_footer_layout_presentation.pptx")
