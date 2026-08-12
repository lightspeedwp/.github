from presentation_artifact_tool import (
    AutoLayoutAlign,
    AutoLayoutDirection,
    AutoLayoutFrame,
    AutoLayoutOptions,
    Presentation,
    PresentationFile,
    PresetShapeGeometryConfig,
)


def bottom_right_alignment() -> Presentation:
    deck = Presentation.create()
    slide = deck.slides.add()

    frame = AutoLayoutFrame(left=100, top=100, width=400, height=300)

    callouts = [
        slide.shapes.add(PresetShapeGeometryConfig(geometry="roundRect")),
        slide.shapes.add(PresetShapeGeometryConfig(geometry="roundRect")),
    ]

    callouts[0].text = "Primary CTA"
    callouts[1].text = "Secondary CTA"
    callouts[0].fill = "accent4"
    callouts[1].fill = "accent5"

    for callout in callouts:
        callout.position = {"width": 240, "height": 60}

    slide.auto_layout(
        callouts,
        AutoLayoutOptions(
            direction=AutoLayoutDirection.vertical,
            frame=frame,
            align=AutoLayoutAlign.bottomRight,
            vertical_gap=12,
            horizontal_padding=24,
            vertical_padding=24,
        ),
    )

    return deck


if __name__ == "__main__":
    presentation = bottom_right_alignment()
    PresentationFile.export_pptx(presentation).save("bottom_right_alignment_presentation.pptx")
