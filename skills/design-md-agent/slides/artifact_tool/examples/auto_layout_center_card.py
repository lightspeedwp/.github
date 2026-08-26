from presentation_artifact_tool import (
    AutoLayoutAlign,
    AutoLayoutOptions,
    PositionConfig,
    Presentation,
    PresentationFile,
    PresetShapeGeometryConfig,
)


def center_card() -> Presentation:
    deck = Presentation.create()
    slide = deck.slides.add()

    card = slide.shapes.add(
        PresetShapeGeometryConfig(
            geometry="rect", position=PositionConfig(left=0, top=0, width=400, height=200)
        )
    )
    card.text = "Executive Summary"
    card.fill = "accent1"

    slide.auto_layout(
        [card],
        AutoLayoutOptions(frame="slide", align=AutoLayoutAlign.center),
    )

    return deck


if __name__ == "__main__":
    presentation = center_card()
    PresentationFile.export_pptx(presentation).save("center_card_presentation.pptx")
